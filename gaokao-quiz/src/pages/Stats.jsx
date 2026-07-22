import { Link } from 'react-router-dom'
import { subjects } from '../data/subjects.js'
import { useBank, loadAllQuestions } from '../data/BankProvider.jsx'
import { useStore, ERROR_REASONS } from '../lib/store.js'
import { getSubjectMastery, getRecommendedQuestions, getLearningPath, getErrorDiagnosis } from '../lib/recommend.js'
import RadarChart from '../components/RadarChart.jsx'
import Achievements from '../components/Achievements.jsx'

export default function Stats() {
  const { answerRecords, wrongQuestions, wrongQuestionMeta, favorites, currentSubject, setSubject, dailyStats, streak } = useStore()

  const bank = useBank()
  if (!bank) throw loadAllQuestions()

  const totalAnswered = answerRecords.length
  const totalCorrect = answerRecords.filter(r => r.correct).length
  const accuracy = totalAnswered > 0 ? Math.round(totalCorrect / totalAnswered * 100) : 0
  const totalTime = answerRecords.reduce((sum, r) => sum + (r.time || 0), 0)
  const avgTime = totalAnswered > 0 ? Math.round(totalTime / totalAnswered) : 0

  // 最近14天做题趋势
  const today = new Date()
  const last14Days = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const dayRecords = answerRecords.filter(r => r.date && r.date.slice(0, 10) === dateStr)
    const dayCorrect = dayRecords.filter(r => r.correct).length
    last14Days.push({
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      count: dayRecords.length,
      correct: dayCorrect,
      accuracy: dayRecords.length > 0 ? Math.round(dayCorrect / dayRecords.length * 100) : 0,
    })
  }
  const maxDayCount = Math.max(...last14Days.map(d => d.count), 1)

  // 正确率趋势（有做题的天）
  const accuracyTrend = last14Days.filter(d => d.count > 0)

  // 当前科目掌握度
  const masteryList = getSubjectMastery(currentSubject, answerRecords)
  const { analysis: recommendAnalysis } = getRecommendedQuestions(currentSubject, answerRecords, 10)
  const currentSubj = subjects.find(s => s.id === currentSubject) || subjects[0]

  // 雷达图数据：按模块聚合掌握度
  const radarData = currentSubj.modules.map(m => {
    const modulePoints = masteryList.filter(ml => ml.moduleName === m.name)
    const avgMastery = modulePoints.length > 0
      ? Math.round(modulePoints.reduce((s, ml) => s + ml.mastery, 0) / modulePoints.length)
      : 0
    // 缩短标签
    let label = m.name
    if (label.length > 6) label = label.slice(0, 5) + '...'
    return { label, value: avgMastery }
  })

  // 掌握度分布
  const masteryBuckets = { '未练习': 0, '0-40%': 0, '40-70%': 0, '70-90%': 0, '90%+': 0 }
  masteryList.forEach(m => {
    if (m.stats.total === 0) masteryBuckets['未练习']++
    else if (m.mastery < 40) masteryBuckets['0-40%']++
    else if (m.mastery < 70) masteryBuckets['40-70%']++
    else if (m.mastery < 90) masteryBuckets['70-90%']++
    else masteryBuckets['90%+']++
  })

  // 今日统计
  const todayStr = today.toISOString().slice(0, 10)
  const todayStats = dailyStats?.[todayStr] || { answered: 0, correct: 0, wrong: 0, timeSpent: 0, newWrong: 0, conqueredPoints: 0 }

  // 连续打卡
  const streakCurrent = streak?.current || 0
  const streakLongest = streak?.longest || 0
  const dailyGoal = streak?.dailyGoal || 10
  const dailyProgress = todayStats.answered || 0

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#2c2c2a' }}>学情报告</h1>

      {/* 连续打卡 + 今日统计 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center', border: `1.5px solid ${currentSubj.color}33` }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#D85A30' }}>{streakCurrent}</div>
          <div style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>连续打卡(天)</div>
          <div style={{ fontSize: 11, color: '#a8a6a2', marginTop: 2 }}>最长 {streakLongest} 天</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#534AB7' }}>{totalAnswered}</div>
          <div style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>累计做题</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#3B6D11' }}>{accuracy}%</div>
          <div style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>正确率</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#D85A30' }}>{avgTime}s</div>
          <div style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>平均用时</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#A32D2D' }}>{wrongQuestions.length}</div>
          <div style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>错题总数</div>
        </div>
      </div>

      {/* 今日学习统计 */}
      <div className="card" style={{ marginBottom: 24, border: `1.5px solid ${currentSubj.color}22` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>📅</span>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#2c2c2a' }}>今日学习统计</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#534AB7' }}>{todayStats.answered || 0}</div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>今日做题</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#3B6D11' }}>
              {todayStats.answered > 0 ? Math.round(todayStats.correct / todayStats.answered * 100) : 0}%
            </div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>今日正确率</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#A32D2D' }}>{todayStats.newWrong || 0}</div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>新增错题</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#3B6D11' }}>{todayStats.conqueredPoints || 0}</div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>攻克错题</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#D85A30' }}>
              {Math.floor((todayStats.timeSpent || 0) / 60)}'{(todayStats.timeSpent || 0) % 60}"
            </div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>刷题时长</div>
          </div>
        </div>
        {/* 每日目标进度 */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888780', marginBottom: 4 }}>
            <span>每日目标</span>
            <span>{dailyProgress} / {dailyGoal} 题</span>
          </div>
          <div style={{ height: 6, background: '#f0f0ee', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (dailyProgress / dailyGoal) * 100)}%`,
              height: '100%',
              background: dailyProgress >= dailyGoal ? '#3B6D11' : currentSubj.color,
              borderRadius: 3, transition: 'width 0.3s',
            }} />
          </div>
          {dailyProgress >= dailyGoal && (
            <div style={{ fontSize: 12, color: '#3B6D11', marginTop: 4, fontWeight: 500 }}>
              🎉 今日目标已达成！
            </div>
          )}
        </div>
      </div>

      {/* 14天做题趋势 + 正确率曲线 */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>最近 14 天做题趋势</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100, marginBottom: 8 }}>
          {last14Days.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 9, color: d.count > 0 ? '#534AB7' : '#c8c6c2', marginBottom: 2 }}>
                {d.count > 0 ? d.count : ''}
              </div>
              <div style={{
                width: '100%', maxWidth: 20,
                height: d.count > 0 ? `${(d.count / maxDayCount) * 70}px` : '2px',
                background: d.count > 0
                  ? (d.accuracy >= 70 ? '#3B6D11' : d.accuracy >= 40 ? '#D85A30' : '#A32D2D')
                  : '#e7e5e4',
                borderRadius: 3, minHeight: 2,
                transition: 'height 0.3s',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {last14Days.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: i % 2 === 0 ? '#888780' : 'transparent' }}>
              {d.label}
            </div>
          ))}
        </div>
        {/* 图例 */}
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: '#888780' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#3B6D11' }} />正确率≥70%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#D85A30' }} />正确率40-70%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#A32D2D' }} />正确率&lt;40%
          </div>
        </div>
      </div>

      {/* 雷达图 + 智能推荐分析 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }} className="stats-grid">
        {/* 雷达图 */}
        <div className="card" style={{ border: `1.5px solid ${currentSubj.color}33` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>📊</span>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#2c2c2a' }}>
              {currentSubj.name}模块掌握雷达图
            </h2>
          </div>
          <RadarChart data={radarData} color={currentSubj.color} size={260} />
        </div>

        {/* 智能推荐概览 */}
        <div className="card" style={{ border: `1.5px solid ${currentSubj.color}33` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>✦</span>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: currentSubj.color }}>
              {currentSubj.name}智能推荐分析
            </h2>
            {/* 科目切换 */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              {subjects.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSubject(s.id)}
                  style={{
                    fontSize: 12, padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                    border: 'none',
                    background: currentSubject === s.id ? s.color : '#f5f5f4',
                    color: currentSubject === s.id ? 'white' : '#888780',
                  }}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* 推荐概览数据 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: currentSubj.color }}>
                {recommendAnalysis.overallMastery || 0}%
              </div>
              <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>综合掌握度</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#3B6D11' }}>
                {recommendAnalysis.masteredCount || 0}
              </div>
              <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>已掌握知识点</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#D85A30' }}>
                {recommendAnalysis.weakPoints?.length || 0}
              </div>
              <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>薄弱知识点</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#888780' }}>
                {recommendAnalysis.newPoints || 0}
              </div>
              <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>未练习知识点</div>
            </div>
          </div>

          {/* 掌握度分布 */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#5F5E5A', marginBottom: 8 }}>知识点掌握度分布</div>
            <div style={{ display: 'flex', gap: 4, height: 24, borderRadius: 6, overflow: 'hidden' }}>
              {Object.entries(masteryBuckets).map(([label, count]) => {
                const colors = {
                  '未练习': '#e7e5e4',
                  '0-40%': '#A32D2D',
                  '40-70%': '#D85A30',
                  '70-90%': '#534AB7',
                  '90%+': '#3B6D11',
                }
                const pct = recommendAnalysis.totalPoints > 0
                  ? (count / recommendAnalysis.totalPoints) * 100
                  : 0
                return pct > 0 ? (
                  <div
                    key={label}
                    style={{
                      width: `${pct}%`,
                      background: colors[label],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      color: 'white',
                      fontWeight: 600,
                    }}
                    title={`${label}: ${count}个`}
                  >
                    {count}
                  </div>
                ) : null
              })}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              {Object.entries(masteryBuckets).map(([label, count]) => {
                const colors = {
                  '未练习': '#e7e5e4', '0-40%': '#A32D2D', '40-70%': '#D85A30',
                  '70-90%': '#534AB7', '90%+': '#3B6D11',
                }
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: colors[label] }} />
                    <span style={{ fontSize: 10, color: '#888780' }}>{label}({count})</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 建议难度 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 8,
            background: '#F8F7FE', border: '0.5px solid #CECBF6',
          }}>
            <span style={{ fontSize: 14 }}>🎯</span>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#534AB7' }}>建议难度：</span>
              <span style={{ fontSize: 13, color: '#5F5E5A' }}>
                {'★'.repeat(recommendAnalysis.targetDifficulty)}{'☆'.repeat(5 - recommendAnalysis.targetDifficulty)}
                <span style={{ marginLeft: 8, color: '#888780' }}>
                  {recommendAnalysis.targetDifficulty <= 2 ? '基础巩固' : recommendAnalysis.targetDifficulty <= 3 ? '能力提升' : '挑战拔高'}
                </span>
              </span>
            </div>
            <Link
              to={`/practice/${currentSubject}/smart`}
              style={{
                marginLeft: 'auto', fontSize: 13, fontWeight: 600,
                color: currentSubj.color, textDecoration: 'none',
              }}
            >
              开始推荐 →
            </Link>
          </div>
        </div>
      </div>

      {/* 薄弱知识点 Top 5 */}
      {recommendAnalysis.weakPoints && recommendAnalysis.weakPoints.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span aria-hidden="true" style={{ fontSize: 16 }}>⚡</span>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#2c2c2a' }}>
              薄弱知识点 Top {recommendAnalysis.weakPoints.length}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recommendAnalysis.weakPoints.map((wp, i) => (
              <Link
                key={wp.pointId}
                to={`/practice/${currentSubject}/smart`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 8, textDecoration: 'none',
                  background: currentSubj.colorLight, transition: 'all 0.15s',
                }}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'white',
                  background: i < 2 ? '#A32D2D' : '#D85A30',
                }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#2c2c2a' }}>
                    {wp.moduleName}
                  </div>
                  <div style={{ fontSize: 12, color: '#888780' }}>{wp.reason}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {wp.mastery > 0 && (
                    <div style={{
                      fontSize: 16, fontWeight: 700,
                      color: wp.mastery < 40 ? '#A32D2D' : '#D85A30',
                    }}>
                      {wp.mastery}%
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#888780' }}>
                    {wp.stats.total > 0 ? `${wp.stats.correct}/${wp.stats.total} 对` : '未练习'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* AI 诊断：失分归因分析 */}
      {wrongQuestions.length > 0 && (() => {
        const diagnosis = getErrorDiagnosis(wrongQuestions, wrongQuestionMeta, answerRecords)
        return (
          <div className="card" style={{ marginBottom: 24, border: '1.5px solid #534AB733' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#534AB7' }}>AI 错题诊断</h2>
            </div>

            {/* 错因分布 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#5F5E5A', marginBottom: 8 }}>失分原因分布</div>
              <div style={{ display: 'flex', gap: 4, height: 28, borderRadius: 6, overflow: 'hidden' }}>
                {Object.entries(diagnosis.errorReasonStats).map(([key, count]) => {
                  const reason = ERROR_REASONS[key]
                  if (!reason) return null
                  const pct = (count / wrongQuestions.length) * 100
                  return (
                    <div key={key} style={{
                      width: `${pct}%`, background: reason.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: 'white', fontWeight: 600,
                    }} title={`${reason.label}: ${count}道`}>
                      {pct > 10 ? count : ''}
                    </div>
                  )
                })}
                {diagnosis.unmarked > 0 && (
                  <div style={{
                    width: `${(diagnosis.unmarked / wrongQuestions.length) * 100}%`,
                    background: '#e7e5e4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: '#888780', fontWeight: 600,
                  }}>
                    {diagnosis.unmarked}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                {Object.entries(diagnosis.errorReasonStats).map(([key, count]) => {
                  const reason = ERROR_REASONS[key]
                  if (!reason) return null
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: reason.color }} />
                      <span style={{ fontSize: 10, color: '#888780' }}>{reason.icon} {reason.label}({count})</span>
                    </div>
                  )
                })}
                {diagnosis.unmarked > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: '#e7e5e4' }} />
                    <span style={{ fontSize: 10, color: '#888780' }}>未标记({diagnosis.unmarked})</span>
                  </div>
                )}
              </div>
            </div>

            {/* 诊断建议 */}
            {diagnosis.suggestions.length > 0 && (
              <div style={{
                padding: '12px 14px', borderRadius: 10,
                background: '#F8F7FE', border: '0.5px solid #CECBF6',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#534AB7', marginBottom: 8 }}>
                  AI 建议
                </div>
                {diagnosis.suggestions.map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.8, marginBottom: 4 }}>
                    {i + 1}. {s}
                  </div>
                ))}
              </div>
            )}

            {/* 高频失分模块 */}
            {diagnosis.weakModules.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#5F5E5A', marginBottom: 8 }}>高频失分模块 Top 5</div>
                {diagnosis.weakModules.map((m, i) => {
                  const subj = subjects.find(s => s.id === m.subject)
                  return (
                    <Link
                      key={i}
                      to={`/practice/${m.subject}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 10px', borderRadius: 6, marginBottom: 4, textDecoration: 'none',
                        background: subj?.colorLight || '#f5f5f4',
                      }}
                    >
                      <span style={{ fontSize: 12 }}>{subj?.icon}</span>
                      <span style={{ fontSize: 13, color: '#2c2c2a', flex: 1 }}>{m.moduleName}</span>
                      <span style={{ fontSize: 12, color: '#A32D2D', fontWeight: 600 }}>{m.count} 道错题</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })()}

      {/* 学习路径推荐 */}
      {(() => {
        const path = getLearningPath(currentSubject, answerRecords)
        if (path.length === 0) return null
        return (
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 18 }}>🛤️</span>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#2c2c2a' }}>
                {currentSubj.name}学习路径推荐
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {path.map((p, i) => {
                const statusColors = {
                  '未开始': '#888780', '薄弱': '#A32D2D', '进行中': '#D85A30',
                  '良好': '#534AB7', '已掌握': '#3B6D11',
                }
                const statusBg = {
                  '未开始': '#f5f5f4', '薄弱': '#FCE8E8', '进行中': '#FFF0E6',
                  '良好': '#EEEDFE', '已掌握': '#E8F5E0',
                }
                return (
                  <Link
                    key={p.moduleId}
                    to={`/practice/${currentSubject}/${p.moduleId}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', borderRadius: 10, textDecoration: 'none',
                      background: 'var(--hover-bg)', transition: 'all 0.15s',
                      border: i === 0 ? '1.5px solid var(--primary-border)' : '0.5px solid var(--card-border)',
                    }}
                  >
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: 'white',
                      background: i === 0 ? 'var(--primary)' : '#c8c6c2', flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{p.moduleName}</span>
                        {p.priority === 1 && (
                          <span style={{
                            fontSize: 10, padding: '1px 6px', borderRadius: 4, fontWeight: 600,
                            background: '#FFF0E6', color: '#D85A30',
                          }}>高频</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--sub-text)', marginTop: 2 }}>
                        {p.recommendation}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
                        background: statusBg[p.status], color: statusColors[p.status],
                      }}>
                        {p.status}
                      </span>
                      {p.mastery > 0 && (
                        <div style={{ fontSize: 12, color: 'var(--sub-text)', marginTop: 2 }}>
                          掌握度 {p.mastery}%
                        </div>
                      )}
                    </div>
                    {i === 0 && (
                      <span style={{
                        fontSize: 10, padding: '2px 6px', borderRadius: 4,
                        background: 'var(--primary)', color: 'white', fontWeight: 600,
                      }}>
                        建议优先
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* 30天提分路线图 */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #F8F7FE 0%, white 100%)', border: '1.5px solid #CECBF6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>📈</span>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#534AB7' }}>30天提分路线图</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: '#534AB7', color: 'white', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
            }}>1-10</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#2c2c2a' }}>基础扫盲期</div>
              <div style={{ fontSize: 12, color: '#888780' }}>
                每天刷 {streak?.dailyGoal || 10} 道基础题，覆盖全部未练习知识点
              </div>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#534AB7' }}>
              +{recommendAnalysis.newPoints * 2 || 0}分
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: '#D85A30', color: 'white', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
            }}>11-20</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#2c2c2a' }}>薄弱突破期</div>
              <div style={{ fontSize: 12, color: '#888780' }}>
                集中攻克 {recommendAnalysis.weakPoints?.length || 0} 个薄弱知识点，错题重做+变式训练
              </div>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#D85A30' }}>
              +{(recommendAnalysis.weakPoints?.length || 0) * 3}分
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: '#3B6D11', color: 'white', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
            }}>21-30</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#2c2c2a' }}>冲刺模拟期</div>
              <div style={{ fontSize: 12, color: '#888780' }}>
                每2天1套模拟卷，错题全面复盘，保持考试手感
              </div>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#3B6D11' }}>
              +{Math.round((100 - (recommendAnalysis.overallMastery || 0)) * 0.3)}分
            </span>
          </div>
        </div>
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 8,
          background: 'white', border: '1px solid #CECBF6',
          fontSize: 13, color: '#534AB7', fontWeight: 600, textAlign: 'center',
        }}>
          预计30天可提升：{(recommendAnalysis.newPoints * 2 || 0) + (recommendAnalysis.weakPoints?.length || 0) * 3 + Math.round((100 - (recommendAnalysis.overallMastery || 0)) * 0.3)} 分
        </div>
      </div>

      {/* 知识点掌握度详情 */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          {currentSubj.name}知识点掌握度详情
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {currentSubj.modules.map(m => {
            const modulePoints = masteryList.filter(ml => ml.moduleName === m.name)
            return (
              <div key={m.id}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#2c2c2a', marginBottom: 8 }}>
                  {m.name}
                  {m.priority === 1 && <span className="tag tag-difficulty" style={{ marginLeft: 8, fontSize: 11 }}>核心</span>}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {modulePoints.map(mp => {
                    const mastery = mp.mastery
                    let bg, textColor
                    if (mp.stats.total === 0) {
                      bg = '#f5f5f4'; textColor = '#a8a6a2'
                    } else if (mastery < 40) {
                      bg = '#FCE8E8'; textColor = '#A32D2D'
                    } else if (mastery < 70) {
                      bg = '#FFF0E6'; textColor = '#D85A30'
                    } else if (mastery < 90) {
                      bg = currentSubj.colorLight; textColor = currentSubj.color
                    } else {
                      bg = '#E8F5E0'; textColor = '#3B6D11'
                    }
                    return (
                      <Link
                        key={mp.pointId}
                        to={`/practice/${currentSubject}/smart`}
                        style={{
                          padding: '4px 10px', borderRadius: 6, textDecoration: 'none',
                          background: bg, color: textColor,
                          fontSize: 12, fontWeight: 500,
                          border: mp.priority >= 95 ? `1.5px solid ${textColor}44` : 'none',
                          transition: 'all 0.15s',
                        }}
                        title={mp.reason}
                      >
                        {mp.pointName}
                        {mastery > 0 && <span style={{ marginLeft: 4, fontWeight: 700 }}>{mastery}%</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 成就徽章 */}
      <div style={{ marginBottom: 24 }}>
        <Achievements />
      </div>

      {/* 底部操作 */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to={`/practice/${currentSubject}/smart`} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginRight: 12 }}>
          智能推荐练习
        </Link>
        <Link to="/practice" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>
          随机刷题
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
