/**
 * 高考语文知识点体系（新高考）
 * 6 大模块，共 24 个知识点
 */

export const chineseModules = [
  {
    id: 'language-usage',
    name: '语言文字运用',
    priority: 1,
    points: [
      { id: 'pronunciation', name: '字音辨析' },
      { id: 'characters', name: '字形辨析' },
      { id: 'idioms', name: '成语运用' },
      { id: 'sentence-errors', name: '病句辨析与修改' },
      { id: 'rhetoric', name: '修辞手法与表达技巧' },
    ],
  },
  {
    id: 'classical-chinese',
    name: '文言文阅读',
    priority: 1,
    points: [
      { id: 'classical-words', name: '文言实词与虚词' },
      { id: 'classical-grammar', name: '文言特殊句式' },
      { id: 'classical-translation', name: '文言文翻译' },
      { id: 'classical-comprehension', name: '文言文内容理解' },
    ],
  },
  {
    id: 'poetry',
    name: '古诗词鉴赏',
    priority: 2,
    points: [
      { id: 'poetry-imagery', name: '意象与意境分析' },
      { id: 'poetry-techniques', name: '表达技巧与表现手法' },
      { id: 'poetry-emotion', name: '情感主旨把握' },
    ],
  },
  {
    id: 'modern-reading',
    name: '现代文阅读',
    priority: 1,
    points: [
      { id: 'narrative-reading', name: '小说阅读' },
      { id: 'essay-reading', name: '散文阅读' },
      { id: 'practical-reading', name: '实用类/论述类文本阅读' },
    ],
  },
  {
    id: 'literary-knowledge',
    name: '文学常识与名句默写',
    priority: 2,
    points: [
      { id: 'literary-history', name: '文学常识与文化常识' },
      { id: 'recitation', name: '名篇名句默写' },
    ],
  },
  {
    id: 'writing',
    name: '作文',
    priority: 1,
    points: [
      { id: 'writing-material', name: '材料作文审题立意' },
      { id: 'writing-structure', name: '文章结构与论证方法' },
      { id: 'writing-language', name: '语言表达与文采' },
    ],
  },
]
