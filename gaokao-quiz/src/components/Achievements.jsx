import { useStore } from '../lib/store.js'

/** 成就定义 */
const ACHIEVEMENTS = [
  { id: 'first_step', icon: '🎯', name: '初出茅庐', desc: '完成第一道题', check: (s) => s.answerRecords.length >= 1 },
  { id: 'ten_correct', icon: '✅', name: '渐入佳境', desc: '答对10道题', check: (s) => s.answerRecords.filter(r => r.correct).length >= 10 },
  { id: 'fifty_done', icon: '📚', name: '刷题达人', desc: '完成50道题', check: (s) => s.answerRecords.length >= 50 },
  { id: 'hundred_done', icon: '🏆', name: '百题斩', desc: '完成100道题', check: (s) => s.answerRecords.length >= 100 },
  { id: 'streak_3', icon: '🔥', name: '三日打卡', desc: '连续打卡3天', check: (s) => (s.streak?.longest || 0) >= 3 },
  { id: 'streak_7', icon: '🔥', name: '一周坚持', desc: '连续打卡7天', check: (s) => (s.streak?.longest || 0) >= 7 },
  { id: 'streak_30', icon: '👑', name: '月度王者', desc: '连续打卡30天', check: (s) => (s.streak?.longest || 0) >= 30 },
  { id: 'perfect_exam', icon: '💯', name: '满分达人', desc: '模考获得满分', check: (s) => s.examRecords?.some(e => e.score === 100) },
  { id: 'exam_pass', icon: '📝', name: '首次模考', desc: '完成第一次模拟考试', check: (s) => s.examRecords?.length >= 1 },
  { id: 'conquer_wrong', icon: '⚔️', name: '错题克星', desc: '攻克10道错题', check: (s) => {
    const conquered = s.answerRecords.filter(r => r.correct && s.wrongQuestions && !s.wrongQuestions.includes(r.questionId))
    // 检查是否有10个曾经是错题但后来答对的记录
    const wrongHistory = s.answerRecords.filter(r => !r.correct).map(r => r.questionId)
    const correctedFromWrong = new Set()
    s.answerRecords.forEach(r => {
      if (r.correct && wrongHistory.includes(r.questionId)) {
        correctedFromWrong.add(r.questionId)
      }
    })
    return correctedFromWrong.size >= 10
  }},
  { id: 'subject_master', icon: '🎓', name: '科目精通', desc: '某科目综合掌握度达80%', check: (s) => {
    // 需要从外部传入，这里用简化判断
    return false
  }},
  { id: 'no_wrong', icon: '🛡️', name: '零失误', desc: '一次模考全对', check: (s) => s.examRecords?.some(e => e.wrong === 0 && e.unanswered === 0) },
]

/**
 * 成就徽章展示组件
 * @param {boolean} compact - 紧凑模式（只显示已解锁的）
 */
export default function Achievements({ compact = false }) {
  const state = useStore()

  const unlocked = ACHIEVEMENTS.filter(a => a.check(state))
  const locked = ACHIEVEMENTS.filter(a => !a.check(state))

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {unlocked.map(a => (
          <div
            key={a.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 16,
              background: 'var(--primary-light)', border: '1px solid var(--primary-border)',
            }}
            title={`${a.name} - ${a.desc}`}
          >
            <span style={{ fontSize: 14 }}>{a.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--primary)' }}>{a.name}</span>
          </div>
        ))}
        {locked.length > 0 && (
          <span style={{ fontSize: 12, color: 'var(--sub-text)' }}>
            +{locked.length} 个待解锁
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>🏅</span>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>成就徽章</h2>
        <span style={{ fontSize: 13, color: 'var(--sub-text)', marginLeft: 'auto' }}>
          已解锁 {unlocked.length} / {ACHIEVEMENTS.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
        {ACHIEVEMENTS.map(a => {
          const isUnlocked = a.check(state)
          return (
            <div
              key={a.id}
              style={{
                textAlign: 'center', padding: 12, borderRadius: 10,
                background: isUnlocked ? 'var(--primary-light)' : 'var(--hover-bg)',
                border: isUnlocked ? '1.5px solid var(--primary-border)' : '1.5px solid var(--card-border)',
                opacity: isUnlocked ? 1 : 0.5,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4, filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
                {a.icon}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 600, color: isUnlocked ? 'var(--primary)' : 'var(--sub-text)',
                marginBottom: 2,
              }}>
                {a.name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--sub-text)', lineHeight: 1.4 }}>
                {a.desc}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
