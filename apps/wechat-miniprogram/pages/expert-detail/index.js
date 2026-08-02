const { EXPERTS, getExpert } = require('../../utils/ui-catalog');
const { getNavigationLayout } = require('../../utils/navigation');

function mapSearchProfile(payload = {}) {
  const source = payload.data || {};
  const type = payload.type || 'expert';
  const name = type === 'skill'
    ? (source.expert_name || source.nickname || source.title || '技能提供者')
    : (source.nickname || source.title || '问问达人');
  const rawTags = Array.isArray(source.tags) ? source.tags : [];
  const tags = rawTags.length ? rawTags : [source.category_name || source.category].filter(Boolean);
  const responseRate = source.response_rate === undefined || source.response_rate === null
    ? '—'
    : `${source.response_rate}%`;

  return {
    id: String(source.id || source.user_id || ''),
    userId: String(source.user_id || source.expert_id || ''),
    name,
    initial: name.slice(0, 1),
    verified: source.verified === true || source.is_verified === true
      || ['verified', 'approved'].includes(source.verification_status),
    title: source.headline || (type === 'skill' ? source.title : '') || '经验分享者',
    bio: source.intro || source.bio || source.description || source.expertise_summary || '这位达人还没有填写详细介绍。',
    tags,
    category: source.category || source.category_name || '',
    rating: source.rating || '—',
    responseRate,
    orderCount: source.order_count || 0,
    consultationCount: source.service_count || source.consultation_count || 0,
    followersCount: source.follower_count || 0,
    price: source.price_amount || '',
    experience: source.experience || source.response_time_label || '经验资料待完善',
    location: source.location || source.city || '所在地未填写',
    fromSearch: true,
    sourceType: type
  };
}

Page({
  data: {
    navLayout: getNavigationLayout(),
    expert: { ...getExpert('demo-expert-1'), verified: true, fromSearch: false },
    followed: false
  },

  onLoad(options = {}) {
    let expert;
    if (options.source === 'search') {
      expert = mapSearchProfile(wx.getStorageSync('searchSelectedProfile') || {});
    } else {
      const requestedId = options.id || 'demo-expert-1';
      const exists = EXPERTS.some((item) => item.id === requestedId);
      expert = exists
        ? { ...getExpert(requestedId), verified: true, fromSearch: false }
        : { ...getExpert('demo-expert-1'), id: requestedId, verified: true, fromSearch: false };
    }
    this.setData({ expert });
    wx.setNavigationBarTitle({ title: expert.name });
  },

  onShareAppMessage() {
    return {
      title: `${this.data.expert.name}的问问主页`,
      path: `/pages/expert-detail/index?id=${this.data.expert.id}`
    };
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) return wx.navigateBack();
    wx.switchTab({ url: '/pages/home/index' });
  },

  toggleFollow() {
    wx.showModal({
      title: '关注暂不可用',
      content: '关注服务正在接入，本次不会改变关注状态。',
      showCancel: false
    });
  },

  goMessages() {
    if (this.data.expert.fromSearch) {
      wx.showToast({ title: '暂时无法发起私信', icon: 'none' });
      return;
    }
    wx.setStorageSync('messagesPreferredSegment', 'private');
    wx.switchTab({ url: '/pages/messages/index' });
  },

  goAsk() {
    const category = encodeURIComponent(this.data.expert.category || '');
    wx.navigateTo({
      url: `/pages/ask/index?expertId=${encodeURIComponent(this.data.expert.id)}&expertName=${encodeURIComponent(this.data.expert.name)}&category=${category}`
    });
  }
});
