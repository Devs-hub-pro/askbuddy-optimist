const { getExpert } = require('../../utils/ui-catalog');
const { getNavigationLayout } = require('../../utils/navigation');

Page({
  data: {
    navLayout: getNavigationLayout(),
    expert: getExpert('demo-expert-1'),
    inputValue: '',
    messages: []
  },

  onLoad(options) {
    const expert = getExpert(options.expertId || 'demo-expert-1');
    this.setData({
      expert,
      messages: [
        { id: '1', mine: false, content: `你好，我是${expert.name}。你可以先说说目前最想解决的问题。`, time: '18:20' },
        { id: '2', mine: true, content: '我想先梳理一下时间线和当前优先级。', time: '18:23' },
        { id: '3', mine: false, content: '可以，先把目标、截止时间和已经完成的准备列出来。', time: '18:25' }
      ]
    });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) return wx.navigateBack();
    wx.switchTab({ url: '/pages/messages/index' });
  },
  openExpert() { wx.navigateTo({ url: `/pages/expert-detail/index?id=${this.data.expert.id}` }); },
  onInput(event) { this.setData({ inputValue: event.detail.value }); },
  goCall() {
    wx.navigateTo({
      url: `/pages/call/index?calleeId=${encodeURIComponent(this.data.expert.userId)}&calleeName=${encodeURIComponent(this.data.expert.name)}&mode=voice`
    });
  },

  sendMessage() {
    if (!this.data.inputValue.trim()) return;
    wx.showModal({
      title: '暂时无法发送',
      content: '消息服务正在接入。你输入的内容会保留在当前页面，但不会显示为已发送。',
      showCancel: false
    });
  }
});
