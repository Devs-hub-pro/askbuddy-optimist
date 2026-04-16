-- Migration Pack 02: 提问 / 草稿 / 回答主链路
-- 依据:
-- - docs/backend-phase1-schema-plan.md
-- - docs/backend-phase1-field-dictionary-v1.1.md
-- - docs/backend-phase1-migration-plan.md
--
-- 范围:
-- 1) questions
-- 2) question_drafts
-- 3) answers
-- 4) question_tags (最小版本: text 标签关系表)
-- 5) 必要索引
-- 6) 基础 RLS
-- 7) 轻量 trigger/function (updated_at / answer_count / accepted_answer 校验)
--
-- 非范围:
-- experts/skill_offers/posts/follows/messages/notifications/orders/point_transactions
-- 复杂推荐排序、Edge Functions、复杂审核流、奖励结算逻辑

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 复用 Pack 01 的 updated_at 触发函数；若不存在则创建
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'update_updated_at_column'
      AND n.nspname = 'public'
  ) THEN
    EXECUTE $fn$
      CREATE FUNCTION public.update_updated_at_column()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $inner$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $inner$;
    $fn$;
  END IF;
END $$;

-- 1) questions
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category_slug text, -- 一期轻量类目方案，暂不建 category 表
  city text,
  city_code text,
  reward_points integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open',
  accepted_answer_id uuid,
  answer_count integer NOT NULL DEFAULT 0,
  favorite_count integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT questions_reward_points_non_negative CHECK (reward_points >= 0),
  CONSTRAINT questions_answer_count_non_negative CHECK (answer_count >= 0),
  CONSTRAINT questions_favorite_count_non_negative CHECK (favorite_count >= 0),
  CONSTRAINT questions_view_count_non_negative CHECK (view_count >= 0),
  CONSTRAINT questions_status_check CHECK (status IN ('draft', 'open', 'matched', 'solved', 'closed', 'hidden'))
);

-- 兼容历史结构（常见旧字段: user_id/content/category/bounty_points）
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS category_slug text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS city_code text,
  ADD COLUMN IF NOT EXISTS reward_points integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS accepted_answer_id uuid,
  ADD COLUMN IF NOT EXISTS answer_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS favorite_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 回填 author_id / description / reward_points
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'questions'
      AND column_name = 'user_id'
  ) THEN
    EXECUTE '
      UPDATE public.questions
      SET author_id = user_id
      WHERE author_id IS NULL AND user_id IS NOT NULL
    ';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'questions'
      AND column_name = 'content'
  ) THEN
    EXECUTE '
      UPDATE public.questions
      SET description = content
      WHERE description IS NULL AND content IS NOT NULL
    ';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'questions'
      AND column_name = 'bounty_points'
  ) THEN
    EXECUTE '
      UPDATE public.questions
      SET reward_points = bounty_points
      WHERE reward_points = 0 AND bounty_points IS NOT NULL
    ';
  END IF;
END $$;

ALTER TABLE public.questions
  ALTER COLUMN author_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'questions_status_check'
      AND conrelid = 'public.questions'::regclass
  ) THEN
    ALTER TABLE public.questions
      ADD CONSTRAINT questions_status_check
      CHECK (status IN ('draft', 'open', 'matched', 'solved', 'closed', 'hidden'));
  END IF;
END $$;

-- 2) question_drafts
CREATE TABLE IF NOT EXISTS public.question_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  description text,
  city text,
  city_code text,
  reward_points integer NOT NULL DEFAULT 0,
  draft_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT question_drafts_reward_points_non_negative CHECK (reward_points >= 0)
);

-- 历史 drafts 迁移到 question_drafts（幂等）
DO $$
BEGIN
  IF to_regclass('public.drafts') IS NOT NULL THEN
    INSERT INTO public.question_drafts (
      id,
      author_id,
      title,
      description,
      reward_points,
      draft_payload,
      created_at,
      updated_at
    )
    SELECT
      d.id,
      d.user_id,
      d.title,
      d.content,
      COALESCE(d.bounty_points, 0),
      jsonb_build_object(
        'category', d.category,
        'tags', d.tags
      ),
      COALESCE(d.created_at, now()),
      COALESCE(d.updated_at, now())
    FROM public.drafts d
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- 3) answers
CREATE TABLE IF NOT EXISTS public.answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  is_accepted boolean NOT NULL DEFAULT false,
  like_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT answers_like_count_non_negative CHECK (like_count >= 0),
  CONSTRAINT answers_status_check CHECK (status IN ('active', 'accepted', 'hidden', 'rejected'))
);

ALTER TABLE public.answers
  ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS like_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_accepted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'answers'
      AND column_name = 'user_id'
  ) THEN
    EXECUTE '
      UPDATE public.answers
      SET author_id = user_id
      WHERE author_id IS NULL AND user_id IS NOT NULL
    ';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'answers'
      AND column_name = 'likes_count'
  ) THEN
    EXECUTE '
      UPDATE public.answers
      SET like_count = likes_count
      WHERE like_count = 0 AND likes_count IS NOT NULL
    ';
  END IF;
END $$;

ALTER TABLE public.answers
  ALTER COLUMN author_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'answers_status_check'
      AND conrelid = 'public.answers'::regclass
  ) THEN
    ALTER TABLE public.answers
      ADD CONSTRAINT answers_status_check
      CHECK (status IN ('active', 'accepted', 'hidden', 'rejected'));
  END IF;
END $$;

-- questions.accepted_answer_id 外键（延迟校验，兼容历史数据）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'questions_accepted_answer_id_fkey'
      AND conrelid = 'public.questions'::regclass
  ) THEN
    ALTER TABLE public.questions
      ADD CONSTRAINT questions_accepted_answer_id_fkey
      FOREIGN KEY (accepted_answer_id) REFERENCES public.answers(id)
      ON DELETE SET NULL NOT VALID;
  END IF;
END $$;

-- 4) question_tags（最小版本，方案 B：文本标签关系表）
CREATE TABLE IF NOT EXISTS public.question_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT question_tags_tag_not_blank CHECK (length(trim(tag)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_question_tags_question_tag_unique
  ON public.question_tags(question_id, lower(tag));

-- 从历史 questions.tags[] 回填到 question_tags（幂等）
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'questions'
      AND column_name = 'tags'
  ) THEN
    INSERT INTO public.question_tags (question_id, tag, created_by)
    SELECT
      q.id,
      trim(t.tag_text),
      q.author_id
    FROM public.questions q
    CROSS JOIN LATERAL unnest(q.tags) AS t(tag_text)
    WHERE trim(t.tag_text) <> ''
    ON CONFLICT (question_id, lower(tag)) DO NOTHING;
  END IF;
END $$;

-- 索引（按主查询场景，克制）
CREATE INDEX IF NOT EXISTS idx_questions_author_created
  ON public.questions(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_status_created
  ON public.questions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_city_status_created
  ON public.questions(city_code, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_created
  ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_title_trgm
  ON public.questions USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_questions_description_trgm
  ON public.questions USING gin (description gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_question_drafts_author_updated
  ON public.question_drafts(author_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_answers_question_created
  ON public.answers(question_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_answers_author_created
  ON public.answers(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_question_status_accepted
  ON public.answers(question_id, status, is_accepted);

CREATE INDEX IF NOT EXISTS idx_question_tags_question
  ON public.question_tags(question_id);
CREATE INDEX IF NOT EXISTS idx_question_tags_tag
  ON public.question_tags(lower(tag));

-- 轻量触发函数：维护 questions.answer_count
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
        AND a.status <> 'rejected'
    ),
    updated_at = now()
  WHERE q.id = p_question_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_answers_sync_question_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.refresh_question_answer_count(NEW.question_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.refresh_question_answer_count(OLD.question_id);
    RETURN OLD;
  ELSE
    IF NEW.question_id <> OLD.question_id THEN
      PERFORM public.refresh_question_answer_count(OLD.question_id);
      PERFORM public.refresh_question_answer_count(NEW.question_id);
    ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
      PERFORM public.refresh_question_answer_count(NEW.question_id);
    END IF;
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_answers_sync_question_count ON public.answers;
CREATE TRIGGER trg_answers_sync_question_count
  AFTER INSERT OR UPDATE OR DELETE ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_answers_sync_question_count();

-- 轻量 accepted_answer 校验：确保采纳答案属于该问题
CREATE OR REPLACE FUNCTION public.trg_questions_validate_accepted_answer()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.accepted_answer_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.answers a
      WHERE a.id = NEW.accepted_answer_id
        AND a.question_id = NEW.id
    ) THEN
      RAISE EXCEPTION 'accepted_answer_id does not belong to this question';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_questions_validate_accepted_answer ON public.questions;
CREATE TRIGGER trg_questions_validate_accepted_answer
  BEFORE INSERT OR UPDATE OF accepted_answer_id ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_questions_validate_accepted_answer();

-- updated_at 触发器
DROP TRIGGER IF EXISTS trg_questions_updated_at_pack02 ON public.questions;
CREATE TRIGGER trg_questions_updated_at_pack02
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_question_drafts_updated_at_pack02 ON public.question_drafts;
CREATE TRIGGER trg_question_drafts_updated_at_pack02
  BEFORE UPDATE ON public.question_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_answers_updated_at_pack02 ON public.answers;
CREATE TRIGGER trg_answers_updated_at_pack02
  BEFORE UPDATE ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_tags ENABLE ROW LEVEL SECURITY;

-- questions: 公开读 + 作者可写
DROP POLICY IF EXISTS "pack02_questions_public_read" ON public.questions;
CREATE POLICY "pack02_questions_public_read"
  ON public.questions
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "pack02_questions_owner_insert" ON public.questions;
CREATE POLICY "pack02_questions_owner_insert"
  ON public.questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "pack02_questions_owner_update" ON public.questions;
CREATE POLICY "pack02_questions_owner_update"
  ON public.questions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "pack02_questions_owner_delete" ON public.questions;
CREATE POLICY "pack02_questions_owner_delete"
  ON public.questions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- question_drafts: owner-only
DROP POLICY IF EXISTS "pack02_question_drafts_owner_select" ON public.question_drafts;
CREATE POLICY "pack02_question_drafts_owner_select"
  ON public.question_drafts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "pack02_question_drafts_owner_insert" ON public.question_drafts;
CREATE POLICY "pack02_question_drafts_owner_insert"
  ON public.question_drafts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "pack02_question_drafts_owner_update" ON public.question_drafts;
CREATE POLICY "pack02_question_drafts_owner_update"
  ON public.question_drafts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "pack02_question_drafts_owner_delete" ON public.question_drafts;
CREATE POLICY "pack02_question_drafts_owner_delete"
  ON public.question_drafts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- answers: 公开读 + 作者可写
DROP POLICY IF EXISTS "pack02_answers_public_read" ON public.answers;
CREATE POLICY "pack02_answers_public_read"
  ON public.answers
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "pack02_answers_owner_insert" ON public.answers;
CREATE POLICY "pack02_answers_owner_insert"
  ON public.answers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "pack02_answers_owner_update" ON public.answers;
CREATE POLICY "pack02_answers_owner_update"
  ON public.answers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "pack02_answers_owner_delete" ON public.answers;
CREATE POLICY "pack02_answers_owner_delete"
  ON public.answers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- question_tags: 公开读；提问者可管理自己的问题标签
DROP POLICY IF EXISTS "pack02_question_tags_public_read" ON public.question_tags;
CREATE POLICY "pack02_question_tags_public_read"
  ON public.question_tags
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "pack02_question_tags_owner_insert" ON public.question_tags;
CREATE POLICY "pack02_question_tags_owner_insert"
  ON public.question_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.questions q
      WHERE q.id = question_id
        AND q.author_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "pack02_question_tags_owner_delete" ON public.question_tags;
CREATE POLICY "pack02_question_tags_owner_delete"
  ON public.question_tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.questions q
      WHERE q.id = question_id
        AND q.author_id = auth.uid()
    )
  );

-- 注释：accepted_answer_id 的最终写权限建议后续收敛到专门函数/service role
COMMENT ON COLUMN public.questions.accepted_answer_id IS
'Pack02 预留字段：当前仅做轻量校验。后续建议通过专门采纳函数（提问者权限 + 奖励结算）更新，避免普通 UPDATE 误改。';

