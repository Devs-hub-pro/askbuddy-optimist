
// messages.js
Page({
  data: {
    activeTab: 'chats',
    isSearchVisible: false,
    notificationCategory: 'all',
    showConversationMenu: false,
    showNotificationMenu: false,
    showDeleteDialog: false,
    menuPosition: { x: 0, y: 0 },
    deleteType: '', // 'conversation' or 'notification'
    deleteId: null,
    selectedConversation: null,
    selectedNotification: null,
    
    // Demo data - In a real app this would come from an API
    pinnedConversations: [
      {
        id: '1',
        name: '李老师',
        avatar: '/assets/icons/avatar1.png',
        lastMessage: '您好，关于您提出的问题，我有一些建议...',
        lastMessageTime: '09:45',
        unreadCount: 2,
        unread: true,
        online: true,
        pinned: true
      }
    ],
    conversations: [
      {
        id: '2',
        name: '王医生',
        avatar: '/assets/icons/avatar2.png',
        lastMessage: '请问您的症状持续多久了？',
        lastMessageTime: '昨天',
        unreadCount: 0,
        unread: false,
        online: false,
        pinned: false
      },
      {
        id: '3',
        name: '张工程师',
        avatar: '/assets/icons/avatar3.png',
        lastMessage: '[图片]',
        lastMessageTime: '星期二',
        unreadCount: 1,
        unread: true,
        online: true,
        pinned: false
      },
      {
        id: '4',
        name: '刘律师',
        avatar: '/assets/icons/avatar4.png',
        lastMessage: '根据合同条款第三条...',
        lastMessageTime: '3天前',
        unreadCount: 0,
        unread: false,
        online: false,
        pinned: false
      }
    ],
    notifications: [
      {
        id: '101',
        type: 'transaction',
        title: '订单已完成',
        message: '您与李老师的咨询已完成，请评价服务体验',
        time: '1小时前',
        read: false
      },
      {
        id: '102',
        type: 'activity',
        title: '最新活动',
        message: '「初夏知识季」活动开始，特邀名师在线答疑',
        time: '3小时前',
        read: true
      },
      {
        id: '103',
        type: 'interaction',
        title: '回答获赞',
        message: '您的回答「关于JavaScript的闭包原理...」获得3人点赞',
        time: '昨天',
        read: false
      },
      {
        id: '104',
        type: 'system',
        title: '系统通知',
        message: '系统将于今晚22:00-23:00进行维护，请提前做好准备',
        time: '2天前',
        read: true
      }
    ]
  },
  
  onLoad: function() {
    this.filterNotifications();
  },
  
  // Tab switching
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab,
      showConversationMenu: false,
      showNotificationMenu: false
    });
  },
  
  // Search bar toggle
  toggleSearch: function() {
    this.setData({
      isSearchVisible: !this.data.isSearchVisible,
      showConversationMenu: false,
      showNotificationMenu: false
    });
  },
  
  // Search functionality
  onSearchInput: function(e) {
    const searchText = e.detail.value.toLowerCase();
    // Implement search logic here
    console.log('Searching for:', searchText);
  },
  
  // Settings
  openSettings: function() {
    // Navigate to settings page
    console.log('Opening settings');
    // wx.navigateTo({ url: '/pages/message-settings/message-settings' });
  },
  
  // Chat interaction
  openChat: function(e) {
    const chatId = e.currentTarget.dataset.id;
    console.log('Opening chat with ID:', chatId);
    // Mark as read when opening
    this.markConversationAsRead(chatId);
    // Navigate to chat detail
    // wx.navigateTo({ url: `/pages/chat-detail/chat-detail?id=${chatId}` });
  },
  
  // Notification filters
  changeNotificationCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      notificationCategory: category
    });
    this.filterNotifications();
  },
  
  filterNotifications: function() {
    const { notifications, notificationCategory } = this.data;
    let filtered = notifications;
    
    if (notificationCategory !== 'all') {
      filtered = notifications.filter(item => item.type === notificationCategory);
    }
    
    this.setData({
      filteredNotifications: filtered
    });
  },
  
  // Notification interaction
  openNotification: function(e) {
    const notificationId = e.currentTarget.dataset.id;
    const notification = this.data.notifications.find(n => n.id === notificationId);
    
    // Mark as read
    if (!notification.read) {
      this.markNotificationAsRead(notificationId);
    }
    
    // Handle different notification types
    switch(notification.type) {
      case 'transaction':
        // Navigate to order detail
        console.log('Opening transaction detail');
        break;
      case 'activity':
        // Navigate to activity page
        console.log('Opening activity detail');
        break;
      case 'interaction':
        // Navigate to interaction content
        console.log('Opening interaction detail');
        break;
      case 'system':
        // Just mark as read
        console.log('Opening system notification detail');
        break;
    }
  },
  
  // Context menu for conversations
  showConversationActions: function(e) {
    const conversationId = e.currentTarget.dataset.id;
    const conversation = [...this.data.pinnedConversations, ...this.data.conversations]
      .find(c => c.id === conversationId);
    
    // Get touch position for menu placement
    const touch = e.touches[0];
    
    this.setData({
      showConversationMenu: true,
      showNotificationMenu: false,
      menuPosition: { 
        x: touch.clientX - 70, // Offset to align menu
        y: touch.clientY + 10 
      },
      selectedConversation: conversation
    });
  },
  
  // Context menu for notifications
  showNotificationActions: function(e) {
    const notificationId = e.currentTarget.dataset.id;
    const notification = this.data.notifications.find(n => n.id === notificationId);
    
    // Get touch position for menu placement
    const touch = e.touches[0];
    
    this.setData({
      showNotificationMenu: true,
      showConversationMenu: false,
      menuPosition: { 
        x: touch.clientX - 70, // Offset to align menu
        y: touch.clientY + 10 
      },
      selectedNotification: notification
    });
  },
  
  // Close menus when tapping elsewhere
  onTap: function() {
    this.setData({
      showConversationMenu: false,
      showNotificationMenu: false
    });
  },
  
  // Conversation actions
  togglePinConversation: function() {
    const { selectedConversation } = this.data;
    
    if (selectedConversation.pinned) {
      // Unpin - move from pinnedConversations to conversations
      this.unpinConversation(selectedConversation.id);
    } else {
      // Pin - move from conversations to pinnedConversations
      this.pinConversation(selectedConversation.id);
    }
    
    this.setData({
      showConversationMenu: false
    });
  },
  
  pinConversation: function(id) {
    const { conversations, pinnedConversations } = this.data;
    const index = conversations.findIndex(c => c.id === id);
    
    if (index !== -1) {
      const conversation = { ...conversations[index], pinned: true };
      
      // Remove from regular conversations
      const updatedConversations = conversations.filter(c => c.id !== id);
      
      // Add to pinned conversations
      const updatedPinnedConversations = [...pinnedConversations, conversation];
      
      this.setData({
        conversations: updatedConversations,
        pinnedConversations: updatedPinnedConversations
      });
    }
  },
  
  unpinConversation: function(id) {
    const { conversations, pinnedConversations } = this.data;
    const index = pinnedConversations.findIndex(c => c.id === id);
    
    if (index !== -1) {
      const conversation = { ...pinnedConversations[index], pinned: false };
      
      // Remove from pinned conversations
      const updatedPinnedConversations = pinnedConversations.filter(c => c.id !== id);
      
      // Add to regular conversations
      const updatedConversations = [...conversations, conversation];
      
      this.setData({
        conversations: updatedConversations,
        pinnedConversations: updatedPinnedConversations
      });
    }
  },
  
  markConversationRead: function() {
    const { selectedConversation } = this.data;
    
    if (selectedConversation.unread) {
      this.markConversationAsRead(selectedConversation.id);
    } else {
      this.markConversationAsUnread(selectedConversation.id);
    }
    
    this.setData({
      showConversationMenu: false
    });
  },
  
  markConversationAsRead: function(id) {
    this.updateConversationReadStatus(id, false, 0);
  },
  
  markConversationAsUnread: function(id) {
    this.updateConversationReadStatus(id, true, 1);
  },
  
  updateConversationReadStatus: function(id, unread, unreadCount) {
    const { conversations, pinnedConversations } = this.data;
    
    // Check in pinned conversations
    const pinnedIndex = pinnedConversations.findIndex(c => c.id === id);
    if (pinnedIndex !== -1) {
      const updatedPinnedConversations = [...pinnedConversations];
      updatedPinnedConversations[pinnedIndex] = {
        ...updatedPinnedConversations[pinnedIndex],
        unread: unread,
        unreadCount: unreadCount
      };
      
      this.setData({
        pinnedConversations: updatedPinnedConversations
      });
      return;
    }
    
    // Check in regular conversations
    const conversationIndex = conversations.findIndex(c => c.id === id);
    if (conversationIndex !== -1) {
      const updatedConversations = [...conversations];
      updatedConversations[conversationIndex] = {
        ...updatedConversations[conversationIndex],
        unread: unread,
        unreadCount: unreadCount
      };
      
      this.setData({
        conversations: updatedConversations
      });
    }
  },
  
  archiveConversation: function() {
    const { selectedConversation } = this.data;
    console.log('Archiving conversation:', selectedConversation.id);
    // In a real app, this would move the conversation to an archived list
    // and update the UI accordingly
    
    this.setData({
      showConversationMenu: false
    });
    
    // For demo, we'll just remove it from the current list
    this.removeConversationFromLists(selectedConversation.id);
  },
  
  confirmDeleteConversation: function() {
    const { selectedConversation } = this.data;
    
    this.setData({
      showDeleteDialog: true,
      deleteType: 'conversation',
      deleteId: selectedConversation.id,
      showConversationMenu: false
    });
  },
  
  // Notification actions
  toggleNotificationRead: function() {
    const { selectedNotification } = this.data;
    
    if (selectedNotification.read) {
      this.markNotificationAsUnread(selectedNotification.id);
    } else {
      this.markNotificationAsRead(selectedNotification.id);
    }
    
    this.setData({
      showNotificationMenu: false
    });
  },
  
  markNotificationAsRead: function(id) {
    this.updateNotificationReadStatus(id, true);
  },
  
  markNotificationAsUnread: function(id) {
    this.updateNotificationReadStatus(id, false);
  },
  
  updateNotificationReadStatus: function(id, read) {
    const { notifications } = this.data;
    const index = notifications.findIndex(n => n.id === id);
    
    if (index !== -1) {
      const updatedNotifications = [...notifications];
      updatedNotifications[index] = {
        ...updatedNotifications[index],
        read: read
      };
      
      this.setData({
        notifications: updatedNotifications
      }, () => {
        this.filterNotifications();
      });
    }
  },
  
  deleteNotification: function() {
    const { selectedNotification } = this.data;
    
    this.setData({
      showDeleteDialog: true,
      deleteType: 'notification',
      deleteId: selectedNotification.id,
      showNotificationMenu: false
    });
  },
  
  markAllNotificationsRead: function() {
    const { notifications } = this.data;
    
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    this.setData({
      notifications: updatedNotifications
    }, () => {
      this.filterNotifications();
    });
  },
  
  // Delete dialog
  confirmDelete: function() {
    const { deleteType, deleteId } = this.data;
    
    if (deleteType === 'conversation') {
      this.removeConversationFromLists(deleteId);
    } else if (deleteType === 'notification') {
      this.removeNotification(deleteId);
    }
    
    this.setData({
      showDeleteDialog: false,
      deleteType: '',
      deleteId: null
    });
  },
  
  cancelDelete: function() {
    this.setData({
      showDeleteDialog: false,
      deleteType: '',
      deleteId: null
    });
  },
  
  preventBubble: function(e) {
    // Prevent event bubbling for dialog content
  },
  
  removeConversationFromLists: function(id) {
    const { conversations, pinnedConversations } = this.data;
    
    this.setData({
      conversations: conversations.filter(c => c.id !== id),
      pinnedConversations: pinnedConversations.filter(c => c.id !== id)
    });
  },
  
  removeNotification: function(id) {
    const { notifications } = this.data;
    
    this.setData({
      notifications: notifications.filter(n => n.id !== id)
    }, () => {
      this.filterNotifications();
    });
  }
});
