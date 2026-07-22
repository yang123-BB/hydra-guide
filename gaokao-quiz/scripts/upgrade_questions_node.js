/**
 * 批量升级题库脚本（Node.js）
 * 为所有题目补全 tags / explanationLayers / errorReported 字段
 *
 * 用法：node upgrade_questions.js
 * 输出：各 JS 文件已升级版本（覆盖写回）
 */
const fs   = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '..', 'src', 'data')
const GENERATED_DIR = path.join(DATA_DIR, 'generated')

// ─── 题型映射 ────────────────────────────────────────────────────────────
const TYPE_MAP = {
  'single-choice': 'single-choice',
  'multi-choice': 'multi-choice',
  'fill-blank':   'fill-blank',
  'short-answer': 'short-answer',
  'calculation':  'calculation',
  'experiment':   'experiment',
  'comprehensive':'short-answer',
  'reading':      'short-answer',
  'writing':      'short-answer',
  'cloze':       'fill-blank',
}

// ─── 难度→星级 ──────────────────────────────────────────────────────────
function difficultyToStars(d) {
  if (d <= 1) return 1
  if (d <= 2) return 2
  if (d <= 3) return 3
  if (d <= 4) return 4
  return 5
}

// ─── 根据知识点推断考频 ─────────────────────────────────────────────────
const POINT_FREQ = {
  'func-properties':5,'basic-functions':5,'derivative-calc':5,
  'derivative-monotonicity':5,'derivative-application':5,
  'trig-formulas':5,'trig-images':5,'law-of-sines':4,'law-of-cosines':4,
  'arithmetic':5,'geometric':5,'sequence-sum':4,
  'vector-dot':4,'space-vector':5,'solid-calc':4,
  'ellipse':5,'conic-app':5,
  'classical-prob':4,'random-variables':4,
  'set-concept':2,'set-operations':3,'logic':4,
  'vector-concept':3,'basic-inequality':2,
}
function getFreq(pointId) { return POINT_FREQ[pointId] || 3 }

// ─── 解析 JS 文件提取题目数组 ─────────────────────────────────────────
function extractQuestions(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  // 找到 export const XXX = [ ... ] 的内容
  const match = content.match(/export\s+const\s+\w+\s*=\s*(\[[\s\S]*?\])\s*;?$/m)
  if (!match) { console.warn(`  ⚠ 无法解析: ${path.basename(filePath)}`); return null }
  try {
    // 将 JS 对象转为 JS 对象（用 Function 执行）
    const fn = new Function(`return ${match[1]}`)
    return fn()
  } catch (e) {
    console.warn(`  ⚠ JSON解析失败 ${path.basename(filePath)}: ${e.message}`)
    return null
  }
}

// ─── 将题目数组写回 JS 文件 ───────────────────────────────────────────
function writeQuestions(filePath, varName, questions, subjectName) {
  const lines = []
  lines.push(`/**`)
  lines.push(` * 高考${subjectName}题库（已升级标签体系）`)
  lines.push(` * 由 upgrade_questions.js 自动升级`)
  lines.push(` */`)
  lines.push(``)
  lines.push(`export const ${varName} = [`)
  for (const q of questions) {
    lines.push(`  {`)
    const keys = Object.keys(q)
    for (let ki = 0; ki < keys.length; ki++) {
      const k = keys[ki]
      const v = q[k]
      const comma = ki < keys.length - 1 ? ',' : ''
      if (k === 'tags') {
        lines.push(`    tags: {`)
        lines.push(`      examArea: ${JSON.stringify(v.examArea)},`)
        lines.push(`      questionType: "${v.questionType}",`)
        lines.push(`      difficultyStars: ${v.difficultyStars},`)
        lines.push(`      source: "${v.source}",`)
        lines.push(`      year: ${v.year === null ? 'null' : v.year},`)
        lines.push(`      teachingTags: ${JSON.stringify(v.teachingTags)},`)
        lines.push(`    },`)
      } else if (k === 'explanationLayers') {
        lines.push(`    explanationLayers: {`)
        lines.push(`      standard: ${JSON.stringify(v.standard)},`)
        lines.push(`      scoring: ${JSON.stringify(v.scoring)},`)
        lines.push(`      tips: ${JSON.stringify(v.tips)},`)
        lines.push(`    },`)
      } else if (k === 'options' && Array.isArray(v)) {
        const opts = v.map(o => `      ${JSON.stringify(o)}`).join(',\n')
        lines.push(`    options: [`)
        lines.push(opts)
        lines.push(`    ],`)
      } else if (typeof v === 'string') {
        // 转义反引号、反斜杠
        const escaped = v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
        lines.push(`    ${k}: "${escaped}",`)
      } else if (typeof v === 'boolean') {
        lines.push(`    ${k}: ${v},`)
      } else if (v === null) {
        lines.push(`    ${k}: null,`)
      } else if (typeof v === 'number') {
        lines.push(`    ${k}: ${v},`)
      } else {
        lines.push(`    ${k}: ${JSON.stringify(v)},`)
      }
    }
    lines.push(`  },`)
  }
  lines.push(`]`)
  lines.push(``)
  // getQuestion 辅助函数
  lines.push(`/** 根据 ID 获取题目 */`)
  lines.push(`export function getQuestion(id) {`)
  lines.push(`  return ${varName}.find(q => q.id === id)`)
  lines.push(`}`)

  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8')
  console.log(`  ✓ 已写入 ${path.basename(filePath)} (${questions.length} 题)`)
}

// ─── 为单道题升级 ───────────────────────────────────────────────────────
function upgradeQuestion(q, subject) {
  const upgraded = { ...q }

  // subject 字段
  if (!upgraded.subject) upgraded.subject = subject

  // tags 字段
  if (!upgraded.tags) {
    const qtype = TYPE_MAP[q.type] || q.type || 'single-choice'
    upgraded.tags = {
      examArea:       ['new1'],
      questionType:    qtype,
      difficultyStars: difficultyToStars(q.difficulty || 2),
      source:          subject === 'math' ? 'gaokao' : 'variation',
      year:            subject === 'math' ? 2024 : null,
      teachingTags:    getFreq(q.pointId) >= 4 ? ['high-freq'] : [],
    }
  }

  // explanationLayers 字段
  if (!upgraded.explanationLayers) {
    upgraded.explanationLayers = {
      standard: q.explanation || '',
      scoring:  '',
      tips:     getFreq(q.pointId) >= 4 ? '高频考点，注意运算准确' : '',
    }
  }

  // errorReported 字段
  if (upgraded.errorReported === undefined) {
    upgraded.errorReported = false
  }

  return upgraded
}

// ─── 主流程 ─────────────────────────────────────────────────────────────
function main() {
  const files = [
    { path: path.join(DATA_DIR, 'questions.js'),           varName: 'questions',           subject: 'math',    subjectName: '数学' },
    { path: path.join(DATA_DIR, 'physicsQuestions.js'),     varName: 'physicsQuestions',     subject: 'physics',  subjectName: '物理' },
    { path: path.join(DATA_DIR, 'chemistryQuestions.js'),   varName: 'chemistryQuestions',   subject: 'chemistry',subjectName: '化学' },
    { path: path.join(DATA_DIR, 'biologyQuestions.js'),     varName: 'biologyQuestions',     subject: 'biology',  subjectName: '生物' },
    { path: path.join(DATA_DIR, 'chineseQuestions.js'),     varName: 'chineseQuestions',     subject: 'chinese',  subjectName: '语文' },
    { path: path.join(DATA_DIR, 'englishQuestions.js'),      varName: 'englishQuestions',      subject: 'english',  subjectName: '英语' },
  ]

  // generated 目录
  if (fs.existsSync(GENERATED_DIR)) {
    const genFiles = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.js'))
    for (const gf of genFiles) {
      const subject = gf.replace('GeneratedQuestions.js', '').toLowerCase()
      const varName = subject.charAt(0).toLowerCase() + subject.slice(1) + 'GeneratedQuestions'
      files.push({
        path: path.join(GENERATED_DIR, gf),
        varName,
        subject: subject === 'math' ? 'math' : subject,
        subjectName: subject,
      })
    }
  }

  for (const file of files) {
    console.log(`\n📂 处理: ${path.basename(file.path)}`)
    const questions = extractQuestions(file.path)
    if (!questions) continue
    console.log(`    读取到 ${questions.length} 道题`)

    const upgraded = questions.map(q => upgradeQuestion(q, file.subject))
    writeQuestions(file.path, file.varName, upgraded, file.subjectName)
  }

  console.log('\n✅ 全部升级完成')
}

main()
