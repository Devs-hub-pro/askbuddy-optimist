# Phase 1 Freeze 问题分诊清单

日期：2026-04-22  
原则：仅分为 Blocker / Non-blocker，不扩散为新开发主线

## A. 阻塞上线（Blocker）

当前结论：**无 Blocker**（基于本轮 Freeze + UAT 执行结果）。

---

## B. 不阻塞上线（Non-blocker）

## 1) smoke 执行需显式环境变量注入
- 模块：测试/运维脚本
- 优先级：Non-blocker
- 描述：`npm run test:smoke` 在部分执行上下文中需手工注入 `SUPABASE_URL/SUPABASE_ANON_KEY`。
- 建议处理：在 Phase 1.1 增加脚本入口统一环境读取。
- 是否进入 Phase 1.1：**是**

## 2) Supabase types 残留旧字段/旧表定义
- 模块：前端类型层
- 优先级：Non-blocker
- 描述：`types.ts` 仍含 `user_followers` 与旧 posts/comments 字段命名残留。
- 建议处理：小范围再生成 types，并分模块替换高频调用点。
- 是否进入 Phase 1.1：**是**

## 3) Discover 展示层旧命名仍有兼容读取
- 模块：发现流前端展示
- 优先级：Non-blocker
- 描述：展示层仍有 `likes_count/comments_count` 旧命名，当前由查询层映射兼容。
- 建议处理：渐进统一为新命名，避免一次性重构。
- 是否进入 Phase 1.1：**是**

## 4) legacy fallback 仍在观察窗口
- 模块：兼容层（follows/posts 可见性）
- 优先级：Non-blocker
- 描述：`user_followers`、`can_read_post` legacy fallback、旧字段触发器仍保留观察。
- 建议处理：先观测命中率，再分批退役；不建议立即删除。
- 是否进入 Phase 1.1：**是**

## 5) 低频旧 policy/trigger 清理仍待执行
- 模块：数据库治理
- 优先级：Non-blocker
- 描述：存在低频历史策略/触发器可进一步收口，但当前不影响主链路。
- 建议处理：按“可审阅、可回滚”原则分批处理。
- 是否进入 Phase 1.1：**是**

---

## 分诊结论

- 当前 Freeze 阶段问题以 **Non-blocker** 为主；
- 建议保持上线准备主线，问题进入 `Phase 1.1 cleanup` 小任务池；
- 禁止因这些 Non-blocker 反向开启新 Pack 或大规模改造。
