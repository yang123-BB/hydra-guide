/**
 * 智能推题引擎 v3.0
 *
 * 算法设计：
 * 1. 按知识点统计掌握度（正确率 + 艾宾浩斯遗忘曲线）
 * 2. 计算每个知识点的推荐优先级（未学 > 答错 > 低正确率 > 待复习 > 已掌握）
 * 3. 难度自适应：根据近期正确率动态调整推荐难度
 *    - 正确率 < 60% → 推送基础变式（难度1-2）
 *    - 正确率 60-80% → 推送中档题（难度2-3）
 *    - 正确率 > 80% → 切换压轴难题（难度4-5）
 * 4. 避开近期已答对的题目，优先推送未做过的题
 * 5. 学习路径推荐：基础→核心→拔高顺序
 */

import { getBank } from '../data/allQuestions.js'
import { subjects, getModuleByPointId } from '../data/subjects.js'

// ─── 常量 ───

/** 遗忘曲线半衰期（天）：答错的题遗忘更快 */
const HALF_LIFE_WRONG = 1.0
const HALF_LIFE_CORRECT = 3.0

/** 掌握度阈值：低于此值认为需要复习 */
const REVIEW_THRESHOLD = 70

/** 推荐优先级权重 */
const PRIORITY = {
  NEVER_PRACTICED: 100,  // 从未练习过
  LAST_WRONG: 95,        // 最近一次答错
  LOW_ACCURACY: 85,      // 正确率低于60%
  DUE_REVIEW: 75,        // 掌握度衰减到阈值以下
  MEDIUM: 50,            // 正确率一般
  MASTERED: 20,          // 已掌握
}

/** 自适应难度映射 */
function getAdaptiveDifficulty(accuracy, defaultDiff = 2) {
  if (accuracy < 0.6) return { min: 1, max: 2, label: '基础巩固' }
  if (accuracy < 0.8) return { min: 2, max: 3, label: '能力提升' }
  return { min: 3, max: 5, label: '挑战拔高' }
}

// ─── 核心计算 ───

/**
 * 计算某个知识点的答题统计
 * @param {string} pointId - 知识点ID
 * @param {Array} answerRecords - 全部答题记录
 * @returns {{ total, correct, wrong, accuracy, lastDate, lastCorrect, questionIds }}
 */
export function getPointStats(pointId, answerRecords) {
  const pointQuestions = getBank().filter(q => q.pointId === pointId)
  const pointQIds = pointQuestions.map(q => q.id)
  const records = answerRecords.filter(r => pointQIds.includes(r.questionId))

  if (records.length === 0) {
    return {
      total: 0, correct: 0, wrong: 0,
      accuracy: 0, lastDate: null, lastCorrect: null,
      questionIds: [],
      attemptedQuestionIds: [],
    }
  }

  const correct = records.filter(r => r.correct).length
  const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date))
  const last = sorted[0]

  return {
    total: records.length,
    correct,
    wrong: records.length - correct,
    accuracy: correct / records.length,
    lastDate: last.date,
    lastCorrect: last.correct,
    questionIds: pointQIds,
    attemptedQuestionIds: [...new Set(records.map(r => r.questionId))],
  }
}

/**
 * 计算知识点的掌握度（0-100）
 * 综合考虑正确率和遗忘曲线
 */
export function getMasteryScore(pointId, answerRecords) {
  const stats = getPointStats(pointId, answerRecords)

  if (stats.total === 0) return 0

  // 基础分 = 正确率 * 100
  const baseScore = stats.accuracy * 100

  // 遗忘因子：根据最近答题结果和时间衰减
  const daysSinceLast = (Date.now() - new Date(stats.lastDate).getTime()) / (1000 * 60 * 60 * 24)
  const halfLife = stats.lastCorrect ? HALF_LIFE_CORRECT : HALF_LIFE_WRONG
  const forgettingFactor = Math.exp(-daysSinceLast / halfLife)

  // 掌握度 = 基础分 * 遗忘因子（最低保留30%基础分，避免归零感）
  const mastery = baseScore * (0.3 + 0.7 * forgettingFactor)

  return Math.round(mastery)
}

/**
 * 计算知识点的推荐优先级（越高越优先推荐）
 */
export function getPointPriority(pointId, answerRecords) {
  const stats = getPointStats(pointId, answerRecords)

  // 从未练习：最高优先级
  if (stats.total === 0) {
    return {
      priority: PRIORITY.NEVER_PRACTICED,
      mastery: 0,
      reason: '新知识点，尚未练习',
      stats,
    }
  }

  // 最近一次答错
  if (stats.lastCorrect === false) {
    return {
      priority: PRIORITY.LAST_WRONG,
      mastery: getMasteryScore(pointId, answerRecords),
      reason: '最近答错，建议立即复习',
      stats,
    }
  }

  // 正确率低于60%
  if (stats.accuracy < 0.6) {
    return {
      priority: PRIORITY.LOW_ACCURACY,
      mastery: getMasteryScore(pointId, answerRecords),
      reason: `正确率仅 ${Math.round(stats.accuracy * 100)}%，需要加强`,
      stats,
    }
  }

  // 掌握度因遗忘衰减到阈值以下
  const mastery = getMasteryScore(pointId, answerRecords)
  if (mastery < REVIEW_THRESHOLD) {
    return {
      priority: PRIORITY.DUE_REVIEW,
      mastery,
      reason: `掌握度降至 ${mastery}，建议复习巩固`,
      stats,
    }
  }

  // 正确率一般（60%-80%）
  if (stats.accuracy < 0.8) {
    return {
      priority: PRIORITY.MEDIUM,
      mastery,
      reason: `正确率 ${Math.round(stats.accuracy * 100)}%，可以继续提升`,
      stats,
    }
  }

  // 已掌握
  return {
    priority: PRIORITY.MASTERED,
    mastery,
    reason: `掌握良好（${mastery}%），保持即可`,
    stats,
  }
}

// ─── 难度自适应 ───

/**
 * 根据近期答题表现计算建议难度
 * @param {Array} answerRecords - 最近20条答题记录
 * @returns {number} 建议难度（1-5）
 */
export function getRecommendedDifficulty(answerRecords) {
  const recent = answerRecords.slice(-20)
  if (recent.length < 3) return 2 // 默认中等偏易

  const accuracy = recent.filter(r => r.correct).length / recent.length
  const avgDifficulty = recent
    .map(r => {
      const q = getBank().find(qq => qq.id === r.questionId)
      return q ? q.difficulty : 2
    })
    .reduce((a, b) => a + b, 0) / recent.length

  if (accuracy > 0.8) return Math.min(5, Math.round(avgDifficulty) + 1)
  if (accuracy < 0.4) return Math.max(1, Math.round(avgDifficulty) - 1)
  return Math.round(avgDifficulty)
}

// ─── 核心：生成推荐题目列表 ───

/**
 * 为指定科目生成智能推荐题目列表
 * @param {string} subjectId - 科目ID
 * @param {Array} answerRecords - 全部答题记录
 * @param {number} count - 推荐题目数量
 * @returns {{ questions: Array, analysis: Object }}
 */
export function getRecommendedQuestions(subjectId, answerRecords, count = 10) {
  const subject = subjects.find(s => s.id === subjectId)
  if (!subject) return { questions: [], analysis: {} }

  // 1. 收集该科目所有知识点
  const allPointIds = []
  subject.modules.forEach(m => {
    m.points.forEach(p => allPointIds.push(p.id))
  })

  // 2. 计算每个知识点的优先级和掌握度
  const pointAnalysis = allPointIds.map(pointId => {
    const info = getPointPriority(pointId, answerRecords)
    const module = getModuleByPointId(pointId)
    return {
      pointId,
      moduleId: module?.id,
      moduleName: module?.name,
      ...info,
    }
  })

  // 3. 按优先级排序知识点
  pointAnalysis.sort((a, b) => b.priority - a.priority)

  // 4. 计算建议难度
  const subjectQIds = getBank()
    .filter(q => q.subject === subjectId)
    .map(q => q.id)
  const subjectRecords = answerRecords.filter(r => subjectQIds.includes(r.questionId))
  const targetDifficulty = getRecommendedDifficulty(subjectRecords)

  // 5. 按知识点优先级选题
  const recommendedQuestions = []
  const usedQuestionIds = new Set()
  // 近3天内答对的题不重复推荐
  const recentCorrectIds = new Set(
    subjectRecords
      .filter(r => {
        if (!r.correct) return false
        const days = (Date.now() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24)
        return days < 3
      })
      .map(r => r.questionId)
  )

  // 第一轮：按优先级从高到低，每个知识点选1道
  for (const pa of pointAnalysis) {
    if (recommendedQuestions.length >= count) break

    const candidates = getBank().filter(q => {
      if (q.pointId !== pa.pointId) return false
      if (usedQuestionIds.has(q.id)) return false
      if (recentCorrectIds.has(q.id)) return false
      return true
    })

    if (candidates.length === 0) continue

    // 自适应难度：根据该知识点的正确率选择难度
    const pointAccuracy = pa.stats.total > 0 ? pa.stats.accuracy : 0.5
    const adaptiveRange = getAdaptiveDifficulty(pointAccuracy)

    const attemptedIds = (pa.stats && pa.stats.attemptedQuestionIds) || []
    candidates.sort((a, b) => {
      const diffA = (a.difficulty || 2)
      const diffB = (b.difficulty || 2)
      // 优先选在自适应难度范围内的题
      const aInRange = diffA >= adaptiveRange.min && diffA <= adaptiveRange.max
      const bInRange = diffB >= adaptiveRange.min && diffB <= adaptiveRange.max
      if (aInRange && !bInRange) return -1
      if (!aInRange && bInRange) return 1
      // 都在范围内时，优先选接近目标难度的
      const diffA2 = Math.abs(diffA - targetDifficulty)
      const diffB2 = Math.abs(diffB - targetDifficulty)
      if (diffA2 !== diffB2) return diffA2 - diffB2
      // 难度相同时，优先选未做过的
      const aTried = attemptedIds.includes(a.id)
      const bTried = attemptedIds.includes(b.id)
      return aTried - bTried
    })

    const chosen = candidates[0]
    recommendedQuestions.push({
      ...chosen,
      _recommendReason: pa.reason,
      _recommendPriority: pa.priority,
      _mastery: pa.mastery,
      _adaptiveLabel: adaptiveRange.label,
    })
    usedQuestionIds.add(chosen.id)
  }

  // 第二轮：如果还不够，从高优先级知识点中多选
  if (recommendedQuestions.length < count) {
    for (const pa of pointAnalysis) {
      if (recommendedQuestions.length >= count) break

      const candidates = getBank().filter(q => {
        if (q.pointId !== pa.pointId) return false
        if (usedQuestionIds.has(q.id)) return false
        if (recentCorrectIds.has(q.id)) return false
        return true
      })

      for (const c of candidates) {
        if (recommendedQuestions.length >= count) break
        recommendedQuestions.push({
          ...c,
          _recommendReason: pa.reason,
          _recommendPriority: pa.priority,
          _mastery: pa.mastery,
          _adaptiveLabel: getAdaptiveDifficulty(pa.stats.total > 0 ? pa.stats.accuracy : 0.5).label,
        })
        usedQuestionIds.add(c.id)
      }
    }
  }

  // 第三轮：实在不够就用随机题补
  if (recommendedQuestions.length < count) {
    const remaining = getBank().filter(q =>
      q.subject === subjectId && !usedQuestionIds.has(q.id)
    )
    const shuffled = [...remaining].sort(() => Math.random() - 0.5)
    for (const q of shuffled) {
      if (recommendedQuestions.length >= count) break
      recommendedQuestions.push({
        ...q,
        _recommendReason: '补充练习',
        _recommendPriority: 10,
        _mastery: null,
        _adaptiveLabel: '',
      })
      usedQuestionIds.add(q.id)
    }
  }

  // 6. 分析摘要
  const weakPoints = pointAnalysis
    .filter(p => p.stats.total > 0 && p.priority >= PRIORITY.LOW_ACCURACY)
    .sort((a, b) => b.priority - a.priority)

  const masteredPoints = pointAnalysis.filter(p => p.priority === PRIORITY.MASTERED)
  const newPoints = pointAnalysis.filter(p => p.priority === PRIORITY.NEVER_PRACTICED)

  const analysis = {
    totalPoints: allPointIds.length,
    newPoints: newPoints.length,
    weakPoints: weakPoints.slice(0, 5),
    masteredCount: masteredPoints.length,
    targetDifficulty,
    overallMastery: Math.round(
      pointAnalysis.reduce((sum, p) => sum + p.mastery, 0) / allPointIds.length
    ),
  }

  return { questions: recommendedQuestions, analysis }
}

// ─── 辅助：获取科目掌握度概览 ───

/**
 * 获取某科目所有知识点的掌握度列表
 * @returns {Array<{ pointId, pointName, moduleName, mastery, priority, reason, stats }>}
 */
export function getSubjectMastery(subjectId, answerRecords) {
  const subject = subjects.find(s => s.id === subjectId)
  if (!subject) return []

  const results = []
  subject.modules.forEach(m => {
    m.points.forEach(p => {
      const info = getPointPriority(p.id, answerRecords)
      results.push({
        pointId: p.id,
        pointName: p.name,
        moduleName: m.name,
        moduleId: m.id,
        ...info,
      })
    })
  })

  return results.sort((a, b) => b.priority - a.priority)
}

// ─── 学习路径推荐 ───

/**
 * 为指定科目生成学习路径
 * 按模块优先级和掌握度排序，推荐学习顺序
 * @returns {Array<{ moduleId, moduleName, priority, mastery, status, recommendation }>}
 */
export function getLearningPath(subjectId, answerRecords) {
  const subject = subjects.find(s => s.id === subjectId)
  if (!subject) return []

  const path = subject.modules.map(m => {
    const moduleQuestions = getBank().filter(q => q.module === m.id)
    const moduleQIds = moduleQuestions.map(q => q.id)
    const moduleRecords = answerRecords.filter(r => moduleQIds.includes(r.questionId))

    const answered = moduleRecords.length
    const correct = moduleRecords.filter(r => r.correct).length
    const accuracy = answered > 0 ? correct / answered : 0

    // 模块级掌握度
    const pointMastery = m.points.map(p => getMasteryScore(p.id, answerRecords))
    const mastery = pointMastery.length > 0
      ? Math.round(pointMastery.reduce((s, v) => s + v, 0) / pointMastery.length)
      : 0

    // 状态判定
    let status, recommendation
    if (answered === 0) {
      status = '未开始'
      recommendation = m.priority === 1 ? '高频核心模块，建议优先学习' : '建议按顺序学习'
    } else if (mastery < 40) {
      status = '薄弱'
      recommendation = '掌握度较低，建议从基础题开始系统复习'
    } else if (mastery < 70) {
      status = '进行中'
      recommendation = '继续巩固，重点攻克薄弱知识点'
    } else if (mastery < 90) {
      status = '良好'
      recommendation = '基础已扎实，可以尝试中高难度题'
    } else {
      status = '已掌握'
      recommendation = '掌握良好，建议定期复习保持手感'
    }

    return {
      moduleId: m.id,
      moduleName: m.name,
      priority: m.priority || 2,
      mastery,
      answered,
      total: moduleQuestions.length,
      accuracy: Math.round(accuracy * 100),
      status,
      recommendation,
    }
  })

  // 排序：未开始的高频模块优先 → 薄弱模块 → 进行中 → 良好 → 已掌握
  const statusOrder = { '薄弱': 0, '未开始': 1, '进行中': 2, '良好': 3, '已掌握': 4 }
  path.sort((a, b) => {
    // 先按状态
    const so = (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5)
    if (so !== 0) return so
    // 同状态下高频优先
    return (a.priority || 2) - (b.priority || 2)
  })

  return path
}

// ─── 错题分析（失分归因） ───

/**
 * 分析错题失分原因，生成诊断报告
 * @param {Array} wrongQuestions - 错题ID列表
 * @param {Object} wrongQuestionMeta - 错题元数据
 * @param {Array} answerRecords - 答题记录
 * @returns {{ errorReasonStats, weakModules, suggestions }}
 */
export function getErrorDiagnosis(wrongQuestions, wrongQuestionMeta, answerRecords) {
  // 错因统计
  const errorReasonStats = {}
  let unmarked = 0
  wrongQuestions.forEach(id => {
    const meta = wrongQuestionMeta[id]
    if (meta?.errorReason) {
      errorReasonStats[meta.errorReason] = (errorReasonStats[meta.errorReason] || 0) + 1
    } else {
      unmarked++
    }
  })

  // 薄弱模块统计
  const moduleStats = {}
  wrongQuestions.forEach(id => {
    const q = getBank().find(aq => aq.id === id)
    if (!q) return
    const module = getModuleByPointId(q.pointId)
    if (module) {
      const key = `${q.subject}_${module.id}`
      if (!moduleStats[key]) {
        moduleStats[key] = { subject: q.subject, moduleId: module.id, moduleName: module.name, count: 0 }
      }
      moduleStats[key].count++
    }
  })
  const weakModules = Object.values(moduleStats).sort((a, b) => b.count - a.count).slice(0, 5)

  // 建议
  const suggestions = []
  const topReason = Object.entries(errorReasonStats).sort((a, b) => b[1] - a[1])[0]
  if (topReason) {
    const reasonMap = {
      concept: '概念理解不够扎实，建议回顾课本定义和公式推导',
      calculation: '计算能力需要加强，建议每天练习10道计算题',
      misread: '审题习惯有待改善，建议做题时圈画关键词',
      method: '解题方法掌握不全，建议整理各类题型的解题套路',
      careless: '粗心错误较多，建议做完后检查一遍再提交',
    }
    suggestions.push(reasonMap[topReason[0]] || '建议持续练习')
  }
  if (unmarked > wrongQuestions.length * 0.5) {
    suggestions.push('超过一半错题未标记错因，建议标记后可获得更精准的分析')
  }
  if (weakModules.length > 0) {
    suggestions.push(`最薄弱模块：${weakModules[0].moduleName}（${weakModules[0].count}道错题），建议专项突破`)
  }

  return { errorReasonStats, unmarked, weakModules, suggestions }
}
