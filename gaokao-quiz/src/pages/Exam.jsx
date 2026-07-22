import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { subjects } from '../data/subjects.js'
import { useStore } from '../lib/store.js'
import { useBank, loadAllQuestions } from '../data/BankProvider.jsx'
import { isUnifiedSubject, isProvincialSubject, getPaperTypeForSubject, getProvince } from '../data/provinces.js'

const QUESTION_COUNTS = [10, 20, 30]
const DIFFICULTY_OPTIONS = [
  { value: 'mixed', label: '混合难度', desc: '随机抽取各难度题目' },
  { value: 'easy', label: '基础卷', desc: '难度 1-2 星为主' },
  { value: 'medium', label: '提高卷', desc: '难度 3-4 星为主' },
  { value: 'hard', label: '挑战卷', desc: '难度 4-5 星为主' },
]

export default function Exam() {
  const navigate = useNavigate()
  const { currentSubject, setSubject, examRecords, currentUser, profile } = useStore()

  const [questionCount, setQuestionCount] = useState(20)
  const [difficulty, setDifficulty] = useState('mixed')
  const [duration, setDuration] = useState(40) // minutes

  const bank = useBank()
  if (!bank) throw loadAllQuestions()

  const subject = subjects.find(s => s.id === currentSubject) || subjects[0]
  const selectedProvince = profile?.province || 'sichuan'
  const currentPaperType = getPaperTypeForSubject(currentSubject, selectedProvince)
  const isUnified = isUnifiedSubject(currentSubject)
  const isProvincial = isProvincialSubject(currentSubject)

  // 省份筛选
  const provinceFilter = (q) => {
    if (isProvincial && q.tags?.province && q.tags.province !== selectedProvince) return false
    if (isUnified && q.tags?.paperType && q.tags.paperType !== currentPaperType && q.tags.paperType !== 'provincial') return false
    return true
  }

  const subjectQuestions = bank.filter(q => q.subject === currentSubject && provinceFilter(q))

  // 各科目题目数
  const availableCount = subjectQuestions.length

  // 历史考试记录
  const subjectExams = examRecords.filter(e => e.subject === currentSubject)
  const bestScore = subjectExams.length > 0 ? Math.max(...subjectExams.map(e => e.score)) : 0
  const avgScore = subjectExams.length > 0
    ? Math.round(subjectExams.reduce((s, e) => s + e.score, 0) / subjectExams.length)
    : 0

  const handleStart = () => {
    // 根据难度过滤题目
    let pool = [...subjectQuestions]
    if (difficulty === 'easy') {
      pool = pool.filter(q => q.difficulty <= 2)
    } else if (difficulty === 'medium') {
      pool = pool.filter(q => q.difficulty >= 3 && q.difficulty <= 4)
    } else if (difficulty === 'hard') {
      pool = pool.filter(q => q.difficulty >= 4)
    }
    // 如果过滤后题目不够，从全量补充
    if (pool.length < questionCount) {
      const extra = subjectQuestions.filter(q => !pool.includes(q))
      pool = [...pool, ...extra]
    }
    // 打乱并截取
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]]
    }
    const examQuestions = pool.slice(0, questionCount)

    navigate('/exam/taking', {
      state: {
        subject: currentSubject,
        subjectName: subject.name,
        questions: examQuestions,
        duration, // minutes
        difficulty,
        questionCount,
      },
    })
  }

  return (
    <div className="page-container">
      {/* 科目选择器 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setSubject(s.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
              border: currentSubject === s.id ? `1.5px solid ${s.color}` : '1.5px solid #e7e5e4',
              background: currentSubject === s.id ? s.colorLight : 'white',
              color: currentSubject === s.id ? s.color : '#5F5E5A',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 16 }}>{s.icon}</span>
            {s.name}
          </button>
        ))}
      </div>

      {/* 考试说明区 */}
      <div style={{
        background: `linear-gradient(135deg, ${subject.color} 0%, ${subject.color}dd 100%)`,
        borderRadius: 16, padding: '1.5rem', color: 'white', marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>📝</span>
          <h1 style={{ fontSize: 22, fontWeight: 600 }}>
            {subject.name}模拟考试
          </h1>
        </div>
        <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 16 }}>
          模拟真实高考场景，限时作答，交卷后自动批阅并生成成绩单。答错的题会自动加入错题本。
        </p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 12, padding: '2px 8px', borderRadius: 5,
            background: 'rgba(255,255,255,0.15)',
          }}>
            {getProvince(selectedProvince)?.name || '通用'}
          </span>
          <span style={{
            fontSize: 12, padding: '2px 8px', borderRadius: 5,
            background: 'rgba(255,255,255,0.15)',
          }}>
            {isUnified ? '统考卷' : '省级自主命题'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{availableCount}</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>可用题目</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{subjectExams.length}</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>已考次数</div>
          </div>
          {subjectExams.length > 0 && (
            <>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{bestScore}</div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>最高分</div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{avgScore}</div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>平均分</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 考试设置 */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#2c2c2a' }}>
          考试设置
        </h2>

        {/* 题目数量 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: '#5F5E5A', display: 'block', marginBottom: 8 }}>
            题目数量
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            {QUESTION_COUNTS.map(n => (
              <button
                key={n}
                onClick={() => {
                  setQuestionCount(n)
                  setDuration(Math.ceil(n * 2))
                }}
                style={{
                  padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
                  fontSize: 15, fontWeight: 600,
                  border: questionCount === n ? `2px solid ${subject.color}` : '2px solid #e7e5e4',
                  background: questionCount === n ? subject.colorLight : 'white',
                  color: questionCount === n ? subject.color : '#888780',
                  transition: 'all 0.15s',
                }}
              >
                {n} 题
              </button>
            ))}
          </div>
        </div>

        {/* 难度选择 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: '#5F5E5A', display: 'block', marginBottom: 8 }}>
            试卷难度
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            {DIFFICULTY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDifficulty(opt.value)}
                style={{
                  padding: '10px 14px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  border: difficulty === opt.value ? `2px solid ${subject.color}` : '2px solid #e7e5e4',
                  background: difficulty === opt.value ? subject.colorLight : 'white',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  fontSize: 14, fontWeight: 600,
                  color: difficulty === opt.value ? subject.color : '#2c2c2a',
                }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: 12, color: '#888780', marginTop: 2 }}>
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 考试时长 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: '#5F5E5A', display: 'block', marginBottom: 8 }}>
            考试时长：{duration} 分钟
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              style={{ flex: 1, accentColor: subject.color }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {[10, 30, 60, 90].map(m => (
                <button
                  key={m}
                  onClick={() => setDuration(m)}
                  style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                    border: duration === m ? `1px solid ${subject.color}` : '1px solid #e7e5e4',
                    background: duration === m ? subject.colorLight : 'white',
                    color: duration === m ? subject.color : '#888780',
                  }}
                >
                  {m}分
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 开始考试按钮 */}
        <button
          onClick={handleStart}
          style={{
            width: '100%', padding: '14px', borderRadius: 10, cursor: 'pointer',
            fontSize: 16, fontWeight: 700,
            background: subject.color, color: 'white', border: 'none',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.opacity = 0.85}
          onMouseLeave={e => e.target.style.opacity = 1}
        >
          📝 开始考试
        </button>
        <p style={{ fontSize: 12, color: '#888780', textAlign: 'center', marginTop: 8 }}>
          开始后计时不可暂停，时间到自动交卷
        </p>
      </div>

      {/* 考试记录 */}
      {subjectExams.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#2c2c2a' }}>
            历史成绩
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {subjectExams.slice(0, 10).map((exam, idx) => {
              const examDate = new Date(exam.date)
              const dateStr = `${examDate.getMonth() + 1}/${examDate.getDate()} ${examDate.getHours()}:${String(examDate.getMinutes()).padStart(2, '0')}`
              const scoreColor = exam.score >= 80 ? '#3B6D11' : exam.score >= 60 ? '#D85A30' : '#A32D2D'
              return (
                <div key={exam.id} className="card" style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        fontSize: 20, fontWeight: 700, color: scoreColor,
                        minWidth: 40,
                      }}>
                        {exam.score}
                      </span>
                      <div>
                        <div style={{ fontSize: 13, color: '#2c2c2a' }}>
                          第 {subjectExams.length - idx} 次考试
                        </div>
                        <div style={{ fontSize: 12, color: '#888780' }}>
                          {dateStr} · {exam.questionCount}题 · 用时{Math.floor(exam.timeUsed / 60)}分{exam.timeUsed % 60}秒
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                      <span style={{ color: '#3B6D11' }}>对 {exam.correct}</span>
                      <span style={{ color: '#A32D2D' }}>错 {exam.wrong}</span>
                      {exam.unanswered > 0 && (
                        <span style={{ color: '#888780' }}>未答 {exam.unanswered}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
