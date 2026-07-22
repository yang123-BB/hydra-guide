/**
 * 骨架屏组件 - 页面加载时的占位动画
 */
export default function Skeleton({ type = 'card', count = 3 }) {
  if (type === 'card') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="skeleton" style={{ height: 32, width: 120 }} />
              <div className="skeleton" style={{ height: 32, width: 80 }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'grid') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton" style={{ height: 18, width: '50%', marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 12, width: '70%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 4, width: '100%', marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 14, width: '40%' }} />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'stats') {
    return (
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            <div className="skeleton" style={{ height: 28, width: 60, marginBottom: 4 }} />
            <div className="skeleton" style={{ height: 13, width: 50 }} />
          </div>
        ))}
      </div>
    )
  }

  return <div className="skeleton" style={{ height: 20, width: '100%' }} />
}
