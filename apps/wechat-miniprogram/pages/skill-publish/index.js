const { getNavigationLayout } = require('../../utils/navigation');

Page({
  data: {
    navLayout: getNavigationLayout(),
    title: '',
    description: '',
    category: 'education',
    categories: [
      { id: 'education', name: '教育学习' },
      { id: 'career', name: '职业发展' },
      { id: 'lifestyle', name: '生活服务' },
      { id: 'hobbies', name: '兴趣技能' }
    ]
  },

  onLoad() {
    const draft = wx.getStorageSync('skillPublishDraft');
    if (draft) this.setData(draft);
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) return wx.navigateBack();
    wx.switchTab({ url: '/pages/profile/index' });
  },

  onTitleInput(event) {
    this.setData({ title: event.detail.value });
  },

  onDescriptionInput(event) {
    this.setData({ description: event.detail.value });
  },

  chooseCategory(event) {
    this.setData({ category: event.currentTarget.dataset.id });
  },

  saveDraft(showToast = true) {
    wx.setStorageSync('skillPublishDraft', {
      title: this.data.title,
      description: this.data.description,
      category: this.data.category
    });
    if (showToast) wx.showToast({ title: '草稿已保存在本机', icon: 'none' });
  },

  submitSkill() {
    if (!this.data.title.trim() || !this.data.description.trim()) {
      wx.showToast({ title: '请补全技能标题和介绍', icon: 'none' });
      return;
    }
    this.saveDraft(false);
    wx.showModal({
      title: '暂时无法发布',
      content: '发布服务正在准备中，内容已保存到本机草稿，本次不会显示为已发布。',
      showCancel: false
    });
  }
});
