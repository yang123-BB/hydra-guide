/**
 * AI 生成的英语题目（补充题库）
 * 覆盖语法、词汇、完形填空、阅读理解、七选五、写作六大模块，共 30 道题
 * ID: e031 - e060
 */

export const englishGeneratedQuestions = [
  // ===== 语法 Grammar =====

  {
    id: 'e031', subject: 'english', module: 'grammar', pointId: 'tense-voice',
    type: 'single-choice', difficulty: 1,
    content: 'By the time he arrived at the station, the train ______.',
    options: ['had left', 'has left', 'was leaving', 'would leave'],
    answer: 0,
    explanation: '考查过去完成时。"by the time + 一般过去时"结构中，主句用过去完成时，表示在过去某个时间点之前已经完成的动作。火车离开发生在到达车站之前，故选 had left。',
  },

  {
    id: 'e032', subject: 'english', module: 'grammar', pointId: 'tense-voice',
    type: 'single-choice', difficulty: 2,
    content: 'The novel ______ into more than thirty languages since it was published in 2010.',
    options: ['has been translated', 'was translated', 'had been translated', 'is translated'],
    answer: 0,
    explanation: '考查现在完成时的被动语态。since 引导的时间状语从句表示从 2010 年至今，主句应用现在完成时；小说与"翻译"之间为被动关系，故用现在完成时的被动语态 has been translated。',
  },

  {
    id: 'e033', subject: 'english', module: 'grammar', pointId: 'non-finite',
    type: 'single-choice', difficulty: 3,
    content: '______ from the top of the hill, the whole city looks like a beautiful garden.',
    options: ['Seen', 'Seeing', 'To see', 'Having seen'],
    answer: 0,
    explanation: '考查非谓语动词作状语。句意为"从山顶看下去，整座城市像一个美丽的花园"。城市与"看"之间是被动关系（城市被看），故用过去分词 Seen 作状语。现在分词表示主动，不定式表示目的，均不符合语境。',
  },

  {
    id: 'e034', subject: 'english', module: 'grammar', pointId: 'clauses',
    type: 'single-choice', difficulty: 4,
    content: '______ matters most in learning a foreign language is not how much time you spend, but how you spend it.',
    options: ['What', 'That', 'Which', 'As'],
    answer: 0,
    explanation: '考查主语从句。句意为"在外语学习中最重要的不是你花了多少时间，而是你如何利用时间"。主语从句中 matters 缺少主语，故用 What 引导，What 在从句中作主语，同时充当整个主语从句的连接词。That 在名词性从句中不充当成分且无实际意义，不符合此处需要主语的要求。',
  },

  {
    id: 'e035', subject: 'english', module: 'grammar', pointId: 'modal-virtual',
    type: 'single-choice', difficulty: 5,
    content: 'I would rather you ______ him about the bad news yesterday. It only made him more upset.',
    options: ["hadn't told", "didn't tell", "wouldn't tell", 'not tell'],
    answer: 0,
    explanation: '考查 would rather 的虚拟语气。would rather 后接从句时，对过去情况的虚拟用过去完成时（had + 过去分词）。由 yesterday 可知表示对过去的虚拟，故用 hadn\'t told，表示"宁愿你昨天没有告诉他那个坏消息"。',
  },

  // ===== 词汇 Vocabulary =====

  {
    id: 'e036', subject: 'english', module: 'vocabulary', pointId: 'word-discrimination',
    type: 'single-choice', difficulty: 1,
    content: 'The new policy has a positive ______ on the local economy.',
    options: ['effect', 'affect', 'effort', 'afford'],
    answer: 0,
    explanation: '考查形近词辨析。have a positive effect on 为固定搭配，意为"对……有积极影响"，此处需要名词。affect 为动词"影响"，effort 为"努力"，afford 为"负担得起"，均不符合语法和语义要求。',
  },

  {
    id: 'e037', subject: 'english', module: 'vocabulary', pointId: 'word-discrimination',
    type: 'single-choice', difficulty: 2,
    content: 'The teacher tried to ______ the students\' interest in science by organizing hands-on experiments.',
    options: ['stimulate', 'imitate', 'simulate', 'accumulate'],
    answer: 0,
    explanation: '考查形近动词辨析。stimulate interest 意为"激发兴趣"，符合语境"老师通过组织动手实验来激发学生对科学的兴趣"。imitate"模仿"，simulate"模拟"，accumulate"积累"，均不符合语义。',
  },

  {
    id: 'e038', subject: 'english', module: 'vocabulary', pointId: 'phrases',
    type: 'single-choice', difficulty: 3,
    content: '— I\'m really nervous about tomorrow\'s presentation.\n— ______. You\'ve prepared well and I\'m sure you\'ll do great.',
    options: ['Take it easy', 'Take your time', 'Take it for granted', 'Take it apart'],
    answer: 0,
    explanation: '考查短语辨析。Take it easy 意为"别紧张，放轻松"，符合语境中对方表示紧张时给予安慰的情境。Take your time"别着急，慢慢来"强调时间充裕，Take it for granted"理所当然"，Take it apart"拆开"，均不符合安慰紧张情绪的语境。',
  },

  {
    id: 'e039', subject: 'english', module: 'vocabulary', pointId: 'phrases',
    type: 'single-choice', difficulty: 4,
    content: 'Despite the heavy rain, the organizers decided not to call ______ the outdoor concert.',
    options: ['off', 'out', 'up', 'for'],
    answer: 0,
    explanation: '考查 call 短语辨析。call off 意为"取消"，符合语境"尽管下大雨，组织者决定不取消户外音乐会"。call out"大声叫喊"，call up"打电话给/征召"，call for"需要/要求"，均不符合语境。',
  },

  {
    id: 'e040', subject: 'english', module: 'vocabulary', pointId: 'word-formation',
    type: 'single-choice', difficulty: 5,
    content: 'The ______ of the new medical technology has greatly improved the survival rate of patients with rare diseases.',
    options: ['application', 'applicable', 'applicant', 'applied'],
    answer: 0,
    explanation: '考查词性转换。空格前有定冠词 the，后有 of，需要名词作主语。application 为 apply 的名词形式，意为"应用"，符合句意"新医疗技术的应用大大提高了罕见病患者的存活率"。applicable 为形容词"适用的"，applicant 为"申请人"，applied 为形容词"应用的"，均不符合此处需要名词的语法要求。',
  },

  // ===== 完形填空 Cloze =====

  {
    id: 'e041', subject: 'english', module: 'cloze', pointId: 'cloze-logic',
    type: 'single-choice', difficulty: 1,
    content: 'Read the following passage and choose the best word for the blank.\n\n"Tom was always the first to arrive at school. ___, he would sit quietly and read a book until class began."',
    options: ['Then', 'But', 'Although', 'Unless'],
    answer: 0,
    explanation: '考查完形填空逻辑衔接。前句说 Tom 总是第一个到校，后句说他安静地坐着看书直到上课，两句为顺承关系。Then"然后"表时间顺承，符合语境。But 表转折，Although 表让步，Unless 表条件，均不符合顺承逻辑。',
  },

  {
    id: 'e042', subject: 'english', module: 'cloze', pointId: 'cloze-logic',
    type: 'single-choice', difficulty: 2,
    content: 'Read the following passage and choose the best word for the blank.\n\n"Mary wanted to buy the dress, but the price was too high. ___, she decided to wait for the summer sale."',
    options: ['Therefore', 'However', 'Besides', 'Instead'],
    answer: 0,
    explanation: '考查完形填空逻辑衔接。前句说价格太高，后句说决定等夏季打折，两句为因果关系。Therefore"因此"表因果，符合"价格高→因此等打折"的逻辑。However 表转折，Besides 表递进，Instead 表替代，均不符合因果逻辑。',
  },

  {
    id: 'e043', subject: 'english', module: 'cloze', pointId: 'cloze-logic',
    type: 'single-choice', difficulty: 3,
    content: 'Read the following passage and choose the best word for the blank.\n\n"Jack had been working overtime for weeks to meet the deadline. His health began to suffer; ___, he still refused to take a day off, believing that rest was a luxury he couldn\'t afford."',
    options: ['nevertheless', 'therefore', 'meanwhile', 'otherwise'],
    answer: 0,
    explanation: '考查完形填空逻辑衔接。前句说 Jack 健康状况开始变差，后句说他仍然拒绝休息，两者为转折让步关系。nevertheless"然而，尽管如此"表转折让步，符合语境。therefore 表因果，meanwhile 表同时，otherwise 表条件，均不符合转折让步逻辑。',
  },

  {
    id: 'e044', subject: 'english', module: 'cloze', pointId: 'cloze-vocabulary',
    type: 'single-choice', difficulty: 4,
    content: 'Read the following passage and choose the best word for the blank.\n\n"When the rescue team finally reached the trapped miners, the expression on everyone\'s face was one of pure ___. Tears flowed as families were reunited."',
    options: ['relief', 'anxiety', 'confusion', 'disappointment'],
    answer: 0,
    explanation: '考查完形填空词汇理解。后文提到"泪水流淌，家人重聚"，说明被困矿工获救后大家感到的是纯粹的"如释重负"。relief"宽慰，如释重负"符合语境。anxiety"焦虑"与获救情境矛盾，confusion"困惑"不符合家人重聚的情境，disappointment"失望"与积极情感不符。',
  },

  {
    id: 'e045', subject: 'english', module: 'cloze', pointId: 'cloze-vocabulary',
    type: 'single-choice', difficulty: 5,
    content: 'Read the following passage and choose the best word for the blank.\n\n"The scientist spent decades observing the behavior of chimpanzees in the wild. Her findings were so ___ that they challenged long-held beliefs about the uniqueness of human intelligence."',
    options: ['groundbreaking', 'predictable', 'insignificant', 'ordinary'],
    answer: 0,
    explanation: '考查完形填空词汇理解。句意为"她的发现如此具有开创性，以至于挑战了关于人类智力独特性的长期信念"。groundbreaking"开创性的"与后文"挑战了长期信念"构成因果关系。predictable"可预测的"无法与"挑战信念"形成逻辑，insignificant"无关紧要的"与后文矛盾，ordinary"普通的"无法解释为何能挑战既有观念。',
  },

  // ===== 阅读理解 Reading =====

  {
    id: 'e046', subject: 'english', module: 'reading', pointId: 'reading-detail',
    type: 'single-choice', difficulty: 1,
    content: 'Read the following passage and answer the question.\n\n"The Great Wall of China, stretching over 13,000 miles, is one of the most remarkable structures in human history. Construction began as early as the 7th century BC during the Zhou Dynasty. However, the wall as we know it today was mostly built during the Ming Dynasty (1368-1644), using bricks and stone rather than the earlier rammed earth."\n\nAccording to the passage, when did the construction of the Great Wall first begin?',
    options: ['During the 7th century BC', 'During the Ming Dynasty', 'In 1368', 'During the Zhou Dynasty in 1644'],
    answer: 0,
    explanation: '考查阅读理解细节题。根据文章第二句"Construction began as early as the 7th century BC during the Zhou Dynasty"可知长城最早建于公元前 7 世纪，故选 A。选项 B 明朝是现存长城的主要建造时期而非最初建造时间，选项 C 1368 年是明朝建立之年，选项 D 将周朝和 1644 年混在一起，均不正确。',
  },

  {
    id: 'e047', subject: 'english', module: 'reading', pointId: 'reading-detail',
    type: 'single-choice', difficulty: 2,
    content: 'Read the following passage and answer the question.\n\n"Marie Curie, born in Warsaw, Poland, in 1867, was the first woman to win a Nobel Prize and the only person to win Nobel Prizes in two different scientific fields. She received the Nobel Prize in Physics in 1903 jointly with her husband Pierre Curie and Henri Becquerel, and later won the Nobel Prize in Chemistry in 1911 for her discovery of radium and polonium."\n\nHow many Nobel Prizes did Marie Curie win, and in which fields?',
    options: ['Two, in Physics and Chemistry', 'One, in Physics only', 'Two, both in Chemistry', 'Three, in Physics, Chemistry, and Medicine'],
    answer: 0,
    explanation: '考查阅读理解细节题。文章明确提到居里夫人于 1903 年获诺贝尔物理学奖，1911 年获诺贝尔化学奖，共两次，分别在物理学和化学两个领域，故选 A。她是唯一在两个不同科学领域获得诺贝尔奖的人。',
  },

  {
    id: 'e048', subject: 'english', module: 'reading', pointId: 'reading-inference',
    type: 'single-choice', difficulty: 3,
    content: 'Read the following passage and answer the question.\n\n"Despite the growing popularity of e-books, physical bookstores in the city have seen a surprising increase in foot traffic over the past year. Many bookstore owners attribute this trend to a growing desire for \'offline experiences\' — customers enjoy browsing shelves, attending book clubs, and chatting with staff about recommendations. Some stores have even added coffee shops and reading lounges to enhance the experience."\n\nWhat can be inferred about why physical bookstores are attracting more visitors?',
    options: ['Customers value the in-person experience that online shopping cannot offer', 'E-books have become too expensive for most readers', 'Physical books are of higher quality than e-books', 'Bookstores have lowered their prices to compete with online retailers'],
    answer: 0,
    explanation: '考查阅读理解推理题。文章提到书店客流量增加的原因是人们对"线下体验"的渴望——顾客喜欢浏览书架、参加读书俱乐部、与店员交流，书店还增加了咖啡厅和阅读区。可以推断顾客重视线上购物无法提供的线下体验，故选 A。选项 B、C、D 文中均未提及，属于无中生有。',
  },

  {
    id: 'e049', subject: 'english', module: 'reading', pointId: 'reading-inference',
    type: 'single-choice', difficulty: 4,
    content: 'Read the following passage and answer the question.\n\n"The concept of \'slow fashion\' has gained momentum in recent years as consumers become increasingly aware of the environmental and social costs of fast fashion. Slow fashion advocates emphasize quality over quantity, ethical labor practices, and sustainable materials. However, critics argue that slow fashion remains largely inaccessible to average consumers due to its premium prices, raising questions about whether sustainability in fashion can ever be truly democratic."\n\nWhat is the author\'s implied attitude toward the "slow fashion" movement?',
    options: ['Cautiously optimistic but concerned about its accessibility', 'Strongly supportive and dismissive of any criticism', 'Completely skeptical of its environmental benefits', 'Neutral and uninterested in the debate'],
    answer: 0,
    explanation: '考查阅读理解推理题。文章前半部分介绍了慢时尚运动的积极方面（重视质量、道德劳工、可持续材料），后半部分通过 however 转折指出批评者的观点——慢时尚因高价对普通消费者仍然难以触及，并质疑时尚可持续性是否能真正大众化。作者既肯定了运动的积极意义，又对其普及性表示担忧，态度为"谨慎乐观但关注其可及性"，故选 A。',
  },

  {
    id: 'e050', subject: 'english', module: 'reading', pointId: 'reading-main-idea',
    type: 'single-choice', difficulty: 5,
    content: 'Read the following passage and choose the best title.\n\n"Artificial intelligence is transforming healthcare in ways that were unimaginable a decade ago. AI algorithms can now analyze medical images with accuracy rivaling that of experienced radiologists, potentially reducing diagnostic errors and speeding up treatment. Beyond diagnostics, AI is being used to predict patient deterioration, optimize hospital operations, and even accelerate drug discovery. However, experts caution that AI should complement, not replace, human judgment in medicine. Issues of data privacy, algorithmic bias, and the need for regulatory frameworks remain significant hurdles."\n\nWhat is the best title for this passage?',
    options: ['AI in Healthcare: Promise and Precautions', 'How AI Will Replace Doctors', 'The History of Medical Imaging', 'Data Privacy in the Digital Age'],
    answer: 0,
    explanation: '考查阅读理解主旨题。文章前半部分阐述 AI 在医疗领域的应用前景（诊断、预测、药物发现等），后半部分通过 however 指出 AI 应辅助而非替代人类，并提到数据隐私、算法偏见和监管等挑战。文章整体围绕"AI 在医疗中的前景与注意事项"展开，故选 A。选项 B"AI 将如何替代医生"与文中"AI 应辅助而非替代"矛盾，选项 C"医学影像历史"过于片面，选项 D"数字时代的数据隐私"偏离主题。',
  },

  // ===== 七选五 Seven-Five =====

  {
    id: 'e051', subject: 'english', module: 'seven-five', pointId: 'seven-five-skills',
    type: 'single-choice', difficulty: 1,
    content: 'Read the following text. Choose the best sentence to fill in the blank.\n\n"Regular exercise has numerous benefits for both body and mind. It strengthens the heart, improves circulation, and helps maintain a healthy weight. ___ Studies show that people who exercise regularly tend to have lower rates of anxiety and depression."',
    options: ['In addition, physical activity can significantly boost mental health.', 'However, too much exercise can be harmful.', 'Many people prefer to exercise in the morning.', 'Running is the most popular form of exercise.'],
    answer: 0,
    explanation: '考查七选五逻辑衔接。空格前讲运动的身体益处（强健心脏、改善循环、保持体重），空格后讲运动对心理健康的好处（降低焦虑和抑郁率）。空格处需要承上启下，从身体益处过渡到心理益处。"In addition, physical activity can significantly boost mental health"用 In addition 表递进，引出心理健康话题，与后文形成总分关系，故选 A。',
  },

  {
    id: 'e052', subject: 'english', module: 'seven-five', pointId: 'seven-five-skills',
    type: 'single-choice', difficulty: 2,
    content: 'Read the following text. Choose the best sentence to fill in the blank.\n\n"Learning a new language opens up a world of opportunities. ___ It allows you to connect with people from different cultures, enhances your cognitive abilities, and can even improve your career prospects in an increasingly globalized world."',
    options: ['The benefits extend far beyond simply being able to communicate.', 'However, language learning can be time-consuming.', 'Some languages are more difficult to learn than others.', 'English is the most widely spoken language in the world.'],
    answer: 0,
    explanation: '考查七选五逻辑衔接。空格后列举了学习语言的具体好处（连接不同文化、增强认知能力、改善职业前景），空格处应为主题句或过渡句，引出这些好处。"The benefits extend far beyond simply being able to communicate"作为总起句，引出后文列举的多方面好处，形成总分结构，故选 A。',
  },

  {
    id: 'e053', subject: 'english', module: 'seven-five', pointId: 'seven-five-skills',
    type: 'single-choice', difficulty: 3,
    content: 'Read the following text. Choose the best sentence to fill in the blank.\n\n"Volunteering is often seen as a selfless act, but research suggests that volunteers themselves gain a great deal from the experience. Studies have found that regular volunteering is associated with lower stress levels and a reduced risk of depression. ___ Furthermore, volunteers often develop new skills and expand their social networks, which can lead to unexpected career opportunities."',
    options: ['In fact, people who volunteer regularly report higher levels of life satisfaction.', 'However, not everyone has the time to volunteer.', 'Some organizations require a long-term commitment from volunteers.', 'Volunteering is most common among college students.'],
    answer: 0,
    explanation: '考查七选五逻辑衔接。空格前讲志愿服务与较低压力水平和抑郁风险有关，空格后有 Furthermore 表递进，继续讲志愿服务的好处（新技能、社交网络、职业机会）。空格处应继续阐述志愿服务的积极影响。"In fact, people who volunteer regularly report higher levels of life satisfaction"与前文递进，与后文 Furthermore 衔接自然，故选 A。',
  },

  {
    id: 'e054', subject: 'english', module: 'seven-five', pointId: 'seven-five-skills',
    type: 'single-choice', difficulty: 4,
    content: 'Read the following text. Choose the best sentence to fill in the blank.\n\n"The concept of lifelong learning has become increasingly relevant in today\'s rapidly changing job market. Many professionals are returning to education mid-career to update their skills or pivot to new fields. ___ Online platforms have made education more accessible than ever, offering courses from top universities at little or no cost."',
    options: ['This trend has been further accelerated by the rise of digital learning platforms.', 'However, traditional universities remain the gold standard for education.', 'The cost of higher education has been rising steadily.', 'Some employers prefer candidates with practical experience over formal education.'],
    answer: 0,
    explanation: '考查七选五逻辑衔接。空格前讲职场人士重返教育的趋势，空格后讲在线平台使教育更加普及。空格处需连接两个内容——从"重返教育"到"在线教育"的逻辑过渡。"This trend has been further accelerated by the rise of digital learning platforms"中的 This trend 指代前文职场人士重返教育的趋势，并引出后文在线平台的讨论，承上启下，故选 A。',
  },

  {
    id: 'e055', subject: 'english', module: 'seven-five', pointId: 'seven-five-skills',
    type: 'single-choice', difficulty: 5,
    content: 'Read the following text. Choose the best sentence to fill in the blank.\n\n"The relationship between technology and human creativity is complex and often misunderstood. Many fear that artificial intelligence will eventually replace human creativity altogether. ___ What AI lacks is the ability to draw from lived experience, emotional depth, and cultural context — the very elements that give creative work its meaning and resonance."',
    options: ['However, creativity is far more than the mechanical generation of patterns.', 'Therefore, artists should embrace AI as a creative tool.', 'Moreover, AI has already produced impressive works of art.', 'In fact, AI can now write poetry and compose music.'],
    answer: 0,
    explanation: '考查七选五逻辑衔接。空格前提到人们担心 AI 将完全取代人类创造力，空格后解释 AI 缺乏的是从生活经验、情感深度和文化背景中汲取的能力。空格处需要转折——从"担心 AI 取代创造力"到"创造力远不止机械生成模式"，为后文阐述 AI 的局限性做铺垫。"However, creativity is far more than the mechanical generation of patterns"用 However 表转折，且内容为后文阐述 AI 局限性奠定基础，故选 A。',
  },

  // ===== 写作 Writing =====

  {
    id: 'e056', subject: 'english', module: 'writing', pointId: 'writing-email',
    type: 'single-choice', difficulty: 1,
    content: 'You are writing an email to your English teacher to ask for a recommendation letter. Which of the following is the most appropriate opening sentence?',
    options: ['Dear Mr. Smith, I hope this email finds you well. I am writing to ask if you would be willing to write a recommendation letter for me.', 'Hey Mr. Smith, give me a recommendation letter please.', 'Dear Mr. Smith, I need a recommendation letter ASAP.', 'Hi teacher, can you write me a letter?'],
    answer: 0,
    explanation: '考查邮件写作的得体性。给老师写邮件请求推荐信应使用正式、礼貌的语气。选项 A 使用 Dear Mr. Smith 正式称呼，I hope this email finds you well 为礼貌问候，I am writing to ask if you would be willing to... 为委婉请求，语气得体。其余选项语气过于随意或生硬，不符合邮件写作规范。',
  },

  {
    id: 'e057', subject: 'english', module: 'writing', pointId: 'writing-email',
    type: 'single-choice', difficulty: 2,
    content: 'You are writing an email to your pen pal in England to introduce your hometown. Which sentence is most appropriate for the body paragraph?',
    options: ['My hometown, located in southern China, is famous for its beautiful scenery and delicious local cuisine.', 'You should visit my hometown because it is the best place in the world.', 'My hometown is not far from yours, so you can come anytime.', 'I do not know much about my hometown, but I will try to tell you something.'],
    answer: 0,
    explanation: '考查邮件正文写作。给笔友介绍家乡应提供具体、准确的信息，语言得体。选项 A 既说明了地理位置（位于中国南方），又点明了特色（美丽风景和当地美食），信息具体且表达得体。选项 B 过于夸张主观，选项 C 信息不准确且语气随意，选项 D 缺乏自信且信息不足，均不合适。',
  },

  {
    id: 'e058', subject: 'english', module: 'writing', pointId: 'writing-email',
    type: 'single-choice', difficulty: 3,
    content: 'You are writing a thank-you email to your host family after staying with them in London. Which closing paragraph is the most appropriate?',
    options: ['Thank you once again for your warmth and generosity. I will always cherish the memories of my stay and hope to welcome you to my home in China someday. Please keep in touch.', 'Thanks for everything. Bye.', 'I had an okay time. Maybe we will meet again.', 'That is all I want to say. See you next time.'],
    answer: 0,
    explanation: '考查邮件结尾段写作。感谢信的结尾应再次表达感谢，表达美好回忆，并展望未来联系。选项 A 再次致谢（Thank you once again），表达珍视回忆（I will always cherish the memories），发出回访邀请（hope to welcome you to my home），并保持联系（Please keep in touch），内容完整，语气真诚得体。其余选项过于简短、冷淡或草率，不符合感谢信的写作要求。',
  },

  {
    id: 'e059', subject: 'english', module: 'writing', pointId: 'writing-continuation',
    type: 'single-choice', difficulty: 4,
    content: 'Read the following story ending and choose the best continuation.\n\n"Emily had been searching for her lost dog, Max, for three days. Just as she was about to give up hope, her phone rang. It was the animal shelter."',
    options: ['"We think we\'ve found your dog," the voice on the other end said. Emily\'s heart leaped with joy as she grabbed her keys and rushed out the door, tears of hope streaming down her face.', 'Emily answered the phone but it was just a wrong number. She sighed and went back to bed, feeling more depressed than ever.', 'The shelter told her they had closed for the day and she should call back tomorrow. Emily felt frustrated but had no choice but to wait.', "Emily didn't answer the phone because she was afraid of bad news. She sat in silence, staring at Max's favorite toy."],
    answer: 0,
    explanation: '考查读后续写。续写应与前文的情感基调和情节发展保持一致。前文营造了 Emily 即将放弃希望时突然接到电话的悬念，续写应顺承这一转折，给出积极的发展方向。选项 A 中动物收容所告知可能找到了狗，Emily 欣喜若狂地赶去，既呼应了前文的寻找，又推动了情节发展，情感自然。选项 B（打错电话）、选项 C（关门让明天再打）、选项 D（不敢接电话）要么消极压抑，要么与情节发展方向不符，不符合读后续写积极向上的基调。',
  },

  {
    id: 'e060', subject: 'english', module: 'writing', pointId: 'writing-continuation',
    type: 'single-choice', difficulty: 5,
    content: 'Read the following story passage and choose the continuation that best maintains the narrative tone and theme.\n\n"For years, Mr. Chen had been the most respected teacher in the village school. His students adored him, and parents trusted him completely. But one autumn morning, a letter arrived that would change everything. The education bureau had decided to close the village school and transfer all students to a school in the city. Mr. Chen stood by the window, watching the children play in the schoolyard, unaware that this might be their last autumn here."',
    options: ['He knew he had to find a way to keep the school alive — not just for the children, but for the entire community that depended on it. That evening, he called a village meeting, his voice steady but filled with quiet determination.', 'Mr. Chen was very angry and decided to write a complaint letter to the government immediately. He would not let them close his school without a fight.', 'Mr. Chen accepted the news calmly. After all, the city school had better facilities. He began packing his things the next day.', 'Mr. Chen told the students the news right away. The children cried and refused to go to the city school, but there was nothing he could do.'],
    answer: 0,
    explanation: '考查读后续写。续写需保持原文的叙事基调和主题。原文营造了温情而略带忧伤的氛围，刻画了陈老师对学校和学生的深厚感情。选项 A 延续了这个基调——陈老师决心为学校和社区而战，召开村民大会，语气"steady but filled with quiet determination"与原文克制深情的风格一致，同时推动了情节发展。选项 B 情绪过于激烈直接，与原文含蓄的风格不符；选项 C 过于消极，与陈老师对学校的感情矛盾；选项 D 虽然情感真实但缺乏推动情节发展的动力，不符合续写要求。',
  },
]
