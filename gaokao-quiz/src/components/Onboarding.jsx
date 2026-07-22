import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store.js'

const STEPS = [
  {
    icon: '✦',
    title: '智能推荐刷题',
    desc: 'AI 根据你的做题记录和遗忘曲线，智能推荐最该练的题目。薄弱知识点优先推送，掌握好的减少重复。',
    color: '#534AB7',
    link: '/practice/math/smart',
    linkText: '试试智能推荐',
  },
  {
    icon: '⚡',
    title: '错题本与复习',
    desc: '做错的题自动进入错题本。你可以标记错因、添加笔记、按知识点筛选。系统会根据遗忘曲线提醒你定期复习。',
    color: '#D85A30',
    link: '/wrong-book',
    linkText: '查看错题本',
  },
  {
    icon: '📝',
    title: '模拟考试',
    desc: '限时作答，自动批阅。选择科目、题量和难度，模拟真实高考场景。考后生成详细成绩报告和模块分析。',
    color: '#185FA5',
    link: '/exam',
    linkText: '开始模拟考试',
  },
  {
    icon: '📊',
    title: '学情分析',
    desc: '雷达图展示各模块掌握度，趋势图记录刷题进步，薄弱知识点一目了然。数据驱动你的复习计划。',
    color: '#3B6D11',
    link: '/stats',
    linkText: '查看学情报告',
  },
]

export default function Onboarding() {
  const { completeOnboarding, currentUser } = useStore()
  const [step, setStep] = useState(0)

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const handleFinish = () => {
    completeOnboarding()
  }

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: 'white', borderRadius: 16, maxWidth: 440, width: '100%',
          overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* 顶部图标区 */}
        <div style={{
          background: `linear-gradient(135deg, ${current.color} 0%, ${current.color}dd 100%)`,
          padding: '2rem 1.5rem', textAlign: 'center', color: 'white',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'rgba(255,255,255,0.2)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, marginBottom: 12,
          }}>
            {current.icon}
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>{current.title}</h2>
        </div>

        {/* 内容区 */}
        <div style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#5F5E5A', marginBottom: 20, textAlign: 'center' }}>
            {current.desc}
          </p>

          {/* 进度指示器 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 24 : 8, height: 8, borderRadius: 4,
                  background: i === step ? current.color : '#e7e5e4',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>

          {/* 操作按钮 */}
          <div style={{ display: 'flex', gap: 10 }}>
            {!isLast ? (
              <>
                <button
                  onClick={handleFinish}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 8,
                    border: '1.5px solid #e7e5e4', background: 'white',
                    fontSize: 14, color: '#888780', cursor: 'pointer',
                  }}
                >
                  跳过引导
                </button>
                <button
                  onClick={() => setStep(step + 1)}
                  style={{
                    flex: 2, padding: '10px', borderRadius: 8,
                    border: 'none', background: current.color, color: 'white',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  下一步 ({step + 1}/{STEPS.length})
                </button>
              </>
            ) : (
              <button
                onClick={handleFinish}
                style={{
                  width: '100%', padding: '12px', borderRadius: 8,
                  border: 'none', background: current.color, color: 'white',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer',
                }}
              >
                开始使用 →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
