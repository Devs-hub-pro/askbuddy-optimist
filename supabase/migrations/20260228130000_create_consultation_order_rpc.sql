-- Support consultation orders as a transactional backend flow.

ALTER TABLE public.points_transactions
DROP CONSTRAINT IF EXISTS points_transactions_type_check;

ALTER TABLE public.points_transactions
ADD CONSTRAINT points_transactions_type_check
CHECK (
  type = ANY (
    ARRAY[
      'recharge',
      'bounty_payment',
      'reward',
      'withdraw',
      'bonus',
      'consultation_payment',
      'consultation_income'
    ]
  )
);

CREATE OR REPLACE FUNCTION public.create_consultation_order(
  p_expert_id uuid,
  p_consult_type text DEFAULT 'text'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_expert_user_id uuid;
  v_expert_title text;
  v_base_price integer;
  v_amount integer;
  v_buyer_balance integer;
  v_buyer_new_balance integer;
  v_expert_new_balance integer;
  v_order_id uuid;
  v_multiplier integer;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_consult_type NOT IN ('text', 'voice', 'video') THEN
    RAISE EXCEPTION 'Invalid consultation type';
  END IF;

  SELECT user_id, title, coalesce(consultation_price, 50)
  INTO v_expert_user_id, v_expert_title, v_base_price
  FROM public.experts
  WHERE id = p_expert_id
    AND is_active = true;

  IF v_expert_user_id IS NULL THEN
    RAISE EXCEPTION 'Expert not found';
  END IF;

  IF v_expert_user_id = v_user_id THEN
    RAISE EXCEPTION 'Cannot create a consultation order for yourself';
  END IF;

  v_multiplier := CASE p_consult_type
    WHEN 'voice' THEN 2
    WHEN 'video' THEN 4
    ELSE 1
  END;

  v_amount := greatest(v_base_price, 1) * v_multiplier;

  SELECT points_balance
  INTO v_buyer_balance
  FROM public.profiles
  WHERE user_id = v_user_id;

  IF v_buyer_balance IS NULL THEN
    RAISE EXCEPTION 'Buyer profile not found';
  END IF;

  IF v_buyer_balance < v_amount THEN
    RAISE EXCEPTION '积分余额不足';
  END IF;

  INSERT INTO public.orders (
    user_id,
    order_type,
    related_id,
    amount,
    status,
    payment_method,
    paid_at
  )
  VALUES (
    v_user_id,
    'consultation',
    p_expert_id,
    v_amount,
    'completed',
    p_consult_type || '咨询',
    now()
  )
  RETURNING id INTO v_order_id;

  UPDATE public.profiles
  SET points_balance = points_balance - v_amount
  WHERE user_id = v_user_id
  RETURNING points_balance INTO v_buyer_new_balance;

  UPDATE public.profiles
  SET points_balance = points_balance + v_amount
  WHERE user_id = v_expert_user_id
  RETURNING points_balance INTO v_expert_new_balance;

  IF v_expert_new_balance IS NULL THEN
    RAISE EXCEPTION 'Expert profile not found';
  END IF;

  INSERT INTO public.points_transactions (
    user_id,
    type,
    amount,
    balance_after,
    description,
    related_id,
    status
  )
  VALUES
    (
      v_user_id,
      'consultation_payment',
      -v_amount,
      v_buyer_new_balance,
      '咨询下单支出',
      v_order_id,
      'completed'
    ),
    (
      v_expert_user_id,
      'consultation_income',
      v_amount,
      v_expert_new_balance,
      '咨询订单收入',
      v_order_id,
      'completed'
    );

  UPDATE public.experts
  SET
    order_count = coalesce(order_count, 0) + 1,
    consultation_count = coalesce(consultation_count, 0) + 1
  WHERE id = p_expert_id;

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
    v_expert_user_id,
    'system',
    '收到新的咨询订单',
    '你的服务「' || coalesce(v_expert_title, '咨询服务') || '」收到一笔新的' || p_consult_type || '咨询订单',
    v_order_id,
    'order',
    v_user_id
  );

  RETURN v_order_id;
END;
$$;
