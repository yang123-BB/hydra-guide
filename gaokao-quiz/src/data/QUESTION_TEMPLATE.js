/**
 * 题目数据模板 - 新标签体系
 * 
 * 此文件展示按新标签体系编写题目的正确格式
 * 每个题目应包含：6类标签 + 三层解析 + 纠错字段
 * 
 * 使用此模板添加新题目时，请确保所有字段都正确填写
 */

export const templateQuestions = [

  // ─── 示例1：高考真题（选择题）───
  {
    id: 'math_generated_0001',
    subject: 'math',
    module: 'function',
    pointId: 'math_function_basic',
    content: '已知函数 $f(x) = x^2 - 2x + 3$，则 $f(1)$ 的值为（  ）',
    options: ['A. 1', 'B. 2', 'C. 3', 'D. 4'],
    answer: 1, // B
    explanation: '将 $x=1$ 代入函数：$f(1) = 1^2 - 2\\times 1 + 3 = 2$',
    difficulty: 2,
    
    // ══════════════════════════════════════════
    // 6类标签（新标签体系）
    // ══════════════════════════════════════════
    tags: {
      // 考区（全国卷/新高考/自主命题）
      examArea: '新高考I卷',
      
      // 题型（选择题/填空题/解答题/应用题）
      questionType: '选择题',
      
      // 难度星（1-5，对应基础/中档/压轴）
      difficultyStars: 2,
      
      // 来源（高考真题/模拟考试/名校期中/名校期末/竞赛题）
      source: '高考真题',
      
      // 年份（高考真题年份，模拟题可为空）
      year: '2023',
      
      // 教学标签（知识点专题/基础题/中档题/压轴题/易错题）
      teachingTags: ['函数专题', '基础题', '代入求值'],
    },
    
    // ══════════════════════════════════════════
    // 三层解析（新解析体系）
    // ══════════════════════════════════════════
    explanationLayers: {
      // 第一层：标准答案（所有题目必填）
      standard: '**解**：将 $x=1$ 代入函数解析式：\n\n$f(1) = 1^2 - 2\\times 1 + 3 = 1 - 2 + 3 = 2$\n\n故选 **B**。',
      
      // 第二层：高考采分点（解答题必填，选择题选填）
      scoring: null, // 选择题无采分点，填 null
      
      // 第三层：易错提醒（所有题目必填）
      tips: '**易错点**：\n- 代入时注意符号：$-2\\times 1 = -2$，不要算成 $+2$\n- 计算顺序：先乘方，再乘除，最后加减\n- 检查时可以把选项代入验证',
    },
    
    // 纠错标记（题目有误时由用户反馈，自动填充）
    errorReported: false,
  },

  // ─── 示例2：模拟考试（填空题）───
  {
    id: 'physics_generated_0001',
    subject: 'physics',
    module: 'mechanics',
    pointId: 'physics_newton_law',
    content: '一个质量为 $2\\,\\text{kg}$ 的物体，在水平方向上受到 $6\\,\\text{N}$ 的恒定拉力作用，摩擦力为 $2\\,\\text{N}$。则物体的加速度为 $\\_\_\_\\ \\text{m/s}^2$。（$g = 10\\ \\text{m/s}^2$）',
    options: null, // 填空题无选项
    answer: 2, // 数值答案
    explanation: '根据牛顿第二定律：$F_{\text{合}} = ma$\n\n$F_{\text{合}} = F - f = 6 - 2 = 4\\ \\text{N}$\n\n$a = \\frac{F_{\text{合}}}{m} = \\frac{4}{2} = 2\\ \\text{m/s}^2$',
    difficulty: 3,
    
    tags: {
      examArea: '全国乙卷',
      questionType: '填空题',
      difficultyStars: 3,
      source: '模拟考试',
      year: '2023',
      teachingTags: ['牛顿运动定律', '中档题', '受力分析'],
    },
    
    explanationLayers: {
      standard: '**解**：对物体受力分析，水平方向受拉力 $F = 6\\ \\text{N}$，摩擦力 $f = 2\\ \\text{N}$。\n\n根据牛顿第二定律：\n$F_{\text{合}} = F - f = ma$\n\n代入数据：\n$6 - 2 = 2a$\n\n解得：$a = 2\\ \\text{m/s}^2$',
      
      scoring: '**采分点**（满分5分）：\n1. 正确受力分析（2分）\n2. 列出牛顿第二定律方程（2分）\n3. 代入数据计算正确（1分）',
      
      tips: '**易错提醒**：\n- 注意摩擦力的方向：与运动趋势相反\n- 单位要统一：质量用 kg，力用 N\n- 加速度方向：与合外力方向相同\n- 如果题目给出多个力，要先建立坐标系分解',
    },
    
    errorReported: false,
  },

  // ─── 示例3：高考真题（解答题）───
  {
    id: 'math_generated_0002',
    subject: 'math',
    module: 'derivative',
    pointId: 'math_derivative_appliation',
    content: '已知函数 $f(x) = x^3 - 3x^2 + 2$。\n\n（I）求 $f(x)$ 的单调区间；\n\n（II）求 $f(x)$ 在 $[-1, 3]$ 上的最大值和最小值。',
    options: null, // 解答题无选项
    answer: null, // 解答题无单一答案
    explanation: '（I）$f\'(x) = 3x^2 - 6x = 3x(x-2)$\n\n令 $f\'(x) > 0$ 得 $x < 0$ 或 $x > 2$，所以单调递增区间为 $(-\\infty, 0)$ 和 $(2, +\\infty)$\n\n令 $f\'(x) < 0$ 得 $0 < x < 2$，所以单调递减区间为 $(0, 2)$\n\n（II）$f(-1) = -2$，$f(0) = 2$，$f(2) = -2$，$f(3) = 2$\n\n所以最大值为 $2$，最小值为 $-2$',
    difficulty: 4,
    
    tags: {
      examArea: '全国甲卷',
      questionType: '解答题',
      difficultyStars: 4,
      source: '高考真题',
      year: '2022',
      teachingTags: ['导数应用', '压轴题', '单调性', '最值'],
    },
    
    explanationLayers: {
      standard: '**（I）解**：\n$f\'(x) = 3x^2 - 6x = 3x(x-2)$\n\n令 $f\'(x) = 0$，得 $x_1 = 0$，$x_2 = 2$\n\n当 $x \\in (-\\infty, 0)$ 时，$f\'(x) > 0$，$f(x)$ 单调递增；\n当 $x \\in (0, 2)$ 时，$f\'(x) < 0$，$f(x)$ 单调递减；\n当 $x \\in (2, +\\infty)$ 时，$f\'(x) > 0$，$f(x)$ 单调递增。\n\n**（II）解**：\n计算区间端点和驻点的函数值：\n$f(-1) = (-1)^3 - 3(-1)^2 + 2 = -2$\n$f(0) = 2$\n$f(2) = 8 - 12 + 2 = -2$\n$f(3) = 27 - 27 + 2 = 2$\n\n比较得：最大值为 $2$，最小值为 $-2$。',
      
      scoring: '**采分点**（满分12分）：\n\n**第（I）问（6分）**：\n1. 正确求导（2分）\n2. 正确求解 $f\'(x) = 0$（1分）\n3. 正确分析导数符号（2分）\n4. 正确写出单调区间（1分）\n\n**第（II）问（6分）**：\n1. 正确列出候选点（2分）\n2. 正确计算函数值（2分）\n3. 正确比较得出最值（2分）',
      
      tips: '**易错提醒**：\n- 求导时常见错误：$(x^3)\' = 3x^2$，不要漏掉指数\n- 列表分析导数符号时，注意分段区间用"和"连接，不要用"∪"\n- 求最值时，必须比较**所有**候选点（端点+驻点+不可导点）\n- 写单调区间时，不要在端点处取等（导数=0的点是分界点）\n- 计算 $f(-1)$ 时注意：$(-1)^3 = -1$，$(-1)^2 = 1$',
    },
    
    errorReported: false,
  },
]

/**
 * 使用说明：
 * 
 * 1. 每个题目必须包含 tags 和 explanationLayers 字段
 * 2. tags 中的 teachingTags 是数组，可以包含多个标签
 * 3. 选择题必须有 options 数组（4个元素）和 answer（0-3）
 * 4. 填空题和解答题的 options 为 null，answer 也为 null
 * 5. explanationLayers.scoring 选择题可填 null，解答题必须填写
 * 6. 所有题目的 explanationLayers.standard 和 explanationLayers.tips 必填
 * 7. 题目ID格式：{subject}_{module}_{index}，如 math_function_0001
 * 8. 添加新题目后，运行 `node scripts/validate_questions.js` 验证格式
 */
