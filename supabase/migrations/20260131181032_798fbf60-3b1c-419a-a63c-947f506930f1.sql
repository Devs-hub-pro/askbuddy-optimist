-- 创建用户角色枚举
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 创建用户角色表
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 启用 RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 创建安全函数检查用户角色
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 用户角色 RLS 策略
CREATE POLICY "所有人可以查看角色"
ON public.user_roles FOR SELECT
USING (true);

CREATE POLICY "仅管理员可以管理角色"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- ============ 热门话题表 ============
CREATE TABLE public.hot_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  category TEXT,
  created_by UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  participants_count INTEGER NOT NULL DEFAULT 0,
  discussions_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hot_topics ENABLE ROW LEVEL SECURITY;

-- 话题 RLS：所有人可查看，仅管理员可管理
CREATE POLICY "所有人可以查看活跃话题"
ON public.hot_topics FOR SELECT
USING (is_active = true);

CREATE POLICY "管理员可以管理话题"
ON public.hot_topics FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- ============ 话题讨论表 ============
CREATE TABLE public.topic_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES public.hot_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.topic_discussions ENABLE ROW LEVEL SECURITY;

-- 讨论 RLS
CREATE POLICY "所有人可以查看讨论"
ON public.topic_discussions FOR SELECT
USING (true);

CREATE POLICY "登录用户可以发布讨论"
ON public.topic_discussions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以编辑自己的讨论"
ON public.topic_discussions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的讨论"
ON public.topic_discussions FOR DELETE
USING (auth.uid() = user_id);

-- ============ 讨论点赞表 ============
CREATE TABLE public.discussion_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.topic_discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(discussion_id, user_id)
);

ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "所有人可以查看点赞"
ON public.discussion_likes FOR SELECT
USING (true);

CREATE POLICY "登录用户可以点赞"
ON public.discussion_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以取消点赞"
ON public.discussion_likes FOR DELETE
USING (auth.uid() = user_id);

-- ============ 触发器：自动更新计数 ============

-- 讨论点赞计数触发器
CREATE OR REPLACE FUNCTION public.update_discussion_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE topic_discussions SET likes_count = likes_count + 1 WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE topic_discussions SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_discussion_like_change
AFTER INSERT OR DELETE ON public.discussion_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_discussion_likes_count();

-- 话题讨论数计数触发器
CREATE OR REPLACE FUNCTION public.update_topic_discussions_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE hot_topics SET discussions_count = discussions_count + 1 WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE hot_topics SET discussions_count = GREATEST(discussions_count - 1, 0) WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_topic_discussion_change
AFTER INSERT OR DELETE ON public.topic_discussions
FOR EACH ROW
EXECUTE FUNCTION public.update_topic_discussions_count();

-- 创建索引
CREATE INDEX idx_hot_topics_active ON public.hot_topics(is_active, created_at DESC);
CREATE INDEX idx_topic_discussions_topic_id ON public.topic_discussions(topic_id, created_at DESC);
CREATE INDEX idx_discussion_likes_discussion_id ON public.discussion_likes(discussion_id);
CREATE INDEX idx_discussion_likes_user_id ON public.discussion_likes(user_id);