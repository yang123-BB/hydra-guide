/**
 * 高考生物真题题库（2022-2026）
 * 每年15题：选择题8道 + 填空题4道 + 解答题3道
 * 模块覆盖：细胞生物学、遗传与进化、生态学、动植物生理、生物技术、分子生物学
 */

export const gaokaoBiologyQuestions = [
  // ===================================================================
  // 2022年（15题）
  // ===================================================================

  // ---- 选择题（8道）----
  {
    id: 'bio2022_001',
    module: 'cell-biology',
    pointId: 'cell-structure',
    type: 'single-choice',
    difficulty: 1,
    content: '下列关于原核细胞和真核细胞的叙述，错误的是',
    options: [
      '原核细胞没有核膜包被的细胞核',
      '真核细胞具有多种细胞器',
      '原核细胞和真核细胞都以DNA为遗传物质',
      '原核细胞和真核细胞的细胞膜主要成分是纤维素和果胶'
    ],
    answer: 3,
    explanation: '原核细胞和真核细胞的细胞膜主要成分都是磷脂和蛋白质，植物细胞的细胞壁主要成分是纤维素和果胶，D错误。原核细胞无核膜包被的细胞核，A正确；真核细胞具有多种细胞器，B正确；细胞生物的遗传物质都是DNA，C正确。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 1 }
  },
  {
    id: 'bio2022_002',
    module: 'molecular-biology',
    pointId: 'enzyme',
    type: 'single-choice',
    difficulty: 1,
    content: '下列关于酶的叙述，正确的是',
    options: [
      '酶都是蛋白质',
      '酶在催化反应过程中会被消耗',
      '酶通过降低化学反应活化能来提高反应速率',
      '高温和低温均使酶永久失活'
    ],
    answer: 2,
    explanation: '大多数酶是蛋白质，少数酶是RNA，A错误。酶作为催化剂，反应前后化学性质不变，不会被消耗，B错误。酶通过降低活化能提高反应速率，C正确。高温使酶变性失活（永久性），低温只抑制酶活性，温度恢复后活性可恢复，D错误。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 1 }
  },
  {
    id: 'bio2022_003',
    module: 'physiology',
    pointId: 'photosynthesis',
    type: 'single-choice',
    difficulty: 2,
    content: '在光合作用过程中，光反应阶段产生的物质在暗反应阶段中被利用的是',
    options: [
      'NADPH和O2',
      'ATP和NADPH',
      'ATP和O2',
      'NADPH和CO2'
    ],
    answer: 1,
    explanation: '光反应阶段产生ATP、NADPH和O2。其中ATP和NADPH用于暗反应阶段中C3的还原，而O2释放到大气中不被暗反应利用。因此被暗反应利用的是ATP和NADPH。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'process', difficultyStars: 2 }
  },
  {
    id: 'bio2022_004',
    module: 'genetics-evolution',
    pointId: 'mendel-genetics',
    type: 'single-choice',
    difficulty: 2,
    content: '孟德尔在豌豆杂交实验中，验证假说采用的实验方法是',
    options: [
      '自交实验',
      '测交实验',
      '杂交实验',
      '正交和反交实验'
    ],
    answer: 1,
    explanation: '孟德尔在提出假说后，设计了测交实验（让F1与隐性纯合子杂交）来验证假说。测交后代的表现型及比例可以反映F1产生的配子种类及比例，从而验证基因分离定律和自由组合定律的正确性。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'experiment', difficultyStars: 2 }
  },
  {
    id: 'bio2022_005',
    module: 'ecology',
    pointId: 'population-ecology',
    type: 'single-choice',
    difficulty: 2,
    content: '在食物链"草→兔→狐"中，若兔的数量增加，则短期内狐的数量变化和草的数量变化分别是',
    options: [
      '狐增加，草减少',
      '狐减少，草增加',
      '狐增加，草增加',
      '狐减少，草减少'
    ],
    answer: 0,
    explanation: '兔的数量增加，为狐提供了更多食物，导致狐的数量短期内增加；同时兔数量增加对草的捕食压力增大，导致草的数量减少。这是生态系统负反馈调节的体现。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'analysis', difficultyStars: 2 }
  },
  {
    id: 'bio2022_006',
    module: 'physiology',
    pointId: 'nerve-regulation',
    type: 'single-choice',
    difficulty: 3,
    content: '神经纤维受到刺激产生兴奋时，膜电位发生的变化是',
    options: [
      '外正内负→外负内正',
      '外负内正→外正内负',
      '外正内负→外正内负',
      '外负内正→外负内正'
    ],
    answer: 0,
    explanation: '静息状态下，神经纤维膜电位为外正内负（静息电位）。受到刺激时，Na+通道开放，Na+内流，膜电位变为外负内正（动作电位），即发生超极化到去极化的转变。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'process', difficultyStars: 3 }
  },
  {
    id: 'bio2022_007',
    module: 'cell-biology',
    pointId: 'cell-metabolism',
    type: 'single-choice',
    difficulty: 3,
    content: '下列关于有氧呼吸和无氧呼吸的比较，正确的是',
    options: [
      '有氧呼吸全过程都在线粒体中进行',
      '无氧呼吸的产物都是乳酸',
      '有氧呼吸和无氧呼吸第一阶段完全相同',
      '无氧呼吸释放的能量比有氧呼吸多'
    ],
    answer: 2,
    explanation: '有氧呼吸第一阶段在细胞质基质中进行，第二、三阶段在线粒体中，A错误。无氧呼吸的产物有乳酸或酒精和CO2，B错误。有氧呼吸和无氧呼吸第一阶段都是葡萄糖分解为丙酮酸和NADH，场所和过程相同，C正确。无氧呼吸释放的能量少，大部分能量仍储存在酒精或乳酸中，D错误。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'compare', difficultyStars: 3 }
  },
  {
    id: 'bio2022_008',
    module: 'biotechnology',
    pointId: 'gene-engineering',
    type: 'single-choice',
    difficulty: 3,
    content: '在基因工程中，构建基因表达载体时，用于切割目的基因和质粒的工具是',
    options: [
      'DNA连接酶',
      '限制酶',
      'DNA聚合酶',
      'RNA聚合酶'
    ],
    answer: 1,
    explanation: '基因工程中构建表达载体时，需用限制酶（限制性内切核酸酶）在特定序列处切割目的基因和载体质粒，产生相同的黏性末端或平末端，然后由DNA连接酶将二者连接起来。DNA聚合酶用于DNA复制，RNA聚合酶用于转录。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 3 }
  },

  // ---- 填空题（4道）----
  {
    id: 'bio2022_009',
    module: 'cell-biology',
    pointId: 'cell-division',
    type: 'fill-blank',
    difficulty: 2,
    content: '在有丝分裂过程中，染色体数目加倍发生在____期，姐妹染色单体分离发生在____期。',
    options: ['后', '末'],
    answer: 0,
    explanation: '有丝分裂后期，着丝粒分裂，姐妹染色单体分离，染色体数目加倍。前期出现纺锤体和染色体，中期染色体排列在赤道板上，末期染色体解旋为染色质。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 2 }
  },
  {
    id: 'bio2022_010',
    module: 'genetics-evolution',
    pointId: 'gene-expression',
    type: 'fill-blank',
    difficulty: 2,
    content: '基因指导蛋白质合成的过程包括____和____两个阶段。',
    options: ['转录', '翻译'],
    answer: 0,
    explanation: '基因表达包括转录和翻译两个阶段。转录以DNA的一条链为模板合成mRNA，在细胞核中进行；翻译以mRNA为模板合成蛋白质，在核糖体中进行。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 2 }
  },
  {
    id: 'bio2022_011',
    module: 'ecology',
    pointId: 'ecosystem',
    type: 'fill-blank',
    difficulty: 3,
    content: '生态系统的能量流动具有____和____两个特点。',
    options: ['单向流动', '逐级递减'],
    answer: 0,
    explanation: '生态系统的能量流动具有单向流动（能量从生产者流向消费者和分解者，不可逆转）和逐级递减（每个营养级的能量只有10%~20%传递给下一营养级）两个特点。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 3 }
  },
  {
    id: 'bio2022_012',
    module: 'physiology',
    pointId: 'immunity',
    type: 'fill-blank',
    difficulty: 3,
    content: '人体免疫系统的第三道防线包括____免疫和____免疫两种方式。',
    options: ['体液', '细胞'],
    answer: 0,
    explanation: '第三道防线为特异性免疫，包括体液免疫（B细胞介导，产生抗体）和细胞免疫（T细胞介导，直接杀伤靶细胞）。第一道防线是皮肤和黏膜，第二道防线是体液中的杀菌物质和吞噬细胞。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 3 }
  },

  // ---- 解答题（3道）----
  {
    id: 'bio2022_013',
    module: 'cell-biology',
    pointId: 'cell-metabolism',
    type: 'solution',
    difficulty: 3,
    content: '农业生产中常采用增施有机肥、合理灌溉等措施来提高作物产量。请从光合作用和呼吸作用的角度，分析增施有机肥提高作物产量的原理。',
    options: [],
    answer: 0,
    explanation: '增施有机肥的原理：有机肥被土壤微生物分解，释放CO2，提高田间CO2浓度，促进光合作用的暗反应阶段（CO2固定），增加有机物合成；同时微生物分解有机肥释放矿质元素（如N、P、K等），为植物生长提供必需营养。但有机肥施用过量会导致土壤微生物呼吸作用增强，消耗过多O2，影响根系有氧呼吸，因此需要合理施用。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 3 }
  },
  {
    id: 'bio2022_014',
    module: 'genetics-evolution',
    pointId: 'mendel-genetics',
    type: 'solution',
    difficulty: 4,
    content: '豌豆的高茎（D）对矮茎（d）为显性，圆粒（R）对皱粒（r）为显性，两对基因独立遗传。将高茎圆粒豌豆与矮茎皱粒豌豆杂交，F1中高茎圆粒:高茎皱粒:矮茎圆粒:矮茎皱粒=1:1:1:1。请回答：（1）亲本高茎圆粒豌豆的基因型是什么？（2）F1高茎圆粒豌豆自交，F2中高茎圆粒的比例是多少？',
    options: [],
    answer: 0,
    explanation: '（1）测交结果为四种表型比例1:1:1:1，说明高茎圆粒亲本产生四种比例相等的配子，其基因型为DdRr。（2）F1高茎圆粒的基因型为DdRr，自交后代中高茎（D_）占3/4，圆粒（R_）占3/4，高茎圆粒比例=3/4×3/4=9/16。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 4 }
  },
  {
    id: 'bio2022_015',
    module: 'ecology',
    pointId: 'ecosystem',
    type: 'solution',
    difficulty: 4,
    content: '某湖泊由于生活污水排放导致水体富营养化，出现蓝藻水华。经治理后，水质逐步恢复。请回答：（1）水体富营养化导致蓝藻大量增殖的原因是什么？（2）从生态系统的稳定性角度，说明湖泊生态系统具有一定自我调节能力的原因。',
    options: [],
    answer: 0,
    explanation: '（1）生活污水中含有大量N、P等矿质元素，为蓝藻的生长繁殖提供了充足营养，导致蓝藻大量增殖，形成水华。同时蓝藻大量增殖覆盖水面，遮挡阳光，使其他水生植物难以生存，进一步加剧水体恶化。（2）湖泊生态系统具有一定的自我调节能力（抵抗力稳定性），原因是生态系统中存在负反馈调节机制，物种多样性越高，营养结构越复杂，自我调节能力越强。但自我调节能力有一定限度，超过限度则生态系统被破坏。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 4 }
  },

  // ===================================================================
  // 2023年（15题）
  // ===================================================================

  // ---- 选择题（8道）----
  {
    id: 'bio2023_001',
    module: 'cell-biology',
    pointId: 'cell-structure',
    type: 'single-choice',
    difficulty: 1,
    content: '下列关于细胞壁的叙述，错误的是',
    options: [
      '植物细胞壁的主要成分是纤维素和果胶',
      '细菌细胞壁的主要成分是肽聚糖',
      '细胞壁具有支持和保护细胞的作用',
      '细胞壁具有选择透过性'
    ],
    answer: 3,
    explanation: '细胞壁是全透性的，不具有选择透过性，选择透过性是细胞膜的功能特征。植物细胞壁主要成分为纤维素和果胶，细菌细胞壁主要成分为肽聚糖，细胞壁的功能是支持和保护。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 1 }
  },
  {
    id: 'bio2023_002',
    module: 'physiology',
    pointId: 'respiration',
    type: 'single-choice',
    difficulty: 1,
    content: '细胞呼吸过程中，产生ATP最多的阶段是',
    options: [
      '糖酵解阶段',
      '柠檬酸循环阶段',
      '电子传递链阶段',
      '丙酮酸脱羧阶段'
    ],
    answer: 2,
    explanation: '有氧呼吸第三阶段（电子传递链阶段）中，NADH和FADH2与O2结合生成H2O，释放大量能量，合成大量ATP，约产生34个ATP，远多于第一、第二阶段。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'process', difficultyStars: 1 }
  },
  {
    id: 'bio2023_003',
    module: 'genetics-evolution',
    pointId: 'dna-replication',
    type: 'single-choice',
    difficulty: 2,
    content: 'DNA复制过程中，与模板链5\'-ATG-3\'互补配对的子链序列是',
    options: [
      '5\'-TAC-3\'',
      '5\'-CAT-3\'',
      '5\'-ATG-3\'',
      '5\'-GTA-3\''
    ],
    answer: 1,
    explanation: 'DNA复制遵循碱基互补配对原则（A-T、G-C），且子链的合成方向为5\'→3\'。模板链为5\'-ATG-3\'，其互补链应为3\'-TAC-5\'，即5\'-CAT-3\'。A与T配对，T与A配对，G与C配对。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'calc', difficultyStars: 2 }
  },
  {
    id: 'bio2023_004',
    module: 'ecology',
    pointId: 'biodiversity',
    type: 'single-choice',
    difficulty: 2,
    content: '生物多样性不包括下列哪一项',
    options: [
      '遗传多样性',
      '物种多样性',
      '生态系统多样性',
      '细胞多样性'
    ],
    answer: 3,
    explanation: '生物多样性包括三个层次：遗传多样性（基因多样性）、物种多样性和生态系统多样性。细胞多样性不属于生物多样性的范畴。保护生物多样性的措施包括就地保护、迁地保护等。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 2 }
  },
  {
    id: 'bio2023_005',
    module: 'physiology',
    pointId: 'hormone',
    type: 'single-choice',
    difficulty: 2,
    content: '下列关于植物激素的叙述，正确的是',
    options: [
      '生长素只能促进植物生长',
      '脱落酸能促进种子萌发',
      '赤霉素能促进细胞伸长和种子萌发',
      '乙烯能促进果实发育'
    ],
    answer: 2,
    explanation: '生长素具有两重性：低浓度促进生长，高浓度抑制生长，A错误。脱落酸抑制种子萌发，促进叶和果实的衰老脱落，B错误。赤霉素能促进细胞伸长、种子萌发和果实发育，C正确。乙烯促进果实成熟，而不是发育，D错误。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 2 }
  },
  {
    id: 'bio2023_006',
    module: 'molecular-biology',
    pointId: 'protein-synthesis',
    type: 'single-choice',
    difficulty: 3,
    content: '下列关于遗传密码的叙述，错误的是',
    options: [
      '一个密码子由mRNA上三个相邻碱基组成',
      '一种氨基酸可由多种密码子编码',
      '所有生物共用一套遗传密码',
      '密码子与反密码子之间通过磷酸二酯键结合'
    ],
    answer: 3,
    explanation: '密码子与反密码子之间通过碱基互补配对（A-U、G-C）以氢键结合，而不是磷酸二酯键。A正确：密码子是mRNA上决定一个氨基酸的三个相邻碱基。B正确：遗传密码具有简并性。C正确：遗传密码在生物界中基本通用。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 3 }
  },
  {
    id: 'bio2023_007',
    module: 'genetics-evolution',
    pointId: 'mutation-evolution',
    type: 'single-choice',
    difficulty: 3,
    content: '下列关于现代生物进化理论的叙述，正确的是',
    options: [
      '进化的基本单位是生物个体',
      '自然选择直接作用于生物的基因型',
      '隔离是物种形成的必要条件',
      '突变和基因重组为进化提供定向的选择'
    ],
    answer: 2,
    explanation: '现代生物进化理论认为：种群是生物进化的基本单位，A错误；自然选择直接作用于个体的表现型，间接作用于基因型，B错误；隔离（尤其是生殖隔离）是物种形成的必要条件，C正确；突变和基因重组为进化提供原材料，不定向的，自然选择才决定进化方向，D错误。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 3 }
  },
  {
    id: 'bio2023_008',
    module: 'biotechnology',
    pointId: 'cell-engineering',
    type: 'single-choice',
    difficulty: 3,
    content: '下列关于植物组织培养的叙述，正确的是',
    options: [
      '植物组织培养的原理是植物细胞具有全能性',
      '培养过程中不需要添加植物激素',
      '外植体只能用茎尖分生组织',
      '培养过程中一直需要光照条件'
    ],
    answer: 0,
    explanation: '植物组织培养的原理是植物细胞具有全能性，A正确。培养过程中需要添加生长素和细胞分裂素等植物激素来诱导脱分化和再分化，B错误。外植体可以是茎尖、叶片、花药等多种组织，C错误。脱分化阶段不需要光照，再分化阶段需要光照，D错误。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 3 }
  },

  // ---- 填空题（4道）----
  {
    id: 'bio2023_009',
    module: 'cell-biology',
    pointId: 'cell-metabolism',
    type: 'fill-blank',
    difficulty: 2,
    content: '有氧呼吸的总反应式为：____ + H2O + O2 → ____ + H2O + 能量。',
    options: ['C6H12O6', 'CO2'],
    answer: 0,
    explanation: '有氧呼吸总反应式：C6H12O6 + 6H2O + 6O2 → 6CO2 + 12H2O + 能量。其中葡萄糖是底物，CO2是最终产物之一。有氧呼吸第一阶段在细胞质基质中，第二、三阶段在线粒体中。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 2 }
  },
  {
    id: 'bio2023_010',
    module: 'genetics-evolution',
    pointId: 'gene-expression',
    type: 'fill-blank',
    difficulty: 2,
    content: '在中心法则中，RNA自我复制需要____酶的催化，逆转录过程需要____酶的催化。',
    options: ['RNA复制', '逆转录'],
    answer: 0,
    explanation: 'RNA自我复制由RNA复制酶催化，常见于RNA病毒（如烟草花叶病毒）。逆转录由逆转录酶催化，以RNA为模板合成DNA，常见于逆转录病毒（如HIV）。二者都是对中心法则的补充。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 2 }
  },
  {
    id: 'bio2023_011',
    module: 'physiology',
    pointId: 'nerve-regulation',
    type: 'fill-blank',
    difficulty: 3,
    content: '兴奋在突触处的传递是____向的，原因是神经递质只能由____释放，作用于突触后膜。',
    options: ['单', '突触前膜'],
    answer: 0,
    explanation: '兴奋在突触处的传递是单向的，因为神经递质只存在于突触前膜的突触小泡中，只能由突触前膜释放，作用于突触后膜上的特异性受体，不能反向传递。这与神经纤维上兴奋的双向传导不同。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 3 }
  },
  {
    id: 'bio2023_012',
    module: 'ecology',
    pointId: 'community',
    type: 'fill-blank',
    difficulty: 3,
    content: '群落中不同物种之间的关系主要包括____、____、____和寄生等种间关系。',
    options: ['捕食', '竞争'],
    answer: 0,
    explanation: '群落的种间关系主要包括：捕食（一种生物以另一种生物为食）、竞争（两种生物争夺资源）、寄生（一种生物从另一种生物体获取营养）和互利共生（两种生物相互受益）。这些关系影响群落的物种组成和结构。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 3 }
  },

  // ---- 解答题（3道）----
  {
    id: 'bio2023_013',
    module: 'physiology',
    pointId: 'photosynthesis',
    type: 'solution',
    difficulty: 3,
    content: '某实验小组探究了不同光照强度对某植物叶片净光合速率的影响。结果显示：在较低光照强度下，净光合速率为正值，但数值较小；随着光照强度增大，净光合速率逐渐增大；当光照强度达到一定值后，净光合速率不再增大。请回答：（1）请画出该实验条件下净光合速率随光照强度变化的曲线示意图，并解释其变化原因。（2）在光照强度过高时，可能会出现光抑制现象，简述其原因。',
    options: [],
    answer: 0,
    explanation: '（1）曲线呈先上升后趋于平稳的S形趋势。原因：光照强度较低时，光反应产生的ATP和NADPH有限，限制了暗反应，净光合速率较低；随光照强度增大，光反应增强，为暗反应提供更多ATP和NADPH，净光合速率增大；当光照强度达到光饱和点后，CO2浓度、温度等成为限制因素，净光合速率不再增大。（2）光抑制现象的原因：光照强度过高时，植物吸收的光能超过光合作用利用量，过剩的光能导致光系统II（PSII）损伤，光合色素降解，导致光合速率下降。植物通过热耗散等机制来应对光抑制。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 3 }
  },
  {
    id: 'bio2023_014',
    module: 'physiology',
    pointId: 'immunity',
    type: 'solution',
    difficulty: 4,
    content: '新冠病毒流行期间，接种疫苗是预防感染的重要措施。常见的疫苗类型包括灭活疫苗和mRNA疫苗等。请回答：（1）灭活疫苗和mRNA疫苗在诱导机体免疫应答的机制上有何区别？（2）从免疫学角度说明为什么需要接种加强针。',
    options: [],
    answer: 0,
    explanation: '（1）灭活疫苗含有被灭活（杀死）的完整病毒颗粒，注射后直接被抗原呈递细胞摄取、处理并呈递，激活B细胞和T细胞，引发体液免疫和细胞免疫。mRNA疫苗携带编码病毒刺突蛋白的mRNA，进入人体细胞后在细胞内翻译产生刺突蛋白，通过内源性抗原呈递途径激活免疫应答。（2）接种加强针的原因：初次免疫产生的记忆B细胞和记忆T细胞数量有限，且抗体水平会随时间下降。加强针能刺激记忆细胞快速增殖分化，产生更多的浆细胞和记忆细胞，提高抗体水平，延长免疫保护时间，增强对变异株的防护能力。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 4 }
  },
  {
    id: 'bio2023_015',
    module: 'biotechnology',
    pointId: 'gene-engineering',
    type: 'solution',
    difficulty: 4,
    content: 'CRISPR/Cas9技术是一种重要的基因编辑工具。请回答：（1）CRISPR/Cas9系统主要由哪两部分组成？各有什么功能？（2）该技术在基因治疗中有何应用前景和面临的挑战？',
    options: [],
    answer: 0,
    explanation: '（1）CRISPR/Cas9系统由两部分组成：Cas9核酸酶和sgRNA（向导RNA）。sgRNA通过与靶DNA序列碱基互补配对引导Cas9精确定位到目标基因位点；Cas9蛋白具有核酸内切酶活性，在sgRNA引导下在特定位点切断DNA双链，导致基因失活或通过同源重组实现基因修复或插入。（2）应用前景：可修复致病突变基因，用于治疗遗传病（如镰刀型细胞贫血症、地中海贫血等）、肿瘤免疫治疗（如CAR-T细胞改造）等。面临的挑战：脱靶效应（Cas9可能切割非目标序列）、递送系统的安全性和效率、免疫排斥反应、伦理问题等。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 4 }
  },

  // ===================================================================
  // 2024年（15题）
  // ===================================================================

  // ---- 选择题（8道）----
  {
    id: 'bio2024_001',
    module: 'cell-biology',
    pointId: 'cell-structure',
    type: 'single-choice',
    difficulty: 1,
    content: '线粒体被称为细胞的"动力车间"，其功能是',
    options: [
      '合成蛋白质',
      '进行有氧呼吸的主要场所',
      '合成脂质',
      '储存遗传物质'
    ],
    answer: 1,
    explanation: '线粒体是有氧呼吸第二、三阶段的主要场所，通过氧化分解有机物释放大量能量，合成ATP，为细胞生命活动提供能量，因此被称为"动力车间"。蛋白质合成的场所是核糖体（"蛋白质的加工车间"是内质网和高尔基体），合成脂质的场所是内质网，储存遗传物质的场所是细胞核。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 1 }
  },
  {
    id: 'bio2024_002',
    module: 'cell-biology',
    pointId: 'cell-metabolism',
    type: 'single-choice',
    difficulty: 1,
    content: '在煮鸡蛋的过程中，鸡蛋清由透明液态变为白色固态，其主要原因是',
    options: [
      '蛋白质分子被氧化',
      '蛋白质的空间结构发生改变',
      '蛋白质分子被水解为氨基酸',
      '蛋白质分子中肽键断裂'
    ],
    answer: 1,
    explanation: '加热使蛋白质的空间结构（高级结构）发生改变，肽链伸展松散，疏水基团暴露，导致蛋白质变性凝聚，从液态变为固态。这个过程不破坏肽键（一级结构不变），不水解为氨基酸。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'principle', difficultyStars: 1 }
  },
  {
    id: 'bio2024_003',
    module: 'genetics-evolution',
    pointId: 'mendel-genetics',
    type: 'single-choice',
    difficulty: 2,
    content: '一对表现型正常的夫妇，生了一个患白化病（常染色体隐性遗传病）的儿子。他们再生一个孩子患白化病的概率是',
    options: [
      '1/2',
      '1/4',
      '3/4',
      '100%'
    ],
    answer: 1,
    explanation: '白化病为常染色体隐性遗传，致病基因为a。表现型正常的夫妇生下患病儿子（aa），说明夫妇的基因型均为Aa。再生一个孩子患白化病（aa）的概率为1/2×1/2=1/4。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'calc', difficultyStars: 2 }
  },
  {
    id: 'bio2024_004',
    module: 'ecology',
    pointId: 'population-ecology',
    type: 'single-choice',
    difficulty: 2,
    content: '下列关于种群数量变化S形增长曲线的叙述，错误的是',
    options: [
      '种群数量达到K值后保持稳定',
      '环境容纳量K值是可变的',
      '种群增长率在K/2时最大',
      '种群数量超过K值后一定会出现灭绝'
    ],
    answer: 3,
    explanation: 'S形增长中，种群数量在K值附近波动，但超过K值时不一定灭绝，可能通过密度制约因素（食物短缺、疾病等）调节回K值附近。A正确：K值附近种群数量相对稳定。B正确：K值随环境条件变化。C正确：在K/2时种群增长率最大。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'analysis', difficultyStars: 2 }
  },
  {
    id: 'bio2024_005',
    module: 'molecular-biology',
    pointId: 'enzyme',
    type: 'single-choice',
    difficulty: 2,
    content: '过氧化氢酶在适宜条件下催化H2O2分解产生O2和H2O。若要探究温度对酶活性的影响，下列实验操作最合理的是',
    options: [
      '将H2O2与过氧化氢酶混合后在不同温度下保温',
      '将H2O2和过氧化氢酶分别在相同温度下预热后再混合',
      '在室温下混合H2O2与过氧化氢酶后测定不同温度下的反应速率',
      '将H2O2与过氧化氢酶混合后置于冰水混合物中测定反应速率'
    ],
    answer: 1,
    explanation: '探究温度对酶活性的影响时，应将底物和酶分别在不同温度下保温（预热）达到设定温度后再混合，以确保反应在设定温度下进行。A选项直接混合后再保温，反应已经开始，结果不准确。C选项在室温下混合后再测定不同温度，无法控制反应起始温度。D选项只测低温，无法探究温度对酶活性的影响趋势。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'experiment', difficultyStars: 2 }
  },
  {
    id: 'bio2024_006',
    module: 'physiology',
    pointId: 'nerve-regulation',
    type: 'single-choice',
    difficulty: 3,
    content: '下列关于反射弧的叙述，正确的是',
    options: [
      '反射弧由感受器、传入神经、神经中枢、传出神经四部分组成',
      '反射弧中任何一个环节受损，反射活动都不能完成',
      '感受器的功能是将效应器的信号传入神经中枢',
      '传出神经的功能是将感受器的兴奋传至效应器'
    ],
    answer: 1,
    explanation: '反射弧包括感受器、传入神经、神经中枢、传出神经和效应器五部分，A缺少效应器，错误。反射弧的完整性是完成反射活动的前提，任何一环受损反射都不能完成，B正确。感受器接收刺激产生兴奋，经传入神经传到神经中枢，C错误。传出神经将神经中枢的指令传至效应器，D错误。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 3 }
  },
  {
    id: 'bio2024_007',
    module: 'cell-biology',
    pointId: 'cell-division',
    type: 'single-choice',
    difficulty: 3,
    content: '下列关于减数分裂的叙述，正确的是',
    options: [
      '减数分裂过程中染色体复制一次，细胞分裂一次',
      '同源染色体分离发生在减数第二次分裂后期',
      '减数第一次分裂结束后，染色体数目减半',
      '减数分裂形成的子细胞中均含有同源染色体'
    ],
    answer: 2,
    explanation: '减数分裂中染色体复制一次，细胞连续分裂两次，A错误。同源染色体分离发生在减数第一次分裂后期，B错误。减数第一次分裂结束后，染色体数目减半（由2n→n），C正确。减数分裂形成的子细胞（配子）中不含同源染色体，D错误。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'process', difficultyStars: 3 }
  },
  {
    id: 'bio2024_008',
    module: 'biotechnology',
    pointId: 'microbiology',
    type: 'single-choice',
    difficulty: 3,
    content: '在微生物培养中，对接种环进行灭菌的正确方法是',
    options: [
      '紫外灯照射30分钟',
      '酒精擦拭后晾干',
      '灼烧至红热',
      '高压蒸汽灭菌'
    ],
    answer: 2,
    explanation: '接种环（金属环）通常采用灼烧灭菌法：在酒精灯火焰上灼烧至红热，利用高温使微生物蛋白质变性。A紫外线照射适用于空气和物体表面灭菌。B酒精擦拭达不到灭菌效果（只能消毒）。D高压蒸汽灭菌适用于培养基、玻璃器皿等，但不适合金属接种环的日常操作。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'experiment', difficultyStars: 3 }
  },

  // ---- 填空题（4道）----
  {
    id: 'bio2024_009',
    module: 'molecular-biology',
    pointId: 'gene-expression',
    type: 'fill-blank',
    difficulty: 2,
    content: 'DNA分子独特的____结构为复制提供了精确的模板，通过____原则保证了复制的准确性。',
    options: ['双螺旋', '碱基互补配对'],
    answer: 0,
    explanation: 'DNA是双螺旋结构，两条链反向平行。复制时以两条母链为模板，按照碱基互补配对原则（A-T、G-C）合成子链，保证了遗传信息传递的准确性。DNA复制还表现出半保留复制的特点。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 2 }
  },
  {
    id: 'bio2024_010',
    module: 'cell-biology',
    pointId: 'cell-signaling',
    type: 'fill-blank',
    difficulty: 2,
    content: '细胞间信息交流的方式主要有三种：通过____直接接触传递信息、通过____传递信息、通过胞间连丝（植物细胞）传递信息。',
    options: ['细胞膜', '化学物质'],
    answer: 0,
    explanation: '细胞间信息交流的三种主要方式：（1）通过细胞膜直接接触（如精子和卵细胞的识别）；（2）通过化学物质（如激素、神经递质）传递信息；（3）通过胞间连丝（植物细胞间）进行物质交换和信息传递。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 2 }
  },
  {
    id: 'bio2024_011',
    module: 'ecology',
    pointId: 'ecosystem',
    type: 'fill-blank',
    difficulty: 3,
    content: '生态系统的组成成分包括：____、____、____和非生物的物质和能量。',
    options: ['生产者', '消费者'],
    answer: 0,
    explanation: '生态系统的四种组成成分：非生物的物质和能量（光、热、水、无机盐等）、生产者（自养生物，将无机物合成有机物）、消费者（异养生物，包括植食动物、肉食动物等）、分解者（将有机物分解为无机物）。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 3 }
  },
  {
    id: 'bio2024_012',
    module: 'physiology',
    pointId: 'hormone',
    type: 'fill-blank',
    difficulty: 3,
    content: '人体血糖调节中，能降低血糖浓度的激素是____，能升高血糖浓度的激素是____和肾上腺素。',
    options: ['胰岛素', '胰高血糖素'],
    answer: 0,
    explanation: '胰岛素由胰岛B细胞分泌，促进组织细胞摄取、利用和储存葡萄糖，抑制肝糖原分解和非糖物质转化，从而降低血糖。胰高血糖素由胰岛A细胞分泌，促进肝糖原分解和非糖物质转化，升高血糖。肾上腺素也能升高血糖浓度。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 3 }
  },

  // ---- 解答题（3道）----
  {
    id: 'bio2024_013',
    module: 'cell-biology',
    pointId: 'cell-division',
    type: 'solution',
    difficulty: 3,
    content: '下图为某生物细胞分裂过程中染色体数目变化曲线图（纵坐标为染色体数目，横坐标为时间）。请回答：（1）该细胞分裂方式是什么？判断依据是什么？（2）图中染色体数目减半发生在哪个时期？分析该时期染色体数目减半的原因。',
    options: [],
    answer: 0,
    explanation: '（1）有丝分裂。判断依据：该过程染色体数目先加倍（后期着丝粒分裂）后恢复为原数，子细胞染色体数目与亲代细胞相同，没有出现减半的减数分裂特征。（2）染色体数目减半发生在末期。原因：末期两个子细胞核形成后，细胞质分裂，一个细胞中的染色体平均分配到两个子细胞中，每个子细胞的染色体数目为原来的一半（恢复为体细胞染色体数）。注意在后期着丝粒分裂时染色体数目加倍，末期细胞分裂后子细胞染色体数恢复。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 3 }
  },
  {
    id: 'bio2024_014',
    module: 'genetics-evolution',
    pointId: 'mutation-evolution',
    type: 'solution',
    difficulty: 4,
    content: '某昆虫种群中，野生型为绿色，突变类型为褐色。调查发现，在森林中绿色个体占95%，褐色占5%；而在矿区（地表裸露，岩石呈褐色）中，绿色个体占20%，褐色占80%。（1）请用现代生物进化理论解释两种环境中体色频率差异的原因。（2）该种群是否发生了进化？如何判断？',
    options: [],
    answer: 0,
    explanation: '（1）差异原因：自然选择的作用。在森林环境中，绿色个体不易被天敌发现，存活率高，繁殖机会多；褐色个体易被捕食，存活率低。在矿区环境中，褐色个体具有保护色，更易生存繁殖；绿色个体暴露明显，易被捕食。自然选择使不同环境中各基因型个体的生存和繁殖能力不同，导致基因频率的定向改变。（2）判断是否发生进化：生物进化的实质是种群基因频率的改变。比较两个种群中控制体色的等位基因频率是否发生改变。如果两个种群中该等位基因的频率不同，说明发生了进化。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 4 }
  },
  {
    id: 'bio2024_015',
    module: 'biotechnology',
    pointId: 'cell-engineering',
    type: 'solution',
    difficulty: 4,
    content: '单克隆抗体制备技术在疾病诊断和治疗中有重要应用。请回答：（1）简述制备单克隆抗体的主要流程。（2）为什么单克隆抗体被称为"生物导弹"？在癌症治疗中如何发挥作用？',
    options: [],
    answer: 0,
    explanation: '（1）主要流程：①将抗原注入小鼠体内，使小鼠产生免疫应答，从其脾脏中获得能产生特定抗体的B淋巴细胞；②将B淋巴细胞与骨髓瘤细胞在聚乙二醇或灭活病毒诱导下融合；③用选择培养基（HAT培养基）筛选出杂交瘤细胞（既能无限增殖又能产生特定抗体）；④对杂交瘤细胞进行克隆化培养和抗体检测，筛选出能产生所需高特异性抗体的杂交瘤细胞；⑤将杂交瘤细胞在体外大规模培养或注入小鼠腹腔内生产单克隆抗体。（2）"生物导弹"：单克隆抗体具有高度特异性，能精确定位靶细胞（如肿瘤细胞）。在癌症治疗中，将药物（如放射性同位素、细胞毒素等）连接到单克隆抗体上，抗体可特异性识别并结合肿瘤细胞表面的抗原，将药物定向输送到肿瘤细胞，在不损伤正常细胞的情况下杀伤肿瘤细胞。这种靶向给药方式被称为"生物导弹"。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 4 }
  },

  // ===================================================================
  // 2025年（15题）
  // ===================================================================

  // ---- 选择题（8道）----
  {
    id: 'bio2025_001',
    module: 'molecular-biology',
    pointId: 'genetic-code',
    type: 'single-choice',
    difficulty: 1,
    content: '下列关于DNA和RNA的叙述，正确的是',
    options: [
      'DNA和RNA中的碱基种类完全相同',
      'DNA通常为双链结构，RNA通常为单链结构',
      'DNA含核糖，RNA含脱氧核糖',
      'DNA和RNA都能作为遗传物质直接指导蛋白质合成'
    ],
    answer: 1,
    explanation: 'DNA含碱基A、T、G、C，RNA含碱基A、U、G、C，二者不完全相同，A错误。DNA通常为双螺旋结构，RNA通常为单链，B正确。DNA含脱氧核糖，RNA含核糖，C说反了，错误。DNA为遗传物质（某些病毒以RNA为遗传物质），但直接指导蛋白质合成的是mRNA（RNA的一种），D错误。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 1 }
  },
  {
    id: 'bio2025_002',
    module: 'physiology',
    pointId: 'photosynthesis',
    type: 'single-choice',
    difficulty: 1,
    content: '植物进行光合作用时，释放的O2中的氧原子来源于',
    options: [
      'CO2',
      'H2O',
      'C6H12O6',
      'ATP'
    ],
    answer: 1,
    explanation: '光合作用中光反应阶段发生水的光解：2H2O → 4H+ + 4e- + O2，释放的O2中的氧原子全部来源于H2O。CO2中的氧原子进入有机物中。该结论最早由鲁宾和卡门用同位素标记法证明。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 1 }
  },
  {
    id: 'bio2025_003',
    module: 'genetics-evolution',
    pointId: 'mendel-genetics',
    type: 'single-choice',
    difficulty: 2,
    content: '基因型为AaBb的个体（两对基因独立遗传）产生的配子种类有',
    options: [
      '2种',
      '4种',
      '6种',
      '8种'
    ],
    answer: 1,
    explanation: '基因自由组合定律中，每对等位基因产生两种配子（A/a、B/b），两对独立遗传的基因产生的配子种类数为2×2=4种，配子类型为AB、Ab、aB、ab，比例为1:1:1:1。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'calc', difficultyStars: 2 }
  },
  {
    id: 'bio2025_004',
    module: 'ecology',
    pointId: 'population-ecology',
    type: 'single-choice',
    difficulty: 2,
    content: '下列关于种群密度调查方法的叙述，正确的是',
    options: [
      '标志重捕法适用于所有生物的种群密度调查',
      '样方法调查植物种群密度时，样方面积越大越好',
      '标志重捕法中，标志物应不易脱落且对动物无伤害',
      '调查活动能力强、活动范围大的动物时应用样方法'
    ],
    answer: 2,
    explanation: '标志重捕法适用于活动能力强、活动范围大的动物，不适用于植物或活动范围小的动物，A错误。样方面积应根据调查对象确定，并非越大越好，过大会增加工作量，B错误。标志重捕法中标志物应不易脱落且对动物无伤害，否则会影响实验结果，C正确。调查活动能力强、活动范围大的动物应用标志重捕法，D错误。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'experiment', difficultyStars: 2 }
  },
  {
    id: 'bio2025_005',
    module: 'cell-biology',
    pointId: 'cell-metabolism',
    type: 'single-choice',
    difficulty: 2,
    content: '下列关于ATP的叙述，错误的是',
    options: [
      'ATP是细胞生命活动的直接能源物质',
      'ATP分子中含有三个磷酸基团',
      'ATP与ADP的相互转化处于动态平衡中',
      '每个ATP分子中含有三个高能磷酸键'
    ],
    answer: 3,
    explanation: 'ATP（腺苷三磷酸）由1个腺苷和3个磷酸基团组成，含有2个高能磷酸键（不是三个），水解远离A的那个高能磷酸键释放能量。ATP是直接能源物质，通过ATP与ADP的快速相互转化为细胞供能，二者在细胞中保持动态平衡。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 2 }
  },
  {
    id: 'bio2025_006',
    module: 'genetics-evolution',
    pointId: 'dna-replication',
    type: 'single-choice',
    difficulty: 3,
    content: '将某双链DNA分子用15N标记全部碱基，置于含14N的培养液中复制3次，则子代DNA分子中含15N的分子数占总数的比例为',
    options: [
      '1/2',
      '1/4',
      '1/8',
      '1/16'
    ],
    answer: 1,
    explanation: 'DNA半保留复制：1个15N标记的DNA分子在14N环境中复制3次，得到8个DNA分子。其中含15N的分子只有最初的2条母链所在的2个DNA分子（每条链来自模板），所以含15N的DNA分子数为2，占比为2/8=1/4。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'calc', difficultyStars: 3 }
  },
  {
    id: 'bio2025_007',
    module: 'physiology',
    pointId: 'respiration',
    type: 'single-choice',
    difficulty: 3,
    content: '人在剧烈运动时，骨骼肌细胞呼吸的产物包括',
    options: [
      'CO2和H2O',
      '乳酸和CO2',
      '酒精和CO2',
      '乳酸、CO2和H2O'
    ],
    answer: 3,
    explanation: '剧烈运动时，骨骼肌细胞既进行有氧呼吸又进行无氧呼吸。有氧呼吸产物为CO2和H2O，无氧呼吸产物为乳酸（人体细胞无氧呼吸不产生酒精）。因此总产物包括乳酸、CO2和H2O。大量乳酸积累会导致肌肉酸痛。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'analysis', difficultyStars: 3 }
  },
  {
    id: 'bio2025_008',
    module: 'biotechnology',
    pointId: 'gene-engineering',
    type: 'single-choice',
    difficulty: 3,
    content: '在基因工程中，常用PCR技术扩增目的基因。下列关于PCR的叙述，错误的是',
    options: [
      'PCR需要已知目的基因两端的核苷酸序列来设计引物',
      'PCR过程中引物与模板链通过碱基互补配对结合',
      'PCR的每个循环包括变性、退火和延伸三个步骤',
      'PCR过程中使用的DNA聚合酶不需要耐高温'
    ],
    answer: 3,
    explanation: 'PCR（聚合酶链式反应）需要使用耐高温的DNA聚合酶（如Taq酶），因为PCR的变性步骤温度高达95度左右，普通DNA聚合酶在此温度下会变性失活。A正确：需要已知目的基因两端的序列来设计引物。B正确：引物通过碱基互补配对与模板结合。C正确：一个PCR循环包括变性（高温解链）、退火（引物结合）、延伸（合成新链）三步。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'experiment', difficultyStars: 3 }
  },

  // ---- 填空题（4道）----
  {
    id: 'bio2025_009',
    module: 'genetics-evolution',
    pointId: 'gene-expression',
    type: 'fill-blank',
    difficulty: 2,
    content: '在翻译过程中，携带氨基酸进入核糖体的是____，其分子结构一端是氨基酸结合位点，另一端是____区。',
    options: ['tRNA', '反密码子'],
    answer: 0,
    explanation: 'tRNA（转运RNA）在翻译中负责携带特定氨基酸进入核糖体。tRNA的一端有反密码子（3个碱基），与mRNA上的密码子碱基互补配对；另一端是氨基酸结合位点，与特定的氨基酸结合。tRNA的种类至少为61种。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 2 }
  },
  {
    id: 'bio2025_010',
    module: 'cell-biology',
    pointId: 'cell-structure',
    type: 'fill-blank',
    difficulty: 2,
    content: '真核细胞中，内质网分为____内质网（有核糖体附着）和____内质网（无核糖体附着）两种。',
    options: ['粗面', '滑面'],
    answer: 0,
    explanation: '粗面内质网上附着核糖体，主要参与蛋白质的合成和加工（折叠、糖基化等）。滑面内质网无核糖体附着，主要参与脂质合成、糖原代谢、钙离子储存和解毒等。两种内质网在结构和功能上有分工。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 2 }
  },
  {
    id: 'bio2025_011',
    module: 'ecology',
    pointId: 'community',
    type: 'fill-blank',
    difficulty: 3,
    content: '群落演替的类型根据起始条件不同，分为____演替（在无植被的区域发生）和____演替（在原有植被但已破坏的区域发生）。',
    options: ['初生', '次生'],
    answer: 0,
    explanation: '初生演替发生在从未有过植被覆盖或原来被彻底消灭了植被的区域（如裸岩、沙丘），过程缓慢。次生演替发生在原有植被虽已不存在但土壤条件基本保留的区域（如弃耕农田、砍伐后的森林），过程较快。一般来说，次生演替比初生演替速度快。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 3 }
  },
  {
    id: 'bio2025_012',
    module: 'physiology',
    pointId: 'immunity',
    type: 'fill-blank',
    difficulty: 3,
    content: '在体液免疫中，B细胞被活化后增殖分化为____（产生抗体）和____（在再次免疫中快速响应）。',
    options: ['浆细胞', '记忆B细胞'],
    answer: 0,
    explanation: '体液免疫中，B细胞在抗原刺激和辅助T细胞作用下活化，增殖分化为浆细胞（效应B细胞）和记忆B细胞。浆细胞产生和分泌抗体，发挥体液免疫效应；记忆B细胞长期存在，再次接触相同抗原时快速增殖分化为浆细胞，产生更快更强的二次免疫反应。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 3 }
  },

  // ---- 解答题（3道）----
  {
    id: 'bio2025_013',
    module: 'physiology',
    pointId: 'nerve-regulation',
    type: 'solution',
    difficulty: 3,
    content: '某研究小组用蛙的坐骨神经-腓肠肌标本进行实验，在神经上给予不同强度的电刺激，记录肌肉收缩的强度变化。结果发现：当给予的刺激强度小于阈值时，肌肉不收缩；达到阈值后，肌肉收缩强度不随刺激强度增加而增加。请回答：（1）该现象体现了什么生理学原理？请解释其机制。（2）如果改用直接刺激肌肉的方式，实验结果可能有何不同？',
    options: [],
    answer: 0,
    explanation: '（1）该现象体现了神经纤维传导的"全或无"原理。机制：神经纤维上的动作电位具有全或无特性——当刺激强度低于阈值时，不能引发动作电位，肌肉不收缩；当刺激强度达到或超过阈值时，会引发一个最大幅度的动作电位，动作电位的大小不随刺激强度的增大而增大，因此神经传导到神经末梢释放的乙酰胆碱量恒定，肌肉收缩强度不变。（2）直接刺激肌肉时，肌肉细胞膜（肌纤维）也有阈值，但一块肌肉由多个运动单位组成，各运动单位的阈值不同。因此直接刺激时，随刺激强度增大，被激活的运动单位数增多，肌肉收缩强度可以表现为分级变化（即随着刺激强度增加而增强），与神经纤维的全无反应不同。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 3 }
  },
  {
    id: 'bio2025_014',
    module: 'genetics-evolution',
    pointId: 'mutation-evolution',
    type: 'solution',
    difficulty: 4,
    content: '抗生素的广泛使用导致耐药菌不断出现。金黄色葡萄球菌对青霉素的耐药性就是一个典型例子。请回答：（1）从进化的角度分析细菌耐药性产生的原因。（2）面对日益严重的细菌耐药性问题，在临床用药和公共卫生方面应采取措施？',
    options: [],
    answer: 0,
    explanation: '（1）细菌耐药性产生的进化机制：细菌种群中本来就存在少数具有耐药性基因的突变个体（基因突变是不定向的）。抗生素的使用起到了选择作用——敏感菌被大量杀死，而耐药菌存活下来并继续繁殖，将耐药基因传给后代。经过多代选择，耐药菌在种群中的比例逐渐增大。这就是自然选择在微观层面的体现。（2）应对措施：临床方面——严格遵医嘱使用抗生素，不使用广谱抗生素时优先选用窄谱抗生素，足疗程用药避免耐药菌存活；不滥用抗生素（如不用于病毒性感染）。科研方面——开发新型抗生素和抗菌策略（如噬菌体疗法、抗菌肽等）。公共卫生方面——加强耐药菌监测，制定抗生素使用指南，加强公众宣传教育。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 4 }
  },
  {
    id: 'bio2025_015',
    module: 'physiology',
    pointId: 'photosynthesis',
    type: 'solution',
    difficulty: 4,
    content: '研究者将大豆植株分别置于两种CO2浓度（400ppm和800ppm）条件下培养，在相同光照和温度条件下测定其光合速率。结果显示：在800ppm CO2条件下，大豆的光合速率显著高于400ppm条件。（1）从光合作用过程分析高CO2浓度促进光合速率的机制。（2）长期高CO2浓度下，植物光合速率可能出现"驯化"现象（即光合速率逐渐下降），请分析可能原因。',
    options: [],
    answer: 0,
    explanation: '（1）高CO2浓度促进光合速率的机制：CO2是光合作用暗反应阶段的重要底物，参与CO2固定（与RuBP结合生成3-磷酸甘油酸）。高CO2浓度提高了CO2固定速率，促进更多C3生成，在充足的ATP和NADPH供应下，C3被还原为糖类等有机物，从而提高净光合速率。同时高CO2浓度可以抑制光呼吸（Rubisco的加氧反应），进一步提高光合效率。（2）长期驯化原因：①高CO2浓度下植物叶片中淀粉积累过多，可能通过反馈抑制降低光合相关酶（如Rubisco）的活性或表达量；②长期高CO2导致气孔导度降低，蒸腾作用减弱，叶片温度升高，可能影响光合酶活性；③植物在高CO2环境下减少了Rubisco等光合酶的投资，将更多资源分配到其他方面，导致叶片光合能力下调。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 4 }
  },

  // ===================================================================
  // 2026年（15题）
  // ===================================================================

  // ---- 选择题（8道）----
  {
    id: 'bio2026_001',
    module: 'cell-biology',
    pointId: 'cell-structure',
    type: 'single-choice',
    difficulty: 1,
    content: '下列关于细胞核的叙述，正确的是',
    options: [
      '细胞核是细胞代谢的主要场所',
      '核膜是单层膜结构',
      '核仁与核糖体的形成有关',
      '染色质和染色体是不同物质'
    ],
    answer: 2,
    explanation: '细胞核是遗传信息库，是细胞代谢和遗传的控制中心，但细胞代谢的主要场所是细胞质基质，A错误。核膜是双层膜结构，外膜与内质网相连，B错误。核仁与rRNA的合成和核糖体的形成有关，C正确。染色质和染色体是同一物质在细胞不同时期的两种形态——染色质（间期）和染色体（分裂期），成分都是DNA和蛋白质，D错误。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 1 }
  },
  {
    id: 'bio2026_002',
    module: 'cell-biology',
    pointId: 'cell-metabolism',
    type: 'single-choice',
    difficulty: 1,
    content: '下列关于物质跨膜运输的叙述，正确的是',
    options: [
      '自由扩散不需要载体蛋白，但需要消耗能量',
      '协助扩散需要载体蛋白，且需要消耗能量',
      '主动运输需要载体蛋白，需要消耗能量',
      '胞吞和胞吐属于被动运输'
    ],
    answer: 2,
    explanation: '自由扩散不需要载体蛋白和能量，A错误。协助扩散需要载体蛋白但不需要消耗能量，B错误。主动运输需要载体蛋白和能量，可逆浓度梯度运输物质，C正确。胞吞和胞吐需要消耗能量，属于主动运输（非被动运输），D错误。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 1 }
  },
  {
    id: 'bio2026_003',
    module: 'genetics-evolution',
    pointId: 'mendel-genetics',
    type: 'single-choice',
    difficulty: 2,
    content: '人类红绿色盲是X染色体隐性遗传病。一对表现型正常的夫妇，生了一个色觉正常的女儿和一个红绿色盲的儿子。则该夫妇的基因型分别是（相关基因用B/b表示）',
    options: [
      'XBY和XBXB',
      'XBY和XBXb',
      'XbY和XbXb',
      'XbY和XBXb'
    ],
    answer: 1,
    explanation: '红绿色盲为X染色体隐性遗传（Xb）。儿子色盲，基因型为XbY，说明其Xb来自母亲，母亲为携带者（XBXb）。父亲色觉正常，基因型为XBY。女儿色觉正常（XBX_），可能为XBXB或XBXb。表现型正常的夫妇的基因型为XBY和XBXb。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'calc', difficultyStars: 2 }
  },
  {
    id: 'bio2026_004',
    module: 'ecology',
    pointId: 'ecosystem',
    type: 'single-choice',
    difficulty: 2,
    content: '在生态系统中，碳循环的主要形式是',
    options: [
      '以单质形式在大气和生物之间循环',
      '以CO2形式在大气和生物之间循环',
      '以碳酸盐形式在水体和生物之间循环',
      '以有机物形式在生物之间传递'
    ],
    answer: 1,
    explanation: '碳在无机环境中的主要存在形式是CO2和碳酸盐，在生物群落中以含碳有机物形式存在。碳循环的主要形式是CO2：大气中的CO2通过光合作用进入生物群落，通过呼吸作用、分解作用和燃烧释放CO2返回大气。大气CO2库是碳循环的关键环节。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'process', difficultyStars: 2 }
  },
  {
    id: 'bio2026_005',
    module: 'molecular-biology',
    pointId: 'enzyme',
    type: 'single-choice',
    difficulty: 2,
    content: '某同学设计了如下实验：在4支试管中分别加入等量的H2O2溶液，然后分别加入蒸馏水、FeCl3溶液、新鲜肝脏研磨液和煮熟的肝脏研磨液。观察气泡产生速率。该实验的目的是',
    options: [
      '探究温度对过氧化氢酶活性的影响',
      '探究pH对过氧化氢酶活性的影响',
      '探究酶的高效性和酶的活性受温度影响',
      '探究酶的专一性'
    ],
    answer: 2,
    explanation: '该实验设置了三组对照：蒸馏水（空白对照）、FeCl3（无机催化剂，与酶比较高效性）、新鲜肝脏研磨液（含过氧化氢酶）、煮熟的肝脏研磨液（高温使酶失活，探究温度对酶活性的影响）。因此实验目的为探究酶的高效性以及酶的活性受温度影响。A控制温度变量不充分，B未设置不同pH组，D未设置不同底物组。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'experiment', difficultyStars: 2 }
  },
  {
    id: 'bio2026_006',
    module: 'cell-biology',
    pointId: 'cell-division',
    type: 'single-choice',
    difficulty: 3,
    content: '下图表示某动物细胞分裂过程中一条染色体上DNA含量的变化。在bc段，细胞内发生的主要变化是',
    options: [
      'DNA复制',
      '着丝粒分裂',
      '染色体移向两极',
      '细胞质分裂'
    ],
    answer: 0,
    explanation: '以一条染色体上DNA含量的变化曲线分析：间期（ab段）DNA复制前，一条染色体含1个DNA；bc段DNA复制完成，一条染色体含2个DNA（含两条染色单体）；cd段着丝粒分裂，姐妹染色单体分开，DNA含量从2降至1；de段为细胞分裂完成。因此bc段为DNA复制时期（S期）。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'analysis', difficultyStars: 3 }
  },
  {
    id: 'bio2026_007',
    module: 'physiology',
    pointId: 'hormone',
    type: 'single-choice',
    difficulty: 3,
    content: '冬泳爱好者在寒冷水中游泳时，体内发生的生理调节不包括',
    options: [
      '皮肤血管收缩，减少散热',
      '甲状腺激素分泌增加，促进产热',
      '汗腺分泌增加，增加散热',
      '骨骼肌不自主战栗，增加产热'
    ],
    answer: 2,
    explanation: '寒冷刺激时，人体通过神经-体液调节维持体温稳定：皮肤血管收缩减少散热（A正确）；甲状腺激素和肾上腺素分泌增加，促进代谢产热（B正确）；骨骼肌战栗增加产热（D正确）。寒冷环境下汗腺分泌减少（不是增加），减少蒸发散热，C错误。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'analysis', difficultyStars: 3 }
  },
  {
    id: 'bio2026_008',
    module: 'genetics-evolution',
    pointId: 'gene-expression',
    type: 'single-choice',
    difficulty: 3,
    content: '下列关于表观遗传学的叙述，错误的是',
    options: [
      '表观遗传修饰不改变DNA的碱基序列',
      'DNA甲基化和组蛋白修饰是常见的表观遗传机制',
      '表观遗传修饰可以遗传给后代',
      '表观遗传现象只发生在胚胎发育早期'
    ],
    answer: 3,
    explanation: '表观遗传学是指DNA序列不发生变化但基因表达和表型发生可遗传改变的机制。A正确：不改变碱基序列。B正确：DNA甲基化（抑制基因表达）和组蛋白修饰（乙酰化促进表达、甲基化双重作用）是重要机制。C正确：表观遗传修饰可经减数分裂传递给后代。D错误：表观遗传现象在个体各阶段均可发生（如细胞分化、衰老、X染色体失活等），不仅限于胚胎发育期。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'concept', difficultyStars: 3 }
  },

  // ---- 填空题（4道）----
  {
    id: 'bio2026_009',
    module: 'molecular-biology',
    pointId: 'protein-synthesis',
    type: 'fill-blank',
    difficulty: 2,
    content: '基因表达中，转录的产物是____，翻译的产物是____。',
    options: ['mRNA', '蛋白质'],
    answer: 0,
    explanation: '转录是以DNA为模板合成RNA的过程，主要产物是mRNA（此外还有tRNA、rRNA等）。翻译是以mRNA为模板合成蛋白质的过程，产物是蛋白质（多肽链）。二者统称为基因的表达。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 2 }
  },
  {
    id: 'bio2026_010',
    module: 'cell-biology',
    pointId: 'cell-signaling',
    type: 'fill-blank',
    difficulty: 2,
    content: '信号分子与受体结合后，在细胞内产生一系列信号传递和放大的过程称为____，最终引起细胞特定的____。',
    options: ['信号转导', '生理效应'],
    answer: 0,
    explanation: '信号转导是指细胞外信号（配体）与受体结合后，通过细胞内一系列蛋白质的相互作用和磷酸化级联反应，将信号传递并放大的过程。最终引起细胞特定的生理效应，如基因表达改变、细胞增殖、分化等。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 2 }
  },
  {
    id: 'bio2026_011',
    module: 'ecology',
    pointId: 'biodiversity',
    type: 'fill-blank',
    difficulty: 3,
    content: '保护生物多样性的主要措施包括：____保护（如建立自然保护区）和____保护（如建立植物园、动物园）。',
    options: ['就地', '迁地'],
    answer: 0,
    explanation: '保护生物多样性的主要措施：就地保护（in situ conservation）是建立自然保护区，保护物种及其栖息地，是最有效的保护方式。迁地保护（ex situ conservation）是在人工环境中保护物种，如植物园、动物园、种子库等，适用于濒危物种或在原栖息地受到严重威胁的情况。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 3 }
  },
  {
    id: 'bio2026_012',
    module: 'biotechnology',
    pointId: 'microbiology',
    type: 'fill-blank',
    difficulty: 3,
    content: '微生物实验室常用的无菌操作技术包括____（杀灭物体表面微生物）、____（杀灭所有微生物及其芽孢）等。',
    options: ['消毒', '灭菌'],
    answer: 0,
    explanation: '消毒是指用物理或化学方法杀死物体表面或环境中的病原微生物，但不一定杀死芽孢和非病原微生物（如酒精消毒、巴氏消毒）。灭菌是指用强烈的理化方法杀死所有微生物（包括芽孢）的过程，常用方法有高压蒸汽灭菌、灼烧灭菌、干热灭菌等。无菌操作的核心是防止杂菌污染。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'fill-blank', difficultyStars: 3 }
  },

  // ---- 解答题（3道）----
  {
    id: 'bio2026_013',
    module: 'genetics-evolution',
    pointId: 'gene-expression',
    type: 'solution',
    difficulty: 3,
    content: '研究发现，同一生物体中不同类型的细胞在结构和功能上存在显著差异，但它们都源自同一个受精卵，具有相同的核DNA。请回答：（1）导致细胞分化的根本原因是什么？（2）已分化的细胞是否具有全能性？请举例说明。',
    options: [],
    answer: 0,
    explanation: '（1）细胞分化的根本原因是基因的选择性表达。不同类型的细胞虽然核DNA完全相同，但表达的基因种类不同，因此合成的蛋白质不同，表现出不同的形态、结构和功能。例如，胰岛B细胞表达胰岛素基因，但不表达血红蛋白基因；红细胞表达血红蛋白基因，但不表达胰岛素基因。（2）已分化的细胞在一定条件下具有全能性。植物细胞全能性高——胡萝卜韧皮部细胞经组织培养可发育成完整植株。动物细胞核具有全能性——核移植实验（如多莉羊的培育）证明已分化的哺乳动物体细胞核保留了全套遗传信息，可支持发育成完整个体。但动物体细胞本身的全能性随分化程度提高而受到限制。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 3 }
  },
  {
    id: 'bio2026_014',
    module: 'physiology',
    pointId: 'nerve-regulation',
    type: 'solution',
    difficulty: 4,
    content: '某人因意外导致脊髓在胸椎水平横断（受损），出现截瘫。请回答：（1）该患者是否还能感知下肢的触觉和疼痛？是否能主动控制下肢运动？请从神经通路的角度解释。（2）该患者的排尿反射是否还能完成？是否能有意识地控制排尿？说明原因。',
    options: [],
    answer: 0,
    explanation: '（1）不能感知下肢感觉，也不能主动控制下肢运动。原因：脊髓是连接大脑和躯干四肢的神经通路。胸椎横断后，脊髓的上下传导束被切断。来自下肢的感觉信号无法上传到大脑皮层感觉中枢，因此患者没有触觉和痛觉意识。大脑皮层运动中枢发出的指令也无法下传到下肢运动神经元，因此下肢失去随意运动能力。（2）排尿反射（骶髓反射）的反射弧完整，脊髓骶段的初级排尿中枢仍能完成反射，因此膀胱充盈时仍可发生反射性排尿。但患者不能有意识地控制排尿，因为大脑皮层发出的抑制/兴奋信号无法通过脊髓下传到初级排尿中枢，失去了高级中枢对低级中枢的调控，出现尿失禁。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 4 }
  },
  {
    id: 'bio2026_015',
    module: 'ecology',
    pointId: 'ecosystem',
    type: 'solution',
    difficulty: 4,
    content: '某草原生态系统多年保持稳定。近年来，由于气候干旱和过度放牧，草原出现退化和沙化趋势。请回答：（1）从生态系统的稳定性角度分析该草原退化的原因。（2）提出恢复该草原生态系统的具体措施，并从生态学原理角度说明其依据。',
    options: [],
    answer: 0,
    explanation: '（1）原因分析：生态系统的抵抗力稳定性有一定限度。气候干旱（非生物因素改变）和过度放牧（人为干扰）超出了该草原生态系统的自我调节能力，导致生产者（牧草）数量减少，土壤结构破坏，水土流失加剧，形成恶性循环。物种多样性下降，食物网简化，生态系统的抵抗力稳定性进一步减弱，最终导致草原退化和沙化。（2）恢复措施及生态学原理：①围栏封育——减少放牧压力，让草原自然恢复（利用生态系统的恢复力稳定性）。②合理轮牧和确定载畜量——控制放牧强度在生态系统承载力范围内（遵循生态工程的协调原理）。③补播优良牧草——增加生产者种类和数量，提高物种多样性（遵循物种多样性原理），加速群落演替。④施肥和灌溉——补充土壤N、P等养分和水分（遵循物质循环和能量流动原理），促进牧草生长。⑤引入适应当地的深根系植物——固沙固土，改善土壤结构。草原恢复需要长期、综合的生态治理措施。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'solution', difficultyStars: 4 }
  }
];
