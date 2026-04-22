# Phase 1 Freeze 执行建议（执行版）

日期：2026-04-22  
适用范围：Pack 01 ~ Pack 08-B（已完成阶段性验证）

## 1) Freeze 基线结论

当前版本可作为 **Phase 1 Freeze 基线**。  
判定依据：
- 一期主链路已完成并通过阶段性验证；
- 当前无 P0；
- 剩余项主要为 P1/P2 小收尾，不阻塞交付。

## 2) 建议 Tag / Release 命名

建议按以下方式落地（任选其一）：

### Git Tag（推荐）
- `backend-phase1-freeze-2026-04-22`
- `v1.0.0-phase1-freeze`

### Release 名称（推荐）
- `AskBuddy Backend Phase1 Freeze`
- `Phase1 Backend Baseline (Pack01-08B)`

## 3) Freeze 后变更策略（强约束）

仅允许：
- bugfix（P0/P1）
- 小 patch migration（可审阅、可回滚）
- 小范围 cleanup（不改业务模型）
- 文档与运行手册补充

不允许：
- 新 Pack
- 新业务域扩展
- 大规模 schema 重构
- 大规模前端重构

## 4) Freeze 执行步骤（建议顺序）

1. 锁定分支策略  
- `main` 仅允许审核后合入；禁止直接试验性功能提交。

2. 打 Tag / 建 Release  
- 以通过验证的 commit 打 Freeze Tag；
- 发布 Release，挂载 3 份文档：
  - `backend-phase1-final-validation-report.md`
  - `backend-phase1-launch-readiness-checklist.md`
  - `backend-phase1-uat-runbook.md`

3. 进入稳定观察窗口（建议 1~2 周）  
- 重点观测：搜索/发现、账务链路、legacy fallback 命中。

4. 仅受理小任务  
- 统一进入 `Phase 1.1 cleanup` 清单，不再并行开大任务。

## 5) 收官后门槛（进入 UAT/上线准备）

满足以下即可推进 UAT：
- `migration list` 本地/远端一致；
- `db push` up-to-date；
- `test:contracts` / `test:smoke` 稳定通过；
- 关键 service-role RPC 权限边界通过抽检；
- 无新增 P0。
