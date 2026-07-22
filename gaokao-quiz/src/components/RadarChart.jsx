/**
 * SVG 雷达图组件
 * @param {Object} props
 * @param {Array<{label: string, value: number}>} props.data - 数据项，value 范围 0-100
 * @param {string} props.color - 主色
 * @param {number} props.size - 图表尺寸
 */
export default function RadarChart({ data, color = '#534AB7', size = 260 }) {
  if (!data || data.length === 0) return null

  const center = size / 2
  const radius = size * 0.36
  const labelRadius = radius + 22
  const n = data.length
  const angleStep = (Math.PI * 2) / n

  // 网格圈（5层）
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]

  // 计算每个点的坐标
  const getPoint = (index, valueRatio) => {
    const angle = -Math.PI / 2 + index * angleStep
    const r = radius * valueRatio
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  // 获取标签位置
  const getLabelPos = (index) => {
    const angle = -Math.PI / 2 + index * angleStep
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
      anchor: Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end',
    }
  }

  // 数据多边形路径
  const dataPoints = data.map((d, i) => {
    const ratio = Math.max(0, Math.min(1, d.value / 100))
    return getPoint(i, ratio)
  })
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto' }}>
      {/* 网格 */}
      {gridLevels.map((level, li) => {
        const points = data.map((_, i) => {
          const p = getPoint(i, level)
          return `${p.x},${p.y}`
        }).join(' ')
        return (
          <polygon
            key={li}
            points={points}
            fill="none"
            stroke="#e7e5e4"
            strokeWidth="0.5"
          />
        )
      })}

      {/* 轴线 */}
      {data.map((_, i) => {
        const p = getPoint(i, 1.0)
        return (
          <line
            key={i}
            x1={center} y1={center}
            x2={p.x} y2={p.y}
            stroke="#e7e5e4"
            strokeWidth="0.5"
          />
        )
      })}

      {/* 数据区域 */}
      <path
        d={dataPath}
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* 数据点 */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x} cy={p.y}
          r="3"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      ))}

      {/* 标签 */}
      {data.map((d, i) => {
        const pos = getLabelPos(i)
        return (
          <text
            key={i}
            x={pos.x} y={pos.y}
            textAnchor={pos.anchor}
            dominantBaseline="middle"
            fontSize="11"
            fill="#5F5E5A"
          >
            {d.label}
          </text>
        )
      })}

      {/* 数值标签 */}
      {data.map((d, i) => {
        const ratio = Math.max(0, Math.min(1, d.value / 100))
        const p = getPoint(i, ratio)
        return d.value > 0 ? (
          <text
            key={`v-${i}`}
            x={p.x} y={p.y - 8}
            textAnchor="middle"
            fontSize="9"
            fill={color}
            fontWeight="600"
          >
            {d.value}%
          </text>
        ) : null
      })}
    </svg>
  )
}
