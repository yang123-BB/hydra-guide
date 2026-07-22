import { useState, useMemo } from 'react'
import { useStore } from '../lib/store.js'
import { subjects } from '../data/subjects.js'
import { useBank, loadAllQuestions } from '../data/BankProvider.jsx'
import {
  PROVINCES, getProvince, getPaperTypeForSubject, getPaperTypeInfo,
  isUnifiedSubject, isProvincialSubject, getProvincesByBatch,
} from '../data/provinces.js'
import { starsToCoef, DIFFICULTY_COEF_LEVELS as DIFFICULTY_LEVELS } from '../lib/utils.js'
import { MOCK_SCHOOLS } from '../data/mockSchools.js'

// ─── 题型定义 ────────────────────────────────────────────
const QUESTION_TYPES = [
  { id: 'single-choice', label: '单选题' },
  { id: 'multi-choice',  label: '多选题' },
  { id: 'fill-blank',    label: '填空题' },
  { id: 'calculation',   label: '计算题' },
  { id: 'short-answer',  label: '解答题' },
]

// ─── 年份列表 ────────────────────────────────────────────
const YEARS = [2022, 2023, 2024, 2025, 2026]

export default function FilterSidebar({ mobileOpen, onCloseMobile }) {
  const {
    currentSubject, setSubject,
    profile, updateProfile,
    filters, updateFilters, resetFilters,
  } = useStore()

  const selectedProvince = profile?.province || 'sichuan'
  const currentPaperType = getPaperTypeForSubject(currentSubject, selectedProvince)
  const paperTypeInfo = getPaperTypeInfo(currentPaperType)
  const isUnified = isUnifiedSubject(currentSubject)
  const isProvincial = isProvincialSubject(currentSubject)
  const [showProvinceList, setShowProvinceList] = useState(false)
  const [showModules, setShowModules] = useState(true)

  const bank = useBank()
  if (!bank) throw loadAllQuestions()

  const subject = subjects.find(s => s.id === currentSubject) || subjects[0]

  // 计算筛选后的题目数量
  const filteredCount = useMemo(() => {
    return bank.filter(q => {
      if (q.subject !== currentSubject) return false
      // 省份筛选
      if (isProvincial && q.tags?.province && q.tags.province !== selectedProvince) return false
      if (isUnified && q.tags?.paperType && q.tags.paperType !== currentPaperType && q.tags.paperType !== 'provincial') return false
      // 年份筛选
      if (filters.year && q.tags?.year !== filters.year) return false
      // 题型筛选
      if (filters.questionTypes.length > 0 && !filters.questionTypes.includes(q.tags?.questionType)) return false
      // 难度筛选
      const coef = starsToCoef(q.tags?.difficultyStars || q.difficulty || 2)
      if (coef < filters.difficultyMin || coef > filters.difficultyMax) return false
      // 模块筛选
      if (filters.moduleId && q.module !== filters.moduleId) return false
      // 来源筛选
      if (filters.source && q.tags?.source !== filters.source) return false
      // 名校筛选
      if (filters.school && q.tags?.school !== filters.school) return false
      return true
    }).length
  }, [currentSubject, selectedProvince, currentPaperType, isUnified, isProvincial, filters])

  // 检查筛选器是否有活跃条件
  const hasActiveFilters = filters.year || filters.questionTypes.length > 0 ||
    filters.difficultyMin !== 0.2 || filters.difficultyMax !== 1.0 ||
    filters.moduleId || filters.source || filters.school

  const handleDifficulty = (level) => {
    updateFilters({ difficultyMin: level.min, difficultyMax: level.max })
  }

  const toggleQuestionType = (typeId) => {
    const current = filters.questionTypes
    const newList = current.includes(typeId)
      ? current.filter(t => t !== typeId)
      : [...current, typeId]
    updateFilters({ questionTypes: newList })
  }

  const sidebarContent = (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      overflow: 'hidden',
    }}>
     {/* ── 可滚动内容区 ── */}
     <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
      {/* ── 科目选择 ── */}
      <div style={{ padding: '12px 14px 8px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--sub-text)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
          科目
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setSubject(s.id)
                updateFilters({ moduleId: null })
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
                border: 'none',
                background: currentSubject === s.id ? s.colorLight : 'transparent',
                color: currentSubject === s.id ? s.color : 'var(--sub-text-2)',
                fontSize: 14, fontWeight: currentSubject === s.id ? 600 : 400,
                transition: 'all 0.12s', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{s.icon}</span>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--card-border)', margin: '4px 14px' }} />

      {/* ── 省份选择 ── */}
      <div style={{ padding: '8px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--sub-text)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
          省份
        </div>
        <button
          onClick={() => setShowProvinceList(!showProvinceList)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
            border: '1.5px solid var(--card-border)',
            background: 'var(--card-bg)', color: 'var(--text)',
            fontSize: 14, fontWeight: 500,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>{getProvince(selectedProvince)?.short || '通'}</span>
            {getProvince(selectedProvince)?.name || '选择省份'}
          </span>
          <span style={{ fontSize: 10, color: 'var(--sub-text)' }}>{showProvinceList ? '▴' : '▾'}</span>
        </button>
        {showProvinceList && (
          <div style={{
            marginTop: 4, maxHeight: 220, overflowY: 'auto',
            border: '1px solid var(--card-border)', borderRadius: 8,
            background: 'var(--card-bg)',
          }}>
            {getProvincesByBatch().map(p => (
              <button
                key={p.code}
                onClick={() => {
                  updateProfile({ province: p.code })
                  setShowProvinceList(false)
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '7px 12px', cursor: 'pointer',
                  border: 'none', background: selectedProvince === p.code ? 'var(--primary-light)' : 'transparent',
                  color: selectedProvince === p.code ? 'var(--primary)' : 'var(--text)',
                  fontSize: 13, fontWeight: selectedProvince === p.code ? 600 : 400,
                  borderBottom: '1px solid var(--card-border)',
                }}
              >
                <span>{p.name}</span>
                <span style={{ fontSize: 10, color: 'var(--sub-text)' }}>
                  {p.batch}批 {p.paperType === 'new1' ? 'I' : 'II'}
                </span>
              </button>
            ))}
          </div>
        )}
        {/* 试卷类型指示器 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          marginTop: 6, padding: '3px 8px', borderRadius: 5,
          background: paperTypeInfo.colorLight, color: paperTypeInfo.color,
          fontSize: 11, fontWeight: 500,
        }}>
          {isUnified ? `${paperTypeInfo.short} (统考)` : '省卷 (自主命题)'}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--card-border)', margin: '4px 14px' }} />

      {/* ── 年份筛选 ── */}
      <div style={{ padding: '8px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--sub-text)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
          年份
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <FilterChip
            active={!filters.year}
            onClick={() => updateFilters({ year: null })}
            label="全部"
          />
          {YEARS.map(y => (
            <FilterChip
              key={y}
              active={filters.year === y}
              onClick={() => updateFilters({ year: filters.year === y ? null : y })}
              label={String(y)}
            />
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--card-border)', margin: '4px 14px' }} />

      {/* ── 题型筛选 ── */}
      <div style={{ padding: '8px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--sub-text)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
          题型
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {QUESTION_TYPES.map(t => (
            <FilterChip
              key={t.id}
              active={filters.questionTypes.includes(t.id)}
              onClick={() => toggleQuestionType(t.id)}
              label={t.label}
            />
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--card-border)', margin: '4px 14px' }} />

      {/* ── 难度筛选 (0.2-1.0 系数) ── */}
      <div style={{ padding: '8px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--sub-text)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
          难度系数
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {DIFFICULTY_LEVELS.map(level => {
            const isActive = filters.difficultyMin === level.min && filters.difficultyMax === level.max
            return (
              <button
                key={level.label}
                onClick={() => handleDifficulty(level)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
                  border: isActive ? `1.5px solid ${level.color}` : '1.5px solid transparent',
                  background: isActive ? `${level.color}15` : 'transparent',
                  color: isActive ? level.color : 'var(--sub-text-2)',
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.12s',
                }}
              >
                <span>{level.label}</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>
                  {level.min === 0.2 && level.max === 1.0 ? '' : `${level.min}-${level.max}`}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--card-border)', margin: '4px 14px' }} />

      {/* ── 来源筛选 ── */}
      <div style={{ padding: '8px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--sub-text)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
          来源
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <FilterChip
            active={!filters.source}
            onClick={() => updateFilters({ source: null })}
            label="全部"
          />
          <FilterChip
            active={filters.source === 'gaokao'}
            onClick={() => updateFilters({ source: filters.source === 'gaokao' ? null : 'gaokao' })}
            label="高考真题"
          />
          <FilterChip
            active={filters.source === 'variation'}
            onClick={() => updateFilters({ source: filters.source === 'variation' ? null : 'variation' })}
            label="模拟题"
          />
          <FilterChip
            active={filters.source === 'school-mock'}
            onClick={() => updateFilters({
              source: filters.source === 'school-mock' ? null : 'school-mock',
              school: filters.source === 'school-mock' ? null : filters.school,
            })}
            label="名校模考"
          />
        </div>

        {/* 名校子筛选（仅名校模考来源时显示） */}
        {filters.source === 'school-mock' && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--sub-text)', marginBottom: 6 }}>
              选择名校
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <FilterChip
                active={!filters.school}
                onClick={() => updateFilters({ school: null })}
                label="全部名校"
              />
              {MOCK_SCHOOLS.map(s => (
                <FilterChip
                  key={s.id}
                  active={filters.school === s.id}
                  onClick={() => updateFilters({ school: filters.school === s.id ? null : s.id })}
                  label={s.short}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: 'var(--card-border)', margin: '4px 14px' }} />

      {/* ── 模块筛选 (可折叠) ── */}
      <div style={{ padding: '8px 14px' }}>
        <button
          onClick={() => setShowModules(!showModules)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '4px 0', cursor: 'pointer',
            border: 'none', background: 'transparent',
            fontSize: 11, fontWeight: 600, color: 'var(--sub-text)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}
        >
          <span>知识模块</span>
          <span>{showModules ? '▾' : '▸'}</span>
        </button>
        {showModules && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
            <button
              onClick={() => updateFilters({ moduleId: null })}
              style={{
                padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
                border: 'none',
                background: !filters.moduleId ? 'var(--primary-light)' : 'transparent',
                color: !filters.moduleId ? 'var(--primary)' : 'var(--sub-text-2)',
                fontSize: 13, fontWeight: !filters.moduleId ? 600 : 400,
                textAlign: 'left',
              }}
            >
              全部模块
            </button>
            {subject?.modules?.map(m => (
              <button
                key={m.id}
                onClick={() => updateFilters({ moduleId: filters.moduleId === m.id ? null : m.id })}
                style={{
                  padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
                  border: 'none',
                  background: filters.moduleId === m.id ? 'var(--primary-light)' : 'transparent',
                  color: filters.moduleId === m.id ? 'var(--primary)' : 'var(--sub-text-2)',
                  fontSize: 13, fontWeight: filters.moduleId === m.id ? 600 : 400,
                  textAlign: 'left',
                }}
              >
                {m.name}
              </button>
            ))}
          </div>
        )}
      </div>
     </div>
     {/* ── 可滚动内容区结束 ── */}

      {/* ── 底部：筛选结果 + 重置 ── */}
      <div style={{
        padding: '10px 14px', borderTop: '1px solid var(--card-border)',
        background: 'var(--hover-bg)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--sub-text)' }}>筛选结果</span>
          <span style={{
            fontSize: 18, fontWeight: 700,
            color: filteredCount > 0 ? 'var(--primary)' : 'var(--wrong)',
          }}>
            {filteredCount}
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            style={{
              width: '100%', padding: '6px', borderRadius: 6, cursor: 'pointer',
              border: '1px solid var(--card-border)', background: 'var(--card-bg)',
              color: 'var(--sub-text-2)', fontSize: 12, fontWeight: 500,
            }}
          >
            重置筛选条件
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* 桌面端：固定左侧栏 */}
      <aside
        className="filter-sidebar-desktop"
        style={{
          width: 240, flexShrink: 0,
          background: 'var(--card-bg)',
          borderRight: '0.5px solid var(--card-border)',
          position: 'sticky', top: 56, height: 'calc(100vh - 56px)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}
      >
        {sidebarContent}
      </aside>

      {/* 移动端：抽屉式覆盖 */}
      {mobileOpen && (
        <>
          <div
            onClick={onCloseMobile}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.4)', zIndex: 150,
            }}
          />
          <aside
            className="filter-sidebar-mobile"
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: '80%', maxWidth: 300, zIndex: 151,
              background: 'var(--card-bg)',
              boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderBottom: '0.5px solid var(--card-border)',
              height: 56,
            }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>筛选条件</span>
              <button
                onClick={onCloseMobile}
                style={{
                  border: 'none', background: 'var(--hover-bg)', borderRadius: 6,
                  padding: '4px 10px', cursor: 'pointer', fontSize: 16,
                  color: 'var(--sub-text)',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ height: 'calc(100% - 56px)', overflow: 'auto' }}>
              {sidebarContent}
            </div>
          </aside>
        </>
      )}
    </>
  )
}

// ─── 筛选标签芯片 ─────────────────────────────────────────
function FilterChip({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
        border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--card-border)',
        background: active ? 'var(--primary-light)' : 'transparent',
        color: active ? 'var(--primary)' : 'var(--sub-text-2)',
        fontSize: 12, fontWeight: active ? 600 : 400,
        transition: 'all 0.12s', whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}
