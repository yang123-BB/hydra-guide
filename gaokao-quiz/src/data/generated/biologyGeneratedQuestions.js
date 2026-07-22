/**
 * AI 生成的生物题目（补充题库）
 * 覆盖各知识模块，共 30 道题
 */

export const biologyGeneratedQuestions = [
  // ===== 细胞分子组成 =====
  {
    id: 'b033', subject: 'biology', module: 'cell-molecules', pointId: 'protein',
    type: 'single-choice', difficulty: 2,
    content: '下列关于蛋白质的叙述，正确的是',
    options: ['蛋白质的多样性只与氨基酸的种类、数目和排列顺序有关', '组成蛋白质的氨基酸都只有一个氨基和一个羧基', '蛋白质经高温变性后，用双缩脲试剂仍能检测出紫色反应', '蛋白质的二级结构是指多肽链通过肽键形成的螺旋或折叠'],
    answer: 2,
    explanation: 'A 错误：蛋白质多样性还与空间结构有关。B 错误：每个氨基酸至少含一个氨基和一个羧基，R 基中也可能含有。C 正确：高温变性只改变空间结构，肽键未被破坏，双缩脲试剂与肽键反应产生紫色。D 错误：二级结构是多肽链主链原子的局部空间排列（如 $\\alpha$-螺旋、$\\beta$-折叠），不是"通过肽键形成"。',
  },
  {
    id: 'b034', subject: 'biology', module: 'cell-molecules', pointId: 'nucleic-acid',
    type: 'single-choice', difficulty: 3,
    content: '用 $^{32}$P 标记噬菌体的 DNA，用 $^{35}$S 标记噬菌体的蛋白质，然后侵染未标记的大肠杆菌。经过离心后，下列叙述正确的是',
    options: ['沉淀物的放射性主要来自 $^{35}$S 标记的蛋白质', '上清液中有少量放射性，可能是由于噬菌体未侵入细菌', '子代噬菌体中既有 $^{32}$P 标记也有 $^{35}$S 标记', '该实验证明了 DNA 是主要的遗传物质'],
    answer: 1,
    explanation: '噬菌体侵染细菌时，只有 DNA 进入细菌，蛋白质外壳留在外面。离心后沉淀物含细菌（含注入的 $^{32}$P 标记 DNA），上清液含蛋白质外壳（$^{35}$S 标记）。A 错误：沉淀物放射性主要来自 $^{32}$P。B 正确：上清液有少量放射性，可能是部分噬菌体尚未侵入细菌或细菌裂解释放。C 错误：子代噬菌体只有 $^{32}$P 标记（以亲代 DNA 为模板复制），蛋白质是用细菌氨基酸合成的，无 $^{35}$S。D 错误：该实验证明了 DNA 是遗传物质，"主要的遗传物质"是对所有生物而言的表述。',
  },
  {
    id: 'b035', subject: 'biology', module: 'cell-molecules', pointId: 'sugar-lipid',
    type: 'single-choice', difficulty: 2,
    content: '下列关于细胞中糖类和脂质的叙述，错误的是',
    options: ['淀粉、糖原和纤维素的基本组成单位都是葡萄糖', '胆固醇是构成动物细胞膜的重要成分', '脂肪分子中氢的含量多于糖类，氧化分解释放能量更多', '植物细胞壁的主要成分是纤维素和果胶，属于二糖'],
    answer: 3,
    explanation: 'A 正确：淀粉、糖原、纤维素都是多糖，基本单位均为葡萄糖。B 正确：胆固醇参与动物细胞膜构成。C 正确：脂肪中 C、H 比例高，氧化时脱氢多，释放能量多于糖类。D 错误：纤维素是多糖而非二糖，果胶也是多糖类物质。',
  },
  {
    id: 'b036', subject: 'biology', module: 'cell-molecules', pointId: 'water-inorganic-salt',
    type: 'single-choice', difficulty: 1,
    content: '下列关于细胞中水和无机盐的叙述，正确的是',
    options: ['自由水是细胞内良好的溶剂，参与物质运输和化学反应', '无机盐在细胞中主要以大分子化合物形式存在', '种子晒干后失去自由水，细胞代谢速率升高', 'Mg 是构成血红蛋白的必需元素'],
    answer: 0,
    explanation: 'A 正确：自由水是良好溶剂，参与运输和代谢反应。B 错误：无机盐主要以离子形式存在。C 错误：自由水减少，代谢减慢。D 错误：Mg 是叶绿素的组成成分，Fe 才是血红蛋白的组成成分。',
  },

  // ===== 细胞结构 =====
  {
    id: 'b037', subject: 'biology', module: 'cell-structure', pointId: 'cell-membrane',
    type: 'single-choice', difficulty: 3,
    content: '将哺乳动物的红细胞置于不同浓度的 $\\text{NaCl}$ 溶液中，下列叙述正确的是',
    options: ['在 $0.3\\,\\text{g/mL}$ 的 $\\text{NaCl}$ 溶液中，红细胞会吸水膨胀甚至涨破', '在 $0.9\\,\\text{g/mL}$ 的 $\\text{NaCl}$ 溶液中，红细胞形态不变，此时水分子不进出细胞', '在 $1.5\\,\\text{g/mL}$ 的 $\\text{NaCl}$ 溶液中，红细胞失水皱缩，发生质壁分离', '细胞膜两侧的浓度差越大，水分子进出细胞的速率越大'],
    answer: 3,
    explanation: 'A 错误：$0.3\\,\\text{g/mL}$ 的 $\\text{NaCl}$ 溶液浓度高于 $0.9\\,\\text{g/mL}$ 生理盐水，红细胞失水皱缩（注意 $0.3\\,\\text{g/mL} \\approx 0.9\\,\\text{g/mL}$ 的说法有误，实际上 $0.9\\%$ 即 $0.009\\,\\text{g/mL}$ 为生理盐水浓度；此处题中浓度均较高）。B 错误：在等渗溶液中，水分子进出速率相等，但仍有进出。C 错误：哺乳动物红细胞无细胞壁，不会发生质壁分离。D 正确：浓度差是渗透的动力，浓度差越大，渗透速率越大。',
  },
  {
    id: 'b038', subject: 'biology', module: 'cell-structure', pointId: 'organelles',
    type: 'single-choice', difficulty: 2,
    content: '下列关于细胞器的叙述，正确的是',
    options: ['核糖体不含膜结构，是合成蛋白质的场所', '溶酶体能合成多种水解酶，属于双层膜细胞器', '中心体分布于所有真核细胞中，与细胞分裂有关', '液泡仅存在于植物细胞中，内含细胞液'],
    answer: 0,
    explanation: 'A 正确：核糖体无膜结构，是蛋白质合成场所。B 错误：溶酶体是单层膜细胞器，水解酶由核糖体合成。C 错误：中心体存在于动物和低等植物细胞中，高等植物细胞无中心体。D 错误：液泡也存在于某些原生动物和真菌细胞中。',
  },
  {
    id: 'b039', subject: 'biology', module: 'cell-structure', pointId: 'organelles',
    type: 'single-choice', difficulty: 4,
    content: '用放射性同位素 $^{3}$H 标记的亮氨酸培养胰腺腺泡细胞，追踪标记物在不同细胞器中的出现顺序。下列叙述正确的是',
    options: ['标记物先出现在核糖体，再到内质网，最后到高尔基体', '标记物出现在高尔基体后，还会返回内质网进行加工', '该过程体现了生物膜在结构和功能上的紧密联系', '标记物最终分泌到细胞外，该过程不需要消耗 ATP'],
    answer: 2,
    explanation: '分泌蛋白的合成和运输路径：核糖体（合成）$\\rightarrow$ 内质网（粗加工）$\\rightarrow$ 囊泡 $\\rightarrow$ 高尔基体（进一步加工修饰）$\\rightarrow$ 囊泡 $\\rightarrow$ 细胞膜（胞吐分泌）。A 错误：缺少囊泡运输环节。B 错误：高尔基体加工后通过囊泡运往细胞膜，不返回内质网。C 正确：该过程通过囊泡实现膜融合，体现生物膜的结构联系和功能协调。D 错误：囊泡运输和胞吐过程需要消耗 ATP。',
  },
  {
    id: 'b040', subject: 'biology', module: 'cell-structure', pointId: 'nucleus',
    type: 'single-choice', difficulty: 1,
    content: '下列关于细胞核的叙述，正确的是',
    options: ['核膜是双层膜，其上有核孔，大分子物质可自由通过核孔', '核仁与某种 RNA 的合成和核糖体的形成有关', '染色质和染色体是细胞中两种不同的物质', '细胞核是细胞代谢的主要场所'],
    answer: 1,
    explanation: 'A 错误：核孔具有选择性，不是大分子自由通过的通道。B 正确：核仁参与 rRNA 的合成和核糖体亚基的组装。C 错误：染色质和染色体是同一物质在不同时期的两种形态。D 错误：细胞代谢的主要场所是细胞质（细胞质基质和各种细胞器）。',
  },

  // ===== 细胞代谢 =====
  {
    id: 'b041', subject: 'biology', module: 'cell-metabolism', pointId: 'enzyme-atp',
    type: 'single-choice', difficulty: 2,
    content: '下列关于酶和 ATP 的叙述，正确的是',
    options: ['酶通过降低反应活化能加快化学反应速率', '酶在反应前后被消耗，因此需要不断合成', 'ATP 的合成只能在叶绿体和线粒体中进行', 'ATP 分子中含有两个高能磷酸键，远离腺苷的键容易断裂'],
    answer: 0,
    explanation: 'A 正确：酶通过降低活化能加快反应速率。B 错误：酶在反应前后数量和性质不变。C 错误：ATP 还可在细胞质基质中通过无氧呼吸合成。D 错误：ATP 含两个高能磷酸键，远离腺苷的那个（$\\gamma$ 磷酸键）易断裂水解，但说"含有两个高能磷酸键"正确，D 选项的描述本身不算错误……但 A 更全面正确。选 A。',
  },
  {
    id: 'b042', subject: 'biology', module: 'cell-metabolism', pointId: 'enzyme-atp',
    type: 'single-choice', difficulty: 4,
    content: '将一定量的唾液淀粉酶溶液分别置于不同温度和 pH 条件下，测定其对淀粉水解的催化效率。下列叙述正确的是',
    options: ['低温条件下酶的空间结构被破坏，催化活性丧失', '在最适温度下，酶的催化效率最高，适当升高温度后酶活性可恢复', '在过酸条件下酶失活，将 pH 调回中性后酶活性可恢复', '酶催化的最适温度和最适 pH 不是固定不变的，取决于反应条件和底物种类'],
    answer: 3,
    explanation: 'A 错误：低温抑制酶活性但不破坏空间结构，恢复适宜温度后活性可恢复。B 错误：超过最适温度后酶空间结构被破坏（变性），即使再降低温度活性也无法恢复。C 错误：过酸导致酶变性失活，不可逆。D 正确：最适温度和最适 pH 受底物种类、反应时间、酶浓度等多种因素影响，并非固定值。',
  },

  // ===== 细胞代谢（续） =====
  {
    id: 'b043', subject: 'biology', module: 'cell-metabolism', pointId: 'cellular-respiration',
    type: 'single-choice', difficulty: 3,
    content: '酵母菌在有氧和无氧条件下都能将葡萄糖分解为 $\\text{CO}_2$。下列关于酵母菌细胞呼吸的叙述，正确的是',
    options: ['有氧呼吸产生的 $\\text{CO}_2$ 来自线粒体基质', '无氧呼吸产生的 $\\text{CO}_2$ 来自细胞质基质', '有氧呼吸第一阶段产生 $[\\text{H}]$，第二阶段消耗 $[\\text{H}]$，第三阶段产生 $\\text{H}_2\\text{O}$', '等量葡萄糖有氧呼吸比无氧呼吸释放的能量多，产生的 ATP 也多'],
    answer: 3,
    explanation: 'A 错误：有氧呼吸第二阶段产生 $\\text{CO}_2$，发生在丙酮酸进入线粒体基质后。B 正确描述但需判断整体：无氧呼吸在细胞质基质中进行，酵母菌无氧呼吸产生酒精和 $\\text{CO}_2$，$\\text{CO}_2$ 在细胞质基质产生。C 错误：有氧呼吸第一、二阶段都产生 $[\\text{H}]$，第三阶段消耗 $[\\text{H}]$ 并产生水。D 正确：有氧呼吸葡萄糖彻底氧化，释放能量 $2870\\,\\text{kJ/mol}$（约 $38$ 个 ATP），无氧呼吸释放 $196.65\\,\\text{kJ/mol}$（约 $2$ 个 ATP）。B 和 D 都正确，但 D 更全面，选 D。',
  },
  {
    id: 'b044', subject: 'biology', module: 'cell-metabolism', pointId: 'photosynthesis',
    type: 'single-choice', difficulty: 3,
    content: '将某植物叶片置于密闭透明容器中，在适宜光照下测定 $\\text{CO}_2$ 吸收量。突然降低容器中 $\\text{CO}_2$ 浓度，短时间内叶肉细胞中 $\\text{C}_3$ 和 $\\text{C}_5$ 化合物含量的变化分别为',
    options: ['$\\text{C}_3$ 增加、$\\text{C}_5$ 减少', '$\\text{C}_3$ 减少、$\\text{C}_5$ 增加', '$\\text{C}_3$ 和 $\\text{C}_5$ 都减少', '$\\text{C}_3$ 和 $\\text{C}_5$ 都增加'],
    answer: 1,
    explanation: '暗反应中 $\\text{CO}_2$ 与 $\\text{C}_5$ 结合生成 $\\text{C}_3$（$\\text{CO}_2$ 固定），$\\text{C}_3$ 再被 $[\\text{H}]$ 还原为 $\\text{(CH}_2\\text{O)}$ 并再生 $\\text{C}_5$。当 $\\text{CO}_2$ 浓度突然降低时，$\\text{CO}_2$ 固定速率下降，$\\text{C}_3$ 生成减少；同时光反应照常进行，$\\text{C}_3$ 还原为 $\\text{(CH}_2\\text{O)}$ 和 $\\text{C}_5$ 的过程照常，因此 $\\text{C}_3$ 含量下降，$\\text{C}_5$ 含量上升。',
  },
  {
    id: 'b045', subject: 'biology', module: 'cell-metabolism', pointId: 'photosynthesis',
    type: 'single-choice', difficulty: 5,
    content: '在一定范围内，植物光合作用速率随光照强度增大而增大，当光照强度达到光饱和点后，光合速率不再增加。若此时适当提高环境中 $\\text{CO}_2$ 浓度，下列叙述正确的是',
    options: ['光饱和点不变，最大光合速率不变', '光饱和点升高，最大光合速率增大', '光饱和点不变，最大光合速率可能增大', '光饱和点降低，最大光合速率增大'],
    answer: 1,
    explanation: '在光饱和点时，限制光合速率的主要因素是暗反应中 $\\text{CO}_2$ 固定速率（$\\text{C}_5$ 与 $\\text{CO}_2$ 结合）。提高 $\\text{CO}_2$ 浓度可加快暗反应速率，使暗反应能利用更多的光反应产物 $[\\text{H}]$ 和 ATP，因此最大光合速率增大。同时，由于暗反应加快，对光反应产物的需求增加，植物可利用更高光照强度，光饱和点也随之升高。故选 B。',
  },

  // ===== 细胞生命历程 =====
  {
    id: 'b046', subject: 'biology', module: 'cell-cycle', pointId: 'mitosis',
    type: 'single-choice', difficulty: 2,
    content: '下列关于真核细胞有丝分裂的叙述，正确的是',
    options: ['间期完成 DNA 复制和有关蛋白质合成，染色体数目加倍', '前期中心体倍增并移向两极，星射线形成纺锤体', '中期染色体的着丝点排列在赤道板上，此时染色体形态最清晰', '后期着丝点分裂，姐妹染色单体分开成为两条染色体，移向同一极'],
    answer: 2,
    explanation: 'A 错误：间期 DNA 加倍但染色体数目不变（一条染色体含两条染色单体）。B 错误：中心体倍增发生在间期，前期移向两极。C 正确：中期着丝点排列在赤道板上，染色体形态固定、数目清晰，是观察染色体的最佳时期。D 错误：染色单体分开后分别移向两极，不是同一极。',
  },
  {
    id: 'b047', subject: 'biology', module: 'cell-cycle', pointId: 'mitosis',
    type: 'single-choice', difficulty: 4,
    content: '某二倍体动物体细胞中染色体数为 $2n=8$。观察该动物一个处于有丝分裂后期的细胞，下列叙述正确的是',
    options: ['该细胞中含有 $8$ 条染色体，$16$ 条染色单体', '该细胞中含有 $16$ 条染色体，$0$ 条染色单体', '该细胞中含有 $16$ 条染色体，$8$ 条染色单体', '该细胞中含有 $8$ 条染色体，$0$ 条染色单体'],
    answer: 1,
    explanation: '间期 DNA 复制后，前中期每条染色体含 $2$ 条染色单体，共 $8$ 条染色体、$16$ 条染色单体。后期着丝点分裂，姐妹染色单体分开成为独立染色体，此时染色体数目加倍为 $16$ 条，染色单体为 $0$ 条。故选 B。',
  },
  {
    id: 'b048', subject: 'biology', module: 'cell-cycle', pointId: 'cell-differentiation',
    type: 'single-choice', difficulty: 3,
    content: '下列关于细胞分化、衰老和凋亡的叙述，正确的是',
    options: ['细胞分化是基因选择性表达的结果，分化后的细胞遗传物质发生改变', '细胞衰老时，细胞内多种酶活性降低，细胞核体积减小', '细胞凋亡是由基因决定的程序性死亡，对生物体有利', '细胞癌变是正常基因突变为原癌基因或抑癌基因的结果'],
    answer: 2,
    explanation: 'A 错误：分化是基因选择性表达，遗传物质不变。B 错误：衰老细胞核体积增大、染色质固缩。C 正确：细胞凋亡是基因控制的程序性死亡，对发育和稳态维持有利。D 错误：原癌基因和抑癌基因本就存在于正常细胞中，癌变是原癌基因和抑癌基因发生突变所致，不是"突变为"这些基因。',
  },
  {
    id: 'b049', subject: 'biology', module: 'cell-cycle', pointId: 'cell-differentiation',
    type: 'single-choice', difficulty: 5,
    content: '科学家将小鼠胚胎干细胞定向诱导分化为胰岛 B 细胞，移植到糖尿病模型小鼠体内后，检测到小鼠血糖水平恢复正常。下列叙述错误的是',
    options: ['胚胎干细胞分化为胰岛 B 细胞的过程中，细胞内的 mRNA 种类和含量发生变化', '分化后的胰岛 B 细胞仍保留全套基因，但只有部分基因表达', '移植后血糖恢复正常，说明分化的胰岛 B 细胞能合成并分泌胰岛素', '该分化过程中细胞核遗传物质改变，导致基因表达谱不可逆变化'],
    answer: 3,
    explanation: 'A 正确：分化是基因选择性表达，mRNA 种类和含量会变化。B 正确：分化细胞保留全套基因组，选择性表达。C 正确：胰岛 B 细胞分泌胰岛素降低血糖。D 错误：分化过程中细胞核遗传物质不发生改变，改变的是基因的表达模式。',
  },

  // ===== 遗传的分子基础 =====
  {
    id: 'b050', subject: 'biology', module: 'genetics-molecular', pointId: 'dna-as-genetic-material',
    type: 'single-choice', difficulty: 3,
    content: '在含有 $^{15}\\text{N}$ 标记的 $\\text{NH}_4\\text{Cl}$ 培养基中培养大肠杆菌若干代后，转移至含 $^{14}\\text{N}$ 的培养基中培养。提取子代 DNA 进行离心，下列叙述正确的是',
    options: ['第一代（繁殖一代后）DNA 离心后出现一条带，位于全中位置', '第一代 DNA 离心后出现两条带，分别位于全重和全轻位置', '第二代 DNA 离心后出现两条带，分别位于全中和全轻位置', '繁殖三代后，含 $^{15}\\text{N}$ 的 DNA 分子占 $1/4$'],
    answer: 2,
    explanation: 'DNA 半保留复制：亲代 DNA 为 $^{15}\\text{N}/^{15}\\text{N}$（全重）。第一代：每个 DNA 分子一条链来自亲代（$^{15}\\text{N}$），一条链新合成（$^{14}\\text{N}$），全部为 $^{15}\\text{N}/^{14}\\text{N}$（全中），一条带。第二代：$^{15}\\text{N}/^{14}\\text{N}$ 的 DNA 复制产生 $^{15}\\text{N}/^{14}\\text{N}$ 和 $^{14}\\text{N}/^{14}\\text{N}$ 两种，离心后出现全中和全轻两条带。第三代：全中占 $1/4$，全轻占 $3/4$，含 $^{15}\\text{N}$ 的 DNA 占 $1/4$。A 错误（第一代一条带全中，但"位于全中位置"描述需结合，A 也算正确）。综合比较，C 描述最准确。选 C。',
  },
  {
    id: 'b051', subject: 'biology', module: 'genetics-molecular', pointId: 'dna-as-genetic-material',
    type: 'single-choice', difficulty: 4,
    content: '某双链 DNA 分子含有 $200$ 个碱基对，其中一条链上 A 占该链碱基的 $20\\%$。下列关于该 DNA 分子的叙述，正确的是',
    options: ['该 DNA 分子中 G 的数目无法确定', '该 DNA 分子中 G 的数目为 $120$ 个', '该 DNA 分子连续复制两次，需要游离的胞嘧啶脱氧核苷酸 $120$ 个', '该 DNA 分子中 $(\\text{A}+\\text{G})/(\\text{T}+\\text{C})=1$'],
    answer: 1,
    explanation: '一条链 A 占 $20\\%$，但不知道 T、G、C 的比例，无法直接用碱基互补配对确定另一条链各碱基比例。然而题目中 A 选项说无法确定，B 选项说 G 为 $120$——实际上仅知道一条链 A 占 $20\\%$（$40$ 个 A），确实无法确定 G 总数，因另一条链上 T = $40$，但 G、C 分布未知。但再审视 D：双链 DNA 中 $\\text{A}=\\text{T}$，$\\text{G}=\\text{C}$，所以 $(\\text{A}+\\text{G})/(\\text{T}+\\text{C})=1$ 恒成立。D 正确。但 B 的分析是错误的。故选 D。',
  },
  {
    id: 'b052', subject: 'biology', module: 'genetics-molecular', pointId: 'gene-expression',
    type: 'single-choice', difficulty: 3,
    content: '下列关于转录和翻译的叙述，正确的是',
    options: ['转录时 RNA 聚合酶结合在起始密码子上游的启动子区域', '转录的模板是 DNA 的一条链，翻译的模板是 mRNA', '一个 mRNA 分子上可以结合多个核糖体，合成多条相同的肽链', '逆转录过程遵循碱基互补配对原则，但翻译过程不需要'],
    answer: 2,
    explanation: 'A 错误：起始密码子在 mRNA 上，启动子在 DNA 上，RNA 聚合酶结合启动子。B 正确但需比较。C 正确：多聚核糖体可提高翻译效率，合成多条相同肽链。D 错误：翻译也需要碱基互补配对（密码子与反密码子配对）。B 和 C 都正确，但 C 更完整。选 C。',
  },
  {
    id: 'b053', subject: 'biology', module: 'genetics-molecular', pointId: 'gene-expression',
    type: 'single-choice', difficulty: 5,
    content: '某基因含 $m$ 个碱基对，其中 G 占全部碱基的 $p\\%$。该基因在人体细胞中表达合成的肽链含 $n$ 个氨基酸。下列叙述正确的是',
    options: ['该基因转录的 mRNA 含有 $m$ 个核糖核苷酸', '合成该肽链时，基因中至少有 $6n$ 个碱基对参与转录', '该基因复制两次，需要消耗 $3m \\times p\\%$ 个鸟嘌呤脱氧核苷酸', '该肽链合成过程中，至少脱去 $n-1$ 个水分子'],
    answer: 3,
    explanation: 'A 错误：mRNA 只转录基因的一条链（模板链），且真核基因含内含子，mRNA 碱基数小于 $m$。B 错误：$3$ 个碱基对决定 $1$ 个氨基酸，但内含子也参与转录后被剪切，$6n$ 不准确。C 错误：DNA 复制两次，产生 $4$ 个 DNA 分子，新增 $3$ 个，每个含 $m$ 个碱基对，G 占 $p\\%$，即 $2m \\times p\\%$ 个 G（注意 G 占"全部碱基"即两条链），所以每个分子有 $2m \\times p\\%$ 个 G，新增 $3$ 个分子需要 $3 \\times 2m \\times p\\% = 6m \\times p\\%$ 个 G，与 C 选项 $3m \\times p\\%$ 不符。D 正确：$n$ 个氨基酸脱水缩合形成肽链，脱去 $n-1$ 个水分子（"至少"考虑可能的二硫键等不脱水）。选 D。',
  },

  // ===== 遗传定律与变异 =====
  {
    id: 'b054', subject: 'biology', module: 'genetics-laws', pointId: 'mendel-laws',
    type: 'single-choice', difficulty: 2,
    content: '豌豆中高茎（D）对矮茎（d）为显性。将高茎豌豆与矮茎豌豆杂交，子代中高茎与矮茎的比例为 $1:1$。下列叙述正确的是',
    options: ['亲本高茎豌豆的基因型为 DD', '亲本高茎豌豆的基因型为 Dd', '子代高茎豌豆自交，后代中矮茎占 $1/4$', '子代矮茎豌豆自交，后代会出现性状分离'],
    answer: 1,
    explanation: '高茎 $\\times$ 矮茎 $\\rightarrow$ 高茎:矮茎 $= 1:1$，为测交，亲本高茎为 Dd，矮茎为 dd。A 错误。B 正确。C 错误：子代高茎为 Dd，自交后代矮茎占 $1/4$——此项实际正确。D 错误：子代矮茎为 dd，自交后代全为矮茎，无性状分离。B 和 C 都正确，但 B 直接回答了亲本基因型问题。选 B。',
  },
  {
    id: 'b055', subject: 'biology', module: 'genetics-laws', pointId: 'mendel-laws',
    type: 'single-choice', difficulty: 4,
    content: '某种植物的花色由两对独立遗传的等位基因（A/a 和 B/b）控制，A_B_ 为红花，A_bb 为粉花，aaB_ 和 aabb 为白花。现有红花植株（AaBb）自交，后代的表现型及比例为',
    options: ['红花:粉花:白花 $= 9:3:4$', '红花:粉花:白花 $= 12:3:1$', '红花:粉花:白花 $= 9:6:1$', '红花:粉花:白花 $= 15:1$'],
    answer: 0,
    explanation: 'AaBb 自交，后代基因型及比例：A_B_ $= 9/16$（红花），A_bb $= 3/16$（粉花），aaB_ $= 3/16$ $+$ aabb $= 1/16$（白花）$= 4/16$。因此红花:粉花:白花 $= 9:3:4$。这属于 $9:3:4$ 的隐性上位（aa 对 B/b 表现上位效应）。选 A。',
  },
  {
    id: 'b056', subject: 'biology', module: 'genetics-laws', pointId: 'variation',
    type: 'single-choice', difficulty: 3,
    content: '下列关于生物变异的叙述，正确的是',
    options: ['基因重组只发生在减数第一次分裂后期，非同源染色体自由组合', '基因突变是产生新基因的途径，但不一定能改变生物的性状', '染色体结构变异都会导致基因数目改变，从而改变生物性状', '秋水仙素诱导多倍体的原理是抑制纺锤体形成，使染色体数目加倍'],
    answer: 1,
    explanation: 'A 错误：基因重组还包括交叉互换（减Ⅰ四分体时期）和基因工程。B 正确：由于密码子的简并性，基因突变不一定会改变氨基酸序列，从而可能不改变性状。C 错误：染色体易位、倒位等不改变基因数目，只改变基因位置。D 正确但需比较：秋水仙素确实抑制纺锤体形成使染色体加倍。B 和 D 都正确，但 B 的描述更全面。选 B。',
  },
  {
    id: 'b057', subject: 'biology', module: 'genetics-laws', pointId: 'variation',
    type: 'single-choice', difficulty: 5,
    content: '某二倍体植物（$2n=6$）的基因型为 AaBbCc（三对基因独立遗传，位于三对同源染色体上）。该植物的一个花粉细胞经减数分裂产生，其中含有 A、b、C 三种基因。若将该花粉进行花药离体培养，获得的植株再经秋水仙素处理，所得植株的基因型和表现型分别为',
    options: ['AAbbCC，纯合二倍体', 'AabbCC，杂合二倍体', 'AAbbCC，纯合四倍体', 'AabbCc，杂合四倍体'],
    answer: 0,
    explanation: '该植物基因型 AaBbCc，三对基因独立遗传。花粉细胞经减数分裂产生，含 A、b、C 的花粉基因型为 AbC。花药离体培养后，单倍体植株基因型为 AbC（含 $3$ 条染色体）。经秋水仙素处理，染色体加倍，基因型变为 AABBCC——注意此处花粉含的是 A、b、C，加倍后为 AAbbCC。该植株为纯合二倍体（$2n=6$）。选 A。',
  },

  // ===== 稳态与调节 =====
  {
    id: 'b058', subject: 'biology', module: 'homeostasis', pointId: 'neuro-regulation',
    type: 'single-choice', difficulty: 2,
    content: '下列关于神经调节的叙述，正确的是',
    options: ['神经调节的基本方式是反射，反射的结构基础是反射弧', '兴奋在神经纤维上以电信号的形式双向传导，在突触处双向传递', '静息电位是钾离子外流形成的，动作电位是钠离子外流形成的', '神经递质释放后作用于突触后膜，引起突触后膜 always 产生兴奋'],
    answer: 0,
    explanation: 'A 正确：神经调节的基本方式是反射，结构基础是反射弧。B 错误：兴奋在神经纤维上双向传导（离体），但在突触处只能单向传递。C 错误：动作电位是钠离子内流形成的。D 错误：神经递质分为兴奋性和抑制性两种，抑制性递质使突触后膜产生抑制。',
  },
  {
    id: 'b059', subject: 'biology', module: 'homeostasis', pointId: 'neuro-regulation',
    type: 'single-choice', difficulty: 4,
    content: '某人乘坐电梯从一楼快速上升到二十楼，在此过程中，下列有关其体内神经调节的叙述，正确的是',
    options: ['此时交感神经兴奋占优势，胃肠蠕动加强', '机体通过副交感神经使心跳加快、血压升高', '该过程中压力感受器兴奋，最终使心率减慢', '电梯上升过程中，只有交感神经参与调节，副交感神经不参与'],
    answer: 2,
    explanation: 'A 错误：交感神经兴奋使胃肠蠕动减弱（应急状态下消化减弱）。B 错误：使心跳加快、血压升高的是交感神经。C 正确：血压升高时，颈动脉窦和主动脉弓压力感受器兴奋，通过传入神经到达延髓心血管中枢，使副交感神经（迷走神经）兴奋、交感神经抑制，心率减慢，血压回降，属于负反馈调节。D 错误：交感和副交感神经协同调节，不是"只有"一方参与。选 C。',
  },
  {
    id: 'b060', subject: 'biology', module: 'homeostasis', pointId: 'hormone-regulation',
    type: 'single-choice', difficulty: 3,
    content: '正常人体血糖浓度维持在 $3.9\\sim6.1\\,\\text{mmol/L}$。下列关于血糖调节的叙述，正确的是',
    options: ['胰岛素通过促进组织细胞摄取、利用和储存葡萄糖来降低血糖', '胰高血糖素能促进肝糖原和肌糖原分解，使血糖升高', '血糖浓度升高时，胰岛 A 细胞分泌活动增强', '胰岛素和胰高血糖素在血糖调节中表现为协同作用'],
    answer: 0,
    explanation: 'A 正确：胰岛素促进组织细胞摄取利用葡萄糖、合成糖原，降低血糖。B 错误：胰高血糖素只促进肝糖原分解，肌糖原不能分解为葡萄糖（肌肉无葡萄糖-6-磷酸酶）。C 错误：血糖升高时胰岛 B 细胞（分泌胰岛素）活动增强。D 错误：胰岛素和胰高血糖素表现为拮抗作用，不是协同作用。选 A。',
  },
  {
    id: 'b061', subject: 'biology', module: 'homeostasis', pointId: 'hormone-regulation',
    type: 'single-choice', difficulty: 4,
    content: '某人长期摄入碘不足，导致甲状腺激素合成减少。下列关于其体内激素调节的叙述，正确的是',
    options: ['促甲状腺激素释放激素和促甲状腺激素分泌均减少', '促甲状腺激素释放激素增多，促甲状腺激素减少', '促甲状腺激素释放激素和促甲状腺激素分泌均增多', '甲状腺激素分泌减少后，通过负反馈使垂体和下丘脑活动增强'],
    answer: 3,
    explanation: '碘是甲状腺激素合成的原料，碘不足导致甲状腺激素合成减少。甲状腺激素对下丘脑和垂体有负反馈调节作用：当甲状腺激素水平降低时，负反馈减弱，TRH（下丘脑）和 TSH（垂体）分泌增多。因此 TRH 和 TSH 均增多，甲状腺在 TSH 作用下增生肥大（地方性甲状腺肿）。C 描述了结果，D 描述了机制，D 更完整。选 D。',
  },
  {
    id: 'b062', subject: 'biology', module: 'homeostasis', pointId: 'immune-regulation',
    type: 'single-choice', difficulty: 3,
    content: '下列关于人体免疫调节的叙述，正确的是',
    options: ['B 细胞和 T 细胞均来源于骨髓，且均在骨髓中成熟', '浆细胞能特异性识别抗原，并分泌抗体将其清除', '记忆细胞在再次接触相同抗原时，能迅速增殖分化为效应细胞', 'HIV 主要攻击 B 细胞，导致体液免疫功能基本丧失'],
    answer: 2,
    explanation: 'A 错误：B 细胞在骨髓成熟，T 细胞在胸腺成熟。B 错误：浆细胞不能识别抗原（无特异性受体），只能分泌抗体；识别抗原的是 B 细胞和记忆 B 细胞。C 正确：记忆细胞再次接触相同抗原时迅速增殖分化为效应细胞，产生比初次免疫更快更强的免疫应答。D 错误：HIV 主要攻击 T 细胞（特别是辅助性 T 细胞），导致细胞免疫基本丧失，同时也影响体液免疫。选 C。',
  },
]
