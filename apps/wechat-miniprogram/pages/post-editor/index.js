const { getNavigationLayout } = require('../../utils/navigation');

Page({
  data: {
    navLayout: getNavigationLayout(),
    content: '',
    count: 0,
    tags: [
      { name: '留学申请', active: false },
      { name: '简历优化', active: false },
      { name: '租房避坑', active: false }
    ],
    selectedTags: [],
    cityEnabled: false,
    mediaFiles: []
  },

  onLoad() {
    const draft = wx.getStorageSync('postDraft');
    if (!draft) return;
    const selectedTags = Array.isArray(draft.selectedTags) ? draft.selectedTags : [];
    this.setData({
      content: draft.content || '',
      count: (draft.content || '').length,
      selectedTags,
      cityEnabled: Boolean(draft.cityEnabled),
      tags: this.data.tags.map((item) => ({ ...item, active: selectedTags.includes(item.name) }))
    });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) return wx.navigateBack();
    wx.switchTab({ url: '/pages/discover/index' });
  },
  onInput(event) { const content = event.detail.value; this.setData({ content, count: content.length }); },
  toggleCity() { this.setData({ cityEnabled: !this.data.cityEnabled }); },

  toggleTag(event) {
    const tag = event.currentTarget.dataset.tag;
    const selectedTags = this.data.selectedTags.includes(tag)
      ? this.data.selectedTags.filter((item) => item !== tag)
      : this.data.selectedTags.concat(tag);
    const tags = this.data.tags.map((item) => ({ ...item, active: selectedTags.includes(item.name) }));
    this.setData({ selectedTags, tags });
  },

  chooseImage() {
    if (this.data.mediaFiles.length >= 9) {
      wx.showToast({ title: '最多选择 9 张图片', icon: 'none' });
      return;
    }
    wx.chooseMedia({
      count: Math.max(1, 9 - this.data.mediaFiles.length),
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        const selected = (result.tempFiles || []).map((item) => item.tempFilePath).filter(Boolean);
        this.setData({ mediaFiles: this.data.mediaFiles.concat(selected).slice(0, 9) });
      },
      fail: (error) => {
        if (!String(error.errMsg || '').includes('cancel')) {
          wx.showToast({ title: '暂时无法选择图片', icon: 'none' });
        }
      }
    });
  },

  removeImage(event) {
    const index = Number(event.currentTarget.dataset.index);
    this.setData({ mediaFiles: this.data.mediaFiles.filter((_, itemIndex) => itemIndex !== index) });
  },

  saveDraft() {
    wx.setStorageSync('postDraft', {
      content: this.data.content,
      selectedTags: this.data.selectedTags,
      cityEnabled: this.data.cityEnabled
    });
  },

  publish() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '先写下想分享的经验', icon: 'none' });
      return;
    }
    this.saveDraft();
    wx.showModal({
      title: '暂时无法发布',
      content: '发布服务正在准备中，内容已保存到本机草稿，本次不会显示为已发布。',
      showCancel: false
    });
  }
});
