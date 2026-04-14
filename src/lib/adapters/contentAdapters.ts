import type { Expert } from '@/hooks/useExperts';
import type { Question } from '@/hooks/useQuestions';

type AnyRecord = Record<string, any>;

export interface UIExpertCardModel {
  id: string;
  name: string;
  avatar: string;
  title: string;
  description: string;
  tags: string[];
  keywords: string[];
  category: string;
  rating: number;
  responseRate: string;
  orderCount: string;
  consultationPrice: number;
  location: string;
  education: string[];
  experience: string[];
  verified: boolean;
}

export interface UIQuestionModel {
  id: string;
  title: string;
  content: string | null;
  tags: string[];
  bountyPoints: number;
  viewCount: number;
  createdAt: string;
  askerName: string;
  askerAvatar: string;
  answersCount: number;
}

export interface UIConversationModel {
  id: string;
  partnerId: string;
  partnerNickname: string;
  partnerAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        const obj = item as AnyRecord;
        return `${obj.school || obj.company || ''} ${obj.degree || obj.position || obj.title || ''}`.trim();
      }
      return '';
    })
    .filter((item) => item.length > 0);
};

export const mapExpertToUIModel = (expert: Expert | AnyRecord, options?: { categoryFallback?: string }): UIExpertCardModel => ({
  id: expert.id,
  name: expert.nickname || expert.name || '专家',
  avatar: expert.avatar_url || expert.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
  title: expert.title || '',
  description: expert.bio || expert.description || '',
  tags: Array.isArray(expert.tags) ? expert.tags : [],
  keywords: Array.isArray(expert.keywords) ? expert.keywords : [],
  category: expert.category || options?.categoryFallback || 'all',
  rating: Number(expert.rating || 0),
  responseRate: typeof expert.response_rate === 'number'
    ? `${expert.response_rate}%`
    : (expert.responseRate || `${Number(expert.response_rate || 0)}%`),
  orderCount: typeof expert.order_count === 'number'
    ? `${expert.order_count}单`
    : (expert.orderCount || `${Number(expert.order_count || 0)}单`),
  consultationPrice: Number(expert.consultation_price || expert.consultationPrice || 50),
  location: expert.location || '未设置地区',
  education: toStringArray(expert.education),
  experience: toStringArray(expert.experience),
  verified: Boolean(expert.is_verified || expert.verified),
});

export const mapQuestionToUIModel = (question: Question | AnyRecord): UIQuestionModel => ({
  id: question.id,
  title: question.title || '',
  content: question.content || null,
  tags: Array.isArray(question.tags) ? question.tags : [],
  bountyPoints: Number(question.bounty_points || question.bountyPoints || 0),
  viewCount: Number(question.view_count || question.viewCount || 0),
  createdAt: question.created_at || question.createdAt || new Date().toISOString(),
  askerName: question.profile_nickname || question.askerName || '匿名用户',
  askerAvatar: question.profile_avatar || question.askerAvatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
  answersCount: Number(question.answers_count || question.answersCount || 0),
});

export const mergeUniqueById = <T extends { id: string }>(primary: T[], fallback: T[]) => {
  const merged = [...primary, ...fallback];
  return merged.filter((item, index) => merged.findIndex((target) => target.id === item.id) === index);
};

export const mapConversationToUIModel = (conversation: AnyRecord): UIConversationModel => ({
  id: String(conversation.partner_id || conversation.partnerId || conversation.id || ''),
  partnerId: String(conversation.partner_id || conversation.partnerId || conversation.id || ''),
  partnerNickname: String(conversation.partner_nickname || conversation.partnerNickname || '用户'),
  partnerAvatar: (conversation.partner_avatar || conversation.partnerAvatar || null) as string | null,
  lastMessage: String(conversation.last_message || conversation.lastMessage || '暂无消息内容'),
  lastMessageTime: String(conversation.last_message_time || conversation.lastMessageTime || new Date().toISOString()),
  unreadCount: Number(conversation.unread_count || conversation.unreadCount || 0),
});

export const filterExpertsByCategory = (experts: UIExpertCardModel[], activeCategory: string) => {
  if (activeCategory === 'all') return experts;
  return experts.filter((item) => item.category === activeCategory || item.category === 'all');
};

export const mapDemoExpertsByChannel = (
  experts: AnyRecord[],
  channelCategory: string,
  options?: { categoryFallback?: string }
) => {
  return experts
    .filter((item) => item.category === channelCategory)
    .map((item) => mapExpertToUIModel(item, { categoryFallback: options?.categoryFallback }));
};

export const mapDemoQuestionsForSearch = (demoQuestions: AnyRecord[], normalizedQuery: string) => {
  return demoQuestions
    .filter((item) => {
      const bag = [item.title, item.content || '', ...(item.tags || [])].join(' ').toLowerCase();
      return bag.includes(normalizedQuery);
    })
    .map((item) => ({
      ...item,
      category: item.tags?.[0] || null,
    }));
};

export const mapDemoUsersForSearch = (demoExperts: AnyRecord[], normalizedQuery: string) => {
  return demoExperts
    .filter((item) => {
      const bag = [item.nickname || '', item.title || '', item.bio || '', ...(item.tags || [])].join(' ').toLowerCase();
      return bag.includes(normalizedQuery);
    })
    .slice(0, 10)
    .map((item) => ({
      id: item.id,
      user_id: item.user_id,
      nickname: item.nickname,
      avatar_url: item.avatar_url,
      bio: item.bio,
    }));
};
