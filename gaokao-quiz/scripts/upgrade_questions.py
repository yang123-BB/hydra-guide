#!/usr/bin/env python3
"""
题库升级脚本：为存量题目补全 6 类标签 + 三层解析 + 纠错字段
读取现有 questions.js / generated/*.js，调用 Agnes AI API 自动补全字段

用法：
  python upgrade_questions.py          # 升级所有题目
  python upgrade_questions.py --dry-run # 仅预览前3道
"""
import os, re, json, time, argparse
from pathlib import Path

# ─── 配置 ───────────────────────────────────────────────────────────────────
API_KEY = "sk-v6zNDE3MExcNzQxY2M2OTQ5ODE5YTYzZTBhMmM5YTExMzczOTQ1MTUxNTg5MzUz"
API_URL = "https://apihub.agnes-ai.com/v1/chat/completions"
MODEL   = "agnes-2.0-flash"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# 科目 → 题型列表
QUESTION_TYPES = {
    "math":    ["single-choice", "multi-choice", "fill-blank", "short-answer", "calculation"],
    "physics":  ["single-choice", "multi-choice", "experiment", "calculation"],
    "chemistry":["single-choice", "fill-blank", "calculation", "comprehensive"],
    "biology": ["single-choice", "fill-blank", "comprehensive"],
    "chinese": ["single-choice", "fill-blank", "reading", "writing"],
    "english": ["single-choice", "cloze", "reading", "writing"],
}

TEACHING_TAGS = ["high-freq", "easy-mistake", "has-image", "calc-easy", "misread-trap", "hard-mother"]

# ─── AI 调用 ───────────────────────────────────────────────────────────────
import urllib.request, ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def ai_chat(system: str, user: str, max_retry: int = 3) -> str:
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user",   "content": user}
        ],
        "temperature": 0.3,
        "max_tokens": 1024,
    }).encode()
    for attempt in range(max_retry):
        try:
            req = urllib.request.Request(API_URL, data=payload, headers=HEADERS, method="POST")
            with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
                data = json.loads(resp.read())
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"  ⚠ AI调用失败(第{attempt+1}次): {e}")
            time.sleep(2 * (attempt + 1))
    return ""

# ─── 核心：为单道题生成标签 + 三层解析 ─────────────────────────────────
def upgrade_question(q: dict, subject: str) -> dict:
    qid   = q.get("id", "unknown")
    content = q.get("content", "")[:200]   # 截断避免 prompt 过长
    qtype  = q.get("type", "single-choice")
    difficulty = q.get("difficulty", 2)
    pointId = q.get("pointId", "")
    explanation = q.get("explanation", "")

    system = """你是高考题库编辑专家。根据题目信息，输出严格的 JSON（不要加```）。
必须包含以下字段（都是中文输出）：
1. "examArea":      数组，元素取自 ["new1","new2","old1","old2"]，新高考I/II卷或旧全国甲/乙卷
2. "questionType":  字符串，单选=single-choice，多选=multi-choice，填空=fill-blank，解答=short-answer，计算=calcuation
3. "difficultyStars": 整数1-5（1★基础…5★★★★★压轴），与原有difficulty字段对应
4. "source":       字符串，取自 ["gaokao","mock","monthly","quiz","variation"]，分别对应高考真题/模拟卷/月考/联考/变式题
5. "year":         整数或null，若是真题填年份(2016-2026)，否则null
6. "teachingTags": 数组，元素取自 ["high-freq","easy-mistake","has-image","calc-easy","misread-trap","hard-mother"]
7. "scoring":      字符串，高考阅卷分步采分点（若无则输出"本题无分步采分"）
8. "tips":         字符串，易错陷阱+解题切入点+同类题模板（若无则输出"注意计算准确"）
9. "errorTypes":   数组，若题目可能有问题，元素取自 ["answer-wrong","formula-bad","ambiguous","out-of-syllabus","explanation-bad","image-bad"]，否则[]
"""
    user = f"""题目ID: {qid}
科目: {subject}
知识点: {pointId}
题型: {qtype}
难度: {difficulty}/5
题干: {content}
原有解析: {explanation[:300]}

请输出 JSON。"""

    raw = ai_chat(system, user)
    # 解析 JSON
    result = {}
    try:
        # 提取 JSON（可能被 ```json ... ``` 包裹）
        m = re.search(r'\{[\s\S]*\}', raw)
        if m:
            result = json.loads(m.group())
    except Exception:
        print(f"  ⚠ {qid}: AI返回解析失败，使用默认值")

    # 构建升级后的题目
    upgraded = {**q}
    # 确保 subject 字段
    if "subject" not in upgraded:
        upgraded["subject"] = subject

    # 6 类标签
    tags = {
        "examArea":       result.get("examArea", ["new1"]),
        "questionType":    result.get("questionType", qtype),
        "difficultyStars": result.get("difficultyStars", difficulty),
        "source":          result.get("source", "variation"),
        "year":            result.get("year", None),
        "teachingTags":    result.get("teachingTags", []),
    }
    upgraded["tags"] = tags

    # 三层解析
    upgraded["explanationLayers"] = {
        "standard": explanation,
        "scoring":  result.get("scoring", "本题无分步采分"),
        "tips":     result.get("tips",    "注意计算准确"),
    }
    # 保留 explanation 字段兼容
    upgraded["explanation"] = explanation

    # 纠错字段
    upgraded["errorReported"] = False
    upgraded["errorTypes"]    = result.get("errorTypes", [])

    return upgraded

# ─── 解析 JS 文件提取题目数组 ───────────────────────────────────────────
def extract_questions_from_js(filepath: str) -> list:
    """从 JS 文件中提取 questions 数组（简单正则解析，非完整 AST）"""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    # 找到 export const XXX = [ ... ] 之间的内容
    pattern = r"export\s+const\s+\w+\s*=\s*(\[[\s\S]*?\])\s*(?:export|import|$)"
    m = re.search(pattern, content)
    if not m:
        print(f"  ⚠ 无法解析文件: {filepath}")
        return []
    try:
        # 将 JS 对象转为 Python 字典（简单替换）
        js_str = m.group(1)
        # 替换 JS 特有语法
        js_str = re.sub(r'//.*', '', js_str)          # 删除注释
        js_str = js_str.replace("'", '"').replace("`", '"')  # 单引号→双引号
        # 键名加引号
        js_str = re.sub(r'(\w+):', r'"\1":', js_str)
        # 删除尾逗号
        js_str = re.sub(r',\s*([}\]])', r'\1', js_str)
        questions = json.loads(js_str)
        return questions
    except Exception as e:
        print(f"  ⚠ JSON解析失败: {e}")
        return []

def js_stringify(obj, indent: int = 0) -> str:
    """将 Python 对象转为 JS 字面量字符串"""
    pad = "  " * indent
    if isinstance(obj, dict):
        items = []
        for k, v in obj.items():
            items.append(f"{pad}  {k}: {js_stringify(v, indent+1)}")
        return "{\n" + ",\n".join(items) + f"\n{pad}}}"
    elif isinstance(obj, list):
        if not obj:
            return "[]"
        items = [f"{pad}  {js_stringify(v, indent+1)}" for v in obj]
        return "[\n" + ",\n".join(items) + f"\n{pad}]"
    elif isinstance(obj, str):
        # 转义反斜杠和引号
        s = obj.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
        return f'"{s}"'
    elif isinstance(obj, bool):
        return "true" if obj else "false"
    elif obj is None:
        return "null"
    else:
        return str(obj)

def write_questions_js(filepath: str, var_name: str, questions: list, subject: str):
    """将升级后的题目写回 JS 文件"""
    lines = []
    lines.append(f"""/**f
 * 高考{subject}题库（已升级标签体系）
 * 由 upgrade_questions.py 自动升级
 */""")
    lines.append("")
    lines.append(f"export const {var_name} = [")
    for q in questions:
        lines.append("  {")
        for k, v in q.items():
            if k in ("explanationLayers", "tags"):
                # 嵌套对象特殊格式化
                lines.append(f"    {k}: {js_stringify(v, 2)},")
            else:
                lines.append(f"    {k}: {js_stringify(v, 2)},")
        lines.append("  },")
    lines.append("]")
    lines.append("")
    # 也写 getQuestion 辅助函数
    lines.append(f"export function getQuestion(id) {{")
    lines.append(f"  return {var_name}.find(q => q.id === id)")
    lines.append(f"}}")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  ✓ 已写入 {filepath} ({len(questions)} 题)")

# ─── 主流程 ─────────────────────────────────────────────────────────────────
def process_file(filepath: str, subject: str, var_name: str, dry_run: bool = False):
    print(f"\n📂 处理文件: {filepath}")
    questions = extract_questions_from_js(filepath)
    if not questions:
        return
    print(f"    读取到 {len(questions)} 道题")

    upgraded = []
    for i, q in enumerate(questions):
        qid = q.get("id", f"#{i}")
        print(f"  [{i+1}/{len(questions)}] 升级 {qid}...", end=" ", flush=True)
        if dry_run:
            print("(dry-run 跳过)")
            upgraded.append(q)
            continue
        uq = upgrade_question(q, subject)
        upgraded.append(uq)
        print("✓")
        time.sleep(0.5)   # 避免 API 限流

    if not dry_run:
        write_questions_js(filepath, var_name, upgraded, subject)
    else:
        print("  (dry-run 模式，未写入文件)")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="仅预览前3道，不写入")
    parser.add_argument("--file", type=str, default=None, help="仅处理指定 JS 文件")
    args = parser.parse_args()

    project_root = Path(__file__).parent.parent / "src" / "data"
    files = []
    if args.file:
        files = [(args.file, "math", "questions")]
    else:
        # 原始题库
        files.append((project_root / "questions.js",           "math",    "questions"))
        files.append((project_root / "physicsQuestions.js",     "physics",  "physicsQuestions"))
        files.append((project_root / "chemistryQuestions.js",   "chemistry","chemistryQuestions"))
        files.append((project_root / "biologyQuestions.js",     "biology",  "biologyQuestions"))
        files.append((project_root / "chineseQuestions.js",     "chinese",  "chineseQuestions"))
        files.append((project_root / "englishQuestions.js",      "english",  "englishQuestions"))
        # generated 目录
        gen_dir = project_root / "generated"
        if gen_dir.exists():
            for f in gen_dir.glob("*.js"):
                subj = f.stem.replace("GeneratedQuestions", "").lower()
                var  = f.stem[0].lower() + f.stem[1:]
                files.append((f, subj, var))

    for fp, subj, vname in files:
        if not Path(fp).exists():
            print(f"⚠ 文件不存在: {fp}")
            continue
        process_file(str(fp), subj, vname, dry_run=args.dry_run)
        if args.dry_run:
            break   # dry-run 只处理第一个文件

    print("\n✅ 全部处理完成")

if __name__ == "__main__":
    main()
