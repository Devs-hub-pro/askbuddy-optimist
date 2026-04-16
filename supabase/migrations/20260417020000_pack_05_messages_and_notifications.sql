-- Migration Pack 05: 消息与通知域（最小可用）
-- 目标：
-- - 支撑 Messages / ChatDetail / Notifications / 未读数入口
-- - 在已有旧 messages / notifications 基础上做兼容升级
-- - 不引入复杂群聊、推送编排、音视频消息体系

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 复用 Pack01 通用 updated_at 函数；不存在则兜底创建
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'update_updated_at_column'
      AND n.nspname = 'public'
  ) THEN
    EXECUTE $fn$
      CREATE FUNCTION public.update_updated_at_column()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $inner$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $inner$;
    $fn$;
  END IF;
END $$;

-- -------------------------------------------------------------------
-- 1) conversations：会话主表（direct/system/service）
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'direct',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  -- direct 会话使用 participant_a + participant_b 作为稳定唯一键
  participant_a uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  participant_b uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT conversations_type_check CHECK (type IN ('direct', 'system', 'service')),
  CONSTRAINT conversations_direct_participants_check CHECK (
    (type = 'direct' AND participant_a IS NOT NULL AND participant_b IS NOT NULL)
    OR (type <> 'direct')
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_direct_pair_unique
  ON public.conversations(type, participant_a, participant_b)
  WHERE type = 'direct';

CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at
  ON public.conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_created_by
  ON public.conversations(created_by, created_at DESC);

-- -------------------------------------------------------------------
-- 2) conversation_members：会话成员表（最小字段）
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversation_members (
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  last_read_message_id uuid,
  last_read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

-- last_read_message_id 外键（延迟校验，兼容历史）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'conversation_members_last_read_message_id_fkey'
      AND conrelid = 'public.conversation_members'::regclass
  ) THEN
    ALTER TABLE public.conversation_members
      ADD CONSTRAINT conversation_members_last_read_message_id_fkey
      FOREIGN KEY (last_read_message_id) REFERENCES public.messages(id)
      ON DELETE SET NULL NOT VALID;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_conversation_members_user
  ON public.conversation_members(user_id, conversation_id);

CREATE INDEX IF NOT EXISTS idx_conversation_members_last_read_at
  ON public.conversation_members(user_id, last_read_at DESC);

-- -------------------------------------------------------------------
-- 3) messages：兼容升级为“会话消息模型”
-- -------------------------------------------------------------------
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS target_type text,
  ADD COLUMN IF NOT EXISTS target_id uuid,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'messages_status_check'
      AND conrelid = 'public.messages'::regclass
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_status_check CHECK (status IN ('active', 'deleted'));
  END IF;
END $$;

-- 历史兼容：is_hidden=true => status=deleted
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'is_hidden'
  ) THEN
    EXECUTE '
      UPDATE public.messages
      SET status = CASE WHEN is_hidden = true THEN ''deleted'' ELSE COALESCE(status, ''active'') END
      WHERE status IS NULL OR status = ''active'' OR status = ''deleted''
    ';
  END IF;
END $$;

-- 为历史私信按 sender/receiver 自动建立 direct conversations（幂等）
INSERT INTO public.conversations (
  type,
  created_by,
  participant_a,
  participant_b,
  last_message_at,
  created_at,
  updated_at
)
SELECT
  'direct' AS type,
  LEAST(m.sender_id, m.receiver_id) AS created_by,
  LEAST(m.sender_id, m.receiver_id) AS participant_a,
  GREATEST(m.sender_id, m.receiver_id) AS participant_b,
  max(m.created_at) AS last_message_at,
  min(m.created_at) AS created_at,
  max(m.created_at) AS updated_at
FROM public.messages m
WHERE m.sender_id IS NOT NULL
  AND m.receiver_id IS NOT NULL
GROUP BY LEAST(m.sender_id, m.receiver_id), GREATEST(m.sender_id, m.receiver_id)
ON CONFLICT (type, participant_a, participant_b)
DO UPDATE SET
  last_message_at = GREATEST(public.conversations.last_message_at, EXCLUDED.last_message_at),
  updated_at = GREATEST(public.conversations.updated_at, EXCLUDED.updated_at);

-- 回填历史消息 conversation_id
UPDATE public.messages m
SET conversation_id = c.id
FROM public.conversations c
WHERE c.type = 'direct'
  AND c.participant_a = LEAST(m.sender_id, m.receiver_id)
  AND c.participant_b = GREATEST(m.sender_id, m.receiver_id)
  AND m.conversation_id IS NULL;

-- 历史会话成员回填（幂等）
INSERT INTO public.conversation_members (conversation_id, user_id, joined_at, created_at, updated_at)
SELECT c.id, c.participant_a, c.created_at, now(), now()
FROM public.conversations c
WHERE c.type = 'direct'
ON CONFLICT (conversation_id, user_id) DO NOTHING;

INSERT INTO public.conversation_members (conversation_id, user_id, joined_at, created_at, updated_at)
SELECT c.id, c.participant_b, c.created_at, now(), now()
FROM public.conversations c
WHERE c.type = 'direct'
ON CONFLICT (conversation_id, user_id) DO NOTHING;

-- 新消息会话追踪索引
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
  ON public.messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender_created
  ON public.messages(sender_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_status_created
  ON public.messages(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_target
  ON public.messages(target_type, target_id);

-- -------------------------------------------------------------------
-- 4) notifications：兼容升级（保持最小可用）
-- -------------------------------------------------------------------
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS body text,
  ADD COLUMN IF NOT EXISTS target_type text,
  ADD COLUMN IF NOT EXISTS target_id uuid,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 历史字段映射（related_type/related_id/content -> target_type/target_id/body）
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'related_type'
  ) THEN
    EXECUTE '
      UPDATE public.notifications
      SET target_type = related_type
      WHERE target_type IS NULL AND related_type IS NOT NULL
    ';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'related_id'
  ) THEN
    EXECUTE '
      UPDATE public.notifications
      SET target_id = related_id
      WHERE target_id IS NULL AND related_id IS NOT NULL
    ';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'content'
  ) THEN
    EXECUTE '
      UPDATE public.notifications
      SET body = content
      WHERE body IS NULL AND content IS NOT NULL
    ';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_notifications_user_created
  ON public.notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread_created
  ON public.notifications(user_id, is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_type_created
  ON public.notifications(type, created_at DESC);

-- -------------------------------------------------------------------
-- 5) 轻量函数与触发器
-- -------------------------------------------------------------------

-- 判断用户是否是会话成员
CREATE OR REPLACE FUNCTION public.is_conversation_member(
  p_conversation_id uuid,
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversation_members cm
    WHERE cm.conversation_id = p_conversation_id
      AND cm.user_id = p_user_id
  );
$$;

-- 获取或创建 direct 会话（最小能力）
CREATE OR REPLACE FUNCTION public.get_or_create_direct_conversation(
  p_user_a uuid,
  p_user_b uuid,
  p_created_by uuid DEFAULT auth.uid()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_a uuid;
  v_b uuid;
  v_conversation_id uuid;
BEGIN
  IF p_user_a IS NULL OR p_user_b IS NULL THEN
    RAISE EXCEPTION 'Both participants are required';
  END IF;

  v_a := LEAST(p_user_a, p_user_b);
  v_b := GREATEST(p_user_a, p_user_b);

  INSERT INTO public.conversations (
    type,
    created_by,
    participant_a,
    participant_b,
    last_message_at
  )
  VALUES (
    'direct',
    COALESCE(p_created_by, p_user_a),
    v_a,
    v_b,
    now()
  )
  ON CONFLICT (type, participant_a, participant_b)
  DO UPDATE SET
    updated_at = now()
  RETURNING id INTO v_conversation_id;

  INSERT INTO public.conversation_members (conversation_id, user_id)
  VALUES (v_conversation_id, v_a)
  ON CONFLICT (conversation_id, user_id) DO NOTHING;

  INSERT INTO public.conversation_members (conversation_id, user_id)
  VALUES (v_conversation_id, v_b)
  ON CONFLICT (conversation_id, user_id) DO NOTHING;

  RETURN v_conversation_id;
END;
$$;

-- 新消息入库前：自动补 conversation_id（兼容旧 sender/receiver 写法）
CREATE OR REPLACE FUNCTION public.trg_messages_ensure_conversation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.conversation_id IS NULL THEN
    IF NEW.sender_id IS NULL OR NEW.receiver_id IS NULL THEN
      RAISE EXCEPTION 'conversation_id is required when sender/receiver is missing';
    END IF;
    NEW.conversation_id := public.get_or_create_direct_conversation(
      NEW.sender_id,
      NEW.receiver_id,
      NEW.sender_id
    );
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- 新消息写入后：更新会话时间，并确保成员关系存在
CREATE OR REPLACE FUNCTION public.trg_messages_after_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conversation_id uuid;
BEGIN
  v_conversation_id := COALESCE(NEW.conversation_id, OLD.conversation_id);

  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    UPDATE public.conversations
    SET last_message_at = GREATEST(COALESCE(last_message_at, NEW.created_at), NEW.created_at),
        updated_at = now()
    WHERE id = NEW.conversation_id;

    IF NEW.sender_id IS NOT NULL THEN
      INSERT INTO public.conversation_members (conversation_id, user_id)
      VALUES (NEW.conversation_id, NEW.sender_id)
      ON CONFLICT (conversation_id, user_id) DO NOTHING;
    END IF;

    IF NEW.receiver_id IS NOT NULL THEN
      INSERT INTO public.conversation_members (conversation_id, user_id)
      VALUES (NEW.conversation_id, NEW.receiver_id)
      ON CONFLICT (conversation_id, user_id) DO NOTHING;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE public.conversations c
    SET last_message_at = COALESCE((
      SELECT max(m.created_at)
      FROM public.messages m
      WHERE m.conversation_id = v_conversation_id
    ), c.created_at),
    updated_at = now()
    WHERE c.id = v_conversation_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 更新时间触发器
DROP TRIGGER IF EXISTS trg_conversations_updated_at_pack05 ON public.conversations;
CREATE TRIGGER trg_conversations_updated_at_pack05
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_conversation_members_updated_at_pack05 ON public.conversation_members;
CREATE TRIGGER trg_conversation_members_updated_at_pack05
  BEFORE UPDATE ON public.conversation_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_messages_updated_at_pack05 ON public.messages;
CREATE TRIGGER trg_messages_updated_at_pack05
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_notifications_updated_at_pack05 ON public.notifications;
CREATE TRIGGER trg_notifications_updated_at_pack05
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_messages_ensure_conversation_pack05 ON public.messages;
CREATE TRIGGER trg_messages_ensure_conversation_pack05
  BEFORE INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_messages_ensure_conversation();

DROP TRIGGER IF EXISTS trg_messages_after_change_pack05 ON public.messages;
CREATE TRIGGER trg_messages_after_change_pack05
  AFTER INSERT OR UPDATE OR DELETE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_messages_after_change();

-- -------------------------------------------------------------------
-- 6) RLS：重建消息与通知策略（最小可用且边界清晰）
-- -------------------------------------------------------------------
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- conversations
DROP POLICY IF EXISTS "pack05_conversations_member_select" ON public.conversations;
CREATE POLICY "pack05_conversations_member_select"
  ON public.conversations
  FOR SELECT
  USING (public.is_conversation_member(id, auth.uid()));

DROP POLICY IF EXISTS "pack05_conversations_creator_insert" ON public.conversations;
CREATE POLICY "pack05_conversations_creator_insert"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND (
      type <> 'direct'
      OR auth.uid() IN (participant_a, participant_b)
    )
  );

DROP POLICY IF EXISTS "pack05_conversations_creator_update" ON public.conversations;
CREATE POLICY "pack05_conversations_creator_update"
  ON public.conversations
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- conversation_members
DROP POLICY IF EXISTS "pack05_conversation_members_member_select" ON public.conversation_members;
CREATE POLICY "pack05_conversation_members_member_select"
  ON public.conversation_members
  FOR SELECT
  USING (public.is_conversation_member(conversation_id, auth.uid()));

DROP POLICY IF EXISTS "pack05_conversation_members_self_update" ON public.conversation_members;
CREATE POLICY "pack05_conversation_members_self_update"
  ON public.conversation_members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- messages: 先移除历史策略，避免与会话模型冲突
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'messages'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.messages', r.policyname);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "pack05_messages_member_select" ON public.messages;
CREATE POLICY "pack05_messages_member_select"
  ON public.messages
  FOR SELECT
  USING (
    public.is_conversation_member(conversation_id, auth.uid())
    AND status = 'active'
    OR auth.uid() = sender_id
  );

DROP POLICY IF EXISTS "pack05_messages_sender_insert" ON public.messages;
CREATE POLICY "pack05_messages_sender_insert"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "pack05_messages_sender_update" ON public.messages;
CREATE POLICY "pack05_messages_sender_update"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "pack05_messages_sender_delete" ON public.messages;
CREATE POLICY "pack05_messages_sender_delete"
  ON public.messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- notifications: 重建为 owner-only（读/改/删）；插入允许本人，系统走 service role
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notifications'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.notifications', r.policyname);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "pack05_notifications_owner_select" ON public.notifications;
CREATE POLICY "pack05_notifications_owner_select"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack05_notifications_owner_insert" ON public.notifications;
CREATE POLICY "pack05_notifications_owner_insert"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack05_notifications_owner_update" ON public.notifications;
CREATE POLICY "pack05_notifications_owner_update"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack05_notifications_owner_delete" ON public.notifications;
CREATE POLICY "pack05_notifications_owner_delete"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- -------------------------------------------------------------------
-- 7) Realtime 适配（仅加表，不做前端改造）
-- -------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_publication
    WHERE pubname = 'supabase_realtime'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'conversations'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'conversation_members'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_members;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'messages'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'notifications'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    END IF;
  END IF;
END $$;

-- -------------------------------------------------------------------
-- 8) 最小未读数辅助函数（不做复杂回执系统）
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_my_unread_message_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(sum(cnt), 0)::integer
  FROM (
    SELECT count(*) AS cnt
    FROM public.conversation_members cm
    JOIN public.messages m
      ON m.conversation_id = cm.conversation_id
     AND m.sender_id <> cm.user_id
     AND m.status = 'active'
     AND (
       cm.last_read_at IS NULL
       OR m.created_at > cm.last_read_at
     )
    WHERE cm.user_id = auth.uid()
    GROUP BY cm.conversation_id
  ) t;
$$;

CREATE OR REPLACE FUNCTION public.get_my_unread_notification_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::integer
  FROM public.notifications n
  WHERE n.user_id = auth.uid()
    AND n.is_read = false;
$$;
