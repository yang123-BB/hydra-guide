// ─── 公共工具函数 ─────────────────────────────────────────

/**
 * 难度星级(1-5)转系数(0.2-1.0)
 * @param {number} stars - 难度星级 1-5
 * @returns {number} 难度系数 0.2-1.0
 */
export function starsToCoef(stars) {
  return stars ? Math.round(stars / 5 * 100) / 100 : 0.4
}

/**
 * 难度等级定义 (0.2-1.0 系数)
 */
export const DIFFICULTY_COEF_LEVELS = [
  { label: '全部', min: 0.2, max: 1.0, color: '#888780' },
  { label: '基础', min: 0.2, max: 0.4, color: '#3B6D11' },
  { label: '中档', min: 0.4, max: 0.7, color: '#D85A30' },
  { label: '较难', min: 0.7, max: 0.9, color: '#A32D2D' },
  { label: '压轴', min: 0.9, max: 1.0, color: '#7B1F3A' },
]

/**
 * 三级梯度训练难度定义
 */
export const GRADIENT_LEVELS = [
  {
    id: 'basic',
    label: '基础',
    icon: '📖',
    title: '一轮复习',
    subtitle: '基础巩固',
    desc: '系统过一遍基础知识，按模块逐个突破',
    min: 0.2, max: 0.4,
    color: '#3B6D11', colorLight: '#E8F5E0',
  },
  {
    id: 'medium',
    label: '中档',
    icon: '🎯',
    title: '二轮复习',
    subtitle: '专题突破',
    desc: '按专题整合训练，攻克中档难题',
    min: 0.4, max: 0.7,
    color: '#534AB7', colorLight: '#EEEDFE',
  },
  {
    id: 'hard',
    label: '压轴',
    icon: '⚡',
    title: '三轮复习',
    subtitle: '模拟冲刺',
    desc: '限时模拟，压轴题专项训练',
    min: 0.7, max: 1.0,
    color: '#D85A30', colorLight: '#FFF0E6',
  },
]
