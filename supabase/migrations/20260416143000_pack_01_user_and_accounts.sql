-- Migration Pack 01: 基础用户域 + 账户域
-- 依据:
-- - docs/backend-phase1-schema-plan.md
-- - docs/backend-phase1-field-dictionary-v1.1.md
-- - docs/backend-phase1-migration-plan.md
--
-- 范围:
-- 1) profiles
-- 2) user_settings
-- 3) user_verifications
-- 4) point_accounts
-- 5) auth.users 关联
-- 6) 必要索引
-- 7) 基础 RLS
-- 8) 基础建档 trigger/function
--
-- 非范围:
-- questions/answers/experts/skill_offers/posts/messages/notifications/orders/point_transactions 业务逻辑

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 统一 updated_at 触发函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 轻量管理员判断（若 user_roles 不存在则返回 false）
CREATE OR REPLACE FUNCTION public.is_admin_user(p_uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_roles_table boolean;
  v_is_admin boolean;
BEGIN
  SELECT to_regclass('public.user_roles') IS NOT NULL INTO has_roles_table;
  IF NOT has_roles_table THEN
    RETURN false;
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = p_uid
      AND ur.role IN ('admin', 'super_admin')
  ) INTO v_is_admin;

  RETURN coalesce(v_is_admin, false);
END;
$$;

-- 1) profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text DEFAULT '新用户',
  avatar_url text,
  bio text,
  city text,
  city_code text,
  gender text,
  school text,
  industry text,
  is_expert boolean NOT NULL DEFAULT false,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_gender_check CHECK (
    gender IS NULL OR gender IN ('male', 'female', 'other', 'unknown')
  )
);

-- 兼容已存在 profiles 的情况（按 v1.1 收口）
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS city_code text,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS school text,
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS is_expert boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 移除 v1.1 已废弃字段（若存在依赖会以 notice 提示，不中断迁移）
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.profiles DROP COLUMN IF EXISTS points_balance;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skip dropping profiles.points_balance due to dependencies: %', SQLERRM;
  END;

  BEGIN
    ALTER TABLE public.profiles DROP COLUMN IF EXISTS latitude;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skip dropping profiles.latitude due to dependencies: %', SQLERRM;
  END;

  BEGIN
    ALTER TABLE public.profiles DROP COLUMN IF EXISTS longitude;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skip dropping profiles.longitude due to dependencies: %', SQLERRM;
  END;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_gender_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_gender_check
      CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'unknown'));
  END IF;
END $$;

-- 尽量切换为 user_id 主键（旧结构可能是 id 主键 + user_id unique）
DO $$
DECLARE
  pk_name text;
BEGIN
  SELECT conname
  INTO pk_name
  FROM pg_constraint
  WHERE conrelid = 'public.profiles'::regclass
    AND contype = 'p';

  IF pk_name IS NOT NULL AND pk_name <> 'profiles_pkey' THEN
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT %I', pk_name);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND contype = 'p'
      AND conname = 'profiles_pkey'
  ) THEN
    BEGIN
      ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (user_id);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Skip forcing profiles.user_id primary key: %', SQLERRM;
    END;
  END IF;
END $$;

-- 2) user_settings
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  push_enabled boolean NOT NULL DEFAULT true,
  notification_enabled boolean NOT NULL DEFAULT true,
  privacy_level text NOT NULL DEFAULT 'public',
  theme_preference text NOT NULL DEFAULT 'system',
  content_preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_settings_privacy_level_check CHECK (
    privacy_level IN ('public', 'friends_only', 'private')
  ),
  CONSTRAINT user_settings_theme_preference_check CHECK (
    theme_preference IN ('system', 'light', 'dark')
  )
);

ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS push_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notification_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS privacy_level text NOT NULL DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS theme_preference text NOT NULL DEFAULT 'system',
  ADD COLUMN IF NOT EXISTS content_preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_settings_privacy_level_check'
      AND conrelid = 'public.user_settings'::regclass
  ) THEN
    ALTER TABLE public.user_settings
      ADD CONSTRAINT user_settings_privacy_level_check
      CHECK (privacy_level IN ('public', 'friends_only', 'private'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_settings_theme_preference_check'
      AND conrelid = 'public.user_settings'::regclass
  ) THEN
    ALTER TABLE public.user_settings
      ADD CONSTRAINT user_settings_theme_preference_check
      CHECK (theme_preference IN ('system', 'light', 'dark'));
  END IF;
END $$;

-- 3) user_verifications
CREATE TABLE IF NOT EXISTS public.user_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verification_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_verifications_type_check CHECK (
    verification_type IN ('talent', 'real_name')
  ),
  CONSTRAINT user_verifications_status_check CHECK (
    status IN ('pending', 'approved', 'rejected')
  )
);

-- 如果历史表 talent_certifications 存在，做一次轻量迁移（幂等）
DO $$
BEGIN
  IF to_regclass('public.talent_certifications') IS NOT NULL THEN
    INSERT INTO public.user_verifications (
      id,
      user_id,
      verification_type,
      status,
      submitted_at,
      reviewed_at,
      reviewer_id,
      notes,
      created_at,
      updated_at
    )
    SELECT
      tc.id,
      tc.user_id,
      CASE
        WHEN tc.cert_type IN ('education', 'profession', 'skill') THEN 'talent'
        ELSE 'talent'
      END,
      CASE
        WHEN tc.status IN ('pending', 'approved', 'rejected') THEN tc.status
        ELSE 'pending'
      END,
      COALESCE(tc.created_at, now()),
      tc.reviewed_at,
      tc.reviewed_by,
      tc.details::text,
      COALESCE(tc.created_at, now()),
      COALESCE(tc.updated_at, now())
    FROM public.talent_certifications tc
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- 限制同一用户同一类型在 pending/approved 只能保留一条
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_verifications_user_type_active
  ON public.user_verifications(user_id, verification_type)
  WHERE status IN ('pending', 'approved');

-- 4) point_accounts
CREATE TABLE IF NOT EXISTS public.point_accounts (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  available_balance integer NOT NULL DEFAULT 0,
  frozen_balance integer NOT NULL DEFAULT 0,
  total_earned integer NOT NULL DEFAULT 0,
  total_spent integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT point_accounts_available_non_negative CHECK (available_balance >= 0),
  CONSTRAINT point_accounts_frozen_non_negative CHECK (frozen_balance >= 0),
  CONSTRAINT point_accounts_total_earned_non_negative CHECK (total_earned >= 0),
  CONSTRAINT point_accounts_total_spent_non_negative CHECK (total_spent >= 0)
);

ALTER TABLE public.point_accounts
  ADD COLUMN IF NOT EXISTS available_balance integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS frozen_balance integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_earned integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_spent integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'point_accounts_available_non_negative'
      AND conrelid = 'public.point_accounts'::regclass
  ) THEN
    ALTER TABLE public.point_accounts
      ADD CONSTRAINT point_accounts_available_non_negative CHECK (available_balance >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'point_accounts_frozen_non_negative'
      AND conrelid = 'public.point_accounts'::regclass
  ) THEN
    ALTER TABLE public.point_accounts
      ADD CONSTRAINT point_accounts_frozen_non_negative CHECK (frozen_balance >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'point_accounts_total_earned_non_negative'
      AND conrelid = 'public.point_accounts'::regclass
  ) THEN
    ALTER TABLE public.point_accounts
      ADD CONSTRAINT point_accounts_total_earned_non_negative CHECK (total_earned >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'point_accounts_total_spent_non_negative'
      AND conrelid = 'public.point_accounts'::regclass
  ) THEN
    ALTER TABLE public.point_accounts
      ADD CONSTRAINT point_accounts_total_spent_non_negative CHECK (total_spent >= 0);
  END IF;
END $$;

-- 索引（克制）
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_city_code ON public.profiles(city_code);
CREATE INDEX IF NOT EXISTS idx_profiles_is_expert ON public.profiles(is_expert);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_settings_privacy_level ON public.user_settings(privacy_level);

CREATE INDEX IF NOT EXISTS idx_user_verifications_user_status
  ON public.user_verifications(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_verifications_status_submitted
  ON public.user_verifications(status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_verifications_reviewer
  ON public.user_verifications(reviewer_id);

CREATE INDEX IF NOT EXISTS idx_point_accounts_updated_at ON public.point_accounts(updated_at DESC);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_accounts ENABLE ROW LEVEL SECURITY;

-- profiles: 公开读 + 仅本人可写
DROP POLICY IF EXISTS "pack01_profiles_public_read" ON public.profiles;
CREATE POLICY "pack01_profiles_public_read"
  ON public.profiles
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "pack01_profiles_owner_insert" ON public.profiles;
CREATE POLICY "pack01_profiles_owner_insert"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack01_profiles_owner_update" ON public.profiles;
CREATE POLICY "pack01_profiles_owner_update"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_settings: owner-only
DROP POLICY IF EXISTS "pack01_user_settings_owner_select" ON public.user_settings;
CREATE POLICY "pack01_user_settings_owner_select"
  ON public.user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack01_user_settings_owner_insert" ON public.user_settings;
CREATE POLICY "pack01_user_settings_owner_insert"
  ON public.user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack01_user_settings_owner_update" ON public.user_settings;
CREATE POLICY "pack01_user_settings_owner_update"
  ON public.user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack01_user_settings_owner_delete" ON public.user_settings;
CREATE POLICY "pack01_user_settings_owner_delete"
  ON public.user_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- user_verifications:
-- - 用户可查看自己的认证记录
-- - 用户可提交认证申请
-- - 普通用户可在 pending 且未审核前修改说明
-- - 审核字段更新预留给 service role / admin（不向普通 authenticated 开放）
DROP POLICY IF EXISTS "pack01_user_verifications_owner_select" ON public.user_verifications;
CREATE POLICY "pack01_user_verifications_owner_select"
  ON public.user_verifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack01_user_verifications_owner_insert" ON public.user_verifications;
CREATE POLICY "pack01_user_verifications_owner_insert"
  ON public.user_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND reviewer_id IS NULL
    AND reviewed_at IS NULL
  );

DROP POLICY IF EXISTS "pack01_user_verifications_owner_update_pending" ON public.user_verifications;
CREATE POLICY "pack01_user_verifications_owner_update_pending"
  ON public.user_verifications
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    AND status = 'pending'
    AND reviewer_id IS NULL
    AND reviewed_at IS NULL
  )
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND reviewer_id IS NULL
    AND reviewed_at IS NULL
  );

-- point_accounts: owner-only read; 普通用户不直接写账户余额
DROP POLICY IF EXISTS "pack01_point_accounts_owner_select" ON public.point_accounts;
CREATE POLICY "pack01_point_accounts_owner_select"
  ON public.point_accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- updated_at triggers
DROP TRIGGER IF EXISTS trg_profiles_updated_at_pack01 ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at_pack01
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_user_settings_updated_at_pack01 ON public.user_settings;
CREATE TRIGGER trg_user_settings_updated_at_pack01
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_user_verifications_updated_at_pack01 ON public.user_verifications;
CREATE TRIGGER trg_user_verifications_updated_at_pack01
  BEFORE UPDATE ON public.user_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_point_accounts_updated_at_pack01 ON public.point_accounts;
CREATE TRIGGER trg_point_accounts_updated_at_pack01
  BEFORE UPDATE ON public.point_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 新用户建档函数（仅建档，不做业务逻辑）
CREATE OR REPLACE FUNCTION public.handle_new_user_pack01()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nickname text;
BEGIN
  v_nickname := COALESCE(NEW.raw_user_meta_data ->> 'nickname', '新用户');

  INSERT INTO public.profiles (
    user_id,
    nickname
  )
  VALUES (
    NEW.id,
    v_nickname
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.point_accounts (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 替换旧建档触发器，避免并发重复建档
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_pack01 ON auth.users;

CREATE TRIGGER on_auth_user_created_pack01
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_pack01();

