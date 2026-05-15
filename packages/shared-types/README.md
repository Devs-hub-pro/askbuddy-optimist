# packages/shared-types

跨端共享类型（唯一事实来源由 A 主线维护）。

当前阶段（contract snapshot v1）：

- 统一核心实体类型：用户、问题、回答、专家、技能、消息、通知、订单、积分、收益。
- 统一状态机白名单与 target/item 类型白名单。
- 导出入口：`src/index.ts`

协作约束：

- B/C/D 端遇到字段与状态冲突，必须回 A 主线仲裁后再修改本目录。
- 端侧不得私自新增后端字段语义；必须走 `docs/conflict-resolution-process.md` 提报流程。
