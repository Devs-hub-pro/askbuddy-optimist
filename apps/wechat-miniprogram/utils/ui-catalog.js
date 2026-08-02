const CHANNELS = {
  education: {
    id: 'education',
    name: '教育学习',
    short: '学',
    tone: 'blue',
    categoryAliases: ['education', 'education-learning', '教育学习'],
    keywords: ['高考', '考研', '留学', '论文', '雅思', '托福', '学习'],
    subcategories: [
      { id: 'all', name: '全部', short: '全', keywords: [] },
      { id: 'gaokao', name: '高考', short: '考', keywords: ['高考', '志愿', '录取'] },
      { id: 'kaoyan', name: '考研', short: '研', keywords: ['考研', '复试', '调剂'] },
      { id: 'study-abroad', name: '留学', short: '留', keywords: ['留学', '申请', '雅思', '托福', '文书'] },
      { id: 'competition', name: '竞赛', short: '赛', keywords: ['竞赛', '比赛', '数模'] },
      { id: 'paper', name: '论文写作', short: '文', keywords: ['论文', '开题', '投稿'] }
    ],
    featured: {
      topicId: 'demo-topic-1',
      title: '留学申请时间线全攻略',
      description: '把准备雅思、选校、文书、推荐信、网申和签证拆成完整时间线，方便你按阶段执行。',
      hint: '推荐答主：留学顾问 Luna'
    },
    fallbackQuestions: [
      {
        id: 'channel-education-1',
        title: '英国硕士申请时间线怎么安排？',
        content: '计划明年秋季入学，语言、选校和文书应该从什么时候开始准备？',
        category: 'education',
        profile_nickname: 'Momo',
        view_count: 86,
        reward_points: 5,
        created_at: '2026-07-31T10:20:00+08:00'
      },
      {
        id: 'channel-education-2',
        title: '雅思写作一直卡在 6 分，如何突破？',
        content: '观点展开和逻辑连接比较薄弱，希望获得一套可以坚持的训练方法。',
        category: 'education',
        profile_nickname: 'Lynn',
        view_count: 52,
        reward_points: 3,
        created_at: '2026-07-30T18:10:00+08:00'
      }
    ]
  },
  career: {
    id: 'career',
    name: '职业发展',
    short: '职',
    tone: 'green',
    categoryAliases: ['career', 'career-development', '职业发展'],
    keywords: ['求职', '简历', '面试', '职业', '创业', '远程', 'offer'],
    subcategories: [
      { id: 'all', name: '全部', short: '全', keywords: [] },
      { id: 'job', name: '求职', short: '求', keywords: ['求职', '校招', '招聘', 'offer'] },
      { id: 'resume', name: '简历', short: '历', keywords: ['简历', '履历', '项目经历', '作品集'] },
      { id: 'interview', name: '面试', short: '面', keywords: ['面试', '笔试', '群面', '技术面'] },
      { id: 'remote', name: '远程工作', short: '远', keywords: ['远程', '自由职业', '在家办公'] },
      { id: 'startup', name: '创业', short: '创', keywords: ['创业', '融资', '商业计划'] }
    ],
    featured: {
      topicId: 'demo-topic-2',
      title: '大学生灵活就业与副业选择',
      description: '从简历、真实项目到自由职业，先看可验证的经验，再决定适合自己的职业路径。',
      hint: '推荐答主：求职教练 Shawn'
    },
    fallbackQuestions: [
      {
        id: 'channel-career-1',
        title: '没有实习经历，简历项目怎么写才有说服力？',
        content: '只有课程项目和校园经历，希望找到量化成果和岗位匹配的表达方式。',
        category: 'career',
        profile_nickname: 'Shawn',
        view_count: 128,
        reward_points: 8,
        created_at: '2026-08-01T09:30:00+08:00'
      },
      {
        id: 'channel-career-2',
        title: '转岗前端三个月的学习顺序怎么排？',
        content: '目前做运营，目标是三个月内拿到前端岗位面试机会。',
        category: 'career',
        profile_nickname: 'Lynn',
        view_count: 74,
        reward_points: 5,
        created_at: '2026-07-29T16:40:00+08:00'
      }
    ]
  },
  lifestyle: {
    id: 'lifestyle',
    name: '生活服务',
    short: '生',
    tone: 'orange',
    categoryAliases: ['lifestyle', 'lifestyle-services', '生活服务'],
    keywords: ['租房', '法律', '情感', '保险', '生活', '签证'],
    subcategories: [
      { id: 'all', name: '全部', short: '全', keywords: [] },
      { id: 'housing', name: '租房', short: '房', keywords: ['租房', '房东', '押金', '合租'] },
      { id: 'legal', name: '法律', short: '法', keywords: ['法律', '合同', '仲裁', '维权'] },
      { id: 'emotional', name: '情感', short: '情', keywords: ['情感', '关系', '沟通', '心理'] },
      { id: 'insurance', name: '保险', short: '保', keywords: ['保险', '理赔', '保单'] },
      { id: 'overseas', name: '海外生活', short: '海', keywords: ['海外生活', '签证', '境外'] }
    ],
    featured: {
      topicId: 'lifestyle-guide',
      title: '租房签约前必须确认的 8 件事',
      description: '把合同、押金、维修责任和退租条款一次说清，减少高频生活场景里的信息差。',
      hint: '推荐答主：生活顾问 Rina'
    },
    fallbackQuestions: [
      {
        id: 'channel-lifestyle-1',
        title: '退租时房东拒绝退押金，应该如何处理？',
        content: '合同没有写额外扣费，但房东以清洁费和折旧为由扣除大部分押金。',
        category: 'lifestyle',
        profile_nickname: 'Yuki',
        view_count: 96,
        reward_points: 6,
        created_at: '2026-07-30T12:15:00+08:00'
      },
      {
        id: 'channel-lifestyle-2',
        title: '第一次买医疗险要重点看哪些条款？',
        content: '希望先理解免赔额、续保条件和既往症限制。',
        category: 'lifestyle',
        profile_nickname: 'Nana',
        view_count: 41,
        reward_points: 3,
        created_at: '2026-07-28T20:20:00+08:00'
      }
    ]
  },
  hobbies: {
    id: 'hobbies',
    name: '兴趣技能',
    short: '技',
    tone: 'pink',
    categoryAliases: ['hobbies', 'hobbies-skills', '兴趣技能'],
    keywords: ['摄影', '音乐', '绘画', '健身', '烹饪', '兴趣'],
    subcategories: [
      { id: 'all', name: '全部', short: '全', keywords: [] },
      { id: 'photography', name: '摄影', short: '摄', keywords: ['摄影', '拍照', '镜头', '修图'] },
      { id: 'music', name: '音乐', short: '音', keywords: ['音乐', '作曲', '编曲', '乐器'] },
      { id: 'art', name: '艺术', short: '艺', keywords: ['艺术', '绘画', '素描', '油画'] },
      { id: 'fitness', name: '健身', short: '健', keywords: ['健身', '减脂', '增肌', '体态'] },
      { id: 'cooking', name: '烹饪', short: '烹', keywords: ['烹饪', '菜谱', '烘焙', '料理'] }
    ],
    featured: {
      topicId: 'hobby-starter',
      title: '从零开始建立一项能坚持的兴趣',
      description: '摄影、音乐、绘画和健身都可以从最小练习开始，用持续反馈替代一次性冲动。',
      hint: '推荐答主：创作达人 Kai'
    },
    fallbackQuestions: [
      {
        id: 'channel-hobbies-1',
        title: '零基础摄影，第一支镜头应该怎么选？',
        content: '主要拍人像和旅行，希望兼顾重量、预算和后期提升空间。',
        category: 'hobbies',
        profile_nickname: 'Aki',
        view_count: 67,
        reward_points: 4,
        created_at: '2026-07-31T19:25:00+08:00'
      },
      {
        id: 'channel-hobbies-2',
        title: '上班族如何安排每周三次力量训练？',
        content: '希望控制在每次一小时内，重点改善体态和基础力量。',
        category: 'hobbies',
        profile_nickname: 'Leo',
        view_count: 58,
        reward_points: 2,
        created_at: '2026-07-27T08:45:00+08:00'
      }
    ]
  }
};

const EXPERTS = [
  {
    id: 'demo-expert-1',
    userId: 'demo-user-expert-1',
    name: '留学顾问 Luna',
    initial: 'L',
    title: '英国与新加坡硕士申请规划师',
    bio: '专注申请时间规划、文书修改和跨专业路径设计。',
    tags: ['留学', '申请规划', '文书'],
    category: 'education',
    rating: '4.9',
    responseRate: '98%',
    orderCount: '126',
    consultationCount: '208',
    followersCount: '346',
    price: '59',
    experience: '5 年经验',
    location: '深圳'
  },
  {
    id: 'demo-expert-2',
    userId: 'demo-user-expert-2',
    name: '求职教练 Shawn',
    initial: 'S',
    title: '校招简历与面试表达教练',
    bio: '帮助学生把校园经历整理成更有说服力的求职材料。',
    tags: ['求职', '简历', '面试'],
    category: 'career',
    rating: '4.8',
    responseRate: '95%',
    orderCount: '93',
    consultationCount: '164',
    followersCount: '212',
    price: '49',
    experience: '4 年经验',
    location: '深圳'
  },
  {
    id: 'demo-expert-3',
    userId: 'demo-user-expert-3',
    name: '生活顾问 Rina',
    initial: 'R',
    title: '租房、保险与生活维权顾问',
    bio: '熟悉高频生活规则，擅长把复杂条款讲得清楚可执行。',
    tags: ['租房', '保险', '生活咨询'],
    category: 'lifestyle',
    rating: '4.7',
    responseRate: '93%',
    orderCount: '118',
    consultationCount: '176',
    followersCount: '189',
    price: '39',
    experience: '6 年经验',
    location: '深圳'
  },
  {
    id: 'demo-expert-4',
    userId: 'demo-user-expert-4',
    name: '创作达人 Kai',
    initial: 'K',
    title: '摄影、音乐与创作入门导师',
    bio: '适合从零搭建兴趣成长路径和可持续练习计划。',
    tags: ['摄影', '音乐', '创作'],
    category: 'hobbies',
    rating: '4.8',
    responseRate: '96%',
    orderCount: '142',
    consultationCount: '201',
    followersCount: '234',
    price: '45',
    experience: '5 年经验',
    location: '深圳'
  }
];

const TOPICS = [
  {
    id: 'demo-topic-1',
    short: 'UK',
    eyebrow: '热榜专题',
    tone: 'indigo',
    title: '留学申请季交流空间',
    description: '把申请时间线、文书经验和 offer 节奏整理成一份更容易执行的参考专题。',
    participants: 128,
    discussionsCount: 3,
    updatedText: '刚刚更新',
    body: [
      '申请准备最容易出现的问题，不是某一步完全不会，而是语言、选校、文书、推荐信和网申同时推进时失去节奏。',
      '先确定目标国家、预算和申请轮次，再倒推语言考试与材料截止时间。文书和选校可以并行，不必等语言成绩完全确定后才开始。',
      '每周只检查一次总进度，把临时焦虑转换成下一项明确动作。'
    ],
    discussions: [
      { id: 'topic-comment-1', name: '留学顾问 Luna', initial: 'L', content: '建议先把目标国家、预算和时间线拆开整理，再按申请轮次倒推文书和推荐信准备。', likes: 12, time: '1 小时前' },
      { id: 'topic-comment-2', name: 'Momo', initial: 'M', content: '我最担心语言考试和文书撞在一起，这份安排让我清楚很多。', likes: 5, time: '45 分钟前' },
      { id: 'topic-comment-3', name: '申请规划师 Evan', initial: 'E', content: '英港新项目可以把文书初稿和选校同步推进。', likes: 7, time: '20 分钟前' }
    ]
  },
  {
    id: 'demo-topic-2',
    short: 'JOB',
    eyebrow: '热榜专题',
    tone: 'teal',
    title: '大学生灵活就业圈',
    description: '聚焦副业、灵活就业和校内外项目实践，快速了解真实经验。',
    participants: 96,
    discussionsCount: 2,
    updatedText: '20 分钟前更新',
    body: [
      '灵活就业不是把所有零散机会都接下来，而是先选择能够积累作品、评价与可迁移能力的小项目。',
      '开始前明确交付范围、时间投入和结算方式，并保留过程记录。',
      '每完成一个项目，都把成果重新整理进作品集和简历。'
    ],
    discussions: [
      { id: 'topic-comment-4', name: '求职教练 Shawn', initial: 'S', content: '先从小体量兼职开始，不要一开始就压太多时间和现金流风险。', likes: 9, time: '1 小时前' },
      { id: 'topic-comment-5', name: 'Lynn', initial: 'L', content: '找到适合自己的积累方向，比单纯追求短期收入更重要。', likes: 4, time: '35 分钟前' }
    ]
  },
  {
    id: 'lifestyle-guide',
    short: 'HOME',
    eyebrow: '生活指南',
    tone: 'amber',
    title: '租房签约前必须确认的 8 件事',
    description: '合同、押金、维修责任和退租条款，一次说明白。',
    participants: 72,
    discussionsCount: 2,
    updatedText: '今天更新',
    body: ['先确认房屋权属与出租权限，再核对租期、押金、付款周期和提前退租规则。', '所有口头承诺都应写进合同，交接时用照片记录房屋和设备状态。'],
    discussions: [
      { id: 'topic-comment-6', name: '生活顾问 Rina', initial: 'R', content: '尤其要确认维修费用由谁承担，以及押金退还的时间。', likes: 8, time: '2 小时前' },
      { id: 'topic-comment-7', name: 'Yuki', initial: 'Y', content: '入住照片和水电表读数也一定要留存。', likes: 3, time: '1 小时前' }
    ]
  },
  {
    id: 'hobby-starter',
    short: 'GO',
    eyebrow: '成长专题',
    tone: 'rose',
    title: '从零开始建立一项能坚持的兴趣',
    description: '从最小练习开始，用持续反馈替代一次性冲动。',
    participants: 61,
    discussionsCount: 2,
    updatedText: '昨天更新',
    body: ['先选择一个足够小、每周能重复三次的练习动作。', '记录练习后的感受和作品，而不是只记录投入了多少时间。'],
    discussions: [
      { id: 'topic-comment-8', name: '创作达人 Kai', initial: 'K', content: '能持续十分钟的练习，比偶尔投入三小时更有效。', likes: 11, time: '昨天' },
      { id: 'topic-comment-9', name: 'Aki', initial: 'A', content: '我从每周拍一个固定主题开始，确实更容易坚持。', likes: 6, time: '昨天' }
    ]
  }
];

function getChannel(id) {
  return CHANNELS[id] || CHANNELS.education;
}

function getTopic(id) {
  return TOPICS.find((item) => item.id === id) || TOPICS[0];
}

function getExpert(id) {
  return EXPERTS.find((item) => item.id === id) || EXPERTS[0];
}

function getExpertsByCategory(category) {
  return EXPERTS.filter((item) => item.category === category);
}

function getFallbackQuestion(id) {
  const questions = Object.keys(CHANNELS).reduce((list, key) => list.concat(CHANNELS[key].fallbackQuestions), []);
  return questions.find((item) => item.id === id) || null;
}

module.exports = {
  CHANNELS,
  TOPICS,
  EXPERTS,
  getChannel,
  getTopic,
  getExpert,
  getExpertsByCategory,
  getFallbackQuestion
};
