/**
 * 高考化学知识点体系（新高考）
 * 8 大模块，共 34 个知识点
 */

export const chemistryModules = [
  {
    id: 'stoichiometry',
    name: '化学计量与化学方程式',
    priority: 1,
    points: [
      { id: 'amount-of-substance', name: '物质的量与阿伏加德罗常数' },
      { id: 'gas-molar-volume', name: '气体摩尔体积' },
      { id: 'concentration', name: '物质的量浓度' },
      { id: 'equation-balancing', name: '化学方程式配平与计算' },
    ],
  },
  {
    id: 'ionic-redox',
    name: '离子反应与氧化还原',
    priority: 1,
    points: [
      { id: 'ionic-equation', name: '离子方程式书写与判断' },
      { id: 'ion-coexistence', name: '离子共存判断' },
      { id: 'redox-concepts', name: '氧化还原基本概念' },
      { id: 'redox-balancing', name: '氧化还原方程式配平' },
    ],
  },
  {
    id: 'metals',
    name: '金属及其化合物',
    priority: 2,
    points: [
      { id: 'sodium', name: '钠及其化合物' },
      { id: 'aluminum', name: '铝及其化合物' },
      { id: 'iron', name: '铁及其化合物' },
      { id: 'metal-materials', name: '金属材料与合金' },
    ],
  },
  {
    id: 'nonmetals',
    name: '非金属及其化合物',
    priority: 2,
    points: [
      { id: 'chlorine', name: '氯及其化合物' },
      { id: 'sulfur', name: '硫及其化合物' },
      { id: 'nitrogen', name: '氮及其化合物' },
      { id: 'silicon', name: '硅及其化合物' },
    ],
  },
  {
    id: 'atomic-structure',
    name: '物质结构基础',
    priority: 1,
    points: [
      { id: 'electron-config', name: '原子结构与电子排布' },
      { id: 'periodic-table', name: '元素周期表与周期律' },
      { id: 'chemical-bonds', name: '化学键与分子结构' },
      { id: 'intermolecular-forces', name: '分子间作用力与晶体' },
    ],
  },
  {
    id: 'reaction-energy',
    name: '化学反应与能量',
    priority: 1,
    points: [
      { id: 'enthalpy', name: '反应热与焓变' },
      { id: 'electrochemistry', name: '原电池与电解池' },
      { id: 'reaction-rate', name: '化学反应速率' },
    ],
  },
  {
    id: 'equilibrium',
    name: '化学平衡与水溶液',
    priority: 1,
    points: [
      { id: 'chemical-equilibrium', name: '化学平衡与平衡移动' },
      { id: 'weak-electrolytes', name: '弱电解质与电离平衡' },
      { id: 'hydrolysis', name: '盐类水解' },
      { id: 'ph', name: '溶液的pH计算' },
      { id: 'precipitation', name: '沉淀溶解平衡' },
    ],
  },
  {
    id: 'organic',
    name: '有机化学基础',
    priority: 1,
    points: [
      { id: 'hydrocarbons', name: '烃（烷烃、烯烃、炔烃、芳香烃）' },
      { id: 'oxygen-compounds', name: '烃的含氧衍生物（醇、醛、酸、酯）' },
      { id: 'organic-reactions', name: '有机反应类型与条件' },
      { id: 'organic-synthesis', name: '有机合成与推断' },
      { id: 'biomolecules', name: '糖类、油脂、蛋白质' },
    ],
  },
]
