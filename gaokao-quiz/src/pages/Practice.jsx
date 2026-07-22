import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import { getQuestionsByModule, getQuestionsBySubjectShuffled } from '../data/allQuestions.js'
import { useBank, loadAllQuestions } from '../data/BankProvider.jsx'
import { subjects, getModuleById, getModuleByPointId, getModulesBySubject } from '../data/subjects.js'
import { useStore } from '../lib/store.js'
import { getRecommendedQuestions } from '../lib/recommend.js'
import MathText from '../components/MathText.jsx'
import DraftPad from '../components/DraftPad.jsx'
import { isUnifiedSubject, isProvincialSubject, getPaperTypeForSubject } from '../data/provinces.js'
import { starsToCoef, GRADIENT_LEVELS } from '../lib/utils.js'

const DIFFICULTY_LEVELS = [
  { value: 'all', label: '全部难度', filter: () => true },
  { value: 'basic', label: '基础', filter: q => q.difficulty <= 2 },
  { value: 'medium', label: '中档', filter: q => q.difficulty === 3 },
  { value: 'hard', label: '压轴', filter: q => q.difficulty >= 4 },
]

export default function Practice() {
  const { subject: subjectId, module: moduleId, mode } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { recordAnswer, favorites, toggleFavorite, currentSubject, setSubject, answerRecords, notes, setNote, profile, filters } = useStore()

  const activeSubjectId = subjectId || currentSubject
  const subject = subjects.find(s => s.id === activeSubjectId) || subjects[0]
  const isSmartMode = moduleId === 'smart'
  const isRealExamMode = mode === 'real-exam'
  const isWrongExamMode = mode === 'wrong-exam'
  const isCustomMode = mode === 'custom'
  const gradientLevel = searchParams.get('level')
  const isGradientMode = mode === 'gradient' && gradientLevel
  const gradientConfig = GRADIENT_LEVELS.find(l => l.id === gradientLevel)
  const isNewMode = isRealExamMode || isWrongExamMode || isCustomMode || isGradientMode

  // 省份筛选
  const selectedProvince = profile?.province || 'sichuan'
  const currentPaperType = getPaperTypeForSubject(activeSubjectId, selectedProvince)
  const isUnified = isUnifiedSubject(activeSubjectId)
  const isProvincial = isProvincialSubject(activeSubjectId)

  // 省份/卷型过滤函数
  const provinceFilter = (q) => {
    if (isProvincial && q.tags?.province && q.tags.province !== selectedProvince) return false
    if (isUnified && q.tags?.paperType && q.tags.paperType !== currentPaperType && q.tags.paperType !== 'provincial') return false
    return true
  }

  // 侧边栏筛选器（年份/题型/难度/来源）
  const sidebarFilter = (q) => {
    if (filters.year && q.tags?.year !== filters.year) return false
    if (filters.questionTypes.length > 0 && !filters.questionTypes.includes(q.tags?.questionType)) return false
    const coef = q.tags?.difficultyStars ? Math.round(q.tags.difficultyStars / 5 * 100) / 100 : 0.4
    if (coef < filters.difficultyMin || coef > filters.difficultyMax) return false
    if (filters.source && q.tags?.source !== filters.source) return false
    if (filters.school && q.tags?.school !== filters.school) return false
    return true
  }

  // 合并筛选：省份 + 侧边栏
  const combinedFilter = (q) => provinceFilter(q) && sidebarFilter(q)

  // 难度和知识点选择
  const [difficulty, setDifficulty] = useState('all')
  const [selectedPointId, setSelectedPointId] = useState(null)
  const [showPointSelector, setShowPointSelector] = useState(false)
  const [showNoteEditor, setShowNoteEditor] = useState(false)
  const [noteText, setNoteText]             = useState('')
  const [showErrorReport, setShowErrorReport] = useState(false)
  const [errorReportType, setErrorReportType] = useState('')

  // 新模式状态
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedWrongIds, setSelectedWrongIds] = useState([])
  const [customCriteria, setCustomCriteria] = useState({ modules: [], difficulty: 'all', count: 20 })
  const [customSetupDone, setCustomSetupDone] = useState(false)

  useEffect(() => {
    if (subjectId && subjectId !== currentSubject) {
      setSubject(subjectId)
    }
  }, [subjectId])

  // 重置自定义组卷状态
  useEffect(() => {
    if (!isCustomMode) {
      setCustomSetupDone(false)
    }
  }, [isCustomMode])

  const bank = useBank()
  if (!bank) throw loadAllQuestions()

  // 题目池 key：只有"模式/科目/筛选条件"变化时才重新生成并打乱，
  // 之后的切题、提交答案都不会触发重新打乱，避免题目乱跳。
  const poolKey = [
    activeSubjectId,
    isRealExamMode ? 'real'
      : isGradientMode ? 'grad:' + (gradientConfig?.id || '')
      : isWrongExamMode ? 'wrong:' + selectedWrongIds.join(',')
      : isCustomMode ? 'custom' + (customSetupDone
          ? ':' + customCriteria.count + ':' + customCriteria.difficulty + ':' + customCriteria.modules.join(',')
          : '')
      : isSmartMode ? 'smart'
      : moduleId ? 'mod:' + moduleId
      : 'rand',
    selectedProvince, currentPaperType,
    filters.source || '', filters.school || '', filters.year || '',
    filters.questionTypes.join(','), filters.difficultyMin, filters.difficultyMax,
    selectedYear,
  ].join('|')

  // 根据题目池 key 生成一次题目（含必要的随机打乱），之后复用缓存
  const buildPool = () => {
    if (isRealExamMode) {
      let allQ = bank.filter(q => q.subject === activeSubjectId && q.tags?.source === 'gaokao' && combinedFilter(q))
      if (allQ.length === 0) allQ = bank.filter(q => q.subject === activeSubjectId && q.tags?.source === 'gaokao' && provinceFilter(q))
      if (allQ.length === 0) allQ = bank.filter(q => q.subject === activeSubjectId && q.tags?.source === 'gaokao')
      if (allQ.length === 0) allQ = bank.filter(q => q.subject === activeSubjectId)
      return selectedYear ? allQ.filter(q => q.tags?.year === parseInt(selectedYear)) : allQ
    }
    if (isGradientMode && gradientConfig) {
      let allQ = bank.filter(q => {
        if (q.subject !== activeSubjectId) return false
        if (!combinedFilter(q)) return false
        const coef = starsToCoef(q.tags?.difficultyStars || q.difficulty || 2)
        return coef >= gradientConfig.min && coef <= gradientConfig.max
      })
      if (allQ.length === 0) allQ = bank.filter(q => {
        if (q.subject !== activeSubjectId) return false
        if (!provinceFilter(q)) return false
        const coef = starsToCoef(q.tags?.difficultyStars || q.difficulty || 2)
        return coef >= gradientConfig.min && coef <= gradientConfig.max
      })
      if (allQ.length === 0) allQ = bank.filter(q => {
        if (q.subject !== activeSubjectId) return false
        const coef = starsToCoef(q.tags?.difficultyStars || q.difficulty || 2)
        return coef >= gradientConfig.min && coef <= gradientConfig.max
      })
      // 仅生成题目池时打乱一次
      const arr = [...allQ]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr.slice(0, 20)
    }
    if (isWrongExamMode) {
      const wrongIds = answerRecords.filter(r => !r.correct).map(r => r.questionId)
      const idsToUse = selectedWrongIds.length > 0 ? selectedWrongIds : wrongIds
      let list = idsToUse.map(id => bank.find(q => q.id === id)).filter(Boolean)
      if (list.length === 0) list = getQuestionsBySubjectShuffled(activeSubjectId, 10)
      return list
    }
    if (isCustomMode && customSetupDone) {
      let candidates = getQuestionsBySubjectShuffled(activeSubjectId, 500).filter(combinedFilter)
      if (candidates.length === 0) candidates = getQuestionsBySubjectShuffled(activeSubjectId, 500).filter(provinceFilter)
      if (candidates.length === 0) candidates = getQuestionsBySubjectShuffled(activeSubjectId, 500)
      if (customCriteria.modules.length > 0) candidates = candidates.filter(q => customCriteria.modules.includes(q.module))
      if (customCriteria.difficulty !== 'all') {
        const diffFilter = DIFFICULTY_LEVELS.find(d => d.value === customCriteria.difficulty)?.filter
        if (diffFilter) candidates = candidates.filter(diffFilter)
      }
      let list = candidates.slice(0, customCriteria.count)
      if (list.length === 0) list = getQuestionsBySubjectShuffled(activeSubjectId, customCriteria.count)
      return list
    }
    if (isSmartMode) {
      const { questions } = getRecommendedQuestions(activeSubjectId, answerRecords, 15)
      return questions
    }
    if (moduleId) {
      let moduleList = getQuestionsByModule(moduleId).filter(combinedFilter)
      if (moduleList.length === 0) {
        const provinceList = getQuestionsByModule(moduleId).filter(provinceFilter)
        moduleList = provinceList.length > 0 ? provinceList : getQuestionsByModule(moduleId)
      }
      if (moduleList.length === 0) moduleList = getQuestionsBySubjectShuffled(activeSubjectId, 15)
      return moduleList
    }
    // 默认随机练习
    const shuffled = getQuestionsBySubjectShuffled(activeSubjectId, 15).filter(combinedFilter)
    if (shuffled.length > 0) return shuffled
    const provinceShuffled = getQuestionsBySubjectShuffled(activeSubjectId, 15).filter(provinceFilter)
    if (provinceShuffled.length > 0) return provinceShuffled
    return getQuestionsBySubjectShuffled(activeSubjectId, 15)
  }

  const poolRef = useRef(null)
  if (!poolRef.current || poolRef.current.key !== poolKey) {
    poolRef.current = { key: poolKey, pool: buildPool() }
  }
  const basePool = poolRef.current.pool

  // 实时筛选（难度 / 知识点）叠在题目池之上，不改写题目顺序，避免乱跳
  const questionList = useMemo(() => {
    let list = basePool
    if (!isCustomMode) {
      const diffFilter = DIFFICULTY_LEVELS.find(d => d.value === difficulty)?.filter
      if (diffFilter) list = list.filter(diffFilter)
    }
    if (selectedPointId) list = list.filter(q => q.pointId === selectedPointId)
    return list.length > 0 ? list : basePool
  }, [basePool, difficulty, selectedPointId, isCustomMode])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0, total: 0 })

  // 题目池变化时（切换模式/筛选条件），回到第一题；清空本次正确率统计
  const currentQuestion = questionList[Math.min(currentIndex, Math.max(0, questionList.length - 1))]

  useEffect(() => {
    setCurrentIndex(0)
    setSelected(null)
    setSubmitted(false)
    setStartTime(Date.now())
    setSessionStats({ correct: 0, wrong: 0, total: 0 })
    setSelectedPointId(null)
  }, [moduleId, activeSubjectId, difficulty])

  // 题目池变化（如切换侧边栏筛选）时，回到第一题，但保留本次正确率统计
  useEffect(() => {
    setCurrentIndex(0)
    setSelected(null)
    setSubmitted(false)
    setStartTime(Date.now())
  }, [poolKey])

  const handleSubmit = () => {
    if (selected === null) return
    const correct = selected === currentQuestion.answer
    const time = Math.round((Date.now() - startTime) / 1000)
    recordAnswer(currentQuestion.id, selected, correct, time)
    setSubmitted(true)
    setSessionStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (correct ? 0 : 1),
      total: prev.total + 1,
    }))
  }

  const handleNext = () => {
    if (currentIndex < questionList.length - 1) {
      setCurrentIndex(i => i + 1)
      setSelected(null)
      setSubmitted(false)
      setStartTime(Date.now())
    } else {
      navigate('/')
    }
  }

  const currentModule = moduleId && !isSmartMode ? getModuleById(moduleId) : null
  const isFavorited = currentQuestion && favorites.includes(currentQuestion.id)

  // 当前模块的知识点列表
  const availablePoints = useMemo(() => {
    if (currentModule) {
      return currentModule.points || []
    }
    return getModulesBySubject(activeSubjectId).flatMap(m => m.points || [])
  }, [currentModule, activeSubjectId])

  if (!currentQuestion) {
    return <div className="page-container"><div className="empty-state">暂无题目</div></div>
  }

  const recommendReason = currentQuestion._recommendReason
  const recommendMastery = currentQuestion._mastery
  const sessionAcc = sessionStats.total > 0 ? Math.round(sessionStats.correct / sessionStats.total * 100) : 0

  return (
    <div className="page-container">
      {/* 顶部信息 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {/* 科目切换 */}
            {subjects.map(s => (
              <Link
                key={s.id}
                to={`/practice/${s.id}`}
                onClick={() => setSubject(s.id)}
                style={{
                  fontSize: 13, padding: '2px 10px', borderRadius: 6, textDecoration: 'none',
                  background: activeSubjectId === s.id ? s.color : '#f5f5f4',
                  color: activeSubjectId === s.id ? 'white' : '#888780',
                  fontWeight: activeSubjectId === s.id ? 500 : 400,
                }}
              >
                {s.icon} {s.name}
              </Link>
            ))}
            <span style={{ margin: '0 6px', color: '#d4d4d4' }}>/</span>
            {isSmartMode ? (
              <span style={{ fontSize: 13, color: subject.color, fontWeight: 600 }}>
                智能推荐
              </span>
            ) : isRealExamMode ? (
              <span style={{ fontSize: 13, color: subject.color, fontWeight: 600 }}>
                📄 真题练习
              </span>
            ) : isWrongExamMode ? (
              <span style={{ fontSize: 13, color: subject.color, fontWeight: 600 }}>
                📝 错题组卷
              </span>
            ) : isCustomMode ? (
              <span style={{ fontSize: 13, color: subject.color, fontWeight: 600 }}>
                🎯 自定义组卷
              </span>
            ) : isGradientMode && gradientConfig ? (
              <span style={{ fontSize: 13, color: gradientConfig.color, fontWeight: 600 }}>
                {gradientConfig.icon} {gradientConfig.title} · {gradientConfig.subtitle}
              </span>
            ) : currentModule ? (
              <>
                <Link to={`/practice/${activeSubjectId}`} style={{ fontSize: 13, color: subject.color, textDecoration: 'none' }}>
                  全部模块
                </Link>
                <span style={{ margin: '0 6px', color: '#d4d4d4' }}>/</span>
                <span style={{ fontSize: 13, color: '#5F5E5A' }}>{currentModule.name}</span>
              </>
            ) : (
              <span style={{ fontSize: 13, color: '#888780' }}>随机练习</span>
            )}
          </div>
          {/* 本次练习统计 */}
          {sessionStats.total > 0 && (
            <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
              <span style={{ color: '#3B6D11' }}>对 {sessionStats.correct}</span>
              <span style={{ color: '#A32D2D' }}>错 {sessionStats.wrong}</span>
              <span style={{ color: '#534AB7' }}>正确率 {sessionAcc}%</span>
            </div>
          )}
        </div>

        {/* 进度条 */}
        <div style={{ height: 4, background: '#f0f0ee', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${((currentIndex + 1) / questionList.length) * 100}%`,
            height: '100%',
            background: isSmartMode
              ? `linear-gradient(90deg, ${subject.color}, ${subject.color}aa)`
              : subject.color,
            borderRadius: 2,
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      {/* 难度 + 知识点筛选条 */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <span style={{ fontSize: 12, color: '#888780' }}>难度：</span>
        {DIFFICULTY_LEVELS.map(d => (
          <button
            key={d.value}
            onClick={() => setDifficulty(d.value)}
            style={{
              fontSize: 12, padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
              border: difficulty === d.value ? `1.5px solid ${subject.color}` : '1.5px solid #e7e5e4',
              background: difficulty === d.value ? subject.colorLight : 'white',
              color: difficulty === d.value ? subject.color : '#888780',
              fontWeight: difficulty === d.value ? 600 : 400,
            }}
          >
            {d.label}
          </button>
        ))}
        {availablePoints.length > 1 && (
          <>
            <span style={{ fontSize: 12, color: '#888780', marginLeft: 8 }}>知识点：</span>
            <button
              onClick={() => { setSelectedPointId(null); setShowPointSelector(false) }}
              style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
                border: !selectedPointId ? `1.5px solid ${subject.color}` : '1.5px solid #e7e5e4',
                background: !selectedPointId ? subject.colorLight : 'white',
                color: !selectedPointId ? subject.color : '#888780',
              }}
            >
              全部
            </button>
            <select
              value={selectedPointId || ''}
              onChange={e => setSelectedPointId(e.target.value || null)}
              style={{
                fontSize: 12, padding: '3px 8px', borderRadius: 6,
                border: '1.5px solid #e7e5e4', background: 'white', color: '#5F5E5A',
                cursor: 'pointer',
              }}
            >
              <option value="">选择知识点...</option>
              {availablePoints.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* 新模式控件 */}
      {isRealExamMode && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#888780' }}>年份：</span>
          {['2026', '2025', '2024', '2023', '2022'].map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
                border: selectedYear === year ? `1.5px solid ${subject.color}` : '1.5px solid #e7e5e4',
                background: selectedYear === year ? subject.colorLight : 'white',
                color: selectedYear === year ? subject.color : '#888780',
              }}
            >
              {year}
            </button>
          ))}
          <button
            onClick={() => setSelectedYear('')}
            style={{
              fontSize: 12, padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
              border: !selectedYear ? `1.5px solid ${subject.color}` : '1.5px solid #e7e5e4',
              background: !selectedYear ? subject.colorLight : 'white',
              color: !selectedYear ? subject.color : '#888780',
            }}
          >全部年份</button>
        </div>
      )}

      {isWrongExamMode && (
        <div style={{
          background: '#FFF0F0', borderRadius: 10, padding: '10px 14px',
          marginBottom: 12, border: '1px solid #FFD0D0',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#A32D2D', marginBottom: 6 }}>
            📝 错题组卷模式
          </div>
          <div style={{ fontSize: 12, color: '#5F5E5A' }}>
            已从错题本加载 {answerRecords.filter(r => !r.correct).length} 道错题
          </div>
        </div>
      )}

      {isCustomMode && !customSetupDone && (
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#534AB7', marginBottom: 12 }}>
            🎯 自定义组卷设置
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, color: '#5F5E5A', marginBottom: 6 }}>题目数量</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[10, 15, 20, 30, 50].map(n => (
                  <button
                    key={n}
                    onClick={() => setCustomCriteria(prev => ({ ...prev, count: n }))}
                    style={{
                      fontSize: 13, padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                      border: customCriteria.count === n ? `2px solid ${subject.color}` : '1.5px solid #e7e5e4',
                      background: customCriteria.count === n ? subject.colorLight : 'white',
                      color: customCriteria.count === n ? subject.color : '#5F5E5A',
                      fontWeight: customCriteria.count === n ? 600 : 400,
                    }}
                  >
                    {n} 题
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#5F5E5A', marginBottom: 6 }}>难度筛选</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {DIFFICULTY_LEVELS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => setCustomCriteria(prev => ({ ...prev, difficulty: d.value }))}
                    style={{
                      fontSize: 13, padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                      border: customCriteria.difficulty === d.value ? `2px solid ${subject.color}` : '1.5px solid #e7e5e4',
                      background: customCriteria.difficulty === d.value ? subject.colorLight : 'white',
                      color: customCriteria.difficulty === d.value ? subject.color : '#5F5E5A',
                      fontWeight: customCriteria.difficulty === d.value ? 600 : 400,
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#5F5E5A', marginBottom: 6 }}>选择模块（可多选）</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {getModulesBySubject(activeSubjectId).map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setCustomCriteria(prev => {
                        const modules = prev.modules.includes(m.id)
                          ? prev.modules.filter(id => id !== m.id)
                          : [...prev.modules, m.id]
                        return { ...prev, modules }
                      })
                    }}
                    style={{
                      fontSize: 13, padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                      border: customCriteria.modules.includes(m.id) ? `2px solid ${subject.color}` : '1.5px solid #e7e5e4',
                      background: customCriteria.modules.includes(m.id) ? subject.colorLight : 'white',
                      color: customCriteria.modules.includes(m.id) ? subject.color : '#5F5E5A',
                      fontWeight: customCriteria.modules.includes(m.id) ? 600 : 400,
                    }}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="btn-primary"
              style={{ fontSize: 15, padding: '10px 24px', marginTop: 8 }}
              onClick={() => setCustomSetupDone(true)}
            >
              开始练习
            </button>
          </div>
        </div>
      )}

      {isCustomMode && customSetupDone && (
        <div style={{
          background: '#F0F0FF', borderRadius: 10, padding: '10px 14px',
          marginBottom: 12, border: '1px solid #D0D0FF',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
        }}>
          <div style={{ fontSize: 13, color: '#534AB7' }}>
            🎯 自定义组卷：{customCriteria.count}题
            {customCriteria.modules.length > 0 && (
              <span style={{ marginLeft: 8, color: '#888780' }}>
                · {customCriteria.modules.map(id => {
                    const mod = getModulesBySubject(activeSubjectId).find(m => m.id === id)
                    return mod ? mod.name : '未知模块'
                  }).join('、')}
              </span>
            )}
            {customCriteria.difficulty !== 'all' && (
              <span style={{ marginLeft: 8, color: '#888780' }}>
                · {DIFFICULTY_LEVELS.find(d => d.value === customCriteria.difficulty)?.label}
              </span>
            )}
          </div>
          <button
            className="btn-outline"
            style={{ fontSize: 12, padding: '4px 12px' }}
            onClick={() => setCustomSetupDone(false)}
          >
            重新设置
          </button>
        </div>
      )}

      {/* 梯度训练信息卡 */}
      {isGradientMode && gradientConfig && (
        <div style={{
          background: gradientConfig.colorLight,
          borderRadius: 10,
          padding: '10px 14px',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: `1px solid ${gradientConfig.color}22`,
        }}>
          <span style={{ fontSize: 16 }}>{gradientConfig.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: gradientConfig.color }}>
              {gradientConfig.title} · {gradientConfig.label}题 (难度系数 {gradientConfig.min}-{gradientConfig.max})
            </div>
            <div style={{ fontSize: 12, color: 'var(--sub-text-2)', marginTop: 2 }}>
              {gradientConfig.desc}
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: gradientConfig.color }}>
            {questionList.length} 题
          </span>
        </div>
      )}

      {/* 智能推荐信息卡 */}
      {isSmartMode && recommendReason && (
        <div style={{
          background: subject.colorLight,
          borderRadius: 10,
          padding: '10px 14px',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: `1px solid ${subject.color}22`,
        }}>
          <span style={{ fontSize: 16 }}>✦</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: subject.color }}>
              推荐理由
            </div>
            <div style={{ fontSize: 13, color: '#5F5E5A', marginTop: 2 }}>
              {recommendReason}
              {recommendMastery !== null && recommendMastery > 0 && (
                <span style={{ marginLeft: 8, color: '#888780' }}>
                  · 当前掌握度 {recommendMastery}%
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 题目卡片 */}
      <div className="card">
        {/* 题目标签 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <span className="tag tag-module" style={{ background: subject.colorLight, color: subject.color }}>
            {subject.name} · {getModuleByPointId(currentQuestion.pointId)?.name || '未分类'}
          </span>
          <span className="tag tag-difficulty">
            {'★'.repeat(currentQuestion.difficulty)}{'☆'.repeat(5 - currentQuestion.difficulty)}
          </span>
          {isSmartMode && currentQuestion._recommendPriority >= 85 && (
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 6,
              background: '#FFF0E6', color: '#D85A30', fontWeight: 600,
            }}>
              优先突破
            </span>
          )}
          {currentQuestion.difficulty <= 2 && (
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 6,
              background: '#E8F5E0', color: '#3B6D11', fontWeight: 500,
            }}>
              基础题
            </span>
          )}
          {currentQuestion.difficulty >= 4 && (
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 6,
              background: '#FDE8E8', color: '#A32D2D', fontWeight: 500,
            }}>
              拔高题
            </span>
          )}
        </div>

        {/* 题干 */}
        <div style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
          <MathText>{currentQuestion.content}</MathText>
        </div>

        {/* 选项 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {currentQuestion.options.map((opt, i) => {
            let className = 'option-btn'
            if (submitted) {
              if (i === currentQuestion.answer) className += ' correct'
              else if (i === selected) className += ' wrong'
            } else if (i === selected) {
              className += ' selected'
            }
            return (
              <button
                key={i}
                className={className}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
              >
                <span className="option-label">{String.fromCharCode(65 + i)}</span>
                <MathText>{opt}</MathText>
              </button>
            )
          })}
        </div>

        {/* 解析（提交后显示） */}
        {submitted && (
          <div style={{
            background: '#F8F7FE', borderRadius: 10, padding: 16, marginBottom: 16,
            border: '0.5px solid #CECBF6',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 14, fontWeight: 600,
                color: selected === currentQuestion.answer ? '#3B6D11' : '#A32D2D',
              }}>
                {selected === currentQuestion.answer ? '✅ 回答正确' : '❌ 回答错误'}
              </span>
              <span style={{ fontSize: 13, color: '#888780' }}>
                正确答案：{String.fromCharCode(65 + currentQuestion.answer)}
              </span>
              <span style={{ fontSize: 13, color: '#888780', marginLeft: 'auto' }}>
                用时 {Math.round((Date.now() - startTime) / 1000)}s
              </span>
              {/* 纠错按钮 */}
              <button
                onClick={() => setShowErrorReport(true)}
                style={{
                  border: '1px solid #e7e5e4', borderRadius: 6,
                  padding: '2px 10px', fontSize: 11, color: '#888780',
                  background: 'white', cursor: 'pointer', marginLeft: 8,
                }}
              >⚠ 题目纠错</button>
            </div>

            {/* 第一层：标准答案 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#534AB7', marginBottom: 4 }}>📖 标准答案</div>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: '#444441' }}>
                <MathText>{(currentQuestion.explanationLayers && currentQuestion.explanationLayers.standard) || currentQuestion.explanation || '（暂无解析）'}</MathText>
              </div>
            </div>

            {/* 第二层：采分点步骤 */}
            {currentQuestion.explanationLayers?.scoring && (
              <div style={{ marginBottom: 12, background: 'white', borderRadius: 8, padding: '8px 12px', border: '0.5px solid #e7e5e4' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#D85A30', marginBottom: 4 }}>🎯 高考采分点</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: '#5F5E5A' }}>
                  <MathText>{currentQuestion.explanationLayers.scoring}</MathText>
                </div>
              </div>
            )}

            {/* 第三层：易错陷阱 + 解题技巧 */}
            {currentQuestion.explanationLayers?.tips && (
              <div style={{ marginBottom: 12, background: '#FFF0E6', borderRadius: 8, padding: '8px 12px', border: '0.5px solid #D85A3022' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#D85A30', marginBottom: 4 }}>💡 易错提醒</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: '#5F5E5A' }}>
                  <MathText>{currentQuestion.explanationLayers.tips}</MathText>
                </div>
              </div>
            )}

            {/* 笔记编辑 */}
            {showNoteEditor ? (
              <div style={{ marginTop: 12 }}>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="记录解题技巧、易错点..."
                  style={{
                    width: '100%', minHeight: 50, padding: 8, borderRadius: 8,
                    border: '1.5px solid #e7e5e4', fontSize: 13, resize: 'vertical',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    className="btn-primary"
                    style={{ fontSize: 12, padding: '4px 12px' }}
                    onClick={() => {
                      setNote(currentQuestion.id, noteText)
                      setShowNoteEditor(false)
                      setNoteText('')
                    }}
                  >
                    保存
                  </button>
                  <button
                    className="btn-outline"
                    style={{ fontSize: 12, padding: '4px 12px' }}
                    onClick={() => { setShowNoteEditor(false); setNoteText('') }}
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 8 }}>
                {notes[currentQuestion.id] && (
                  <div style={{
                    background: 'white', borderRadius: 8, padding: '8px 12px',
                    fontSize: 13, color: '#534AB7', marginBottom: 4, lineHeight: 1.6,
                  }}>
                    📝 {notes[currentQuestion.id]}
                  </div>
                )}
                <button
                  className="btn-outline"
                  style={{ fontSize: 12, padding: '2px 10px' }}
                  onClick={() => { setShowNoteEditor(true); setNoteText(notes[currentQuestion.id] || '') }}
                >
                  {notes[currentQuestion.id] ? '编辑笔记' : '添加笔记'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 草稿板 */}
        <div style={{ marginTop: 4 }}>
          <DraftPad questionId={currentQuestion.id} />
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          {!submitted ? (
            <button className="btn-primary" onClick={handleSubmit} disabled={selected === null}>
              提交答案
            </button>
          ) : (
            <button className="btn-primary" onClick={handleNext}>
              {currentIndex < questionList.length - 1 ? '下一题' : '完成练习'}
            </button>
          )}
          <button
            className="btn-outline"
            onClick={() => toggleFavorite(currentQuestion.id)}
          >
            {isFavorited ? '★ 已收藏' : '☆ 收藏'}
          </button>
          {!submitted && (
            <button
              className="btn-outline"
              onClick={() => {
                setSelected(currentQuestion.answer)
                setSubmitted(true)
              }}
            >
              直接看答案
            </button>
          )}
          {/* 朗读题目 */}
          <button
            className="btn-outline"
            style={{ fontSize: 13 }}
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(
                currentQuestion.content.replace(/\$\$.*?\$\$/g, '数学公式').replace(/\$.*?\$/g, '数学公式')
              )
              utterance.lang = 'zh-CN'
              utterance.rate = 0.9
              speechSynthesis.cancel()
              speechSynthesis.speak(utterance)
            }}
          >
            🔊 朗读
          </button>
        </div>
      </div>

      {/* 底部模块切换 */}
      {!moduleId && !isSmartMode && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#5F5E5A', marginBottom: 8 }}>
            {subject.name}专项练习
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {getModulesBySubject(activeSubjectId).map(m => (
              <Link
                key={m.id}
                to={`/practice/${activeSubjectId}/${m.id}`}
                className="tag tag-module"
                style={{
                  textDecoration: 'none', cursor: 'pointer',
                  background: subject.colorLight, color: subject.color,
                }}
              >
                {m.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 题目纠错弹窗 — 在 page-container 内部 */}
      {showErrorReport && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.35)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowErrorReport(false)}>
          <div
            className="card"
            style={{ width: '92%', maxWidth: 420, padding: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#2c2c2a' }}>
              ⚠ 题目纠错
            </div>
            <div style={{ fontSize: 13, color: '#888780', marginBottom: 12 }}>
              题目：{(currentQuestion.content || '').slice(0, 40).replace(/\$.*?\$/g, '...')}...
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {[
                { value: 'answer-wrong',   label: '答案错误' },
                { value: 'formula-bad',    label: '公式错乱/渲染异常' },
                { value: 'ambiguous',      label: '题干歧义/条件缺失' },
                { value: 'out-of-syllabus', label: '超纲题型' },
                { value: 'explanation-bad',  label: '解析看不懂/有误' },
                { value: 'image-bad',      label: '图片模糊/缺失' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    const reports = JSON.parse(localStorage.getItem('error_reports') || '[]')
                    reports.push({
                      questionId: currentQuestion.id,
                      type: opt.value,
                      label: opt.label,
                      time: new Date().toISOString(),
                    })
                    localStorage.setItem('error_reports', JSON.stringify(reports))
                    setShowErrorReport(false)
                    alert('感谢纠错！提交成功。')
                  }}
                  style={{
                    border: '1px solid #e7e5e4', borderRadius: 8,
                    padding: '8px 12px', fontSize: 13, cursor: 'pointer',
                    background: 'white',
                    textAlign: 'left', width: '100%',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              className="btn-outline"
              style={{ width: '100%', fontSize: 13 }}
              onClick={() => setShowErrorReport(false)}
            >取消</button>
          </div>
        </div>
      )}
    </div>
  )
}
