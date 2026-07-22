/**
 * 高考数学知识点体系（新高考）
 * 9 大模块，共 39 个知识点
 *
 * 每个知识点新增：
 *   - frequency: 考频 ★×1-5（1=低频，5=高频必考）
 *   - difficulty: 平均难度 1-5 星
 *   - pointType: 知识点类型（base=基础小题，core=中档大题，peak=压轴综合）
 */

export const modules = [
  {
    id: 'sets-logic',
    name: '集合与逻辑',
    priority: 3,
    points: [
      { id: 'set-concept', name: '集合的概念与表示', frequency: 2, difficulty: 1, pointType: 'base' },
      { id: 'set-operations', name: '集合间的基本关系与运算', frequency: 3, difficulty: 1, pointType: 'base' },
      { id: 'logic', name: '充分条件与必要条件', frequency: 4, difficulty: 2, pointType: 'base' },
    ],
  },
  {
    id: 'function-derivative',
    name: '函数与导数',
    priority: 1,
    points: [
      { id: 'func-properties', name: '函数的概念与性质（单调性、奇偶性、周期性）', frequency: 5, difficulty: 2, pointType: 'core' },
      { id: 'basic-functions', name: '基本初等函数（指数、对数、幂函数）', frequency: 5, difficulty: 2, pointType: 'core' },
      { id: 'func-application', name: '函数的图象与应用', frequency: 4, difficulty: 3, pointType: 'core' },
      { id: 'derivative-calc', name: '导数的运算与几何意义', frequency: 5, difficulty: 2, pointType: 'core' },
      { id: 'derivative-monotonicity', name: '利用导数研究单调性与极值', frequency: 5, difficulty: 3, pointType: 'core' },
      { id: 'derivative-application', name: '导数综合应用（不等式恒成立、零点）', frequency: 5, difficulty: 4, pointType: 'peak' },
    ],
  },
  {
    id: 'triangle',
    name: '三角与解三角形',
    priority: 2,
    points: [
      { id: 'trig-formulas', name: '三角恒等变换', frequency: 5, difficulty: 2, pointType: 'core' },
      { id: 'trig-images', name: '三角函数的图象与性质', frequency: 5, difficulty: 2, pointType: 'core' },
      { id: 'law-of-sines', name: '正弦定理', frequency: 4, difficulty: 2, pointType: 'core' },
      { id: 'law-of-cosines', name: '余弦定理', frequency: 4, difficulty: 2, pointType: 'core' },
      { id: 'triangle-app', name: '解三角形综合应用', frequency: 4, difficulty: 3, pointType: 'core' },
    ],
  },
  {
    id: 'sequence',
    name: '数列',
    priority: 1,
    points: [
      { id: 'sequence-concept', name: '数列的概念与通项公式', frequency: 3, difficulty: 2, pointType: 'core' },
      { id: 'arithmetic', name: '等差数列', frequency: 5, difficulty: 2, pointType: 'core' },
      { id: 'geometric', name: '等比数列', frequency: 5, difficulty: 2, pointType: 'core' },
      { id: 'sequence-sum', name: '数列求和（裂项、错位相减）', frequency: 4, difficulty: 3, pointType: 'core' },
    ],
  },
  {
    id: 'vector',
    name: '平面向量',
    priority: 3,
    points: [
      { id: 'vector-concept', name: '向量的线性运算', frequency: 3, difficulty: 1, pointType: 'base' },
      { id: 'vector-coord', name: '向量的坐标表示', frequency: 3, difficulty: 1, pointType: 'base' },
      { id: 'vector-dot', name: '向量的数量积', frequency: 4, difficulty: 2, pointType: 'base' },
      { id: 'vector-app', name: '向量的综合应用', frequency: 3, difficulty: 2, pointType: 'core' },
    ],
  },
  {
    id: 'solid-geometry',
    name: '立体几何',
    priority: 2,
    points: [
      { id: 'space-point-line', name: '空间点、直线、平面的位置关系', frequency: 3, difficulty: 2, pointType: 'core' },
      { id: 'parallel', name: '线面平行与面面平行', frequency: 4, difficulty: 2, pointType: 'core' },
      { id: 'perpendicular', name: '线面垂直与面面垂直', frequency: 4, difficulty: 3, pointType: 'core' },
      { id: 'space-vector', name: '空间向量与立体几何', frequency: 5, difficulty: 3, pointType: 'core' },
      { id: 'solid-calc', name: '空间几何体的表面积与体积', frequency: 4, difficulty: 2, pointType: 'core' },
    ],
  },
  {
    id: 'analytic-geometry',
    name: '解析几何',
    priority: 1,
    points: [
      { id: 'line-circle', name: '直线与圆的方程', frequency: 4, difficulty: 2, pointType: 'core' },
      { id: 'ellipse', name: '椭圆及其性质', frequency: 5, difficulty: 3, pointType: 'peak' },
      { id: 'hyperbola', name: '双曲线及其性质', frequency: 4, difficulty: 3, pointType: 'peak' },
      { id: 'parabola', name: '抛物线及其性质', frequency: 4, difficulty: 3, pointType: 'peak' },
      { id: 'conic-app', name: '直线与圆锥曲线的位置关系', frequency: 5, difficulty: 4, pointType: 'peak' },
      { id: 'conic-comprehensive', name: '圆锥曲线综合（最值、定点、定值）', frequency: 4, difficulty: 5, pointType: 'peak' },
    ],
  },
  {
    id: 'probability-statistics',
    name: '概率与统计',
    priority: 2,
    points: [
      { id: 'statistics', name: '统计与统计案例', frequency: 3, difficulty: 2, pointType: 'base' },
      { id: 'classical-prob', name: '古典概型与条件概率', frequency: 4, difficulty: 2, pointType: 'core' },
      { id: 'random-variables', name: '离散型随机变量及其分布', frequency: 4, difficulty: 3, pointType: 'core' },
      { id: 'normal-dist', name: '正态分布', frequency: 2, difficulty: 2, pointType: 'base' },
      { id: 'prob-app', name: '概率统计综合应用', frequency: 3, difficulty: 3, pointType: 'core' },
    ],
  },
  {
    id: 'inequality',
    name: '不等式',
    priority: 3,
    points: [
      { id: 'basic-inequality', name: '不等式的基本性质', frequency: 2, difficulty: 1, pointType: 'base' },
      { id: 'mean-inequality', name: '基本不等式（均值不等式）', frequency: 4, difficulty: 2, pointType: 'core' },
      { id: 'inequality-app', name: '不等式的综合应用', frequency: 3, difficulty: 3, pointType: 'core' },
    ],
  },
]

/** 将知识点 ID 映射到模块信息，方便快速查找 */
export const pointToModule = {}
modules.forEach(m => {
  m.points.forEach(p => {
    pointToModule[p.id] = m
  })
})

/** 根据模块 ID 获取模块信息 */
export function getModule(id) {
  return modules.find(m => m.id === id)
}

/**
 * 获取知识点的元数据（频次、难度、类型）
 */
export function getPointMeta(pointId) {
  for (const m of modules) {
    const p = m.points.find(p => p.id === pointId)
    if (p) return { ...p, moduleId: m.id, moduleName: m.name }
  }
  return null
}
