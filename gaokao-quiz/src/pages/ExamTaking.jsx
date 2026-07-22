import { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { subjects } from '../data/subjects.js'
import { getModuleByPointId } from '../data/subjects.js'
import MathText from '../components/MathText.jsx'
import DraftPad from '../components/DraftPad.jsx'

const EXAM_CACHE_KEY = 'gaokao_exam_inprogress'

export default function ExamTaking() {
  const location = useLocation()
  const navigate = useNavigate()

  const config = location.state

  // 检查是否有中断的考试
  const [recoveryModal, setRecoveryModal] = useState(null)

  useEffect(() => {
    if (!config || !config.questions) {
      // 检查是否有缓存的中断考试
      try {
        const cached = localStorage.getItem(EXAM_CACHE_KEY)
        if (cached) {
          const parsed = JSON.parse(cached)
          setRecoveryModal(parsed)
        }
      } catch {}
    }
  }, [])

  // 如果没有考试配置且有恢复数据
  if (!config || !config.questions) {
    if (recoveryModal) {
      return (
        <div className="page-container">
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔄</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#2c2c2a' }}>
              发现未完成的考试
            </h2>
            <p style={{ fontSize: 14, color: '#888780', marginBottom: 20 }}>
              {recoveryModal.subjectName}模拟考试 · 已答 {Object.keys(recoveryModal.answers || {}).length} / {recoveryModal.questions?.length} 题
              <br />
              剩余时间：{Math.floor((recoveryModal.timeLeft || 0) / 60)}分{(recoveryModal.timeLeft || 0) % 60}秒
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  // 恢复考试
                  navigate('/exam/taking', { state: {
                    subject: recoveryModal.subject,
                    subjectName: recoveryModal.subjectName,
                    questions: recoveryModal.questions,
                    duration: recoveryModal.duration,
                    difficulty: recoveryModal.difficulty,
                    _recovery: recoveryModal,
                  }})
                }}
              >
                继续考试
              </button>
              <button
                className="btn-outline"
                onClick={() => {
                  localStorage.removeItem(EXAM_CACHE_KEY)
                  setRecoveryModal(null)
                  navigate('/exam')
                }}
              >
                放弃并重新开始
              </button>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>考试配置缺失，请重新开始考试。</p>
          <button className="btn-primary" onClick={() => navigate('/exam')}>
            返回考试设置
          </button>
        </div>
      </div>
    )
  }

  const { subject: subjectId, subjectName, questions, duration, difficulty, _recovery } = config
  const subject = subjects.find(s => s.id === subjectId) || subjects[0]

  const totalSeconds = duration * 60
  const [timeLeft, setTimeLeft] = useState(_recovery?.timeLeft || totalSeconds)
  const [currentIndex, setCurrentIndex] = useState(_recovery?.currentIndex || 0)
  const [answers, setAnswers] = useState(_recovery?.answers || {}) // { questionIndex: selectedOption }
  const [marks, setMarks] = useState(_recovery?.marks || {}) // { questionIndex: 'doubt' | 'todo' }
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const startTimeRef = useRef(_recovery?.startTime || Date.now())

  // 自动保存到 localStorage（每5秒）
  useEffect(() => {
    const saveInterval = setInterval(() => {
      try {
        localStorage.setItem(EXAM_CACHE_KEY, JSON.stringify({
          subject: subjectId,
          subjectName,
          questions,
          duration,
          difficulty,
          answers,
          marks,
          timeLeft,
          currentIndex,
          startTime: startTimeRef.current,
        }))
      } catch {}
    }, 5000)
    return () => clearInterval(saveInterval)
  }, [answers, marks, timeLeft, currentIndex, subjectId, subjectName, questions, duration, difficulty])

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 离开页面警告
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const answeredCount = Object.keys(answers).length
  const unansweredCount = questions.length - answeredCount
  const markedCount = Object.keys(marks).filter(k => marks[k]).length

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleSelect = (optionIndex) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }))
    // 选择后取消标记
    if (marks[currentIndex] === 'todo') {
      setMarks(prev => {
        const next = { ...prev }
        delete next[currentIndex]
        return next
      })
    }
  }

  const toggleMark = (type) => {
    setMarks(prev => {
      const next = { ...prev }
      if (next[currentIndex] === type) {
        delete next[currentIndex]
      } else {
        next[currentIndex] = type
      }
      return next
    })
  }

  const handleSubmit = (autoSubmit = false) => {
    // 清除缓存
    localStorage.removeItem(EXAM_CACHE_KEY)

    const timeUsed = Math.round((Date.now() - startTimeRef.current) / 1000)
    const details = questions.map((q, i) => ({
      questionId: q.id,
      selected: answers[i] !== undefined ? answers[i] : -1,
      correct: answers[i] !== undefined ? answers[i] === q.answer : false,
      content: q.content,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation,
      module: q.module,
      pointId: q.pointId,
      difficulty: q.difficulty,
      marked: marks[i] || null,
    }))

    const correct = details.filter(d => d.correct).length
    const wrong = details.filter(d => !d.correct && d.selected !== -1).length
    const unanswered = details.filter(d => d.selected === -1).length
    const score = Math.round((correct / questions.length) * 100)

    navigate('/exam/result', {
      state: {
        subject: subjectId,
        subjectName,
        score,
        total: questions.length,
        correct,
        wrong,
        unanswered,
        timeUsed,
        duration,
        autoSubmit,
        details,
      },
    })
  }

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers[currentIndex]
  const currentMark = marks[currentIndex]

  // 时间紧迫提示
  const isWarning = timeLeft <= 60
  const isUrgent = timeLeft <= 30

  return (
    <div className="page-container" style={{ maxWidth: 960, paddingBottom: 80 }}>
      {/* 考试顶栏 */}
      <div style={{
        position: 'sticky', top: 56, zIndex: 40,
        background: 'var(--nav-bg)', borderBottom: '1px solid var(--card-border)',
        padding: '12px 0', marginBottom: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
            📝 {subjectName}模拟考试
          </span>
          <span style={{
            fontSize: 12, padding: '2px 8px', borderRadius: 6,
            background: subject.colorLight, color: subject.color,
          }}>
            {difficulty === 'mixed' ? '混合难度' : difficulty === 'easy' ? '基础卷' : difficulty === 'medium' ? '提高卷' : '挑战卷'}
          </span>
          <span style={{ fontSize: 11, color: 'var(--sub-text)' }}>
            自动保存中
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            fontSize: 22, fontWeight: 700, fontFamily: 'monospace',
            color: isUrgent ? '#A32D2D' : isWarning ? '#D85A30' : 'var(--text)',
            animation: isUrgent ? 'pulse 1s infinite' : 'none',
          }}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setShowSubmitConfirm(true)}
            style={{
              padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
              background: '#A32D2D', color: 'white', border: 'none',
            }}
          >
            交卷
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* 左侧：题目区 */}
        <div className="exam-question-area" style={{ flex: 1, minWidth: 0 }}>
          {/* 题目进度 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: 'var(--sub-text)' }}>
              第 {currentIndex + 1} 题 / 共 {questions.length} 题
            </span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* 标记按钮 */}
              <button
                onClick={() => toggleMark('doubt')}
                style={{
                  fontSize: 12, padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
                  border: currentMark === 'doubt' ? '1.5px solid #D85A30' : '1.5px solid var(--card-border)',
                  background: currentMark === 'doubt' ? '#FFF0E6' : 'var(--card-bg)',
                  color: currentMark === 'doubt' ? '#D85A30' : 'var(--sub-text)',
                }}
              >
                {currentMark === 'doubt' ? '⚠️ 存疑' : '标记存疑'}
              </button>
              <button
                onClick={() => toggleMark('todo')}
                style={{
                  fontSize: 12, padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
                  border: currentMark === 'todo' ? '1.5px solid #534AB7' : '1.5px solid var(--card-border)',
                  background: currentMark === 'todo' ? '#EEEDFE' : 'var(--card-bg)',
                  color: currentMark === 'todo' ? '#534AB7' : 'var(--sub-text)',
                }}
              >
                {currentMark === 'todo' ? '📋 待做' : '标记待做'}
              </button>
              <span style={{ fontSize: 13, color: 'var(--sub-text)' }}>
                {'★'.repeat(currentQuestion.difficulty)}{'☆'.repeat(5 - currentQuestion.difficulty)}
              </span>
            </div>
          </div>

          {/* 进度条 */}
          <div style={{ height: 4, background: '#f0f0ee', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              height: '100%', background: subject.color, borderRadius: 2,
              transition: 'width 0.3s',
            }} />
          </div>

          {/* 题目卡片 */}
          <div className="card">
            {/* 题目标签 */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span className="tag tag-module" style={{ background: subject.colorLight, color: subject.color }}>
                {subjectName} · {getModuleByPointId(currentQuestion.pointId)?.name || '未分类'}
              </span>
              {currentAnswer !== undefined && (
                <span style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 6,
                  background: '#E8F5E0', color: '#3B6D11', fontWeight: 500,
                }}>
                  已作答
                </span>
              )}
              {currentMark === 'doubt' && (
                <span style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 6,
                  background: '#FFF0E6', color: '#D85A30', fontWeight: 500,
                }}>
                  ⚠️ 存疑
                </span>
              )}
              {currentMark === 'todo' && (
                <span style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 6,
                  background: '#EEEDFE', color: '#534AB7', fontWeight: 500,
                }}>
                  📋 待做
                </span>
              )}
            </div>

            {/* 题干 */}
            <div style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
              <MathText>{currentQuestion.content}</MathText>
            </div>

            {/* 选项 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentQuestion.options.map((opt, i) => {
                let className = 'option-btn'
                if (i === currentAnswer) className += ' selected'
                return (
                  <button
                    key={i}
                    className={className}
                    onClick={() => handleSelect(i)}
                  >
                    <span className="option-label">{String.fromCharCode(65 + i)}</span>
                    <MathText>{opt}</MathText>
                  </button>
                )
              })}
            </div>

            {/* 草稿板 */}
            <div style={{ marginTop: 12 }}>
              <DraftPad questionId={`exam_${currentQuestion.id}`} />
            </div>
          </div>

          {/* 上一题/下一题 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <button
              className="btn-outline"
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              style={{ opacity: currentIndex === 0 ? 0.4 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
            >
              ← 上一题
            </button>
            {currentIndex < questions.length - 1 ? (
              <button
                className="btn-primary"
                onClick={() => setCurrentIndex(i => i + 1)}
              >
                下一题 →
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={() => setShowSubmitConfirm(true)}
                style={{ background: '#A32D2D' }}
              >
                交卷
              </button>
            )}
          </div>
        </div>

        {/* 右侧：答题卡 */}
        <div className="exam-answer-card" style={{ width: 240, flexShrink: 0, position: 'sticky', top: 120 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
              答题卡
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--sub-text)', marginBottom: 12 }}>
              <span>已答 {answeredCount}</span>
              <span>未答 {unansweredCount}</span>
              {markedCount > 0 && <span style={{ color: '#D85A30' }}>标记 {markedCount}</span>}
            </div>

            {/* 答题卡网格 */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8,
              marginBottom: 16,
            }}>
              {questions.map((_, i) => {
                const isAnswered = answers[i] !== undefined
                const isCurrent = i === currentIndex
                const isDoubt = marks[i] === 'doubt'
                const isTodo = marks[i] === 'todo'

                let bg = 'var(--card-bg)'
                let textColor = 'var(--sub-text)'
                let borderColor = 'var(--card-border)'

                if (isCurrent) {
                  bg = subject.colorLight
                  textColor = subject.color
                  borderColor = subject.color
                } else if (isAnswered) {
                  bg = subject.color
                  textColor = 'white'
                  borderColor = subject.color
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    style={{
                      width: 32, height: 32, borderRadius: 6,
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      border: `1.5px solid ${borderColor}`,
                      background: bg,
                      color: textColor,
                      transition: 'all 0.15s',
                      position: 'relative',
                    }}
                  >
                    {i + 1}
                    {/* 标记角标 */}
                    {isDoubt && (
                      <span style={{
                        position: 'absolute', top: -2, right: -2,
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#D85A30', border: '1px solid var(--card-bg)',
                      }} />
                    )}
                    {isTodo && !isDoubt && (
                      <span style={{
                        position: 'absolute', top: -2, right: -2,
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#534AB7', border: '1px solid var(--card-bg)',
                      }} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* 图例 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--sub-text)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: subject.color }} />
                <span>已作答</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid var(--card-border)', background: 'var(--card-bg)' }} />
                <span>未作答</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D85A30' }} />
                <span>存疑</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#534AB7' }} />
                <span>待做</span>
              </div>
            </div>

            {/* 快捷跳转 */}
            <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
              <button
                onClick={() => {
                  const firstUnanswered = questions.findIndex((_, i) => answers[i] === undefined)
                  if (firstUnanswered >= 0) setCurrentIndex(firstUnanswered)
                }}
                style={{
                  flex: 1, fontSize: 11, padding: '4px 6px', borderRadius: 6, cursor: 'pointer',
                  border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--sub-text)',
                }}
              >
                跳到未答
              </button>
              <button
                onClick={() => {
                  const firstMarked = questions.findIndex((_, i) => marks[i])
                  if (firstMarked >= 0) setCurrentIndex(firstMarked)
                }}
                style={{
                  flex: 1, fontSize: 11, padding: '4px 6px', borderRadius: 6, cursor: 'pointer',
                  border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--sub-text)',
                }}
              >
                跳到标记
              </button>
            </div>

            {/* 交卷按钮 */}
            <button
              onClick={() => setShowSubmitConfirm(true)}
              style={{
                width: '100%', marginTop: 12, padding: '10px',
                borderRadius: 8, cursor: 'pointer',
                fontSize: 14, fontWeight: 600,
                background: '#A32D2D', color: 'white', border: 'none',
              }}
            >
              交卷
            </button>
          </div>
        </div>
      </div>

      {/* 交卷确认弹窗 */}
      {showSubmitConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowSubmitConfirm(false)}>
          <div
            className="card"
            style={{ width: 360, padding: 24, textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>
              确认交卷？
            </h3>
            {/* 答题统计 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#3B6D11' }}>{answeredCount}</div>
                <div style={{ fontSize: 11, color: 'var(--sub-text)' }}>已答</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#A32D2D' }}>{unansweredCount}</div>
                <div style={{ fontSize: 11, color: 'var(--sub-text)' }}>未答</div>
              </div>
              {markedCount > 0 && (
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#D85A30' }}>{markedCount}</div>
                  <div style={{ fontSize: 11, color: 'var(--sub-text)' }}>标记</div>
                </div>
              )}
            </div>
            {/* 警告 */}
            {unanswered > 0 && (
              <p style={{ fontSize: 13, color: '#D85A30', marginBottom: 8 }}>
                ⚠️ 还有 {unansweredCount} 题未作答
              </p>
            )}
            {markedCount > 0 && (
              <p style={{ fontSize: 13, color: '#D85A30', marginBottom: 8 }}>
                ⚠️ 有 {markedCount} 道标记题，建议检查后再交卷
              </p>
            )}
            <p style={{ fontSize: 12, color: 'var(--sub-text)', marginBottom: 16 }}>
              交卷后无法修改
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                className="btn-outline"
                onClick={() => setShowSubmitConfirm(false)}
                style={{ flex: 1 }}
              >
                继续答题
              </button>
              <button
                onClick={() => handleSubmit(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                  background: '#A32D2D', color: 'white', border: 'none',
                }}
              >
                确认交卷
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
