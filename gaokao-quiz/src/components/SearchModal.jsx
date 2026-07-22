import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { searchQuestions, getQuestionBankStats } from '../data/allQuestions.js'
import { useBank, loadAllQuestions } from '../data/BankProvider.jsx'
import { subjects, getModuleByPointId, getModuleById, getModulesBySubject } from '../data/subjects.js'

// ─── 标签选项常量 ──────────────────────────────────────────────
const EXAM_AREA_OPTS = [
  { value: 'new1',   label: '新高考Ⅰ卷' },
  { value: 'new2',   label: '新高考Ⅱ卷' },
  { value: 'old1',   label: '全国甲卷' },
  { value: 'old2',   label: '全国乙卷' },
]
const TYPE_OPTS = [
  { value: 'single-choice', label: '单选' },
  { value: 'multi-choice',  label: '多选' },
  { value: 'fill-blank',    label: '填空' },
  { value: 'short-answer',  label: '解答' },
  { value: 'calculation',   label: '计算' },
]
const SOURCE_OPTS = [
  { value: 'gaokao',  label: '高考真题' },
  { value: 'mock',     label: '模拟卷' },
  { value: 'monthly',  label: '月考' },
  { value: 'quiz',      label: '联考' },
  { value: 'variation',label: '变式题' },
]
const TEACHING_TAG_OPTS = [
  { value: 'high-freq',    label: '★高频必考' },
  { value: 'easy-mistake', label: '易错题' },
  { value: 'has-image',    label: '含几何图' },
  { value: 'calc-easy',    label: '计算易错' },
  { value: 'misread-trap', label: '审题陷阱' },
  { value: 'hard-mother',  label: '压轴母题' },
]

export default function SearchModal({ onClose }) {
  const [query, setQuery]           = useState('')
  const [activeTab, setActiveTab]   = useState('keyword') // keyword | filters
  const [filters, setFilters]       = useState({
    subject:        '',
    module:        '',
    pointId:       '',
    questionType:   '',
    difficultyStars: 0,   // 0=不限
    source:         '',
    examArea:       [],
    teachingTags:   [],
    year:           '',
  })
  const inputRef = useRef(null)

  const bank = useBank()

  useEffect(() => { inputRef.current?.focus() }, [])

  // 当前科目下的模块列表
  const moduleOptions = useMemo(() => {
    if (!filters.subject) return []
    return getModulesBySubject(filters.subject)
  }, [filters.subject])

  // 当前模块下的知识点列表
  const pointOptions = useMemo(() => {
    if (!filters.module) return []
    const m = getModuleById(filters.module)
    return m ? m.points : []
  }, [filters.module])

  if (!bank) throw loadAllQuestions()

  // 搜索执行
  const results = useMemo(() => {
    if (activeTab === 'filters') {
      // 标签筛选模式
      const criteria = {}
      if (filters.subject)        criteria.subject        = filters.subject
      if (filters.module)        criteria.module        = filters.module
      if (filters.pointId)       criteria.pointId       = filters.pointId
      if (filters.questionType)   criteria.questionType   = filters.questionType
      if (filters.difficultyStars) criteria.difficultyStars = filters.difficultyStars
      if (filters.source)         criteria.source         = filters.source
      if (filters.examArea.length) criteria.examArea      = filters.examArea
      if (filters.teachingTags.length) criteria.teachingTags = filters.teachingTags
      const list = searchQuestions(criteria)
      return { type: 'filters', list, total: list.length }
    }
    // 关键词模式
    if (!query.trim()) return { type: 'keyword', list: [], total: 0 }
    const q = query.trim().toLowerCase()
    const byContent = bank.filter(item =>
      item.content.toLowerCase().includes(q)
    ).slice(0, 10)
    const byPoint = []
    subjects.forEach(s => {
      s.modules.forEach(m => {
        m.points.forEach(p => {
          if (p.name.toLowerCase().includes(q)) {
            byPoint.push({ _type: 'point', ...p, subjectId: s.id, subjectName: s.name, moduleName: m.name })
          }
        })
      })
    })
    const byModule = []
    subjects.forEach(s => {
      s.modules.forEach(m => {
        if (m.name.toLowerCase().includes(q)) {
          byModule.push({ _type: 'module', ...m, subjectId: s.id, subjectName: s.name })
        }
      })
    })
    return {
      type: 'keyword',
      byContent: byContent.slice(0, 8),
      byPoint:   byPoint.slice(0, 6),
      byModule:  byModule.slice(0, 6),
      total: byContent.length + byPoint.length + byModule.length,
    }
  }, [query, activeTab, filters])

  // 题库统计
  const stats = useMemo(() => getQuestionBankStats(filters.subject || null), [filters.subject])

  function toggleArrayFilter(field, value) {
    setFilters(prev => {
      const arr = [...prev[field]]
      const idx = arr.indexOf(value)
      if (idx >= 0) arr.splice(idx, 1)
      else arr.push(value)
      return { ...prev, [field]: arr }
    })
  }

  function clearFilters() {
    setFilters({ subject:'', module:'', pointId:'', questionType:'', difficultyStars:0, source:'', examArea:[], teachingTags:[], year:'' })
  }

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.35)', zIndex: 200,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 40,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '94%', maxWidth: 680, maxHeight: '85vh', overflow: 'auto',
          padding: 0, display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 顶部搜索栏 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderBottom: '0.5px solid #e7e5e4',
          position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 2,
        }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveTab('keyword') }}
            placeholder="搜索题目、知识点、模块..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 15, background: 'transparent',
            }}
            onKeyDown={e => { if (e.key === 'Escape') onClose() }}
          />
          <button
            onClick={() => { setActiveTab(t => t === 'filters' ? 'keyword' : 'filters') }}
            style={{
              border: `1px solid ${activeTab === 'filters' ? 'var(--primary)' : '#e7e5e4'}`,
              background: activeTab === 'filters' ? 'var(--primary-light)' : '#f5f5f4',
              borderRadius: 6, padding: '4px 10px', fontSize: 12,
              color: activeTab === 'filters' ? 'var(--primary)' : '#888780',
              cursor: 'pointer',
            }}
          >
            筛选
          </button>
          <button
            onClick={onClose}
            style={{
              border: 'none', background: '#f5f5f4', borderRadius: 6,
              padding: '4px 10px', fontSize: 12, color: '#888780', cursor: 'pointer',
            }}
          >ESC</button>
        </div>

        {/* 筛选面板 */}
        {activeTab === 'filters' && (
          <div style={{ padding: 16, borderBottom: '0.5px solid #e7e5e4', overflow: 'auto' }}>
            {/* 科目 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#888780', marginBottom: 6 }}>科目</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {subjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setFilters(prev => ({ ...prev, subject: prev.subject === s.id ? '' : s.id, module: '', pointId: '' }))}
                    style={{
                      border: `1px solid ${filters.subject === s.id ? s.color : '#e7e5e4'}`,
                      background: filters.subject === s.id ? s.colorLight : 'white',
                      borderRadius: 6, padding: '4px 10px', fontSize: 13, cursor: 'pointer',
                    }}
                  >{s.icon} {s.name}</button>
                ))}
              </div>
            </div>

            {/* 题型 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#888780', marginBottom: 6 }}>题型</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TYPE_OPTS.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setFilters(prev => ({ ...prev, questionType: prev.questionType === t.value ? '' : t.value }))}
                    style={{
                      border: `1px solid ${filters.questionType === t.value ? 'var(--primary)' : '#e7e5e4'}`,
                      background: filters.questionType === t.value ? 'var(--primary-light)' : 'white',
                      borderRadius: 6, padding: '4px 10px', fontSize: 13, cursor: 'pointer',
                    }}
                  >{t.label}</button>
                ))}
              </div>
            </div>

            {/* 难度 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#888780', marginBottom: 6 }}>难度星级</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1,2,3,4,5].map(d => (
                  <button
                    key={d}
                    onClick={() => setFilters(prev => ({ ...prev, difficultyStars: prev.difficultyStars === d ? 0 : d }))}
                    style={{
                      border: `1px solid ${filters.difficultyStars === d ? 'var(--primary)' : '#e7e5e4'}`,
                      background: filters.difficultyStars === d ? 'var(--primary-light)' : 'white',
                      borderRadius: 6, padding: '4px 8px', fontSize: 13, cursor: 'pointer',
                    }}
                  >{'★'.repeat(d)}{'☆'.repeat(5-d)}</button>
                ))}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, difficultyStars: 0 }))}
                  style={{
                    border: `1px solid ${filters.difficultyStars === 0 ? 'var(--primary)' : '#e7e5e4'}`,
                    background: filters.difficultyStars === 0 ? 'var(--primary-light)' : 'white',
                    borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer',
                  }}
                >不限</button>
              </div>
            </div>

            {/* 来源 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#888780', marginBottom: 6 }}>题目来源</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SOURCE_OPTS.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setFilters(prev => ({ ...prev, source: prev.source === s.value ? '' : s.value }))}
                    style={{
                      border: `1px solid ${filters.source === s.value ? 'var(--primary)' : '#e7e5e4'}`,
                      background: filters.source === s.value ? 'var(--primary-light)' : 'white',
                      borderRadius: 6, padding: '4px 10px', fontSize: 13, cursor: 'pointer',
                    }}
                  >{s.label}</button>
                ))}
              </div>
            </div>

            {/* 教研标签 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#888780', marginBottom: 6 }}>教研标签</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TEACHING_TAG_OPTS.map(t => (
                  <button
                    key={t.value}
                    onClick={() => toggleArrayFilter('teachingTags', t.value)}
                    style={{
                      border: `1px solid ${filters.teachingTags.includes(t.value) ? 'var(--primary)' : '#e7e5e4'}`,
                      background: filters.teachingTags.includes(t.value) ? 'var(--primary-light)' : 'white',
                      borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer',
                    }}
                  >{t.label}</button>
                ))}
              </div>
            </div>

            {/* 操作 */}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={clearFilters}
                className="btn-outline"
                style={{ fontSize: 13 }}
              >清除筛选</button>
              <span style={{ fontSize: 13, color: '#888780', marginLeft: 'auto', alignSelf: 'center' }}>
                {results.type === 'filters' ? `找到 ${results.total} 道题` : ''}
              </span>
            </div>
          </div>
        )}

        {/* 搜索结果 */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
          {activeTab === 'keyword' && !query.trim() && (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#888780', fontSize: 14 }}>
              <div style={{ marginBottom: 8, fontSize: 28 }}>🔍</div>
              输入关键词搜索，或点击「筛选」按标签查找题目
            </div>
          )}

          {/* 关键词模式结果 */}
          {activeTab === 'keyword' && results.type === 'keyword' && results.total > 0 && (
            <>
              {/* 知识点结果 */}
              {results.byPoint?.length > 0 && (
                <div style={{ padding: '0 16px 8px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#888780', marginBottom: 6 }}>知识点 ({results.byPoint.length})</div>
                  {results.byPoint.map(p => (
                    <Link
                      key={`p-${p.subjectId}-${p.id}`}
                      to={`/practice/${p.subjectId}`}
                      onClick={onClose}
                      style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:8, textDecoration:'none' }}
                      onMouseEnter={e => e.currentTarget.style.background='#f5f5f4'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <span style={{ fontSize:11, color:'#888780', flex:1 }}>{p.subjectName} · {p.moduleName}</span>
                      <span style={{ fontSize:14, color:'#2c2c2a' }}>{p.name}</span>
                      <span style={{ fontSize:12, color:'var(--primary)', fontWeight:500 }}>去练习</span>
                    </Link>
                  ))}
                </div>
              )}
              {/* 题目结果 */}
              {results.byContent?.length > 0 && (
                <div style={{ padding: '0 16px 8px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#888780', marginBottom: 6 }}>题目 ({results.byContent.length})</div>
                  {results.byContent.map(qItem => {
                    const subj = subjects.find(s => s.id === qItem.subject)
                    const tags = qItem.tags || {}
                    return (
                      <div
                        key={qItem.id}
                        style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'8px 12px', borderRadius:8, cursor:'pointer' }}
                        onClick={onClose}
                        onMouseEnter={e => e.currentTarget.style.background='#f5f5f4'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}
                      >
                        <span style={{ width:24, height:24, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, background:subj?.color+'22', color:subj?.color, flexShrink:0 }}>{subj?.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:13, color:'#2c2c2a', lineHeight:1.5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{qItem.content.replace(/\$/g, '')}</div>
                          <div style={{ fontSize:11, color:'#888780', display:'flex', gap:6, flexWrap:'wrap', marginTop:2 }}>
                            {subj?.name}
                            {tags.difficultyStars && ' ★'.repeat(tags.difficultyStars)}
                            {tags.source === 'gaokao' && ' · 高考真题'}
                            {tags.teachingTags?.includes('high-freq') && ' · 高频'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* 筛选模式结果 */}
          {activeTab === 'filters' && results.type === 'filters' && (
            <div style={{ padding: '8px 16px' }}>
              {results.total === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#888780', fontSize: 14 }}>
                  未找到匹配题目，请调整筛选条件
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#888780', marginBottom: 8 }}>
                    找到 {results.total} 道题（显示前 50 道）
                  </div>
                  {results.list.slice(0, 50).map(qItem => {
                    const subj = subjects.find(s => s.id === qItem.subject)
                    const tags = qItem.tags || {}
                    return (
                      <div
                        key={qItem.id}
                        style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:8, cursor:'pointer' }}
                        onClick={onClose}
                        onMouseEnter={e => e.currentTarget.style.background='#f5f5f4'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}
                      >
                        <span style={{ width:20, height:20, borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, background:subj?.color+'22', color:subj?.color }}>{subj?.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:13, color:'#2c2c2a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{qItem.content.replace(/\$/g, '').slice(0, 80)}</div>
                          <div style={{ fontSize:11, color:'#888780' }}>
                            {tags.source === 'gaokao' ? `高考${tags.year || ''}` : SOURCE_OPTS.find(s => s.value === tags.source)?.label || tags.source}
                            {' ★'.repeat(tags.difficultyStars || 2)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          )}
        </div>

        {/* 底部题库统计 */}
        <div style={{
          padding: '10px 16px', borderTop: '0.5px solid #e7e5e4',
          fontSize: 12, color: '#888780', display: 'flex', gap: 16, flexWrap: 'wrap',
          position: 'sticky', bottom: 0, background: 'var(--card-bg)',
        }}>
          <span>题库总量：{stats.total}</span>
          <span>真题：{stats.bySource.gaokao || 0}</span>
          <span>模拟题：{(stats.bySource.mock || 0) + (stats.bySource.monthly || 0) + (stats.bySource.quiz || 0)}</span>
          <span>★高频：{stats.highFreq || 0}</span>
        </div>
      </div>
    </div>
  )
}
