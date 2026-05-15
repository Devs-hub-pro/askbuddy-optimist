# packages/shared-api

跨端共享 API 契约封装（唯一事实来源由 A 主线维护）。

当前阶段（contract snapshot v1）：

- `src/rpc-whitelist.ts`：RPC 白名单与入参/出参约束。
- `src/page-contract-map.ts`：B/C/D 按页面可消费的表/RPC/字段清单。
- `src/index.ts`：统一导出入口。

协作约束：

- B/C/D 不应私自扩展后端字段语义；如有冲突，先提报 A 主线仲裁。
- 端侧新增字段/状态/RPC 语义前，必须先走 `docs/conflict-resolution-process.md`。
