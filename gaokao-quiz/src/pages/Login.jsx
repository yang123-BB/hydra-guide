import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signUp, resetPassword, error: authError, offlineMode } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [mode, setMode] = useState('login') // login | register | forgot
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const error = localError || authError

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)
    setSuccessMsg('')
    if (!email.trim()) { setLocalError('请输入邮箱地址'); return }
    if (!password) { setLocalError('请输入密码'); return }

    setLoading(true)
    try {
      if (mode === 'login') {
        const data = await signIn(email.trim(), password)
        if (data?.user) {
          // 登录成功 → 跳转首页（离线/在线均适用）
          navigate('/')
        }
      } else if (mode === 'register') {
        if (password.length < 6) { setLocalError('密码至少6位'); setLoading(false); return }
        const data = await signUp(email.trim(), password, displayName.trim())
        if (data?.user) {
          if (offlineMode) {
            setSuccessMsg('离线模式：注册成功！已自动登录。')
            setTimeout(() => navigate('/'), 1500)
          } else {
            setSuccessMsg('注册成功！已发送确认邮件到您的邮箱，请查收后登录。')
            setMode('login')
          }
        }
      }
    } catch (e) {
      // 错误已在 AuthContext 中处理
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) { setLocalError('请先输入邮箱地址'); return }
    setLoading(true)
    try {
      await resetPassword(email.trim())
      setSuccessMsg('重置邮件已发送，请查收邮箱！')
      setMode('login')
    } catch (e) {
      // 错误已在 AuthContext 中处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container" style={{ maxWidth: 420, paddingTop: '3rem' }}>
      <div className="card" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        {/* Logo & 标题 */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: 'linear-gradient(135deg, #534AB7, #7C6FE8)',
            color: 'white',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, marginBottom: 12,
            boxShadow: '0 4px 16px rgba(83,74,183,0.35)',
          }}>高</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2c2c2a' }}>
            {mode === 'login' && '欢迎回来'}
            {mode === 'register' && '注册高考刷题通'}
            {mode === 'forgot' && '重置密码'}
          </h1>
          <p style={{ fontSize: 14, color: '#888780', marginTop: 4 }}>
            {mode === 'login' && '使用邮箱和密码登录你的账号'}
            {mode === 'register' && '创建账号开始刷题之旅'}
            {mode === 'forgot' && '输入邮箱，我们将发送重置链接'}
          </p>
        </div>

        {/* 离线模式提示 */}
        {offlineMode && (
          <div style={{
            marginBottom: 16, padding: '10px 12px',
            background: '#FFF8E1', borderRadius: 8,
            fontSize: 13, color: '#8D6E63', lineHeight: 1.5,
            border: '1px solid #FFECB3',
          }}>
            ⚠️ <strong>离线模式</strong>：当前网络无法连接云端服务器，已自动切换到本地存储模式。您的数据仅保存在本浏览器中，换设备后数据不互通。
          </div>
        )}

        {/* 成功提示 */}
        {successMsg && (
          <div style={{
            marginBottom: 16, padding: 10, background: '#E8F5E9',
            borderRadius: 8, fontSize: 13.5, color: '#2E7D32',
            lineHeight: 1.5,
          }}>✅ {successMsg}</div>
        )}

        {/* 错误提示 */}
        {error && (
          <div style={{
            marginBottom: 16, padding: 10, background: '#FFEBEE',
            borderRadius: 8, fontSize: 13.5, color: '#C62828',
            lineHeight: 1.5,
          }}>⚠️ {error}</div>
        )}

        {/* 登录/注册表单 */}
        {mode !== 'forgot' ? (
          <form onSubmit={handleSubmit}>
            {/* 昵称（仅注册时显示） */}
            {mode === 'register' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13.5, color: '#5F5E5A', marginBottom: 6, fontWeight: 500 }}>
                  昵称
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="你的昵称（选填）"
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13.5, color: '#5F5E5A', marginBottom: 6, fontWeight: 500 }}>
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                style={inputStyle}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13.5, color: '#5F5E5A', marginBottom: 6, fontWeight: 500 }}>
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'register' ? '至少6位字符' : '输入密码'}
                minLength={6}
                required
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%', fontSize: 15, fontWeight: 600,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: '0.75rem',
              }}
            >
              {loading ? '处理中...' : mode === 'login' ? '登 录' : '注 册'}
            </button>
          </form>
        ) : (
          /* 忘记密码表单 */
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="请输入注册邮箱"
              required
              style={{ ...inputStyle, width: '100%', marginBottom: 16 }}
              autoFocus
            />
            <button
              onClick={handleForgotPassword}
              disabled={loading || !email.trim()}
              className="btn-primary"
              style={{
                width: '100%', fontSize: 15, fontWeight: 600,
                opacity: loading || !email.trim() ? 0.7 : 1,
                cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
                padding: '0.75rem',
              }}
            >
              {loading ? '发送中...' : '发送重置邮件'}
            </button>
          </div>
        )}

        {/* 切换模式 */}
        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13.5 }}>
          {mode === 'login' && (
            <>
              <span style={{ color: '#888780' }}>还没有账号？</span>{' '}
              <button
                onClick={() => { setMode('register'); setError(null); setLocalError(null); }}
                style={linkStyle}
              >立即注册</button>
              {' · '}
              <button
                onClick={() => { setMode('forgot'); setError(null); setLocalError(null); }}
                style={linkStyle}
              >忘记密码？</button>
            </>
          )}
          {mode === 'register' && (
            <>
              <span style={{ color: '#888780' }}>已有账号？</span>{' '}
              <button
                onClick={() => { setMode('login'); setError(null); setLocalError(null); }}
                style={linkStyle}
              >去登录</button>
            </>
          )}
          {mode === 'forgot' && (
            <>
              <button
                onClick={() => { setMode('login'); setError(null); setLocalError(null); }}
                style={linkStyle}
              >← 返回登录</button>
            </>
          )}
        </div>

        {/* 底部信息 */}
        <div style={{
          marginTop: 20, paddingTop: 18, borderTop: '1px solid #f0efea',
          fontSize: 11.5, color: '#b8b7ae', textAlign: 'center',
          lineHeight: 1.6,
        }}>
          {offlineMode ? (
            <>
              当前处于离线模式，数据仅保存在本地浏览器<br/>
              清除浏览器缓存或换设备后数据将丢失
            </>
          ) : (
            <>
              数据安全存储于 Supabase 云端数据库<br/>
              支持 PC / 手机多端同步登录
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.875rem',
  borderRadius: 8,
  border: '1.5px solid #e7e5e4',
  fontSize: 14.5,
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box',
}

const linkStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 13.5,
  color: '#534AB7',
  fontWeight: 500,
  textDecoration: 'underline',
  textDecorationColor: 'transparent',
}
