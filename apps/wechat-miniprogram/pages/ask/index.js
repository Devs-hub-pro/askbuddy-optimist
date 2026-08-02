const { callRpc } = require('../../utils/request');
const { getNavigationLayout } = require('../../utils/navigation');

const DRAFT_KEY = 'questionDraft';
const CATEGORY_LABELS = {
  education: '教育学习',
  career: '职业发展',
  lifestyle: '生活服务',
  hobbies: '兴趣技能'
};

Page({
  data: {
    navLayout: getNavigationLayout(),
    title: '',
    content: '',
    titleCount: 0,
    contentCount: 0,
    selectedCategory: '',
    selectedCategoryLabel: '',
    selectedExpert: '',
    submitting: false
  },

  onLoad(options) {
    const draft = wx.getStorageSync(DRAFT_KEY) || {};
    const selectedCategory = options.category || draft.selectedCategory || '';
    this.setData({
      title: draft.title || '',
      content: draft.content || '',
      titleCount: (draft.title || '').length,
      contentCount: (draft.content || '').length,
      selectedCategory,
      selectedCategoryLabel: CATEGORY_LABELS[selectedCategory] || '',
      selectedExpert: options.expertName ? decodeURIComponent(options.expertName) : (draft.selectedExpert || '')
    });
  },

  onShareAppMessage() {
    return {
      title: '我在 AskBuddy 提问',
      path: '/pages/ask/index'
    };
  },

  onTitleInput(event) {
    const title = event.detail.value;
    this.setData({ title, titleCount: title.length });
  },

  onContentInput(event) {
    const content = event.detail.value;
    this.setData({ content, contentCount: content.length });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
      return;
    }
    wx.switchTab({ url: '/pages/home/index' });
  },

  persistDraft(showToast) {
    wx.setStorageSync(DRAFT_KEY, {
      title: this.data.title,
      content: this.data.content,
      selectedCategory: this.data.selectedCategory,
      selectedExpert: this.data.selectedExpert,
      updatedAt: Date.now()
    });
    if (showToast) wx.showToast({ title: '已保存到本机草稿', icon: 'none' });
  },

  saveDraft() {
    this.persistDraft(true);
  },

  fillExample() {
    const content = '我的目标是明年秋季入学，目前 GPA 3.5，计划申请英国授课型硕士。希望了解选校、语言考试和文书准备的合理时间线。';
    this.setData({ content, contentCount: content.length });
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
      this._published = true;
      wx.removeStorageSync(DRAFT_KEY);
      wx.showToast({ title: '提交成功', icon: 'success' });
      wx.navigateTo({ url: `/pages/question-detail/index?id=${result.id}` });
    } catch (error) {
      this.persistDraft(false);
      wx.showModal({
        title: '暂时无法发布',
        content: '问题已安全保存在本机草稿中。发布服务接入完成后可再次提交，本次不会模拟发布成功。',
        showCancel: false
      });
    } finally {
      this.setData({ submitting: false });
    }
  }
});
