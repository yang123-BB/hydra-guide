import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// 全局错误捕获
window.addEventListener('error', (e) => {
  const el = document.getElementById('root')
  if (el && !el.dataset.errorLogged) {
    el.dataset.errorLogged = '1'
    console.error('[Global]', e.message, e.filename, e.lineno)
  }
})

window.addEventListener('unhandledrejection', (e) => {
  const el = document.getElementById('root')
  if (el) {
    console.error('[Promise]', e.reason)
  }
})

const rootEl = document.getElementById('root')

try {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  )
} catch(err) {
  rootEl.innerHTML = '<pre style="padding:20px;color:red;font-size:14px;">FATAL ERROR during React render:\n' + String(err.stack || err.message || err) + '</pre>'
}
