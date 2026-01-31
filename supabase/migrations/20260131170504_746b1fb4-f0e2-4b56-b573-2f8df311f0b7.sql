-- =============================================
-- 问答社区核心数据库架构
-- =============================================

-- 1. 用户资料表 (profiles)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  points_balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. 问题表 (questions)
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  bounty_points INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending_payment', 'paid', 'closed', 'solved')),
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. 回答表 (answers)
CREATE TABLE public.answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_accepted BOOLEAN NOT NULL DEFAULT false,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. 用户关注表 (user_followers)
CREATE TABLE public.user_followers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 5. 积分交易表 (points_transactions)
CREATE TABLE public.points_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('recharge', 'bounty_payment', 'reward', 'withdraw', 'bonus')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  related_id UUID,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. 订单表 (orders)
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_type TEXT NOT NULL CHECK (order_type IN ('question', 'recharge', 'withdraw')),
  related_id UUID,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- 7. 私信消息表 (messages)
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. 收藏表 (favorites)
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);

-- =============================================
-- 启用 RLS
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS 策略
-- =============================================

-- profiles 策略
CREATE POLICY "用户可以查看所有资料" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "用户可以插入自己的资料" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以更新自己的资料" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- questions 策略
CREATE POLICY "所有人可以查看问题" ON public.questions FOR SELECT USING (true);
CREATE POLICY "登录用户可以发布问题" ON public.questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以更新自己的问题" ON public.questions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "用户可以删除自己的问题" ON public.questions FOR DELETE USING (auth.uid() = user_id);

-- answers 策略
CREATE POLICY "所有人可以查看回答" ON public.answers FOR SELECT USING (true);
CREATE POLICY "登录用户可以发布回答" ON public.answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以更新自己的回答" ON public.answers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "用户可以删除自己的回答" ON public.answers FOR DELETE USING (auth.uid() = user_id);

-- user_followers 策略
CREATE POLICY "可以查看关注关系" ON public.user_followers FOR SELECT USING (true);
CREATE POLICY "用户可以关注他人" ON public.user_followers FOR INSERT WITH CHECK (auth.uid() = follower_id AND follower_id != following_id);
CREATE POLICY "用户可以取消关注" ON public.user_followers FOR DELETE USING (auth.uid() = follower_id);

-- points_transactions 策略
CREATE POLICY "用户可以查看自己的积分记录" ON public.points_transactions FOR SELECT USING (auth.uid() = user_id);

-- orders 策略
CREATE POLICY "用户可以查看自己的订单" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "用户可以创建订单" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以更新自己的订单" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- messages 策略
CREATE POLICY "用户可以查看自己的消息" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "用户可以发送消息" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- favorites 策略
CREATE POLICY "用户可以查看自己的收藏" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "用户可以添加收藏" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以删除收藏" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 触发器：自动更新 updated_at
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON public.answers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 触发器：新用户自动创建资料
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nickname, points_balance)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nickname', '新用户'), 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 启用消息实时推送
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- =============================================
-- 创建头像存储桶
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- 头像存储策略
CREATE POLICY "头像公开访问" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "用户可以上传头像" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "用户可以更新头像" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "用户可以删除头像" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);