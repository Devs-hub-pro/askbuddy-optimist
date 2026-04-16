-- Pack 01 历史用户回填脚本（幂等）
-- 用途：
-- - 为已有 auth.users 回填 profiles / user_settings / point_accounts
-- - 不影响新用户 on_auth_user_created_pack01 trigger
--
-- 适用环境：
-- - dev / staging
-- - 生产执行前建议先在 staging 验证

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

-- 可选检查（手动执行）
-- SELECT
--   (SELECT count(*) FROM auth.users) AS auth_users,
--   (SELECT count(*) FROM public.profiles) AS profiles_count,
--   (SELECT count(*) FROM public.user_settings) AS settings_count,
--   (SELECT count(*) FROM public.point_accounts) AS point_accounts_count;

