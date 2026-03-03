-- Add admin-facing recharge operations for pending orders and manual settlement.

CREATE OR REPLACE FUNCTION public.list_pending_recharge_orders()
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
    SELECT jsonb_agg(row_to_json(o))
    FROM (
      SELECT
        ord.id,
        ord.user_id,
        ord.amount,
        ord.cash_amount,
        ord.status,
        ord.payment_method,
        ord.provider_order_id,
        ord.created_at,
        ord.metadata,
        p.nickname AS user_nickname
      FROM public.orders ord
      LEFT JOIN public.profiles p ON p.user_id = ord.user_id
      WHERE ord.order_type = 'recharge'
        AND ord.status = 'pending'
      ORDER BY ord.created_at DESC
      LIMIT 50
    ) o
  ), '[]'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_confirm_recharge_order(
  p_order_id uuid,
  p_provider_transaction_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order record;
  v_transaction_id text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  SELECT *
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
    AND order_type = 'recharge';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Recharge order not found';
  END IF;

  IF v_order.status IN ('paid', 'completed') THEN
    RETURN true;
  END IF;

  v_transaction_id := coalesce(
    nullif(trim(coalesce(p_provider_transaction_id, '')), ''),
    'MANUAL-' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)
  );

  RETURN public.confirm_recharge_payment(
    p_order_id,
    v_transaction_id,
    coalesce(v_order.cash_amount, v_order.amount::numeric),
    jsonb_build_object(
      'source', 'admin_manual_confirm',
      'confirmed_by', auth.uid()
    )
  );
END;
$$;
