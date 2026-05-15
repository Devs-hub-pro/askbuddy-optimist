const { callRpc } = require('../../utils/request');

function formatTime(time) {
  if (!time) return '';
  return String(time).replace('T', ' ').slice(0, 16);
}

Page({
  data: {
    questionId: '',
    loading: true,
    detail: null,
    answers: [],
    error: ''
  },

  onLoad(options) {
    const questionId = options.id || '';
    this.setData({ questionId });
    this.loadDetail();
  },

  onPullDownRefresh() {
    this.loadDetail().finally(() => wx.stopPullDownRefresh());
  },

  onShareAppMessage() {
    return {
      title: this.data.detail ? this.data.detail.title : '问题详情',
      path: `/pages/question-detail/index?id=${this.data.questionId}`
    };
  },

  async loadDetail() {
    this.setData({ loading: true, error: '' });
    try {
      const payload = await callRpc('fetchQuestionDetailWithAnswers', { questionId: this.data.questionId });
      if (!payload || !payload.question) throw new Error('问题不存在或已下线');

      const detail = {
        ...payload.question,
        created_at_text: formatTime(payload.question.created_at)
      };

      const answers = (Array.isArray(payload.answers) ? payload.answers : []).map((item) => ({
        ...item,
        created_at_text: formatTime(item.created_at)
      }));

      this.setData({ detail, answers, loading: false });
    } catch (error) {
      this.setData({ loading: false, error: error.message || '加载失败' });
    }
  }
});
