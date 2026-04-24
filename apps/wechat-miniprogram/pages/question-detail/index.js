const { callRpc } = require('../../utils/request');

Page({
  data: {
    questionId: '',
    loading: true,
    detail: null,
    error: ''
  },

  onLoad(options) {
    const questionId = options.id || '';
    this.setData({ questionId });
    this.loadDetail();
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
      const detail = await callRpc('fetchQuestionDetail', { questionId: this.data.questionId });
      if (!detail) throw new Error('问题不存在或已下线');
      this.setData({ detail, loading: false });
    } catch (error) {
      this.setData({ loading: false, error: error.message || '加载失败' });
    }
  }
});
