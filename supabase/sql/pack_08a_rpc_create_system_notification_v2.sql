-- Pack 08-A: RPC closure for system notification writes (minimal)
-- Goal:
-- - Introduce server-side-only write path: public.create_system_notification_v2(...)
-- - Keep ordinary authenticated users from forging system notifications
-- - Stay compatible with Pack05 notifications schema (new + legacy columns)
--
-- Out of scope:
-- - template system
-- - push delivery
-- - orchestration / workflow engine
-- - order status transitions

BEGIN;

-- -------------------------------------------------------------------
-- create_system_notification_v2
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_system_notification_v2(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_target_type text DEFAULT NULL,
  p_target_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_notification_id uuid;
  v_claim_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
BEGIN
  -- Service-only guard:
  -- 1) service role JWT path (recommended)
  -- 2) privileged DB roles for controlled server-side scripts/migrations
  IF NOT (
    v_claim_role = 'service_role'
    OR current_user IN ('service_role', 'postgres', 'supabase_admin')
  ) THEN
    RAISE EXCEPTION 'create_system_notification_v2 is restricted to service role / server-side paths';
  END IF;

  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'p_user_id is required';
  END IF;

  IF p_type IS NULL OR btrim(p_type) = '' THEN
    RAISE EXCEPTION 'p_type is required';
  END IF;

  IF p_title IS NULL OR btrim(p_title) = '' THEN
    RAISE EXCEPTION 'p_title is required';
  END IF;

  -- body can be empty for very short system pings, but store as text consistently.
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    body,
    target_type,
    target_id,
    -- legacy compatibility columns retained in Pack05
    content,
    related_type,
    related_id,
    is_read,
    created_at,
    updated_at
  )
  VALUES (
    p_user_id,
    btrim(p_type),
    btrim(p_title),
    p_body,
    nullif(btrim(coalesce(p_target_type, '')), ''),
    p_target_id,
    p_body,
    nullif(btrim(coalesce(p_target_type, '')), ''),
    p_target_id,
    false,
    now(),
    now()
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_system_notification_v2(uuid, text, text, text, text, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_system_notification_v2(uuid, text, text, text, text, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.create_system_notification_v2(uuid, text, text, text, text, uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.create_system_notification_v2(uuid, text, text, text, text, uuid) TO service_role;

COMMENT ON FUNCTION public.create_system_notification_v2(uuid, text, text, text, text, uuid) IS
'Pack08-A server-side notification write path. Service-role only. Writes notifications with is_read=false and mirrors body/target_* to legacy content/related_* for compatibility.';

COMMIT;

