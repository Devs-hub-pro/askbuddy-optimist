const { callRpc } = require('../../utils/request');

Page({
  data: {
    title: '',
    content: '',
    submitting: false
  },

  onShareAppMessage() {
    return {
      title: '我在 AskBuddy 提问',
      path: '/pages/ask/index'
    };
  },

  onTitleInput(event) {
    this.setData({ title: event.detail.value });
  },

  onContentInput(event) {
    this.setData({ content: event.detail.value });
  },

  async submitQuestion() {
    const title = this.data.title.trim();
    const content = this.data.content.trim();
    if (!title || !content) {
      wx.showToast({ title: '请补全标题和内容', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    try {
      const result = await callRpc('submitQuestion', { title, content });
      wx.showToast({ title: '提交成功', icon: 'success' });
      wx.navigateTo({ url: `/pages/question-detail/index?id=${result.id}` });
    } catch (error) {
      wx.showToast({ title: error.message || '提交失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  }
});
