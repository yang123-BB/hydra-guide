import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const OFFLINE_USER_KEY = 'gaokao_offline_user'

function getOfflineUser() {
  try {
    const raw = localStorage.getItem(OFFLINE_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function setOfflineUser(user) {
  localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(user))
}
function clearOfflineUser() {
  localStorage.removeItem(OFFLINE_USER_KEY)
}

// 快速连通性检测：3秒超时，检测 Supabase 是否可达
async function checkSupabaseReachable() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://eankrbgtlupuaodtdhw.supabase.co'}/auth/v1/health`, {
      signal: controller.signal,
      headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jJKrkC1NkFTSpbgho5Koaw_lUrLmo1B' },
    })
    clearTimeout(timeout)
    return true
  } catch {
    return false
  }
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [offlineMode, setOfflineMode] = useState(false)
  const offlineRef = useRef(false) // 同步引用，避免闭包旧值

  // 检测 Supabase 可用性，并恢复会话
  useEffect(() => {
    let cancelled = false

    const init = async () => {
      // 第一步：快速检测 Supabase 是否可达（3秒超时）
      const reachable = await checkSupabaseReachable()
      if (cancelled) return

      if (!reachable) {
        // Supabase 不可达 → 直接离线模式，不再碰 Supabase
        offlineRef.current = true
        setOfflineMode(true)
        setUser(getOfflineUser())
        setSession(null)
        setLoading(false)
        return
      }

      // 第二步：Supabase 可达，正常获取会话
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (cancelled) return
        setSession(session)
        setUser(session?.user ?? null)
        setOfflineMode(false)
      } catch (e) {
        if (cancelled) return
        offlineRef.current = true
        setOfflineMode(true)
        setUser(getOfflineUser())
        setSession(null)
      }
      if (!cancelled) setLoading(false)
    }

    init()

    // 监听 auth 状态变化（仅在线模式有效）
    let subscription = null
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!offlineRef.current) {
          setSession(session)
          setUser(session?.user ?? null)
        }
      })
      subscription = data.subscription
    } catch {
      // Supabase 不可用，忽略监听
    }

    return () => {
      cancelled = true
      subscription?.unsubscribe()
    }
  }, [])

  // 邮箱密码登录
  const signIn = async (email, password) => {
    setError(null)

    if (offlineRef.current) {
      // 离线模式：localStorage 模拟登录
      const offline = getOfflineUser()
      if (!offline) {
        throw new Error('离线模式：该邮箱未注册，请先注册')
      }
      if (offline.email !== email) {
        throw new Error('离线模式：邮箱或密码错误')
      }
      setUser(offline)
      return { user: offline, session: null }
    }

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (err) throw err
      return data
    } catch (e) {
      // 网络错误 → 切换离线模式
      if (e.message && (e.message.includes('fetch') || e.message.includes('network') || e.message.includes('Failed'))) {
        offlineRef.current = true
        setOfflineMode(true)
        const offline = getOfflineUser()
        if (!offline) throw new Error('离线模式：该邮箱未注册，请先注册')
        if (offline.email !== email) throw new Error('离线模式：邮箱或密码错误')
        setUser(offline)
        return { user: offline, session: null }
      }
      setError(e.message)
      throw e
    }
  }

  // 注册新用户
  const signUp = async (email, password, displayName = '') => {
    setError(null)

    if (offlineRef.current) {
      // 离线模式：localStorage 模拟注册
      const offline = getOfflineUser()
      if (offline && offline.email === email) {
        throw new Error('离线模式：该邮箱已被注册')
      }
      const newUser = {
        id: 'offline_' + Date.now(),
        email,
        name: displayName || email.split('@')[0],
        avatar: null,
        created_at: new Date().toISOString(),
      }
      setOfflineUser(newUser)
      setUser(newUser)
      return { user: newUser, session: null }
    }

    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      })
      if (err) throw err
      return data
    } catch (e) {
      // 网络错误 → 切换离线模式
      if (e.message && (e.message.includes('fetch') || e.message.includes('network') || e.message.includes('Failed'))) {
        offlineRef.current = true
        setOfflineMode(true)
        const newUser = {
          id: 'offline_' + Date.now(),
          email,
          name: displayName || email.split('@')[0],
          avatar: null,
          created_at: new Date().toISOString(),
        }
        setOfflineUser(newUser)
        setUser(newUser)
        return { user: newUser, session: null }
      }
      setError(e.message)
      throw e
    }
  }

  // 发送密码重置邮件
  const resetPassword = async (email) => {
    setError(null)
    if (offlineRef.current) {
      throw new Error('离线模式：请直接重新注册账号')
    }
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
      if (err) throw err
    } catch (e) {
      setError(e.message)
      throw e
    }
  }

  // 登出
  const signOut = async () => {
    if (offlineRef.current) {
      clearOfflineUser()
      setUser(null)
      setSession(null)
      return
    }
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } catch (e) {
      // 即使 Supabase 登出失败，也清空本地状态
      clearOfflineUser()
      setUser(null)
      setSession(null)
    }
  }

  const value = {
    user,
    session,
    loading,
    error,
    offlineMode,
    signIn,
    signUp,
    resetPassword,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
