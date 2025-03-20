// messages.js
Page({
  data: {
    activeTab: 'privateMessages', // 'privateMessages' or 'notifications'
    isSearchVisible: false,
    notificationCategory: 'all',
    hasUnreadNotifications: true,
    conversations: [
      {
        id: '1',
        name: '张医生',
        avatar: '/assets/images/avatar1.png',
        lastMessage: '您的问题我已经看到了，建议您...',
        lastMessageTime: '14:30',
        unread: true,
        unreadCount: 1,
        rightValue: 0
      },
      {
        id: '2',
        name: '李教授',
        avatar: '/assets/images/avatar2.png',
        lastMessage: '关于这个问题，我认为...',
        lastMessageTime: '昨天',
        unread: false,
        unreadCount: 0,
        rightValue: 0
      },
      {
        id: '3',
        name: '王工程师',
        avatar: '/assets/images/avatar3.png',
        lastMessage: '[图片]',
        lastMessageTime: '周二',
        unread: false,
        unreadCount: 0,
        rightValue: 0
      }
    ],
    pinnedConversations: [
      {
        id: '4',
        name: '陈老师',
        avatar: '/assets/images/avatar4.png',
        lastMessage: '我们明天下午3点进行在线咨询，请准时。',
        lastMessageTime: '10:15',
        unread: true,
        unreadCount: 2,
        pinned: true
      }
    ],
    notifications: [
      {
        id: '1',
        type: 'transaction',
        icon: 'wallet',
        title: '订单已完成',
        content: '您与张医生的咨询已完成，请评价',
        time: '1小时前',
        unread: true
      },
      {
        id: '2',
        type: 'interaction',
        icon: 'heart',
        title: '新的点赞',
        content: '李教授点赞了您的回答',
        time: '2小时前',
        unread: true
      },
      {
        id: '3',
        type: 'activity',
        icon: 'calendar',
        title: '活动提醒',
        content: '您关注的「职场进阶」有新活动',
        time: '昨天',
        unread: false
      },
      {
        id: '4',
        type: 'system',
        icon: 'bell',
        title: '系统通知',
        content: '您的账号已完成实名认证',
        time: '2天前',
        unread: false
      }
    ],
    startX: 0,
    currentConversationIndex: -1
  },
  
  onLoad: function() {
    // Initialize data when the page loads
  },
  
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },
  
  toggleSearch: function() {
    this.setData({
      isSearchVisible: !this.data.isSearchVisible
    });
  },
  
  goToSettings: function() {
    wx.navigateTo({
      url: '/pages/message-settings/message-settings'
    });
  },
  
  onSearch: function(e) {
    const keyword = e.detail.value;
    // Filter conversations or notifications based on keyword
    // Implementation would depend on backend search functionality
  },
  
  openConversation: function(e) {
    const conversationId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/chat/chat?id=${conversationId}`
    });
    
    this.markConversationAsRead(conversationId);
  },
  
  markConversationAsRead: function(id) {
    // Update local state first for immediate feedback
    const { conversations, pinnedConversations } = this.data;
    
    let updatedConversations = conversations.map(conv => {
      if (conv.id === id) {
        return { ...conv, unread: false, unreadCount: 0 };
      }
      return conv;
    });
    
    let updatedPinnedConversations = pinnedConversations.map(conv => {
      if (conv.id === id) {
        return { ...conv, unread: false, unreadCount: 0 };
      }
      return conv;
    });
    
    this.setData({
      conversations: updatedConversations,
      pinnedConversations: updatedPinnedConversations
    });
    
    // API call to update server state would go here
  },
  
  showActionSheet: function(e) {
    const conversation = e.currentTarget.dataset.conversation;
    
    wx.showActionSheet({
      itemList: conversation.pinned ? 
        ['标记为已读', '取消置顶', '删除'] : 
        ['标记为已读', '置顶', '删除'],
      success: (res) => {
        switch(res.tapIndex) {
          case 0: // Mark as read
            this.markConversationAsRead(conversation.id);
            break;
          case 1: // Toggle pin
            this.togglePinConversation(conversation.id);
            break;
          case 2: // Delete
            this.confirmDeleteConversation(conversation.id);
            break;
        }
      }
    });
  },
  
  togglePinConversation: function(id) {
    const { conversations, pinnedConversations } = this.data;
    
    // If conversation is already pinned, unpin it
    if (pinnedConversations.some(conv => conv.id === id)) {
      const conversationToUnpin = pinnedConversations.find(conv => conv.id === id);
      const updatedPinnedConversations = pinnedConversations.filter(conv => conv.id !== id);
      const updatedConversations = [
        {...conversationToUnpin, pinned: false},
        ...conversations
      ];
      
      this.setData({
        pinnedConversations: updatedPinnedConversations,
        conversations: updatedConversations
      });
    } 
    // Otherwise, pin the conversation
    else {
      const conversationToPin = conversations.find(conv => conv.id === id);
      const updatedConversations = conversations.filter(conv => conv.id !== id);
      const updatedPinnedConversations = [
        {...conversationToPin, pinned: true},
        ...pinnedConversations
      ];
      
      this.setData({
        pinnedConversations: updatedPinnedConversations,
        conversations: updatedConversations
      });
    }
    
    // API call to update server state would go here
  },
  
  confirmDeleteConversation: function(id) {
    wx.showModal({
      title: '删除会话',
      content: '确定删除此会话吗？删除后将无法恢复。',
      confirmText: '删除',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          this.deleteConversation(id);
        }
      }
    });
  },
  
  deleteConversation: function(id) {
    const { conversations, pinnedConversations } = this.data;
    
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    const updatedPinnedConversations = pinnedConversations.filter(conv => conv.id !== id);
    
    this.setData({
      conversations: updatedConversations,
      pinnedConversations: updatedPinnedConversations
    });
    
    // API call to update server state would go here
    
    wx.showToast({
      title: '已删除',
      icon: 'success'
    });
  },
  
  archiveConversation: function(e) {
    const id = e.currentTarget.dataset.id;
    const { conversations } = this.data;
    
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    
    this.setData({
      conversations: updatedConversations
    });
    
    // API call to archive on server would go here
    
    wx.showToast({
      title: '已归档',
      icon: 'success'
    });
  },
  
  changeNotificationCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      notificationCategory: category
    });
    
    // Filter notifications based on category
    // Implementation would depend on backend functionality
  },
  
  openNotification: function(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type;
    
    // Mark as read
    this.markNotificationAsRead(id);
    
    // Navigate based on notification type
    switch(type) {
      case 'transaction':
        wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${id}` });
        break;
      case 'interaction':
        wx.navigateTo({ url: `/pages/interaction-detail/interaction-detail?id=${id}` });
        break;
      case 'activity':
        wx.navigateTo({ url: `/pages/activity-detail/activity-detail?id=${id}` });
        break;
      case 'system':
        wx.navigateTo({ url: `/pages/system-notification/system-notification?id=${id}` });
        break;
    }
  },
  
  markNotificationAsRead: function(id) {
    const { notifications } = this.data;
    
    const updatedNotifications = notifications.map(notif => {
      if (notif.id === id) {
        return { ...notif, unread: false };
      }
      return notif;
    });
    
    this.setData({
      notifications: updatedNotifications,
      hasUnreadNotifications: updatedNotifications.some(notif => notif.unread)
    });
    
    // API call to update server state would go here
  },
  
  markAllAsRead: function() {
    const { notifications } = this.data;
    
    const updatedNotifications = notifications.map(notif => {
      return { ...notif, unread: false };
    });
    
    this.setData({
      notifications: updatedNotifications,
      hasUnreadNotifications: false
    });
    
    // API call to update server state would go here
    
    wx.showToast({
      title: '全部已读',
      icon: 'success'
    });
  },
  
  showNotificationActions: function(e) {
    const notification = e.currentTarget.dataset.notification;
    
    wx.showActionSheet({
      itemList: notification.unread ? ['标记为已读', '删除'] : ['删除'],
      success: (res) => {
        if (notification.unread && res.tapIndex === 0) {
          this.markNotificationAsRead(notification.id);
        } else {
          this.deleteNotification(notification.id);
        }
      }
    });
  },
  
  deleteNotification: function(id) {
    const { notifications } = this.data;
    
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    
    this.setData({
      notifications: updatedNotifications,
      hasUnreadNotifications: updatedNotifications.some(notif => notif.unread)
    });
    
    // API call to update server state would go here
    
    wx.showToast({
      title: '已删除',
      icon: 'success'
    });
  },
  
  touchStart: function(e) {
    if (e.touches.length === 1) {
      this.setData({
        startX: e.touches[0].clientX,
        currentConversationIndex: e.currentTarget.dataset.index
      });
    }
  },
  
  touchMove: function(e) {
    if (e.touches.length === 1) {
      const moveX = e.touches[0].clientX;
      const distance = this.data.startX - moveX;
      
      if (distance <= 0) {
        return;
      }
      
      // Maximum swipe distance is 180rpx (width of both action buttons)
      let rightValue = distance > 180 ? 180 : distance;
      
      // Update right value for current conversation
      const index = e.currentTarget.dataset.index;
      const conversations = [...this.data.conversations];
      conversations[index].rightValue = rightValue;
      
      this.setData({
        conversations
      });
    }
  },
  
  touchEnd: function(e) {
    const index = this.data.currentConversationIndex;
    
    if (index < 0) {
      return;
    }
    
    const conversations = [...this.data.conversations];
    const rightValue = conversations[index].rightValue;
    
    // If swiped more than halfway, show action buttons, otherwise reset
    if (rightValue > 90) {
      conversations[index].rightValue = 180;
    } else {
      conversations[index].rightValue = 0;
    }
    
    this.setData({
      conversations,
      currentConversationIndex: -1
    });
  }
});
