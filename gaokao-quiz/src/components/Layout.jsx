import { useState, useEffect, Suspense } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useStore, THEMES, FONT_SIZES } from '../lib/store.js'
import { subjects } from '../data/subjects.js'
import { useAuth } from '../context/AuthContext'
import Skeleton from './Skeleton.jsx'
import SearchModal from './SearchModal.jsx'
import Onboarding from './Onboarding.jsx'
import FilterSidebar from './FilterSidebar.jsx'
import { BankReady } from '../data/BankProvider.jsx'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser: storeUser, logout: storeLogout, currentSubject, settings, updateSettings, onboardingCompleted, login: storeLogin } = useStore()
  const { user: supabaseUser, signOut: supabaseSignOut } = useAuth()

  // 使用 Supabase 用户信息（优先），回退到本地存储用户
  const currentUser = supabaseUser ? {
    name: supabaseUser.user_metadata?.display_name || supabaseUser.email?.split('@')[0] || '用户',
    id: supabaseUser.id,
    email: supabaseUser.email,
  } : storeUser

  const [showSearch, setShowSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const subj = (subjects || []).find(s => s.id === currentSubject) || (subjects || [])[0]

  // 判断是否显示侧边栏（首页和刷题页显示，其他页面不显示）
  const showSidebar = location.pathname === '/' ||
    location.pathname.startsWith('/practice')

  // 检测移动端
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // 应用主题
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.theme || 'light')
    document.body.setAttribute('data-high-contrast', settings.highContrast ? 'true' : 'false')
    const fontSize = settings.fontSize || 'medium'
    const scale = FONT_SIZES[fontSize]?.scale || 1
    document.documentElement.style.setProperty('--font-scale', scale)
  }, [settings.theme, settings.fontSize, settings.highContrast])

  // 键盘快捷键
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const handleLogout = async () => {
    if (supabaseUser) {
      // 使用 Supabase 登出
      await supabaseSignOut()
    }
    storeLogout()
    navigate('/')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* 顶部导航栏 */}
      <nav className="sticky top-0 z-50" style={{
        background: 'var(--nav-bg)',
        borderBottom: '0.5px solid var(--card-border)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 16 }}>
            <NavLink to="/" className="flex items-center gap-2 no-underline" style={{ flexShrink: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700,
              }}>高</div>
              {!isMobile && (
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                  高考刷题通
                </span>
              )}
            </NavLink>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, overflowX: 'auto' }}>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive && window.location.hash === '#/' ? 'active' : ''}`} end>
                首页
              </NavLink>
              <NavLink to={`/practice/${currentSubject}`} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                刷题
              </NavLink>
              <NavLink to="/wrong-book" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                错题
              </NavLink>
              <NavLink to="/exam" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                考试
              </NavLink>
              <NavLink to="/stats" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                学情
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                我的
              </NavLink>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* 搜索按钮 */}
            <button
              onClick={() => setShowSearch(true)}
              style={{
                border: 'none', background: 'var(--hover-bg)', borderRadius: 8,
                padding: '6px 10px', cursor: 'pointer', fontSize: 14,
                color: 'var(--sub-text)', display: 'flex', alignItems: 'center', gap: 4,
              }}
              title="搜索 (Ctrl+K)"
            >
              🔍
            </button>

            {/* 设置按钮 */}
            <button
              onClick={() => setShowSettings(true)}
              style={{
                border: 'none', background: 'var(--hover-bg)', borderRadius: 8,
                padding: '6px 10px', cursor: 'pointer', fontSize: 14,
                color: 'var(--sub-text)',
              }}
              title="设置"
            >
              ⚙
            </button>

            {currentUser ? (
              <>
                {!isMobile && (
                  <span style={{ fontSize: 14, color: 'var(--sub-text-2)' }}>
                    {currentUser.name}{currentUser.email ? ` (${currentUser.email})` : ''}
                  </span>
                )}
                <button onClick={handleLogout} className="btn-outline" style={{ padding: '4px 12px', fontSize: 13 }}>
                  退出
                </button>
              </>
            ) : (
              <NavLink to="/login" className="btn-primary" style={{ textDecoration: 'none', fontSize: 14, padding: '6px 16px' }}>
                登录
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* 页面内容：侧边栏 + 主区域 */}
      <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto' }}>
        {showSidebar && (
          <>
            {/* 桌面端侧边栏 */}
            {!isMobile && (
              <Suspense fallback={null}>
                <BankReady><FilterSidebar /></BankReady>
              </Suspense>
            )}
            {/* 移动端侧边栏 */}
            {isMobile && (
              <Suspense fallback={null}>
                <BankReady>
                  <FilterSidebar
                    mobileOpen={showMobileFilter}
                    onCloseMobile={() => setShowMobileFilter(false)}
                  />
                </BankReady>
              </Suspense>
            )}
          </>
        )}

        <div className="fade-in" style={{ flex: 1, minWidth: 0 }}>
          <Suspense fallback={<Skeleton type="grid" count={6} />}>
            <Outlet />
          </Suspense>
        </div>
      </div>

      {/* 移动端筛选浮动按钮 */}
      {showSidebar && isMobile && !showMobileFilter && (
        <button
          onClick={() => setShowMobileFilter(true)}
          style={{
            position: 'fixed', bottom: 20, right: 20, zIndex: 100,
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--primary)', color: 'white',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title="筛选"
        >
          {isMobile ? '☰' : '筛选'}
        </button>
      )}

      {/* 搜索弹窗 */}
      {showSearch && (
        <Suspense fallback={null}>
          <BankReady><SearchModal onClose={() => setShowSearch(false)} /></BankReady>
        </Suspense>
      )}

      {/* 新手引导 */}
      {!onboardingCompleted && <Onboarding />}

      {/* 设置弹窗 */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          updateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

/** 设置弹窗 */
function SettingsModal({ settings, updateSettings, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.3)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: '90%', maxWidth: 380, padding: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>设置</h2>
          <button
            onClick={onClose}
            style={{
              border: 'none', background: 'var(--hover-bg)', borderRadius: 6,
              padding: '4px 10px', cursor: 'pointer', fontSize: 14,
              color: 'var(--sub-text)',
            }}
          >
            ✕
          </button>
        </div>

        {/* 主题选择 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--sub-text-2)', display: 'block', marginBottom: 8 }}>
            主题模式
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.entries(THEMES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => updateSettings({ theme: key })}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
                  border: settings.theme === key
                    ? '2px solid var(--primary)'
                    : '2px solid var(--card-border)',
                  background: settings.theme === key ? 'var(--primary-light)' : 'var(--card-bg)',
                  color: settings.theme === key ? 'var(--primary)' : 'var(--sub-text)',
                  fontSize: 13, fontWeight: 500,
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 4 }}>
                  {key === 'light' ? '☀️' : key === 'dark' ? '🌙' : '🌿'}
                </div>
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* 字体大小 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--sub-text-2)', display: 'block', marginBottom: 8 }}>
            字体大小
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.entries(FONT_SIZES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => updateSettings({ fontSize: key })}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer',
                  border: settings.fontSize === key
                    ? '2px solid var(--primary)'
                    : '2px solid var(--card-border)',
                  background: settings.fontSize === key ? 'var(--primary-light)' : 'var(--card-bg)',
                  color: settings.fontSize === key ? 'var(--primary)' : 'var(--sub-text)',
                  fontSize: val.base,
                  fontWeight: 500,
                }}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* 关于 + 功能说明 */}
        <div style={{
          padding: 12, background: 'var(--hover-bg)', borderRadius: 8,
          fontSize: 12, color: 'var(--sub-text)', lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 600, color: 'var(--sub-text-2)', marginBottom: 6 }}>功能说明</div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 2 }}>
            <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#E8F5E0', color: '#3B6D11', fontWeight: 600 }}>免费</span>
            <span>刷题、错题本、模拟考试、学情报告、智能推荐</span>
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#FFF0E6', color: '#D85A30', fontWeight: 600 }}>增值</span>
            <span>AI学习计划、错题组卷导出、学情报告PDF导出</span>
          </div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '0.5px solid var(--card-border)' }}>
            高考刷题通 v3.0 — 数据存储在本地浏览器，支持备份恢复。
          </div>
        </div>
      </div>
    </div>
  )
}
