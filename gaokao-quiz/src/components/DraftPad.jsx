import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * 数字草稿板组件
 * - 基于 canvas 的手写/画图/标注
 * - 自动保存到 localStorage（按题目ID）
 * - 支持画笔/橡皮/清除/撤销
 */
export default function DraftPad({ questionId }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState('pen') // pen | eraser
  const [color, setColor] = useState('#2c2c2a')
  const [brushSize, setBrushSize] = useState(2)
  const [showPad, setShowPad] = useState(false)
  const historyRef = useRef([])
  const lastPointRef = useRef(null)

  const STORAGE_PREFIX = 'gaokao_draft_'

  // 初始化 canvas
  useEffect(() => {
    if (!showPad) return
    const canvas = canvasRef.current
    if (!canvas) return

    // 设置 canvas 尺寸（高DPI）
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctxRef.current = ctx

    // 加载已保存的草稿
    loadDraft()
  }, [showPad])

  // 切换题目时重新加载
  useEffect(() => {
    if (showPad) loadDraft()
  }, [questionId, showPad])

  const loadDraft = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + questionId)
      if (saved) {
        const img = new Image()
        img.onload = () => {
          const rect = canvas.getBoundingClientRect()
          ctx.drawImage(img, 0, 0, rect.width, rect.height)
          // 保存到历史
          historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)]
        }
        img.src = saved
      } else {
        historyRef.current = []
      }
    } catch {}
  }, [questionId])

  const saveDraft = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      const dataUrl = canvas.toDataURL('image/png')
      localStorage.setItem(STORAGE_PREFIX + questionId, dataUrl)
    } catch {}
  }, [questionId])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches?.[0] || e.changedTouches?.[0]
    const clientX = touch ? touch.clientX : e.clientX
    const clientY = touch ? touch.clientY : e.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const startDraw = (e) => {
    e.preventDefault()
    const ctx = ctxRef.current
    if (!ctx) return

    setIsDrawing(true)
    const pos = getPos(e)
    lastPointRef.current = pos

    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)

    // 画一个点（方便点击式标注）
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2)
    ctx.fillStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : color
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
    } else {
      ctx.globalCompositeOperation = 'source-over'
    }
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    e.preventDefault()
    const ctx = ctxRef.current
    if (!ctx) return

    const pos = getPos(e)
    ctx.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize
    ctx.strokeStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : color
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'

    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPointRef.current = pos
  }

  const endDraw = (e) => {
    if (!isDrawing) return
    e?.preventDefault()
    setIsDrawing(false)
    const ctx = ctxRef.current
    if (ctx) {
      ctx.globalCompositeOperation = 'source-over'
      // 保存到历史
      const canvas = canvasRef.current
      historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
      if (historyRef.current.length > 20) historyRef.current.shift()
    }
    saveDraft()
  }

  const handleUndo = () => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    if (historyRef.current.length > 1) {
      historyRef.current.pop()
      const prev = historyRef.current[historyRef.current.length - 1]
      ctx.putImageData(prev, 0, 0)
      saveDraft()
    } else if (historyRef.current.length === 1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      historyRef.current = []
      saveDraft()
    }
  }

  const handleClear = () => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    historyRef.current = []
    saveDraft()
  }

  const colors = ['#2c2c2a', '#A32D2D', '#534AB7', '#3B6D11', '#D85A30']

  if (!showPad) {
    return (
      <button
        className="btn-outline"
        style={{ fontSize: 12, padding: '3px 10px' }}
        onClick={() => setShowPad(true)}
      >
        ✏ 草稿板
      </button>
    )
  }

  return (
    <div style={{
      marginTop: 12,
      borderRadius: 10,
      border: '1.5px solid var(--card-border)',
      overflow: 'hidden',
      background: 'var(--card-bg)',
    }}>
      {/* 工具栏 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        padding: '6px 10px', borderBottom: '1px solid var(--card-border)',
        background: 'var(--hover-bg)',
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--sub-text-2)' }}>✏ 草稿板</span>
        {/* 工具 */}
        <button
          onClick={() => setTool('pen')}
          style={{
            padding: '2px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
            border: tool === 'pen' ? '1.5px solid var(--primary)' : '1.5px solid var(--card-border)',
            background: tool === 'pen' ? 'var(--primary-light)' : 'var(--card-bg)',
            color: tool === 'pen' ? 'var(--primary)' : 'var(--sub-text)',
          }}
        >画笔</button>
        <button
          onClick={() => setTool('eraser')}
          style={{
            padding: '2px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
            border: tool === 'eraser' ? '1.5px solid var(--primary)' : '1.5px solid var(--card-border)',
            background: tool === 'eraser' ? 'var(--primary-light)' : 'var(--card-bg)',
            color: tool === 'eraser' ? 'var(--primary)' : 'var(--sub-text)',
          }}
        >橡皮</button>
        {/* 颜色 */}
        {colors.map(c => (
          <button
            key={c}
            onClick={() => { setColor(c); setTool('pen') }}
            style={{
              width: 16, height: 16, borderRadius: '50%', cursor: 'pointer',
              border: color === c ? '2px solid var(--primary)' : '2px solid var(--card-border)',
              background: c, padding: 0,
            }}
          />
        ))}
        {/* 笔触粗细 */}
        <select
          value={brushSize}
          onChange={e => setBrushSize(Number(e.target.value))}
          style={{
            fontSize: 11, padding: '1px 4px', borderRadius: 4,
            border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text)',
          }}
        >
          <option value={1}>细</option>
          <option value={2}>中</option>
          <option value={4}>粗</option>
        </select>
        {/* 操作 */}
        <button onClick={handleUndo} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, cursor: 'pointer', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--sub-text)' }}>撤销</button>
        <button onClick={handleClear} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, cursor: 'pointer', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--wrong)' }}>清除</button>
        <button onClick={() => setShowPad(false)} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, cursor: 'pointer', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--sub-text)', marginLeft: 'auto' }}>收起</button>
      </div>
      {/* 画布 */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 200,
          background: 'var(--input-bg)',
          cursor: tool === 'eraser' ? 'cell' : 'crosshair',
          touchAction: 'none',
          display: 'block',
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
    </div>
  )
}
