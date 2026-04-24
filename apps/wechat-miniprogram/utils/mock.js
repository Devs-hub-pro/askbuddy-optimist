const mockQuestions = [
  {
    id: 'q_1001',
    title: '转岗前端要先补什么？',
    content: '目前做运营，目标 3 个月内拿到前端岗位面试机会。',
    status: 'open',
    channel: 'career',
    authorName: 'Lynn',
    answerCount: 12,
    createdAt: '2026-04-22 10:18'
  },
  {
    id: 'q_1002',
    title: '雅思 7 分写作怎么稳住？',
    content: '阅读听力还行，写作经常在 6.0 卡住。',
    status: 'open',
    channel: 'education',
    authorName: 'Momo',
    answerCount: 8,
    createdAt: '2026-04-21 18:02'
  },
  {
    id: 'q_1003',
    title: '副业做 AI 绘图接单靠谱么？',
    content: '想了解新手起步的定价和避坑建议。',
    status: 'open',
    channel: 'hobbies',
    authorName: 'Ares',
    answerCount: 5,
    createdAt: '2026-04-21 09:41'
  }
];

const mockMessages = [
  { id: 'm_1', peerName: '职业导师-小周', lastMessage: '我整理了一个 2 周冲刺计划', unread: 2, updatedAt: '13:20' },
  { id: 'm_2', peerName: '雅思助教-Lisa', lastMessage: '先从 Task2 立论结构开始', unread: 0, updatedAt: '昨天' }
];

const mockTopics = [
  { id: 't_1', title: '求职复盘营', participants: 3021, hot: true },
  { id: 't_2', title: '留学申请避坑', participants: 1890, hot: false },
  { id: 't_3', title: '兴趣技能变现', participants: 1276, hot: true }
];

function delay(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHomeFeed() {
  await delay();
  return mockQuestions;
}

async function fetchSearchResult(keyword) {
  await delay();
  if (!keyword) return mockQuestions;
  return mockQuestions.filter((item) => item.title.includes(keyword) || item.content.includes(keyword));
}

async function fetchQuestionDetail(questionId) {
  await delay();
  return mockQuestions.find((item) => item.id === questionId) || null;
}

async function submitQuestion(payload) {
  await delay();
  return {
    id: `q_${Date.now()}`,
    ...payload,
    status: 'open',
    answerCount: 0,
    createdAt: '刚刚'
  };
}

async function fetchDiscoverFeed() {
  await delay();
  return mockTopics;
}

async function fetchConversationList() {
  await delay();
  return mockMessages;
}

module.exports = {
  fetchHomeFeed,
  fetchSearchResult,
  fetchQuestionDetail,
  submitQuestion,
  fetchDiscoverFeed,
  fetchConversationList
};
