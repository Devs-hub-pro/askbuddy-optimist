-- Migration Pack 03: 专家域 / 技能发布域
-- 依据:
-- - docs/backend-phase1-schema-plan.md
-- - docs/backend-phase1-field-dictionary-v1.1.md
-- - docs/backend-phase1-migration-plan.md
--
-- 范围:
-- 1) experts
-- 2) skill_categories
-- 3) skill_offers
-- 4) expert_followers (最小版本)
-- 5) 必要索引
-- 6) 基础 RLS
-- 7) 轻量 trigger/function (updated_at / follower_count / service_count / 系统字段保护)
--
-- 非范围:
-- expert_tags（本期延后，避免过度设计）
-- 复杂评价体系、复杂套餐/SKU、复杂审核流、订单/支付/收益联动、推荐排序、Edge Functions

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 复用 Pack 01 的通用函数；不存在时兜底创建
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'is_admin_user'
      AND n.nspname = 'public'
  ) THEN
    EXECUTE $fn$
      CREATE FUNCTION public.is_admin_user(p_uid uuid DEFAULT auth.uid())
      RETURNS boolean
      LANGUAGE plpgsql
      STABLE
      SECURITY DEFINER
      SET search_path = public
      AS $inner$
      BEGIN
        RETURN false;
      END;
      $inner$;
    $fn$;
  END IF;
END $$;

-- 1) experts
-- 说明：为兼容历史迁移，保留 id 主键；通过 user_id unique 保证“一用户一专家扩展档案”
CREATE TABLE IF NOT EXISTS public.experts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  headline text,
  intro text,
  expertise_summary text,
  verification_status text NOT NULL DEFAULT 'unverified',
  profile_status text NOT NULL DEFAULT 'active',
  answer_count integer NOT NULL DEFAULT 0,
  follower_count integer NOT NULL DEFAULT 0,
  service_count integer NOT NULL DEFAULT 0,
  response_rate numeric(5,2),
  response_time_label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT experts_verification_status_check CHECK (
    verification_status IN ('unverified', 'pending', 'verified', 'rejected')
  ),
  CONSTRAINT experts_profile_status_check CHECK (
    profile_status IN ('active', 'inactive')
  ),
  CONSTRAINT experts_answer_count_non_negative CHECK (answer_count >= 0),
  CONSTRAINT experts_follower_count_non_negative CHECK (follower_count >= 0),
  CONSTRAINT experts_service_count_non_negative CHECK (service_count >= 0),
  CONSTRAINT experts_response_rate_non_negative CHECK (
    response_rate IS NULL OR response_rate >= 0
  )
);

-- 历史 experts 表兼容收口
ALTER TABLE public.experts
  ADD COLUMN IF NOT EXISTS headline text,
  ADD COLUMN IF NOT EXISTS intro text,
  ADD COLUMN IF NOT EXISTS expertise_summary text,
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS profile_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS answer_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS follower_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS service_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS response_rate numeric(5,2),
  ADD COLUMN IF NOT EXISTS response_time_label text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'experts'
      AND column_name = 'title'
  ) THEN
    EXECUTE '
      UPDATE public.experts
      SET headline = COALESCE(headline, title)
      WHERE headline IS NULL
    ';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'experts'
      AND column_name = 'bio'
  ) THEN
    EXECUTE '
      UPDATE public.experts
      SET intro = COALESCE(intro, bio)
      WHERE intro IS NULL
    ';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'experts'
      AND column_name = 'is_verified'
  ) THEN
    EXECUTE '
      UPDATE public.experts
      SET verification_status =
        CASE
          WHEN is_verified = true THEN ''verified''
          ELSE verification_status
        END
      WHERE verification_status = ''unverified''
    ';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'experts'
      AND column_name = 'is_active'
  ) THEN
    EXECUTE '
      UPDATE public.experts
      SET profile_status =
        CASE
          WHEN is_active = false THEN ''inactive''
          ELSE profile_status
        END
      WHERE profile_status = ''active''
    ';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'experts_verification_status_check'
      AND conrelid = 'public.experts'::regclass
  ) THEN
    ALTER TABLE public.experts
      ADD CONSTRAINT experts_verification_status_check
      CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'experts_profile_status_check'
      AND conrelid = 'public.experts'::regclass
  ) THEN
    ALTER TABLE public.experts
      ADD CONSTRAINT experts_profile_status_check
      CHECK (profile_status IN ('active', 'inactive'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_experts_user_unique ON public.experts(user_id);

-- 2) skill_categories（一期轻量，一层或可选 parent_id）
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  parent_id uuid REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.skill_categories
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 3) skill_offers（最小可用）
CREATE TABLE IF NOT EXISTS public.skill_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid NOT NULL REFERENCES public.experts(user_id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  pricing_mode text NOT NULL DEFAULT 'per_session',
  price_amount numeric(12,2),
  price_currency text NOT NULL DEFAULT 'CNY',
  status text NOT NULL DEFAULT 'draft',
  city text,
  city_code text,
  is_remote_supported boolean NOT NULL DEFAULT true,
  delivery_mode text NOT NULL DEFAULT 'online',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT skill_offers_pricing_mode_check CHECK (
    pricing_mode IN ('per_question', 'per_session', 'per_hour', 'negotiable')
  ),
  CONSTRAINT skill_offers_status_check CHECK (
    status IN ('draft', 'pending_review', 'published', 'offline')
  ),
  CONSTRAINT skill_offers_delivery_mode_check CHECK (
    delivery_mode IN ('online', 'offline', 'hybrid')
  ),
  CONSTRAINT skill_offers_price_amount_non_negative CHECK (
    price_amount IS NULL OR price_amount >= 0
  )
);

ALTER TABLE public.skill_offers
  ADD COLUMN IF NOT EXISTS expert_id uuid REFERENCES public.experts(user_id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pricing_mode text NOT NULL DEFAULT 'per_session',
  ADD COLUMN IF NOT EXISTS price_amount numeric(12,2),
  ADD COLUMN IF NOT EXISTS price_currency text NOT NULL DEFAULT 'CNY',
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS city_code text,
  ADD COLUMN IF NOT EXISTS is_remote_supported boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS delivery_mode text NOT NULL DEFAULT 'online',
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'skill_offers_pricing_mode_check'
      AND conrelid = 'public.skill_offers'::regclass
  ) THEN
    ALTER TABLE public.skill_offers
      ADD CONSTRAINT skill_offers_pricing_mode_check
      CHECK (pricing_mode IN ('per_question', 'per_session', 'per_hour', 'negotiable'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'skill_offers_status_check'
      AND conrelid = 'public.skill_offers'::regclass
  ) THEN
    ALTER TABLE public.skill_offers
      ADD CONSTRAINT skill_offers_status_check
      CHECK (status IN ('draft', 'pending_review', 'published', 'offline'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'skill_offers_delivery_mode_check'
      AND conrelid = 'public.skill_offers'::regclass
  ) THEN
    ALTER TABLE public.skill_offers
      ADD CONSTRAINT skill_offers_delivery_mode_check
      CHECK (delivery_mode IN ('online', 'offline', 'hybrid'));
  END IF;
END $$;

-- 4) expert_followers（最小版本）
CREATE TABLE IF NOT EXISTS public.expert_followers (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expert_id uuid NOT NULL REFERENCES public.experts(user_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, expert_id),
  CONSTRAINT expert_followers_self_follow_check CHECK (user_id <> expert_id)
);

-- 索引（克制）
CREATE INDEX IF NOT EXISTS idx_experts_verification_status
  ON public.experts(verification_status);
CREATE INDEX IF NOT EXISTS idx_experts_updated_at
  ON public.experts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_experts_created_at
  ON public.experts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experts_headline_trgm
  ON public.experts USING gin (headline gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_experts_intro_trgm
  ON public.experts USING gin (intro gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_skill_categories_active_sort
  ON public.skill_categories(is_active, sort_order ASC);

CREATE INDEX IF NOT EXISTS idx_skill_offers_expert_status_created
  ON public.skill_offers(expert_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_offers_category_status_created
  ON public.skill_offers(category_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_offers_city_status_created
  ON public.skill_offers(city_code, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_offers_status_created
  ON public.skill_offers(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_offers_title_trgm
  ON public.skill_offers USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_skill_offers_description_trgm
  ON public.skill_offers USING gin (description gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_expert_followers_expert
  ON public.expert_followers(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_followers_user
  ON public.expert_followers(user_id);

-- RLS
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_followers ENABLE ROW LEVEL SECURITY;

-- experts: 公开读活跃档案 + 本人可读写自己的专家档案
DROP POLICY IF EXISTS "pack03_experts_public_read" ON public.experts;
CREATE POLICY "pack03_experts_public_read"
  ON public.experts
  FOR SELECT
  USING (profile_status = 'active');

DROP POLICY IF EXISTS "pack03_experts_owner_select_all" ON public.experts;
CREATE POLICY "pack03_experts_owner_select_all"
  ON public.experts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack03_experts_owner_insert" ON public.experts;
CREATE POLICY "pack03_experts_owner_insert"
  ON public.experts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack03_experts_owner_update" ON public.experts;
CREATE POLICY "pack03_experts_owner_update"
  ON public.experts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- skill_categories: 公开读；仅 admin / service role 管理
DROP POLICY IF EXISTS "pack03_skill_categories_public_read" ON public.skill_categories;
CREATE POLICY "pack03_skill_categories_public_read"
  ON public.skill_categories
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "pack03_skill_categories_admin_insert" ON public.skill_categories;
CREATE POLICY "pack03_skill_categories_admin_insert"
  ON public.skill_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "pack03_skill_categories_admin_update" ON public.skill_categories;
CREATE POLICY "pack03_skill_categories_admin_update"
  ON public.skill_categories
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "pack03_skill_categories_admin_delete" ON public.skill_categories;
CREATE POLICY "pack03_skill_categories_admin_delete"
  ON public.skill_categories
  FOR DELETE
  TO authenticated
  USING (public.is_admin_user(auth.uid()));

-- skill_offers: 公开读 published；本人可读写自己的全部状态
DROP POLICY IF EXISTS "pack03_skill_offers_public_read" ON public.skill_offers;
CREATE POLICY "pack03_skill_offers_public_read"
  ON public.skill_offers
  FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "pack03_skill_offers_owner_select_all" ON public.skill_offers;
CREATE POLICY "pack03_skill_offers_owner_select_all"
  ON public.skill_offers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = expert_id);

DROP POLICY IF EXISTS "pack03_skill_offers_owner_insert" ON public.skill_offers;
CREATE POLICY "pack03_skill_offers_owner_insert"
  ON public.skill_offers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = expert_id);

DROP POLICY IF EXISTS "pack03_skill_offers_owner_update" ON public.skill_offers;
CREATE POLICY "pack03_skill_offers_owner_update"
  ON public.skill_offers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = expert_id)
  WITH CHECK (auth.uid() = expert_id);

DROP POLICY IF EXISTS "pack03_skill_offers_owner_delete" ON public.skill_offers;
CREATE POLICY "pack03_skill_offers_owner_delete"
  ON public.skill_offers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = expert_id);

-- expert_followers: 本人可读自己的关注，可关注/取关
DROP POLICY IF EXISTS "pack03_expert_followers_owner_select" ON public.expert_followers;
CREATE POLICY "pack03_expert_followers_owner_select"
  ON public.expert_followers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack03_expert_followers_owner_insert" ON public.expert_followers;
CREATE POLICY "pack03_expert_followers_owner_insert"
  ON public.expert_followers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack03_expert_followers_owner_delete" ON public.expert_followers;
CREATE POLICY "pack03_expert_followers_owner_delete"
  ON public.expert_followers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 系统字段保护（避免普通用户直接改审核/计数字段）
CREATE OR REPLACE FUNCTION public.trg_experts_guard_system_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NOT NULL AND v_uid = OLD.user_id THEN
    IF NEW.verification_status IS DISTINCT FROM OLD.verification_status
      OR NEW.answer_count IS DISTINCT FROM OLD.answer_count
      OR NEW.follower_count IS DISTINCT FROM OLD.follower_count
      OR NEW.service_count IS DISTINCT FROM OLD.service_count
      OR NEW.response_rate IS DISTINCT FROM OLD.response_rate
      OR NEW.user_id IS DISTINCT FROM OLD.user_id
      OR NEW.id IS DISTINCT FROM OLD.id
      OR NEW.created_at IS DISTINCT FROM OLD.created_at
    THEN
      RAISE EXCEPTION 'system-managed fields are not editable directly';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_experts_guard_system_fields ON public.experts;
CREATE TRIGGER trg_experts_guard_system_fields
  BEFORE UPDATE ON public.experts
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_experts_guard_system_fields();

-- 轻量计数维护：service_count（统计 published 技能数）
CREATE OR REPLACE FUNCTION public.refresh_expert_service_count(p_expert_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.experts e
  SET service_count = (
      SELECT count(*)
      FROM public.skill_offers s
      WHERE s.expert_id = p_expert_id
        AND s.status = 'published'
    ),
    updated_at = now()
  WHERE e.user_id = p_expert_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_skill_offers_sync_service_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.refresh_expert_service_count(NEW.expert_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.refresh_expert_service_count(OLD.expert_id);
    RETURN OLD;
  ELSE
    IF NEW.expert_id <> OLD.expert_id THEN
      PERFORM public.refresh_expert_service_count(OLD.expert_id);
      PERFORM public.refresh_expert_service_count(NEW.expert_id);
    ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
      PERFORM public.refresh_expert_service_count(NEW.expert_id);
    END IF;
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_skill_offers_sync_service_count ON public.skill_offers;
CREATE TRIGGER trg_skill_offers_sync_service_count
  AFTER INSERT OR UPDATE OR DELETE ON public.skill_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_skill_offers_sync_service_count();

-- 轻量计数维护：follower_count（统计关注数）
CREATE OR REPLACE FUNCTION public.refresh_expert_follower_count(p_expert_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.experts e
  SET follower_count = (
      SELECT count(*)
      FROM public.expert_followers f
      WHERE f.expert_id = p_expert_id
    ),
    updated_at = now()
  WHERE e.user_id = p_expert_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_expert_followers_sync_follower_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.refresh_expert_follower_count(NEW.expert_id);
    RETURN NEW;
  ELSE
    PERFORM public.refresh_expert_follower_count(OLD.expert_id);
    RETURN OLD;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_expert_followers_sync_follower_count ON public.expert_followers;
CREATE TRIGGER trg_expert_followers_sync_follower_count
  AFTER INSERT OR DELETE ON public.expert_followers
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_expert_followers_sync_follower_count();

-- updated_at triggers
DROP TRIGGER IF EXISTS trg_experts_updated_at_pack03 ON public.experts;
CREATE TRIGGER trg_experts_updated_at_pack03
  BEFORE UPDATE ON public.experts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_skill_categories_updated_at_pack03 ON public.skill_categories;
CREATE TRIGGER trg_skill_categories_updated_at_pack03
  BEFORE UPDATE ON public.skill_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_skill_offers_updated_at_pack03 ON public.skill_offers;
CREATE TRIGGER trg_skill_offers_updated_at_pack03
  BEFORE UPDATE ON public.skill_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.experts IS
'Pack03: 专家扩展档案。与 profiles 组成“基础公开资料 + 专家扩展信息”双层模型。verification_status 建议由 admin/service role 控制。';

COMMENT ON TABLE public.skill_offers IS
'Pack03: 最小可用技能供给表。仅支撑发布与展示，不含复杂套餐/交易流程。';

COMMENT ON TABLE public.expert_followers IS
'Pack03: 专家关注关系最小表，用于关注状态与 follower_count 统计。';

