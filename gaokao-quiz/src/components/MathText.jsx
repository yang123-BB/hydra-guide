import { useEffect, useRef } from 'react'
import katex from 'katex'

/**
 * 渲染包含 LaTeX 公式的文本
 * 支持 $...$ 行内公式和 $$...$$ 块级公式
 */
export default function MathText({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || !children) return

    const text = String(children)
    const parts = []
    let lastIndex = 0
    const regex = /\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g
    let match

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
      }
      if (match[1] !== undefined) {
        parts.push({ type: 'block', content: match[1] })
      } else {
        parts.push({ type: 'inline', content: match[2] })
      }
      lastIndex = regex.lastIndex
    }
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) })
    }

    ref.current.innerHTML = parts.map(part => {
      if (part.type === 'text') {
        return escapeHtml(part.content)
      }
      try {
        return katex.renderToString(part.content, {
          displayMode: part.type === 'block',
          throwOnError: false,
          errorColor: '#A32D2D',
        })
      } catch {
        return escapeHtml(part.content)
      }
    }).join('')
  }, [children])

  return <div ref={ref} className={`math-content ${className}`}></div>
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}
