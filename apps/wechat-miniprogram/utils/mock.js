const mockQuestions = [
  {
    id: 'q_1001',
    title: '转岗前端要先补什么？',
    content: '目前做运营，目标 3 个月内拿到前端岗位面试机会。',
    status: 'open',
    category: 'career',
    user_id: 'u_101',
    profile_nickname: 'Lynn',
    answers_count: 2,
    view_count: 42,
    created_at: '2026-04-22T10:18:00+08:00'
  },
  {
    id: 'q_1002',
    title: '雅思 7 分写作怎么稳住？',
    content: '阅读听力还行，写作经常在 6.0 卡住。',
    status: 'open',
    category: 'education',
    user_id: 'u_102',
    profile_nickname: 'Momo',
    answers_count: 1,
    view_count: 33,
    created_at: '2026-04-21T18:02:00+08:00'
  }
];

const mockAnswersByQuestion = {
  q_1001: [
    {
      id: 'a_10011',
      question_id: 'q_1001',
      content: '先补 JS 基础和工程化，再做 2 个可上线作品。',
      user_id: 'u_201',
      profile_nickname: '前端导师阿川',
      is_accepted: true,
      likes_count: 12,
      created_at: '2026-04-22T11:20:00+08:00'
    },
    {
      id: 'a_10012',
      question_id: 'q_1001',
      content: '建议优先掌握 React + TypeScript + Git 协作流程。',
      user_id: 'u_202',
      profile_nickname: '面试官Mia',
      is_accepted: false,
      likes_count: 5,
      created_at: '2026-04-22T12:00:00+08:00'
    }
  ],
  q_1002: [
    {
      id: 'a_10021',
      question_id: 'q_1002',
      content: '写作先固定 4 段结构，并建立高频论证素材库。',
      user_id: 'u_203',
      profile_nickname: '雅思助教Luna',
      is_accepted: false,
      likes_count: 7,
      created_at: '2026-04-21T19:02:00+08:00'
    }
  ]
};

const mockSearch = {
  question: mockQuestions,
  expert: [
    { id: 'e_1', nickname: '前端导师阿川', headline: '资深前端工程师', verification_status: 'verified' }
  ],
  skill: [
    { id: 's_1', title: '简历项目深度改造', category_name: '求职辅导', price_amount: 199 }
  ],
  post: [
    { id: 'p_1', content: '今天复盘了 5 场前端一面题目。', created_at: '2026-04-22T20:00:00+08:00' }
  ]
};

const mockNotifications = [
  {
    id: 'n_1',
    type: 'answer',
    title: '你的问题收到新回答',
    content: '前端导师阿川 回复了你的问题',
    related_id: 'q_1001',
    related_type: 'question',
    is_read: false,
    created_at: '2026-04-24T13:20:00+08:00'
  },
  {
    id: 'n_2',
    type: 'system',
    title: '系统通知',
    content: '本周学习打卡活动已开启',
    related_id: null,
    related_type: null,
    is_read: true,
    created_at: '2026-04-23T10:00:00+08:00'
  }
];

const mockDiscoverFeed = [
  {
    id: 'discover_1',
    author_name: 'Shawn',
    author_initial: 'Sh',
    created_at_text: '4 个月前',
    content: '测试动态 4.18',
    tags: ['留学申请', '简历优化'],
    likes_count: 0,
    comments_count: 0,
    shares_count: 0,
    city: '深圳',
    hot: true
  },
  {
    id: 'discover_2',
    author_name: 'Luna',
    author_initial: 'Lu',
    created_at_text: '5 个月前',
    content: '整理了一份英国硕士申请时间线，希望能帮正在准备材料的同学少走弯路。',
    tags: ['留学', '英国申请'],
    likes_count: 12,
    comments_count: 3,
    shares_count: 2,
    city: '同城',
    hot: false
  }
];

function delay(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHomeFeed() {
  await delay();
  return mockQuestions;
}

async function searchContent(payload = {}) {
  await delay();
  const keyword = (payload.keyword || '').trim();
  if (!keyword) return mockSearch;

  const lower = keyword.toLowerCase();
  const filterByText = (item) => JSON.stringify(item).toLowerCase().includes(lower);

  return {
    question: mockSearch.question.filter(filterByText),
    expert: mockSearch.expert.filter(filterByText),
    skill: mockSearch.skill.filter(filterByText),
    post: mockSearch.post.filter(filterByText)
  };
}

async function fetchQuestionDetailWithAnswers(payload = {}) {
  await delay();
  const questionId = payload.questionId;
  const question = mockQuestions.find((item) => item.id === questionId) || null;
  const answers = mockAnswersByQuestion[questionId] || [];
  if (!question) return null;
  return { question, answers };
}

async function fetchNotificationList() {
  await delay();
  return mockNotifications;
}

async function fetchUnreadNotificationCount() {
  await delay();
  return mockNotifications.filter((item) => !item.is_read).length;
}

async function fetchDiscoverFeed() {
  await delay();
  return mockDiscoverFeed;
}

module.exports = {
  fetchHomeFeed,
  searchContent,
  fetchQuestionDetailWithAnswers,
  fetchNotificationList,
  fetchUnreadNotificationCount,
  fetchDiscoverFeed
};
