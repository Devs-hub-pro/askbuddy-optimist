-- Call v1: minimal server-side session lifecycle for voice/video consultations.
-- Scope: session storage, participant-only reads, and controlled lifecycle RPCs.
-- Out of scope: RTC provider tokens/signalling, recording, billing, notifications,
-- push orchestration, group calls, heartbeat and timeout workers.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.call_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  target_type text,
  target_id uuid,
  caller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  callee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode text NOT NULL,
  status text NOT NULL DEFAULT 'initiated',
  started_at timestamptz,
  ended_at timestamptz,
  end_reason text,
  rtc_channel text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT call_sessions_distinct_participants_check CHECK (caller_id <> callee_id),
  CONSTRAINT call_sessions_mode_check CHECK (mode IN ('voice', 'video')),
  CONSTRAINT call_sessions_status_check CHECK (
    status IN ('initiated', 'ringing', 'answered', 'ended', 'cancelled', 'timeout', 'failed')
  ),
  CONSTRAINT call_sessions_target_type_check CHECK (
    target_type IS NULL OR target_type IN (
      'question',
      'answer',
      'post',
      'skill_offer',
      'expert',
      'message',
      'order',
      'user_verification',
      'manual',
      'call_session'
    )
  ),
  CONSTRAINT call_sessions_target_pair_check CHECK (
    target_id IS NULL OR target_type IS NOT NULL
  ),
  CONSTRAINT call_sessions_metadata_object_check CHECK (jsonb_typeof(metadata) = 'object'),
  CONSTRAINT call_sessions_started_at_check CHECK (
    status NOT IN ('answered', 'ended') OR started_at IS NOT NULL
  ),
  CONSTRAINT call_sessions_ended_at_check CHECK (
    status NOT IN ('ended', 'cancelled', 'timeout', 'failed') OR ended_at IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_call_sessions_caller_created
  ON public.call_sessions(caller_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_call_sessions_callee_created
  ON public.call_sessions(callee_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_call_sessions_status_created
  ON public.call_sessions(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_call_sessions_target
  ON public.call_sessions(target_type, target_id)
  WHERE target_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_call_sessions_order
  ON public.call_sessions(order_id)
  WHERE order_id IS NOT NULL;

DROP TRIGGER IF EXISTS trg_call_sessions_updated_at_call_v1 ON public.call_sessions;
CREATE TRIGGER trg_call_sessions_updated_at_call_v1
  BEFORE UPDATE ON public.call_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS call_sessions_participants_select ON public.call_sessions;
CREATE POLICY call_sessions_participants_select
  ON public.call_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = caller_id OR auth.uid() = callee_id);

-- Direct client writes stay closed. Lifecycle writes must use the RPCs below.
REVOKE ALL ON TABLE public.call_sessions FROM anon;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.call_sessions FROM authenticated;
GRANT SELECT ON TABLE public.call_sessions TO authenticated;
GRANT ALL ON TABLE public.call_sessions TO service_role;

CREATE OR REPLACE FUNCTION public.create_call_session_v1(
  p_callee_id uuid,
  p_mode text,
  p_target_type text DEFAULT NULL,
  p_target_id uuid DEFAULT NULL,
  p_order_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_mode text := lower(trim(coalesce(p_mode, '')));
  v_target_type text := nullif(lower(trim(coalesce(p_target_type, ''))), '');
  v_target_id uuid := p_target_id;
  v_order_id uuid := p_order_id;
  v_order public.orders%ROWTYPE;
  v_session_id uuid := gen_random_uuid();
  v_rtc_channel text;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'CALL_UNAUTHORIZED';
  END IF;

  IF p_callee_id IS NULL OR p_callee_id = v_uid THEN
    RAISE EXCEPTION 'CALL_INVALID_PARTICIPANT';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p_callee_id) THEN
    RAISE EXCEPTION 'CALL_INVALID_PARTICIPANT';
  END IF;

  IF v_mode NOT IN ('voice', 'video') THEN
    RAISE EXCEPTION 'CALL_INVALID_STATE';
  END IF;

  IF v_target_type IS NOT NULL AND v_target_type NOT IN (
    'question',
    'answer',
    'post',
    'skill_offer',
    'expert',
    'message',
    'order',
    'user_verification',
    'manual',
    'call_session'
  ) THEN
    RAISE EXCEPTION 'CALL_INVALID_STATE';
  END IF;

  IF v_target_id IS NOT NULL AND v_target_type IS NULL THEN
    RAISE EXCEPTION 'CALL_INVALID_STATE';
  END IF;

  IF v_target_type = 'order' THEN
    v_order_id := coalesce(v_order_id, v_target_id);
    v_target_id := coalesce(v_target_id, v_order_id);
  END IF;

  IF v_order_id IS NOT NULL THEN
    SELECT *
    INTO v_order
    FROM public.orders o
    WHERE o.id = v_order_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'CALL_NOT_FOUND';
    END IF;

    IF v_order.seller_id IS NULL OR NOT (
      (v_order.buyer_id = v_uid AND v_order.seller_id = p_callee_id)
      OR (v_order.seller_id = v_uid AND v_order.buyer_id = p_callee_id)
    ) THEN
      RAISE EXCEPTION 'CALL_FORBIDDEN';
    END IF;

    IF v_order.status NOT IN ('paid', 'in_service') THEN
      RAISE EXCEPTION 'CALL_INVALID_STATE';
    END IF;

    IF v_target_type = 'order' AND v_target_id <> v_order_id THEN
      RAISE EXCEPTION 'CALL_INVALID_STATE';
    END IF;
  END IF;

  v_rtc_channel := 'call_' || replace(v_session_id::text, '-', '');

  -- Creation and outbound ringing are one atomic client action in v1.
  INSERT INTO public.call_sessions (
    id,
    order_id,
    target_type,
    target_id,
    caller_id,
    callee_id,
    mode,
    status,
    rtc_channel
  ) VALUES (
    v_session_id,
    v_order_id,
    v_target_type,
    v_target_id,
    v_uid,
    p_callee_id,
    v_mode,
    'ringing',
    v_rtc_channel
  );

  RETURN jsonb_build_object(
    'call_session_id', v_session_id,
    'status', 'ringing'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_call_v1(p_call_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_session public.call_sessions%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'CALL_UNAUTHORIZED';
  END IF;

  SELECT * INTO v_session
  FROM public.call_sessions c
  WHERE c.id = p_call_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CALL_NOT_FOUND';
  END IF;

  IF v_uid <> v_session.callee_id THEN
    RAISE EXCEPTION 'CALL_FORBIDDEN';
  END IF;

  IF v_session.status = 'answered' THEN
    RETURN jsonb_build_object(
      'ok', true,
      'idempotent', true,
      'call_session_id', v_session.id,
      'status', v_session.status
    );
  END IF;

  IF v_session.status <> 'ringing' THEN
    RAISE EXCEPTION 'CALL_INVALID_STATE';
  END IF;

  UPDATE public.call_sessions
  SET status = 'answered', started_at = coalesce(started_at, now())
  WHERE id = v_session.id;

  RETURN jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'call_session_id', v_session.id,
    'status', 'answered'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_call_v1(
  p_call_session_id uuid,
  p_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_session public.call_sessions%ROWTYPE;
  v_reason text := left(coalesce(nullif(trim(p_reason), ''), 'rejected_by_callee'), 200);
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'CALL_UNAUTHORIZED';
  END IF;

  SELECT * INTO v_session
  FROM public.call_sessions c
  WHERE c.id = p_call_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CALL_NOT_FOUND';
  END IF;

  IF v_uid <> v_session.callee_id THEN
    RAISE EXCEPTION 'CALL_FORBIDDEN';
  END IF;

  IF v_session.status = 'cancelled' THEN
    RETURN jsonb_build_object(
      'ok', true,
      'idempotent', true,
      'call_session_id', v_session.id,
      'status', v_session.status
    );
  END IF;

  IF v_session.status <> 'ringing' THEN
    RAISE EXCEPTION 'CALL_INVALID_STATE';
  END IF;

  UPDATE public.call_sessions
  SET status = 'cancelled', ended_at = now(), end_reason = v_reason
  WHERE id = v_session.id;

  RETURN jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'call_session_id', v_session.id,
    'status', 'cancelled'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.end_call_v1(
  p_call_session_id uuid,
  p_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_session public.call_sessions%ROWTYPE;
  v_to_status text;
  v_reason text := left(coalesce(nullif(trim(p_reason), ''), 'ended_by_participant'), 200);
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'CALL_UNAUTHORIZED';
  END IF;

  SELECT * INTO v_session
  FROM public.call_sessions c
  WHERE c.id = p_call_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CALL_NOT_FOUND';
  END IF;

  IF v_uid NOT IN (v_session.caller_id, v_session.callee_id) THEN
    RAISE EXCEPTION 'CALL_FORBIDDEN';
  END IF;

  IF v_session.status IN ('ended', 'cancelled') THEN
    RETURN jsonb_build_object(
      'ok', true,
      'idempotent', true,
      'call_session_id', v_session.id,
      'status', v_session.status
    );
  END IF;

  IF v_session.status = 'answered' THEN
    v_to_status := 'ended';
  ELSIF v_session.status = 'ringing' AND v_uid = v_session.caller_id THEN
    v_to_status := 'cancelled';
  ELSE
    RAISE EXCEPTION 'CALL_INVALID_STATE';
  END IF;

  UPDATE public.call_sessions
  SET status = v_to_status, ended_at = now(), end_reason = v_reason
  WHERE id = v_session.id;

  RETURN jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'call_session_id', v_session.id,
    'status', v_to_status
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_call_session_v1(uuid, text, text, uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.accept_call_v1(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.reject_call_v1(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.end_call_v1(uuid, text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.create_call_session_v1(uuid, text, text, uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_call_v1(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_call_v1(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.end_call_v1(uuid, text) TO authenticated;

COMMENT ON TABLE public.call_sessions IS
'Call v1 participant-only voice/video session state. RTC signalling, recording, billing and notifications are outside this table.';

COMMENT ON COLUMN public.call_sessions.rtc_channel IS
'Opaque RTC room/channel identifier. Provider access tokens must be issued server-side and are not stored here.';

COMMENT ON FUNCTION public.create_call_session_v1(uuid, text, text, uuid, uuid) IS
'Call v1 authenticated creation path. Creates a ringing session; order-linked calls require matching paid/in_service order participants.';

COMMENT ON FUNCTION public.accept_call_v1(uuid) IS
'Call v1 callee-only ringing -> answered transition. Idempotent when already answered.';

COMMENT ON FUNCTION public.reject_call_v1(uuid, text) IS
'Call v1 callee-only ringing -> cancelled transition. Idempotent when already cancelled.';

COMMENT ON FUNCTION public.end_call_v1(uuid, text) IS
'Call v1 participant end path: answered -> ended, or caller cancellation while ringing.';

-- Enable participant-scoped realtime updates when the Supabase publication exists.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1
       FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime'
         AND schemaname = 'public'
         AND tablename = 'call_sessions'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.call_sessions;
  END IF;
END;
$$;

COMMIT;
