const { getTopic } = require('../../utils/ui-catalog');
const { getNavigationLayout } = require('../../utils/navigation');

Page({
  data: {
    navLayout: getNavigationLayout(),
    topic: getTopic('demo-topic-1'),
    comment: ''
  },

  onLoad(options) {
    const topic = getTopic(options.id || 'demo-topic-1');
    const comment = wx.getStorageSync(`topicCommentDraft:${topic.id}`) || '';
    this.setData({ topic, comment });
    wx.setNavigationBarTitle({ title: topic.title });
  },

  onShareAppMessage() {
    return {
      title: this.data.topic.title,
      path: `/pages/topic-detail/index?id=${this.data.topic.id}`
    };
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) return wx.navigateBack();
    wx.switchTab({ url: '/pages/home/index' });
  },

  onCommentInput(event) {
    this.setData({ comment: event.detail.value });
  },

  submitComment() {
    const comment = this.data.comment.trim();
    if (!comment) {
      wx.showToast({ title: '先写下你的观点', icon: 'none' });
      return;
    }
    wx.setStorageSync(`topicCommentDraft:${this.data.topic.id}`, comment);
    wx.showModal({
      title: '观点已保存',
      content: '内容已保存到本机。讨论发布开放后可继续提交，本次不会显示为已发布。',
      showCancel: false
    });
  },

  likeDiscussion() {
    wx.showToast({ title: '点赞功能暂不可用', icon: 'none' });
  },

  replyDiscussion(event) {
    const author = event.currentTarget.dataset.author || '';
    this.setData({ comment: author ? `@${author} ` : this.data.comment });
  }
});
