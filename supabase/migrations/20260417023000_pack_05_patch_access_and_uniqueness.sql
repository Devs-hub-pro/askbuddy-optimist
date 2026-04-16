-- Pack 05 patch: 执行前收口（direct 唯一性 + 消息权限边界 + 通知写入边界）
-- 目标：
-- 1) direct 会话严格规范化，避免 (A,B)/(B,A) 双记录
-- 2) messages 仅允许会话成员读取/发送，防止向不属于自己的会话发消息
-- 3) notifications 普通用户不再允许插入，系统通知统一走 service role/server-side
-- 4) unread 函数保持“最小可用”职责，不扩展复杂状态系统

-- -------------------------------------------------------------------
-- 1) direct 会话唯一性与顺序约束
-- -------------------------------------------------------------------
-- 规则：direct 会话必须满足 participant_a < participant_b，且 (type, participant_a, participant_b) 唯一。

-- 尝试将历史 direct 会话标准化为 participant_a < participant_b（幂等）
UPDATE public.conversations
SET participant_a = participant_b,
    participant_b = participant_a
WHERE type = 'direct'
  AND participant_a IS NOT NULL
  AND participant_b IS NOT NULL
  AND participant_a > participant_b;

-- 若存在同一对用户的重复 direct 会话，合并到保留会话（最小修复）
DO $$
DECLARE
  rec record;
BEGIN
  FOR rec IN
    SELECT
      LEAST(participant_a, participant_b) AS a,
      GREATEST(participant_a, participant_b) AS b,
      min(id) AS keep_id,
      array_remove(array_agg(id ORDER BY id), min(id)) AS dup_ids
    FROM public.conversations
    WHERE type = 'direct'
      AND participant_a IS NOT NULL
      AND participant_b IS NOT NULL
    GROUP BY LEAST(participant_a, participant_b), GREATEST(participant_a, participant_b)
    HAVING count(*) > 1
  LOOP
    -- 消息并到保留会话
    UPDATE public.messages
    SET conversation_id = rec.keep_id
    WHERE conversation_id = ANY(rec.dup_ids);

    -- 成员并到保留会话
    INSERT INTO public.conversation_members (conversation_id, user_id, joined_at, last_read_message_id, last_read_at, created_at, updated_at)
    SELECT
      rec.keep_id,
      cm.user_id,
      min(cm.joined_at),
      max(cm.last_read_message_id),
      max(cm.last_read_at),
      now(),
      now()
    FROM public.conversation_members cm
    WHERE cm.conversation_id = ANY(rec.dup_ids)
    GROUP BY cm.user_id
    ON CONFLICT (conversation_id, user_id) DO NOTHING;

    DELETE FROM public.conversation_members
    WHERE conversation_id = ANY(rec.dup_ids);

    DELETE FROM public.conversations
    WHERE id = ANY(rec.dup_ids);
  END LOOP;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'conversations_direct_participant_order_check'
      AND conrelid = 'public.conversations'::regclass
  ) THEN
    ALTER TABLE public.conversations
      ADD CONSTRAINT conversations_direct_participant_order_check
      CHECK (
        type <> 'direct'
        OR (
          participant_a IS NOT NULL
          AND participant_b IS NOT NULL
          AND participant_a < participant_b
        )
      );
  END IF;
END $$;

-- -------------------------------------------------------------------
-- 2) messages RLS 收紧：只有会话成员可读/发
-- -------------------------------------------------------------------
DROP POLICY IF EXISTS "pack05_messages_member_select" ON public.messages;
CREATE POLICY "pack05_messages_member_select"
  ON public.messages
  FOR SELECT
  USING (
    public.is_conversation_member(conversation_id, auth.uid())
    AND (
      status = 'active'
      OR auth.uid() = sender_id
    )
  );

DROP POLICY IF EXISTS "pack05_messages_sender_insert" ON public.messages;
CREATE POLICY "pack05_messages_sender_insert"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND (
      conversation_id IS NULL
      OR public.is_conversation_member(conversation_id, auth.uid())
    )
  );

-- 成员 read 指针更新时，不允许改到自己不属于的会话
DROP POLICY IF EXISTS "pack05_conversation_members_self_update" ON public.conversation_members;
CREATE POLICY "pack05_conversation_members_self_update"
  ON public.conversation_members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND public.is_conversation_member(conversation_id, auth.uid())
  );

-- 触发器层兜底：若指定了 conversation_id，发信人必须属于会话；
-- 若是 direct 会话，还需 sender/receiver 与会话参与者匹配。
CREATE OR REPLACE FUNCTION public.trg_messages_ensure_conversation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_type text;
  v_a uuid;
  v_b uuid;
  v_uid uuid := auth.uid();
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
  ELSE
    IF v_uid IS NOT NULL AND NOT public.is_conversation_member(NEW.conversation_id, v_uid) THEN
      RAISE EXCEPTION 'sender is not a member of this conversation';
    END IF;

    SELECT c.type, c.participant_a, c.participant_b
    INTO v_type, v_a, v_b
    FROM public.conversations c
    WHERE c.id = NEW.conversation_id;

    IF v_type IS NULL THEN
      RAISE EXCEPTION 'conversation not found';
    END IF;

    IF v_type = 'direct' THEN
      IF NEW.sender_id IS NULL OR NEW.receiver_id IS NULL THEN
        RAISE EXCEPTION 'direct conversation requires sender_id and receiver_id';
      END IF;

      IF LEAST(NEW.sender_id, NEW.receiver_id) <> v_a
         OR GREATEST(NEW.sender_id, NEW.receiver_id) <> v_b THEN
        RAISE EXCEPTION 'direct conversation participants mismatch';
      END IF;
    END IF;
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

COMMENT ON POLICY "pack05_messages_member_select" ON public.messages IS
'仅会话成员可读消息；非成员不可读。成员默认读 active，发送者可读自己历史消息。';

COMMENT ON POLICY "pack05_messages_sender_insert" ON public.messages IS
'仅允许 auth.uid() 作为 sender_id；且仅可向自己所属会话发送（或空 conversation_id 由 direct 自动建会话）。';

-- -------------------------------------------------------------------
-- 3) notifications 写入边界收口
-- -------------------------------------------------------------------
DROP POLICY IF EXISTS "pack05_notifications_owner_insert" ON public.notifications;

COMMENT ON TABLE public.notifications IS
'Pack05 一期策略：普通 authenticated 用户仅可读/更新/删除自己的通知；通知写入（系统通知/业务通知）统一由 service role 或后端服务端路径执行。';

-- -------------------------------------------------------------------
-- 4) unread count 函数职责声明（保持最小可用）
-- -------------------------------------------------------------------
COMMENT ON FUNCTION public.get_my_unread_message_count() IS
'最小可用未读消息统计：按 conversation_members.last_read_at 与 active 消息计算，仅服务当前前端未读角标，不包含回执/送达/撤回等复杂状态。';

COMMENT ON FUNCTION public.get_my_unread_notification_count() IS
'最小可用未读通知统计：按 notifications.is_read=false 计数，仅服务当前前端未读角标。';

