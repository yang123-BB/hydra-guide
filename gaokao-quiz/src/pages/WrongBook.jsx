import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { subjects, getModuleByPointId } from '../data/subjects.js'
import { useBank, loadAllQuestions } from '../data/BankProvider.jsx'
import { useStore, ERROR_REASONS } from '../lib/store.js'
import MathText from '../components/MathText.jsx'

export default function WrongBook() {
  const navigate = useNavigate()
  const {
    wrongQuestions, wrongQuestionMeta, clearWrongQuestion,
    currentSubject, setSubject, setWrongReason, markWrongReviewed,
    favorites, toggleFavorite, notes, setNote,
  } = useStore()

  const [expandedId, setExpandedId] = useState(null)
  const [filterSubject, setFilterSubject] = useState('all')
  const [filterReason, setFilterReason] = useState('all')
  const [filterModule, setFilterModule] = useState('all')
  const [redoMode, setRedoMode] = useState(false)
  const [redoQuestions, setRedoQuestions] = useState([])
  const [redoIndex, setRedoIndex] = useState(0)
  const [redoSelected, setRedoSelected] = useState(null)
  const [redoSubmitted, setRedoSubmitted] = useState(false)
  const [redoResults, setRedoResults] = useState([])
  const [showNoteFor, setShowNoteFor] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [batchMode, setBatchMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [showBatchExport, setShowBatchExport] = useState(false)
  const [exportWithAnswers, setExportWithAnswers] = useState(true)
  const [sortByReview, setSortByReview] = useState(false)

  const bank = useBank()
  if (!bank) throw loadAllQuestions()

  // 获取所有错题详情
  const wrongList = useMemo(() => {
    const list = wrongQuestions
      .map(id => bank.find(q => q.id === id))
      .filter(Boolean)
      .filter(q => filterSubject === 'all' || q.subject === filterSubject)
      .filter(q => filterModule === 'all' || q.module === filterModule)
      .filter(q => {
        if (filterReason === 'all') return true
        const meta = wrongQuestionMeta[q.id]
        if (filterReason === 'unmarked') return !meta?.errorReason
        return meta?.errorReason === filterReason
      })

    if (sortByReview) {
      // 按复习紧急度排序：待复习 > 从未复习 > 已复习
      list.sort((a, b) => {
        const metaA = wrongQuestionMeta[a.id]
        const metaB = wrongQuestionMeta[b.id]
        const dueA = !metaA?.nextReviewDate || new Date(metaA.nextReviewDate).getTime() <= now
        const dueB = !metaB?.nextReviewDate || new Date(metaB.nextReviewDate).getTime() <= now
        if (dueA && !dueB) return -1
        if (!dueA && dueB) return 1
        // 都是待复习或都不是 -> 按复习时间排序
        const nextA = metaA?.nextReviewDate ? new Date(metaA.nextReviewDate).getTime() : 0
        const nextB = metaB?.nextReviewDate ? new Date(metaB.nextReviewDate).getTime() : 0
        return nextA - nextB
      })
    } else {
      // 默认按添加时间倒序
      list.sort((a, b) => {
        const metaA = wrongQuestionMeta[a.id]
        const metaB = wrongQuestionMeta[b.id]
        return new Date(metaB?.addedDate || 0) - new Date(metaA?.addedDate || 0)
      })
    }
    return list
  }, [wrongQuestions, filterSubject, filterReason, filterModule, wrongQuestionMeta, sortByReview])

  // 待复习错题数
  const now = Date.now()
  const reviewDueCount = wrongQuestions.filter(id => {
    const meta = wrongQuestionMeta[id]
    if (!meta || !meta.nextReviewDate) return true
    return new Date(meta.nextReviewDate).getTime() <= now
  }).length

  // 可筛选模块列表
  const availableModules = useMemo(() => {
    const subjId = filterSubject !== 'all' ? filterSubject : currentSubject
    const subj = subjects.find(s => s.id === subjId)
    return subj ? subj.modules : []
  }, [filterSubject, currentSubject])

  // 错题重做模式
  const startRedo = () => {
    if (wrongList.length === 0) return
    setRedoQuestions(wrongList.slice(0, 20))
    setRedoIndex(0)
    setRedoSelected(null)
    setRedoSubmitted(false)
    setRedoResults([])
    setRedoMode(true)
  }

  const handleRedoSubmit = () => {
    if (redoSelected === null) return
    const q = redoQuestions[redoIndex]
    const correct = redoSelected === q.answer
    setRedoResults([...redoResults, { questionId: q.id, correct }])
    if (correct) {
      markWrongReviewed(q.id)
    }
    setRedoSubmitted(true)
  }

  const handleRedoNext = () => {
    if (redoIndex < redoQuestions.length - 1) {
      setRedoIndex(redoIndex + 1)
      setRedoSelected(null)
      setRedoSubmitted(false)
    } else {
      setRedoMode(false)
    }
  }

  const redoCurrent = redoQuestions[redoIndex]
  const redoCorrectCount = redoResults.filter(r => r.correct).length

  // 导出打印
  const handleExport = () => {
    setShowExport(true)
  }

  // 批量选中的题目
  const batchQuestions = useMemo(() => {
    return selectedIds.map(id => bank.find(q => q.id === id)).filter(Boolean)
  }, [selectedIds])

  // 错题重做模式渲染
  if (redoMode && redoCurrent) {
    const subj = subjects.find(s => s.id === redoCurrent.subject) || subjects[0]
    return (
      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#2c2c2a' }}>错题重做</span>
            <span style={{ fontSize: 13, color: '#888780', marginLeft: 12 }}>
              第 {redoIndex + 1} / {redoQuestions.length} 题 · 已答对 {redoCorrectCount} 题
            </span>
          </div>
          <button className="btn-outline" style={{ fontSize: 13 }} onClick={() => setRedoMode(false)}>
            退出重做
          </button>
        </div>

        <div style={{ height: 4, background: '#f0f0ee', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{
            width: `${((redoIndex + 1) / redoQuestions.length) * 100}%`,
            height: '100%', background: subj.color, borderRadius: 2, transition: 'width 0.3s',
          }} />
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="tag" style={{ background: subj.colorLight, color: subj.color }}>
              {subj.icon} {subj.name}
            </span>
            <span className="tag tag-module">
              {getModuleByPointId(redoCurrent.pointId)?.name || '未分类'}
            </span>
            <span className="tag tag-difficulty">
              {'★'.repeat(redoCurrent.difficulty)}
            </span>
          </div>

          <div style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
            <MathText>{redoCurrent.content}</MathText>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {redoCurrent.options.map((opt, i) => {
              let className = 'option-btn'
              if (redoSubmitted) {
                if (i === redoCurrent.answer) className += ' correct'
                else if (i === redoSelected) className += ' wrong'
              } else if (i === redoSelected) {
                className += ' selected'
              }
              return (
                <button
                  key={i}
                  className={className}
                  onClick={() => !redoSubmitted && setRedoSelected(i)}
                  disabled={redoSubmitted}
                >
                  <span className="option-label">{String.fromCharCode(65 + i)}</span>
                  <MathText>{opt}</MathText>
                </button>
              )
            })}
          </div>

          {redoSubmitted && (
            <div style={{
              background: '#F8F7FE', borderRadius: 10, padding: 16, marginBottom: 16,
              border: '0.5px solid #CECBF6',
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8,
                color: redoSelected === redoCurrent.answer ? '#3B6D11' : '#A32D2D',
              }}>
                {redoSelected === redoCurrent.answer ? '回答正确！' : '回答错误'}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: '#444441' }}>
                <MathText>{redoCurrent.explanation}</MathText>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            {!redoSubmitted ? (
              <button className="btn-primary" onClick={handleRedoSubmit} disabled={redoSelected === null}>
                提交答案
              </button>
            ) : (
              <button className="btn-primary" onClick={handleRedoNext}>
                {redoIndex < redoQuestions.length - 1 ? '下一题' : '完成重做'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 导出打印预览
  if (showExport) {
    return (
      <div className="page-container" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#2c2c2a' }}>错题导出预览</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-outline" style={{ fontSize: 13 }} onClick={() => setShowExport(false)}>
              返回
            </button>
            <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => window.print()}>
              打印 / 导出PDF
            </button>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: '2rem', border: '0.5px solid #e7e5e4' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>
            高考错题集 - 共 {wrongList.length} 题
          </h2>
          <p style={{ fontSize: 13, color: '#888780', textAlign: 'center', marginBottom: 24 }}>
            导出时间：{new Date().toLocaleDateString('zh-CN')}
          </p>
          {wrongList.map((q, i) => {
            const subj = subjects.find(s => s.id === q.subject)
            const meta = wrongQuestionMeta[q.id]
            const reason = meta?.errorReason ? ERROR_REASONS[meta.errorReason] : null
            return (
              <div key={q.id} style={{
                marginBottom: 20, paddingBottom: 16,
                borderBottom: i < wrongList.length - 1 ? '1px dashed #e7e5e4' : 'none',
              }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>第 {i + 1} 题</span>
                  <span style={{ fontSize: 12, color: '#888780' }}>{subj?.name}</span>
                  <span style={{ fontSize: 12, color: '#888780' }}>
                    {getModuleByPointId(q.pointId)?.name}
                  </span>
                  {reason && (
                    <span style={{ fontSize: 12, color: reason.color }}>
                      [{reason.label}]
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: '#888780' }}>
                    {'★'.repeat(q.difficulty)}
                  </span>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 8 }}>
                  <MathText>{q.content}</MathText>
                </div>
                <div style={{ fontSize: 13, color: '#5F5E5A', marginBottom: 8 }}>
                  {q.options.map((opt, oi) => (
                    <div key={oi} style={{ marginLeft: 16 }}>
                      {String.fromCharCode(65 + oi)}. <MathText>{opt}</MathText>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: '#3B6D11', marginBottom: 4 }}>
                  正确答案：{String.fromCharCode(65 + q.answer)}
                </div>
                <div style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.7 }}>
                  <strong>解析：</strong><MathText>{q.explanation}</MathText>
                </div>
                {notes[q.id] && (
                  <div style={{ fontSize: 13, color: '#534AB7', marginTop: 4, fontStyle: 'italic' }}>
                    笔记：{notes[q.id]}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 批量组卷导出预览
  if (showBatchExport) {
    return (
      <div className="page-container" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#2c2c2a' }}>专项试卷预览</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className="btn-outline"
              style={{ fontSize: 13 }}
              onClick={() => setExportWithAnswers(!exportWithAnswers)}
            >
              {exportWithAnswers ? '切换为无答案版' : '切换为有答案版'}
            </button>
            <button className="btn-outline" style={{ fontSize: 13 }} onClick={() => setShowBatchExport(false)}>
              返回
            </button>
            <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => window.print()}>
              打印 / 导出PDF
            </button>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: '2rem', border: '0.5px solid #e7e5e4' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>
            高考错题专项训练卷
          </h2>
          <p style={{ fontSize: 13, color: '#888780', textAlign: 'center', marginBottom: 4 }}>
            共 {batchQuestions.length} 题 · {exportWithAnswers ? '含答案解析' : '无答案版（线下练习用）'}
          </p>
          <p style={{ fontSize: 12, color: '#888780', textAlign: 'center', marginBottom: 24 }}>
            姓名：___________  得分：___________  日期：{new Date().toLocaleDateString('zh-CN')}
          </p>
          {batchQuestions.map((q, i) => {
            const subj = subjects.find(s => s.id === q.subject)
            return (
              <div key={q.id} style={{
                marginBottom: 20, paddingBottom: 16,
                borderBottom: i < batchQuestions.length - 1 ? '1px dashed #e7e5e4' : 'none',
              }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{i + 1}.</span>
                  <span style={{ fontSize: 12, color: '#888780' }}>{subj?.name}</span>
                  <span style={{ fontSize: 12, color: '#888780' }}>
                    {getModuleByPointId(q.pointId)?.name}
                  </span>
                  <span style={{ fontSize: 12, color: '#888780' }}>
                    {'★'.repeat(q.difficulty)}
                  </span>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 8 }}>
                  <MathText>{q.content}</MathText>
                </div>
                <div style={{ fontSize: 13, color: '#5F5E5A', marginBottom: 8 }}>
                  {q.options.map((opt, oi) => (
                    <div key={oi} style={{ marginLeft: 16 }}>
                      {String.fromCharCode(65 + oi)}. <MathText>{opt}</MathText>
                    </div>
                  ))}
                </div>
                {exportWithAnswers && (
                  <>
                    <div style={{ fontSize: 13, color: '#3B6D11', marginBottom: 4, fontWeight: 600 }}>
                      正确答案：{String.fromCharCode(65 + q.answer)}
                    </div>
                    <div style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.7 }}>
                      <strong>解析：</strong><MathText>{q.explanation}</MathText>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
        <style>{`
          @media print {
            nav, .btn-primary, .btn-outline { display: none !important; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#2c2c2a' }}>错题本</h1>
          <p style={{ fontSize: 14, color: '#888780', marginTop: 4 }}>
            {wrongList.length > 0
              ? `共 ${wrongList.length} 道错题`
              : '还没有错题，去刷题吧！'}
            {reviewDueCount > 0 && (
              <span style={{ color: '#D85A30', marginLeft: 8 }}>
                · {reviewDueCount} 题待复习
              </span>
            )}
          </p>
        </div>
        {wrongList.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {batchMode ? (
              <>
                <span style={{ fontSize: 13, color: '#534AB7', alignSelf: 'center' }}>
                  已选 {selectedIds.length} 题
                </span>
                <button
                  className="btn-outline"
                  style={{ fontSize: 13 }}
                  onClick={() => { setSelectedIds([]); setBatchMode(false) }}
                >
                  取消选择
                </button>
                <button
                  className="btn-outline"
                  style={{ fontSize: 13 }}
                  onClick={() => setSelectedIds(wrongList.map(q => q.id))}
                >
                  全选
                </button>
                <button
                  className="btn-primary"
                  style={{ fontSize: 13 }}
                  disabled={selectedIds.length === 0}
                  onClick={() => setShowBatchExport(true)}
                >
                  生成试卷 ({selectedIds.length})
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-outline"
                  style={{ fontSize: 13 }}
                  onClick={() => { setBatchMode(true); setSelectedIds([]) }}
                >
                  批量组卷
                </button>
                <button
                  className="btn-primary"
                  style={{ fontSize: 13 }}
                  onClick={startRedo}
                >
                  错题重做
                </button>
                <button
                  className="btn-outline"
                  style={{ fontSize: 13 }}
                  onClick={handleExport}
                >
                  导出全部
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 筛选区 */}
      <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* 科目筛选 */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => { setFilterSubject('all'); setFilterModule('all') }}
            style={{
              fontSize: 13, padding: '4px 12px', borderRadius: 6, cursor: 'pointer',
              border: filterSubject === 'all' ? '1.5px solid #534AB7' : '1.5px solid #e7e5e4',
              background: filterSubject === 'all' ? '#EEEDFE' : 'white',
              color: filterSubject === 'all' ? '#534AB7' : '#888780',
            }}
          >
            全部科目
          </button>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => { setFilterSubject(s.id); setFilterModule('all') }}
              style={{
                fontSize: 13, padding: '4px 12px', borderRadius: 6, cursor: 'pointer',
                border: filterSubject === s.id ? `1.5px solid ${s.color}` : '1.5px solid #e7e5e4',
                background: filterSubject === s.id ? s.colorLight : 'white',
                color: filterSubject === s.id ? s.color : '#888780',
              }}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>

        {wrongList.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#888780' }}>排序：</span>
            <button
              onClick={() => setSortByReview(false)}
              style={{
                fontSize: 12, padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                border: !sortByReview ? '1.5px solid #534AB7' : '1.5px solid #e7e5e4',
                background: !sortByReview ? '#EEEDFE' : 'white',
                color: !sortByReview ? '#534AB7' : '#888780',
              }}
            >
              按时间
            </button>
            <button
              onClick={() => setSortByReview(true)}
              style={{
                fontSize: 12, padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                border: sortByReview ? '1.5px solid #D85A30' : '1.5px solid #e7e5e4',
                background: sortByReview ? '#FFF0E6' : 'white',
                color: sortByReview ? '#D85A30' : '#888780',
              }}
            >
              按复习紧急度
            </button>
          </div>
        )}

        {/* 错因 + 模块筛选 */}
        {wrongList.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#888780' }}>错因：</span>
            <button
              onClick={() => setFilterReason('all')}
              style={{
                fontSize: 12, padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                border: filterReason === 'all' ? '1.5px solid #534AB7' : '1.5px solid #e7e5e4',
                background: filterReason === 'all' ? '#EEEDFE' : 'white',
                color: filterReason === 'all' ? '#534AB7' : '#888780',
              }}
            >
              全部
            </button>
            <button
              onClick={() => setFilterReason('unmarked')}
              style={{
                fontSize: 12, padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                border: filterReason === 'unmarked' ? '1.5px solid #888780' : '1.5px solid #e7e5e4',
                background: filterReason === 'unmarked' ? '#f5f5f4' : 'white',
                color: filterReason === 'unmarked' ? '#5F5E5A' : '#888780',
              }}
            >
              未标记
            </button>
            {Object.entries(ERROR_REASONS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setFilterReason(key)}
                style={{
                  fontSize: 12, padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                  border: filterReason === key ? `1.5px solid ${val.color}` : '1.5px solid #e7e5e4',
                  background: filterReason === key ? `${val.color}15` : 'white',
                  color: filterReason === key ? val.color : '#888780',
                }}
              >
                {val.icon} {val.label}
              </button>
            ))}
            {availableModules.length > 1 && (
              <>
                <span style={{ fontSize: 12, color: '#888780', marginLeft: 8 }}>模块：</span>
                <select
                  value={filterModule}
                  onChange={e => setFilterModule(e.target.value)}
                  style={{
                    fontSize: 12, padding: '2px 8px', borderRadius: 4,
                    border: '1.5px solid #e7e5e4', background: 'white', color: '#5F5E5A',
                  }}
                >
                  <option value="all">全部模块</option>
                  {availableModules.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        )}
      </div>

      {/* 待复习提醒 */}
      {reviewDueCount > 0 && (
        <div style={{
          background: '#FFF0E6', borderRadius: 10, padding: '10px 14px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #D85A3022',
        }}>
          <span style={{ fontSize: 18 }}>⏰</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#D85A30' }}>
              有 {reviewDueCount} 道错题到了复习时间
            </div>
            <div style={{ fontSize: 12, color: '#888780' }}>
              根据遗忘曲线，现在复习效果最佳
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ fontSize: 12, padding: '4px 12px', background: '#D85A30' }}
            onClick={startRedo}
          >
            去复习
          </button>
        </div>
      )}

      {wrongList.length === 0 ? (
        <div className="card empty-state">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <p style={{ fontSize: 15, marginBottom: 16 }}>
            {filterSubject === 'all' ? '错题本为空' : '该科目暂无错题'}
          </p>
          <Link to="/practice" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            去刷题
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {wrongList.map(q => {
            const isExpanded = expandedId === q.id
            const subj = subjects.find(s => s.id === q.subject)
            const meta = wrongQuestionMeta[q.id]
            const reason = meta?.errorReason ? ERROR_REASONS[meta.errorReason] : null
            const isFavorited = favorites.includes(q.id)
            const isDue = meta && (!meta.nextReviewDate || new Date(meta.nextReviewDate).getTime() <= now)
            const reviewCount = meta?.reviewCount || 0

            return (
              <div key={q.id} className="card">
                <div
                  style={{ cursor: batchMode ? 'default' : 'pointer' }}
                  onClick={() => {
                    if (batchMode) {
                      setSelectedIds(prev => prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id])
                    } else {
                      setExpandedId(isExpanded ? null : q.id)
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: batchMode ? 10 : 0 }}>
                      {batchMode && (
                        <div style={{
                          width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 2,
                          border: selectedIds.includes(q.id) ? '2px solid #534AB7' : '2px solid #e7e5e4',
                          background: selectedIds.includes(q.id) ? '#534AB7' : 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}>
                          {selectedIds.includes(q.id) && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
                        </div>
                      )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span className="tag" style={{ background: subj?.colorLight, color: subj?.color }}>
                          {subj?.icon} {subj?.name}
                        </span>
                        <span className="tag tag-module">
                          {getModuleByPointId(q.pointId)?.name || '未分类'}
                        </span>
                        <span className="tag tag-difficulty">
                          {'★'.repeat(q.difficulty)}
                        </span>
                        {reason && (
                          <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 6, fontWeight: 500,
                            background: `${reason.color}15`, color: reason.color,
                          }}>
                            {reason.icon} {reason.label}
                          </span>
                        )}
                        {isDue && (
                          <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 6, fontWeight: 500,
                            background: '#FFF0E6', color: '#D85A30',
                          }}>
                            待复习
                          </span>
                        )}
                        {!isDue && meta?.nextReviewDate && (
                          <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 6,
                            background: '#f5f5f4', color: '#888780',
                          }}>
                            {(() => {
                              const days = Math.ceil((new Date(meta.nextReviewDate).getTime() - now) / (1000 * 60 * 60 * 24))
                              if (days <= 0) return '今日复习'
                              return `${days}天后复习`
                            })()}
                          </span>
                        )}
                        {reviewCount > 0 && (
                          <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 6,
                            background: '#E8F5E0', color: '#3B6D11',
                          }}>
                            已复习{reviewCount}次
                          </span>
                        )}
                        {notes[q.id] && (
                          <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 6,
                            background: '#F8F7FE', color: '#534AB7',
                          }}>
                            📝 有笔记
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 15, lineHeight: 1.7, color: '#2c2c2a' }}>
                        <MathText>{q.content}</MathText>
                      </div>
                    </div>
                    </div>
                    <span style={{ fontSize: 13, color: '#888780', marginLeft: 12, flexShrink: 0 }}>
                      {isExpanded ? '收起' : '展开'}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '0.5px solid #e7e5e4' }}>
                    {/* 选项 */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#888780', marginBottom: 6 }}>选项</div>
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '6px 12px', borderRadius: 6, marginBottom: 4,
                            fontSize: 14,
                            background: i === q.answer ? '#EAF3DE' : 'transparent',
                            color: i === q.answer ? '#3B6D11' : '#5F5E5A',
                          }}
                        >
                          {String.fromCharCode(65 + i)}. <MathText>{opt}</MathText>
                          {i === q.answer && ' ✓'}
                        </div>
                      ))}
                    </div>

                    {/* 解析 */}
                    <div style={{
                      background: '#F8F7FE', borderRadius: 8, padding: 12,
                      fontSize: 14, lineHeight: 1.8, marginBottom: 12,
                    }}>
                      <strong>解析：</strong>
                      <MathText>{q.explanation}</MathText>
                    </div>

                    {/* 笔记区 */}
                    {showNoteFor === q.id ? (
                      <div style={{ marginBottom: 12 }}>
                        <textarea
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          placeholder="记录解题技巧、易错点..."
                          style={{
                            width: '100%', minHeight: 60, padding: 8, borderRadius: 8,
                            border: '1.5px solid #e7e5e4', fontSize: 13, resize: 'vertical',
                            outline: 'none', fontFamily: 'inherit',
                          }}
                          autoFocus
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                          <button
                            className="btn-primary"
                            style={{ fontSize: 12, padding: '4px 12px' }}
                            onClick={() => {
                              setNote(q.id, noteText)
                              setShowNoteFor(null)
                              setNoteText('')
                            }}
                          >
                            保存笔记
                          </button>
                          <button
                            className="btn-outline"
                            style={{ fontSize: 12, padding: '4px 12px' }}
                            onClick={() => { setShowNoteFor(null); setNoteText('') }}
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginBottom: 12 }}>
                        {notes[q.id] && (
                          <div style={{
                            background: '#F8F7FE', borderRadius: 8, padding: '8px 12px',
                            fontSize: 13, color: '#534AB7', marginBottom: 4, lineHeight: 1.6,
                          }}>
                            📝 {notes[q.id]}
                          </div>
                        )}
                        <button
                          className="btn-outline"
                          style={{ fontSize: 12, padding: '2px 10px' }}
                          onClick={() => { setShowNoteFor(q.id); setNoteText(notes[q.id] || '') }}
                        >
                          {notes[q.id] ? '编辑笔记' : '添加笔记'}
                        </button>
                      </div>
                    )}

                    {/* 错因选择 */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#888780', marginBottom: 6 }}>标记错因</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {Object.entries(ERROR_REASONS).map(([key, val]) => (
                          <button
                            key={key}
                            onClick={() => setWrongReason(q.id, key)}
                            style={{
                              fontSize: 12, padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
                              border: meta?.errorReason === key
                                ? `1.5px solid ${val.color}`
                                : '1.5px solid #e7e5e4',
                              background: meta?.errorReason === key ? `${val.color}15` : 'white',
                              color: meta?.errorReason === key ? val.color : '#888780',
                              transition: 'all 0.15s',
                            }}
                          >
                            {val.icon} {val.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Link
                        to={`/practice/${q.subject}`}
                        className="btn-outline"
                        style={{ textDecoration: 'none', fontSize: 13 }}
                      >
                        去练习
                      </Link>
                      <button
                        className="btn-outline"
                        style={{ fontSize: 13 }}
                        onClick={() => toggleFavorite(q.id)}
                      >
                        {isFavorited ? '★ 已收藏' : '☆ 收藏'}
                      </button>
                      {isDue && (
                        <button
                          className="btn-outline"
                          style={{ fontSize: 13, color: '#D85A30', borderColor: '#FFD4B8' }}
                          onClick={() => markWrongReviewed(q.id)}
                        >
                          标记已复习
                        </button>
                      )}
                      <button
                        className="btn-outline"
                        style={{ fontSize: 13, color: '#A32D2D', borderColor: '#F7C1C1' }}
                        onClick={() => clearWrongQuestion(q.id)}
                      >
                        移出错题本
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 打印样式 */}
      <style>{`
        @media print {
          nav, .btn-primary, .btn-outline { display: none !important; }
          .page-container { max-width: 100% !important; padding: 0 !important; }
          .card { border: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  )
}
