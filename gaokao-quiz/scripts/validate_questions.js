/**
 * 题目数据验证脚本
 * 
 * 功能：检查题目数据是否符合新标签体系格式
 * 使用：node validate_questions.js
 */

import { allQuestions } from '../src/data/allQuestions.js'

const ERRORS = []
const WARNINGS = []

console.log(`\n🔍 开始验证 ${allQuestions.length} 道题目...\n`)

// 统计
let stats = {
  total: allQuestions.length,
  hasTags: 0,
  hasExplanationLayers: 0,
  hasScoring: 0,
  hasTips: 0,
  hasErrorReported: 0,
  missingTags: 0,
  missingExplanationLayers: 0,
}

allQuestions.forEach((q, index) => {
  const prefix = `[${q.id || index}]`
  
  // 检查 tags
  if (q.tags && typeof q.tags === 'object') {
    stats.hasTags++
    
    // 检查 tags 的必填字段
    const requiredTagFields = ['questionType', 'difficultyStars', 'source']
    requiredTagFields.forEach(field => {
      if (!q.tags[field]) {
        WARNINGS.push(`${prefix} tags.${field} 缺失`)
      }
    })
  } else {
    stats.missingTags++
    ERRORS.push(`${prefix} 缺少 tags 字段`)
  }
  
  // 检查 explanationLayers
  if (q.explanationLayers && typeof q.explanationLayers === 'object') {
    stats.hasExplanationLayers++
    
    if (!q.explanationLayers.standard) {
      WARNINGS.push(`${prefix} explanationLayers.standard 缺失`)
    }
    if (!q.explanationLayers.tips) {
      WARNINGS.push(`${prefix} explanationLayers.tips 缺失`)
    }
    if (q.explanationLayers.scoring) {
      stats.hasScoring++
    }
  } else {
    stats.missingExplanationLayers++
    WARNINGS.push(`${prefix} 缺少 explanationLayers 字段`)
  }
  
  // 检查 errorReported
  if (q.errorReported !== undefined) {
    stats.hasErrorReported++
  }
})

// 输出报告
console.log('📊 验证报告：\n')
console.log(`总题目数：${stats.total}`)
console.log(`  ✅ 有 tags 字段：${stats.hasTags} (${(stats.hasTags/stats.total*100).toFixed(1)}%)`)
console.log(`  ✅ 有 explanationLayers 字段：${stats.hasExplanationLayers} (${(stats.hasExplanationLayers/stats.total*100).toFixed(1)}%)`)
console.log(`  ✅ explanationLayers 含 scoring：${stats.hasScoring}`)
console.log(`  ✅ explanationLayers 含 tips：${stats.hasTips}`)
console.log(`  ✅ 有 errorReported 字段：${stats.hasErrorReported}`)
console.log(`\n  ⚠️  缺少 tags：${stats.missingTags}`)
console.log(`  ⚠️  缺少 explanationLayers：${stats.missingExplanationLayers}`)

if (ERRORS.length > 0) {
  console.log(`\n❌ 错误（${ERRORS.length} 个）：`)
  ERRORS.slice(0, 10).forEach(e => console.log(`  - ${e}`))
  if (ERRORS.length > 10) console.log(`  ... 还有 ${ERRORS.length - 10} 个错误`)
}

if (WARNINGS.length > 0) {
  console.log(`\n⚠️  警告（${WARNINGS.length} 个）：`)
  WARNINGS.slice(0, 10).forEach(w => console.log(`  - ${w}`))
  if (WARNINGS.length > 10) console.log(`  ... 还有 ${WARNINGS.length - 10} 个警告`)
}

// 建议
console.log('\n💡 建议：')
if (stats.missingTags > 0 || stats.missingExplanationLayers > 0) {
  console.log('  1. 运行应用，normalizeQuestion() 会自动填充缺失字段')
  console.log('  2. 或手动编辑题目文件，添加 tags 和 explanationLayers')
}
console.log('  3. 参考 src/data/QUESTION_TEMPLATE.js 的题目格式')
console.log('  4. 使用 AI 生成新题目时，确保包含新标签体系\n')
