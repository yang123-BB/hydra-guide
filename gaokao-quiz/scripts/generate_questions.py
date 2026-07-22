#!/usr/bin/env python3
"""
高考题目批量生成脚本
使用 Agnes AI API (agnes-2.0-flash) 按知识点模块批量生成高考选择题
输出 JSON 文件，可转换为 JS 题库格式

用法:
  python generate_questions.py --subject math --count 30
  python generate_questions.py --subject all --count 30
  python generate_questions.py --subject physics --count 20 --output generated.json
"""

import os
import sys
import json
import time
import re
import argparse
from typing import Optional

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Add Agnes AI skill scripts to path
AGNES_SCRIPTS = os.path.expanduser("~/.workbuddy/skills/agnes-ai-api/scripts")
sys.path.insert(0, AGNES_SCRIPTS)

from agnes_api import chat_completion

# ──────────────────── 各科目知识点定义 ────────────────────

SUBJECTS = {
    'math': {
        'name': '数学',
        'id_prefix': 'q',
        'start_id': 51,
        'subject_id': 'math',
        'modules': [
            {'id': 'sets-logic', 'name': '集合与逻辑', 'points': [
                {'id': 'set-concept', 'name': '集合的概念与表示'},
                {'id': 'set-operations', 'name': '集合间的基本关系与运算'},
                {'id': 'logic', 'name': '充分条件与必要条件'},
            ]},
            {'id': 'function-derivative', 'name': '函数与导数', 'points': [
                {'id': 'func-properties', 'name': '函数的概念与性质（单调性、奇偶性、周期性）'},
                {'id': 'basic-functions', 'name': '基本初等函数（指数、对数、幂函数）'},
                {'id': 'func-application', 'name': '函数的图象与应用'},
                {'id': 'derivative-calc', 'name': '导数的运算与几何意义'},
                {'id': 'derivative-monotonicity', 'name': '利用导数研究单调性与极值'},
                {'id': 'derivative-application', 'name': '导数综合应用（不等式恒成立、零点）'},
            ]},
            {'id': 'triangle', 'name': '三角与解三角形', 'points': [
                {'id': 'trig-formulas', 'name': '三角恒等变换'},
                {'id': 'trig-images', 'name': '三角函数的图象与性质'},
                {'id': 'law-of-sines', 'name': '正弦定理'},
                {'id': 'law-of-cosines', 'name': '余弦定理'},
                {'id': 'triangle-app', 'name': '解三角形综合应用'},
            ]},
            {'id': 'sequence', 'name': '数列', 'points': [
                {'id': 'sequence-concept', 'name': '数列的概念与通项公式'},
                {'id': 'arithmetic', 'name': '等差数列'},
                {'id': 'geometric', 'name': '等比数列'},
                {'id': 'sequence-sum', 'name': '数列求和（裂项、错位相减）'},
            ]},
            {'id': 'vector', 'name': '平面向量', 'points': [
                {'id': 'vector-operations', 'name': '向量的线性运算与坐标表示'},
                {'id': 'dot-product', 'name': '向量的数量积及其应用'},
            ]},
            {'id': 'solid-geometry', 'name': '立体几何', 'points': [
                {'id': 'space-positions', 'name': '空间线面位置关系'},
                {'id': 'space-angles', 'name': '空间角与距离'},
                {'id': 'space-vectors', 'name': '空间向量及其应用'},
                {'id': 'solid-bodies', 'name': '空间几何体的表面积与体积'},
            ]},
            {'id': 'analytic-geometry', 'name': '解析几何', 'points': [
                {'id': 'line-circle', 'name': '直线与圆'},
                {'id': 'ellipse', 'name': '椭圆'},
                {'id': 'hyperbola', 'name': '双曲线'},
                {'id': 'parabola', 'name': '抛物线'},
                {'id': 'conic-synthesis', 'name': '圆锥曲线综合'},
            ]},
            {'id': 'probability-statistics', 'name': '概率与统计', 'points': [
                {'id': 'probability-basics', 'name': '概率基础与古典概型'},
                {'id': 'conditional-probability', 'name': '条件概率与全概率公式'},
                {'id': 'random-variables', 'name': '随机变量及其分布'},
                {'id': 'statistics', 'name': '统计与统计分析'},
            ]},
            {'id': 'counting-inequality', 'name': '计数原理与不等式', 'points': [
                {'id': 'permutation-combination', 'name': '排列与组合'},
                {'id': 'binomial-theorem', 'name': '二项式定理'},
                {'id': 'inequality', 'name': '不等式性质与求解'},
            ]},
        ],
    },
    'physics': {
        'name': '物理',
        'id_prefix': 'p',
        'start_id': 36,
        'subject_id': 'physics',
        'modules': [
            {'id': 'kinematics', 'name': '质点运动学', 'points': [
                {'id': 'uniform-accelerated', 'name': '匀变速直线运动规律'},
                {'id': 'free-fall', 'name': '自由落体运动'},
                {'id': 'projectile-motion', 'name': '抛体运动'},
            ]},
            {'id': 'newton-laws', 'name': '力与牛顿运动定律', 'points': [
                {'id': 'three-forces', 'name': '受力分析与摩擦力'},
                {'id': 'newton-second-law', 'name': '牛顿第二定律及应用'},
                {'id': 'newton-third-law', 'name': '牛顿第三定律与整体隔离法'},
            ]},
            {'id': 'circular-motion', 'name': '曲线运动与万有引力', 'points': [
                {'id': 'circular-motion', 'name': '圆周运动向心力'},
                {'id': 'gravitation', 'name': '万有引力与卫星运动'},
            ]},
            {'id': 'work-energy', 'name': '机械能与功', 'points': [
                {'id': 'work-kinetic-energy', 'name': '功与动能定理'},
                {'id': 'mechanical-energy', 'name': '机械能守恒定律'},
            ]},
            {'id': 'momentum', 'name': '动量与碰撞', 'points': [
                {'id': 'momentum-theorem', 'name': '动量定理'},
                {'id': 'momentum-conservation', 'name': '动量守恒定律'},
            ]},
            {'id': 'electrostatics', 'name': '静电场', 'points': [
                {'id': 'coulomb-law', 'name': '库仑定律与电场强度'},
                {'id': 'electric-potential', 'name': '电势能与电势'},
                {'id': 'capacitor', 'name': '电容器与带电粒子运动'},
            ]},
            {'id': 'dc-circuit', 'name': '恒定电流', 'points': [
                {'id': 'ohm-law', 'name': '欧姆定律与电路分析'},
                {'id': 'power-circuit', 'name': '电功率与实验'},
            ]},
            {'id': 'magnetism', 'name': '磁场', 'points': [
                {'id': 'lorentz-force', 'name': '安培力与洛伦兹力'},
                {'id': 'charged-particle-magnet', 'name': '带电粒子在磁场中运动'},
            ]},
            {'id': 'em-induction', 'name': '电磁感应', 'points': [
                {'id': 'faraday-law', 'name': '法拉第电磁感应定律'},
                {'id': 'lenz-law', 'name': '楞次定律与自感'},
            ]},
            {'id': 'thermodynamics', 'name': '热学', 'points': [
                {'id': 'ideal-gas', 'name': '理想气体状态方程'},
                {'id': 'heat-transfer', 'name': '热力学定律'},
            ]},
            {'id': 'optics-atom', 'name': '光学与原子物理', 'points': [
                {'id': 'geometric-optics', 'name': '几何光学与光的波动性'},
                {'id': 'modern-physics', 'name': '原子结构与玻尔模型'},
            ]},
            {'id': 'experiments', 'name': '物理实验', 'points': [
                {'id': 'mechanics-exp', 'name': '力学实验'},
                {'id': 'electricity-exp', 'name': '电学实验'},
            ]},
        ],
    },
    'chemistry': {
        'name': '化学',
        'id_prefix': 'c',
        'start_id': 33,
        'subject_id': 'chemistry',
        'modules': [
            {'id': 'stoichiometry', 'name': '化学计量与化学方程式', 'points': [
                {'id': 'amount-of-substance', 'name': '物质的量与阿伏加德罗常数'},
                {'id': 'gas-molar-volume', 'name': '气体摩尔体积'},
                {'id': 'concentration', 'name': '物质的量浓度'},
                {'id': 'equation-balancing', 'name': '化学方程式配平与计算'},
            ]},
            {'id': 'ionic-redox', 'name': '离子反应与氧化还原', 'points': [
                {'id': 'ionic-equation', 'name': '离子方程式书写与判断'},
                {'id': 'ion-coexistence', 'name': '离子共存判断'},
                {'id': 'redox-concepts', 'name': '氧化还原基本概念'},
                {'id': 'redox-balancing', 'name': '氧化还原方程式配平'},
            ]},
            {'id': 'metals', 'name': '金属及其化合物', 'points': [
                {'id': 'sodium-compounds', 'name': '钠及其化合物'},
                {'id': 'aluminum-compounds', 'name': '铝及其化合物'},
                {'id': 'iron-compounds', 'name': '铁及其化合物'},
            ]},
            {'id': 'nonmetals', 'name': '非金属及其化合物', 'points': [
                {'id': 'halogen', 'name': '卤族元素'},
                {'id': 'sulfur-nitrogen', 'name': '硫和氮的化合物'},
            ]},
            {'id': 'structure-properties', 'name': '物质结构与性质', 'points': [
                {'id': 'atomic-structure', 'name': '原子结构与元素周期律'},
                {'id': 'chemical-bonds', 'name': '化学键与分子间作用力'},
            ]},
            {'id': 'reaction-energy', 'name': '化学反应与能量', 'points': [
                {'id': 'reaction-rate', 'name': '化学反应速率'},
                {'id': 'chemical-equilibrium', 'name': '化学平衡与移动'},
            ]},
            {'id': 'solution', 'name': '水溶液中的离子平衡', 'points': [
                {'id': 'weak-electrolyte', 'name': '弱电解质的电离'},
                {'id': 'salt-hydrolysis', 'name': '盐类的水解'},
            ]},
            {'id': 'organic', 'name': '有机化学基础', 'points': [
                {'id': 'hydrocarbons', 'name': '烃的结构与性质'},
                {'id': 'oxygen-compounds', 'name': '烃的含氧衍生物'},
            ]},
        ],
    },
    'biology': {
        'name': '生物',
        'id_prefix': 'b',
        'start_id': 33,
        'subject_id': 'biology',
        'modules': [
            {'id': 'cell-molecules', 'name': '细胞的分子组成', 'points': [
                {'id': 'protein', 'name': '蛋白质的结构与功能'},
                {'id': 'nucleic-acid', 'name': '核酸的种类与功能'},
                {'id': 'sugar-lipid', 'name': '糖类与脂质'},
                {'id': 'water-inorganic-salt', 'name': '水与无机盐'},
            ]},
            {'id': 'cell-structure', 'name': '细胞的结构与功能', 'points': [
                {'id': 'cell-membrane', 'name': '细胞膜的结构与功能'},
                {'id': 'organelles', 'name': '细胞器的结构与功能'},
                {'id': 'nucleus', 'name': '细胞核的结构与功能'},
            ]},
            {'id': 'cell-metabolism', 'name': '细胞的代谢', 'points': [
                {'id': 'enzyme-atp', 'name': '酶与ATP'},
                {'id': 'cellular-respiration', 'name': '细胞呼吸'},
                {'id': 'photosynthesis', 'name': '光合作用'},
            ]},
            {'id': 'cell-cycle', 'name': '细胞的生命历程', 'points': [
                {'id': 'mitosis', 'name': '有丝分裂'},
                {'id': 'cell-differentiation', 'name': '细胞分化与凋亡'},
            ]},
            {'id': 'genetics-molecular', 'name': '遗传的分子基础', 'points': [
                {'id': 'dna-as-genetic-material', 'name': 'DNA是主要遗传物质'},
                {'id': 'gene-expression', 'name': '基因的表达'},
            ]},
            {'id': 'genetics-laws', 'name': '遗传的基本规律', 'points': [
                {'id': 'mendel-laws', 'name': '孟德尔遗传定律'},
                {'id': 'variation', 'name': '生物的变异'},
            ]},
            {'id': 'homeostasis', 'name': '稳态与调节', 'points': [
                {'id': 'neuro-regulation', 'name': '神经调节'},
                {'id': 'hormone-regulation', 'name': '体液调节'},
                {'id': 'immune-regulation', 'name': '免疫调节'},
            ]},
        ],
    },
    'chinese': {
        'name': '语文',
        'id_prefix': 'ch',
        'start_id': 31,
        'subject_id': 'chinese',
        'modules': [
            {'id': 'language-usage', 'name': '语言文字运用', 'points': [
                {'id': 'pronunciation', 'name': '字音辨析'},
                {'id': 'characters', 'name': '字形辨析'},
                {'id': 'idioms', 'name': '成语运用'},
                {'id': 'sentence-errors', 'name': '病句辨析与修改'},
                {'id': 'rhetoric', 'name': '修辞手法与表达技巧'},
            ]},
            {'id': 'classical-chinese', 'name': '文言文阅读', 'points': [
                {'id': 'classical-words', 'name': '文言实词与虚词'},
                {'id': 'classical-grammar', 'name': '文言特殊句式'},
                {'id': 'classical-translation', 'name': '文言文翻译'},
                {'id': 'classical-comprehension', 'name': '文言文内容理解'},
            ]},
            {'id': 'poetry', 'name': '古诗词鉴赏', 'points': [
                {'id': 'poetry-appreciation', 'name': '诗歌形象与情感'},
                {'id': 'poetry-techniques', 'name': '诗歌表达技巧'},
            ]},
            {'id': 'modern-reading', 'name': '现代文阅读', 'points': [
                {'id': 'practical-reading', 'name': '实用类文本阅读'},
                {'id': 'literary-reading', 'name': '文学类文本阅读'},
            ]},
            {'id': 'literature', 'name': '文学常识与默写', 'points': [
                {'id': 'literary-knowledge', 'name': '文学常识'},
                {'id': 'recitation', 'name': '名句名篇默写'},
            ]},
            {'id': 'composition', 'name': '作文', 'points': [
                {'id': 'writing-materials', 'name': '材料作文审题立意'},
                {'id': 'writing-structure', 'name': '议论文结构与论证'},
            ]},
        ],
    },
    'english': {
        'name': '英语',
        'id_prefix': 'e',
        'start_id': 31,
        'subject_id': 'english',
        'modules': [
            {'id': 'grammar', 'name': 'Grammar 语法', 'points': [
                {'id': 'tense-voice', 'name': 'Tense & Voice 时态与语态'},
                {'id': 'non-finite', 'name': 'Non-finite Verbs 非谓语动词'},
                {'id': 'clauses', 'name': 'Clauses 从句（定/状/名）'},
                {'id': 'modal-virtual', 'name': 'Modal Verbs & Subjunctive 情态动词与虚拟语气'},
            ]},
            {'id': 'vocabulary', 'name': 'Vocabulary 词汇', 'points': [
                {'id': 'word-discrimination', 'name': 'Word Discrimination 词语辨析'},
                {'id': 'phrases', 'name': 'Phrases & Collocations 固定搭配与短语'},
                {'id': 'word-formation', 'name': 'Word Formation 构词法'},
            ]},
            {'id': 'cloze', 'name': 'Cloze Test 完形填空', 'points': [
                {'id': 'cloze-logic', 'name': '完形填空逻辑推理'},
                {'id': 'cloze-vocabulary', 'name': '完形填空词汇辨析'},
            ]},
            {'id': 'reading', 'name': 'Reading Comprehension 阅读理解', 'points': [
                {'id': 'reading-detail', 'name': '细节理解题'},
                {'id': 'reading-inference', 'name': '推理判断题'},
                {'id': 'reading-main-idea', 'name': '主旨大意题'},
            ]},
            {'id': 'seven-five', 'name': 'Seven-Choose-Five 七选五', 'points': [
                {'id': 'seven-five-skills', 'name': '七选五解题技巧'},
            ]},
            {'id': 'writing', 'name': 'Writing 书面表达', 'points': [
                {'id': 'writing-email', 'name': '应用文写作（邮件/信件）'},
                {'id': 'writing-continuation', 'name': '读后续写'},
            ]},
        ],
    },
}


def build_prompt(subject_name: str, module: dict, questions_per_module: int) -> str:
    """构建生成题目的 prompt"""
    points_desc = "\n".join([f"  - {p['id']}: {p['name']}" for p in module['points']])
    is_science = subject_name in ('数学', '物理', '化学', '生物')
    formula_note = "数学/物理/化学公式用 LaTeX 格式，用 $...$ 包裹" if is_science else ""

    prompt = f"""你是资深高考{subject_name}命题专家。请为以下模块生成 {questions_per_module} 道高考{subject_name}单项选择题。

模块：{module['name']}（模块ID: {module['id']}）
知识点：
{points_desc}

要求：
1. 每道题4个选项（A/B/C/D），只有一个正确答案
2. 难度1-5（1最易，5最难），请覆盖不同难度
3. 题目要贴近真实高考风格，有区分度
4. {formula_note}
5. 解析要详细，说明推理过程和易错点
6. 每道题的 pointId 必须从上面列出的知识点ID中选择

严格输出以下 JSON 数组格式（不要输出任何其他内容）：
[
  {{
    "module": "{module['id']}",
    "pointId": "知识点ID",
    "type": "single-choice",
    "difficulty": 1,
    "content": "题干内容",
    "options": ["选项A内容", "选项B内容", "选项C内容", "选项D内容"],
    "answer": 0,
    "explanation": "详细解析"
  }}
]

注意：answer 是正确选项的索引（0=A, 1=B, 2=C, 3=D）。"""
    return prompt


def extract_json(text: str) -> list:
    """从 API 响应中提取 JSON 数组，多策略容错"""
    text = text.strip()

    # Strategy 1: Remove markdown code blocks then parse
    cleaned = re.sub(r'^```(?:json)?\s*\n?', '', text)
    cleaned = re.sub(r'\n?```\s*$', '', cleaned).strip()
    try:
        data = json.loads(cleaned)
        if isinstance(data, list):
            return data
    except json.JSONDecodeError:
        pass

    # Strategy 2: Regex find JSON array (greedy, gets the outermost [])
    # Find the first [ and the last ]
    first_bracket = cleaned.find('[')
    last_bracket = cleaned.rfind(']')
    if first_bracket != -1 and last_bracket != -1 and last_bracket > first_bracket:
        json_str = cleaned[first_bracket:last_bracket + 1]
        try:
            data = json.loads(json_str)
            if isinstance(data, list):
                return data
        except json.JSONDecodeError:
            # Strategy 3: Fix common JSON issues
            # Remove trailing commas before } or ]
            fixed = re.sub(r',\s*([}\]])', r'\1', json_str)
            # Fix unescaped newlines in strings
            try:
                data = json.loads(fixed)
                if isinstance(data, list):
                    return data
            except json.JSONDecodeError:
                pass

    # Strategy 4: Try to parse individual JSON objects
    objects = re.findall(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', cleaned)
    if objects:
        results = []
        for obj_str in objects:
            try:
                obj = json.loads(obj_str)
                results.append(obj)
            except json.JSONDecodeError:
                # Try fixing trailing commas
                fixed = re.sub(r',\s*([}\]])', r'\1', obj_str)
                try:
                    obj = json.loads(fixed)
                    results.append(obj)
                except json.JSONDecodeError:
                    pass
        if results:
            return results

    return []


def validate_question(q: dict, module_id: str) -> bool:
    """验证题目格式是否正确"""
    required = ['content', 'options', 'answer', 'explanation']
    for field in required:
        if field not in q:
            return False
    if not isinstance(q.get('options'), list) or len(q.get('options', [])) != 4:
        return False
    if not isinstance(q.get('answer'), int) or q['answer'] < 0 or q['answer'] > 3:
        return False
    if not q.get('content') or not q.get('explanation'):
        return False
    return True


def generate_for_subject(subject_key: str, total_count: int) -> list:
    """为一个科目生成题目"""
    subject = SUBJECTS[subject_key]
    subject_name = subject['name']
    subject_id = subject['subject_id']
    id_prefix = subject['id_prefix']
    next_id = subject['start_id']

    modules = subject['modules']
    # Distribute questions across modules
    per_module = max(3, total_count // len(modules))

    all_questions = []
    total_modules = len(modules)

    for i, module in enumerate(modules):
        print(f"\n[{subject_name}] 模块 {i+1}/{total_modules}: {module['name']} (生成 {per_module} 题)")

        max_retries = 2
        for attempt in range(max_retries + 1):
            try:
                prompt = build_prompt(subject_name, module, per_module)
                result = chat_completion(
                    model="agnes-2.0-flash",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.8,
                )
                content = result["choices"][0]["message"]["content"]
                questions = extract_json(content)

                if not questions:
                    if attempt < max_retries:
                        print(f"  ⚠ 第 {attempt+1} 次解析失败，重试...")
                        time.sleep(2)
                        continue
                    print(f"  ✗ 模块 {module['name']} 生成失败，跳过")
                    break

                valid_count = 0
                for q in questions:
                    if not validate_question(q, module['id']):
                        continue
                    # Ensure module and type are set
                    q['module'] = module['id']
                    q['type'] = q.get('type', 'single-choice')
                    if 'pointId' not in q or not q['pointId']:
                        q['pointId'] = module['points'][0]['id']
                    # Assign ID
                    q['id'] = f"{id_prefix}{next_id:03d}"
                    q['subject'] = subject_id
                    next_id += 1
                    all_questions.append(q)
                    valid_count += 1

                print(f"  ✓ 成功生成 {valid_count} 道题")
                break

            except Exception as e:
                if attempt < max_retries:
                    print(f"  ⚠ API 错误: {e}，重试...")
                    time.sleep(3)
                else:
                    print(f"  ✗ 模块 {module['name']} 生成失败: {e}")

        # Rate limit: 20 RPM = 3s between calls
        if i < total_modules - 1:
            time.sleep(3)

    return all_questions


def questions_to_js(questions: list, subject_key: str) -> str:
    """将题目列表转换为 JS 文件内容"""
    subject = SUBJECTS[subject_key]
    var_name = f"{subject_key}GeneratedQuestions"

    lines = [
        f"/**",
        f" * AI 生成的{subject['name']}题目（由 Agnes AI 批量生成）",
        f" * 共 {len(questions)} 道题",
        f" */",
        f"",
        f"export const {var_name} = [",
    ]

    for q in questions:
        options_js = json.dumps(q['options'], ensure_ascii=False, indent=6)
        # Indent options properly
        options_js = options_js.replace('\n', '\n    ')

        lines.append(f"  {{")
        lines.append(f"    id: '{q['id']}',")
        lines.append(f"    subject: '{q['subject']}',")
        lines.append(f"    module: '{q['module']}',")
        lines.append(f"    pointId: '{q.get('pointId', '')}',")
        lines.append(f"    type: 'single-choice',")
        lines.append(f"    difficulty: {q.get('difficulty', 3)},")
        lines.append(f"    content: {json.dumps(q['content'], ensure_ascii=False)},")
        lines.append(f"    options: {options_js},")
        lines.append(f"    answer: {q['answer']},")
        lines.append(f"    explanation: {json.dumps(q['explanation'], ensure_ascii=False)},")
        lines.append(f"  }},")

    lines.append("]")
    lines.append("")

    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description='高考题目批量生成')
    parser.add_argument('--subject', type=str, default='all',
                        help='科目: math/physics/chemistry/biology/chinese/english/all')
    parser.add_argument('--count', type=int, default=30,
                        help='每科生成题目数量')
    parser.add_argument('--output', type=str, default=None,
                        help='输出目录')
    args = parser.parse_args()

    output_dir = args.output or os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'src', 'data', 'generated'
    )
    os.makedirs(output_dir, exist_ok=True)

    if args.subject == 'all':
        subjects = list(SUBJECTS.keys())
    else:
        if args.subject not in SUBJECTS:
            print(f"未知科目: {args.subject}")
            print(f"可选: {', '.join(SUBJECTS.keys())}")
            sys.exit(1)
        subjects = [args.subject]

    all_generated = {}

    for subject_key in subjects:
        print(f"\n{'='*60}")
        print(f"开始生成 {SUBJECTS[subject_key]['name']} 题目 (目标: {args.count} 题)")
        print(f"{'='*60}")

        questions = generate_for_subject(subject_key, args.count)

        if questions:
            # Save JSON
            json_path = os.path.join(output_dir, f"{subject_key}_generated.json")
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(questions, f, ensure_ascii=False, indent=2)

            # Save JS
            js_content = questions_to_js(questions, subject_key)
            js_path = os.path.join(output_dir, f"{subject_key}GeneratedQuestions.js")
            with open(js_path, 'w', encoding='utf-8') as f:
                f.write(js_content)

            all_generated[subject_key] = questions
            print(f"\n✓ {SUBJECTS[subject_key]['name']} 完成: {len(questions)} 道题")
            print(f"  JSON: {json_path}")
            print(f"  JS:   {js_path}")
        else:
            print(f"\n✗ {SUBJECTS[subject_key]['name']} 生成失败")

    # Summary
    print(f"\n{'='*60}")
    print(f"生成完成!")
    print(f"{'='*60}")
    total = 0
    for subject_key, questions in all_generated.items():
        name = SUBJECTS[subject_key]['name']
        print(f"  {name}: {len(questions)} 题")
        total += len(questions)
    print(f"  总计: {total} 题")


if __name__ == '__main__':
    main()
