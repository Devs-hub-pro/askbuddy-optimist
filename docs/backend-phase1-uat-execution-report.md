# Phase 1 UAT / Launch Readiness 执行报告

日期：2026-04-22  
范围：Pack 01 ~ Pack 08-B（Freeze 后执行验证）  
约束：不新增 Pack，不扩展功能

## 1) 已执行项（按 runbook 顺序）

## A. 环境与配置检查
- 已确认环境分层目标清晰：dev / staging / prod 分离。
- 已确认本地存在 `.env`，且未检出占位符文本（如 `YOUR_` / `REPLACE_ME`）。
- 已确认 service-role 路径在 runbook 与 checklist 中有明确约束说明。
- 已确认迁移基线与回滚注意事项文档化。

结果：**通过**

## B. 必跑命令

执行记录：
1. `npx supabase migration list` ✅  
   - 本地/远端版本一致，包含至 `20260422100000_pack_08b_search_v2_unify.sql`
2. `npx supabase db push` ✅  
   - 远端状态：`Remote database is up to date.`
3. `npm run test:contracts` ✅  
   - `Schema contract check passed.`
4. `npm run test:smoke` ✅  
   - `RPC smoke tests passed.`（使用真实环境变量注入）

结果：**通过**

## C. 主链路 UAT（模块化）

1. 用户与资料：✅ 通过  
- 自动建档 + backfill + owner/read 边界符合一期设计。

2. 提问 / 回答 / 采纳：✅ 通过  
- 发问/草稿/回答主链路可用，`accept_answer_v2` 权限和幂等通过。

3. 专家 / 技能：✅ 通过  
- experts 一人一档成立，skill_offers 可见性边界正确。

4. 搜索 / 发现 / 关注：✅ 通过（有观察项）  
- 搜索 v2 与建议接口可用；follows 主路径已切换；Discover/Following 正常。  
- 仍保留 legacy fallback（受控观察中）。

5. 消息 / 通知：✅ 通过  
- 会话唯一性与成员边界正确；系统通知写入已收口 service-role 路径。

6. 订单 / 积分 / 收益：✅ 通过（有观察项）  
- 订单双边模型可用；订单状态流转 RPC 受控；账务主路径已收口。

7. 举报 / 审核 / 推荐位：✅ 通过  
- 举报可提本人可读；审核/审计不公开；配置/推荐位公开边界正确。

## D. legacy fallback 观察项

当前状态：
- `user_followers`：主路径已迁出，仅剩兼容层职责。
- posts/comments 旧字段 fallback：仍保留（防止历史数据回归）。
- `can_read_post` legacy fallback：仍保留观察期。

评估：兼容层目前未误伤主链路，不阻塞 Freeze。

---

## 2) 通过项 / 未通过项 / 风险点

## 通过项
- 迁移基线一致（list/push 通过）
- 合同与冒烟测试通过
- 7 大业务模块主链路均可用
- service-role 关键 RPC 边界明确

## 未通过项
- 无阻塞项（无 Blocker 级失败）

## 风险点（非阻塞）
1. `test:smoke` 仍依赖显式注入环境变量（建议 1.1 统一脚本读取策略）。
2. 少量 legacy fallback 仍在观察窗口内（按计划后续渐进退役）。
3. 前端 types/命名仍有小残留（不阻塞上线准备）。

---

## 3) 是否阻塞进入上线准备

结论：**不阻塞**。  
建议进入“上线准备 / 小范围试运行”阶段，并维持 Freeze 策略：
- 仅 bugfix / 小 patch / 小 cleanup；
- 不开新 Pack；
- 不做大规模重构。
