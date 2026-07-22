import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { subjects } from '../data/subjects.js'
import { useBank } from '../data/BankProvider.jsx'
import bankStats from '../data/stats.json'
import { useStore } from '../lib/store.js'
import { getSubjectMastery, getRecommendedQuestions } from '../lib/recommend.js'
import {
  getProvince, getPaperTypeForSubject, getPaperTypeInfo,
  isUnifiedSubject, isProvincialSubject,
} from '../data/provinces.js'
import { starsToCoef, GRADIENT_LEVELS } from '../lib/utils.js'

export default function Home() {
  const {
    currentUser, answerRecords, wrongQuestions,
    currentSubject, favorites, getReviewQueue, getTodayStats, streak,
    profile, filters,
  } = useStore()

  const bank = useBank()

  const subject = subjects.find(s => s.id === currentSubject) || subjects[0]
  const selectedProvince = profile?.province || 'sichuan'
  const currentPaperType = getPaperTypeForSubject(currentSubject, selectedProvince)
  const isUnified = isUnifiedSubject(currentSubject)
  const isProvincial = isProvincialSubject(currentSubject)

  // 应用所有筛选条件（省份 + 侧边栏筛选器）
  const filteredQuestions = useMemo(() => {
    if (!bank) return []
    return bank.filter(q => {
      if (q.subject !== currentSubject) return false
      // 省份筛选
      if (isProvincial && q.tags?.province && q.tags.province !== selectedProvince) return false
      if (isUnified && q.tags?.paperType && q.tags.paperType !== currentPaperType && q.tags.paperType !== 'provincial') return false
      // 年份筛选
      if (filters.year && q.tags?.year !== filters.year) return false
      // 题型筛选
      if (filters.questionTypes.length > 0 && !filters.questionTypes.includes(q.tags?.questionType)) return false
      // 难度筛选
      const coef = starsToCoef(q.tags?.difficultyStars || q.difficulty || 2)
      if (coef < filters.difficultyMin || coef > filters.difficultyMax) return false
      // 模块筛选
      if (filters.moduleId && q.module !== filters.moduleId) return false
      // 来源筛选
      if (filters.source && q.tags?.source !== filters.source) return false
      return true
    })
  }, [bank, currentSubject, selectedProvince, currentPaperType, isUnified, isProvincial, filters])

  const totalQuestions = bankStats.bySubject[currentSubject]?.total ?? bankStats.total
  const filteredIds = new Set(filteredQuestions.map(q => q.id))
  const subjectRecords = answerRecords.filter(r => filteredIds.has(r.questionId))
  const answeredCount = subjectRecords.length
  const correctCount = subjectRecords.filter(r => r.correct).length
  const accuracy = answeredCount > 0 ? Math.round(correctCount / answeredCount * 100) : 0
  const subjectWrong = wrongQuestions.filter(id => filteredIds.has(id))

  // 智能推荐分析（依赖题库，bank 未就绪时给安全默认值）
  const masteryList = bank ? getSubjectMastery(currentSubject, answerRecords) : []
  const { analysis: recommendAnalysis } = bank
    ? getRecommendedQuestions(currentSubject, answerRecords, 10)
    : { overallMastery: 0 }
  const weakPoints = masteryList.filter(m => m.stats.total > 0 && m.priority >= 75).slice(0, 5)
  const overallMastery = recommendAnalysis.overallMastery || 0

  // 今日统计
  const todayStats = getTodayStats()
  const streakCurrent = streak?.current || 0
  const dailyGoal = streak?.dailyGoal || 10
  const dailyProgress = todayStats.answered || 0
  const goalMet = dailyProgress >= dailyGoal

  // 待复习错题
  const reviewQueue = getReviewQueue()

  // 各复习阶段的题目数
  const phaseCounts = useMemo(() => {
    const base = filteredQuestions
    return {
      basic: base.filter(q => starsToCoef(q.tags?.difficultyStars || q.difficulty || 2) <= 0.4).length,
      medium: base.filter(q => {
        const c = starsToCoef(q.tags?.difficultyStars || q.difficulty || 2)
        return c > 0.4 && c <= 0.7
      }).length,
      hard: base.filter(q => starsToCoef(q.tags?.difficultyStars || q.difficulty || 2) > 0.7).length,
      realExam: base.filter(q => q.tags?.source === 'gaokao').length,
    }
  }, [filteredQuestions])

  return (
    <div className="page-container">
      {/* 紧凑统计栏 */}
      <div style={{
        background: `linear-gradient(135deg, ${subject.color} 0%, ${subject.color}dd 100%)`,
        borderRadius: 14, padding: '1rem 1.25rem', color: 'white', marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 600 }}>
              {currentUser ? `${currentUser.name}，欢迎回来` : `${subject.name}刷题`}
            </h1>
            <p style={{ fontSize: 12, opacity: 0.8 }}>
              {getProvince(selectedProvince)?.name || '通用'} · {isUnified ? getPaperTypeInfo(currentPaperType).label : '省级自主命题'}
            </p>
          </div>
          {streakCurrent > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '4px 10px',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 16 }}>🔥</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{streakCurrent}</span>
              <span style={{ fontSize: 10, opacity: 0.8 }}>天连击</span>
            </div>
          )}
        </div>

        {/* 数据统计 */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <StatBox label="题库总量" value={totalQuestions} />
          <StatBox label="已做题数" value={answeredCount} />
          <StatBox label="正确率" value={`${accuracy}%`} />
          <StatBox label="掌握度" value={`${overallMastery}%`} />
        </div>

        {/* 每日目标 */}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.85, marginBottom: 3 }}>
            <span>今日目标</span>
            <span>{dailyProgress} / {dailyGoal} 题 {goalMet && '🎉'}</span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (dailyProgress / dailyGoal) * 100)}%`,
              height: '100%',
              background: goalMet ? '#7ED957' : 'rgba(255,255,255,0.8)',
              borderRadius: 3, transition: 'width 0.3s',
            }} />
          </div>
        </div>
      </div>

      {/* 待复习提醒 */}
      {reviewQueue.length > 0 && (
        <div style={{
          background: 'var(--warn-bg)', borderRadius: 8, padding: '8px 12px', marginBottom: '0.75rem',
          display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #D85A3022',
        }}>
          <span style={{ fontSize: 16 }}>⏰</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--warn)' }}>
              {reviewQueue.length} 道错题到了复习时间
            </span>
          </div>
          <Link to="/wrong-book" className="btn-primary" style={{ fontSize: 12, padding: '3px 10px', background: '#D85A30', textDecoration: 'none' }}>
            去复习
          </Link>
        </div>
      )}

      {/* 复习阶段入口 */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span aria-hidden="true">📚</span> 复习阶段
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          {/* 三级梯度训练 */}
          {GRADIENT_LEVELS.map(level => (
            <Link
              key={level.id}
              to={`/practice/${currentSubject}/mode/gradient?level=${level.id}`}
              style={{ textDecoration: 'none' }}
            >
              <PhaseCard
                icon={level.icon}
                title={level.title}
                subtitle={level.subtitle}
                count={phaseCounts[level.id]}
                color={level.color}
                colorLight={level.colorLight}
              />
            </Link>
          ))}

          {/* 真题汇编 */}
          <Link to={`/practice/${currentSubject}/mode/real-exam`} style={{ textDecoration: 'none' }}>
            <PhaseCard
              icon="📄"
              title="真题汇编"
              subtitle="按年份刷"
              count={phaseCounts.realExam}
              color="#185FA5"
              colorLight="#E6F1FB"
            />
          </Link>
        </div>
      </div>

      {/* 快捷入口 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: '1.25rem' }}>
        <Link to={`/practice/${currentSubject}/smart`} style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', padding: '10px 14px', border: `1.5px solid ${subject.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>✦</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: subject.color }}>智能推荐</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--sub-text)', marginTop: 2 }}>
              {weakPoints.length > 0 ? `${weakPoints.length} 个薄弱点` : 'AI 组题'}
            </div>
          </div>
        </Link>
        <Link to={`/practice/${currentSubject}`} style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', padding: '10px 14px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>随机刷题</div>
            <div style={{ fontSize: 11, color: 'var(--sub-text)', marginTop: 2 }}>随机抽题</div>
          </div>
        </Link>
        <Link to="/wrong-book" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', padding: '10px 14px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>错题本</div>
            <div style={{ fontSize: 11, color: 'var(--sub-text)', marginTop: 2 }}>
              {subjectWrong.length > 0 ? `${subjectWrong.length} 道待复习` : '暂无错题'}
            </div>
          </div>
        </Link>
        <Link to="/exam" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', padding: '10px 14px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>模拟考试</div>
            <div style={{ fontSize: 11, color: 'var(--sub-text)', marginTop: 2 }}>限时作答</div>
          </div>
        </Link>
      </div>

      {/* 薄弱知识点 */}
      {weakPoints.length > 0 && (
        <div className="card" style={{ marginBottom: '1.25rem', border: `1px solid ${subject.color}33` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span aria-hidden="true" style={{ fontSize: 15 }}>⚡</span>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>薄弱知识点</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {weakPoints.map(wp => (
              <Link
                key={wp.pointId}
                to={`/practice/${currentSubject}/smart`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 10px', borderRadius: 6, textDecoration: 'none',
                  background: subject.colorLight,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{wp.pointName}</span>
                  <span style={{ fontSize: 11, color: 'var(--sub-text)' }}>{wp.moduleName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {wp.mastery > 0 && (
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: wp.mastery < 40 ? 'var(--wrong)' : wp.mastery < 70 ? 'var(--warn)' : 'var(--correct)',
                    }}>
                      {wp.mastery}%
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: subject.color, fontWeight: 500 }}>{wp.reason}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 知识模块（应用侧边栏筛选） */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>📐</span>
        {subject?.name || '数学'}知识模块
        {filters.moduleId && (
          <span style={{ fontSize: 11, color: 'var(--sub-text)', fontWeight: 400 }}>
            (已选模块筛选)
          </span>
        )}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
        {subject?.modules?.map(m => {
          // 如果侧边栏选了模块，只显示该模块
          if (filters.moduleId && m.id !== filters.moduleId) return null

          const moduleQuestions = filteredQuestions.filter(q => q.module === m.id)
          const moduleAnswered = answerRecords.filter(r =>
            moduleQuestions.some(q => q.id === r.questionId)
          )
          const moduleCorrect = moduleAnswered.filter(r => r.correct).length
          const moduleAcc = moduleAnswered.length > 0
            ? Math.round(moduleCorrect / moduleAnswered.length * 100)
            : null
          const mAnswered = moduleAnswered.length
          const mTotal = moduleQuestions.length
          const progressPct = mTotal > 0 ? Math.round(mAnswered / mTotal * 100) : 0

          // 模块级掌握度
          const moduleMasteryList = masteryList.filter(ml => ml.moduleName === m.name)
          const moduleMastery = moduleMasteryList.length > 0
            ? Math.round(moduleMasteryList.reduce((s, ml) => s + ml.mastery, 0) / moduleMasteryList.length)
            : 0

          // 难度分布
          const easyCount = moduleQuestions.filter(q => starsToCoef(q.tags?.difficultyStars || q.difficulty || 2) <= 0.4).length
          const medCount = moduleQuestions.filter(q => {
            const c = starsToCoef(q.tags?.difficultyStars || q.difficulty || 2)
            return c > 0.4 && c <= 0.7
          }).length
          const hardCount = moduleQuestions.filter(q => starsToCoef(q.tags?.difficultyStars || q.difficulty || 2) > 0.7).length

          return (
            <Link key={m.id} to={`/practice/${currentSubject}/${m.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', transition: 'all 0.15s', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{m.name}</span>
                    {m.priority === 1 && (
                      <span style={{
                        fontSize: 10, padding: '1px 5px', borderRadius: 3, fontWeight: 600,
                        background: 'var(--warn-bg)', color: 'var(--warn)',
                      }}>
                        高频
                      </span>
                    )}
                  </div>
                  {moduleMastery > 0 && (
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: moduleMastery < 40 ? 'var(--wrong)' : moduleMastery < 70 ? 'var(--warn)' : 'var(--correct)',
                    }}>
                      {moduleMastery}%
                    </span>
                  )}
                </div>

                {/* 进度条 */}
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--sub-text)', marginBottom: 2 }}>
                    <span>{mAnswered}/{mTotal} 题</span>
                    <span>{progressPct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--hover-bg)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${progressPct}%`,
                      height: '100%',
                      background: progressPct === 0 ? 'var(--card-border)' : progressPct < 40 ? 'var(--wrong)' : progressPct < 70 ? 'var(--warn)' : 'var(--correct)',
                      borderRadius: 3, transition: 'width 0.3s',
                    }} />
                  </div>
                </div>

                {/* 难度分布 */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {easyCount > 0 && (
                    <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: 'var(--correct-bg)', color: 'var(--correct)' }}>
                      基础 {easyCount}
                    </span>
                  )}
                  {medCount > 0 && (
                    <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: 'var(--warn-bg)', color: 'var(--warn)' }}>
                      中档 {medCount}
                    </span>
                  )}
                  {hardCount > 0 && (
                    <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: 'var(--wrong-bg)', color: 'var(--wrong)' }}>
                      压轴 {hardCount}
                    </span>
                  )}
                </div>

                {/* 底部 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--sub-text)' }}>
                    {moduleAcc !== null ? `正确率 ${moduleAcc}%` : '尚未开始'}
                  </span>
                  <span style={{ fontSize: 11, color: subject.color, fontWeight: 500 }}>去练习 →</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* 空状态 */}
      {totalQuestions === 0 && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
          <p style={{ fontSize: 15, color: 'var(--sub-text)' }}>当前筛选条件下没有题目</p>
          <p style={{ fontSize: 13, color: 'var(--sub-text)', marginTop: 4 }}>
            尝试调整左侧筛选器，或切换科目/省份
          </p>
        </div>
      )}
    </div>
  )
}

// ─── 统计数字框 ───────────────────────────────────────────
function StatBox({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 11, opacity: 0.7 }}>{label}</div>
    </div>
  )
}

// ─── 复习阶段卡片 ─────────────────────────────────────────
function PhaseCard({ icon, title, subtitle, count, color, colorLight }) {
  return (
    <div className="card" style={{
      cursor: 'pointer', padding: '12px 14px',
      border: `1.5px solid ${color}44`,
      background: `linear-gradient(135deg, ${colorLight} 0%, var(--card-bg) 100%)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span aria-hidden="true" style={{ fontSize: 18 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color }}>{title}</div>
          <div style={{ fontSize: 10, color: 'var(--sub-text)' }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 18, fontWeight: 700, color }}>{count}</span>
        <span style={{ fontSize: 11, color: 'var(--sub-text)' }}>题</span>
      </div>
    </div>
  )
}
