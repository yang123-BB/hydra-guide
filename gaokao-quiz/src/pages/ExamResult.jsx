import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { subjects, getModuleByPointId } from '../data/subjects.js'
import { useStore } from '../lib/store.js'
import MathText from '../components/MathText.jsx'

export default function ExamResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const { saveExamRecord } = useStore()

  const result = location.state

  // 保存考试记录（只保存一次）
  useEffect(() => {
    if (result && !result._saved) {
      saveExamRecord({
        subject: result.subject,
        score: result.score,
        total: result.total,
        correct: result.correct,
        wrong: result.wrong,
        unanswered: result.unanswered,
        timeUsed: result.timeUsed,
        duration: result.duration,
        questionCount: result.total,
        details: result.details.map(d => ({
          questionId: d.questionId,
          selected: d.selected,
          correct: d.correct,
        })),
      })
      result._saved = true
    }
  }, [])

  if (!result) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>成绩数据缺失。</p>
          <button className="btn-primary" onClick={() => navigate('/exam')}>
            返回考试设置
          </button>
        </div>
      </div>
    )
  }

  const { subject: subjectId, subjectName, score, total, correct, wrong, unanswered, timeUsed, autoSubmit, details } = result
  const subject = subjects.find(s => s.id === subjectId) || subjects[0]

  const scoreColor = score >= 80 ? '#3B6D11' : score >= 60 ? '#D85A30' : '#A32D2D'
  const scoreBg = score >= 80 ? '#E8F5E0' : score >= 60 ? '#FFF0E6' : '#FDE8E8'
  const passText = score >= 80 ? '优秀' : score >= 60 ? '及格' : '不及格'

  const accuracy = Math.round((correct / total) * 100)
  const minutes = Math.floor(timeUsed / 60)
  const seconds = timeUsed % 60

  // 按模块统计
  const moduleStats = useMemo(() => {
    const map = {}
    details.forEach(d => {
      const moduleName = getModuleByPointId(d.pointId)?.name || '未分类'
      if (!map[moduleName]) {
        map[moduleName] = { total: 0, correct: 0, wrong: 0 }
      }
      map[moduleName].total++
      if (d.correct) map[moduleName].correct++
      else map[moduleName].wrong++
    })
    return Object.entries(map).sort((a, b) => b[1].wrong - a[1].wrong)
  }, [details])

  const [expandedIndex, setExpandedIndex] = useState(null)

  const handleRetry = () => {
    navigate('/exam')
  }

  return (
    <div className="page-container" style={{ maxWidth: 800 }}>
      {/* 成绩总览 */}
      <div style={{
        background: `linear-gradient(135deg, ${score >= 80 ? '#3B6D11' : score >= 60 ? '#D85A30' : '#A32D2D'} 0%, ${score >= 80 ? '#2D560E' : score >= 60 ? '#B84A20' : '#8B2424'} 100%)`,
        borderRadius: 16, padding: '2rem 1.5rem', color: 'white', marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        {autoSubmit && (
          <div style={{
            fontSize: 13, padding: '4px 12px', borderRadius: 6,
            background: 'rgba(255,255,255,0.2)', display: 'inline-block', marginBottom: 12,
          }}>
            ⏰ 考试时间到，已自动交卷
          </div>
        )}
        <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 8 }}>
          {subjectName}模拟考试 · 成绩报告
        </div>
        <div style={{
          fontSize: 56, fontWeight: 800, lineHeight: 1, marginBottom: 8,
        }}>
          {score}
          <span style={{ fontSize: 20, opacity: 0.7 }}> / 100</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          {passText}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{correct}</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>答对</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{wrong}</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>答错</div>
          </div>
          {unanswered > 0 && (
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{unanswered}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>未答</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{accuracy}%</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>正确率</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {minutes}'{String(seconds).padStart(2, '0')}"
            </div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>用时</div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem' }}>
        <button className="btn-primary" onClick={handleRetry} style={{ flex: 1 }}>
          🔄 再考一次
        </button>
        <Link to="/" className="btn-outline" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
          返回首页
        </Link>
        <Link to="/wrong-book" className="btn-outline" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
          查看错题本
        </Link>
      </div>

      {/* 模块分析 */}
      {moduleStats.length > 1 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#2c2c2a' }}>
            📊 模块分析
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {moduleStats.map(([moduleName, stats]) => {
              const modAcc = Math.round((stats.correct / stats.total) * 100)
              const barColor = modAcc >= 70 ? '#3B6D11' : modAcc >= 40 ? '#D85A30' : '#A32D2D'
              return (
                <div key={moduleName}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, color: '#2c2c2a' }}>{moduleName}</span>
                    <span style={{ fontSize: 13, color: '#888780' }}>
                      {stats.correct}/{stats.total} · {modAcc}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#f0f0ee', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${modAcc}%`, height: '100%',
                      background: barColor, borderRadius: 3,
                      transition: 'width 0.3s',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 题目回顾 */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#2c2c2a' }}>
          📋 题目回顾
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {details.map((d, i) => {
            const isExpanded = expandedIndex === i
            const isCorrect = d.correct
            const isUnanswered = d.selected === -1
            const statusColor = isCorrect ? '#3B6D11' : isUnanswered ? '#888780' : '#A32D2D'
            const statusBg = isCorrect ? '#E8F5E0' : isUnanswered ? '#F5F5F4' : '#FDE8E8'
            const statusText = isCorrect ? '✓ 正确' : isUnanswered ? '○ 未答' : '✗ 错误'
            const moduleName = getModuleByPointId(d.pointId)?.name || '未分类'

            return (
              <div key={i} className="card" style={{ overflow: 'hidden' }}>
                {/* 题目头部（可点击展开） */}
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  style={{
                    width: '100%', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', background: 'transparent', border: 'none', textAlign: 'left',
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    background: statusBg, color: statusColor,
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, color: '#2c2c2a',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      <MathText>{d.content}</MathText>
                    </div>
                    <div style={{ fontSize: 12, color: '#888780', marginTop: 2 }}>
                      {moduleName} · {'★'.repeat(d.difficulty)}{'☆'.repeat(5 - d.difficulty)}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: statusColor,
                    padding: '2px 8px', borderRadius: 6, background: statusBg,
                    flexShrink: 0,
                  }}>
                    {statusText}
                  </span>
                  <span style={{ fontSize: 14, color: '#888780', flexShrink: 0 }}>
                    {isExpanded ? '▾' : '▸'}
                  </span>
                </button>

                {/* 展开后的详情 */}
                {isExpanded && (
                  <div style={{ padding: '0 16px 16px 56px' }}>
                    {/* 选项列表 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                      {d.options.map((opt, oi) => {
                        const isCorrectOpt = oi === d.answer
                        const isUserChoice = oi === d.selected
                        let bg = '#f9f9f8'
                        let border = '1.5px solid #e7e5e4'
                        let color = '#5F5E5A'
                        if (isCorrectOpt) {
                          bg = '#E8F5E0'
                          border = '1.5px solid #3B6D11'
                          color = '#2c2a26'
                        } else if (isUserChoice) {
                          bg = '#FDE8E8'
                          border = '1.5px solid #A32D2D'
                          color = '#2c2a26'
                        }
                        return (
                          <div key={oi} style={{
                            padding: '8px 12px', borderRadius: 8,
                            background: bg, border, fontSize: 14, color,
                            display: 'flex', alignItems: 'center', gap: 8,
                          }}>
                            <span style={{ fontWeight: 600 }}>{String.fromCharCode(65 + oi)}.</span>
                            <MathText>{opt}</MathText>
                            {isCorrectOpt && <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: '#3B6D11' }}>正确答案</span>}
                            {isUserChoice && !isCorrectOpt && <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: '#A32D2D' }}>你的选择</span>}
                          </div>
                        )
                      })}
                    </div>

                    {/* 解析 */}
                    <div style={{
                      background: '#F8F7FE', borderRadius: 10, padding: 12,
                      border: '0.5px solid #CECBF6',
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#534AB7', marginBottom: 6 }}>
                        💡 解析
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.7, color: '#444441' }}>
                        <MathText>{d.explanation}</MathText>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 底部操作 */}
      <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem' }}>
        <button className="btn-primary" onClick={handleRetry} style={{ flex: 1 }}>
          🔄 再考一次
        </button>
        <Link to="/stats" className="btn-outline" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
          查看学情报告
        </Link>
      </div>
    </div>
  )
}
