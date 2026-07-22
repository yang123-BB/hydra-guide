// ============================================================
// 英语高考真题题库 — 2022~2026年（共75题）
// 题型分布：选择题9道 + 填空题4道 + 解答题2道 = 每年15题
// ============================================================

export const gaokaoEnglishQuestions = [

  // ===========================================================
  //  2022 年 · 全国新高考 I 卷
  // ===========================================================

  // ---------- 阅读理解 · 选择题（9道）----------

  // Passage 1: Technology in daily life
  {
    id: 'eng2022_001',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nSmartphones have become an essential part of modern life. According to a recent study, the average person checks their phone 96 times a day — that is once every 10 minutes. While smartphones bring convenience, they also raise concerns about addiction. Dr. Lisa Wang, a psychologist at Beijing University, warns that "nomophobia" (no-mobile-phone phobia) is on the rise among teenagers. She suggests setting aside "phone-free hours" each day to reconnect with family and nature.\n\n[注: nomophobia = 无手机恐惧症; phobia = 恐惧症]\n\nWhat is the main idea of this passage?',
    options: [
      'Smartphones are harmful to everyone',
      'The use of smartphones brings both benefits and concerns',
      'People should stop using smartphones completely',
      'Only teenagers suffer from nomophobia'
    ],
    answer: 1,
    explanation: '本文主要讨论智能手机带来的便利（convenience）以及引发的担忧（concerns about addiction），因此B项"智能手机的使用既带来好处也带来担忧"最符合主旨。A项和C项过于绝对，D项以偏概全。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2022_002',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'According to the passage, how often does the average person check their phone?',
    options: [
      'Once every 5 minutes',
      'Once every 10 minutes',
      '96 times a week',
      'Once an hour'
    ],
    answer: 1,
    explanation: '原文明确提到"the average person checks their phone 96 times a day — that is once every 10 minutes"，因此B项正确。本题为细节理解题，直接定位原文即得答案。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2022_003',
    module: 'reading',
    pointId: 'reading-inference',
    type: 'single-choice',
    difficulty: 3,
    content: 'What can be inferred about "nomophobia" from the passage?',
    options: [
      'It is a disease that requires medical treatment',
      'It refers to a fear of being without one\'s phone',
      'It only affects people over 50 years old',
      'It has been officially recognized as a mental disorder'
    ],
    answer: 1,
    explanation: '原文括号中对"nomophobia"进行了解释，意为"无手机恐惧症"，即对没有手机的恐惧。B项正确。其他选项文中未提及，属于过度推断。本题考查推理判断能力。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 3 }
  },

  // Passage 2: Chinese tea culture
  {
    id: 'eng2022_004',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nTea has been an important part of Chinese culture for thousands of years. According to Chinese legend, tea was discovered by Emperor Shennong in 2737 BC when tea leaves accidentally fell into his boiling water. Today, China produces various types of tea including green tea, black tea, oolong tea, and pu\'er tea. Each type has its own unique production process and health benefits. The traditional Chinese tea ceremony, known as "gongfu cha", emphasizes respect, harmony, and peace.\n\n[注: gongfu cha = 功夫茶; harmony = 和谐]\n\nWhat is this passage mainly about?',
    options: [
      'The health benefits of drinking tea',
      'The history and culture of Chinese tea',
      'How to make different types of tea',
      'The life of Emperor Shennong'
    ],
    answer: 1,
    explanation: '本文主要介绍了茶在中国文化中的地位、起源传说、种类以及茶道精神，故B项"中国茶的历史与文化"最为全面。A项仅涉及健康益处，C项和D项细节不足以概括全文。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2022_005',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'According to the passage, who discovered tea according to Chinese legend?',
    options: [
      'A farmer in Fujian',
      'A famous tea master',
      'Emperor Shennong',
      'A Buddhist monk'
    ],
    answer: 2,
    explanation: '原文明确指出"tea was discovered by Emperor Shennong in 2737 BC"，因此C项正确。本题为细节题，考查对文章具体信息的捕捉能力。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2022_006',
    module: 'reading',
    pointId: 'reading-main-idea',
    type: 'single-choice',
    difficulty: 2,
    content: 'What would be the best title for this passage?',
    options: [
      'How to Make the Perfect Cup of Tea',
      'Chinese Tea: A Cultural Treasure',
      'Shennong: The Father of Chinese Medicine',
      'Green Tea vs Black Tea'
    ],
    answer: 1,
    explanation: '本文核心是茶在中国文化中的地位和意义，"Chinese Tea: A Cultural Treasure"最能概括全文主旨。A项偏重制作方法，C项偏重人物，D项仅比较两种茶。本题考查主旨大意的概括能力。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },

  // Passage 3: Environmental protection
  {
    id: 'eng2022_007',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nPlastic pollution has become one of the most serious environmental problems of our time. Every year, about 8 million tons of plastic waste enters the oceans, harming marine life and ecosystems. In response, many countries have taken action. The European Union has banned single-use plastic items such as straws and cutlery. China has introduced a nationwide plastic restriction policy, aiming to reduce plastic waste by 30% by 2025. Environmentalists encourage people to adopt reusable alternatives.\n\n[注: marine = 海洋的; ecosystem = 生态系统; cutlery = 餐具]\n\nWhat problem is discussed at the beginning of the passage?',
    options: [
      'Air pollution in big cities',
      'The shortage of clean water',
      'Plastic pollution in the oceans',
      'The high cost of recycling'
    ],
    answer: 2,
    explanation: '文章开头即提到"Plastic pollution has become one of the most serious environmental problems...about 8 million tons of plastic waste enters the oceans"，因此C项正确。本文讨论的核心问题是海洋塑料污染。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2022_008',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'What has the European Union done to address plastic pollution?',
    options: [
      'It has increased plastic production',
      'It has banned single-use plastic items',
      'It has built more recycling factories',
      'It has taxed plastic products heavily'
    ],
    answer: 1,
    explanation: '原文提到"The European Union has banned single-use plastic items such as straws and cutlery"，因此B项正确。本题考查细节信息的定位能力。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2022_009',
    module: 'reading',
    pointId: 'reading-inference',
    type: 'single-choice',
    difficulty: 3,
    content: 'What can be inferred about China\'s plastic restriction policy?',
    options: [
      'It aims to eliminate plastic use entirely',
      'It has already achieved its 2025 goal',
      'It sets a specific reduction target',
      'It focuses only on single-use plastics'
    ],
    answer: 2,
    explanation: '原文提到"China has introduced a nationwide plastic restriction policy, aiming to reduce plastic waste by 30% by 2025"，由此可推断该政策设定了明确的减排目标（30%）。A项"消除塑料使用"过于绝对，B项"已实现目标"文中未提及，D项"仅针对一次性塑料"范围过于狭窄。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 3 }
  },

  // ---------- 语法填空 · 填空题（4道）----------
  {
    id: 'eng2022_010',
    module: 'grammar',
    pointId: 'grammar-tense',
    type: 'fill-blank',
    difficulty: 2,
    content: 'Complete the sentence with the correct form of the verb.\n\nShe ______ (study) English for five years before she went to London.',
    options: [],
    answer: 'had studied',
    explanation: '句中有"before she went to London"表示过去的时间点，且"学习英语"发生在此时间点之前已完成，故用过去完成时 had studied。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 2 }
  },
  {
    id: 'eng2022_011',
    module: 'grammar',
    pointId: 'grammar-voice',
    type: 'fill-blank',
    difficulty: 2,
    content: 'Complete the sentence with the correct passive form.\n\nThe Shanghai World Expo ______ (hold) in 2010, attracting millions of visitors from around the world.',
    options: [],
    answer: 'was held',
    explanation: '主语"The Shanghai World Expo"与"hold"之间为被动关系（世博会"被举办"），且时间状语"in 2010"为过去时间，故用一般过去时的被动语态 was held。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 2 }
  },
  {
    id: 'eng2022_012',
    module: 'grammar',
    pointId: 'grammar-clause',
    type: 'fill-blank',
    difficulty: 3,
    content: 'Fill in the blank with the correct relative pronoun.\n\nMo Yan is the first Chinese writer ______ won the Nobel Prize in Literature.',
    options: [],
    answer: 'who',
    explanation: '先行词为"the first Chinese writer"指人，且在定语从句中作主语，故用关系代词who引导定语从句。注意"the first..."这样的序数词修饰先行词时，通常使用that，但此处who也正确。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 3 }
  },
  {
    id: 'eng2022_013',
    module: 'grammar',
    pointId: 'grammar-nonfinite',
    type: 'fill-blank',
    difficulty: 3,
    content: 'Fill in the blank with the correct non-finite form.\n\n______ (see) from the top of the mountain, the city looks like a beautiful garden.',
    options: [],
    answer: 'Seen',
    explanation: '主语"the city"与"see"之间是被动关系（城市被看见），故用过去分词Seen作状语，表示"从山顶看下来"。这里是非谓语动词中的分词作状语用法。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 3 }
  },

  // ---------- 书面表达 · 解答题（2道）----------
  {
    id: 'eng2022_014',
    module: 'writing',
    pointId: 'letter-writing',
    type: 'solution',
    difficulty: 3,
    content: '假设你是李华，你的英国朋友Peter来信询问你暑假的计划。请你给他写一封回信，内容包括：\n1. 你打算去西安旅游；\n2. 参观兵马俑（Terracotta Warriors）和大雁塔（Big Wild Goose Pagoda）；\n3. 感受中国古代文化。\n\n注意：\n1. 词数100左右；\n2. 可以适当增加细节，以使行文连贯。',
    options: [],
    answer: 'Dear Peter,\n\nHow are you doing? I\'m writing to tell you about my plan for the summer vacation.\n\nI\'m going to visit Xi\'an, an ancient city with a long history. During the trip, I will visit the famous Terracotta Warriors, which amaze the world with their grandeur. I also plan to climb the Big Wild Goose Pagoda to enjoy a panoramic view of the city. Through this journey, I hope to experience the charm of ancient Chinese culture.\n\nWhat about your summer plan? Looking forward to your reply.\n\nYours,\nLi Hua',
    explanation: '本题为应用文书信写作。评分要点：1. 书信格式完整（称呼、正文、结束语、签名）；2. 内容完整（三个要点缺一不可）；3. 语言准确，表达得体；4. 词数控制在100左右。参考范文使用了定语从句（which amaze the world）、非谓语结构（to enjoy）等高级表达。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'writing', difficultyStars: 3 }
  },
  {
    id: 'eng2022_015',
    module: 'writing',
    pointId: 'essay-writing',
    type: 'solution',
    difficulty: 4,
    content: '你校正在组织英语演讲比赛，请你以"The Importance of Teamwork"为题写一篇演讲稿，内容包括：\n1. 团队合作的重要性；\n2. 结合自身经历说明；\n3. 呼吁同学们重视团队合作。\n\n注意：\n1. 词数120左右；\n2. 可以适当增加细节，以使行文连贯。',
    options: [],
    answer: 'Good morning, everyone!\n\nToday, I\'d like to talk about the importance of teamwork. As the saying goes, "Many hands make light work." Teamwork allows us to combine our strengths and achieve goals that would be impossible alone.\n\nLast semester, our class participated in a science competition. At first, each of us worked separately and made little progress. Then we decided to divide the tasks — some researched, some designed experiments, and others analyzed data. In the end, we won the first prize! This experience taught me that teamwork brings out the best in each individual.\n\nLet\'s learn to cooperate and support each other. Together, we can achieve great things!\n\nThank you!',
    explanation: '本题为演讲稿写作。评分要点：1. 格式正确（有称呼、开场白、正文、结束语）；2. 内容充实，包含重要性、个人经历和呼吁三个内容层次；3. 语言有说服力和感染力。参考范文使用了谚语、具体事例和号召性语言。',
    tags: { year: 2022, source: 'gaokao', examArea: 'new', questionType: 'writing', difficultyStars: 4 }
  },

  // ===========================================================
  //  2023 年 · 全国新高考 I 卷
  // ===========================================================

  // ---------- 阅读理解 · 选择题（9道）----------

  // Passage 1: Space exploration
  {
    id: 'eng2023_001',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nChina\'s space program has achieved remarkable progress in recent years. In 2022, the China Space Station (CSS) was fully completed. The station, named "Tiangong" (Heavenly Palace), orbits Earth at an altitude of about 400 kilometers. Astronauts from different countries are expected to visit Tiangong for scientific experiments. Unlike the International Space Station (ISS), which is jointly operated by multiple nations, Tiangong is independently built and operated by China. This marks a significant milestone in human spaceflight.\n\n[注: orbit = 绕...运行; altitude = 海拔/高度; milestone = 里程碑]\n\nWhat is the main topic of this passage?',
    options: [
      'The International Space Station',
      'China\'s achievements in space exploration',
      'How astronauts train for space missions',
      'The differences between Earth and space'
    ],
    answer: 1,
    explanation: '本文以中国空间站"天宫"的建成为切入点，介绍了中国航天计划取得的成就。B项最为全面。A项 ISS 只是对比对象，C项和D项文中未涉及。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2023_002',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'What is the altitude of Tiangong\'s orbit?',
    options: [
      '200 kilometers',
      '400 kilometers',
      '600 kilometers',
      '1,000 kilometers'
    ],
    answer: 1,
    explanation: '原文明确提到"orbits Earth at an altitude of about 400 kilometers"，因此B项正确。直接定位原文即可得出答案。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2023_003',
    module: 'reading',
    pointId: 'reading-inference',
    type: 'single-choice',
    difficulty: 3,
    content: 'What makes Tiangong different from the ISS according to the passage?',
    options: [
      'Tiangong orbits at a higher altitude',
      'Tiangong is built and operated by a single country',
      'Tiangong can hold more astronauts',
      'Tiangong was built in a shorter time'
    ],
    answer: 1,
    explanation: '原文指出ISS由多国联合运营（jointly operated by multiple nations），而Tiangong由中国独立建造运营（independently built and operated by China），因此B项正确。A、C、D三项文中均未提及或对比。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 3 }
  },

  // Passage 2: Healthy eating habits
  {
    id: 'eng2023_004',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nA growing number of young people in China are adopting healthier eating habits. According to a survey by China Youth Daily, 68% of respondents said they read nutrition labels before buying food. The most popular healthy food choices include whole grains, fresh vegetables, and high-protein foods. Many young people have also started cooking at home instead of ordering takeout. Nutritionist Zhang Wei says that these habits can help prevent chronic diseases such as diabetes and heart problems.\n\n[注: nutrition label = 营养成分表; whole grains = 全谷物; chronic = 慢性的]\n\nWhat does the survey mainly show?',
    options: [
      'Young people are becoming more health-conscious in their eating',
      'Most Chinese people dislike cooking at home',
      'Takeout food is becoming more popular',
      'Chronic diseases are increasing among teenagers'
    ],
    answer: 0,
    explanation: '调查数据显示68%的年轻人购物前会看营养成分表，且更多人选择健康食品、在家做饭，这些共同说明年轻人越来越关注饮食健康。A项正确。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2023_005',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'What percentage of young people read nutrition labels before buying food?',
    options: [
      '48%',
      '58%',
      '68%',
      '78%'
    ],
    answer: 2,
    explanation: '原文明确提到"68% of respondents said they read nutrition labels before buying food"，因此C项正确。本题考查数字细节的定位能力。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2023_006',
    module: 'reading',
    pointId: 'reading-inference',
    type: 'single-choice',
    difficulty: 3,
    content: 'What can be inferred from Nutritionist Zhang Wei\'s comment?',
    options: [
      'Healthy eating can help prevent certain diseases',
      'Cooking at home takes too much time',
      'Young people are exercising more than before',
      'Diabetes only affects older adults'
    ],
    answer: 0,
    explanation: '营养师张伟提到这些习惯"can help prevent chronic diseases such as diabetes and heart problems"，可推断健康饮食有助于预防某些疾病。B、C、D三项文中均未提及。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 3 }
  },

  // Passage 3: Cultural heritage protection
  {
    id: 'eng2023_007',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nCultural heritage is a bridge connecting the past and the present. In recent years, China has made great efforts to protect its intangible cultural heritage (ICH). As of 2023, China has 43 items inscribed on the UNESCO Intangible Cultural Heritage list, more than any other country in the world. These include Peking opera, calligraphy, and the Dragon Boat Festival. Young people are also getting involved — many learn traditional crafts through online platforms and short videos.\n\n[注: intangible cultural heritage = 非物质文化遗产; inscribe = 列入; calligraphy = 书法]\n\nWhich of the following best describes the tone of this passage?',
    options: [
      'Critical and negative',
      'Informative and positive',
      'Humorous and lighthearted',
      'Doubtful and questioning'
    ],
    answer: 1,
    explanation: '本文客观介绍了中国在非遗保护方面取得的成就，语气是提供信息且积极肯定的（informative and positive）。A项"批评和负面"、C项"幽默轻松"、D项"怀疑质疑"均不符合原文语气。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2023_008',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 2,
    content: 'How many Chinese items are on the UNESCO ICH list as of 2023?',
    options: [
      '33',
      '38',
      '43',
      '53'
    ],
    answer: 2,
    explanation: '原文明确提到"China has 43 items inscribed on the UNESCO Intangible Cultural Heritage list"，故C项正确。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2023_009',
    module: 'reading',
    pointId: 'reading-main-idea',
    type: 'single-choice',
    difficulty: 3,
    content: 'What can be inferred about the involvement of young people in ICH?',
    options: [
      'They show little interest in traditional culture',
      'They prefer learning ICH through traditional methods',
      'They use digital tools to engage with cultural heritage',
      'They are forced to learn traditional crafts by schools'
    ],
    answer: 2,
    explanation: '原文最后一句提到"many learn traditional crafts through online platforms and short videos"，可推断年轻人通过数字工具（在线平台、短视频）参与文化遗产保护。C项正确。A项与原文相反，B项"传统方法"与"online platforms"矛盾，D项"被迫"无依据。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 3 }
  },

  // ---------- 语法填空 · 填空题（4道）----------
  {
    id: 'eng2023_010',
    module: 'grammar',
    pointId: 'grammar-tense',
    type: 'fill-blank',
    difficulty: 2,
    content: 'Complete the sentence with the correct form of the verb.\n\nBy the time you arrive, I ______ (finish) my homework.',
    options: [],
    answer: 'will have finished',
    explanation: '"By the time you arrive"表示将来的时间点，且"完成作业"在此时间点之前完成，故用将来完成时 will have finished。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 2 }
  },
  {
    id: 'eng2023_011',
    module: 'grammar',
    pointId: 'grammar-voice',
    type: 'fill-blank',
    difficulty: 2,
    content: 'Rewrite the sentence in passive voice.\n\nThe government built a new subway line in 2022.\n\nA new subway line ______ in 2022.',
    options: [],
    answer: 'was built',
    explanation: '主动句变被动句：原句宾语"a new subway line"变为主语，动词"built"变为"was built"（一般过去时被动语态），原主语"The government"可省略或由by引出。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 2 }
  },
  {
    id: 'eng2023_012',
    module: 'grammar',
    pointId: 'grammar-clause',
    type: 'fill-blank',
    difficulty: 3,
    content: 'Fill in the blank with the correct conjunction.\n\n______ it was raining heavily, the firefighters continued to rescue people from the flooded buildings.',
    options: [],
    answer: 'Although/Though',
    explanation: '前后句之间为让步关系（"虽然下着大雨，消防员们继续救援"），故用Although或Though引导让步状语从句。注意句首首字母大写。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 3 }
  },
  {
    id: 'eng2023_013',
    module: 'grammar',
    pointId: 'grammar-nonfinite',
    type: 'fill-blank',
    difficulty: 3,
    content: 'Fill in the blank with the correct non-finite form.\n\nI\'m looking forward to ______ (hear) from you soon.',
    options: [],
    answer: 'hearing',
    explanation: '"look forward to"中的"to"为介词，后接动名词形式，故填hearing。这是固定搭配中非谓语动词的用法。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 3 }
  },

  // ---------- 书面表达 · 解答题（2道）----------
  {
    id: 'eng2023_014',
    module: 'writing',
    pointId: 'essay-writing',
    type: 'solution',
    difficulty: 4,
    content: '假设你是李华，你校英语俱乐部将举办一场以"Protecting the Environment"为主题的英语演讲比赛。请你写一篇演讲稿，内容包括：\n1. 环境问题的现状；\n2. 每个人可以做出的努力；\n3. 呼吁大家行动起来。\n\n注意：\n1. 词数120左右；\n2. 可以适当增加细节，以使行文连贯。',
    options: [],
    answer: 'Good afternoon, everyone!\n\nIt\'s my honor to speak here about protecting our environment. As we all know, our planet is facing serious problems such as air pollution, water pollution, and deforestation. These problems threaten not only animals but also our own health and future.\n\nBut what can we do? Actually, small actions make a big difference. We can take public transport instead of driving private cars. We can refuse single-use plastic bags and bring our own shopping bags. We can also save electricity by turning off lights when leaving a room.\n\nLet\'s start from now and do our part. Every small step counts. Together, we can create a greener and cleaner world!\n\nThank you!',
    explanation: '本题为环保主题演讲稿写作。评分要点：1. 格式规范（称呼、开场白、正文、结束语）；2. 覆盖三个内容要点（现状、个人努力、呼吁）；3. 语言有说服力。参考范文使用了排比句（We can...）增强气势，用词贴切。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'writing', difficultyStars: 4 }
  },
  {
    id: 'eng2023_015',
    module: 'writing',
    pointId: 'continuation-writing',
    type: 'solution',
    difficulty: 5,
    content: '阅读下面材料，根据其内容和所给段落开头语续写两段，使之构成一篇完整的短文。\n\nTom was a middle school student who loved playing video games. Every day after school, he would rush home and spend hours in front of the computer screen. His mother often reminded him to do his homework first, but Tom never listened. "I\'ll do it later," he always said.\n\nOne day, his math teacher announced a surprise quiz the next morning. Tom, as usual, spent the whole evening playing games and went to bed without reviewing his lessons. The next day, when he saw the test paper, his mind went blank. He failed the quiz badly.\n\nAfter class, his teacher, Mr. Smith, asked him to stay. "Tom, I know you are a smart boy," Mr. Smith said gently, "but talent without effort is like a bird without wings."\n\n注意：\n1. 续写词数应为150左右；\n2. 请按如下格式作答。\n\nParagraph 1:\nTom felt a deep sense of shame and regret. ______\n\nParagraph 2:\nFrom that day on, Tom decided to change his habits. ______',
    options: [],
    answer: 'Paragraph 1:\nTom felt a deep sense of shame and regret. He looked down at his hands, realizing that they were more familiar with the game controller than with a pen. Tears welled up in his eyes. "I\'m sorry, Mr. Smith," he whispered. "I wasted so much time playing games." Mr. Smith patted him on the shoulder. "It\'s never too late to change," he said with a warm smile. Tom nodded firmly. He knew he had to make a decision — either continue indulging in games or take control of his life.\n\nParagraph 2:\nFrom that day on, Tom decided to change his habits. He made a daily schedule, allocating specific time for homework first and then allowing himself only one hour of gaming. At first, it was difficult. His fingers itched to pick up the controller. But every time he felt the urge, he remembered the feeling of that failed quiz. Gradually, studying became a habit, and Tom found that learning could be just as exciting as gaming. In the final exam, he scored the highest in his class — proof that change, however hard, is always possible.',
    explanation: '本题为读后续写，考查故事情节的合理延续和语言表达能力。评分要点：1. 与原文情节连贯（Tom沉迷游戏、考试失败）；2. 续写内容积极向上（悔改 → 改变 → 成长）；3. 语言生动（心理描写、对话、细节）；4. 两段衔接自然。参考范文通过心理描写和细节刻画了Tom的转变过程。',
    tags: { year: 2023, source: 'gaokao', examArea: 'new', questionType: 'writing', difficultyStars: 5 }
  },

  // ===========================================================
  //  2024 年 · 全国新高考 I 卷
  // ===========================================================

  // ---------- 阅读理解 · 选择题（9道）----------

  // Passage 1: AI and future jobs
  {
    id: 'eng2024_001',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nArtificial intelligence (AI) is changing the job market at an unprecedented speed. A report by the World Economic Forum predicts that by 2025, AI will replace 85 million jobs but also create 97 million new ones. The key is that future jobs will require different skills — especially creativity, critical thinking, and emotional intelligence. Routine tasks will increasingly be automated, while jobs requiring human interaction and complex problem-solving will remain in demand.\n\n[注: unprecedented = 前所未有的; automate = 自动化; emotional intelligence = 情商]\n\nWhat does the report predict about AI\'s impact on jobs?',
    options: [
      'AI will eliminate most jobs worldwide',
      'More jobs will be created than replaced by AI',
      'AI will only affect low-skill jobs',
      'All routine jobs will disappear by 2025'
    ],
    answer: 1,
    explanation: '报告预测AI将取代8500万个岗位，但会创造9700万个新岗位——净增1200万个。B项"AI创造的岗位多于取代的岗位"正确。A项、C项和D项均与原文不符。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2024_002',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'According to the passage, what skills will be important for future jobs?',
    options: [
      'Speed and physical strength',
      'Creativity, critical thinking, and emotional intelligence',
      'Coding and programming only',
      'Memorization and repetition'
    ],
    answer: 1,
    explanation: '原文明确提到"future jobs will require different skills — especially creativity, critical thinking, and emotional intelligence"，因此B项正确。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2024_003',
    module: 'reading',
    pointId: 'reading-inference',
    type: 'single-choice',
    difficulty: 3,
    content: 'What kind of jobs will remain in demand according to the passage?',
    options: [
      'Jobs involving repetitive tasks',
      'Jobs requiring human interaction and complex problem-solving',
      'Jobs that can be fully automated',
      'Jobs in manufacturing only'
    ],
    answer: 1,
    explanation: '原文最后指出"jobs requiring human interaction and complex problem-solving will remain in demand"，B项正确。A项和C项提到的重复性、可自动化的工作恰恰会减少。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 3 }
  },

  // Passage 2: Cross-cultural communication
  {
    id: 'eng2024_004',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nUnderstanding cultural differences is essential in today\'s globalized world. For example, in many Western countries, maintaining eye contact during a conversation shows honesty and confidence. However, in some Asian cultures, too much direct eye contact can be considered disrespectful, especially when talking to elders. Similarly, the concept of personal space varies across cultures. In Latin American countries, people stand closer when talking, while in Northern Europe, larger personal space is preferred.\n\n[注: maintain eye contact = 保持眼神交流; personal space = 个人空间]\n\nWhat is the author\'s purpose in writing this passage?',
    options: [
      'To argue that Western culture is superior',
      'To explain differences in cross-cultural communication',
      'To teach readers how to avoid all communication',
      'To compare Asian and European lifestyles only'
    ],
    answer: 1,
    explanation: '本文通过眼神交流和个人空间的例子，说明不同文化之间存在差异，目的是帮助读者理解跨文化交流中的差异。B项正确。A项有文化偏见，C项不合逻辑，D项以偏概全。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2024_005',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 2,
    content: 'In which culture is direct eye contact considered disrespectful to elders?',
    options: [
      'Latin American culture',
      'Northern European culture',
      'Some Asian cultures',
      'All Western cultures'
    ],
    answer: 2,
    explanation: '原文提到"in some Asian cultures, too much direct eye contact can be considered disrespectful, especially when talking to elders"，故C项正确。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2024_006',
    module: 'reading',
    pointId: 'reading-main-idea',
    type: 'single-choice',
    difficulty: 2,
    content: 'What would be the best title for this passage?',
    options: [
      'How to Make Friends Abroad',
      'Cultural Differences in Communication',
      'The Importance of Eye Contact',
      'Personal Space Around the World'
    ],
    answer: 1,
    explanation: '本文从眼神交流和个人空间两方面举例说明跨文化交流中的文化差异，"Cultural Differences in Communication"最能涵盖全文内容。C项和D项都只是部分内容不足以概括全文。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },

  // Passage 3: Physical exercise and mental health
  {
    id: 'eng2024_007',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nRegular physical exercise does more than just keep your body fit — it also benefits your mental health. A study published in The Lancet Psychiatry found that people who exercise regularly report 43% fewer days of poor mental health than those who do not. The most effective types of exercise for mental health include team sports, cycling, and aerobic activities. Even just 30 minutes of exercise three times a week can make a significant difference in reducing anxiety and depression.\n\n[注: aerobic = 有氧的; anxiety = 焦虑; depression = 抑郁]\n\nWhat is the main finding of the study mentioned in the passage?',
    options: [
      'Exercise only benefits physical health',
      'People who exercise have better mental health',
      'Team sports are the only effective exercise',
      'Exercise has no effect on depression'
    ],
    answer: 1,
    explanation: '研究发现经常运动的人心理健康状况较差的天数比不运动的人少43%，因此B项"运动的人心理健康更好"正确。A项和D项与研究发现矛盾，C项"唯一有效"过于绝对。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2024_008',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'How many minutes of exercise per week are suggested to improve mental health?',
    options: [
      '30 minutes once a week',
      '30 minutes three times a week',
      '60 minutes every day',
      '90 minutes once a week'
    ],
    answer: 1,
    explanation: '原文提到"just 30 minutes of exercise three times a week can make a significant difference"，即每周三次、每次30分钟的运动即可见效。B项正确。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2024_009',
    module: 'reading',
    pointId: 'reading-inference',
    type: 'single-choice',
    difficulty: 3,
    content: 'What can be inferred about team sports from the passage?',
    options: [
      'They are less effective than individual sports',
      'They are among the most beneficial exercises for mental health',
      'They require professional training',
      'They are not suitable for people with anxiety'
    ],
    answer: 1,
    explanation: '原文提到"the most effective types of exercise for mental health include team sports, cycling, and aerobic activities"，可推断团队运动是心理健康最有效的运动类型之一。B项正确。A项与原文相反，C项和D项文中未提及。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 3 }
  },

  // ---------- 语法填空 · 填空题（4道）----------
  {
    id: 'eng2024_010',
    module: 'grammar',
    pointId: 'grammar-tense',
    type: 'fill-blank',
    difficulty: 2,
    content: 'Complete the sentence with the correct form of the verb.\n\nI ______ (not see) my best friend since we graduated from high school three years ago.',
    options: [],
    answer: 'haven\'t seen',
    explanation: '"since we graduated"表示从过去持续到现在的时间段，且强调对现在的影响（至今未见面），故用现在完成时 haven\'t seen。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 2 }
  },
  {
    id: 'eng2024_011',
    module: 'grammar',
    pointId: 'grammar-voice',
    type: 'fill-blank',
    difficulty: 2,
    content: 'Complete the sentence with the correct passive form.\n\nMore trees should ______ (plant) every year to improve air quality in cities.',
    options: [],
    answer: 'be planted',
    explanation: '情态动词should后接动词原形，主语"More trees"与"plant"为被动关系，故用should be planted（含情态动词的被动语态）。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 2 }
  },
  {
    id: 'eng2024_012',
    module: 'grammar',
    pointId: 'grammar-clause',
    type: 'fill-blank',
    difficulty: 3,
    content: 'Combine the two sentences using an attributive clause.\n\nI visited a small village. The village was famous for its beautiful scenery.\n\nI visited a small village ______ was famous for its beautiful scenery.',
    options: [],
    answer: 'which/that',
    explanation: '先行词为"a small village"指物，在定语从句中作主语，可用which或that引导定语从句。关系代词在从句中作主语时不可省略。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 3 }
  },
  {
    id: 'eng2024_013',
    module: 'grammar',
    pointId: 'grammar-nonfinite',
    type: 'fill-blank',
    difficulty: 3,
    content: 'Fill in the blank with the correct non-finite form.\n\nThe teacher encouraged us ______ (speak) English as much as possible.',
    options: [],
    answer: 'to speak',
    explanation: '"encourage sb. to do sth."为固定搭配，意为"鼓励某人做某事"，故用不定式 to speak。这是非谓语动词中不定式作宾语补足语的用法。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 3 }
  },

  // ---------- 书面表达 · 解答题（2道）----------
  {
    id: 'eng2024_014',
    module: 'writing',
    pointId: 'letter-writing',
    type: 'solution',
    difficulty: 3,
    content: '假定你是李华，你的英国笔友Tom来信说他最近在学习中文时遇到了困难——他觉得中文的声调（tones）很难掌握。请你给他写一封回信，内容包括：\n1. 表示理解和鼓励；\n2. 分享你学习英语时克服困难的经验；\n3. 提出学习中文声调的建议。\n\n注意：\n1. 词数100左右；\n2. 可以适当增加细节，以使行文连贯。',
    options: [],
    answer: 'Dear Tom,\n\nI\'m sorry to hear that you\'re having trouble with Chinese tones. Don\'t worry — it\'s completely normal for beginners!\n\nI remember when I was learning English pronunciation, I also found it very difficult at first. What helped me was practicing every day and not being afraid to make mistakes. For Chinese tones, I suggest listening to native speakers and imitating their pronunciation. You can also try using language learning apps that focus on tones. Practice makes perfect!\n\nKeep going! I believe you will make progress soon.\n\nYours,\nLi Hua',
    explanation: '本题为建议鼓励类书信写作。评分要点：1. 书信格式完整；2. 包含鼓励、分享经验和提出建议三个内容层次；3. 语气友善、真诚。参考范文使用了"Don\'t worry"、"Keep going"等鼓励性语言，态度积极。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'writing', difficultyStars: 3 }
  },
  {
    id: 'eng2024_015',
    module: 'writing',
    pointId: 'continuation-writing',
    type: 'solution',
    difficulty: 5,
    content: '阅读下面材料，根据其内容和所给段落开头语续写两段，使之构成一篇完整的短文。\n\nIt was a cold winter morning. Lily, a high school student, was on her way to school when she noticed an old man sitting on the sidewalk, shivering in the wind. He wore a thin jacket and held a small cardboard sign that read: "Hungry. Anything helps."\n\nLily hesitated. She had only 20 yuan with her — enough for lunch and the bus fare home. She looked at the old man\'s tired eyes and then at the nearby breakfast shop. After a moment\'s thought, she made a decision.\n\n注意：\n1. 续写词数应为150左右；\n2. 请按如下格式作答。\n\nParagraph 1:\nLily walked into the breakfast shop and bought a hot bowl of porridge and two steamed buns. ______\n\nParagraph 2:\nWhen Lily arrived at school, she found a note from her mother in her schoolbag. ______',
    options: [],
    answer: 'Paragraph 1:\nLily walked into the breakfast shop and bought a hot bowl of porridge and two steamed buns. She hurried back to the old man and gently handed the food to him. "Please eat this, Grandpa. It will warm you up," she said softly. The old man looked up, his eyes shining with gratitude. "Thank you, child. May you be blessed," he said in a trembling voice. Lily smiled and felt a warmth in her heart that was stronger than any winter cold. She knew she had done the right thing, even though she would now have to walk home and skip lunch.\n\nParagraph 2:\nWhen Lily arrived at school, she found a note from her mother in her schoolbag. The note read: "Dear Lily, I know you forgot your lunch money, so I put an extra 50 yuan in your bag. Have a good day! Love, Mom." Tears of joy filled Lily\'s eyes. She realized that kindness had a way of coming back when you least expected it. At that moment, she understood that even small acts of kindness could create ripples of warmth that touched everyone involved.',
    explanation: '本题为读后续写，考查故事情节延续和主题升华。评分要点：1. 内容与首句衔接自然；2. 情节合理——Lily买了食物给老人，后段发现母亲放了额外零用钱；3. 主题积极——"善有善报"的回环设计；4. 语言生动，细节描写丰富。',
    tags: { year: 2024, source: 'gaokao', examArea: 'new', questionType: 'writing', difficultyStars: 5 }
  },

  // ===========================================================
  //  2025 年 · 全国新高考 I 卷
  // ===========================================================

  // ---------- 阅读理解 · 选择题（9道）----------

  // Passage 1: The power of reading
  {
    id: 'eng2025_001',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nReading is not just a hobby — it is a powerful tool for personal growth. Studies show that regular reading improves vocabulary, enhances empathy, and reduces stress. A 15-year study conducted by Yale University found that people who read books for 30 minutes a day lived an average of two years longer than non-readers. Dr. Chen, a Chinese educator, points out that in the digital age, the habit of deep reading is more important than ever. "Reading trains the mind to focus and think critically," she says.\n\n[注: empathy = 共情能力; digital age = 数字时代]\n\nAccording to the Yale study, what benefit does daily reading bring?',
    options: [
      'It helps people make more money',
      'It can lead to a longer lifespan',
      'It improves physical fitness',
      'It guarantees academic success'
    ],
    answer: 1,
    explanation: '耶鲁大学的研究发现每天读书30分钟的人平均寿命比不读书的人长两年，因此B项"延长寿命"正确。其他选项文中均未提及。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2025_002',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'How long did the Yale study last?',
    options: [
      '5 years',
      '10 years',
      '15 years',
      '20 years'
    ],
    answer: 2,
    explanation: '原文明确指出"A 15-year study conducted by Yale University"，因此该研究持续了15年。C项正确。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2025_003',
    module: 'reading',
    pointId: 'reading-inference',
    type: 'single-choice',
    difficulty: 3,
    content: 'What does Dr. Chen imply about the digital age?',
    options: [
      'Deep reading is becoming less important',
      'People are reading more books than ever',
      'The ability to focus is increasingly valuable',
      'Digital devices should be banned in schools'
    ],
    answer: 2,
    explanation: '陈博士指出"in the digital age, the habit of deep reading is more important than ever"且"Reading trains the mind to focus and think critically"，由此可推断在信息碎片化的数字时代，专注力越来越珍贵。C项正确。A项与原文相反，B项和D项文中未提及。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 3 }
  },

  // Passage 2: Online learning
  {
    id: 'eng2025_004',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nOnline learning has experienced explosive growth in China. According to the Ministry of Education, the number of online education users reached 400 million in 2024. Platforms such as DingTalk and Tencent Meeting have become essential tools for both students and teachers. While online learning offers flexibility and convenience, it also presents challenges — including screen fatigue, lack of face-to-face interaction, and the need for self-discipline. Educators suggest a blended approach that combines online and offline learning for the best results.\n\n[注: explosive growth = 爆炸式增长; screen fatigue = 屏幕疲劳; self-discipline = 自律]\n\nWhich of the following is NOT mentioned as a challenge of online learning?',
    options: [
      'Screen fatigue',
      'Lack of face-to-face interaction',
      'High cost of devices',
      'Need for self-discipline'
    ],
    answer: 2,
    explanation: '原文列出的挑战包括"screen fatigue"（屏幕疲劳）、"lack of face-to-face interaction"（缺乏面对面交流）、"the need for self-discipline"（需要自律），并未提到"设备成本高"。故C项为本题答案。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2025_005',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'How many online education users were there in China in 2024?',
    options: [
      '300 million',
      '400 million',
      '500 million',
      '600 million'
    ],
    answer: 1,
    explanation: '原文明确提到"the number of online education users reached 400 million in 2024"，故B项正确。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2025_006',
    module: 'reading',
    pointId: 'reading-inference',
    type: 'single-choice',
    difficulty: 3,
    content: 'What approach do educators recommend based on the passage?',
    options: [
      'Complete online learning only',
      'Complete offline learning only',
      'A combination of online and offline learning',
      'Reducing the use of all digital tools'
    ],
    answer: 2,
    explanation: '原文最后提到"Educators suggest a blended approach that combines online and offline learning"，即混合式学习模式。C项正确。A项和B项都过于极端。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 3 }
  },

  // Passage 3: Panda conservation
  {
    id: 'eng2025_007',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nChina has achieved remarkable success in giant panda conservation. According to the National Forestry and Grassland Administration, the wild panda population has increased from about 1,100 in the 1980s to over 1,900 in 2024. The International Union for Conservation of Nature (IUCN) has downgraded the panda\'s status from "endangered" to "vulnerable." This achievement is largely due to China\'s efforts in establishing nature reserves and bamboo forest restoration projects. Panda conservation has also driven economic growth in local communities through ecotourism.\n\n[注: conservation = 保护; downgrade = 降级; vulnerable = 易危的; ecotourism = 生态旅游]\n\nWhat is the author\'s attitude toward panda conservation efforts?',
    options: [
      'Negative and critical',
      'Neutral and objective',
      'Positive and supportive',
      'Doubtful and uncertain'
    ],
    answer: 2,
    explanation: '作者使用"remarkable success"（显著成功）、"achievement"等积极词汇，并列举了熊猫数量增加、保护等级下降等事实，表明作者对熊猫保护工作持积极支持态度。C项正确。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2025_008',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'What was the wild panda population in the 1980s?',
    options: [
      'About 900',
      'About 1,100',
      'About 1,500',
      'About 1,900'
    ],
    answer: 1,
    explanation: '原文明确提到"the wild panda population has increased from about 1,100 in the 1980s to over 1,900 in 2024"，因此20世纪80年代约为1100只。B项正确。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2025_009',
    module: 'reading',
    pointId: 'reading-main-idea',
    type: 'single-choice',
    difficulty: 2,
    content: 'What is the main purpose of this passage?',
    options: [
      'To introduce panda\'s eating habits',
      'To report on the success of panda conservation',
      'To encourage people to visit panda reserves',
      'To compare pandas with other endangered animals'
    ],
    answer: 1,
    explanation: '本文围绕大熊猫保护取得的成就展开——种群数量增加、保护等级下调、保护措施及其附带效益，因此B项"报告大熊猫保护的成功"最准确。A项、C项和D项均偏题。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },

  // ---------- 语法填空 · 填空题（4道）----------
  {
    id: 'eng2025_010',
    module: 'grammar',
    pointId: 'grammar-tense',
    type: 'fill-blank',
    difficulty: 2,
    content: 'Complete the sentence with the correct form of the verb.\n\nListen! Someone ______ (play) the piano in the next room. It sounds beautiful!',
    options: [],
    answer: 'is playing',
    explanation: '"Listen!"提示动作正在发生，故用现在进行时 is playing，表示"正在弹钢琴"。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 2 }
  },
  {
    id: 'eng2025_011',
    module: 'grammar',
    pointId: 'grammar-nonfinite',
    type: 'fill-blank',
    difficulty: 3,
    content: 'Fill in the blank with the correct non-finite form.\n\n______ (compare) with traditional cars, electric cars are more environmentally friendly.',
    options: [],
    answer: 'Compared',
    explanation: '主语"electric cars"与"compare"为被动关系（被与...相比），故用过去分词Compared作状语。此为固定结构"Compared with...（与...相比）"。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 3 }
  },
  {
    id: 'eng2025_012',
    module: 'grammar',
    pointId: 'grammar-clause',
    type: 'fill-blank',
    difficulty: 3,
    content: 'Fill in the blank with the correct word.\n\nThe reason ______ he was late was that he got stuck in a traffic jam.',
    options: [],
    answer: 'why',
    explanation: '"The reason"为先行词，定语从句中缺少原因状语，故用关系副词why引导定语从句。注意reason后常用why或for which引导从句。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 3 }
  },
  {
    id: 'eng2025_013',
    module: 'grammar',
    pointId: 'grammar-voice',
    type: 'fill-blank',
    difficulty: 2,
    content: 'Complete the sentence with the correct passive form.\n\nAll the tickets for the concert ______ (sell) out within two hours yesterday.',
    options: [],
    answer: 'were sold',
    explanation: '主语"All the tickets"与"sell"为被动关系（票被售出），且时间状语"yesterday"为过去时间，故用一般过去时的被动语态 were sold。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 2 }
  },

  // ---------- 书面表达 · 解答题（2道）----------
  {
    id: 'eng2025_014',
    module: 'writing',
    pointId: 'letter-writing',
    type: 'solution',
    difficulty: 3,
    content: '假定你是李华，你的美国朋友Sarah在你生日时送了你一本英文小说作为礼物。请你给她写一封感谢信，内容包括：\n1. 收到礼物并表达感谢；\n2. 说明你对该书的喜爱；\n3. 回赠一份具有中国特色的礼物并说明其意义。\n\n注意：\n1. 词数100左右；\n2. 可以适当增加细节，以使行文连贯。',
    options: [],
    answer: 'Dear Sarah,\n\nI hope this message finds you well. I\'m writing to express my heartfelt thanks for the wonderful novel you sent me for my birthday! I absolutely love it — the story is so engaging, and it helps me improve my English at the same time.\n\nIn return, I\'ve sent you a Chinese paper-cutting artwork (剪纸) by express mail. It features a beautiful dragon, which symbolizes good luck and strength in Chinese culture. I hope you like it as much as I love your gift!\n\nLooking forward to hearing from you soon.\n\nYours,\nLi Hua',
    explanation: '本题为感谢信写作。评分要点：1. 书信格式完整；2. 包含感谢、评价礼物和回赠礼物三个内容要点；3. 语气真诚、亲切；4. 回赠礼物的文化含义解释清晰。参考范文使用了heartfelt thanks等真诚表达，并对剪纸的文化意义做了说明。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'writing', difficultyStars: 3 }
  },
  {
    id: 'eng2025_015',
    module: 'writing',
    pointId: 'continuation-writing',
    type: 'solution',
    difficulty: 5,
    content: '阅读下面材料，根据其内容和所给段落开头语续写两段，使之构成一篇完整的短文。\n\nIn a small town in Sichuan, there was a traditional noodle shop called "Grandma\'s Noodles." The shop was famous for its hand-pulled noodles, a recipe that had been passed down through four generations. However, business had been declining recently because more and more young people preferred fast food.\n\nXiaoming, the grandson of the owner, was a college student studying business. During his summer break, he noticed that his grandmother looked worried. "Business is getting worse," she sighed. "Soon, no one will remember the taste of real hand-pulled noodles."\n\nXiaoming decided to help. He had an idea — why not use what he learned at school to save the family business?\n\n注意：\n1. 续写词数应为150左右；\n2. 请按如下格式作答。\n\nParagraph 1:\nXiaoming started by creating a short video about the noodle-making process. ______\n\nParagraph 2:\nA month later, the shop was busier than ever before. ______',
    options: [],
    answer: 'Paragraph 1:\nXiaoming started by creating a short video about the noodle-making process. He filmed his grandmother skillfully pulling the dough — stretching, folding, and twisting it into thin, springy noodles. The video captured the steam rising from the pot and the warm smiles of the customers. He uploaded it on a popular short-video platform with the title: "The Taste of Home: Four Generations of Hand-Pulled Noodles." Within days, the video went viral, receiving millions of views. People from all over the country commented that they wanted to visit the shop.\n\nParagraph 2:\nA month later, the shop was busier than ever before. Long lines stretched outside the door every day. Many young people who had previously preferred fast food came to experience the traditional craft. Xiaoming also set up an online ordering system and a delivery service. The shop\'s income tripled, and Xiaoming\'s grandmother couldn\'t stop smiling. "You\'ve not only saved the shop," she said with tears of joy, "but also kept our family tradition alive." Xiaoming realized that tradition and innovation could go hand in hand.',
    explanation: '本题为读后续写，考查创意延续和主题升华。评分要点：1. 第一段紧扣"短视频"展开，描述细节生动；2. 第二段与前文呼应，展现线上线下结合的新模式；3. 主题突出传统文化与现代创新结合；4. 语言丰富，使用了分词短语、定语从句等高级表达。',
    tags: { year: 2025, source: 'gaokao', examArea: 'new', questionType: 'writing', difficultyStars: 5 }
  },

  // ===========================================================
  //  2026 年 · 全国新高考 I 卷
  // ===========================================================

  // ---------- 阅读理解 · 选择题（9道）----------

  // Passage 1: Volunteering
  {
    id: 'eng2026_001',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nVolunteering has become increasingly popular among Chinese youth. According to the China Youth Volunteer Association, over 200 million young people have registered as volunteers. They participate in various activities — from teaching in rural areas to helping at major events like the Beijing Winter Olympics. Research shows that volunteering not only benefits society but also helps volunteers develop leadership skills and gain a sense of fulfillment. "Volunteering opened my eyes to a different world," says Zhang Wei, a university student who taught English in a village school last summer.\n\n[注: register = 注册; fulfillment = 成就感]\n\nWhat is the passage mainly about?',
    options: [
      'The types of volunteer activities',
      'The popularity and benefits of volunteering among Chinese youth',
      'How to become a volunteer in China',
      'The history of the China Youth Volunteer Association'
    ],
    answer: 1,
    explanation: '本文主要介绍了中国青年参与志愿活动的普及程度（2亿注册志愿者）、活动范围以及志愿服务的益处，因此B项最全面。A项、C项和D项都只是部分内容。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2026_002',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'How many young volunteers have registered in China according to the passage?',
    options: [
      '100 million',
      '150 million',
      '200 million',
      '250 million'
    ],
    answer: 2,
    explanation: '原文提到"over 200 million young people have registered as volunteers"，故C项正确。本题考查数字细节。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2026_003',
    module: 'reading',
    pointId: 'reading-inference',
    type: 'single-choice',
    difficulty: 3,
    content: 'What does Zhang Wei\'s experience suggest about volunteering?',
    options: [
      'It is only suitable for university students',
      'It builds character and broadens horizons',
      'It is a waste of time for career development',
      'It only helps others but not the volunteer'
    ],
    answer: 1,
    explanation: '张伟说"Volunteering opened my eyes to a different world"（开阔眼界），且前文提到volunteering helps develop leadership skills and gain a sense of fulfillment，可推断志愿服务有助于塑造品格、开阔视野。B项正确。A项过于局限，C项和D项与原文矛盾。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 3 }
  },

  // Passage 2: Sustainable cities
  {
    id: 'eng2026_004',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nAs urban populations continue to grow, the concept of "sponge cities" has gained attention in China. A sponge city is designed to absorb, store, and reuse rainwater, reducing the risk of urban flooding. Instead of traditional concrete drainage systems, sponge cities use green roofs, rain gardens, and permeable pavements. According to the Ministry of Housing and Urban-Rural Development, as of 2025, 30 pilot cities have implemented sponge city projects, covering over 20% of their urban areas with green infrastructure.\n\n[注: sponge city = 海绵城市; permeable pavement = 透水路面; infrastructure = 基础设施]\n\nWhat is a "sponge city" designed to do?',
    options: [
      'Increase concrete construction in cities',
      'Absorb, store, and reuse rainwater',
      'Replace all old buildings with new ones',
      'Reduce the population of urban areas'
    ],
    answer: 1,
    explanation: '原文明确定义海绵城市是"designed to absorb, store, and reuse rainwater, reducing the risk of urban flooding"，故B项正确。A项"增加混凝土建筑"与海绵城市理念相反。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2026_005',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 1,
    content: 'How many pilot cities have implemented sponge city projects?',
    options: [
      '20',
      '25',
      '30',
      '35'
    ],
    answer: 2,
    explanation: '原文明确指出"30 pilot cities have implemented sponge city projects"，故C项正确。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 1 }
  },
  {
    id: 'eng2026_006',
    module: 'reading',
    pointId: 'reading-main-idea',
    type: 'single-choice',
    difficulty: 2,
    content: 'Which of the following would be the best title for this passage?',
    options: [
      'Sponge Cities: A Solution to Urban Flooding',
      'The History of Urban Development in China',
      'Traditional vs Modern Drainage Systems',
      'How to Build a Green Roof'
    ],
    answer: 0,
    explanation: '本文围绕海绵城市这一应对城市内涝的解决方案展开，A项"海绵城市：应对城市内涝的方案"准确概括了全文主旨。B项范围太大，C项和D项仅为文中部分细节。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },

  // Passage 3: Lifelong learning
  {
    id: 'eng2026_007',
    module: 'reading',
    pointId: 'reading-comprehension',
    type: 'single-choice',
    difficulty: 2,
    content: 'Read the following passage and choose the best answer.\n\nIn a rapidly changing world, lifelong learning has become not just an option but a necessity. A report by McKinsey Global Institute suggests that by 2030, up to 375 million workers worldwide may need to switch occupational categories due to automation. The good news is that learning new skills has never been easier. Online platforms offer courses in everything from data science to traditional Chinese painting. Many companies now provide continuous training programs, and some even offer study leave for employees.\n\n[注: lifelong learning = 终身学习; occupational = 职业的; automation = 自动化]\n\nWhy does the author say lifelong learning is a "necessity"?',
    options: [
      'Because traditional education is no longer available',
      'Because the job market is changing due to automation',
      'Because all jobs require advanced degrees',
      'Because online courses are free of charge'
    ],
    answer: 1,
    explanation: '报告指出到2030年将有多达3.75亿劳动者因自动化需要转换职业类别，这表明就业市场正在发生变化，因此终身学习成为必需。B项正确。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2026_008',
    module: 'reading',
    pointId: 'reading-detail',
    type: 'single-choice',
    difficulty: 2,
    content: 'What does the McKinsey report predict about workers by 2030?',
    options: [
      'Most workers will retire early',
      'Up to 375 million workers may need to change careers',
      'All workers will need to learn programming',
      'Automation will create more jobs than it replaces'
    ],
    answer: 1,
    explanation: '原文提到"up to 375 million workers worldwide may need to switch occupational categories due to automation"，故B项正确。注意区分此题与2024年AI话题题目的不同角度。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 2 }
  },
  {
    id: 'eng2026_009',
    module: 'reading',
    pointId: 'reading-inference',
    type: 'single-choice',
    difficulty: 3,
    content: 'What can be inferred about companies mentioned in the passage?',
    options: [
      'They are unwilling to invest in employee training',
      'They recognize the importance of continuous learning',
      'They require employees to study during holidays only',
      'They prefer hiring experienced workers over fresh graduates'
    ],
    answer: 1,
    explanation: '原文提到"Many companies now provide continuous training programs, and some even offer study leave for employees"，可推断公司认识到持续学习的重要性，愿意为员工提供学习支持。B项正确。A项与原文相反。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'reading', difficultyStars: 3 }
  },

  // ---------- 语法填空 · 填空题（4道）----------
  {
    id: 'eng2026_010',
    module: 'grammar',
    pointId: 'grammar-tense',
    type: 'fill-blank',
    difficulty: 2,
    content: 'Complete the sentence with the correct form of the verb.\n\nWhen I got home last night, my mother ______ (cook) dinner in the kitchen.',
    options: [],
    answer: 'was cooking',
    explanation: '"When I got home last night"为过去的时间点，母亲"正在做饭"表示过去某个时刻正在进行的动作，故用过去进行时 was cooking。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 2 }
  },
  {
    id: 'eng2026_011',
    module: 'grammar',
    pointId: 'grammar-nonfinite',
    type: 'fill-blank',
    difficulty: 3,
    content: 'Fill in the blank with the correct non-finite form.\n\nI am considering ______ (take) a gap year to travel and explore the world.',
    options: [],
    answer: 'taking',
    explanation: '"consider doing sth."为固定搭配，意为"考虑做某事"，后接动名词形式，故填taking。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 3 }
  },
  {
    id: 'eng2026_012',
    module: 'grammar',
    pointId: 'grammar-clause',
    type: 'fill-blank',
    difficulty: 3,
    content: 'Fill in the blank with the correct word.\n\n______ hard the task may be, we will never give up until we succeed.',
    options: [],
    answer: 'However',
    explanation: '本题考查however引导的让步状语从句。"However + adj./adv. + 主语 + 谓语"意为"无论...多么..."，此处However hard意为"无论任务有多困难"。注意句首首字母大写。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 3 }
  },
  {
    id: 'eng2026_013',
    module: 'grammar',
    pointId: 'grammar-voice',
    type: 'fill-blank',
    difficulty: 2,
    content: 'Complete the sentence with the correct form.\n\nMuch progress ______ (make) in the field of AI since 2020.',
    options: [],
    answer: 'has been made',
    explanation: '"progress"与"make"为被动关系（进步被取得），"since 2020"表示从过去持续到现在，故用现在完成时的被动语态 has been made。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'grammar', difficultyStars: 2 }
  },

  // ---------- 书面表达 · 解答题（2道）----------
  {
    id: 'eng2026_014',
    module: 'writing',
    pointId: 'essay-writing',
    type: 'solution',
    difficulty: 4,
    content: '假设你是李华，你校正在开展"建设绿色校园"（Green Campus）活动。请你向学校英文报投稿，倡议同学们积极参与。内容包括：\n1. 绿色校园的重要性；\n2. 具体可行的做法（如节约资源、垃圾分类、植绿护绿等）；\n3. 发出号召。\n\n注意：\n1. 词数120左右；\n2. 可以适当增加细节，以使行文连贯。',
    options: [],
    answer: 'Building a Green Campus\n\nOur school is launching a "Green Campus" campaign, and I strongly believe every student should take part. A green campus not only provides a beautiful learning environment but also helps us develop eco-friendly habits that last a lifetime.\n\nWhat can we do? First, we should save resources — turn off lights and fans when leaving classrooms, and avoid wasting water. Second, we need to sort waste properly. Recycling paper, plastic, and glass makes a big difference. Third, we can plant more trees and flowers around the campus to make it greener.\n\nLet\'s take action now! Small efforts from each of us will add up to a big change. Together, we can make our campus a greener and better place!',
    explanation: '本题为倡议书/投稿写作。评分要点：1. 格式正确（有标题、正文）；2. 内容完整（重要性、做法、号召三个层次）；3. 语言有说服力。参考范文使用了First/Second/Third等清晰的结构词，增强条理性。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'writing', difficultyStars: 4 }
  },
  {
    id: 'eng2026_015',
    module: 'writing',
    pointId: 'continuation-writing',
    type: 'solution',
    difficulty: 5,
    content: '阅读下面材料，根据其内容和所给段落开头语续写两段，使之构成一篇完整的短文。\n\nEmma was a shy girl who had always been afraid of speaking in public. Whenever she had to answer a question in class, her face would turn red and her voice would tremble. Her teacher, Ms. Wang, noticed this and wanted to help.\n\nOne day, Ms. Wang announced that each student would give a three-minute presentation about their favorite book. Emma\'s heart sank. She spent the whole week worrying. She practiced in front of the mirror every night, but she still felt terrified.\n\nOn the day of the presentation, Emma stood in front of the class, her hands shaking. She took a deep breath and began to speak.\n\n注意：\n1. 续写词数应为150左右；\n2. 请按如下格式作答。\n\nParagraph 1:\nAt first, Emma\'s voice was barely a whisper. ______\n\nParagraph 2:\nWhen Emma finished her presentation, the classroom was silent for a moment. ______',
    options: [],
    answer: 'Paragraph 1:\nAt first, Emma\'s voice was barely a whisper. She could feel her heart pounding and her palms sweating. But then she remembered Ms. Wang\'s words: "Everyone has a fear of something. Courage is not the absence of fear, but the determination to move forward despite it." She looked at Ms. Wang, who gave her an encouraging nod. Emma took another deep breath and focused on the story of her favorite book — The Little Prince. Gradually, her voice grew steadier and louder. She forgot about her fear and became absorbed in sharing the beautiful story.\n\nParagraph 2:\nWhen Emma finished her presentation, the classroom was silent for a moment. Then, suddenly, the whole class burst into applause. Ms. Wang was smiling with tears in her eyes. "That was wonderful, Emma," she said. "I\'m so proud of you." Emma felt a warm glow spreading through her chest. She realized that stepping out of her comfort zone was not as scary as she had imagined. From that day on, Emma was no longer afraid to speak in class. She had discovered the courage within herself — and it was much stronger than she had ever believed.',
    explanation: '本题为读后续写，考查心理描写和成长主题。评分要点：1. 第一段刻画从紧张到自信的心理变化过程；2. 第二段展现演讲后的成功体验和成长感悟；3. 主题积极——勇气不是没有恐惧，而是面对恐惧坚持前行；4. 语言生动，使用了心理描写和细节刻画。',
    tags: { year: 2026, source: 'gaokao', examArea: 'new', questionType: 'writing', difficultyStars: 5 }
  }
]
