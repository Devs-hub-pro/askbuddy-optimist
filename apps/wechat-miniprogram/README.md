# apps/wechat-miniprogram

当前阶段（D-小程序端可用版联调）

- 固定开发路径：`apps/wechat-miniprogram`
- 固定分支：`worktree/d-miniapp`
- 后端契约仲裁：A（字段/状态机/RPC 冲突不在端侧猜测）

## staging 连接

1. 复制 `apps/wechat-miniprogram/config/env.local.example.js`
2. 新建 `apps/wechat-miniprogram/config/env.local.js`（已 `.gitignore` 忽略）
3. 填入：
   - `supabaseUrl`
   - `supabaseAnonKey`

默认行为：

- 优先走 staging 请求层
- 请求失败时按配置降级 mock（`useMockFallback: true`）

## 本轮最小闭环页面

- 首页列表：`pages/home/index`
- 搜索结果：`pages/search/index`（统一对象命名 `question/expert/skill/post`）
- 问题详情 + 回答列表：`pages/question-detail/index`
- 通知列表（读）+ 未读数（读）：`pages/messages/index`
