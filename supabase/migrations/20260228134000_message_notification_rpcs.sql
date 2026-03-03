-- Move message / notification write paths to backend RPCs and provide
-- a conversation summary query for better frontend performance.

CREATE OR REPLACE FUNCTION public.send_direct_message(
  p_receiver_id uuid,
  p_content text,
  p_message_type text DEFAULT 'text'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sender_id uuid;
  v_message_id uuid;
  v_sender_name text;
BEGIN
  v_sender_id := auth.uid();

  IF v_sender_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_receiver_id IS NULL OR p_receiver_id = v_sender_id THEN
    RAISE EXCEPTION 'Invalid receiver';
  END IF;

  IF trim(coalesce(p_content, '')) = '' THEN
    RAISE EXCEPTION 'Message content cannot be empty';
  END IF;

  IF p_message_type NOT IN ('text', 'image', 'system') THEN
    RAISE EXCEPTION 'Invalid message type';
  END IF;

  INSERT INTO public.messages (
    sender_id,
    receiver_id,
    content,
    message_type
  )
  VALUES (
    v_sender_id,
    p_receiver_id,
    trim(p_content),
    p_message_type
  )
  RETURNING id INTO v_message_id;

  SELECT coalesce(nickname, '用户')
  INTO v_sender_name
  FROM public.profiles
  WHERE user_id = v_sender_id;

  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    content,
    related_id,
    related_type,
    sender_id
  )
  VALUES (
    p_receiver_id,
    'new_message',
    '收到新消息',
    v_sender_name || ' 给你发送了一条新消息',
    v_message_id,
    'message',
    v_sender_id
  );

  RETURN v_message_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_notifications_read(
  p_notification_ids uuid[] DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.notifications
  SET is_read = true
  WHERE user_id = auth.uid()
    AND is_read = false
    AND (
      p_notification_ids IS NULL
      OR id = ANY(p_notification_ids)
    );

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN coalesce(v_count, 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_conversations()
RETURNS TABLE (
  partner_id uuid,
  partner_nickname text,
  partner_avatar text,
  last_message text,
  last_message_time timestamptz,
  unread_count integer
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  WITH scoped_messages AS (
    SELECT
      CASE
        WHEN m.sender_id = auth.uid() THEN m.receiver_id
        ELSE m.sender_id
      END AS partner_id,
      m.content,
      m.created_at,
      m.receiver_id,
      m.read_at
    FROM public.messages m
    WHERE m.sender_id = auth.uid()
       OR m.receiver_id = auth.uid()
  ),
  latest_messages AS (
    SELECT DISTINCT ON (partner_id)
      partner_id,
      content AS last_message,
      created_at AS last_message_time
    FROM scoped_messages
    ORDER BY partner_id, created_at DESC
  ),
  unread_messages AS (
    SELECT
      partner_id,
      count(*)::integer AS unread_count
    FROM scoped_messages
    WHERE receiver_id = auth.uid()
      AND read_at IS NULL
    GROUP BY partner_id
  )
  SELECT
    l.partner_id,
    coalesce(p.nickname, '用户') AS partner_nickname,
    p.avatar_url AS partner_avatar,
    l.last_message,
    l.last_message_time,
    coalesce(u.unread_count, 0) AS unread_count
  FROM latest_messages l
  LEFT JOIN unread_messages u USING (partner_id)
  LEFT JOIN public.profiles p ON p.user_id = l.partner_id
  ORDER BY l.last_message_time DESC;
$$;
