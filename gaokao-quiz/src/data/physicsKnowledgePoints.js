/**
 * 高考物理知识点体系（新高考）
 * 12 大模块，共 42 个知识点
 */

export const physicsModules = [
  {
    id: 'kinematics',
    name: '质点运动学',
    priority: 2,
    points: [
      { id: 'displacement-velocity', name: '位移、速度与加速度' },
      { id: 'uniform-linear', name: '匀速直线运动' },
      { id: 'uniform-accelerated', name: '匀变速直线运动规律' },
      { id: 'free-fall', name: '自由落体运动' },
    ],
  },
  {
    id: 'newton-laws',
    name: '力与牛顿运动定律',
    priority: 1,
    points: [
      { id: 'three-forces', name: '三种常见力（重力、弹力、摩擦力）' },
      { id: 'force-analysis', name: '受力分析与力的合成与分解' },
      { id: 'newton-second', name: '牛顿第二定律' },
      { id: 'newton-third', name: '牛顿第三定律与整体法隔离法' },
    ],
  },
  {
    id: 'curvilinear-motion',
    name: '曲线运动',
    priority: 1,
    points: [
      { id: 'projectile', name: '平抛运动与斜抛运动' },
      { id: 'circular-motion', name: '圆周运动（向心加速度与向心力）' },
      { id: 'relative-motion', name: '运动的合成与分解' },
    ],
  },
  {
    id: 'gravitation',
    name: '万有引力与航天',
    priority: 1,
    points: [
      { id: 'kepler-law', name: '开普勒行星运动定律' },
      { id: 'universal-gravitation', name: '万有引力定律' },
      { id: 'satellite', name: '人造卫星与宇宙速度' },
    ],
  },
  {
    id: 'mechanical-energy',
    name: '功与机械能',
    priority: 1,
    points: [
      { id: 'work-power', name: '功与功率' },
      { id: 'kinetic-energy', name: '动能与动能定理' },
      { id: 'potential-energy', name: '重力势能与弹性势能' },
      { id: 'energy-conservation', name: '机械能守恒定律' },
    ],
  },
  {
    id: 'momentum',
    name: '动量',
    priority: 1,
    points: [
      { id: 'momentum-impulse', name: '动量与冲量' },
      { id: 'momentum-theorem', name: '动量定理' },
      { id: 'momentum-conservation', name: '动量守恒定律' },
      { id: 'collision', name: '碰撞与反冲' },
    ],
  },
  {
    id: 'electrostatics',
    name: '静电场',
    priority: 1,
    points: [
      { id: 'coulomb-law', name: '库仑定律' },
      { id: 'electric-field', name: '电场强度与电场线' },
      { id: 'electric-potential', name: '电势能与电势' },
      { id: 'capacitor', name: '电容与电容器' },
      { id: 'charged-particle', name: '带电粒子在电场中的运动' },
    ],
  },
  {
    id: 'steady-current',
    name: '恒定电流',
    priority: 2,
    points: [
      { id: 'ohm-law', name: '欧姆定律与电阻定律' },
      { id: 'series-parallel', name: '串并联电路' },
      { id: 'electric-power', name: '电功与电功率' },
      { id: 'experiment-circuit', name: '电学实验（测电阻、测电动势）' },
    ],
  },
  {
    id: 'magnetic-field',
    name: '磁场',
    priority: 1,
    points: [
      { id: 'ampere-force', name: '安培力与磁场对电流的作用' },
      { id: 'lorentz-force', name: '洛伦兹力' },
      { id: 'charged-in-field', name: '带电粒子在磁场中的运动' },
    ],
  },
  {
    id: 'electromagnetic-induction',
    name: '电磁感应',
    priority: 1,
    points: [
      { id: 'faraday-law', name: '法拉第电磁感应定律' },
      { id: 'lenz-law', name: '楞次定律' },
      { id: 'self-inductance', name: '自感与互感' },
      { id: 'em-induction-application', name: '电磁感应综合应用' },
    ],
  },
  {
    id: 'thermodynamics',
    name: '热学',
    priority: 2,
    points: [
      { id: 'molecular-theory', name: '分子动理论与阿伏伽德罗常数' },
      { id: 'gas-laws', name: '理想气体状态方程' },
      { id: 'thermo-laws', name: '热力学第一定律与能量守恒' },
    ],
  },
  {
    id: 'optics-atomic',
    name: '光学与原子物理',
    priority: 2,
    points: [
      { id: 'geometric-optics', name: '光的折射与全反射' },
      { id: 'wave-optics', name: '光的干涉与衍射' },
      { id: 'photoelectric', name: '光电效应与波粒二象性' },
      { id: 'atomic-structure', name: '玻尔模型与氢原子光谱' },
      { id: 'nuclear', name: '原子核与核反应' },
    ],
  },
]
