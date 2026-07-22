/**
 * 新高考省份与试卷类型配置
 *
 * 命题规则：
 * - 语数外 = 教育部统一命题（新高考 I 卷 / II 卷，全国通用）
 * - 物化生  = 各省自主命题（各省试卷风格、考点差异大）
 *
 * 数据结构：
 * - PROVINCES: 所有新高考省份，含 code/name/paperType(统考卷型)/batch(改革批次)
 * - PAPER_TYPES: 试卷类型定义
 * - UNIFIED_SUBJECTS: 统考科目（语数外）
 * - PROVINCIAL_SUBJECTS: 省级命题科目（物化生）
 */

// ─── 试卷类型 ──────────────────────────────────────────────
export const PAPER_TYPES = {
  'new1': {
    label: '新高考I卷',
    short: 'I卷',
    desc: '教育部统一命题 · 难度较高',
    color: '#A32D2D',
    colorLight: '#FDE8E8',
  },
  'new2': {
    label: '新高考II卷',
    short: 'II卷',
    desc: '教育部统一命题 · 难度适中',
    color: '#185FA5',
    colorLight: '#E6F1FB',
  },
  'provincial': {
    label: '省级自主命题',
    short: '省卷',
    desc: '各省自主命题 · 风格差异大',
    color: '#0E7C5A',
    colorLight: '#E5F5EF',
  },
}

// ─── 统考科目（教育部统一命题）──────────────────────────────
export const UNIFIED_SUBJECTS = ['math', 'chinese', 'english']

// ─── 省级命题科目 ──────────────────────────────────────────
export const PROVINCIAL_SUBJECTS = ['physics', 'chemistry', 'biology']

// ─── 新高考省份列表 ────────────────────────────────────────
// paperType: 该省语数外使用的统考卷型（new1=I卷 / new2=II卷）
// batch: 新高考改革批次（3=2021年实施, 4=2024年实施, 5=2025年实施）
export const PROVINCES = [
  // ── 第三批（2021年实施）──
  { code: 'hebei',    name: '河北',  short: '冀', paperType: 'new1', batch: 3 },
  { code: 'liaoning',  name: '辽宁',  short: '辽', paperType: 'new2', batch: 3 },
  { code: 'jiangsu',   name: '江苏',  short: '苏', paperType: 'new1', batch: 3 },
  { code: 'fujian',    name: '福建',  short: '闽', paperType: 'new1', batch: 3 },
  { code: 'hubei',     name: '湖北',  short: '鄂', paperType: 'new1', batch: 3 },
  { code: 'hunan',     name: '湖南',  short: '湘', paperType: 'new1', batch: 3 },
  { code: 'guangdong', name: '广东',  short: '粤', paperType: 'new1', batch: 3 },
  { code: 'chongqing', name: '重庆',  short: '渝', paperType: 'new2', batch: 3 },

  // ── 第四批（2024年实施）──
  { code: 'heilongjiang', name: '黑龙江', short: '黑', paperType: 'new2', batch: 4 },
  { code: 'jilin',     name: '吉林',  short: '吉', paperType: 'new2', batch: 4 },
  { code: 'gansu',     name: '甘肃',  short: '甘', paperType: 'new2', batch: 4 },
  { code: 'anhui',     name: '安徽',  short: '皖', paperType: 'new1', batch: 4 },
  { code: 'jiangxi',   name: '江西',  short: '赣', paperType: 'new1', batch: 4 },
  { code: 'guizhou',   name: '贵州',  short: '黔', paperType: 'new2', batch: 4 },
  { code: 'guangxi',   name: '广西',  short: '桂', paperType: 'new2', batch: 4 },

  // ── 第五批（2025年实施）──
  { code: 'sichuan',   name: '四川',  short: '川', paperType: 'new2', batch: 5 },
  { code: 'henan',     name: '河南',  short: '豫', paperType: 'new1', batch: 5 },
  { code: 'yunnan',    name: '云南',  short: '云', paperType: 'new2', batch: 5 },
  { code: 'shanxi',    name: '山西',  short: '晋', paperType: 'new2', batch: 5 },
  { code: 'neimenggu', name: '内蒙古', short: '蒙', paperType: 'new2', batch: 5 },
  { code: 'qinghai',   name: '青海',  short: '青', paperType: 'new2', batch: 5 },
  { code: 'ningxia',   name: '宁夏',  short: '宁', paperType: 'new2', batch: 5 },
  { code: 'xinjiang',  name: '新疆',  short: '新', paperType: 'new2', batch: 5 },
]

// ─── 查询函数 ──────────────────────────────────────────────

/** 根据 code 获取省份 */
export function getProvince(code) {
  return PROVINCES.find(p => p.code === code) || null
}

/** 获取省份名称 */
export function getProvinceName(code) {
  return getProvince(code)?.name || '通用'
}

/** 获取省份简称 */
export function getProvinceShort(code) {
  return getProvince(code)?.short || '通'
}

/** 判断科目是否为统考科目 */
export function isUnifiedSubject(subjectId) {
  return UNIFIED_SUBJECTS.includes(subjectId)
}

/** 判断科目是否为省级命题科目 */
export function isProvincialSubject(subjectId) {
  return PROVINCIAL_SUBJECTS.includes(subjectId)
}

/**
 * 根据科目和省份获取试卷类型
 * - 统考科目：返回该省份使用的统考卷型 (new1/new2)
 * - 省级科目：返回 'provincial'
 */
export function getPaperTypeForSubject(subjectId, provinceCode) {
  if (isUnifiedSubject(subjectId)) {
    const province = getProvince(provinceCode)
    return province?.paperType || 'new1'
  }
  if (isProvincialSubject(subjectId)) {
    return 'provincial'
  }
  return 'new1'
}

/**
 * 获取试卷类型的显示信息
 */
export function getPaperTypeInfo(paperType) {
  return PAPER_TYPES[paperType] || PAPER_TYPES['new1']
}

/**
 * 获取省份列表（按批次排序）
 */
export function getProvincesByBatch() {
  return [...PROVINCES].sort((a, b) => a.batch - b.batch)
}
