# 后端一期 UAT / Launch Readiness Runbook（执行版）

> 目标：用一套固定流程，快速判断当前版本是否可进入上线准备。

## A. 环境准备

1. 工作目录
```bash
cd /Users/shawnshi1997/askbuddy-optimist
```

2. 环境变量检查（本机会话）
```bash
echo ${SUPABASE_DB_PASSWORD:+SET} ${SUPABASE_URL:+SET} ${SUPABASE_ANON_KEY:+SET}
```

3. `.env` 校验（前端 smoke 所需）
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

4. 前置原则
- 不开新 Pack；
- 不做大规模 cleanup；
- 仅验证当前 Freeze 基线。

## B. 必跑命令（顺序固定）

```bash
npx supabase migration list
npx supabase db push
npm run test:contracts
npm run test:smoke
```

判定标准：
- `migration list`：本地/远端版本一致；
- `db push`：`Remote database is up to date.`
- `test:contracts`：通过；
- `test:smoke`：通过（必要时注入 SUPABASE_URL/SUPABASE_ANON_KEY）。

## C. 主链路验证顺序（按模块）

### 1) 用户与资料
- 注册/登录自动建档（profiles/user_settings/point_accounts）
- 历史 backfill 完整性
- 资料公开边界 + 设置 owner-only 边界

### 2) 提问 / 回答 / 采纳
- 发问、草稿、回答、详情读写
- `accept_answer_v2` 权限/幂等/不可替换
- 前端直写系统字段 guard 抽检

### 3) 专家 / 技能
- experts 一人一档
- skill_offers 可见性（本人全状态、他人 published）
- skill_categories 前台读/后台写边界

### 4) 搜索 / 发现 / 关注
- `search_app_content_v2` / `get_search_suggestions_v2`
- search_history upsert（登录态）
- hot_keywords 优先 + fallback
- follows 主路径与 Discover/Following 正常

### 5) 消息 / 通知
- direct 会话唯一性
- 会话成员读写消息边界
- 通知 owner-only
- 未读数函数最小可用

### 6) 订单 / 积分 / 收益
- 订单双边可见（buyer/seller）
- `transition_order_status_v2` 白名单流转 + 幂等
- 账务主路径：point_accounts / point_transactions / earning_transactions

### 7) 举报 / 审核 / 推荐位
- content_reports 用户提交与本人可读
- moderation_queue / audit_logs 非普通用户不可见
- system_configs `is_public=true` 才可公开
- recommendation_slots active + 时间窗口可公开

## D. service-role / RPC 检查项

重点 RPC：
- `accept_answer_v2`
- `create_system_notification_v2`
- `transition_order_status_v2`

检查点：
- 普通 authenticated 用户不可越权调用；
- service-role/server-side 路径可调用；
- 幂等行为符合设计；
- 不产生本轮未声明的副作用（例如意外账务写入）。

## E. legacy fallback 观察项

- `user_followers` 是否仅剩兼容层（主路径应为 `follows`）
- posts/comments 旧字段 fallback 命中趋势
- `can_read_post` legacy fallback 命中趋势
- 兼容 trigger/policy 是否仍被主路径依赖

> 说明：观察优先于删除，先保稳，再退役。

## F. 回滚注意事项

1. 数据库回滚原则
- 优先“停止写入 + 补丁修复”，避免直接回滚破坏新数据；
- migration 回滚需评估数据兼容性，不做一键硬回退。

2. RPC 变更回滚
- 若函数行为异常，优先发布小 patch 覆盖；
- 保留旧函数作为短期 fallback（如已并行存在）。

3. 前端回滚策略
- 查询层可保留短期 fallback；
- 禁止在 UAT 阶段做大规模结构改造。

## G. UAT 通过判定

满足以下条件即可判定通过：
- 必跑命令全部通过；
- 7 大模块主链路可用；
- service-role 边界无泄漏；
- 无 P0；
- P1 有明确小任务与时间窗口。
