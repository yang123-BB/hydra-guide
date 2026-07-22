/**
 * 高考生物知识点体系（新高考）
 * 7 大模块，共 30 个知识点
 */

export const biologyModules = [
  {
    id: 'cell-molecules',
    name: '细胞的分子组成',
    priority: 1,
    points: [
      { id: 'protein', name: '蛋白质的结构与功能' },
      { id: 'nucleic-acid', name: '核酸的种类与功能' },
      { id: 'sugar-lipid', name: '糖类与脂质' },
      { id: 'water-inorganic-salt', name: '水与无机盐' },
    ],
  },
  {
    id: 'cell-structure',
    name: '细胞的结构与功能',
    priority: 1,
    points: [
      { id: 'cell-membrane', name: '细胞膜的结构与功能' },
      { id: 'organelles', name: '细胞器的结构与功能' },
      { id: 'nucleus', name: '细胞核的结构与功能' },
      { id: 'biofilm-system', name: '生物膜系统' },
    ],
  },
  {
    id: 'cell-metabolism',
    name: '细胞代谢',
    priority: 1,
    points: [
      { id: 'enzyme', name: '酶与酶促反应' },
      { id: 'atp', name: 'ATP在能量代谢中的作用' },
      { id: 'cellular-respiration', name: '细胞呼吸' },
      { id: 'photosynthesis', name: '光合作用' },
      { id: 'metabolism-comprehensive', name: '光合与呼吸综合' },
    ],
  },
  {
    id: 'cell-cycle',
    name: '细胞的生命历程',
    priority: 2,
    points: [
      { id: 'cell-division', name: '有丝分裂与减数分裂' },
      { id: 'cell-differentiation', name: '细胞分化与全能性' },
      { id: 'apoptosis', name: '细胞凋亡、衰老与癌变' },
    ],
  },
  {
    id: 'molecular-heredity',
    name: '遗传的分子基础',
    priority: 1,
    points: [
      { id: 'dna-as-genetic-material', name: 'DNA是主要遗传物质' },
      { id: 'dna-replication', name: 'DNA分子的结构与复制' },
      { id: 'transcription-translation', name: '转录与翻译（基因表达）' },
      { id: 'central-dogma', name: '中心法则' },
    ],
  },
  {
    id: 'genetic-laws',
    name: '遗传的基本规律',
    priority: 1,
    points: [
      { id: 'mendel-laws', name: '孟德尔遗传定律' },
      { id: 'sex-linked', name: '伴性遗传' },
      { id: 'variation', name: '生物变异与育种' },
      { id: 'population-genetics', name: '现代生物进化理论' },
    ],
  },
  {
    id: 'homeostasis',
    name: '稳态与调节',
    priority: 1,
    points: [
      { id: 'internal-environment', name: '内环境与稳态' },
      { id: 'neural-regulation', name: '神经调节' },
      { id: 'hormonal-regulation', name: '体液（激素）调节' },
      { id: 'immune-regulation', name: '免疫调节' },
      { id: 'plant-hormones', name: '植物激素调节' },
      { id: 'ecology', name: '生态系统与环境保护' },
    ],
  },
]
