-- Align backend contracts used by the app with the actual schema.

-- 1. Store user coordinates for location-based features.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision;

CREATE INDEX IF NOT EXISTS idx_profiles_coordinates
ON public.profiles(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 2. Fix the accept-answer flow so it matches existing check constraints and
-- protects against duplicate acceptance / invalid point transfers.
CREATE OR REPLACE FUNCTION public.accept_answer_and_transfer_points(
  p_answer_id uuid,
  p_question_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_question_user_id uuid;
  v_answer_user_id uuid;
  v_bounty integer;
  v_question_status text;
  v_asker_balance integer;
  v_asker_new_balance integer;
  v_answerer_new_balance integer;
  v_answer_is_accepted boolean;
BEGIN
  SELECT user_id, bounty_points, status
  INTO v_question_user_id, v_bounty, v_question_status
  FROM public.questions
  WHERE id = p_question_id;

  IF v_question_user_id IS NULL THEN
    RAISE EXCEPTION 'Question not found';
  END IF;

  IF v_question_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Only question owner can accept answers';
  END IF;

  IF v_question_status = 'solved' THEN
    RAISE EXCEPTION 'Question is already solved';
  END IF;

  SELECT user_id, is_accepted
  INTO v_answer_user_id, v_answer_is_accepted
  FROM public.answers
  WHERE id = p_answer_id
    AND question_id = p_question_id;

  IF v_answer_user_id IS NULL THEN
    RAISE EXCEPTION 'Answer not found';
  END IF;

  IF v_answer_is_accepted THEN
    RAISE EXCEPTION 'Answer is already accepted';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.answers
    WHERE question_id = p_question_id
      AND is_accepted = true
      AND id <> p_answer_id
  ) THEN
    RAISE EXCEPTION 'Another answer has already been accepted';
  END IF;

  IF coalesce(v_bounty, 0) > 0 THEN
    SELECT points_balance
    INTO v_asker_balance
    FROM public.profiles
    WHERE user_id = v_question_user_id;

    IF v_asker_balance IS NULL THEN
      RAISE EXCEPTION 'Question owner profile not found';
    END IF;

    IF v_asker_balance < v_bounty THEN
      RAISE EXCEPTION 'Insufficient points balance';
    END IF;

    UPDATE public.profiles
    SET points_balance = points_balance - v_bounty
    WHERE user_id = v_question_user_id
    RETURNING points_balance INTO v_asker_new_balance;

    UPDATE public.profiles
    SET points_balance = points_balance + v_bounty
    WHERE user_id = v_answer_user_id
    RETURNING points_balance INTO v_answerer_new_balance;

    IF v_answerer_new_balance IS NULL THEN
      RAISE EXCEPTION 'Answer author profile not found';
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
        v_question_user_id,
        'bounty_payment',
        -v_bounty,
        v_asker_new_balance,
        '悬赏支付',
        p_question_id,
        'completed'
      ),
      (
        v_answer_user_id,
        'reward',
        v_bounty,
        v_answerer_new_balance,
        '悬赏奖励',
        p_question_id,
        'completed'
      );
  END IF;

  UPDATE public.answers
  SET is_accepted = true
  WHERE id = p_answer_id;

  UPDATE public.questions
  SET status = 'solved'
  WHERE id = p_question_id;

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
    v_answer_user_id,
    'answer_accepted',
    '你的回答被采纳了',
    CASE
      WHEN coalesce(v_bounty, 0) > 0 THEN '恭喜！你获得了 ' || v_bounty || ' 积分奖励'
      ELSE '恭喜！你的回答被采纳了'
    END,
    p_question_id,
    'question',
    v_question_user_id
  );
END;
$$;

-- 3. Provide the missing nearby-experts RPC used by the frontend.
CREATE OR REPLACE FUNCTION public.get_nearby_experts(
  p_lat double precision,
  p_lng double precision,
  p_radius_km double precision DEFAULT 50
)
RETURNS TABLE (
  expert_id uuid,
  user_id uuid,
  title text,
  bio text,
  category text,
  location text,
  rating numeric,
  response_rate numeric,
  order_count integer,
  consultation_count integer,
  followers_count integer,
  is_verified boolean,
  display_name text,
  avatar_url text,
  distance_km double precision
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT
    e.id AS expert_id,
    e.user_id,
    e.title,
    e.bio,
    e.category,
    e.location,
    e.rating,
    e.response_rate,
    e.order_count,
    e.consultation_count,
    e.followers_count,
    e.is_verified,
    coalesce(e.display_name, p.nickname, '专家') AS display_name,
    coalesce(e.avatar_url, p.avatar_url) AS avatar_url,
    (
      6371 * acos(
        least(
          1.0,
          greatest(
            -1.0,
            cos(radians(p_lat)) * cos(radians(p.latitude)) *
            cos(radians(p.longitude) - radians(p_lng)) +
            sin(radians(p_lat)) * sin(radians(p.latitude))
          )
        )
      )
    ) AS distance_km
  FROM public.experts e
  JOIN public.profiles p ON p.user_id = e.user_id
  WHERE e.is_active = true
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND (
      6371 * acos(
        least(
          1.0,
          greatest(
            -1.0,
            cos(radians(p_lat)) * cos(radians(p.latitude)) *
            cos(radians(p.longitude) - radians(p_lng)) +
            sin(radians(p_lat)) * sin(radians(p.latitude))
          )
        )
      )
    ) <= p_radius_km
  ORDER BY distance_km ASC, e.rating DESC;
$$;
