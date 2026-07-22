/**
 * AI 生成题目统一入口
 * 合并所有科目的 AI 生成题目
 * 由 scripts/generate_questions.py 批量生成
 */

import { mathGeneratedQuestions } from './mathGeneratedQuestions.js'
import { physicsGeneratedQuestions } from './physicsGeneratedQuestions.js'
import { chemistryGeneratedQuestions } from './chemistryGeneratedQuestions.js'
import { biologyGeneratedQuestions } from './biologyGeneratedQuestions.js'
import { chineseGeneratedQuestions } from './chineseGeneratedQuestions.js'
import { englishGeneratedQuestions } from './englishGeneratedQuestions.js'

/** 所有 AI 生成的题目 */
export const allGeneratedQuestions = [
  ...mathGeneratedQuestions,
  ...physicsGeneratedQuestions,
  ...chemistryGeneratedQuestions,
  ...biologyGeneratedQuestions,
  ...chineseGeneratedQuestions,
  ...englishGeneratedQuestions,
]
