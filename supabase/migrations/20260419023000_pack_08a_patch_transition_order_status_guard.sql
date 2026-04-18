-- Pack 08-A patch: allow transition_order_status_v2 on service-side paths
-- Root cause:
-- - initial guard relied on public.is_service_role() only
-- - server-side calls made via privileged DB roles may not carry JWT role claim
-- - this blocked legitimate service-side invocation path

BEGIN;

CREATE OR REPLACE FUNCTION public.transition_order_status_v2(
  p_order_id uuid,
  p_to_status text,
  p_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_to_status text := lower(trim(coalesce(p_to_status, '')));
  v_now timestamptz := now();
  v_allowed boolean := false;
  v_claim_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
BEGIN
  -- service-role/server-side only:
  -- 1) service role JWT path
  -- 2) privileged DB roles for controlled server-side scripts/migrations
  IF NOT (
    v_claim_role = 'service_role'
    OR current_user IN ('service_role', 'postgres', 'supabase_admin')
  ) THEN
    RAISE EXCEPTION 'transition_order_status_v2 is restricted to service role / server-side paths';
  END IF;

  IF p_order_id IS NULL THEN
    RAISE EXCEPTION 'p_order_id is required';
  END IF;

  IF v_to_status = '' THEN
    RAISE EXCEPTION 'p_to_status is required';
  END IF;

  SELECT *
  INTO v_order
  FROM public.orders o
  WHERE o.id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'order not found';
  END IF;

  -- idempotent no-op
  IF v_order.status = v_to_status THEN
    RETURN jsonb_build_object(
      'ok', true,
      'idempotent', true,
      'order_id', p_order_id,
      'from_status', v_order.status,
      'to_status', v_to_status
    );
  END IF;

  -- whitelist transitions (Pack08-A minimal matrix)
  v_allowed :=
      (v_order.status = 'pending_payment' AND v_to_status = 'paid')
   OR (v_order.status = 'paid' AND v_to_status = 'in_service')
   OR (v_order.status = 'in_service' AND v_to_status = 'completed')
   OR (v_order.status = 'paid' AND v_to_status = 'refunded')
   OR (v_order.status = 'pending_payment' AND v_to_status = 'closed');

  IF NOT v_allowed THEN
    RAISE EXCEPTION 'illegal order status transition: % -> %', v_order.status, v_to_status;
  END IF;

  UPDATE public.orders
  SET
    status = v_to_status,
    paid_at = CASE
      WHEN v_to_status = 'paid' THEN coalesce(paid_at, v_now)
      ELSE paid_at
    END,
    completed_at = CASE
      WHEN v_to_status = 'completed' THEN coalesce(completed_at, v_now)
      ELSE completed_at
    END,
    closed_at = CASE
      WHEN v_to_status = 'closed' THEN coalesce(closed_at, v_now)
      ELSE closed_at
    END,
    updated_at = v_now
  WHERE id = p_order_id;

  RETURN jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'order_id', p_order_id,
    'from_status', v_order.status,
    'to_status', v_to_status,
    'reason_accepted', coalesce(p_reason, '')
  );
END;
$$;

REVOKE ALL ON FUNCTION public.transition_order_status_v2(uuid, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.transition_order_status_v2(uuid, text, text) FROM anon;
REVOKE ALL ON FUNCTION public.transition_order_status_v2(uuid, text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.transition_order_status_v2(uuid, text, text) TO service_role;

COMMENT ON FUNCTION public.transition_order_status_v2(uuid, text, text) IS
'Pack08-A order transition path (patched): server-side only, whitelist transitions, idempotent same-status handling, no notification/ledger side-effects.';

COMMIT;
