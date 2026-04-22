# Phase 1.1 小收尾任务优先级（P1 / P2）

> 目标：只做小步收尾，不开新 Pack，不破坏 Freeze 基线。

## P1（可以马上做，低风险高收益）

## 1) 高频 types 收口
- 更新 Supabase types 到当前 schema（优先覆盖：Profile / MyEarnings / Discover / Search）。
- 清理与 `follows`、账务主路径相关的高频类型残留。
- 原则：按模块小批次提交，每次可独立回滚。

## 2) 高频查询层 `as any` 减量
- 优先处理：
  - orders / payments / point_accounts / point_transactions / earning_transactions
  - follows / Discover feed 关键查询
- 原则：只改数据层，不改 UI 结构。

## 3) smoke 执行稳定性
- 统一 `test:smoke` 的环境变量读取方式（尽量减少手工注入）。
- 保证团队成员在标准命令下可重复通过。

## 4) 关键 RPC 回归脚本化
- 最小补 2~3 个回归脚本：
  - `accept_answer_v2`
  - `create_system_notification_v2`
  - `transition_order_status_v2`
- 目标：收官后持续可验证，不依赖临时手工。

## P2（建议观察一版后再动）

## 1) legacy fallback 退役
- 观察 `user_followers`、posts/comments 旧字段 fallback 命中趋势。
- 达到低命中且稳定后，再分批移除 fallback 分支。
- 不建议在 Freeze 初期直接删除兼容路径。

## 2) 低频旧 trigger / policy 清理
- 先做“标记 deprecated + 文档化”，再考虑删除。
- 清理顺序：无引用 -> 低风险 -> 可回滚。

## 3) 命名统一（展示层）
- 逐步统一 Discover 计数字段命名（legacy -> 新命名）。
- 仅做渐进替换，不做全站一次性重命名。

## 4) 旧表/旧列最终退役
- 如 `user_followers`、posts/comments 历史兼容列等，建议放在后续窗口单独执行。
- 必须满足：观察充分 + 有回滚脚本 + 业务低峰窗口。

## 执行策略（建议）

1. 先做 P1（1~2 周内完成）  
2. 再看观测数据决定 P2 退役节奏  
3. 每个任务保持“小改动、可审阅、可回滚”  

## 本清单明确不做

- 新 Pack
- 新业务域
- 大规模删表
- 全站类型系统重构
- 大规模前端架构调整
