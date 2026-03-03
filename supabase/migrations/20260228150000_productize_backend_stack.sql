-- Productize backend interactions: payment-ready recharge flow, moderation,
-- reporting, rate limiting, search RPCs, admin configs, and audit events.

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS cash_amount numeric(10,2),
ADD COLUMN IF NOT EXISTS provider_order_id text,
ADD COLUMN IF NOT EXISTS provider_transaction_id text,
ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_provider_order_id
ON public.orders(provider_order_id)
WHERE provider_order_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_provider_transaction_id
ON public.orders(provider_transaction_id)
WHERE provider_transaction_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.payment_callbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_transaction_id text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  processed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_transaction_id)
);

CREATE TABLE IF NOT EXISTS public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  event_type text NOT NULL,
  entity_type text,
  entity_id uuid,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rate_limit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  target_id uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('question', 'answer', 'discussion', 'message', 'profile')),
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'rejected')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  resolution_note text
);

CREATE TABLE IF NOT EXISTS public.content_moderation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('question', 'answer', 'discussion', 'message', 'profile', 'report')),
  actor_id uuid,
  action text NOT NULL CHECK (action IN ('flagged', 'blocked', 'approved', 'rejected', 'reviewed')),
  reason text,
  risk_score numeric(5,2),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.app_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.payment_callbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "仅管理员可查看支付回调" ON public.payment_callbacks;
CREATE POLICY "仅管理员可查看支付回调"
ON public.payment_callbacks
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "仅管理员可查看审计事件" ON public.audit_events;
CREATE POLICY "仅管理员可查看审计事件"
ON public.audit_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "仅管理员可查看限流事件" ON public.rate_limit_events;
CREATE POLICY "仅管理员可查看限流事件"
ON public.rate_limit_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "用户可查看自己举报" ON public.content_reports;
CREATE POLICY "用户可查看自己举报"
ON public.content_reports
FOR SELECT
USING (
  auth.uid() = reporter_id
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'moderator')
);

DROP POLICY IF EXISTS "登录用户可提交举报" ON public.content_reports;
CREATE POLICY "登录用户可提交举报"
ON public.content_reports
FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "管理员可处理举报" ON public.content_reports;
CREATE POLICY "管理员可处理举报"
ON public.content_reports
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'moderator')
);

DROP POLICY IF EXISTS "管理员可查看审核日志" ON public.content_moderation_logs;
CREATE POLICY "管理员可查看审核日志"
ON public.content_moderation_logs
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'moderator')
);

DROP POLICY IF EXISTS "系统可写审核日志" ON public.content_moderation_logs;
CREATE POLICY "系统可写审核日志"
ON public.content_moderation_logs
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "所有人可读配置" ON public.app_config;
CREATE POLICY "所有人可读配置"
ON public.app_config
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "仅管理员可管理配置" ON public.app_config;
CREATE POLICY "仅管理员可管理配置"
ON public.app_config
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_payment_callbacks_order_id ON public.payment_callbacks(order_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON public.audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_type_created ON public.audit_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_events_user_action_created
ON public.rate_limit_events(user_id, action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_reports_status_created
ON public.content_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_reports_target
ON public.content_reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_content_moderation_logs_target
ON public.content_moderation_logs(target_type, target_id, created_at DESC);

INSERT INTO public.app_config (key, value, description)
VALUES
  ('search', '{"max_results": 10, "question_weight": 1.2, "topic_weight": 1.0, "user_weight": 0.8}', '搜索排序与返回上限配置'),
  ('risk_control', '{"question_limit_per_10m": 5, "answer_limit_per_10m": 10, "discussion_limit_per_10m": 8, "message_limit_per_10m": 20}', '风控频控配置'),
  ('payment', '{"providers": ["wechat", "alipay", "stripe"], "point_price_ratio": 0.1}', '支付通道与积分兑换比例')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role';
$$;

CREATE OR REPLACE FUNCTION public.record_audit_event(
  p_event_type text,
  p_entity_type text DEFAULT NULL,
  p_entity_id uuid DEFAULT NULL,
  p_severity text DEFAULT 'info',
  p_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.audit_events (
    actor_id,
    event_type,
    entity_type,
    entity_id,
    severity,
    payload
  )
  VALUES (
    auth.uid(),
    p_event_type,
    p_entity_type,
    p_entity_id,
    p_severity,
    coalesce(p_payload, '{}'::jsonb)
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_rate_limit(
  p_action text,
  p_max_count integer DEFAULT 5,
  p_window_minutes integer DEFAULT 10
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_recent_count integer;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT count(*)
  INTO v_recent_count
  FROM public.rate_limit_events
  WHERE user_id = v_user_id
    AND action = p_action
    AND created_at >= now() - make_interval(mins => p_window_minutes);

  IF v_recent_count >= p_max_count THEN
    PERFORM public.record_audit_event(
      'rate_limit_blocked',
      p_action,
      NULL,
      'warning',
      jsonb_build_object('window_minutes', p_window_minutes, 'max_count', p_max_count)
    );
    RAISE EXCEPTION 'Too many requests, please try again later';
  END IF;

  INSERT INTO public.rate_limit_events (user_id, action)
  VALUES (v_user_id, p_action);
END;
$$;

CREATE OR REPLACE FUNCTION public.evaluate_content_risk(
  p_text text
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_text text := lower(coalesce(p_text, ''));
  v_blocked_terms text[] := ARRAY[
    '赌博',
    '色情',
    '裸聊',
    '诈骗',
    '洗钱',
    '毒品'
  ];
  v_suspicious_terms text[] := ARRAY[
    'vx',
    'vx:',
    'wx',
    '微信',
    '加我',
    '引流',
    '刷单'
  ];
  v_matched_blocked text[] := ARRAY[]::text[];
  v_matched_suspicious text[] := ARRAY[]::text[];
  v_term text;
BEGIN
  FOREACH v_term IN ARRAY v_blocked_terms LOOP
    IF position(v_term IN v_text) > 0 THEN
      v_matched_blocked := array_append(v_matched_blocked, v_term);
    END IF;
  END LOOP;

  FOREACH v_term IN ARRAY v_suspicious_terms LOOP
    IF position(v_term IN v_text) > 0 THEN
      v_matched_suspicious := array_append(v_matched_suspicious, v_term);
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'is_blocked', array_length(v_matched_blocked, 1) IS NOT NULL,
    'is_flagged', array_length(v_matched_suspicious, 1) IS NOT NULL,
    'blocked_terms', coalesce(to_jsonb(v_matched_blocked), '[]'::jsonb),
    'flagged_terms', coalesce(to_jsonb(v_matched_suspicious), '[]'::jsonb),
    'risk_score',
      least(
        100,
        coalesce(array_length(v_matched_blocked, 1), 0) * 50
        + coalesce(array_length(v_matched_suspicious, 1), 0) * 15
      )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.create_question_secure(
  p_title text,
  p_content text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_tags text[] DEFAULT NULL,
  p_bounty_points integer DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_question_id uuid;
  v_risk jsonb;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF length(trim(coalesce(p_title, ''))) = 0 THEN
    RAISE EXCEPTION 'Question title is required';
  END IF;

  PERFORM public.enforce_rate_limit('create_question', 5, 10);
  v_risk := public.evaluate_content_risk(trim(coalesce(p_title, '') || ' ' || coalesce(p_content, '')));

  IF coalesce((v_risk ->> 'is_blocked')::boolean, false) THEN
    INSERT INTO public.content_moderation_logs (
      target_id,
      target_type,
      actor_id,
      action,
      reason,
      risk_score,
      metadata
    )
    VALUES (
      gen_random_uuid(),
      'question',
      v_user_id,
      'blocked',
      '命中高风险词',
      coalesce((v_risk ->> 'risk_score')::numeric, 100),
      v_risk
    );
    RAISE EXCEPTION 'Content violates community guidelines';
  END IF;

  INSERT INTO public.questions (
    title,
    content,
    category,
    tags,
    bounty_points,
    user_id
  )
  VALUES (
    trim(p_title),
    nullif(trim(coalesce(p_content, '')), ''),
    nullif(trim(coalesce(p_category, '')), ''),
    p_tags,
    greatest(coalesce(p_bounty_points, 0), 0),
    v_user_id
  )
  RETURNING id INTO v_question_id;

  IF coalesce((v_risk ->> 'is_flagged')::boolean, false) THEN
    INSERT INTO public.content_moderation_logs (
      target_id,
      target_type,
      actor_id,
      action,
      reason,
      risk_score,
      metadata
    )
    VALUES (
      v_question_id,
      'question',
      v_user_id,
      'flagged',
      '命中可疑词',
      coalesce((v_risk ->> 'risk_score')::numeric, 0),
      v_risk
    );
  END IF;

  PERFORM public.record_audit_event(
    'question_created',
    'question',
    v_question_id,
    'info',
    jsonb_build_object('bounty_points', greatest(coalesce(p_bounty_points, 0), 0))
  );

  RETURN v_question_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_answer_secure(
  p_question_id uuid,
  p_content text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_answer_id uuid;
  v_risk jsonb;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF length(trim(coalesce(p_content, ''))) = 0 THEN
    RAISE EXCEPTION 'Answer content is required';
  END IF;

  PERFORM public.enforce_rate_limit('create_answer', 10, 10);
  v_risk := public.evaluate_content_risk(p_content);

  IF coalesce((v_risk ->> 'is_blocked')::boolean, false) THEN
    INSERT INTO public.content_moderation_logs (
      target_id,
      target_type,
      actor_id,
      action,
      reason,
      risk_score,
      metadata
    )
    VALUES (
      gen_random_uuid(),
      'answer',
      v_user_id,
      'blocked',
      '命中高风险词',
      coalesce((v_risk ->> 'risk_score')::numeric, 100),
      v_risk
    );
    RAISE EXCEPTION 'Content violates community guidelines';
  END IF;

  INSERT INTO public.answers (
    question_id,
    content,
    user_id
  )
  VALUES (
    p_question_id,
    trim(p_content),
    v_user_id
  )
  RETURNING id INTO v_answer_id;

  IF coalesce((v_risk ->> 'is_flagged')::boolean, false) THEN
    INSERT INTO public.content_moderation_logs (
      target_id,
      target_type,
      actor_id,
      action,
      reason,
      risk_score,
      metadata
    )
    VALUES (
      v_answer_id,
      'answer',
      v_user_id,
      'flagged',
      '命中可疑词',
      coalesce((v_risk ->> 'risk_score')::numeric, 0),
      v_risk
    );
  END IF;

  PERFORM public.record_audit_event('answer_created', 'answer', v_answer_id, 'info', '{}'::jsonb);

  RETURN v_answer_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_topic_discussion_secure(
  p_topic_id uuid,
  p_content text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_discussion_id uuid;
  v_risk jsonb;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF length(trim(coalesce(p_content, ''))) = 0 THEN
    RAISE EXCEPTION 'Discussion content is required';
  END IF;

  PERFORM public.enforce_rate_limit('create_discussion', 8, 10);
  v_risk := public.evaluate_content_risk(p_content);

  IF coalesce((v_risk ->> 'is_blocked')::boolean, false) THEN
    RAISE EXCEPTION 'Content violates community guidelines';
  END IF;

  INSERT INTO public.topic_discussions (
    topic_id,
    user_id,
    content
  )
  VALUES (
    p_topic_id,
    v_user_id,
    trim(p_content)
  )
  RETURNING id INTO v_discussion_id;

  IF coalesce((v_risk ->> 'is_flagged')::boolean, false) THEN
    INSERT INTO public.content_moderation_logs (
      target_id,
      target_type,
      actor_id,
      action,
      reason,
      risk_score,
      metadata
    )
    VALUES (
      v_discussion_id,
      'discussion',
      v_user_id,
      'flagged',
      '命中可疑词',
      coalesce((v_risk ->> 'risk_score')::numeric, 0),
      v_risk
    );
  END IF;

  PERFORM public.record_audit_event('discussion_created', 'discussion', v_discussion_id, 'info', '{}'::jsonb);

  RETURN v_discussion_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_content_report(
  p_target_id uuid,
  p_target_type text,
  p_reason text,
  p_details text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_report_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  PERFORM public.enforce_rate_limit('submit_report', 10, 60);

  INSERT INTO public.content_reports (
    reporter_id,
    target_id,
    target_type,
    reason,
    details
  )
  VALUES (
    v_user_id,
    p_target_id,
    p_target_type,
    trim(p_reason),
    nullif(trim(coalesce(p_details, '')), '')
  )
  RETURNING id INTO v_report_id;

  PERFORM public.record_audit_event(
    'content_report_submitted',
    p_target_type,
    p_target_id,
    'warning',
    jsonb_build_object('report_id', v_report_id, 'reason', trim(p_reason))
  );

  RETURN v_report_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.review_content_report(
  p_report_id uuid,
  p_status text,
  p_resolution_note text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_report record;
BEGIN
  v_user_id := auth.uid();

  IF NOT (
    public.has_role(v_user_id, 'admin')
    OR public.has_role(v_user_id, 'moderator')
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  SELECT *
  INTO v_report
  FROM public.content_reports
  WHERE id = p_report_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Report not found';
  END IF;

  UPDATE public.content_reports
  SET status = p_status,
      reviewed_at = now(),
      reviewed_by = v_user_id,
      resolution_note = nullif(trim(coalesce(p_resolution_note, '')), '')
  WHERE id = p_report_id;

  INSERT INTO public.content_moderation_logs (
    target_id,
    target_type,
    actor_id,
    action,
    reason,
    metadata
  )
  VALUES (
    v_report.target_id,
    'report',
    v_user_id,
    'reviewed',
    p_status,
    jsonb_build_object('report_id', p_report_id)
  );

  PERFORM public.record_audit_event(
    'content_report_reviewed',
    v_report.target_type,
    v_report.target_id,
    'info',
    jsonb_build_object('report_id', p_report_id, 'status', p_status)
  );

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_recharge_payment_order(
  p_points integer,
  p_payment_method text DEFAULT 'wechat'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_order_id uuid;
  v_cash_amount numeric(10,2);
  v_provider text;
  v_provider_order_id text;
BEGIN
  v_user_id := auth.uid();
  v_provider := lower(coalesce(trim(p_payment_method), 'wechat'));

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF p_points IS NULL OR p_points <= 0 THEN
    RAISE EXCEPTION 'Points amount must be positive';
  END IF;

  IF v_provider NOT IN ('wechat', 'alipay', 'stripe') THEN
    RAISE EXCEPTION 'Unsupported payment provider';
  END IF;

  PERFORM public.enforce_rate_limit('create_recharge_payment', 6, 30);

  v_cash_amount := round((p_points::numeric * 0.10)::numeric, 2);
  v_provider_order_id := 'RCG-' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);

  INSERT INTO public.orders (
    user_id,
    order_type,
    amount,
    cash_amount,
    status,
    payment_method,
    provider_order_id,
    metadata
  )
  VALUES (
    v_user_id,
    'recharge',
    p_points,
    v_cash_amount,
    'pending',
    v_provider,
    v_provider_order_id,
    jsonb_build_object(
      'payment_scene', 'points_recharge',
      'provider', v_provider,
      'client_status', 'awaiting_payment'
    )
  )
  RETURNING id INTO v_order_id;

  PERFORM public.record_audit_event(
    'recharge_payment_created',
    'order',
    v_order_id,
    'info',
    jsonb_build_object('points', p_points, 'cash_amount', v_cash_amount, 'provider', v_provider)
  );

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'provider_order_id', v_provider_order_id,
    'provider', v_provider,
    'points', p_points,
    'cash_amount', v_cash_amount,
    'status', 'pending',
    'payment_payload', jsonb_build_object(
      'provider', v_provider,
      'provider_order_id', v_provider_order_id,
      'cash_amount', v_cash_amount,
      'currency', 'CNY'
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.confirm_recharge_payment(
  p_order_id uuid,
  p_provider_transaction_id text,
  p_paid_cash numeric,
  p_callback_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order record;
  v_new_balance integer;
BEGIN
  IF NOT (public.is_service_role() OR public.has_role(auth.uid(), 'admin')) THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  SELECT *
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.order_type <> 'recharge' THEN
    RAISE EXCEPTION 'Invalid order type';
  END IF;

  IF v_order.status IN ('paid', 'completed') THEN
    RETURN true;
  END IF;

  IF p_paid_cash < coalesce(v_order.cash_amount, 0) THEN
    RAISE EXCEPTION 'Paid amount is lower than expected';
  END IF;

  INSERT INTO public.payment_callbacks (
    order_id,
    provider,
    provider_transaction_id,
    payload
  )
  VALUES (
    v_order.id,
    coalesce(v_order.payment_method, 'unknown'),
    trim(p_provider_transaction_id),
    coalesce(p_callback_payload, '{}'::jsonb)
  );

  UPDATE public.orders
  SET status = 'completed',
      provider_transaction_id = trim(p_provider_transaction_id),
      paid_at = now(),
      metadata = metadata || jsonb_build_object('callback_confirmed_at', now())
  WHERE id = v_order.id;

  UPDATE public.profiles
  SET points_balance = points_balance + v_order.amount
  WHERE user_id = v_order.user_id
  RETURNING points_balance INTO v_new_balance;

  INSERT INTO public.points_transactions (
    user_id,
    type,
    amount,
    balance_after,
    description,
    related_id,
    status
  )
  VALUES (
    v_order.user_id,
    'recharge',
    v_order.amount,
    v_new_balance,
    '第三方支付充值 +' || v_order.amount,
    v_order.id,
    'completed'
  );

  PERFORM public.record_audit_event(
    'recharge_payment_confirmed',
    'order',
    v_order.id,
    'info',
    jsonb_build_object('provider_transaction_id', trim(p_provider_transaction_id), 'paid_cash', p_paid_cash)
  );

  RETURN true;
EXCEPTION
  WHEN unique_violation THEN
    RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.search_app_content(
  p_query text,
  p_limit integer DEFAULT 10
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_query text := trim(coalesce(p_query, ''));
  v_limit integer := greatest(1, least(coalesce(p_limit, 10), 20));
  v_search_query tsquery;
BEGIN
  IF v_query = '' THEN
    RETURN jsonb_build_object(
      'questions', '[]'::jsonb,
      'topics', '[]'::jsonb,
      'users', '[]'::jsonb
    );
  END IF;

  v_search_query := plainto_tsquery('simple', v_query);

  RETURN jsonb_build_object(
    'questions',
    coalesce((
      SELECT jsonb_agg(row_to_json(qr))
      FROM (
        SELECT
          q.id,
          q.title,
          q.content,
          q.category,
          q.tags,
          q.bounty_points,
          q.view_count,
          q.created_at,
          coalesce(p.nickname, '匿名用户') AS profile_nickname,
          p.avatar_url AS profile_avatar,
          (
            SELECT count(*)
            FROM public.answers a
            WHERE a.question_id = q.id
          )::int AS answers_count
        FROM public.questions q
        LEFT JOIN public.profiles p ON p.user_id = q.user_id
        WHERE
          to_tsvector(
            'simple',
            coalesce(q.title, '') || ' ' || coalesce(q.content, '') || ' ' || coalesce(array_to_string(q.tags, ' '), '')
          ) @@ v_search_query
          OR q.title ILIKE '%' || v_query || '%'
          OR coalesce(q.content, '') ILIKE '%' || v_query || '%'
        ORDER BY
          ts_rank(
            to_tsvector(
              'simple',
              coalesce(q.title, '') || ' ' || coalesce(q.content, '') || ' ' || coalesce(array_to_string(q.tags, ' '), '')
            ),
            v_search_query
          ) DESC,
          q.view_count DESC,
          q.created_at DESC
        LIMIT v_limit
      ) qr
    ), '[]'::jsonb),
    'topics',
    coalesce((
      SELECT jsonb_agg(row_to_json(tr))
      FROM (
        SELECT
          t.id,
          t.title,
          t.description,
          t.cover_image,
          t.category,
          t.discussions_count,
          t.participants_count
        FROM public.hot_topics t
        WHERE t.is_active = true
          AND (
            to_tsvector('simple', coalesce(t.title, '') || ' ' || coalesce(t.description, '')) @@ v_search_query
            OR t.title ILIKE '%' || v_query || '%'
            OR coalesce(t.description, '') ILIKE '%' || v_query || '%'
          )
        ORDER BY
          ts_rank(
            to_tsvector('simple', coalesce(t.title, '') || ' ' || coalesce(t.description, '')),
            v_search_query
          ) DESC,
          t.discussions_count DESC,
          t.created_at DESC
        LIMIT greatest(1, least(v_limit, 10))
      ) tr
    ), '[]'::jsonb),
    'users',
    coalesce((
      SELECT jsonb_agg(row_to_json(ur))
      FROM (
        SELECT
          p.id,
          p.user_id,
          p.nickname,
          p.avatar_url,
          p.bio
        FROM public.profiles p
        WHERE
          to_tsvector('simple', coalesce(p.nickname, '') || ' ' || coalesce(p.bio, '')) @@ v_search_query
          OR coalesce(p.nickname, '') ILIKE '%' || v_query || '%'
          OR coalesce(p.bio, '') ILIKE '%' || v_query || '%'
        ORDER BY
          ts_rank(
            to_tsvector('simple', coalesce(p.nickname, '') || ' ' || coalesce(p.bio, '')),
            v_search_query
          ) DESC,
          p.updated_at DESC NULLS LAST,
          p.created_at DESC
        LIMIT greatest(1, least(v_limit, 10))
      ) ur
    ), '[]'::jsonb)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_dashboard()
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

  RETURN jsonb_build_object(
    'pending_recharge_orders', (
      SELECT count(*)
      FROM public.orders
      WHERE order_type = 'recharge' AND status = 'pending'
    ),
    'pending_reports', (
      SELECT count(*)
      FROM public.content_reports
      WHERE status = 'pending'
    ),
    'flagged_contents', (
      SELECT count(*)
      FROM public.content_moderation_logs
      WHERE action = 'flagged'
        AND created_at >= now() - interval '30 days'
    ),
    'today_orders', (
      SELECT count(*)
      FROM public.orders
      WHERE created_at >= date_trunc('day', now())
    ),
    'today_revenue', (
      SELECT coalesce(sum(cash_amount), 0)
      FROM public.orders
      WHERE created_at >= date_trunc('day', now())
        AND status IN ('paid', 'completed')
    ),
    'recent_audit_events', coalesce((
      SELECT jsonb_agg(row_to_json(ae))
      FROM (
        SELECT id, event_type, entity_type, entity_id, severity, payload, created_at
        FROM public.audit_events
        ORDER BY created_at DESC
        LIMIT 8
      ) ae
    ), '[]'::jsonb)
  );
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
        p.nickname AS reporter_nickname
      FROM public.content_reports cr
      LEFT JOIN public.profiles p ON p.user_id = cr.reporter_id
      WHERE p_status IS NULL OR cr.status = p_status
      ORDER BY cr.created_at DESC
      LIMIT 50
    ) r
  ), '[]'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_app_config(
  p_key text,
  p_value jsonb,
  p_description text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  INSERT INTO public.app_config (key, value, description, updated_at, updated_by)
  VALUES (
    trim(p_key),
    coalesce(p_value, '{}'::jsonb),
    nullif(trim(coalesce(p_description, '')), ''),
    now(),
    auth.uid()
  )
  ON CONFLICT (key) DO UPDATE
  SET value = excluded.value,
      description = coalesce(excluded.description, public.app_config.description),
      updated_at = now(),
      updated_by = auth.uid();

  PERFORM public.record_audit_event(
    'app_config_updated',
    'config',
    NULL,
    'info',
    jsonb_build_object('key', trim(p_key))
  );

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_app_configs()
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
    SELECT jsonb_agg(row_to_json(c))
    FROM (
      SELECT key, value, description, updated_at
      FROM public.app_config
      ORDER BY key ASC
    ) c
  ), '[]'::jsonb);
END;
$$;

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
  v_risk jsonb;
BEGIN
  v_sender_id := auth.uid();

  IF v_sender_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF p_receiver_id IS NULL OR p_receiver_id = v_sender_id THEN
    RAISE EXCEPTION 'Invalid receiver';
  END IF;

  IF length(trim(coalesce(p_content, ''))) = 0 THEN
    RAISE EXCEPTION 'Message content is required';
  END IF;

  PERFORM public.enforce_rate_limit('send_message', 20, 10);
  v_risk := public.evaluate_content_risk(p_content);

  IF coalesce((v_risk ->> 'is_blocked')::boolean, false) THEN
    RAISE EXCEPTION 'Content violates community guidelines';
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
    coalesce(nullif(trim(coalesce(p_message_type, '')), ''), 'text')
  )
  RETURNING id INTO v_message_id;

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
    'message',
    '您收到一条新私信',
    left(trim(p_content), 120),
    v_message_id,
    'message',
    v_sender_id
  );

  IF coalesce((v_risk ->> 'is_flagged')::boolean, false) THEN
    INSERT INTO public.content_moderation_logs (
      target_id,
      target_type,
      actor_id,
      action,
      reason,
      risk_score,
      metadata
    )
    VALUES (
      v_message_id,
      'message',
      v_sender_id,
      'flagged',
      '命中可疑词',
      coalesce((v_risk ->> 'risk_score')::numeric, 0),
      v_risk
    );
  END IF;

  PERFORM public.record_audit_event('message_sent', 'message', v_message_id, 'info', '{}'::jsonb);

  RETURN v_message_id;
END;
$$;
