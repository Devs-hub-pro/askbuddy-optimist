const { callRpc } = require('../../utils/request');
const { getNavigationLayout } = require('../../utils/navigation');
const { getFallbackQuestion } = require('../../utils/ui-catalog');

function formatTime(time) {
  if (!time) return '刚刚';
  const timestamp = new Date(time).getTime();
  if (!Number.isFinite(timestamp)) return '刚刚';
  const diff = Math.max(0, Date.now() - timestamp);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`;
  return `${Math.floor(diff / (30 * day))} 个月前`;
}

Page({
  data: {
    navLayout: getNavigationLayout(),
    questionId: '',
    loading: true,
    detail: null,
    answers: [],
    error: '',
    isExample: false,
    favorited: false,
    answerEditorVisible: false,
    answerDraft: ''
  },

  onLoad(options) {
    const questionId = options.id || '';
    this._openAnswerEditor = options.compose === '1';
    this._previewOnly = options.source === 'preview';
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
      const fallbackQuestion = getFallbackQuestion(this.data.questionId);
      const payload = this._previewOnly
        ? null
        : await callRpc('fetchQuestionDetailWithAnswers', { questionId: this.data.questionId });
      const isExample = !payload && Boolean(fallbackQuestion);
      const resolvedPayload = payload && payload.question
        ? payload
        : (fallbackQuestion ? { question: fallbackQuestion, answers: [] } : null);
      if (!resolvedPayload) throw new Error('问题不存在或已下线');

      const detail = {
        ...resolvedPayload.question,
        content: resolvedPayload.question.content || resolvedPayload.question.description || '',
        created_at_text: formatTime(resolvedPayload.question.created_at),
        asker_name: resolvedPayload.question.profile_nickname || '新用户',
        asker_initial: (resolvedPayload.question.profile_nickname || '新').slice(0, 1),
        view_count_text: String(resolvedPayload.question.view_count || 0),
        reward_points_text: String(resolvedPayload.question.reward_points || 0)
      };

      const answers = (Array.isArray(resolvedPayload.answers) ? resolvedPayload.answers : []).map((item) => ({
        ...item,
        likes_count: item.likes_count || item.like_count || 0,
        created_at_text: formatTime(item.created_at),
        author_name: item.profile_nickname || '新用户',
        author_initial: (item.profile_nickname || '新').slice(0, 1)
      }));

      const answerDraft = wx.getStorageSync(`answerDraft:${this.data.questionId}`) || '';
      this.setData({
        detail,
        answers,
        answerDraft,
        isExample,
        answerEditorVisible: this._openAnswerEditor,
        loading: false
      });
      this._openAnswerEditor = false;
    } catch (error) {
      this.setData({ loading: false, error: error.message || '加载失败' });
    }
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
      return;
    }
    wx.switchTab({ url: '/pages/home/index' });
  },

  toggleFavorite() {
    wx.showModal({
      title: '收藏暂不可用',
      content: '收藏服务正在接入，本次不会改变收藏状态。',
      showCancel: false
    });
  },

  answerQuestion() {
    this.setData({ answerEditorVisible: true });
  },

  replyAnswer(event) {
    const author = event.currentTarget.dataset.author || '';
    const prefix = author ? `@${author} ` : '';
    this.setData({
      answerEditorVisible: true,
      answerDraft: this.data.answerDraft || prefix
    });
  },

  closeAnswerEditor() {
    this.setData({ answerEditorVisible: false });
  },

  keepAnswerEditor() {},

  onAnswerInput(event) {
    this.setData({ answerDraft: event.detail.value });
  },

  submitAnswer() {
    const answerDraft = this.data.answerDraft.trim();
    if (!answerDraft) {
      wx.showToast({ title: '请先填写回答内容', icon: 'none' });
      return;
    }
    wx.setStorageSync(`answerDraft:${this.data.questionId}`, answerDraft);
    wx.showModal({
      title: '回答已保存',
      content: '回答已保存到本机草稿。发布服务开放后可继续提交，本次不会显示为已发布。',
      showCancel: false
    });
  },

  reportContent() {
    wx.showModal({
      title: '举报暂不可用',
      content: '举报服务正在完善。如遇紧急风险内容，请先停止互动并保留相关信息。',
      showCancel: false
    });
  }
});
