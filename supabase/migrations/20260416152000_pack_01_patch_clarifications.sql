-- Pack 01 patch: 小修正收口（边界说明 + 审核写路径说明）
-- 目标：
-- 1) 明确 profiles 公开读取边界（暂保留公开读，避免破坏前端资料读取）
-- 2) 明确 user_verifications 审核写路径由 service role / Edge Function 执行
--
-- 非目标：
-- - 不调整 Pack 01 表结构
-- - 不引入复杂 RBAC
-- - 不实现其他业务域

-- -------------------------------------------------------------------
-- 1) profiles 公开读取边界说明
-- -------------------------------------------------------------------
COMMENT ON TABLE public.profiles IS
'Pack01 临时策略：profiles 允许公开 SELECT 以兼容当前前端公开资料读取。当前表仅应保存公开资料字段（昵称、头像、简介、城市、行业等）。敏感字段后续应迁移到私有表，或通过 public_profiles 视图做字段级公开边界。';

COMMENT ON POLICY "pack01_profiles_public_read" ON public.profiles IS
'临时公开读策略：用于首页/详情的公开资料展示。后续建议改为 public_profiles 视图，缩小公开字段面。';

-- -------------------------------------------------------------------
-- 2) user_verifications 审核写路径说明
-- -------------------------------------------------------------------
COMMENT ON TABLE public.user_verifications IS
'一期审核写路径约定：authenticated 普通用户仅可提交/修改 pending 且未审核记录；审核动作（approved/rejected、reviewer_id、reviewed_at）应由 service role 或 Edge Function 执行。';

COMMENT ON POLICY "pack01_user_verifications_owner_update_pending" ON public.user_verifications IS
'仅允许申请人更新未审核的 pending 记录；不向普通 authenticated 开放审核字段写入。';

