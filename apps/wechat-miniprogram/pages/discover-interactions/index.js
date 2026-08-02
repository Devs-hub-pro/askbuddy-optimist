const { getNavigationLayout } = require('../../utils/navigation');

Page({
  data: {
    navLayout: getNavigationLayout(),
    interactions: [
      { id: '1', initial: 'L', name: 'Luna', action: '赞了你的动态', content: '英国硕士申请时间线整理', time: '20 分钟前' },
      { id: '2', initial: 'S', name: 'Shawn', action: '评论了你的动态', content: '项目描述可以再量化一些', time: '2 小时前' }
    ]
  },
  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) return wx.navigateBack();
    wx.switchTab({ url: '/pages/discover/index' });
  }
});
