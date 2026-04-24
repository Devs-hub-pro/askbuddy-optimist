export type SearchObjectType = 'question' | 'expert' | 'skill' | 'post';

export type CursorPage<T> = {
  items: T[];
  next_cursor: string | null;
};

export type QuestionStatus = 'open' | 'matched' | 'solved' | 'hidden' | 'deleted';
export type AnswerStatus = 'active' | 'accepted' | 'hidden' | 'deleted';
export type SkillOfferStatus = 'draft' | 'pending_review' | 'published' | 'offline';
export type PostVisibility = 'public' | 'followers' | 'private';
export type PostStatus = 'active' | 'hidden' | 'deleted';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type NotificationReadState = boolean;
export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'in_service'
  | 'completed'
  | 'refunded'
  | 'closed';
