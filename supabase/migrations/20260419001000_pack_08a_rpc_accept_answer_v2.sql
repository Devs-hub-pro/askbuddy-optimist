-- Pack 08-A: RPC closure for answer acceptance (minimal, reliable)
-- Scope:
-- 1) Introduce public.accept_answer_v2(p_question_id uuid, p_answer_id uuid)
-- 2) Keep direct front-end writes to system fields blocked
-- 3) Allow only this RPC path to bypass Pack02 guard triggers via local GUC
--
-- Out of scope in this file:
-- - system notification writes
-- - order state transitions
-- - points/earnings settlement distribution

BEGIN;

-- -------------------------------------------------------------------
-- 1) Guard trigger patch: allow controlled bypass only for accept_answer_v2
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trg_questions_guard_system_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_bypass boolean := coalesce(current_setting('app.accept_answer_v2', true), '') = '1';
BEGIN
  -- Bypass only when explicitly set by server-side RPC in this transaction.
  IF v_bypass THEN
    RETURN NEW;
  END IF;

  -- Keep existing protection: authenticated author cannot directly edit system fields.
  IF v_uid IS NOT NULL AND v_uid = OLD.author_id THEN
    IF NEW.answer_count IS DISTINCT FROM OLD.answer_count
      OR NEW.favorite_count IS DISTINCT FROM OLD.favorite_count
      OR NEW.view_count IS DISTINCT FROM OLD.view_count
      OR NEW.accepted_answer_id IS DISTINCT FROM OLD.accepted_answer_id
      OR NEW.status IS DISTINCT FROM OLD.status
      OR NEW.author_id IS DISTINCT FROM OLD.author_id
      OR NEW.created_at IS DISTINCT FROM OLD.created_at
      OR NEW.id IS DISTINCT FROM OLD.id
    THEN
      RAISE EXCEPTION 'system-managed fields are not editable by author directly';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_answers_guard_system_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_bypass boolean := coalesce(current_setting('app.accept_answer_v2', true), '') = '1';
BEGIN
  -- Bypass only when explicitly set by server-side RPC in this transaction.
  IF v_bypass THEN
    RETURN NEW;
  END IF;

  -- Keep existing protection: authenticated answer author cannot edit system fields directly.
  IF v_uid IS NOT NULL AND v_uid = OLD.author_id THEN
    IF NEW.is_accepted IS DISTINCT FROM OLD.is_accepted
      OR NEW.like_count IS DISTINCT FROM OLD.like_count
      OR NEW.status IS DISTINCT FROM OLD.status
      OR NEW.question_id IS DISTINCT FROM OLD.question_id
      OR NEW.author_id IS DISTINCT FROM OLD.author_id
      OR NEW.created_at IS DISTINCT FROM OLD.created_at
      OR NEW.id IS DISTINCT FROM OLD.id
    THEN
      RAISE EXCEPTION 'system-managed fields are not editable by answer author directly';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.trg_questions_guard_system_fields() IS
'Pack08-A: keep direct system-field writes blocked; allow controlled bypass only when app.accept_answer_v2=1 within accept_answer_v2 RPC.';

COMMENT ON FUNCTION public.trg_answers_guard_system_fields() IS
'Pack08-A: keep direct system-field writes blocked; allow controlled bypass only when app.accept_answer_v2=1 within accept_answer_v2 RPC.';

-- -------------------------------------------------------------------
-- 2) accept_answer_v2 RPC
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.accept_answer_v2(
  p_question_id uuid,
  p_answer_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_question public.questions%ROWTYPE;
  v_answer public.answers%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'authentication required';
  END IF;

  IF p_question_id IS NULL OR p_answer_id IS NULL THEN
    RAISE EXCEPTION 'p_question_id and p_answer_id are required';
  END IF;

  -- Lock question row to avoid concurrent accept races.
  SELECT *
  INTO v_question
  FROM public.questions q
  WHERE q.id = p_question_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'question not found';
  END IF;

  -- Only question author can accept.
  IF v_question.author_id <> v_uid THEN
    RAISE EXCEPTION 'only question author can accept an answer';
  END IF;

  -- Lock target answer row.
  SELECT *
  INTO v_answer
  FROM public.answers a
  WHERE a.id = p_answer_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'answer not found';
  END IF;

  -- Must belong to the same question.
  IF v_answer.question_id <> p_question_id THEN
    RAISE EXCEPTION 'answer does not belong to question';
  END IF;

  -- Hidden/rejected answers are not eligible for acceptance.
  IF v_answer.status NOT IN ('active', 'accepted') THEN
    RAISE EXCEPTION 'answer status is not eligible for acceptance';
  END IF;

  -- Idempotent path: same answer already accepted.
  IF v_question.accepted_answer_id = p_answer_id THEN
    RETURN jsonb_build_object(
      'ok', true,
      'idempotent', true,
      'question_id', p_question_id,
      'accepted_answer_id', p_answer_id
    );
  END IF;

  -- Keep one-way behavior for MVP: reject replacing a different accepted answer.
  IF v_question.accepted_answer_id IS NOT NULL
     AND v_question.accepted_answer_id <> p_answer_id THEN
    RAISE EXCEPTION 'question already has a different accepted answer';
  END IF;

  -- Controlled bypass for Pack02 guard triggers in this transaction scope only.
  PERFORM set_config('app.accept_answer_v2', '1', true);

  UPDATE public.questions
  SET
    accepted_answer_id = p_answer_id,
    status = CASE
      WHEN status IN ('open', 'matched') THEN 'solved'
      ELSE status
    END,
    updated_at = now()
  WHERE id = p_question_id;

  UPDATE public.answers
  SET
    is_accepted = true,
    status = 'accepted',
    updated_at = now()
  WHERE id = p_answer_id;

  RETURN jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'question_id', p_question_id,
    'accepted_answer_id', p_answer_id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.accept_answer_v2(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_answer_v2(uuid, uuid) TO authenticated;

COMMENT ON FUNCTION public.accept_answer_v2(uuid, uuid) IS
'Pack08-A minimal server-side closure for answer acceptance. No points/earnings/orders/notifications side effects in this version.';

COMMIT;

