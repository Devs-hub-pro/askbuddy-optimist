
// messages.js
Page({
  data: {
    activeTab: 'messages', // 'messages' or 'notifications'
    showSearch: false,
    searchQuery: '',
    conversations: [
      {
        id: 1,
        avatar: '/assets/avatars/user1.png',
        name: '张教授',
        lastMessage: '请问您什么时候有空讨论一下我的问题？',
        time: '10:30',
        unread: 3,
        isPinned: true,
        isRead: false
      },
      {
        id: 2,
        avatar: '/assets/avatars/user2.png',
        name: '李医生',
        lastMessage: '[语音消息]',
        time: '昨天',
        unread: 0,
        isPinned: false,
        isRead: true
      },
      {
        id: 3,
        avatar: '/assets/avatars/user3.png',
        name: '王工程师',
        lastMessage: '这个问题我已经解决了，谢谢您的帮助！',
        time: '周二',
        unread: 0,
        isPinned: false,
        isRead: true
      },
      {
        id: 4,
        avatar: '/assets/avatars/user4.png',
        name: '赵设计师',
        lastMessage: '[图片]',
        time: '周一',
        unread: 1,
        isPinned: false,
        isRead: false
      },
    ],
    notifications: [
      {
        id: 1,
        type: 'transaction',
        title: '交易成功',
        content: '您已成功支付¥50.00给张教授的咨询费用',
        time: '今天 14:30',
        isRead: false
      },
      {
        id: 2,
        type: 'activity',
        title: '活动通知',
        content: '新用户专属：首次咨询享受8折优惠',
        time: '昨天 09:15',
        isRead: true
      },
      {
        id: 3,
        type: 'interaction',
        title: '回答点赞',
        content: '李医生赞了您对"如何缓解焦虑"的回答',
        time: '前天 18:22',
        isRead: false
      },
      {
        id: 4,
        type: 'system',
        title: '系统公告',
        content: '平台已更新至V2.0版本，新增语音转文字功能',
        time: '3天前',
        isRead: true
      },
    ],
    archivedConversations: []
  },
  
  // 生命周期函数
  onLoad: function() {
    // 初始化逻辑
  },
  
  // 切换标签（私信/通知）
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },
  
  // 切换搜索栏显示状态
  toggleSearch: function() {
    this.setData({
      showSearch: !this.data.showSearch,
      searchQuery: '' // 清空搜索内容
    });
  },
  
  // 处理搜索输入
  handleSearchInput: function(e) {
    this.setData({
      searchQuery: e.detail.value
    });
    // 实时搜索逻辑
  },
  
  // 进入聊天详情
  navigateToChat: function(e) {
    const conversationId = e.currentTarget.dataset.id;
    // 标记为已读
    const conversations = this.data.conversations.map(item => {
      if (item.id === conversationId) {
        return {...item, unread: 0, isRead: true};
      }
      return item;
    });
    
    this.setData({ conversations });
    
    // 导航到聊天详情页，传递会话ID
    wx.navigateTo({
      url: `/pages/chat-detail/chat-detail?id=${conversationId}`
    });
  },
  
  // 查看通知详情
  viewNotification: function(e) {
    const notificationId = e.currentTarget.dataset.id;
    const notificationType = e.currentTarget.dataset.type;
    
    // 标记通知为已读
    const notifications = this.data.notifications.map(item => {
      if (item.id === notificationId) {
        return {...item, isRead: true};
      }
      return item;
    });
    
    this.setData({ notifications });
    
    // 根据通知类型跳转到不同页面
    switch(notificationType) {
      case 'transaction':
        wx.navigateTo({ url: '/pages/order-detail/order-detail?id=' + notificationId });
        break;
      case 'activity':
        wx.navigateTo({ url: '/pages/activity-detail/activity-detail?id=' + notificationId });
        break;
      case 'interaction':
        wx.navigateTo({ url: '/pages/question-detail/question-detail?id=' + notificationId });
        break;
      case 'system':
        // 系统通知不跳转，只标记已读
        break;
    }
  },
  
  // 长按会话处理
  handleLongPressConversation: function(e) {
    const conversationId = e.currentTarget.dataset.id;
    const conversation = this.data.conversations.find(item => item.id === conversationId);
    
    wx.showActionSheet({
      itemList: [
        conversation.isPinned ? '取消置顶' : '置顶会话', 
        conversation.isRead ? '标记为未读' : '标记为已读', 
        '归档会话', 
        '删除会话'
      ],
      success: (res) => {
        switch(res.tapIndex) {
          case 0: // 置顶/取消置顶
            this.togglePinConversation(conversationId);
            break;
          case 1: // 标记已读/未读
            this.toggleReadStatus(conversationId);
            break;
          case 2: // 归档
            this.archiveConversation(conversationId);
            break;
          case 3: // 删除
            this.showDeleteConfirm(conversationId);
            break;
        }
      }
    });
  },
  
  // 置顶/取消置顶会话
  togglePinConversation: function(conversationId) {
    const conversations = this.data.conversations.map(item => {
      if (item.id === conversationId) {
        return {...item, isPinned: !item.isPinned};
      }
      return item;
    });
    
    // 重新排序，置顶的排在前面
    const sortedConversations = this.sortConversations(conversations);
    
    this.setData({ conversations: sortedConversations });
  },
  
  // 标记会话为已读/未读
  toggleReadStatus: function(conversationId) {
    const conversations = this.data.conversations.map(item => {
      if (item.id === conversationId) {
        return {
          ...item, 
          isRead: !item.isRead,
          unread: item.isRead ? 1 : 0 // 如果标记为未读，设置未读数为1
        };
      }
      return item;
    });
    
    this.setData({ conversations });
  },
  
  // 归档会话
  archiveConversation: function(conversationId) {
    const conversation = this.data.conversations.find(item => item.id === conversationId);
    const remaining = this.data.conversations.filter(item => item.id !== conversationId);
    const archived = [...this.data.archivedConversations, conversation];
    
    this.setData({
      conversations: remaining,
      archivedConversations: archived
    });
    
    wx.showToast({
      title: '会话已归档',
      icon: 'success'
    });
  },
  
  // 删除确认
  showDeleteConfirm: function(conversationId) {
    wx.showModal({
      title: '确认删除',
      content: '删除后将无法恢复此会话，是否继续？',
      confirmColor: '#FF5A5F',
      success: (res) => {
        if (res.confirm) {
          this.deleteConversation(conversationId);
        }
      }
    });
  },
  
  // 删除会话
  deleteConversation: function(conversationId) {
    const conversations = this.data.conversations.filter(item => item.id !== conversationId);
    this.setData({ conversations });
    
    wx.showToast({
      title: '已删除',
      icon: 'success'
    });
  },
  
  // 对会话列表排序（置顶优先）
  sortConversations: function(conversations) {
    return [...conversations].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  },
  
  // 批量标记通知为已读
  markAllNotificationsAsRead: function() {
    const notifications = this.data.notifications.map(item => ({
      ...item,
      isRead: true
    }));
    
    this.setData({ notifications });
    
    wx.showToast({
      title: '全部已读',
      icon: 'success'
    });
  },
  
  // 跳转到消息设置
  navigateToSettings: function() {
    wx.navigateTo({
      url: '/pages/message-settings/message-settings'
    });
  },
  
  // 显示归档会话
  showArchivedConversations: function() {
    wx.navigateTo({
      url: '/pages/archived-conversations/archived-conversations'
    });
  }
});
