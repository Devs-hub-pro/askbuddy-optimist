# Phase 1 小范围试运行执行清单（Pilot Runbook）

日期：2026-04-22  
阶段：Phase 1 Freeze 后（不新增 Pack / 不扩功能）

## 1. 试运行目标

- 验证 Freeze 基线在真实使用路径下的稳定性。
- 尽早发现会影响上线体验的高优先问题。
- 在不改业务范围的前提下，完成上线前最后一轮风险收敛。

## 2. 试运行范围建议

- 环境：优先 staging；必要时小流量灰度到生产。
- 用户范围：内部测试账号 + 小规模真实用户（白名单）。
- 功能范围：仅一期主链路，不开启新能力。
- 变更范围：仅 bugfix / 小 patch / 小 cleanup。

## 3. 必跑主链路与通过标准

## A. 用户与资料
- 链路：注册/登录 -> 自动建档 -> 资料页/设置页读取与保存。
- 通过标准：
  - profiles/user_settings/point_accounts 自动建档成功。
  - owner-only 数据无越权读写。

## B. 提问 / 回答 / 采纳
- 链路：发问 -> 草稿 -> 回答 -> 采纳。
- 通过标准：
  - `questions/question_drafts/answers` 写读一致。
  - `accept_answer_v2` 满足权限、幂等、不可替换规则。

## C. 专家 / 技能
- 链路：专家详情 -> 技能发布 -> 技能展示。
- 通过标准：
  - experts 一人一档稳定。
  - skill_offers 可见性边界正确（本人全状态、他人仅 published）。

## D. 搜索 / 发现 / 关注
- 链路：首页搜索 -> SearchResults -> Discover/Following。
- 通过标准：
  - `search_app_content_v2` / `get_search_suggestions_v2` 正常。
  - follows 主路径正常，legacy fallback 不影响主链路。

## E. 消息 / 通知
- 链路：会话列表 -> ChatDetail -> 发送消息 -> 通知列表。
- 通过标准：
  - 会话成员边界正确，非成员不可读写。
  - 通知 owner-only；系统通知仅 service-side 写入。

## F. 订单 / 积分 / 收益
- 链路：创建订单 -> 状态流转 -> 订单/收益/积分查看。
- 通过标准：
  - `transition_order_status_v2` 仅白名单流转，非法拒绝、同状态幂等。
  - 账务主路径明确：point_accounts + point_transactions + earning_transactions。

## G. 举报 / 审核 / 推荐位
- 链路：提交举报 -> 后台审核读写 -> 前台读取配置/推荐位。
- 通过标准：
  - content_reports 用户侧权限正确。
  - moderation_queue/audit_logs 不向普通用户暴露。
  - system_configs/recommendation_slots 公开边界符合设计。

## 4. 问题记录方式

- 统一记录模板：
  - 时间
  - 环境（staging/prod pilot）
  - 模块
  - 复现步骤
  - 实际结果/预期结果
  - 日志或截图
  - 分级（Blocker / Non-blocker）
- 分流规则：
  - Blocker：立即进入 bugfix 小补丁流程。
  - Non-blocker：进入 `Phase 1.1 cleanup` 清单。

## 5. 回滚方式

- 数据库：
  - 优先“停止写入 + 小 patch 修复”，谨慎做逆向回滚。
  - 所有 SQL 变更必须可审阅、可回退。
- 应用层：
  - 保留最小 fallback 路径，避免一次性移除兼容逻辑。
- 运维操作：
  - service-role 相关操作仅限指定负责人执行并留痕。

## 6. 每日检查项（Pilot Daily Check）

- `npx supabase migration list`：确认版本未漂移。
- `npx supabase db push`：确认 up-to-date。
- `npm run test:contracts`：通过。
- `npm run test:smoke`：通过。
- 关键 RPC 抽检：
  - accept_answer_v2
  - create_system_notification_v2
  - transition_order_status_v2
- 兼容层观察：
  - user_followers / posts legacy fallback 是否异常命中。
- 问题盘点：
  - 当日新增 Blocker 数
  - 当日新增 Non-blocker 数
  - 关闭率与遗留风险

## 7. 试运行结束判定

满足以下即可进入上线准备下一步：
- 连续 3~5 天无新增 Blocker。
- 主链路通过率稳定。
- Non-blocker 均已排期进 Phase 1.1 cleanup。
- 无需要新增 Pack 的需求。
