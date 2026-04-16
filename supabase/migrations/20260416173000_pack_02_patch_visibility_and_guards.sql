-- Pack 02 patch: 可见性与系统字段保护收口
-- 目标：
-- 1) 收紧 questions / answers 公开读取口径
-- 2) 防止普通作者直接修改系统维护字段
-- 3) 统一 answer_count 统计口径为公开可见回答（active + accepted）

-- ------------------------------------------------------------
-- 1) 收紧 questions / answers 公开读策略
-- ------------------------------------------------------------

-- questions: 公开用户仅可读可展示状态；作者可读自己的全部状态
DROP POLICY IF EXISTS "pack02_questions_public_read" ON public.questions;
CREATE POLICY "pack02_questions_public_read"
  ON public.questions
  FOR SELECT
  USING (
    status IN ('open', 'matched', 'solved', 'closed')
  );

DROP POLICY IF EXISTS "pack02_questions_owner_select_all" ON public.questions;
CREATE POLICY "pack02_questions_owner_select_all"
  ON public.questions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

-- answers: 公开用户仅可读 active/accepted；作者可读自己的全部状态
DROP POLICY IF EXISTS "pack02_answers_public_read" ON public.answers;
CREATE POLICY "pack02_answers_public_read"
  ON public.answers
  FOR SELECT
  USING (
    status IN ('active', 'accepted')
  );

DROP POLICY IF EXISTS "pack02_answers_owner_select_all" ON public.answers;
CREATE POLICY "pack02_answers_owner_select_all"
  ON public.answers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

-- ------------------------------------------------------------
-- 2) 防止普通用户修改系统维护字段（trigger guard）
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.trg_questions_guard_system_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  -- 仅约束“登录且本人作者”的直接更新；service role / 后台函数不受此限制
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

DROP TRIGGER IF EXISTS trg_questions_guard_system_fields ON public.questions;
CREATE TRIGGER trg_questions_guard_system_fields
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_questions_guard_system_fields();

CREATE OR REPLACE FUNCTION public.trg_answers_guard_system_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  -- 仅约束“登录且本人作者”的直接更新；service role / 后台函数不受此限制
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

DROP TRIGGER IF EXISTS trg_answers_guard_system_fields ON public.answers;
CREATE TRIGGER trg_answers_guard_system_fields
  BEFORE UPDATE ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_answers_guard_system_fields();

COMMENT ON TRIGGER trg_questions_guard_system_fields ON public.questions IS
'Pack02 patch: 作者可编辑内容字段，但不可直接改 answer_count/favorite_count/view_count/accepted_answer_id/status 等系统字段。accepted_answer_id 建议后续仅通过专门函数/service role 更新。';

COMMENT ON TRIGGER trg_answers_guard_system_fields ON public.answers IS
'Pack02 patch: 回答作者可编辑 content，但不可直接改 is_accepted/like_count/status 等系统字段。';

-- ------------------------------------------------------------
-- 3) 修正 answer_count 统计口径（仅 active / accepted）
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.refresh_question_answer_count(p_question_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.questions q
  SET answer_count = (
      SELECT count(*)
      FROM public.answers a
      WHERE a.question_id = p_question_id
        AND a.status IN ('active', 'accepted')
    ),
    updated_at = now()
  WHERE q.id = p_question_id;
END;
$$;

