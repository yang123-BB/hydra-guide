/**
 * 高考英语知识点体系（新高考）
 * 6 大模块，共 22 个知识点
 */

export const englishModules = [
  {
    id: 'grammar',
    name: 'Grammar 语法',
    priority: 1,
    points: [
      { id: 'tense-voice', name: 'Tense & Voice 时态与语态' },
      { id: 'non-finite', name: 'Non-finite Verbs 非谓语动词' },
      { id: 'clauses', name: 'Clauses 从句（定/状/名）' },
      { id: 'modal-virtual', name: 'Modal Verbs & Subjunctive 情态动词与虚拟语气' },
    ],
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary 词汇',
    priority: 1,
    points: [
      { id: 'word-discrimination', name: 'Word Discrimination 词语辨析' },
      { id: 'phrases', name: 'Phrases & Collocations 固定搭配与短语' },
      { id: 'word-formation', name: 'Word Formation 构词法' },
    ],
  },
  {
    id: 'cloze',
    name: 'Cloze Test 完形填空',
    priority: 2,
    points: [
      { id: 'cloze-logic', name: 'Logical Reasoning 逻辑推理' },
      { id: 'cloze-context', name: 'Context Clues 上下文线索' },
    ],
  },
  {
    id: 'reading',
    name: 'Reading Comprehension 阅读理解',
    priority: 1,
    points: [
      { id: 'reading-detail', name: 'Detail Questions 细节理解题' },
      { id: 'reading-inference', name: 'Inference Questions 推理判断题' },
      { id: 'reading-main-idea', name: 'Main Idea & Title 主旨大意题' },
      { id: 'reading-attitude', name: 'Author\'s Attitude 作者态度题' },
    ],
  },
  {
    id: 'seven-choose-five',
    name: 'Seven Choose Five 七选五',
    priority: 2,
    points: [
      { id: 'gap-fill-logic', name: 'Logical Coherence 逻辑衔接' },
      { id: 'gap-fill-structure', name: 'Structural Clues 结构线索' },
    ],
  },
  {
    id: 'writing',
    name: 'Writing 书面表达',
    priority: 1,
    points: [
      { id: 'writing-content', name: 'Content & Organization 内容与结构' },
      { id: 'writing-language', name: 'Language & Vocabulary 语言与词汇' },
      { id: 'writing-format', name: 'Format & Style 格式与文体' },
      { id: 'continuation-writing', name: 'Continuation Writing 读后续写' },
    ],
  },
]
