# 后端一期上线准备清单

> 目标：在不新增 Pack 的前提下，确保一期可冻结、可发布、可回滚。

## A. 环境与配置

- [ ] `SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_DB_PASSWORD` 在 dev/staging/prod 已正确配置。
- [ ] service-role 密钥仅在 server-side/CI 可见，未出现在前端构建产物。
- [ ] 前端 `.env` 与运行环境一致，`test:smoke` 可在标准执行方式下通过。
- [ ] 关键 RPC 调用方权限已确认（仅 service role 的函数无误暴露）。

## B. 迁移与回滚

- [ ] `npx supabase migration list` 本地与远端一致。
- [ ] `npx supabase db push` 在 staging 为 up-to-date。
- [ ] Pack 01~08-B 的关键 patch 已全部应用。
- [ ] 对每个高风险 migration 有回滚方案（至少含“停止写入 + 数据修复 + 回滚脚本”）。
- [ ] backfill 脚本执行记录可追溯（时间、执行人、结果）。

## C. 权限与 service-role RPC

- [ ] `accept_answer_v2`：仅问题作者可采纳，幂等、不可替换已采纳他答。
- [ ] `create_system_notification_v2`：仅 service-role/server-side 可调用。
- [ ] `transition_order_status_v2`：仅 service-role，白名单流转，幂等。
- [ ] owner-only 表（settings/drafts/point_accounts 等）权限抽检通过。
- [ ] 审核/审计/运营配置表未向普通用户泄露。

## D. 主链路回归项

### 用户与资料
- [ ] 注册/登录自动建档（profiles/user_settings/point_accounts）。
- [ ] 历史用户回填后，基础三表无缺口。

### 提问/回答/采纳
- [ ] 发问、草稿、回答、详情读取正常。
- [ ] 采纳链路 RPC 正常且前端直写系统字段被拦截。

### 专家/技能
- [ ] 专家一人一档可用。
- [ ] skill_offers 可见性边界（published vs 非公开）正确。

### 搜索/发现/关注
- [ ] 搜索 v2（内容 + 建议）可用，fallback 正常。
- [ ] follows 主路径正常，Discover/Following 正常。

### 消息/通知
- [ ] 会话成员边界正确，消息可读写，通知 owner-only。
- [ ] 未读数函数符合最小可用预期。

### 订单/积分/收益
- [ ] 订单双边可见，状态流转 RPC 正常。
- [ ] 账务主路径明确：point_accounts + point_transactions + earning_transactions。

### 举报/审核/推荐位
- [ ] content_reports 提交/本人可读正常。
- [ ] moderation_queue/audit_logs 非普通用户不可见。
- [ ] system_configs/recommendation_slots 公开边界符合设计。

## E. legacy 兼容层观察项

- [ ] `user_followers` 是否仅剩兼容层（主路径已切 `follows`）。
- [ ] posts/comments 旧字段 fallback 命中率是否持续下降。
- [ ] `can_read_post` legacy fallback 命中是否可观测。
- [ ] 暂不删除兼容表/兼容触发器，先完成稳定窗口观察。

## F. 文档与交接项

- [ ] Freeze 说明已发布：`backend-phase1-freeze-recommendation.md`
- [ ] 最终验证报告已更新：`backend-phase1-final-validation-report.md`
- [ ] 本清单与 cleanup backlog 已同步到仓库并可追踪。
- [ ] 下一阶段工作边界明确：仅 bugfix/小 patch/小 cleanup。
