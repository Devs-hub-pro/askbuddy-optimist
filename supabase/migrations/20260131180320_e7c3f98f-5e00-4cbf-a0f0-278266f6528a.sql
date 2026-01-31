-- 创建回答点赞表
CREATE TABLE public.answer_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  answer_id UUID NOT NULL REFERENCES public.answers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(answer_id, user_id)
);

-- 启用 RLS
ALTER TABLE public.answer_likes ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "所有人可以查看点赞"
ON public.answer_likes FOR SELECT
USING (true);

CREATE POLICY "登录用户可以点赞"
ON public.answer_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以取消自己的点赞"
ON public.answer_likes FOR DELETE
USING (auth.uid() = user_id);

-- 创建索引
CREATE INDEX idx_answer_likes_answer_id ON public.answer_likes(answer_id);
CREATE INDEX idx_answer_likes_user_id ON public.answer_likes(user_id);

-- 创建触发器函数：点赞时增加 likes_count
CREATE OR REPLACE FUNCTION public.increment_answer_likes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE answers SET likes_count = likes_count + 1 WHERE id = NEW.answer_id;
  RETURN NEW;
END;
$$;

-- 创建触发器函数：取消点赞时减少 likes_count
CREATE OR REPLACE FUNCTION public.decrement_answer_likes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE answers SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.answer_id;
  RETURN OLD;
END;
$$;

-- 绑定触发器
CREATE TRIGGER on_answer_like_insert
AFTER INSERT ON public.answer_likes
FOR EACH ROW
EXECUTE FUNCTION public.increment_answer_likes();

CREATE TRIGGER on_answer_like_delete
AFTER DELETE ON public.answer_likes
FOR EACH ROW
EXECUTE FUNCTION public.decrement_answer_likes();