/**
 * 多科目统一注册表
 * 每个科目包含：id, name, icon, modules, pointToModule 映射
 */

import { modules as mathModules } from './knowledgePoints.js'
import { physicsModules } from './physicsKnowledgePoints.js'
import { chemistryModules } from './chemistryKnowledgePoints.js'
import { biologyModules } from './biologyKnowledgePoints.js'
import { chineseModules } from './chineseKnowledgePoints.js'
import { englishModules } from './englishKnowledgePoints.js'

export const subjects = [
  {
    id: 'math',
    name: '数学',
    icon: '∑',
    color: '#534AB7',
    colorLight: '#EEEDFE',
    modules: mathModules,
  },
  {
    id: 'physics',
    name: '物理',
    icon: '⚡',
    color: '#185FA5',
    colorLight: '#E6F1FB',
    modules: physicsModules,
  },
  {
    id: 'chemistry',
    name: '化学',
    icon: '⚗',
    color: '#0E7C5A',
    colorLight: '#E5F5EF',
    modules: chemistryModules,
  },
  {
    id: 'biology',
    name: '生物',
    icon: '🧬',
    color: '#B8456A',
    colorLight: '#FBE8EE',
    modules: biologyModules,
  },
  {
    id: 'chinese',
    name: '语文',
    icon: '文',
    color: '#8B4513',
    colorLight: '#F5EDE3',
    modules: chineseModules,
  },
  {
    id: 'english',
    name: '英语',
    icon: 'En',
    color: '#1A6B9E',
    colorLight: '#E4F0F8',
    modules: englishModules,
  },
]

/** 构建全局知识点 → 模块 映射（区分科目） */
export const pointToModuleMap = {}
subjects.forEach(subj => {
  subj.modules.forEach(m => {
    m.points.forEach(p => {
      pointToModuleMap[p.id] = { ...m, subjectId: subj.id, subjectName: subj.name }
    })
  })
})

/** 根据 ID 获取科目 */
export function getSubject(id) {
  return subjects.find(s => s.id === id)
}

/** 根据科目 ID 获取模块列表 */
export function getModulesBySubject(subjectId) {
  const subj = getSubject(subjectId)
  return subj ? subj.modules : []
}

/** 根据模块 ID 查找模块（跨科目搜索） */
export function getModuleById(moduleId) {
  for (const subj of subjects) {
    const m = subj.modules.find(m => m.id === moduleId)
    if (m) return { ...m, subjectId: subj.id, subjectName: subj.name }
  }
  return null
}

/** 根据 pointId 查找所属模块（含科目信息） */
export function getModuleByPointId(pointId) {
  return pointToModuleMap[pointId] || null
}
