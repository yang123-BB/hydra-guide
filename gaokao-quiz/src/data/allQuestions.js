/**
 * 统一题库入口（懒加载版）
 *
 * ★ 性能：所有题目数据不再静态打包进首屏，而是在 loadAllQuestions() 时
 *   通过动态 import() 并行加载（schoolMock 单独成 chunk），组装并 normalize 一次后缓存。
 *   首屏 JS 体积因此大幅下降。
 *
 * ★ 查询函数读取已加载的 _bank；未加载时调用会抛错。
 *   页面请通过 useBank() 拿到 bank 后再使用，或调用本模块查询函数（已自动读 _bank）。
 */

import { UNIFIED_SUBJECTS, PROVINCIAL_SUBJECTS } from './provinces.js'

// ─── 题型映射 ───────────────────────────────────────────────────────
const TYPE_MAP = {
  'single-choice': 'single-choice',
  'multi-choice':  'multi-choice',
  'fill-blank':    'fill-blank',
  'short-answer':  'short-answer',
  'calculation':   'calculation',
  'experiment':    'experiment',
  'comprehensive': 'short-answer',
  'reading':       'short-answer',
  'writing':       'short-answer',
  'cloze':        'fill-blank',
}

// ─── 知识点考频（1-5★）────────────────────────────────────────────
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

// ─── 核心：标准化单道题 ──────────────────────────────────────────
export function normalizeQuestion(q) {
  if (!q) return q
  const nq = { ...q }

  // 确保 subject 字段
  if (!nq.subject) {
    // 根据模块名推断科目
    if (nq.module) {
      if (nq.module.startsWith('function') || nq.module.startsWith('triangle') ||
          nq.module.startsWith('sequence') || nq.module.startsWith('vector') ||
          nq.module.startsWith('solid') || nq.module.startsWith('analytic') ||
          nq.module.startsWith('probability') || nq.module.startsWith('inequality') ||
          nq.module.startsWith('sets')) {
        nq.subject = 'math'
      } else if (nq.module.startsWith('physics') || nq.module.startsWith('mechanics') ||
                 nq.module.startsWith('electromagnetism') || nq.module.startsWith('modern-physics')) {
        nq.subject = 'physics'
      } else if (nq.module.startsWith('chemical') || nq.module.startsWith('reaction') ||
                 nq.module.startsWith('organic')) {
        nq.subject = 'chemistry'
      } else if (nq.module.startsWith('cell') || nq.module.startsWith('genetics') ||
                 nq.module.startsWith('ecology')) {
        nq.subject = 'biology'
      } else if (nq.module.startsWith('reading') || nq.module.startsWith('writing') ||
                 nq.module.startsWith('classical')) {
        nq.subject = 'chinese'
      } else if (nq.module.startsWith('vocabulary') || nq.module.startsWith('grammar') ||
                 nq.module.startsWith('listening')) {
        nq.subject = 'english'
      } else {
        nq.subject = 'math' // 默认数学
      }
    } else {
      nq.subject = 'math'
    }
  }

  // 补全 tags 字段
  if (!nq.tags) {
    const qtype = TYPE_MAP[nq.type] || nq.type || 'single-choice'
    nq.tags = {
      examArea:       ['new1'],
      questionType:    qtype,
      difficultyStars: nq.difficulty ? Math.min(5, Math.max(1, nq.difficulty)) : 2,
      source:          nq.subject === 'math' ? 'gaokao' : 'variation',
      year:            nq.subject === 'math' ? 2024 : null,
      teachingTags:    getFreq(nq.pointId) >= 4 ? ['high-freq'] : [],
    }
  }

  // ── 补全 province 和 paperType 字段（新高考命题规则）──
  // 语数外 = 教育部统一命题（I卷/II卷），物化生 = 省级自主命题
  if (!nq.tags.province) {
    if (PROVINCIAL_SUBJECTS.includes(nq.subject)) {
      // 物化生：未标注省份的题目设为 null（通用题，所有省份可见）
      nq.tags.province = null
    } else {
      // 语数外 + 其他：通用（不限省份）
      nq.tags.province = null
    }
  }
  if (!nq.tags.paperType) {
    if (UNIFIED_SUBJECTS.includes(nq.subject)) {
      // 语数外：不默认设卷型，由实际题目来源决定（null 表示未标注）
      nq.tags.paperType = null
    } else if (PROVINCIAL_SUBJECTS.includes(nq.subject)) {
      // 物化生：省级命题
      nq.tags.paperType = 'provincial'
    } else {
      nq.tags.paperType = null
    }
  }

  // 补全 explanationLayers 字段
  if (!nq.explanationLayers) {
    // 根据题型和难度生成有针对性的易错提醒
    let tips = ''
    const qType = nq.type || ''
    const diff = nq.difficulty || 2
    const pointId = nq.pointId || ''

    // 高频考点通用提醒
    if (getFreq(pointId) >= 4) {
      tips = '⚡ 高频考点！'
    }

    // 根据题型添加针对性提醒
    if (qType.includes('choice')) {
      tips += ' 注意审题，排除法做题。'
    } else if (qType.includes('fill')) {
      tips += ' 注意答案格式，单位不能漏。'
    } else if (qType.includes('calculation') || qType.includes('short')) {
      tips += ' 步骤要完整，关键步骤不能跳。'
    }

    // 根据难度添加提醒
    if (diff >= 4) {
      tips += ' 压轴题难度，注意时间分配。'
    } else if (diff <= 2) {
      tips += ' 基础题，确保不在简单步骤出错。'
    }

    nq.explanationLayers = {
      standard: nq.explanation || '',
      scoring:  diff >= 3 ? '请写出完整解题步骤，关键公式和变形过程不能省略。' : '',
      tips:     tips || '认真审题，细心计算。',
    }
  }

  // 补全纠错字段
  if (nq.errorReported === undefined) {
    nq.errorReported = false
  }

  return nq
}

// ─── 懒加载核心 ───────────────────────────────────────────────────
let _bank = null
let _promise = null

// 并行加载除 schoolMock 外的全部核心题库
async function loadCore() {
  const [
    mathMod, physicsMod, chemistryMod, biologyMod, chineseMod, englishMod,
    genMod, byYearMod, q2022Mod, q2024Mod, byYearExtraMod,
    gPhysicsMod, gChemMod, gBioMod, gChineseMod, gEnglishMod,
    pPhysicsMod, pChemMod, pBioMod,
  ] = await Promise.all([
    import('./questions.js'),
    import('./physicsQuestions.js'),
    import('./chemistryQuestions.js'),
    import('./biologyQuestions.js'),
    import('./chineseQuestions.js'),
    import('./englishQuestions.js'),
    import('./generated/index.js'),
    import('./questions_by_year.js'),
    import('./questions2022.js'),
    import('./questions2024.js'),
    import('./questions_by_year_extra.js'),
    import('./gaokaoPhysics.js'),
    import('./gaokaoChemistry.js'),
    import('./gaokaoBiology.js'),
    import('./gaokaoChinese.js'),
    import('./gaokaoEnglish.js'),
    import('./provincialPhysics.js'),
    import('./provincialChemistry.js'),
    import('./provincialBiology.js'),
  ])

  return [
    ...(mathMod.questions || []),
    ...(physicsMod.physicsQuestions || []),
    ...(chemistryMod.chemistryQuestions || []),
    ...(biologyMod.biologyQuestions || []),
    ...(chineseMod.chineseQuestions || []),
    ...(englishMod.englishQuestions || []),
    ...(genMod.allGeneratedQuestions || []),
    ...(byYearMod.questions2025 || []),
    ...(byYearMod.questions2023 || []),
    ...(q2022Mod.questions2022 || []),
    ...(q2024Mod.questions2024 || []),
    ...(byYearExtraMod.questions2026_extra || []),
    ...(byYearExtraMod.questions2025_extra || []),
    ...(byYearExtraMod.questions2023_extra || []),
    ...(byYearExtraMod.questions2022_extra || []),
    ...(gPhysicsMod.gaokaoPhysicsQuestions || []),
    ...(gChemMod.gaokaoChemistryQuestions || []),
    ...(gBioMod.gaokaoBiologyQuestions || []),
    ...(gChineseMod.gaokaoChineseQuestions || []),
    ...(gEnglishMod.gaokaoEnglishQuestions || []),
    ...(pPhysicsMod.provincialPhysicsQuestions || []),
    ...(pChemMod.provincialChemistryQuestions || []),
    ...(pBioMod.provincialBiologyQuestions || []),
  ]
}

/**
 * 异步加载并缓存全题库（schoolMock 单独成 chunk，可独立缓存/并行下载）。
 * 多次调用复用同一 Promise，幂等。
 */
export async function loadAllQuestions() {
  if (_bank) return _bank
  if (!_promise) {
    _promise = (async () => {
      // schoolMock 拆成 8 个 ~420KB 的小文件（避免单文件过大），并行加载后合并
      const schoolImporters = Array.from({ length: 8 }, (_, i) =>
        import(`./schoolMock.part${i + 1}.js`))
      const [core, ...schoolParts] = await Promise.all([
        loadCore(),
        ...schoolImporters,
      ])
      const schoolArr = schoolParts.flatMap((m) => m.SCHOOL_PART || [])
      _bank = [
        ...core.map(normalizeQuestion),
        ...schoolArr.map(normalizeQuestion),
      ]
      return _bank
    })()
  }
  return _promise
}

/** 同步获取已加载的题库；未加载时抛错（请用 useBank() 确保已加载） */
export function getBank() {
  if (!_bank) throw new Error('Question bank not loaded. Call loadAllQuestions() first (or wait for useBank()).')
  return _bank
}

/** 题库是否已加载完成 */
export function isBankLoaded() { return _bank !== null }

// ─── 查询函数（读取已加载的 _bank） ──────────────────────────────

/** 根据 ID 获取题目（跨科目，返回标准化后对象） */
export function getQuestion(id) {
  return getBank().find(q => q.id === id)
}

/** 根据科目获取题目列表 */
export function getQuestionsBySubject(subjectId) {
  return getBank().filter(q => q.subject === subjectId)
}

/** 根据模块获取题目（跨科目） */
export function getQuestionsByModule(moduleId) {
  return getBank().filter(q => q.module === moduleId)
}

/** 获取指定科目的题目（打乱顺序） */
export function getQuestionsBySubjectShuffled(subjectId, limit = 10) {
  const list = getQuestionsBySubject(subjectId)
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return limit ? arr.slice(0, limit) : arr
}

/** 获取所有题目（打乱顺序） */
export function getAllQuestions(shuffle = false, limit = 10) {
  const arr = [...getBank()]
  if (shuffle) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }
  return limit ? arr.slice(0, limit) : arr
}

/** 按标签搜索题目
 *  criteria = { subject, module, pointId, examArea, questionType, difficultyStars, source, teachingTags, keyword, province, paperType }
 */
export function searchQuestions(criteria = {}) {
  let results = [...getBank()]
  if (criteria.subject)        results = results.filter(q => q.subject === criteria.subject)
  if (criteria.module)         results = results.filter(q => q.module === criteria.module)
  if (criteria.pointId)        results = results.filter(q => q.pointId === criteria.pointId)
  if (criteria.questionType)   results = results.filter(q => q.tags && q.tags.questionType === criteria.questionType)
  if (criteria.difficultyStars) results = results.filter(q => q.tags && q.tags.difficultyStars === criteria.difficultyStars)
  if (criteria.source)          results = results.filter(q => q.tags && q.tags.source === criteria.source)
  if (criteria.examArea && criteria.examArea.length)
    results = results.filter(q => q.tags && criteria.examArea.some(ea => (q.tags.examArea || []).includes(ea)))
  if (criteria.teachingTags && criteria.teachingTags.length)
    results = results.filter(q => q.tags && criteria.teachingTags.some(tt => (q.tags.teachingTags || []).includes(tt)))
  // 省份筛选（物化生）
  if (criteria.province)
    results = results.filter(q => !q.tags?.province || q.tags.province === criteria.province)
  // 试卷类型筛选（语数外）
  if (criteria.paperType)
    results = results.filter(q => !q.tags?.paperType || q.tags.paperType === criteria.paperType || q.tags.paperType === 'provincial')
  if (criteria.keyword) {
    const kw = criteria.keyword.toLowerCase()
    results = results.filter(q =>
      (q.content && q.content.toLowerCase().includes(kw)) ||
      (q.pointId && q.pointId.toLowerCase().includes(kw)) ||
      (q.tags && q.tags.source && q.tags.source.toLowerCase().includes(kw))
    )
  }
  return results
}

/** 获取题库统计看板数据 */
export function getQuestionBankStats(subjectId) {
  const list = subjectId ? getQuestionsBySubject(subjectId) : getBank()
  const stats = {
    total: list.length,
    bySource: {},
    byDifficulty: {},
    byType: {},
    highFreq: 0,
    withImage: 0,
  }
  for (const q of list) {
    const tags = q.tags || {}
    // 来源统计
    const src = tags.source || 'unknown'
    stats.bySource[src] = (stats.bySource[src] || 0) + 1
    // 难度统计
    const diff = tags.difficultyStars || 2
    stats.byDifficulty[diff] = (stats.byDifficulty[diff] || 0) + 1
    // 题型统计
    const type = tags.questionType || 'unknown'
    stats.byType[type] = (stats.byType[type] || 0) + 1
    // 高频题
    if (tags.teachingTags && tags.teachingTags.includes('high-freq')) stats.highFreq++
  }
  return stats
}
