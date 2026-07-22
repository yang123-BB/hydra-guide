import { Component, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Skeleton from './components/Skeleton.jsx'
import Login from './pages/Login.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { QuestionBankProvider, BankReady } from './data/BankProvider.jsx'

// 路由级代码分割：首屏仅加载 Home + 公共 chunk，其余页面按需懒加载
const Home = lazy(() => import('./pages/Home.jsx'))
const Practice = lazy(() => import('./pages/Practice.jsx'))
const WrongBook = lazy(() => import('./pages/WrongBook.jsx'))
const Stats = lazy(() => import('./pages/Stats.jsx'))
const Exam = lazy(() => import('./pages/Exam.jsx'))
const ExamTaking = lazy(() => import('./pages/ExamTaking.jsx'))
const ExamResult = lazy(() => import('./pages/ExamResult.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', color: '#c00', background: '#fff5f5' }}>
          <h2>⚠️ 页面渲染出错</h2>
          <pre style={{ fontSize: 12, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {String(this.state.error.stack || this.state.error.message || this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

// 受保护路由：未登录时跳转到登录页
function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>加载中...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <ErrorBoundary>
      <QuestionBankProvider>
      <AuthProvider>
      <Suspense fallback={<Skeleton type="grid" count={6} />}>
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="practice" element={
          <RequireAuth><BankReady><Practice /></BankReady></RequireAuth>
        } />
        <Route path="practice/:subject" element={
          <RequireAuth><BankReady><Practice /></BankReady></RequireAuth>
        } />
        <Route path="practice/:subject/:module" element={
          <RequireAuth><BankReady><Practice /></BankReady></RequireAuth>
        } />
        <Route path="practice/:subject/mode/:mode" element={
          <RequireAuth><BankReady><Practice /></BankReady></RequireAuth>
        } />
        <Route path="wrong-book" element={
          <RequireAuth><BankReady><WrongBook /></BankReady></RequireAuth>
        } />
        <Route path="wrong-book/:subject" element={
          <RequireAuth><BankReady><WrongBook /></BankReady></RequireAuth>
        } />
        <Route path="stats" element={
          <RequireAuth><Stats /></RequireAuth>
        } />
        <Route path="exam" element={
          <RequireAuth><Exam /></RequireAuth>
        } />
        <Route path="exam/taking" element={
          <RequireAuth><ExamTaking /></RequireAuth>
        } />
        <Route path="exam/result" element={
          <RequireAuth><ExamResult /></RequireAuth>
        } />
        <Route path="profile" element={
          <RequireAuth><Profile /></RequireAuth>
        } />
        {/* 登录页不需要认证 */}
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      </Routes>
      </Suspense>
      </AuthProvider>
      </QuestionBankProvider>
    </ErrorBoundary>
  )
}
