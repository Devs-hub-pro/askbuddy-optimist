const { getNavigationLayout } = require('../../utils/navigation');

const SECTIONS = {
  orders: { title: '我的订单', subtitle: '查看进行中与已完成的咨询', icon: '单', emptyTitle: '还没有订单', emptyDesc: '完成咨询预约后，订单会展示在这里。' },
  answers: { title: '我的回答', subtitle: '整理你分享过的经验', icon: '答', emptyTitle: '还没有回答', emptyDesc: '在问题详情中参与回答后，可在这里统一管理。' },
  favorites: { title: '我的收藏', subtitle: '稍后继续阅读的问题与专题', icon: '藏', emptyTitle: '还没有收藏', emptyDesc: '收藏的问题和专题会出现在这里。' },
  following: { title: '我的关注', subtitle: '持续关注达人和专题更新', icon: '关', emptyTitle: '还没有关注', emptyDesc: '关注感兴趣的达人后，可更快找到他们。' },
  earnings: { title: '我的收益', subtitle: '查看经验服务收入和结算状态', icon: '益', emptyTitle: '暂无收益记录', emptyDesc: '技能服务产生收益后会在这里展示。' },
  community: { title: '我的社群', subtitle: '和相似目标的人持续交流', icon: '群', emptyTitle: '还没有加入社群', emptyDesc: '后续可从发现页加入感兴趣的交流空间。' },
  drafts: { title: '草稿箱', subtitle: '继续编辑尚未发布的内容', icon: '稿', emptyTitle: '草稿箱为空', emptyDesc: '本机保存的问题或技能草稿会显示在这里。' },
  verify: { title: '达人认证', subtitle: '完善经验资料并申请成为达人', icon: '认', emptyTitle: '认证暂未开放', emptyDesc: '认证服务准备完成后，可在这里提交经验资料。' },
  help: { title: '帮助中心', subtitle: '常见问题和使用说明', icon: '?', items: ['如何发布一个高质量问题？', '如何联系达人？', '如何查看通知与未读数？', '隐私和账号安全'] },
  rules: { title: '问问规范', subtitle: '共同维护真实、友善的经验社区', icon: '规', items: ['尊重事实与个人经验边界', '不发布隐私和敏感联系方式', '不冒充专业资质或承诺结果', '发现不当内容及时举报'] },
  feedback: { title: '产品反馈', subtitle: '告诉我们哪里还可以做得更好', icon: '信', items: ['界面与交互建议', '功能问题反馈', '内容与社区建议'] },
  about: { title: '关于问问', subtitle: '连接真实经验，让每个问题更快得到回应', icon: '问', items: ['产品介绍', '服务协议', '隐私政策', '当前版本 1.0.0'] },
  settings: { title: '设置', subtitle: '管理账号、通知、隐私和偏好', icon: '设', items: ['账号与安全', '通知设置', '隐私设置', '内容偏好', '存储空间', '关于问问'] },
  edit: { title: '编辑资料', subtitle: '维护头像、昵称和个人介绍', icon: '编', items: ['头像与昵称', '个人简介', '所在城市', '兴趣与擅长领域'] }
};

const ITEM_DETAILS = {
  '如何发布一个高质量问题？': '先用一句话说明目标，再补充背景、限制条件和已经尝试过的方法。避免在正文中填写手机号等隐私信息。',
  '如何联系达人？': '可从频道或搜索结果进入达人主页，再选择提问。私信和通话入口会根据账号与服务开放状态显示。',
  '如何查看通知与未读数？': '进入底部“消息”，切换到“通知”即可查看；下拉页面可以刷新未读数。',
  '隐私和账号安全': '不要公开身份证、住址、手机号或支付凭证。遇到异常内容时请停止互动并保留相关信息。',
  '尊重事实与个人经验边界': '请区分亲身经历、个人判断和专业建议，不夸大效果，也不承诺无法保证的结果。',
  '不发布隐私和敏感联系方式': '请勿在公开内容中填写手机号、住址、证件号码或其他可识别个人的信息。',
  '不冒充专业资质或承诺结果': '涉及法律、医疗、财务等专业领域时，应清楚说明经验边界与资质情况。',
  '发现不当内容及时举报': '举报服务开放前，如遇紧急风险内容，请先停止互动并保留截图等必要信息。',
  '产品介绍': '问问希望连接真实经验，让用户更快理解问题、找到合适的人，并形成可执行的下一步。',
  '服务协议': '正式服务协议将在账号与发布能力开放前提供完整版本。',
  '隐私政策': '小程序会遵循最小必要原则申请权限；麦克风和摄像头仅在用户主动使用通话功能时申请。',
  '当前版本 1.0.0': '当前版本聚焦页面、只读内容与 Call 会话状态体验，实时音视频等能力尚未开放。'
};

const ACCOUNT_SECTION_KEYS = new Set([
  'orders', 'answers', 'favorites', 'following', 'earnings', 'community', 'verify', 'edit', 'settings'
]);

Page({
  data: {
    navLayout: getNavigationLayout(),
    section: SECTIONS.settings,
    sectionKey: 'settings',
    drafts: [],
    showAccountTip: true,
    feedbackCategory: '界面与交互建议',
    feedbackContent: ''
  },

  onLoad(options) {
    const section = SECTIONS[options.key] || {
      title: options.title ? decodeURIComponent(options.title) : '个人中心',
      subtitle: '相关能力正在逐步接入',
      icon: '问',
      emptyTitle: '暂无内容',
      emptyDesc: '当前没有可展示的数据。'
    };
    const drafts = options.key === 'drafts' ? this.collectDrafts() : [];
    const feedbackDraft = options.key === 'feedback' ? wx.getStorageSync('productFeedbackDraft') || {} : {};
    this.setData({
      section,
      sectionKey: options.key || 'settings',
      drafts,
      showAccountTip: ACCOUNT_SECTION_KEYS.has(options.key || 'settings'),
      feedbackCategory: feedbackDraft.category || '界面与交互建议',
      feedbackContent: feedbackDraft.content || ''
    });
    wx.setNavigationBarTitle({ title: section.title });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) return wx.navigateBack();
    wx.switchTab({ url: '/pages/profile/index' });
  },

  collectDrafts() {
    const drafts = [];
    const question = wx.getStorageSync('questionDraft');
    if (question) drafts.push({
      key: 'questionDraft',
      type: '问题草稿',
      title: question.title || '未命名问题',
      desc: question.content || '暂无详细描述',
      route: '/pages/ask/index'
    });

    const skill = wx.getStorageSync('skillPublishDraft');
    if (skill) drafts.push({
      key: 'skillPublishDraft',
      type: '技能草稿',
      title: skill.title || '未命名技能',
      desc: skill.description || '暂无介绍',
      route: '/pages/skill-publish/index'
    });

    const post = wx.getStorageSync('postDraft');
    if (post) drafts.push({
      key: 'postDraft',
      type: '动态草稿',
      title: '未发布的经验动态',
      desc: post.content || '暂无内容',
      route: '/pages/post-editor/index'
    });

    const storageInfo = wx.getStorageInfoSync();
    (storageInfo.keys || []).filter((key) => key.startsWith('answerDraft:')).forEach((key) => {
      const questionId = key.replace('answerDraft:', '');
      const content = wx.getStorageSync(key);
      if (content) drafts.push({
        key,
        type: '回答草稿',
        title: '未提交的回答',
        desc: content,
        route: `/pages/question-detail/index?id=${encodeURIComponent(questionId)}&compose=1`
      });
    });
    return drafts;
  },

  openItem(event) {
    const label = event.currentTarget.dataset.label;
    if (this.data.sectionKey === 'feedback') {
      this.setData({ feedbackCategory: label });
      return;
    }
    if (this.data.sectionKey === 'settings' && label === '通知设置') {
      wx.openSetting({
        fail: () => wx.showToast({ title: '暂时无法打开小程序设置', icon: 'none' })
      });
      return;
    }
    if (this.data.sectionKey === 'settings' && label === '存储空间') {
      const storage = wx.getStorageInfoSync();
      wx.showModal({
        title: '本机存储空间',
        content: `当前小程序数据约 ${storage.currentSize || 0} KB，最多可使用 ${storage.limitSize || 0} KB。`,
        showCancel: false
      });
      return;
    }
    if (this.data.sectionKey === 'settings' && label === '关于问问') {
      this.setData({ section: SECTIONS.about, sectionKey: 'about', showAccountTip: false });
      wx.setNavigationBarTitle({ title: SECTIONS.about.title });
      return;
    }
    const detail = ITEM_DETAILS[label];
    if (detail) {
      wx.showModal({ title: label, content: detail, showCancel: false });
      return;
    }
    wx.showToast({ title: `${label}正在逐步开放`, icon: 'none' });
  },

  onFeedbackInput(event) {
    this.setData({ feedbackContent: event.detail.value });
  },

  saveFeedbackDraft() {
    const content = this.data.feedbackContent.trim();
    if (!content) {
      wx.showToast({ title: '请先填写反馈内容', icon: 'none' });
      return;
    }
    wx.setStorageSync('productFeedbackDraft', {
      category: this.data.feedbackCategory,
      content,
      updatedAt: Date.now()
    });
    wx.showModal({
      title: '反馈已保存',
      content: '内容已保存在当前设备。在线反馈服务开放后可继续提交。',
      showCancel: false
    });
  },

  openDraft(event) {
    const draft = this.data.drafts.find((item) => item.key === event.currentTarget.dataset.key);
    if (draft) wx.navigateTo({ url: draft.route });
  },

  clearDraft(event) {
    const key = event.currentTarget.dataset.key;
    if (!key) return;
    wx.removeStorageSync(key);
    this.setData({ drafts: this.data.drafts.filter((item) => item.key !== key) });
    wx.showToast({ title: '本地草稿已删除', icon: 'none' });
  }
});
