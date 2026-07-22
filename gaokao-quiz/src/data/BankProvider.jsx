/**
 * 题库异步加载 Provider
 * 在 App 根部挂载即后台预载题库（不阻塞首屏渲染）。
 * 组件通过 useBank() 获取已加载的题库数组（未加载时为 null）。
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { loadAllQuestions } from './allQuestions.js'
export { loadAllQuestions }

const BankContext = createContext(null)

export function QuestionBankProvider({ children }) {
  const [bank, setBank] = useState(null)

  useEffect(() => {
    let alive = true
    // 后台预载；loadAllQuestions 内部幂等缓存，重复调用无额外开销
    loadAllQuestions()
      .then(b => { if (alive) setBank(b) })
      .catch(err => { if (alive) console.error('[QuestionBank] 加载失败:', err) })
    return () => { alive = false }
  }, [])

  return (
    <BankContext.Provider value={bank}>
      {children}
    </BankContext.Provider>
  )
}

/** 返回已加载的题库数组；加载完成前为 null */
export function useBank() {
  return useContext(BankContext)
}

/**
 * 包裹需要题库的页面/组件：bank 未就绪时挂起（走最近的 <Suspense> fallback），
 * 就绪后才渲染 children。自身只调用一个 hook（useBank），不会触发 hooks 顺序问题。
 */
export function BankReady({ children }) {
  const bank = useBank()
  if (!bank) throw loadAllQuestions()
  return children
}

/** 题库未就绪时的轻量占位（用于页面级 loading） */
export function BankLoading({ label = '题库加载中…' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 12, padding: '3rem 1rem', color: 'var(--text)', opacity: 0.6,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        border: '3px solid rgba(128,128,128,0.3)', borderTopColor: 'var(--primary, #4f7cff)',
        animation: 'bank-spin 0.8s linear infinite',
      }} />
      <span style={{ fontSize: 13 }}>{label}</span>
      <style>{'@keyframes bank-spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  )
}
