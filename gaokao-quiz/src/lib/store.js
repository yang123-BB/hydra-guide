import { useState, useEffect, useCallback } from 'react'

/**
 * 全局状态管理（基于 localStorage 持久化）
 * 支持错因标记、每日统计、复习计划、笔记、连续打卡、主题设置
 */

const STORAGE_KEY = 'gaokao_quiz_state_v2'

/** 错因类型 */
export const ERROR_REASONS = {
  concept: { label: '概念不清', color: '#A32D2D', icon: '🧠' },
  calculation: { label: '计算失误', color: '#D85A30', icon: '🔢' },
  misread: { label: '审题错误', color: '#854F0B', icon: '👁' },
  method: { label: '方法不当', color: '#534AB7', icon: '📝' },
  careless: { label: '粗心大意', color: '#888780', icon: '⚠️' },
}

/** 主题模式 */
export const THEMES = {
  light: { label: '浅色', bg: '#f5f5f4', cardBg: 'white', text: '#2c2c2a', subText: '#888780', border: '#e7e5e4' },
  dark: { label: '深色', bg: '#1a1a18', cardBg: '#28282a', text: '#e8e8e4', subText: '#a8a6a2', border: '#3a3a38' },
  sepia: { label: '护眼', bg: '#f4ecd8', cardBg: '#faf5e8', text: '#5b4636', subText: '#9a8a6e', border: '#e0d5b8' },
}

/** 字体大小 */
export const FONT_SIZES = {
  small: { label: '小', scale: 0.9, base: '14px' },
  medium: { label: '中', scale: 1, base: '15px' },
  large: { label: '大', scale: 1.12, base: '17px' },
}

const DEFAULT_STATE = {
  currentUser: null,
  currentSubject: 'math',
  answerRecords: [],
  wrongQuestions: [],
  favorites: [],
  examRecords: [],
  // 新增字段
  wrongQuestionMeta: {},      // { [questionId]: { errorReason, addedDate, lastReviewDate, nextReviewDate, reviewCount } }
  notes: {},                   // { [questionId]: noteText }
  dailyStats: {},              // { [dateStr]: { answered, correct, wrong, timeSpent, newWrong, conqueredPoints } }
  streak: {
    current: 0,
    longest: 0,
    lastActiveDate: null,
    dailyGoal: 10,
    dailyProgress: 0,
    dailyGoalDate: null,
  },
  settings: {
    theme: 'light',
    fontSize: 'medium',
    highContrast: false,
  },
  onboardingCompleted: false,
  // 个人中心
  profile: {
    gaokaoVersion: 'new',      // new | old
    targetScore: 600,
    examDate: '2027-06-07',    // 高考日期
    selectedSubjects: [],       // 选科（新高考）
    studyPlan: null,            // 生成的学习计划
    province: 'sichuan',       // 所在省份（默认四川）
  },
  // 全局筛选器（左侧栏）
  filters: {
    year: null,              // null = 全部年份, 或数字如 2024
    questionTypes: [],       // [] = 全部题型
    difficultyMin: 0.2,      // 难度系数下限 (0.2-1.0)
    difficultyMax: 1.0,      // 难度系数上限 (0.2-1.0)
    moduleId: null,          // null = 全部模块
    source: null,            // null = 全部来源, 'gaokao' | 'variation' | 'school-mock'
    school: null,            // null = 全部名校, 或学校 id（仅名校模考来源时生效）
  },
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // 深度合并，确保新增字段有默认值
      return {
        ...DEFAULT_STATE,
        ...parsed,
        wrongQuestionMeta: { ...parsed.wrongQuestionMeta },
        notes: { ...parsed.notes },
        dailyStats: { ...parsed.dailyStats },
        streak: { ...DEFAULT_STATE.streak, ...(parsed.streak || {}) },
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
        filters: { ...DEFAULT_STATE.filters, ...(parsed.filters || {}) },
      }
    }
  } catch {}
  // 尝试从旧版本迁移
  try {
    const oldRaw = localStorage.getItem('gaokao_quiz_state')
    if (oldRaw) {
      const oldParsed = JSON.parse(oldRaw)
      return { ...DEFAULT_STATE, ...oldParsed }
    }
  } catch {}
  return { ...DEFAULT_STATE }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    // 清理旧版本 key
    localStorage.removeItem('gaokao_quiz_state')
  } catch {}
}

let globalState = loadState()
const listeners = new Set()

function setState(updater) {
  globalState = { ...globalState, ...updater(globalState) }
  saveState(globalState)
  listeners.forEach(fn => fn(globalState))
}

/** 获取今日日期字符串 */
function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}

/** 更新每日统计 */
function updateDailyStats(prev, isCorrect, timeSpent, questionId, wasWrong) {
  const today = getTodayStr()
  const stats = { ...(prev.dailyStats?.[today] || { answered: 0, correct: 0, wrong: 0, timeSpent: 0, newWrong: 0, conqueredPoints: 0 }) }
  stats.answered++
  stats.timeSpent += timeSpent || 0
  if (isCorrect) {
    stats.correct++
    if (wasWrong) stats.conqueredPoints++
  } else {
    stats.wrong++
    if (!wasWrong) stats.newWrong++
  }
  return { ...prev.dailyStats, [today]: stats }
}

/** 更新连续打卡 */
function updateStreak(prev) {
  const today = getTodayStr()
  const streak = { ...DEFAULT_STATE.streak, ...(prev.streak || {}) }
  
  // 更新每日目标进度
  const todayStats = prev.dailyStats?.[today] || { answered: 0 }
  streak.dailyProgress = todayStats.answered
  streak.dailyGoalDate = today

  // 如果今天还没记录过活跃
  if (streak.lastActiveDate !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().slice(0, 10)
    
    if (streak.lastActiveDate === yesterdayStr) {
      // 连续
      streak.current = (streak.current || 0) + 1
    } else {
      // 断了
      streak.current = 1
    }
    streak.lastActiveDate = today
    streak.longest = Math.max(streak.longest || 0, streak.current)
  }

  return streak
}

/** 计算错题下次复习日期（艾宾浩斯：1天、2天、4天、7天、15天、30天） */
const REVIEW_INTERVALS = [1, 2, 4, 7, 15, 30]
function getNextReviewDate(reviewCount, addedDate) {
  const idx = Math.min(reviewCount, REVIEW_INTERVALS.length - 1)
  const days = REVIEW_INTERVALS[idx]
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function useStore() {
  const [state, setLocalState] = useState(globalState)

  useEffect(() => {
    const listener = (newState) => setLocalState(newState)
    listeners.add(listener)
    return () => listeners.delete(listener)
  }, [])

  const login = useCallback((name) => {
    setState(prev => ({
      ...prev,
      currentUser: { name, id: Date.now().toString() },
    }))
  }, [])

  const logout = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentUser: null,
    }))
  }, [])

  const setSubject = useCallback((subjectId) => {
    setState(prev => ({ ...prev, currentSubject: subjectId }))
  }, [])

  const recordAnswer = useCallback((questionId, selected, correct, time) => {
    setState(prev => {
      const wasWrong = prev.wrongQuestions.includes(questionId)
      const newRecords = [...prev.answerRecords, { questionId, selected, correct, time, date: new Date().toISOString() }]
      let newWrong = [...prev.wrongQuestions]
      let newWrongMeta = { ...prev.wrongQuestionMeta }
      
      if (!correct && !newWrong.includes(questionId)) {
        newWrong.push(questionId)
        newWrongMeta[questionId] = {
          errorReason: null,
          addedDate: new Date().toISOString(),
          lastReviewDate: null,
          nextReviewDate: getNextReviewDate(0),
          reviewCount: 0,
        }
      } else if (correct && wasWrong) {
        // 答对后从错题本移除
        newWrong = newWrong.filter(id => id !== questionId)
        delete newWrongMeta[questionId]
      }
      
      const newDailyStats = updateDailyStats(prev, correct, time, questionId, wasWrong)
      const newStreak = updateStreak({ ...prev, dailyStats: newDailyStats })
      
      return {
        ...prev,
        answerRecords: newRecords,
        wrongQuestions: newWrong,
        wrongQuestionMeta: newWrongMeta,
        dailyStats: newDailyStats,
        streak: newStreak,
      }
    })
  }, [])

  const toggleFavorite = useCallback((questionId) => {
    setState(prev => {
      const newFav = prev.favorites.includes(questionId)
        ? prev.favorites.filter(id => id !== questionId)
        : [...prev.favorites, questionId]
      return { ...prev, favorites: newFav }
    })
  }, [])

  const clearWrongQuestion = useCallback((questionId) => {
    setState(prev => {
      const newMeta = { ...prev.wrongQuestionMeta }
      delete newMeta[questionId]
      return {
        ...prev,
        wrongQuestions: prev.wrongQuestions.filter(id => id !== questionId),
        wrongQuestionMeta: newMeta,
      }
    })
  }, [])

  /** 设置错题错因 */
  const setWrongReason = useCallback((questionId, reason) => {
    setState(prev => {
      const newMeta = { ...prev.wrongQuestionMeta }
      const existing = newMeta[questionId] || {
        addedDate: new Date().toISOString(),
        nextReviewDate: getNextReviewDate(0),
        reviewCount: 0,
      }
      newMeta[questionId] = { ...existing, errorReason: reason }
      return { ...prev, wrongQuestionMeta: newMeta }
    })
  }, [])

  /** 标记错题已复习 */
  const markWrongReviewed = useCallback((questionId) => {
    setState(prev => {
      const newMeta = { ...prev.wrongQuestionMeta }
      const existing = newMeta[questionId]
      if (existing) {
        const newCount = (existing.reviewCount || 0) + 1
        newMeta[questionId] = {
          ...existing,
          lastReviewDate: new Date().toISOString(),
          nextReviewDate: getNextReviewDate(newCount),
          reviewCount: newCount,
        }
      }
      return { ...prev, wrongQuestionMeta: newMeta }
    })
  }, [])

  /** 添加/更新笔记 */
  const setNote = useCallback((questionId, note) => {
    setState(prev => {
      const newNotes = { ...prev.notes }
      if (note && note.trim()) {
        newNotes[questionId] = note.trim()
      } else {
        delete newNotes[questionId]
      }
      return { ...prev, notes: newNotes }
    })
  }, [])

  /** 更新设置 */
  const updateSettings = useCallback((partial) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...partial },
    }))
  }, [])

  /** 设置每日目标 */
  const setDailyGoal = useCallback((goal) => {
    setState(prev => ({
      ...prev,
      streak: { ...prev.streak, dailyGoal: goal },
    }))
  }, [])

  /** 完成新手引导 */
  const completeOnboarding = useCallback(() => {
    setState(prev => ({ ...prev, onboardingCompleted: true }))
  }, [])

  /** 更新个人资料 */
  const updateProfile = useCallback((partial) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...partial },
    }))
  }, [])

  /** 更新筛选器（局部合并） */
  const updateFilters = useCallback((partial) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...partial },
    }))
  }, [])

  /** 重置筛选器 */
  const resetFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: { ...DEFAULT_STATE.filters },
    }))
  }, [])

  /** 导出全部数据（备份用） */
  const exportData = useCallback(() => {
    return JSON.stringify(globalState, null, 2)
  }, [])

  /** 导入数据（恢复用） */
  const importData = useCallback((jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr)
      setState(prev => ({
        ...DEFAULT_STATE,
        ...parsed,
        wrongQuestionMeta: { ...parsed.wrongQuestionMeta },
        notes: { ...parsed.notes },
        dailyStats: { ...parsed.dailyStats },
        streak: { ...DEFAULT_STATE.streak, ...(parsed.streak || {}) },
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
      }))
      return true
    } catch { return false }
  }, [])

  /** 保存考试记录 */
  const saveExamRecord = useCallback((record) => {
    setState(prev => {
      const examRecord = {
        ...record,
        id: `exam_${Date.now()}`,
        date: new Date().toISOString(),
      }
      let newWrong = [...prev.wrongQuestions]
      let newWrongMeta = { ...prev.wrongQuestionMeta }
      if (record.details) {
        record.details.forEach(d => {
          if (!d.correct && !newWrong.includes(d.questionId)) {
            newWrong.push(d.questionId)
            newWrongMeta[d.questionId] = {
              errorReason: null,
              addedDate: new Date().toISOString(),
              lastReviewDate: null,
              nextReviewDate: getNextReviewDate(0),
              reviewCount: 0,
            }
          }
        })
      }
      const newAnswerRecords = [...prev.answerRecords]
      if (record.details) {
        record.details.forEach(d => {
          newAnswerRecords.push({
            questionId: d.questionId,
            selected: d.selected,
            correct: d.correct,
            time: 0,
            date: new Date().toISOString(),
          })
        })
      }

      // 更新每日统计
      const today = getTodayStr()
      const stats = { ...(prev.dailyStats?.[today] || { answered: 0, correct: 0, wrong: 0, timeSpent: 0, newWrong: 0, conqueredPoints: 0 }) }
      if (record.details) {
        record.details.forEach(d => {
          stats.answered++
          if (d.correct) stats.correct++
          else { stats.wrong++; stats.newWrong++ }
        })
      }

      const newStreak = updateStreak({ ...prev, dailyStats: { ...prev.dailyStats, [today]: stats } })

      return {
        ...prev,
        examRecords: [examRecord, ...prev.examRecords],
        wrongQuestions: newWrong,
        wrongQuestionMeta: newWrongMeta,
        answerRecords: newAnswerRecords,
        dailyStats: { ...prev.dailyStats, [today]: stats },
        streak: newStreak,
      }
    })
  }, [])

  /** 获取待复习错题列表 */
  const getReviewQueue = useCallback(() => {
    const now = Date.now()
    return globalState.wrongQuestions.filter(id => {
      const meta = globalState.wrongQuestionMeta[id]
      if (!meta || !meta.nextReviewDate) return true
      return new Date(meta.nextReviewDate).getTime() <= now
    })
  }, [])

  /** 获取今日统计 */
  const getTodayStats = useCallback(() => {
    const today = getTodayStr()
    return globalState.dailyStats?.[today] || { answered: 0, correct: 0, wrong: 0, timeSpent: 0, newWrong: 0, conqueredPoints: 0 }
  }, [])

  return {
    ...state,
    login,
    logout,
    setSubject,
    recordAnswer,
    toggleFavorite,
    clearWrongQuestion,
    setWrongReason,
    markWrongReviewed,
    setNote,
    updateSettings,
    setDailyGoal,
    completeOnboarding,
    saveExamRecord,
    getReviewQueue,
    getTodayStats,
    updateProfile,
    updateFilters,
    resetFilters,
    exportData,
    importData,
  }
}
