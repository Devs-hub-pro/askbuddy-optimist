
// profile.js
Page({
  data: {
    userInfo: {
      avatar: '/assets/images/avatar5.png',
      nickname: '张先生',
      verified: true,
      tags: ['产品经理', '5年经验'],
      bio: '腾讯产品经理，负责用户增长和产品运营，擅长用户研究和数据分析。',
      followingCount: 128,
      followerCount: 56,
      experience: 320, // Level 3 with 20% progress to Level 4
      balance: 1299.50,
      showBalance: false,
      expertStatus: 'approved' // 'none', 'pending', 'approved'
    },
    draftCount: 3,
    pendingOrderCount: 1,
    activeOrderCount: 2
  },
  
  onLoad: function() {
    // Initialize data when the page loads
  },
  
  // Toggle balance visibility
  toggleBalanceVisibility: function() {
    this.setData({
      'userInfo.showBalance': !this.data.userInfo.showBalance
    });
  },
  
  // Go to edit profile page
  goToEditProfile: function() {
    wx.navigateTo({
      url: '/pages/edit-profile/edit-profile'
    });
  },
  
  // Go to following list
  goToFollowing: function() {
    wx.navigateTo({
      url: '/pages/following/following'
    });
  },
  
  // Go to followers list
  goToFollowers: function() {
    wx.navigateTo({
      url: '/pages/followers/followers'
    });
  },
  
  // Go to experience details
  goToExperienceDetails: function() {
    wx.navigateTo({
      url: '/pages/experience/experience'
    });
  },
  
  // Go to wallet page
  goToWallet: function() {
    if (this.tapWalletBalance) {
      this.toggleBalanceVisibility();
      this.tapWalletBalance = false;
      return;
    }
    
    this.tapWalletBalance = true;
    setTimeout(() => {
      if (this.tapWalletBalance) {
        wx.navigateTo({
          url: '/pages/wallet/wallet'
        });
        this.tapWalletBalance = false;
      }
    }, 300);
  },
  
  // Go to my questions
  goToMyQuestions: function() {
    wx.navigateTo({
      url: '/pages/my-questions/my-questions'
    });
  },
  
  // Go to my answers
  goToMyAnswers: function() {
    wx.navigateTo({
      url: '/pages/my-answers/my-answers'
    });
  },
  
  // Go to my drafts
  goToMyDrafts: function() {
    wx.navigateTo({
      url: '/pages/drafts/drafts'
    });
  },
  
  // Go to favorites
  goToFavorites: function() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    });
  },
  
  // Go to all orders
  goToAllOrders: function() {
    wx.navigateTo({
      url: '/pages/orders/orders?tab=all'
    });
  },
  
  // Go to pending orders
  goToPendingOrders: function() {
    wx.navigateTo({
      url: '/pages/orders/orders?tab=pending'
    });
  },
  
  // Go to active orders
  goToActiveOrders: function() {
    wx.navigateTo({
      url: '/pages/orders/orders?tab=active'
    });
  },
  
  // Go to completed orders
  goToCompletedOrders: function() {
    wx.navigateTo({
      url: '/pages/orders/orders?tab=completed'
    });
  },
  
  // Go to expert application
  goToExpertApplication: function() {
    const status = this.data.userInfo.expertStatus;
    
    if (status === 'approved') {
      wx.navigateTo({
        url: '/pages/expert-dashboard/expert-dashboard'
      });
    } else if (status === 'pending') {
      wx.showModal({
        title: '申请审核中',
        content: '您的达人申请正在审核中，请耐心等待。',
        showCancel: false
      });
    } else {
      wx.navigateTo({
        url: '/pages/become-expert/become-expert'
      });
    }
  },
  
  // Go to settings
  goToSettings: function() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },
  
  // Go to help and feedback
  goToHelp: function() {
    wx.navigateTo({
      url: '/pages/help/help'
    });
  }
});

