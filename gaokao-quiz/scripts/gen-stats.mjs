// 预计算题库统计：生成 src/data/stats.json（首屏"题库总量"秒出，无需加载 4.4MB 题库）
// 运行：node scripts/gen-stats.mjs   （或 npm run gen:stats）
import { loadAllQuestions } from '../src/data/allQuestions.js'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const bank = await loadAllQuestions()

const bySubject = {}
for (const q of bank) {
  const s = q.subject || 'unknown'
  bySubject[s] = (bySubject[s] || 0) + 1
}

const out = {
  total: bank.length,
  bySubject,
  generatedAt: new Date().toISOString(),
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const target = join(__dirname, '..', 'src', 'data', 'stats.json')
writeFileSync(target, JSON.stringify(out, null, 2))
console.log(`✅ stats.json 已生成 → ${target}`)
console.log(`   总题量: ${out.total}`)
console.log(`   分科: ${JSON.stringify(bySubject)}`)
