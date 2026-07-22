/**
 * 批量题目生成脚本 - 按新标签体系生成占位数据
 * 
 * 使用：node generate_placeholder_questions.js
 * 输出：控制台打印生成的题目JSON
 * 
 * 生成的题目包含：
 * - 6类标签（examArea, questionType, difficultyStars, source, year, teachingTags）
 * - 三层解析（explanationLayers.standard, .scoring, .tips）
 * - 标准字段（subject, module, pointId, content, options, answer, difficulty）
 */

// 手动导入数据（避免路径问题）
import { readFileSync } from 'fs'
import { fileURLToPath, URL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = new URL('.', import.meta.url).pathname

// 读取科目数据
const subjectsData = JSON.parse(readFileSync(new URL('../src/data/subjects.js', import.meta.url), 'utf8').replace(/^export.*\n/, '').replace(/;$/, ''))

const YEARS = ['2019', '2020', '2021', '2022', '2023']
const SOURCES = ['高考真题', '模拟考试', '名校期中', '名校期末', '竞赛题']
const QUESTION_TYPES = ['选择题', '填空题', '解答题', '应用题']
const EXAM_AREAS = ['全国甲卷', '全国乙卷', '新高考I卷', '新高考II卷', '北京卷', '上海卷', '天津卷', '浙江卷', '江苏卷']

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateQuestionId(subjectId, index) {
  return `${subjectId}_generated_${String(index).padStart(4, '0')}`
}

function generatePlaceholderQuestion(subjectId, module, point, index) {
  const id = generateQuestionId(subjectId, index)
  const difficulty = Math.floor(Math.random() * 5) + 1
  const year = randomItem(YEARS)
  const source = randomItem(SOURCES)
  
  return {
    id,
    subject: subjectId,
    module: module.id,
    pointId: point.id,
    content: `【占位】${point.name}相关题目 - 请替换为真实题干内容。此题考察${point.name}的知识点。`,
    options: [
      'A. 选项一（请替换）',
      'B. 选项二（请替换）',
      'C. 选项三（请替换）',
      'D. 选项四（请替换）',
    ],
    answer: 0,
    explanation: `【占位】${point.name}的解题思路：请替换为真实解析。`,
    difficulty,
    tags: {
      examArea: randomItem(EXAM_AREAS),
      questionType: randomItem(QUESTION_TYPES),
      difficultyStars: difficulty,
      source,
      year,
      teachingTags: [`${point.name}专题`, difficulty <= 2 ? '基础题' : difficulty <= 3 ? '中档题' : '压轴题'],
    },
    explanationLayers: {
      standard: `【标准答案】此题答案为A。\n\n【解析】请替换为真实的标准解析内容。`,
      scoring: year.includes('高考') ? `【采分点】\n1. 第一步（3分）：请替换为真实采分点\n2. 第二步（4分）：请替换为真实采分点\n3. 第三步（5分）：请替换为真实采分点` : null,
      tips: `【易错提醒】\n- 注意${point.name}的基本概念\n- 计算时注意符号\n- 答题时写清步骤`,
    },
    errorReported: false,
  }
}

function generateQuestionsForSubject(subject, questionsPerPoint = 10) {
  const questions = []
  let index = 0
  
  subject.modules.forEach(module => {
    module.points.forEach(point => {
      for (let i = 0; i < questionsPerPoint; i++) {
        questions.push(generatePlaceholderQuestion(subject.id, module, point, index))
        index++
      }
    })
  })
  
  return questions
}

// 主函数
function main() {
  const allGenerated = []
  
  subjects.forEach(subject => {
    console.log(`生成 ${subject.name} 题目...`)
    const questions = generateQuestionsForSubject(subject, 10)
    allGenerated.push(...questions)
    console.log(`  → 生成了 ${questions.length} 道题目`)
  })
  
  console.log(`\n总共生成 ${allGenerated.length} 道占位题目`)
  
  // 输出为 JS 文件
  const outputPath = '../data/questions/generated_questions.js'
  const jsContent = `// 自动生成的占位题目数据 - ${new Date().toISOString().split('T')[0]}
// 请将这些题目中的占位内容替换为真实题目
// 每个题目已包含新标签体系和三层解析结构

export const generatedQuestions = ${JSON.stringify(allGenerated, null, 2)}
`
  
  console.log(`\n请将生成的数据复制到题目文件中，然后替换占位内容。`)
  console.log(`建议每个模块/知识点手动编写至少 20-30 道真实题目。`)
  
  return allGenerated
}

const generated = main()
export default generated
