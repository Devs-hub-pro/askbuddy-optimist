-- Pack 01 follow-up migration: 历史用户补档（幂等）
-- 目标：
-- - 为已有 auth.users 补齐 profiles / user_settings / point_accounts
-- - 不改业务结构，不重写 Pack 01
-- - 通过 migration 体系统一执行，避免依赖 db execute/db query 的 CLI 差异

BEGIN;

-- 1) 回填 profiles
INSERT INTO public.profiles (user_id, nickname)
SELECT
  u.id AS user_id,
  COALESCE(u.raw_user_meta_data ->> 'nickname', '新用户') AS nickname
FROM auth.users u
ON CONFLICT (user_id) DO NOTHING;

-- 2) 回填 user_settings
INSERT INTO public.user_settings (user_id)
SELECT u.id
FROM auth.users u
ON CONFLICT (user_id) DO NOTHING;

-- 3) 回填 point_accounts
INSERT INTO public.point_accounts (user_id)
SELECT u.id
FROM auth.users u
ON CONFLICT (user_id) DO NOTHING;

COMMIT;
