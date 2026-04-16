-- Pack 03 patch: 执行前小修正（category 写权限路径收口 + 一人一档说明）
-- 目标：
-- 1) skill_categories 不再硬依赖 is_admin_user() 才可写
-- 2) 一期明确采用 service role / migration / seed 写入 categories
-- 3) experts 明确一人一档语义（user_id 唯一）

-- ------------------------------------------------------------
-- 1) skill_categories 写权限收口
--    保留公开读；移除 authenticated 下的 admin 写策略
--    一期写操作由 service role / migration / seed 执行（service role 默认可绕过 RLS）
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "pack03_skill_categories_admin_insert" ON public.skill_categories;
DROP POLICY IF EXISTS "pack03_skill_categories_admin_update" ON public.skill_categories;
DROP POLICY IF EXISTS "pack03_skill_categories_admin_delete" ON public.skill_categories;

COMMENT ON TABLE public.skill_categories IS
'Pack03 一期策略：categories 对业务端公开只读；写入由 service role / migration / seed 管理，不依赖前台 authenticated 管理写路径。';

-- ------------------------------------------------------------
-- 2) experts 一人一档（最终一期约束）
-- ------------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS idx_experts_user_unique ON public.experts(user_id);

COMMENT ON TABLE public.experts IS
'Pack03 一期最终约束：一用户一专家档案（user_id unique）。如历史环境存在重复数据，需先清洗后再执行相关唯一性强约束。';

