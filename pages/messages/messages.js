// messages.js
Page({
  data: {
    activeTab: 'chats', // 'chats' or 'notifications' or 'group'
    showSearch: false,
    searchQuery: '',
    
    // Context menu
    showContextMenu: false,
    contextMenuTop: 0,
    contextMenuLeft: 0,
    contextMenuType: 'chat', // 'chat' or 'notification'
    contextMenuId: null,
    contextMenuIsPinned: false,
    contextMenuHasUnread: false,
    contextMenuIsRead: false,
    
    // Delete confirmation
    showDeleteConfirm: false,
    deleteId: null,
    deleteType: null, // 'chat' or 'notification'
    
    // Overlays
    showOverlay: false,
    
    // Chat data
    pinnedChats: [
      {
        id: 'chat-001',
        name: '李教授',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        lastMessage: '下周三有空来讨论一下项目进展吗？',
        lastMessageType: 'text',
        lastMessageTime: '昨天',
        unreadCount: 2,
        unread: true,
        online: true,
        pinned: true
      }
    ],
    regularChats: [
      {
        id: 'chat-002',
        name: '王医生',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        lastMessage: '需要您提供更多的症状描述，方便我更准确地给您建议',
        lastMessageType: 'text',
        lastMessageTime: '上午 10:23',
        unreadCount: 1,
        unread: true,
        online: false,
        pinned: false,
        swipeOffset: 0
      },
      {
        id: 'chat-003',
        name: '陈律师',
        avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
        lastMessage: '已经帮您审核了合同，有几处需要注意的地方',
        lastMessageType: 'text',
        lastMessageTime: '周一',
        unreadCount: 0,
        unread: false,
        online: true,
        pinned: false,
        swipeOffset: 0
      },
      {
        id: 'chat-004',
        name: '赵老师',
        avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
        lastMessage: '',
        lastMessageType: 'image',
        lastMessageTime: '周日',
        unreadCount: 0,
        unread: false,
        online: false,
        pinned: false,
        swipeOffset: 0
      },
      {
        id: 'chat-005',
        name: '张设计师',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        lastMessage: '',
        lastMessageType: 'file',
        lastMessageTime: '10/12',
        unreadCount: 0,
        unread: false,
        online: false,
        pinned: false,
        swipeOffset: 0
      },
      {
        id: 'chat-006',
        name: '刘会计',
        avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
        lastMessage: '',
        lastMessageType: 'voice',
        lastMessageTime: '9/30',
        unreadCount: 0,
        unread: false,
        online: false,
        pinned: false,
        swipeOffset: 0
      }
    ],
    filteredChats: [], // Will be populated based on search
    
    // Group messages mock data
    groupMessages: [
      {
        id: 'group-001',
        name: '前端开发交流群',
        avatar: 'https://randomuser.me/api/portraits/lego/3.jpg',
        lastMessage: '【公告】本周五有主题分享，欢迎参加！',
        lastMessageType: 'text',
        lastMessageTime: '昨天',
        unreadCount: 3,
        unread: true,
      },
      {
        id: 'group-002',
        name: '考研交流社群',
        avatar: 'https://randomuser.me/api/portraits/lego/6.jpg',
        lastMessage: '张同学：大家最近有什么冲刺经验分享吗？',
        lastMessageType: 'text',
        lastMessageTime: '上午 09:40',
        unreadCount: 0,
        unread: false,
      }
    ],
    filteredGroupMessages: [],
    unreadGroupMessages: 0,
    
    // Notification data
    transactionNotifications: [
      {
        id: 'notif-001',
        title: '订单已完成',
        message: '您与王医生的咨询订单已完成，请及时评价',
        time: '今天 14:30',
        type: 'transaction',
        read: false
      }
    ],
    activityNotifications: [
      {
        id: 'notif-002',
        title: '限时活动',
        message: '双11优惠：所有专家咨询享8折优惠，立即查看',
        time: '昨天',
        type: 'activity',
        read: true
      }
    ],
    interactionNotifications: [
      {
        id: 'notif-003',
        title: '新回答',
        message: '李教授回答了您的问题"如何提高英语口语水平？"',
        time: '昨天',
        type: 'interaction',
        read: false
      },
      {
        id: 'notif-004',
        title: '新点赞',
        message: '5人点赞了您的问题"怎样才能有效管理时间？"',
        time: '3天前',
        type: 'interaction',
        read: true
      }
    ],
    systemNotifications: [
      {
        id: 'notif-005',
        title: '系统更新',
        message: '找人问问小程序已更新至v2.1.0，新增语音识别功能',
        time: '1周前',
        type: 'system',
        read: true
      }
    ],
    filteredNotifications: [], // Will be populated based on search
    
    // Touch handling for swipe
    touchStartX: 0,
    touchStartTime: 0
  },
  
  onLoad: function() {
    this.filterData();
    this.calculateUnreadNotifications();
    this.calculateUnreadGroupMessages();
  },
  
  calculateUnreadNotifications: function() {
    const unreadCount = 
      this.countUnread(this.data.transactionNotifications) +
      this.countUnread(this.data.activityNotifications) +
      this.countUnread(this.data.interactionNotifications) +
      this.countUnread(this.data.systemNotifications);
    
    this.setData({
      unreadNotifications: unreadCount
    });
  },
  
  calculateUnreadGroupMessages: function() {
    const unreadCount = this.data.groupMessages.filter(g => g.unreadCount > 0).reduce((sum, g) => sum + g.unreadCount, 0);
    this.setData({
      unreadGroupMessages: unreadCount
    });
  },
  
  countUnread: function(notifications) {
    return notifications.filter(n => !n.read).length;
  },
  
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },
  
  toggleSearch: function() {
    this.setData({
      showSearch: !this.data.showSearch,
      searchQuery: ''
    });
    
    if (!this.data.showSearch) {
      this.filterData();
    }
  },
  
  onSearchInput: function(e) {
    const query = e.detail.value;
    this.setData({
      searchQuery: query
    });
    this.filterData();
  },
  
  filterData: function() {
    const query = this.data.searchQuery.toLowerCase();
    
    // Filter chats
    const allChats = [...this.data.regularChats];
    const filteredChats = query 
      ? allChats.filter(chat => 
          chat.name.toLowerCase().includes(query) || 
          chat.lastMessage.toLowerCase().includes(query))
      : allChats;
    
    // Filter group messages
    const allGroup = [...this.data.groupMessages];
    const filteredGroupMessages = query
      ? allGroup.filter(msg => 
          msg.name.toLowerCase().includes(query) || 
          msg.lastMessage.toLowerCase().includes(query))
      : allGroup;
    
    // Filter notifications
    const allNotifications = [
      ...this.data.transactionNotifications,
      ...this.data.activityNotifications,
      ...this.data.interactionNotifications,
      ...this.data.systemNotifications
    ];
    
    const filteredNotifications = query
      ? allNotifications.filter(notif =>
          notif.title.toLowerCase().includes(query) ||
          notif.message.toLowerCase().includes(query))
      : allNotifications;
    
    this.setData({
      filteredChats,
      filteredGroupMessages,
      filteredNotifications
    });
  },
  
  openChat: function(e) {
    const chatId = e.currentTarget.dataset.id;
    
    // Here you would navigate to the chat detail page
    wx.navigateTo({
      url: `/pages/chat-detail/chat-detail?id=${chatId}`
    });
    
    // Mark as read when opening
    this.markChatAsReadById(chatId);
  },
  
  openNotification: function(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type;
    
    // Mark notification as read
    this.markNotificationAsReadById(id);
    
    // Navigate based on notification type
    switch (type) {
      case 'transaction':
        // Navigate to order details
        break;
      case 'activity':
        // Navigate to activity page
        break;
      case 'interaction':
        // Navigate to the question or answer
        break;
      case 'system':
        // Maybe show a modal with full system message
        break;
    }
  },
  
  openSettings: function() {
    wx.navigateTo({
      url: '/pages/message-settings/message-settings'
    });
  },
  
  startNewChat: function() {
    // Navigate to contact list or expert list to start a new chat
    wx.navigateTo({
      url: '/pages/contacts/contacts'
    });
  },
  
  showChatOptions: function(e) {
    const id = e.currentTarget.dataset.id;
    const isPinned = e.currentTarget.dataset.pinned === 'true';
    
    // Find chat to determine if it has unread messages
    let chat;
    if (isPinned) {
      chat = this.data.pinnedChats.find(c => c.id === id);
    } else {
      chat = this.data.regularChats.find(c => c.id === id);
    }
    
    const hasUnread = chat && chat.unreadCount > 0;
    
    // Get touch position for context menu
    const rect = wx.getMenuButtonBoundingClientRect();
    
    this.setData({
      showContextMenu: true,
      contextMenuTop: e.touches[0].clientY,
      contextMenuLeft: e.touches[0].clientX,
      contextMenuType: 'chat',
      contextMenuId: id,
      contextMenuIsPinned: isPinned,
      contextMenuHasUnread: hasUnread,
      showOverlay: true
    });
  },
  
  showGroupOptions: function(e) {
    const id = e.currentTarget.dataset.id;
    console.log('长按社群消息', id);
    // 可补充更多context menu操作
  },
  
  hideOverlay: function() {
    this.setData({
      showContextMenu: false,
      showDeleteConfirm: false,
      showOverlay: false
    });
  },
  
  pinChat: function() {
    const id = this.data.contextMenuId;
    
    // Find chat in regular chats
    const chatIndex = this.data.regularChats.findIndex(c => c.id === id);
    if (chatIndex > -1) {
      const chat = { ...this.data.regularChats[chatIndex], pinned: true };
      
      // Remove from regular chats
      const updatedRegularChats = this.data.regularChats.filter(c => c.id !== id);
      
      // Add to pinned chats
      const updatedPinnedChats = [...this.data.pinnedChats, chat];
      
      this.setData({
        regularChats: updatedRegularChats,
        pinnedChats: updatedPinnedChats,
        showContextMenu: false,
        showOverlay: false
      });
      
      // Update filtered chats
      this.filterData();
    }
  },
  
  unpinChat: function() {
    const id = this.data.contextMenuId;
    
    // Find chat in pinned chats
    const chatIndex = this.data.pinnedChats.findIndex(c => c.id === id);
    if (chatIndex > -1) {
      const chat = { ...this.data.pinnedChats[chatIndex], pinned: false };
      
      // Remove from pinned chats
      const updatedPinnedChats = this.data.pinnedChats.filter(c => c.id !== id);
      
      // Add to regular chats
      const updatedRegularChats = [chat, ...this.data.regularChats];
      
      this.setData({
        pinnedChats: updatedPinnedChats,
        regularChats: updatedRegularChats,
        showContextMenu: false,
        showOverlay: false
      });
      
      // Update filtered chats
      this.filterData();
    }
  },
  
  markChatAsRead: function() {
    this.markChatAsReadById(this.data.contextMenuId);
    this.hideOverlay();
  },
  
  markChatAsReadById: function(id) {
    // Check in pinned chats
    let pinnedChats = [...this.data.pinnedChats];
    let regularChats = [...this.data.regularChats];
    let updated = false;
    
    // Update in pinned chats
    const pinnedIndex = pinnedChats.findIndex(c => c.id === id);
    if (pinnedIndex > -1) {
      pinnedChats[pinnedIndex] = {
        ...pinnedChats[pinnedIndex],
        unreadCount: 0,
        unread: false
      };
      updated = true;
    }
    
    // Update in regular chats
    const regularIndex = regularChats.findIndex(c => c.id === id);
    if (regularIndex > -1) {
      regularChats[regularIndex] = {
        ...regularChats[regularIndex],
        unreadCount: 0,
        unread: false
      };
      updated = true;
    }
    
    if (updated) {
      this.setData({ pinnedChats, regularChats });
      this.filterData();
    }
  },
  
  markChatAsUnread: function() {
    const id = this.data.contextMenuId;
    
    // Check in pinned chats
    let pinnedChats = [...this.data.pinnedChats];
    let regularChats = [...this.data.regularChats];
    let updated = false;
    
    // Update in pinned chats
    const pinnedIndex = pinnedChats.findIndex(c => c.id === id);
    if (pinnedIndex > -1) {
      pinnedChats[pinnedIndex] = {
        ...pinnedChats[pinnedIndex],
        unreadCount: 1,
        unread: true
      };
      updated = true;
    }
    
    // Update in regular chats
    const regularIndex = regularChats.findIndex(c => c.id === id);
    if (regularIndex > -1) {
      regularChats[regularIndex] = {
        ...regularChats[regularIndex],
        unreadCount: 1,
        unread: true
      };
      updated = true;
    }
    
    if (updated) {
      this.setData({ pinnedChats, regularChats });
      this.filterData();
      this.hideOverlay();
    }
  },
  
  markNotificationAsRead: function() {
    this.markNotificationAsReadById(this.data.contextMenuId);
    this.hideOverlay();
  },
  
  markNotificationAsReadById: function(id) {
    // Update in all notification arrays
    const updateNotifications = (notifications) => {
      return notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
    };
    
    this.setData({
      transactionNotifications: updateNotifications(this.data.transactionNotifications),
      activityNotifications: updateNotifications(this.data.activityNotifications),
      interactionNotifications: updateNotifications(this.data.interactionNotifications),
      systemNotifications: updateNotifications(this.data.systemNotifications)
    });
    
    this.calculateUnreadNotifications();
    this.filterData();
  },
  
  markNotificationAsUnread: function() {
    const id = this.data.contextMenuId;
    
    // Update in all notification arrays
    const updateNotifications = (notifications) => {
      return notifications.map(n => 
        n.id === id ? { ...n, read: false } : n
      );
    };
    
    this.setData({
      transactionNotifications: updateNotifications(this.data.transactionNotifications),
      activityNotifications: updateNotifications(this.data.activityNotifications),
      interactionNotifications: updateNotifications(this.data.interactionNotifications),
      systemNotifications: updateNotifications(this.data.systemNotifications)
    });
    
    this.calculateUnreadNotifications();
    this.filterData();
    this.hideOverlay();
  },
  
  markAllAsRead: function() {
    // Update all notification arrays
    const markAllRead = (notifications) => {
      return notifications.map(n => ({ ...n, read: true }));
    };
    
    this.setData({
      transactionNotifications: markAllRead(this.data.transactionNotifications),
      activityNotifications: markAllRead(this.data.activityNotifications),
      interactionNotifications: markAllRead(this.data.interactionNotifications),
      systemNotifications: markAllRead(this.data.systemNotifications),
      unreadNotifications: 0
    });
    
    wx.showToast({
      title: '已全部标为已读',
      icon: 'success',
      duration: 1500
    });
    
    this.filterData();
  },
  
  archiveChat: function() {
    const id = this.data.contextMenuId || this.data.deleteId;
    
    // Remove from both regular and pinned chats
    const updatedRegularChats = this.data.regularChats.filter(c => c.id !== id);
    const updatedPinnedChats = this.data.pinnedChats.filter(c => c.id !== id);
    
    this.setData({
      regularChats: updatedRegularChats,
      pinnedChats: updatedPinnedChats,
      showContextMenu: false,
      showOverlay: false
    });
    
    // Update filtered chats
    this.filterData();
    
    wx.showToast({
      title: '已存档',
      icon: 'success',
      duration: 1500
    });
  },
  
  showDeleteConfirm: function(e) {
    let id, type;
    
    if (e) {
      // Called directly from swipe or button
      id = e.currentTarget.dataset.id;
      type = this.data.activeTab === 'chats' ? 'chat' : 'notification';
    } else {
      // Called from context menu
      id = this.data.contextMenuId;
      type = this.data.contextMenuType;
    }
    
    this.setData({
      showDeleteConfirm: true,
      showContextMenu: false,
      deleteId: id,
      deleteType: type,
      showOverlay: true
    });
  },
  
  cancelDelete: function() {
    this.setData({
      showDeleteConfirm: false,
      showOverlay: false,
      deleteId: null,
      deleteType: null
    });
  },
  
  confirmDelete: function() {
    const id = this.data.deleteId;
    const type = this.data.deleteType;
    
    if (type === 'chat') {
      // Remove from both regular and pinned chats
      const updatedRegularChats = this.data.regularChats.filter(c => c.id !== id);
      const updatedPinnedChats = this.data.pinnedChats.filter(c => c.id !== id);
      
      this.setData({
        regularChats: updatedRegularChats,
        pinnedChats: updatedPinnedChats
      });
    } else {
      // Remove from notification arrays
      const filterById = (notifications) => notifications.filter(n => n.id !== id);
      
      this.setData({
        transactionNotifications: filterById(this.data.transactionNotifications),
        activityNotifications: filterById(this.data.activityNotifications),
        interactionNotifications: filterById(this.data.interactionNotifications),
        systemNotifications: filterById(this.data.systemNotifications)
      });
      
      this.calculateUnreadNotifications();
    }
    
    // Close dialog and update lists
    this.setData({
      showDeleteConfirm: false,
      showOverlay: false,
      deleteId: null,
      deleteType: null
    });
    
    this.filterData();
    
    wx.showToast({
      title: '已删除',
      icon: 'success',
      duration: 1500
    });
  },
  
  // Swipe handling
  touchStart: function(e) {
    if (e.touches.length === 1) {
      this.setData({
        touchStartX: e.touches[0].clientX,
        touchStartTime: new Date().getTime()
      });
    }
  },
  
  touchMove: function(e) {
    if (e.touches.length === 1) {
      const index = e.currentTarget.dataset.index;
      const touchMoveX = e.touches[0].clientX;
      const moveDistance = this.data.touchStartX - touchMoveX;
      
      // Only allow swipe left (positive moveDistance)
      if (moveDistance > 0) {
        // Cap the swipe at 160px (width of action buttons)
        const offset = Math.min(moveDistance, 160);
        
        const updatedChats = [...this.data.regularChats];
        if (updatedChats[index]) {
          updatedChats[index].swipeOffset = offset;
          
          this.setData({
            regularChats: updatedChats
          });
          
          // Update filtered chats if needed
          if (this.data.searchQuery) {
            this.filterData();
          }
        }
      }
    }
  },
  
  touchEnd: function(e) {
    const index = e.currentTarget.dataset.index;
    const touchEndTime = new Date().getTime();
    const timeDiff = touchEndTime - this.data.touchStartTime;
    
    const updatedChats = [...this.data.regularChats];
    if (updatedChats[index]) {
      // If swiped more than 80px or swiped quickly, snap to full open
      if (updatedChats[index].swipeOffset > 80 || 
          (updatedChats[index].swipeOffset > 20 && timeDiff < 200)) {
        updatedChats[index].swipeOffset = 160;
      } else {
        // Otherwise, snap back closed
        updatedChats[index].swipeOffset = 0;
      }
      
      this.setData({
        regularChats: updatedChats
      });
      
      // Update filtered chats if needed
      if (this.data.searchQuery) {
        this.filterData();
      }
    }
  },
  
  openGroupMessage: function(e) {
    const groupId = e.currentTarget.dataset.id;
    // 可跳转到群聊详情，目前控制台输出
    console.log('打开社群消息', groupId);
    this.markGroupMessageAsReadById(groupId);
  },
  
  markGroupMessageAsReadById: function(id) {
    let groupMessages = [...this.data.groupMessages];
    const groupIndex = groupMessages.findIndex(g => g.id === id);
    if (groupIndex > -1) {
      groupMessages[groupIndex] = {
        ...groupMessages[groupIndex],
        unreadCount: 0,
        unread: false
      };
      this.setData({
        groupMessages
      });
      this.filterData();
      this.calculateUnreadGroupMessages();
    }
  }
});
