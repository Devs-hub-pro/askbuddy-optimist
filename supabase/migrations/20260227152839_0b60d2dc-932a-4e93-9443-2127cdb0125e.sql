
-- Create a function to recharge points
CREATE OR REPLACE FUNCTION public.recharge_points(p_amount integer, p_payment_method text DEFAULT '模拟支付')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_new_balance integer;
  v_order_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Create order record
  INSERT INTO orders (user_id, order_type, amount, status, payment_method, paid_at)
  VALUES (v_user_id, 'recharge', p_amount, 'completed', p_payment_method, now())
  RETURNING id INTO v_order_id;

  -- Update points balance
  UPDATE profiles SET points_balance = points_balance + p_amount WHERE user_id = v_user_id
  RETURNING points_balance INTO v_new_balance;

  -- Record transaction
  INSERT INTO points_transactions (user_id, type, amount, balance_after, description, related_id, status)
  VALUES (v_user_id, 'recharge', p_amount, v_new_balance, '积分充值 +' || p_amount, v_order_id, 'completed');
END;
$$;
