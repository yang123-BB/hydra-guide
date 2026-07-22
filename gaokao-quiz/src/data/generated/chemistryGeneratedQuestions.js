/**
 * AI 生成的化学题目（补充题库）
 * 覆盖各知识模块，共 30 道题
 */

export const chemistryGeneratedQuestions = [
  // ===== 化学计量学 =====
  {
    id: 'c033', subject: 'chemistry', module: 'stoichiometry', pointId: 'amount-of-substance',
    type: 'single-choice', difficulty: 1,
    content: '设 $N_A$ 为阿伏加德罗常数的值，下列说法正确的是',
    options: [
      '$0.5\\,\\text{mol}$ $H_2O$ 中含有 $0.5N_A$ 个水分子',
      '$1\\,\\text{mol}$ $O_2$ 中含有 $N_A$ 个氧原子',
      '$2\\,\\text{g}$ $H_2$ 中含有 $2N_A$ 个氢分子',
      '$1\\,\\text{mol}$ $H_2SO_4$ 中含有 $N_A$ 个氧原子',
    ],
    answer: 0,
    explanation: 'A 选项：$0.5\\,\\text{mol}$ 水分子数为 $0.5N_A$，正确。B 选项：$1\\,\\text{mol}$ $O_2$ 含 $2\\,\\text{mol}$ 氧原子，即 $2N_A$ 个，错误。C 选项：$2\\,\\text{g}$ $H_2$ 的物质的量 $n = \\frac{2}{2} = 1\\,\\text{mol}$，含 $N_A$ 个 $H_2$ 分子，错误。D 选项：$1\\,\\text{mol}$ $H_2SO_4$ 含 $4\\,\\text{mol}$ 氧原子，即 $4N_A$ 个，错误。',
  },
  {
    id: 'c034', subject: 'chemistry', module: 'stoichiometry', pointId: 'gas-molar-volume',
    type: 'single-choice', difficulty: 2,
    content: '标准状况下，将 $V\\,\\text{L}$ 氯化氢气体溶于水配成 $500\\,\\text{mL}$ 盐酸溶液，所得盐酸的物质的量浓度为',
    options: [
      '$\\frac{V}{11.2}\\,\\text{mol/L}$',
      '$\\frac{V}{22.4}\\,\\text{mol/L}$',
      '$\\frac{V}{5.6}\\,\\text{mol/L}$',
      '$\\frac{V}{44.8}\\,\\text{mol/L}$',
    ],
    answer: 0,
    explanation: '标准状况下 $HCl$ 气体的物质的量 $n(HCl) = \\frac{V}{22.4}\\,\\text{mol}$。溶液体积 $V_{\\text{溶液}} = 500\\,\\text{mL} = 0.5\\,\\text{L}$。物质的量浓度 $c = \\frac{n}{V_{\\text{溶液}}} = \\frac{V/22.4}{0.5} = \\frac{V}{11.2}\\,\\text{mol/L}$。',
  },
  {
    id: 'c035', subject: 'chemistry', module: 'stoichiometry', pointId: 'concentration',
    type: 'single-choice', difficulty: 3,
    content: '用 $18\\,\\text{mol/L}$ 的浓硫酸配制 $500\\,\\text{mL}$ $2\\,\\text{mol/L}$ 的稀硫酸，所需浓硫酸的体积约为',
    options: [
      '$27.8\\,\\text{mL}$',
      '$55.6\\,\\text{mL}$',
      '$13.9\\,\\text{mL}$',
      '$83.3\\,\\text{mL}$',
    ],
    answer: 1,
    explanation: '根据稀释前后溶质的物质的量不变：$c_1 V_1 = c_2 V_2$。所需稀硫酸中 $H_2SO_4$ 的物质的量 $n = 2 \\times 0.5 = 1\\,\\text{mol}$。所需浓硫酸体积 $V_1 = \\frac{n}{c_1} = \\frac{1}{18} \\approx 0.0556\\,\\text{L} = 55.6\\,\\text{mL}$。',
  },
  {
    id: 'c036', subject: 'chemistry', module: 'stoichiometry', pointId: 'equation-balancing',
    type: 'single-choice', difficulty: 4,
    content: '反应 $a\\,FeS_2 + b\\,O_2 \\rightarrow c\\,Fe_2O_3 + d\\,SO_2$ 中，$a + b$ 的值为',
    options: ['$12$', '$13$', '$14$', '$15$'],
    answer: 3,
    explanation: '用化合价升降法配平。$Fe$ 从 $+2$ 升到 $+3$，每个 $Fe$ 失 $1$ 个电子；$S$ 从 $-1$ 升到 $+4$，每个 $S$ 失 $5$ 个电子。每个 $FeS_2$ 共失 $1 + 2 \\times 5 = 11$ 个电子。$O$ 从 $0$ 降到 $-2$，每个 $O_2$ 得 $4$ 个电子。电子守恒：$11a = 4b$，即 $a:b = 4:11$。代入方程：$4FeS_2 + 11O_2 \\rightarrow 2Fe_2O_3 + 8SO_2$，验证 $Fe$、$S$、$O$ 均守恒。$a + b = 4 + 11 = 15$。',
  },

  // ===== 离子反应与氧化还原 =====
  {
    id: 'c037', subject: 'chemistry', module: 'ionic-redox', pointId: 'ion-coexistence',
    type: 'single-choice', difficulty: 2,
    content: '下列各组离子在溶液中能大量共存的是',
    options: [
      '$H^+$、$Fe^{2+}$、$NO_3^-$、$Cl^-$',
      '$K^+$、$Na^+$、$HCO_3^-$、$OH^-$',
      '$Ba^{2+}$、$K^+$、$NO_3^-$、$Cl^-$',
      '$Ag^+$、$NH_4^+$、$OH^-$、$NO_3^-$',
    ],
    answer: 2,
    explanation: 'A 选项：$H^+$ 与 $NO_3^-$ 形成 $HNO_3$，具有强氧化性，会将 $Fe^{2+}$ 氧化为 $Fe^{3+}$，不能共存。B 选项：$HCO_3^-$ 与 $OH^-$ 反应生成 $CO_3^{2-}$ 和 $H_2O$，不能共存。C 选项：四种离子间不反应，可大量共存，正确。D 选项：$Ag^+$ 与 $OH^-$ 反应生成沉淀，$NH_4^+$ 与 $OH^-$ 反应生成 $NH_3 \\cdot H_2O$，不能共存。',
  },
  {
    id: 'c038', subject: 'chemistry', module: 'ionic-redox', pointId: 'ionic-equation',
    type: 'single-choice', difficulty: 3,
    content: '下列离子方程式书写正确的是',
    options: [
      '铁与稀硫酸反应：$Fe + 2H^+ = Fe^{2+} + H_2\\uparrow$',
      '铜与稀硝酸反应：$Cu + 2H^+ = Cu^{2+} + H_2\\uparrow$',
      '石灰石与盐酸反应：$CO_3^{2-} + 2H^+ = CO_2\\uparrow + H_2O$',
      '氢氧化钠溶液与醋酸反应：$H^+ + OH^- = H_2O$',
    ],
    answer: 0,
    explanation: 'A 选项：铁与稀硫酸反应生成 $Fe^{2+}$ 和 $H_2$，离子方程式正确。B 选项：铜不与非氧化性酸反应，铜与稀硝酸反应的产物是 $Cu(NO_3)_2$、$NO$ 和 $H_2O$，不是 $H_2$，错误。C 选项：$CaCO_3$ 难溶于水，应写化学式，不能拆成 $CO_3^{2-}$，错误。D 选项：醋酸（$CH_3COOH$）是弱酸，不能拆成 $H^+$，应写为 $CH_3COOH + OH^- = CH_3COO^- + H_2O$，错误。',
  },
  {
    id: 'c039', subject: 'chemistry', module: 'ionic-redox', pointId: 'redox-concepts',
    type: 'single-choice', difficulty: 1,
    content: '下列反应中，不属于氧化还原反应的是',
    options: [
      '$2Na + Cl_2 = 2NaCl$',
      '$CaO + H_2O = Ca(OH)_2$',
      '$2H_2 + O_2 = 2H_2O$',
      '$Fe + CuSO_4 = FeSO_4 + Cu$',
    ],
    answer: 1,
    explanation: '判断氧化还原反应的依据是是否有元素化合价的升降。A 选项：$Na$ 从 $0$ 到 $+1$，$Cl$ 从 $0$ 到 $-1$，是氧化还原反应。B 选项：$CaO + H_2O = Ca(OH)_2$，各元素化合价不变（$Ca$ 为 $+2$，$O$ 为 $-2$，$H$ 为 $+1$），不是氧化还原反应，属于化合反应。C 选项：$H$ 从 $0$ 到 $+1$，$O$ 从 $0$ 到 $-2$，是氧化还原反应。D 选项：$Fe$ 从 $0$ 到 $+2$，$Cu$ 从 $+2$ 到 $0$，是氧化还原反应。',
  },
  {
    id: 'c040', subject: 'chemistry', module: 'ionic-redox', pointId: 'redox-balancing',
    type: 'single-choice', difficulty: 5,
    content: '反应 $3Cl_2 + 6NaOH \\xrightarrow{\\Delta} 5NaCl + NaClO_3 + 3H_2O$ 中，被氧化的氯与被还原的氯的物质的量之比为',
    options: ['$1:5$', '$5:1$', '$1:1$', '$2:3$'],
    answer: 0,
    explanation: '分析化合价变化：$Cl_2$ 中 $Cl$ 化合价为 $0$。产物中 $NaCl$ 的 $Cl$ 为 $-1$ 价（被还原），$NaClO_3$ 的 $Cl$ 为 $+5$ 价（被氧化）。由方程式知，生成 $5\\,\\text{mol}$ $NaCl$（被还原的 $Cl$ 为 $5\\,\\text{mol}$）和 $1\\,\\text{mol}$ $NaClO_3$（被氧化的 $Cl$ 为 $1\\,\\text{mol}$）。也可从电子守恒验证：被氧化的 $Cl$ 失电子 $1 \\times 5 = 5$ 个，被还原的 $Cl$ 得电子 $5 \\times 1 = 5$ 个，得失相等。故被氧化与被还原的氯的物质的量之比为 $1:5$。',
  },

  // ===== 金属及其化合物 =====
  {
    id: 'c041', subject: 'chemistry', module: 'metals', pointId: 'sodium-compounds',
    type: 'single-choice', difficulty: 2,
    content: '下列关于 $Na_2O_2$ 的说法正确的是',
    options: [
      '$Na_2O_2$ 中氧元素的化合价为 $-2$',
      '$Na_2O_2$ 是碱性氧化物',
      '$Na_2O_2$ 与水反应生成 $NaOH$ 和 $O_2$',
      '$Na_2O_2$ 与 $CO_2$ 反应时仅作氧化剂',
    ],
    answer: 2,
    explanation: 'A 选项：$Na_2O_2$ 是过氧化物，氧元素化合价为 $-1$，错误。B 选项：碱性氧化物是与酸反应只生成盐和水的氧化物，$Na_2O_2$ 与酸反应还生成 $H_2O_2$ 或 $O_2$，不是碱性氧化物，而是过氧化物，错误。C 选项：$2Na_2O_2 + 2H_2O = 4NaOH + O_2\\uparrow$，正确。D 选项：$2Na_2O_2 + 2CO_2 = 2Na_2CO_3 + O_2$，$Na_2O_2$ 中一个 $O$ 从 $-1$ 降到 $-2$（被还原），另一个 $O$ 从 $-1$ 升到 $0$（被氧化），$Na_2O_2$ 既作氧化剂又作还原剂，错误。',
  },
  {
    id: 'c042', subject: 'chemistry', module: 'metals', pointId: 'sodium-compounds',
    type: 'single-choice', difficulty: 4,
    content: '将一小块金属钠投入 $FeCl_3$ 溶液中，不可能观察到的现象是',
    options: [
      '钠浮在液面上熔成闪亮小球',
      '钠球在液面上游动，发出嘶嘶声',
      '溶液中产生红褐色沉淀',
      '钠与 $Fe^{3+}$ 直接反应析出铁',
    ],
    answer: 3,
    explanation: '钠投入 $FeCl_3$ 溶液中，钠先与水反应（钠的密度比水小、熔点低，故浮在液面熔成小球并游动，发出嘶嘶声）：$2Na + 2H_2O = 2NaOH + H_2\\uparrow$。生成的 $NaOH$ 与 $FeCl_3$ 反应产生红褐色沉淀：$Fe^{3+} + 3OH^- = Fe(OH)_3\\downarrow$。钠不会与 $Fe^{3+}$ 直接发生置换反应析出铁，因为钠极其活泼，优先与水反应，故 D 选项所述现象不可能发生。',
  },
  {
    id: 'c043', subject: 'chemistry', module: 'metals', pointId: 'aluminum-compounds',
    type: 'single-choice', difficulty: 3,
    content: '向 $AlCl_3$ 溶液中逐滴加入 $NaOH$ 溶液至过量，下列叙述正确的是',
    options: [
      '先产生白色沉淀，后沉淀逐渐溶解',
      '一直产生白色沉淀，不溶解',
      '先无沉淀，后产生白色沉淀',
      '沉淀先溶解，后产生',
    ],
    answer: 0,
    explanation: '向 $AlCl_3$ 溶液中滴加 $NaOH$ 溶液，先生成白色沉淀：$Al^{3+} + 3OH^- = Al(OH)_3\\downarrow$。$Al(OH)_3$ 是两性氢氧化物，当 $NaOH$ 过量时沉淀溶解：$Al(OH)_3 + OH^- = AlO_2^- + 2H_2O$。因此现象为先产生白色沉淀，后沉淀逐渐溶解，A 选项正确。',
  },
  {
    id: 'c044', subject: 'chemistry', module: 'metals', pointId: 'iron-compounds',
    type: 'single-choice', difficulty: 4,
    content: '下列关于铁的化合物的说法正确的是',
    options: [
      '$FeO$ 是红棕色粉末',
      '$Fe(OH)_3$ 在空气中易被还原为 $Fe(OH)_2$',
      '$Fe^{3+}$ 遇 $KSCN$ 溶液变血红色',
      '$Fe^{2+}$ 遇 $NaOH$ 溶液立即产生红褐色沉淀',
    ],
    answer: 2,
    explanation: 'A 选项：$FeO$ 是黑色粉末，$Fe_2O_3$ 才是红棕色，错误。B 选项：实际是 $Fe(OH)_2$（白色）在空气中易被氧化为 $Fe(OH)_3$（红褐色），即 $4Fe(OH)_2 + O_2 + 2H_2O = 4Fe(OH)_3$，选项将氧化还原方向写反，错误。C 选项：$Fe^{3+}$ 与 $SCN^-$ 反应生成血红色配合物 $[Fe(SCN)]^{2+}$，是检验 $Fe^{3+}$ 的特征反应，正确。D 选项：$Fe^{2+}$ 与 $NaOH$ 反应先生成白色 $Fe(OH)_2$ 沉淀，随后在空气中逐渐氧化为红褐色 $Fe(OH)_3$，并非立即产生红褐色沉淀，错误。',
  },

  // ===== 非金属及其化合物 =====
  {
    id: 'c045', subject: 'chemistry', module: 'nonmetals', pointId: 'halogen',
    type: 'single-choice', difficulty: 1,
    content: '下列关于卤素的说法正确的是',
    options: [
      '卤素单质的氧化性：$F_2 > Cl_2 > Br_2 > I_2$',
      '卤素单质在常温下均为气态',
      '卤素离子的还原性：$F^- > Cl^- > Br^- > I^-$',
      '碘化钾溶液能使淀粉变蓝',
    ],
    answer: 0,
    explanation: 'A 选项：卤素单质氧化性随原子序数增大而减弱，$F_2 > Cl_2 > Br_2 > I_2$，正确。B 选项：$Br_2$ 常温下为液态，$I_2$ 为固态，错误。C 选项：卤素离子的还原性与单质氧化性相反，$I^- > Br^- > Cl^- > F^-$，错误。D 选项：使淀粉变蓝的是 $I_2$（碘单质），而非 $I^-$，错误。',
  },
  {
    id: 'c046', subject: 'chemistry', module: 'nonmetals', pointId: 'halogen',
    type: 'single-choice', difficulty: 1,
    content: '下列物质能使湿润的淀粉碘化钾试纸变蓝的是',
    options: ['盐酸', '溴水', '碘化钾溶液', '食盐水'],
    answer: 1,
    explanation: '湿润的淀粉碘化钾试纸中含有 $KI$ 和淀粉。能使试纸变蓝的物质需具有足够强的氧化性，能将 $I^-$ 氧化为 $I_2$，$I_2$ 遇淀粉变蓝。溴水中的 $Br_2$ 能将 $I^-$ 氧化：$Br_2 + 2I^- = 2Br^- + I_2$，生成的 $I_2$ 使淀粉变蓝。盐酸、碘化钾溶液和食盐水均不具备此氧化性，不能使试纸变蓝。',
  },
  {
    id: 'c047', subject: 'chemistry', module: 'nonmetals', pointId: 'sulfur-nitrogen',
    type: 'single-choice', difficulty: 4,
    content: '将 $SO_2$ 通入 $BaCl_2$ 溶液中未见沉淀；再通入足量氯水后加入 $BaCl_2$ 溶液，产生白色沉淀。关于该实验的说法正确的是',
    options: [
      '第一步中 $SO_2$ 与 $BaCl_2$ 直接反应产生 $BaSO_3$ 沉淀',
      '第二步产生的白色沉淀是 $BaSO_3$',
      '第二步反应中 $SO_2$ 被还原',
      '第二步产生的白色沉淀不溶于稀盐酸',
    ],
    answer: 3,
    explanation: '第一步：$SO_2$ 通入 $BaCl_2$ 溶液，$SO_2 + H_2O \\rightleftharpoons H_2SO_3$，$H_2SO_3$ 是弱酸，即使生成 $BaSO_3$ 也会溶于生成的盐酸中，故无沉淀，A 错误。第二步：氯水将 $SO_2$（$S$ 为 $+4$ 价）氧化为 $SO_4^{2-}$（$S$ 为 $+6$ 价），$SO_2$ 被氧化而非被还原，C 错误。$Ba^{2+} + SO_4^{2-} = BaSO_4\\downarrow$，白色沉淀是 $BaSO_4$ 而非 $BaSO_3$，B 错误。$BaSO_4$ 不溶于稀盐酸，D 正确。',
  },
  {
    id: 'c048', subject: 'chemistry', module: 'nonmetals', pointId: 'sulfur-nitrogen',
    type: 'single-choice', difficulty: 5,
    content: '标准状况下，将 $NO$、$NO_2$、$O_2$ 混合后充满一容器，将其倒置于水槽中，充分反应后水充满容器，则原混合气体中 $NO$、$NO_2$、$O_2$ 的体积比可能是',
    options: ['$1:1:1$', '$1:2:1$', '$2:1:1$', '$1:1:2$'],
    answer: 0,
    explanation: '水充满容器说明所有气体被完全吸收。涉及的化学反应：$4NO + 3O_2 + 2H_2O = 4HNO_3$，$4NO_2 + O_2 + 2H_2O = 4HNO_3$。设 $NO$、$NO_2$、$O_2$ 的物质的量分别为 $a$、$b$、$c$，完全反应需满足 $\\frac{3}{4}a + \\frac{1}{4}b = c$，即 $3a + b = 4c$。将各选项代入：A 选项 $a:b:c = 1:1:1$，$3(1)+1 = 4 = 4(1)$，满足。B 选项 $3(1)+2 = 5 \\neq 4(1)$，不满足。C 选项 $3(2)+1 = 7 \\neq 4(1)$，不满足。D 选项 $3(1)+1 = 4 \\neq 4(2) = 8$，不满足。故答案为 A。',
  },

  // ===== 物质结构与性质 =====
  {
    id: 'c049', subject: 'chemistry', module: 'structure-properties', pointId: 'atomic-structure',
    type: 'single-choice', difficulty: 1,
    content: '某元素原子的电子排布式为 $1s^2 2s^2 2p^6 3s^2 3p^4$，下列关于该元素的说法正确的是',
    options: [
      '该元素位于第二周期',
      '该元素属于第VIA族',
      '该元素原子的最外层有 $4$ 个电子',
      '该元素的原子序数为 $18$',
    ],
    answer: 1,
    explanation: '由电子排布式 $1s^2 2s^2 2p^6 3s^2 3p^4$ 可知：电子总数为 $2+2+6+2+4 = 16$，原子序数为 $16$，该元素为硫（$S$）。最大能层为第三层，位于第三周期（非第二周期），A、D 错误。最外层（第三层）电子数为 $2+4 = 6$，属于第VIA族，B 正确、C 错误。',
  },
  {
    id: 'c050', subject: 'chemistry', module: 'structure-properties', pointId: 'atomic-structure',
    type: 'single-choice', difficulty: 3,
    content: '短周期元素 $X$、$Y$、$Z$ 的原子序数依次递增。$X$ 的最外层电子数是内层电子数的 $2$ 倍，$Y$ 是地壳中含量最多的元素，$Z$ 是短周期中金属性最强的元素。下列说法正确的是',
    options: [
      '原子半径：$Y < X < Z$',
      '$Y$ 的简单氢化物的沸点比 $X$ 的简单氢化物低',
      '$Z$ 的最高价氧化物对应水化物呈酸性',
      '$X$ 与 $Y$ 之间只能形成一种化合物',
    ],
    answer: 0,
    explanation: '$X$ 最外层电子数是内层的 $2$ 倍：若为第二周期，内层 $1s^2$（$2$ 个），最外层 $4$ 个，即 $1s^2 2s^2 2p^2$，为碳（$C$，$Z=6$）。$Y$ 是地壳中含量最多的元素，为氧（$O$，$Z=8$）。$Z$ 是短周期金属性最强的元素，为钠（$Na$，$Z=11$）。三者原子序数递增：$6 < 8 < 11$，符合。A 选项：原子半径 $O < C < Na$，即 $Y < X < Z$，正确。B 选项：$H_2O$ 沸点 $100^\\circ\\text{C}$，$CH_4$ 沸点 $-162^\\circ\\text{C}$，$H_2O$ 沸点更高，错误。C 选项：$Na$ 的最高价氧化物水化物是 $NaOH$，呈强碱性，错误。D 选项：$C$ 与 $O$ 可形成 $CO$ 和 $CO_2$ 等多种化合物，错误。',
  },
  {
    id: 'c051', subject: 'chemistry', module: 'structure-properties', pointId: 'chemical-bonds',
    type: 'single-choice', difficulty: 2,
    content: '下列关于化学键的说法正确的是',
    options: [
      '离子化合物中一定含有离子键，可能含有共价键',
      '共价化合物中可能含有离子键',
      '含有金属元素的化合物一定是离子化合物',
      '非金属元素之间形成的化学键一定是共价键',
    ],
    answer: 0,
    explanation: 'A 选项：离子化合物必含离子键，若阴离子或阳离子内部含共价键（如 $NaOH$ 中 $O-H$ 键、$NH_4Cl$ 中 $N-H$ 键），则还含共价键，正确。B 选项：共价化合物中只含共价键，不含离子键，错误。C 选项：$AlCl_3$ 含金属元素但属于共价化合物，错误。D 选项：非金属元素间可形成离子键，如 $NH_4Cl$ 中 $NH_4^+$ 与 $Cl^-$ 之间为离子键，错误。',
  },
  {
    id: 'c052', subject: 'chemistry', module: 'structure-properties', pointId: 'chemical-bonds',
    type: 'single-choice', difficulty: 4,
    content: '下列各组物质中，化学键类型完全相同的是',
    options: [
      '$HCl$ 和 $NaCl$',
      '$CO_2$ 和 $CH_4$',
      '$NaOH$ 和 $H_2O$',
      '$NH_4Cl$ 和 $KCl$',
    ],
    answer: 1,
    explanation: 'A 选项：$HCl$ 含共价键，$NaCl$ 含离子键，不同。B 选项：$CO_2$ 和 $CH_4$ 均为共价化合物，只含极性共价键，键类型完全相同，正确。C 选项：$NaOH$ 含离子键（$Na^+$ 与 $OH^-$ 间）和共价键（$O-H$），$H_2O$ 只含共价键，不同。D 选项：$NH_4Cl$ 含离子键（$NH_4^+$ 与 $Cl^-$ 间）和共价键（$N-H$），$KCl$ 只含离子键，不同。',
  },

  // ===== 化学反应与能量 =====
  {
    id: 'c053', subject: 'chemistry', module: 'reaction-energy', pointId: 'reaction-rate',
    type: 'single-choice', difficulty: 2,
    content: '对于反应 $A + 3B = 2C + 2D$，下列各条件下反应速率最快的是（同一温度下）',
    options: [
      '$v(A) = 0.2\\,\\text{mol/(L·min)}$',
      '$v(B) = 0.6\\,\\text{mol/(L·min)}$',
      '$v(C) = 0.4\\,\\text{mol/(L·min)}$',
      '$v(D) = 0.5\\,\\text{mol/(L·min)}$',
    ],
    answer: 3,
    explanation: '将各选项的反应速率统一换算为用 $A$ 表示的速率进行比较。由化学计量数关系 $v(A):v(B):v(C):v(D) = 1:3:2:2$。A 选项：$v(A) = 0.2$。B 选项：$v(A) = \\frac{0.6}{3} = 0.2$。C 选项：$v(A) = \\frac{0.4}{2} = 0.2$。D 选项：$v(A) = \\frac{0.5}{2} = 0.25$。比较得 $0.25 > 0.2$，D 选项反应速率最快。',
  },
  {
    id: 'c054', subject: 'chemistry', module: 'reaction-energy', pointId: 'reaction-rate',
    type: 'single-choice', difficulty: 5,
    content: '对于反应 $2SO_2(g) + O_2(g) \\rightleftharpoons 2SO_3(g)$ $\\Delta H < 0$，下列措施既能加快正反应速率，又能提高 $SO_2$ 转化率的是',
    options: [
      '升高温度',
      '增大压强',
      '加入催化剂',
      '降低温度',
    ],
    answer: 1,
    explanation: '要求同时满足两个条件：①加快正反应速率；②提高 $SO_2$ 转化率。A 选项：升高温度加快反应速率，但正反应放热，平衡逆向移动，$SO_2$ 转化率降低，不合要求。B 选项：增大压强，各组分浓度增大，正反应速率加快；正反应方向气体分子数减少（$3 \\rightarrow 2$），平衡正向移动，$SO_2$ 转化率提高，符合要求。C 选项：催化剂同等程度加快正逆反应速率，平衡不移动，转化率不变，不合要求。D 选项：降低温度，反应速率减慢，虽能提高转化率但速率不满足，不合要求。故选 B。',
  },
  {
    id: 'c055', subject: 'chemistry', module: 'reaction-energy', pointId: 'chemical-equilibrium',
    type: 'single-choice', difficulty: 3,
    content: '在密闭容器中发生反应 $2SO_2(g) + O_2(g) \\rightleftharpoons 2SO_3(g)$ $\\Delta H < 0$，下列措施能提高 $SO_2$ 转化率的是',
    options: [
      '升高温度',
      '减小压强',
      '加入催化剂',
      '及时移出 $SO_3$',
    ],
    answer: 3,
    explanation: '提高 $SO_2$ 转化率即使平衡正向移动。A 选项：正反应放热，升高温度平衡逆向移动，转化率降低。B 选项：正反应气体分子数减少，减小压强平衡逆向移动（向分子数增多方向），转化率降低。C 选项：催化剂不改变平衡状态，转化率不变。D 选项：移出产物 $SO_3$，平衡正向移动，更多 $SO_2$ 转化为 $SO_3$，转化率提高，正确。',
  },
  {
    id: 'c056', subject: 'chemistry', module: 'reaction-energy', pointId: 'chemical-equilibrium',
    type: 'single-choice', difficulty: 5,
    content: '在恒温恒容密闭容器中，反应 $2X(g) + Y(g) \\rightleftharpoons 2Z(g)$ 达到平衡。此时再向容器中充入一定量 $X$，重新达到平衡后，下列说法正确的是',
    options: [
      '平衡不移动',
      '$Y$ 的转化率增大',
      '$X$ 的转化率增大',
      '容器内气体的压强不变',
    ],
    answer: 1,
    explanation: '恒温恒容下充入 $X$，瞬时 $c(X)$ 增大，平衡正向移动。A 选项错误。平衡正向移动使更多 $Y$ 消耗，$Y$ 的转化率增大，B 正确。对于 $X$：虽然平衡正向移动消耗了部分 $X$，但由于充入的 $X$ 总量增多，消耗量占充入总量的比例反而减小，故 $X$ 的转化率减小，C 错误。充入 $X$ 后气体总物质的量增大，恒容下压强增大，即使平衡正向移动（该反应前后气体分子数 $3 \\rightarrow 2$，分子数减少），压强也不一定恢复原值，实际上压强比原平衡大，D 错误。',
  },

  // ===== 水溶液中的离子平衡 =====
  {
    id: 'c057', subject: 'chemistry', module: 'solution', pointId: 'weak-electrolyte',
    type: 'single-choice', difficulty: 2,
    content: '下列关于电解质的说法正确的是',
    options: [
      '强电解质溶液的导电能力一定比弱电解质溶液强',
      '$CH_3COOH$ 是弱电解质，在水溶液中不能完全电离',
      '$BaSO_4$ 难溶于水，所以它不是电解质',
      '酒精的水溶液能导电，所以酒精是电解质',
    ],
    answer: 1,
    explanation: 'A 选项：导电能力取决于离子浓度，很稀的强电解质溶液导电能力可能比较浓的弱电解质溶液弱，错误。B 选项：$CH_3COOH$ 是弱酸，在水溶液中部分电离，属于弱电解质，正确。C 选项：$BaSO_4$ 虽难溶，但溶于水的部分完全电离，属于强电解质，错误。D 选项：酒精（乙醇）溶于水后以分子形式存在，不电离，是非电解质，其水溶液导电是因为水中自身电离的离子，错误。',
  },
  {
    id: 'c058', subject: 'chemistry', module: 'solution', pointId: 'salt-hydrolysis',
    type: 'single-choice', difficulty: 3,
    content: '常温下，物质的量浓度相同的下列三种溶液：① $Na_2CO_3$ ② $NaCl$ ③ $NH_4Cl$，按 $pH$ 由大到小的顺序排列正确的是',
    options: [
      '① > ③ > ②',
      '① > ② > ③',
      '③ > ② > ①',
      '② > ① > ③',
    ],
    answer: 1,
    explanation: '① $Na_2CO_3$：$CO_3^{2-}$ 水解使溶液呈碱性，$pH > 7$。② $NaCl$：强酸强碱盐，不水解，溶液呈中性，$pH = 7$。③ $NH_4Cl$：$NH_4^+$ 水解使溶液呈酸性，$pH < 7$。因此 $pH$ 大小关系为 $Na_2CO_3 > NaCl > NH_4Cl$，即 ① > ② > ③，B 选项正确。',
  },
  {
    id: 'c059', subject: 'chemistry', module: 'solution', pointId: 'salt-hydrolysis',
    type: 'single-choice', difficulty: 5,
    content: '常温下，$0.1\\,\\text{mol/L}$ $Na_2CO_3$ 溶液中，下列离子浓度关系正确的是',
    options: [
      '$c(Na^+) = 2c(CO_3^{2-})$',
      '$c(Na^+) + c(H^+) = 2c(CO_3^{2-}) + c(HCO_3^-) + c(OH^-)$',
      '$c(OH^-) = c(HCO_3^-) + c(H_2CO_3) + c(H^+)$',
      '$c(HCO_3^-) > c(CO_3^{2-})$',
    ],
    answer: 1,
    explanation: '在 $Na_2CO_3$ 溶液中，$CO_3^{2-}$ 发生水解：$CO_3^{2-} + H_2O \\rightleftharpoons HCO_3^- + OH^-$、$HCO_3^- + H_2O \\rightleftharpoons H_2CO_3 + OH^-$，使 $c(CO_3^{2-})$ 减小，故 $c(Na^+) \\neq 2c(CO_3^{2-})$，A 错误。根据电荷守恒：阳离子所带正电荷总数等于阴离子所带负电荷总数，$c(Na^+) + c(H^+) = 2c(CO_3^{2-}) + c(HCO_3^-) + c(OH^-)$，B 正确。根据质子守恒（物料守恒推出的 $H$ 守恒），应为 $c(OH^-) = c(HCO_3^-) + 2c(H_2CO_3) + c(H^+)$（每生成一个 $H_2CO_3$ 消耗两个 $OH^-$），C 缺少系数 $2$，错误。由于 $CO_3^{2-}$ 水解程度有限，$c(CO_3^{2-}) > c(HCO_3^-)$，D 错误。',
  },

  // ===== 有机化学 =====
  {
    id: 'c060', subject: 'chemistry', module: 'organic', pointId: 'hydrocarbons',
    type: 'single-choice', difficulty: 1,
    content: '下列关于甲烷和乙烯的说法正确的是',
    options: [
      '甲烷分子是平面正方形结构',
      '乙烯分子中所有碳碳键为单键',
      '甲烷与氯气在光照条件下发生取代反应',
      '乙烯使酸性高锰酸钾溶液褪色是物理变化',
    ],
    answer: 2,
    explanation: 'A 选项：甲烷（$CH_4$）为正四面体结构，碳原子位于中心，四个氢原子位于顶点，错误。B 选项：乙烯（$C_2H_4$）含有碳碳双键（$C=C$），不是单键，错误。C 选项：甲烷在光照条件下与氯气发生取代反应，生成 $CH_3Cl$ 等卤代烃，正确。D 选项：乙烯被酸性 $KMnO_4$ 氧化使其褪色，属于化学变化（氧化反应），错误。',
  },
  {
    id: 'c061', subject: 'chemistry', module: 'organic', pointId: 'hydrocarbons',
    type: 'single-choice', difficulty: 4,
    content: '某气态混合物由两种烃组成，$0.1\\,\\text{mol}$ 该混合物完全燃烧生成 $0.16\\,\\text{mol}$ $CO_2$ 和 $3.6\\,\\text{g}$ $H_2O$。该混合物的组成可能是',
    options: [
      '$CH_4$ 和 $C_2H_4$',
      '$CH_4$ 和 $C_2H_6$',
      '$C_2H_2$ 和 $C_2H_6$',
      '$C_2H_4$ 和 $C_3H_8$',
    ],
    answer: 0,
    explanation: '由 $0.16\\,\\text{mol}$ $CO_2$ 得平均每个分子含 $\\frac{0.16}{0.1} = 1.6$ 个 $C$；由 $3.6\\,\\text{g}$ $H_2O$（即 $0.2\\,\\text{mol}$）得平均每个分子含 $\\frac{0.2 \\times 2}{0.1} = 4$ 个 $H$。平均组成为 $C_{1.6}H_4$。A 选项：设 $CH_4$ 为 $x$，$C_2H_4$ 为 $0.1-x$。$C$：$x + 2(0.1-x) = 0.16$，解得 $x = 0.04$。$H$：$4x + 4(0.1-x) = 0.4$，恒成立。故 $CH_4$ 占 $0.04\\,\\text{mol}$、$C_2H_4$ 占 $0.06\\,\\text{mol}$，合理。B 选项：$CH_4$（$H=4$）和 $C_2H_6$（$H=6$），平均 $H > 4$，不符合。C 选项：$C_2H_2$（$C=2$）和 $C_2H_6$（$C=2$），平均 $C=2 \\neq 1.6$，不符合。D 选项：$C_2H_4$（$C=2$）和 $C_3H_8$（$C=3$），平均 $C > 2 \\neq 1.6$，不符合。故选 A。',
  },
  {
    id: 'c062', subject: 'chemistry', module: 'organic', pointId: 'oxygen-compounds',
    type: 'single-choice', difficulty: 5,
    content: '某有机物 $A$ 的分子式为 $C_3H_6O_2$，下列关于 $A$ 的说法正确的是',
    options: [
      '$A$ 能与 $Na_2CO_3$ 反应放出 $CO_2$',
      '$A$ 的同分异构体共有 $3$ 种',
      '若 $A$ 能发生水解反应，则 $A$ 属于酯类',
      '若 $A$ 能发生银镜反应，则 $A$ 一定是甲酸乙酯',
    ],
    answer: 2,
    explanation: '$C_3H_6O_2$ 的不饱和度 $\\Omega = \\frac{2 \\times 3 + 2 - 6}{2} = 1$。A 选项：能与 $Na_2CO_3$ 反应放出 $CO_2$ 的是羧酸（如 $CH_3CH_2COOH$），但 $A$ 也可能是酯（如 $CH_3COOCH_3$）或其他异构体，不能确定 $A$ 一定能与 $Na_2CO_3$ 反应，错误。B 选项：$C_3H_6O_2$ 的同分异构体包括 $CH_3CH_2COOH$（丙酸）、$CH_3COOCH_3$（乙酸甲酯）、$HCOOCH_2CH_3$（甲酸乙酯）、$CH_3COCH_2OH$（羟基丙酮）、$HOCH_2CH_2CHO$（3-羟基丙醛）等，超过 $3$ 种，错误。C 选项：$C_3H_6O_2$ 不饱和度为 $1$，能发生水解反应说明含有可水解的基团；分子中含一个不饱和度且能水解的含氧衍生物只能是酯（羧酸不水解、醇和醛也不水解），正确。D 选项：能发生银镜反应说明含醛基（$-CHO$），除甲酸乙酯（$HCOOC_2H_5$）外，$HOCH_2CH_2CHO$（3-羟基丙醛，分子式也是 $C_3H_6O_2$）也能发生银镜反应，故不一定是甲酸乙酯，错误。',
  },
];
