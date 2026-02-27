
-- =============================================
-- 1. 专家系统表
-- =============================================
CREATE TABLE public.experts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  bio text,
  category text,
  tags text[] DEFAULT '{}',
  keywords text[] DEFAULT '{}',
  location text,
  rating numeric(3,2) DEFAULT 0,
  response_rate numeric(5,2) DEFAULT 0,
  order_count integer DEFAULT 0,
  consultation_count integer DEFAULT 0,
  followers_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  education jsonb DEFAULT '[]',
  experience jsonb DEFAULT '[]',
  available_time_slots jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "所有人可以查看活跃专家" ON public.experts FOR SELECT USING (is_active = true);
CREATE POLICY "用户可以管理自己的专家资料" ON public.experts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以更新自己的专家资料" ON public.experts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "用户可以删除自己的专家资料" ON public.experts FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_experts_category ON public.experts(category) WHERE is_active = true;
CREATE INDEX idx_experts_tags ON public.experts USING GIN(tags);
CREATE INDEX idx_experts_user_id ON public.experts(user_id);

CREATE TRIGGER update_experts_updated_at BEFORE UPDATE ON public.experts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 2. 话题关注表
-- =============================================
CREATE TABLE public.topic_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.hot_topics(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(topic_id, user_id)
);

ALTER TABLE public.topic_followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "所有人可以查看话题关注" ON public.topic_followers FOR SELECT USING (true);
CREATE POLICY "用户可以关注话题" ON public.topic_followers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以取消关注话题" ON public.topic_followers FOR DELETE USING (auth.uid() = user_id);

-- 话题关注数触发器
CREATE OR REPLACE FUNCTION public.update_topic_followers_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE hot_topics SET participants_count = participants_count + 1 WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE hot_topics SET participants_count = GREATEST(participants_count - 1, 0) WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER trigger_topic_followers_count
  AFTER INSERT OR DELETE ON public.topic_followers
  FOR EACH ROW EXECUTE FUNCTION public.update_topic_followers_count();

-- =============================================
-- 3. 通知系统表
-- =============================================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL, -- 'new_answer', 'answer_accepted', 'new_follower', 'new_like', 'system'
  title text NOT NULL,
  content text,
  related_id uuid,
  related_type text, -- 'question', 'answer', 'topic', 'user'
  sender_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可以查看自己的通知" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "用户可以更新自己的通知" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "系统可以创建通知" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "用户可以删除自己的通知" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

-- =============================================
-- 4. 积分系统：采纳回答积分转移函数
-- =============================================
CREATE OR REPLACE FUNCTION public.accept_answer_and_transfer_points(
  p_answer_id uuid,
  p_question_id uuid
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_question_user_id uuid;
  v_answer_user_id uuid;
  v_bounty integer;
  v_asker_balance integer;
  v_answerer_balance integer;
BEGIN
  -- Get question info
  SELECT user_id, bounty_points INTO v_question_user_id, v_bounty
  FROM questions WHERE id = p_question_id;
  
  -- Verify caller is question owner
  IF v_question_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Only question owner can accept answers';
  END IF;
  
  -- Get answer user
  SELECT user_id INTO v_answer_user_id FROM answers WHERE id = p_answer_id AND question_id = p_question_id;
  IF v_answer_user_id IS NULL THEN
    RAISE EXCEPTION 'Answer not found';
  END IF;
  
  -- Mark answer as accepted
  UPDATE answers SET is_accepted = true WHERE id = p_answer_id;
  UPDATE questions SET status = 'resolved' WHERE id = p_question_id;
  
  -- Transfer bounty points if any
  IF v_bounty > 0 THEN
    -- Deduct from asker
    UPDATE profiles SET points_balance = points_balance - v_bounty WHERE user_id = v_question_user_id
    RETURNING points_balance INTO v_asker_balance;
    
    -- Add to answerer
    UPDATE profiles SET points_balance = points_balance + v_bounty WHERE user_id = v_answer_user_id
    RETURNING points_balance INTO v_answerer_balance;
    
    -- Record transactions
    INSERT INTO points_transactions (user_id, type, amount, balance_after, description, related_id, status)
    VALUES 
      (v_question_user_id, 'bounty_paid', -v_bounty, v_asker_balance, '悬赏支付', p_question_id, 'completed'),
      (v_answer_user_id, 'bounty_received', v_bounty, v_answerer_balance, '悬赏获得', p_question_id, 'completed');
  END IF;
  
  -- Create notification for answerer
  INSERT INTO notifications (user_id, type, title, content, related_id, related_type, sender_id)
  VALUES (v_answer_user_id, 'answer_accepted', '你的回答被采纳了', 
    CASE WHEN v_bounty > 0 THEN '恭喜！你获得了 ' || v_bounty || ' 积分奖励' ELSE '恭喜！你的回答被采纳了' END,
    p_question_id, 'question', v_question_user_id);
END;
$$;

-- =============================================
-- 5. 新回答自动通知触发器
-- =============================================
CREATE OR REPLACE FUNCTION public.notify_new_answer()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_question_user_id uuid;
  v_question_title text;
BEGIN
  SELECT user_id, title INTO v_question_user_id, v_question_title
  FROM questions WHERE id = NEW.question_id;
  
  -- Don't notify if answering own question
  IF v_question_user_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, type, title, content, related_id, related_type, sender_id)
    VALUES (v_question_user_id, 'new_answer', '收到新回答', 
      '你的问题「' || LEFT(v_question_title, 30) || '」收到了新回答',
      NEW.question_id, 'question', NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_new_answer
  AFTER INSERT ON public.answers
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_answer();

-- =============================================
-- 6. 新关注自动通知触发器
-- =============================================
CREATE OR REPLACE FUNCTION public.notify_new_follower()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_follower_name text;
BEGIN
  SELECT COALESCE(nickname, '新用户') INTO v_follower_name
  FROM profiles WHERE user_id = NEW.follower_id;
  
  INSERT INTO notifications (user_id, type, title, content, related_id, related_type, sender_id)
  VALUES (NEW.following_id, 'new_follower', '新粉丝', 
    v_follower_name || ' 关注了你',
    NEW.follower_id, 'user', NEW.follower_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_new_follower
  AFTER INSERT ON public.user_followers
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_follower();
