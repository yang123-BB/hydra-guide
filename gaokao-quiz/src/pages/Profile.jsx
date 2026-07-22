import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { subjects } from '../data/subjects.js'
import { isBankLoaded, getBank, loadAllQuestions } from '../data/allQuestions.js'
import { useStore } from '../lib/store.js'
import { getSubjectMastery } from '../lib/recommend.js'
import { PROVINCES, getProvince, getProvincesByBatch } from '../data/provinces.js'

export default function Profile() {
  const {
    currentUser, profile, updateProfile, answerRecords, wrongQuestions,
    examRecords, settings, updateSettings, exportData, importData, dailyStats, streak,
  } = useStore()

  const [showExport, setShowExport] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')
  const [importResult, setImportResult] = useState(null)

  // 高考倒计时
  const examDate = new Date(profile.examDate || '2027-06-07')
  const daysLeft = Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24))

  // 全科目学情概览
  const bank = isBankLoaded() ? getBank() : null
  const subjectOverview = bank ? subjects.map(s => {
    const sQuestions = bank.filter(q => q.subject === s.id)
    const sRecords = answerRecords.filter(r => sQuestions.some(q => q.id === r.questionId))
    const sCorrect = sRecords.filter(r => r.correct).length
    const masteryList = getSubjectMastery(s.id, answerRecords)
    const avgMastery = masteryList.length > 0
      ? Math.round(masteryList.reduce((sum, m) => sum + m.mastery, 0) / masteryList.length)
      : 0
    return {
      ...s,
      total: sQuestions.length,
      answered: sRecords.length,
      correct: sCorrect,
      accuracy: sRecords.length > 0 ? Math.round(sCorrect / sRecords.length * 100) : 0,
      mastery: avgMastery,
      weakCount: masteryList.filter(m => m.priority >= 75).length,
    }
  }) : []

  // 学习计划生成
  const studyPlan = useMemo(() => {
    if (daysLeft <= 0 || daysLeft > 365) return null

    // 找出最薄弱的3个科目
    const sortedSubjects = [...subjectOverview].sort((a, b) => a.mastery - b.mastery)
    const focusSubjects = sortedSubjects.filter(s => s.answered > 0).slice(0, 3)

    // 每日计划
    const dailyGoal = streak?.dailyGoal || 10
    const totalWeakPoints = subjectOverview.reduce((sum, s) => sum + s.weakCount, 0)

    // 按阶段划分
    const phases = []
    if (daysLeft > 90) {
      phases.push({ name: '基础巩固期', days: `前${Math.floor(daysLeft * 0.4)}天`, focus: '基础题+知识点扫盲', daily: `${dailyGoal}道基础题` })
      phases.push({ name: '专项突破期', days: `中间${Math.floor(daysLeft * 0.35)}天`, focus: '薄弱模块+中档题', daily: `${dailyGoal + 5}道中档题` })
      phases.push({ name: '冲刺模拟期', days: `最后${Math.floor(daysLeft * 0.25)}天`, focus: '压轴题+模拟卷', daily: '1套模拟卷+错题复习' })
    } else if (daysLeft > 30) {
      phases.push({ name: '查漏补缺期', days: `前${Math.floor(daysLeft * 0.5)}天`, focus: '错题重做+薄弱突破', daily: `${dailyGoal + 5}道薄弱题` })
      phases.push({ name: '冲刺模拟期', days: `后${Math.floor(daysLeft * 0.5)}天`, focus: '模拟卷+真题演练', daily: '1套模拟卷' })
    } else {
      phases.push({ name: '最后冲刺期', days: `${daysLeft}天`, focus: '错题复盘+高频考点', daily: '错题重做+真题模拟' })
    }

    return { focusSubjects, totalWeakPoints, phases, daysLeft, dailyGoal }
  }, [daysLeft, subjectOverview, streak])

  if (!bank) throw loadAllQuestions()

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: 'var(--text)' }}>个人中心</h1>

      {/* 高考倒计时 */}
      <div style={{
        background: 'linear-gradient(135deg, #534AB7 0%, #534AB7dd 100%)',
        borderRadius: 16, padding: '1.5rem', color: 'white', marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 4 }}>
              {currentUser ? `${currentUser.name}，` : ''}距离高考还有
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>
              {daysLeft > 0 ? daysLeft : 0}
              <span style={{ fontSize: 16, fontWeight: 500, marginLeft: 4 }}>天</span>
            </div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
              {profile.examDate} · {profile.gaokaoVersion === 'new' ? '新高考' : '老高考'} · 目标 {profile.targetScore} 分
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, opacity: 0.85 }}>累计做题</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{answerRecords.length}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
              连续打卡 {streak?.current || 0} 天
            </div>
          </div>
        </div>
      </div>

      {/* 高考设置 */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>高考设置</h2>

        {/* 高考版本 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--sub-text-2)', display: 'block', marginBottom: 8 }}>
            高考版本
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => updateProfile({ gaokaoVersion: 'new' })}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                border: profile.gaokaoVersion === 'new' ? '2px solid var(--primary)' : '2px solid var(--card-border)',
                background: profile.gaokaoVersion === 'new' ? 'var(--primary-light)' : 'var(--card-bg)',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 600, color: profile.gaokaoVersion === 'new' ? 'var(--primary)' : 'var(--text)' }}>
                新高考（3+1+2 / 3+3）
              </div>
              <div style={{ fontSize: 12, color: 'var(--sub-text)', marginTop: 2 }}>
                语数外必考 + 选科组合
              </div>
            </button>
            <button
              onClick={() => updateProfile({ gaokaoVersion: 'old' })}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                border: profile.gaokaoVersion === 'old' ? '2px solid var(--primary)' : '2px solid var(--card-border)',
                background: profile.gaokaoVersion === 'old' ? 'var(--primary-light)' : 'var(--card-bg)',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 600, color: profile.gaokaoVersion === 'old' ? 'var(--primary)' : 'var(--text)' }}>
                老高考（文理分科）
              </div>
              <div style={{ fontSize: 12, color: 'var(--sub-text)', marginTop: 2 }}>
                文综 / 理综
              </div>
            </button>
          </div>
        </div>

        {/* 选科（新高考） */}
        {profile.gaokaoVersion === 'new' && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--sub-text-2)', display: 'block', marginBottom: 8 }}>
              选考科目（已选 {profile.selectedSubjects.length}/3）
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {subjects.filter(s => !['math', 'chinese', 'english'].includes(s.id)).map(s => {
                const isSelected = profile.selectedSubjects.includes(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      const current = profile.selectedSubjects
                      if (isSelected) {
                        updateProfile({ selectedSubjects: current.filter(id => id !== s.id) })
                      } else if (current.length < 3) {
                        updateProfile({ selectedSubjects: [...current, s.id] })
                      }
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
                      border: isSelected ? `1.5px solid ${s.color}` : '1.5px solid var(--card-border)',
                      background: isSelected ? s.colorLight : 'var(--card-bg)',
                      color: isSelected ? s.color : 'var(--sub-text)',
                      fontSize: 14, fontWeight: 500,
                      opacity: !isSelected && profile.selectedSubjects.length >= 3 ? 0.4 : 1,
                    }}
                  >
                    <span>{s.icon}</span>
                    {s.name}
                    {isSelected && <span>✓</span>}
                  </button>
                )
              })}
            </div>
            <div style={{ fontSize: 12, color: 'var(--sub-text)', marginTop: 6 }}>
              语数外为必考科目，另选3门选考科目
            </div>
          </div>
        )}

        {/* 目标分数 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--sub-text-2)', display: 'block', marginBottom: 8 }}>
            目标分数：{profile.targetScore} 分
          </label>
          <input
            type="range"
            min={300}
            max={750}
            step={10}
            value={profile.targetScore}
            onChange={e => updateProfile({ targetScore: Number(e.target.value) })}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--sub-text)' }}>
            <span>300</span>
            <span>500</span>
            <span>600</span>
            <span>700</span>
            <span>750</span>
          </div>
        </div>

        {/* 省份设置 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--sub-text-2)', display: 'block', marginBottom: 8 }}>
            所在省份（影响试卷类型筛选）
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {getProvincesByBatch().map(p => {
              const isSelected = (profile.province || 'sichuan') === p.code
              return (
                <button
                  key={p.code}
                  onClick={() => updateProfile({ province: p.code })}
                  style={{
                    fontSize: 12, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                    border: isSelected ? '1.5px solid var(--primary)' : '1.5px solid var(--card-border)',
                    background: isSelected ? 'var(--primary-light)' : 'var(--card-bg)',
                    color: isSelected ? 'var(--primary)' : 'var(--sub-text)',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {p.name}
                </button>
              )
            })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--sub-text)', marginTop: 6 }}>
            当前：{getProvince(profile.province || 'sichuan')?.name || '四川'} · {getProvince(profile.province || 'sichuan')?.batch}批
          </div>
        </div>

        {/* 高考日期 */}
        <div>
          <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--sub-text-2)', display: 'block', marginBottom: 8 }}>
            高考日期
          </label>
          <input
            type="date"
            value={profile.examDate}
            onChange={e => updateProfile({ examDate: e.target.value })}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: '1.5px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text)',
              fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* AI 学习计划 */}
      {studyPlan && (
        <div className="card" style={{ marginBottom: '1.5rem', border: '1.5px solid var(--primary-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>🎯</span>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>AI 备考计划</h2>
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 4,
              background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600,
              marginLeft: 'auto',
            }}>
              剩余 {daysLeft} 天
            </span>
          </div>

          {/* 重点关注科目 */}
          {studyPlan.focusSubjects.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sub-text-2)', marginBottom: 8 }}>
                重点关注科目（掌握度最低）
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {studyPlan.focusSubjects.map(s => (
                  <Link
                    key={s.id}
                    to={`/practice/${s.id}/smart`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 8, textDecoration: 'none',
                      background: s.colorLight, color: s.color, fontSize: 13, fontWeight: 500,
                    }}
                  >
                    {s.icon} {s.name} · {s.mastery}%
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 阶段计划 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {studyPlan.phases.map((phase, i) => (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 10,
                background: 'var(--hover-bg)', border: '0.5px solid var(--card-border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                    {i + 1}. {phase.name}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--sub-text)' }}>{phase.days}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--sub-text-2)' }}>
                  重点：{phase.focus}
                </div>
                <div style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4, fontWeight: 500 }}>
                  每日目标：{phase.daily}
                </div>
              </div>
            ))}
          </div>

          {/* 统计信息 */}
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 8,
            background: 'var(--primary-light)', fontSize: 12, color: 'var(--sub-text-2)',
            display: 'flex', gap: 16, flexWrap: 'wrap',
          }}>
            <span>薄弱知识点：{studyPlan.totalWeakPoints} 个</span>
            <span>每日目标：{studyPlan.dailyGoal} 题</span>
            <span>建议每日用时：{Math.ceil(studyPlan.dailyGoal * 2.5)} 分钟</span>
          </div>
        </div>
      )}

      {/* 全科目学情概览 */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>全科目学情</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {subjectOverview.map(s => (
            <Link
              key={s.id}
              to={`/practice/${s.id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10, textDecoration: 'none',
                background: 'var(--hover-bg)', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--sub-text)' }}>
                  已做 {s.answered}/{s.total} · 正确率 {s.accuracy}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: 18, fontWeight: 700,
                  color: s.mastery < 40 ? '#A32D2D' : s.mastery < 70 ? '#D85A30' : '#3B6D11',
                }}>
                  {s.mastery}%
                </div>
                <div style={{ fontSize: 11, color: 'var(--sub-text)' }}>掌握度</div>
              </div>
              {s.weakCount > 0 && (
                <span style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 4,
                  background: '#FFF0E6', color: '#D85A30', fontWeight: 500,
                }}>
                  {s.weakCount} 薄弱
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* 无障碍设置 */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>辅助功能</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>高对比度模式</div>
            <div style={{ fontSize: 12, color: 'var(--sub-text)' }}>增强文字与背景对比度，适合视力偏弱用户</div>
          </div>
          <button
            onClick={() => updateSettings({ highContrast: !settings.highContrast })}
            style={{
              width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
              background: settings.highContrast ? 'var(--primary)' : 'var(--card-border)',
              border: 'none', position: 'relative', transition: 'background 0.2s',
            }}
          >
            <span style={{
              position: 'absolute', top: 2, left: settings.highContrast ? 22 : 2,
              width: 20, height: 20, borderRadius: '50%', background: 'white',
              transition: 'left 0.2s',
            }} />
          </button>
        </div>
        <div style={{
          padding: 10, borderRadius: 8, background: 'var(--hover-bg)',
          fontSize: 12, color: 'var(--sub-text)', marginTop: 8,
        }}>
          提示：刷题页每道题底部有"朗读"按钮，可语音播报题干内容。
        </div>
      </div>

      {/* 数据管理 */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>数据管理</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn-outline"
            style={{ fontSize: 13 }}
            onClick={() => setShowExport(true)}
          >
            导出学情报告 (PDF)
          </button>
          <button
            className="btn-outline"
            style={{ fontSize: 13 }}
            onClick={() => {
              const data = exportData()
              const blob = new Blob([data], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `gaokao_backup_${new Date().toISOString().slice(0, 10)}.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            备份数据 (JSON)
          </button>
          <button
            className="btn-outline"
            style={{ fontSize: 13 }}
            onClick={() => setShowImport(true)}
          >
            恢复数据
          </button>
        </div>
        <div style={{
          padding: 10, borderRadius: 8, background: '#FFF0E6', border: '1px solid #D85A3022',
          fontSize: 12, color: '#D85A30', marginTop: 10,
        }}>
          数据存储在本地浏览器中。清除浏览器缓存、更换设备或浏览器会导致数据丢失。建议定期备份。
        </div>
      </div>

      {/* 导出学情报告 */}
      {showExport && (
        <div className="page-container" style={{ maxWidth: 800, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg)', zIndex: 200, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingTop: 20 }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>学情报告</h1>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-outline" style={{ fontSize: 13 }} onClick={() => setShowExport(false)}>返回</button>
              <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => window.print()}>打印/PDF</button>
            </div>
          </div>
          <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: '2rem', border: '0.5px solid var(--card-border)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>
              高考刷题学情报告
            </h2>
            <p style={{ fontSize: 13, color: 'var(--sub-text)', textAlign: 'center', marginBottom: 24 }}>
              {currentUser?.name || '匿名用户'} · {new Date().toLocaleDateString('zh-CN')} · 距高考 {daysLeft} 天
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ textAlign: 'center', padding: 12, border: '1px solid var(--card-border)', borderRadius: 8 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{answerRecords.length}</div>
                <div style={{ fontSize: 11, color: 'var(--sub-text)' }}>累计做题</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, border: '1px solid var(--card-border)', borderRadius: 8 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#3B6D11' }}>
                  {answerRecords.length > 0 ? Math.round(answerRecords.filter(r => r.correct).length / answerRecords.length * 100) : 0}%
                </div>
                <div style={{ fontSize: 11, color: 'var(--sub-text)' }}>总正确率</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, border: '1px solid var(--card-border)', borderRadius: 8 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#A32D2D' }}>{wrongQuestions.length}</div>
                <div style={{ fontSize: 11, color: 'var(--sub-text)' }}>错题总数</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, border: '1px solid var(--card-border)', borderRadius: 8 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#D85A30' }}>{streak?.current || 0}</div>
                <div style={{ fontSize: 11, color: 'var(--sub-text)' }}>连续打卡</div>
              </div>
            </div>
            {subjectOverview.map(s => (
              <div key={s.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px dashed var(--card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{s.icon} {s.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--sub-text)' }}>
                    做 {s.answered}/{s.total} · 对 {s.accuracy}% · 掌握度 {s.mastery}%
                  </span>
                </div>
              </div>
            ))}
            {examRecords.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>模拟考试记录</h3>
                {examRecords.slice(0, 10).map(exam => (
                  <div key={exam.id} style={{ fontSize: 13, color: 'var(--sub-text)', marginBottom: 4 }}>
                    {new Date(exam.date).toLocaleDateString('zh-CN')} · {exam.subjectName} · 得分 {exam.score} · {exam.correct}/{exam.total} 正确
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 导入数据弹窗 */}
      {showImport && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowImport(false)}>
          <div className="card" style={{ width: '90%', maxWidth: 500, padding: 24 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>恢复数据</h3>
            <p style={{ fontSize: 13, color: 'var(--sub-text)', marginBottom: 12 }}>
              粘贴之前备份的 JSON 数据，或上传备份文件：
            </p>
            <input
              type="file"
              accept=".json"
              onChange={e => {
                const file = e.target.files[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = (ev) => {
                  setImportText(ev.target.result)
                }
                reader.readAsText(file)
              }}
              style={{ marginBottom: 12, fontSize: 13 }}
            />
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="粘贴 JSON 备份数据..."
              style={{
                width: '100%', minHeight: 100, padding: 8, borderRadius: 8,
                border: '1.5px solid var(--card-border)', fontSize: 11,
                background: 'var(--input-bg)', color: 'var(--text)',
                fontFamily: 'monospace', resize: 'vertical', outline: 'none',
              }}
            />
            {importResult !== null && (
              <div style={{
                marginTop: 8, padding: 8, borderRadius: 6,
                background: importResult === true ? '#E8F5E0' : '#FCE8E8',
                color: importResult === true ? '#3B6D11' : '#A32D2D', fontSize: 13,
              }}>
                {importResult === true ? '数据恢复成功！' : '数据格式错误，恢复失败'}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                className="btn-primary"
                style={{ fontSize: 13, flex: 1 }}
                onClick={() => {
                  const ok = importData(importText)
                  setImportResult(ok)
                  if (ok) setTimeout(() => { setShowImport(false); setImportText(''); setImportResult(null) }, 1500)
                }}
                disabled={!importText}
              >
                恢复
              </button>
              <button className="btn-outline" style={{ fontSize: 13 }} onClick={() => setShowImport(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          nav, .btn-primary, .btn-outline { display: none !important; }
          .page-container { max-width: 100% !important; padding: 0 !important; }
          .card { border: none !important; box-shadow: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  )
}
