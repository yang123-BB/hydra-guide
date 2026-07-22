import { schoolMockQuestions } from '../src/data/schoolMock.js'
import fs from 'fs'
import { fileURLToPath } from 'url'

const N = 8
const arr = schoolMockQuestions || []
const chunk = Math.ceil(arr.length / N)
const here = fileURLToPath(new URL('../src/data/', import.meta.url))
for (let i = 0; i < N; i++) {
  const part = arr.slice(i * chunk, (i + 1) * chunk)
  const f = `${here}schoolMock.part${i + 1}.js`
  fs.writeFileSync(f, `export const SCHOOL_PART = ${JSON.stringify(part)};\n`)
  console.log(`part${i + 1}: ${part.length} items -> ${f}`)
}
console.log(`split ${arr.length} items into ${N} parts`)
