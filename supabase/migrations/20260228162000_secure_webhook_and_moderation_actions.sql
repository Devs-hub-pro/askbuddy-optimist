-- Add enforceable moderation actions and hide flagged content from core queries.

ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

ALTER TABLE public.answers
ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

ALTER TABLE public.topic_discussions
ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_questions_visible_created
ON public.questions(is_hidden, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_answers_visible_question
ON public.answers(question_id, is_hidden, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_topic_discussions_visible_topic
ON public.topic_discussions(topic_id, is_hidden, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_visible_thread
ON public.messages(sender_id, receiver_id, is_hidden, created_at DESC);

CREATE OR REPLACE FUNCTION public.get_user_conversations()
RETURNS TABLE (
  partner_id uuid,
  partner_nickname text,
  partner_avatar text,
  last_message text,
  last_message_time timestamptz,
  unread_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  WITH visible_messages AS (
    SELECT *
    FROM public.messages
    WHERE is_hidden = false
      AND (sender_id = v_user_id OR receiver_id = v_user_id)
  ),
  conversation_messages AS (
    SELECT
      CASE
        WHEN m.sender_id = v_user_id THEN m.receiver_id
        ELSE m.sender_id
      END AS peer_id,
      m.content,
      m.created_at,
      m.read_at,
      row_number() OVER (
        PARTITION BY
          CASE
            WHEN m.sender_id = v_user_id THEN m.receiver_id
            ELSE m.sender_id
          END
        ORDER BY m.created_at DESC
      ) AS rn
    FROM visible_messages m
  ),
  unread_messages AS (
    SELECT
      sender_id AS peer_id,
      count(*)::int AS unread_count
    FROM visible_messages
    WHERE receiver_id = v_user_id
      AND read_at IS NULL
    GROUP BY sender_id
  )
  SELECT
    cm.peer_id,
    p.nickname,
    p.avatar_url,
    cm.content,
    cm.created_at,
    coalesce(um.unread_count, 0)
  FROM conversation_messages cm
  LEFT JOIN public.profiles p ON p.user_id = cm.peer_id
  LEFT JOIN unread_messages um ON um.peer_id = cm.peer_id
  WHERE cm.rn = 1
  ORDER BY cm.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.apply_content_moderation_action(
  p_target_type text,
  p_target_id uuid,
  p_action text,
  p_reason text DEFAULT NULL,
  p_report_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_log_action text;
  v_report_status text;
BEGIN
  v_user_id := auth.uid();

  IF NOT (
    public.has_role(v_user_id, 'admin')
    OR public.has_role(v_user_id, 'moderator')
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  IF p_action NOT IN ('hide', 'restore') THEN
    RAISE EXCEPTION 'Unsupported moderation action';
  END IF;

  IF p_target_type = 'question' THEN
    UPDATE public.questions
    SET is_hidden = (p_action = 'hide')
    WHERE id = p_target_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Question not found';
    END IF;
  ELSIF p_target_type = 'answer' THEN
    UPDATE public.answers
    SET is_hidden = (p_action = 'hide')
    WHERE id = p_target_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Answer not found';
    END IF;
  ELSIF p_target_type = 'discussion' THEN
    UPDATE public.topic_discussions
    SET is_hidden = (p_action = 'hide')
    WHERE id = p_target_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Discussion not found';
    END IF;
  ELSIF p_target_type = 'message' THEN
    UPDATE public.messages
    SET is_hidden = (p_action = 'hide')
    WHERE id = p_target_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Message not found';
    END IF;
  ELSE
    RAISE EXCEPTION 'Unsupported target type';
  END IF;

  v_log_action := CASE WHEN p_action = 'hide' THEN 'blocked' ELSE 'approved' END;
  v_report_status := CASE WHEN p_action = 'hide' THEN 'resolved' ELSE 'rejected' END;

  INSERT INTO public.content_moderation_logs (
    target_id,
    target_type,
    actor_id,
    action,
    reason,
    metadata
  )
  VALUES (
    p_target_id,
    p_target_type,
    v_user_id,
    v_log_action,
    nullif(trim(coalesce(p_reason, '')), ''),
    jsonb_build_object('moderation_action', p_action)
  );

  IF p_report_id IS NOT NULL THEN
    UPDATE public.content_reports
    SET status = v_report_status,
        reviewed_at = now(),
        reviewed_by = v_user_id,
        resolution_note = nullif(trim(coalesce(p_reason, '')), '')
    WHERE id = p_report_id;
  END IF;

  PERFORM public.record_audit_event(
    'content_moderation_applied',
    p_target_type,
    p_target_id,
    'warning',
    jsonb_build_object('action', p_action, 'report_id', p_report_id)
  );

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.list_content_reports(
  p_status text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'moderator')
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  RETURN coalesce((
    SELECT jsonb_agg(row_to_json(r))
    FROM (
      SELECT
        cr.id,
        cr.target_id,
        cr.target_type,
        cr.reason,
        cr.details,
        cr.status,
        cr.created_at,
        cr.reviewed_at,
        cr.resolution_note,
        p.nickname AS reporter_nickname,
        CASE
          WHEN cr.target_type = 'question' THEN (SELECT q.is_hidden FROM public.questions q WHERE q.id = cr.target_id)
          WHEN cr.target_type = 'answer' THEN (SELECT a.is_hidden FROM public.answers a WHERE a.id = cr.target_id)
          WHEN cr.target_type = 'discussion' THEN (SELECT d.is_hidden FROM public.topic_discussions d WHERE d.id = cr.target_id)
          WHEN cr.target_type = 'message' THEN (SELECT m.is_hidden FROM public.messages m WHERE m.id = cr.target_id)
          ELSE NULL
        END AS target_hidden
      FROM public.content_reports cr
      LEFT JOIN public.profiles p ON p.user_id = cr.reporter_id
      WHERE p_status IS NULL OR cr.status = p_status
      ORDER BY cr.created_at DESC
      LIMIT 50
    ) r
  ), '[]'::jsonb);
END;
$$;
