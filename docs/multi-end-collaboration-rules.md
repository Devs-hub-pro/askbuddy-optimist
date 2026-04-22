# 多端协作规则（iOS / Android / 微信小程序）

## 1. 目标
- 在同一仓库内并行开发 iOS、Android、微信小程序。
- 避免跨端互相覆盖、接口口径不一致、环境混用。
- 统一以后端与共享契约为唯一事实来源。

## 2. 目录职责（强约束）
- `src + ios`：当前阶段 iOS 主开发路径（可运行主线）。
- `apps/ios-app`：当前阶段仅占位（后续目录重构再启用）。
- `apps/android-app`：仅 Android 前端代码。
- `apps/miniapp-wechat`：仅微信小程序前端代码。
- `packages/shared-types`：跨端共享类型（DTO、枚举、状态机常量）。
- `packages/shared-api`：跨端共享 API 契约（endpoint、query key、参数约定）。
- `supabase/*`：后端 schema/migration/RLS/RPC，仅 A 主线维护。

## 3. 对话主线分工
- A：后端与共享契约主线（Supabase、RLS、RPC、shared-types/shared-api）。
- B：iOS 前端主线（仅 iOS 端实现与适配）。
- C：Android 前端主线（仅 Android 端实现与适配）。
- D：微信小程序前端主线（仅小程序端实现与适配）。

冲突规则：
- 字段命名、状态机、接口参数冲突，一律回 A 主线裁决。

## 4. 分支与提交规则
- 推荐分支：
  - `feat/ios-*`
  - `feat/android-*`
  - `feat/miniapp-*`
  - `feat/shared-*`
- 单分支只做单端/单主题，禁止“跨三端混合提交”。
- 提交信息建议包含端标识：`ios: ...` / `android: ...` / `miniapp: ...` / `shared: ...`。

## 5. 环境与配置规则
- 每端单独维护自己的环境文件（示例）：
  - iOS：`.env.ios.local`
  - Android：`.env.android.local`
  - Miniapp：`.env.miniapp.local`
- 可共享：后端 URL、公开 key、通用 feature flag。
- 不可共享：平台特有配置（包名、签名、平台权限、构建参数）。
- 禁止提交真实敏感密钥到 Git。

## 6. 共享层变更流程（必须）
1. 先在 A 主线更新 `shared-types` / `shared-api`。
2. B/C/D 仅消费共享层，不各自发明同义字段。
3. 若某端发现契约不足，先提到 A，再回端内落地。

## 7. 联调顺序建议
1. 共享契约冻结（A）。
2. iOS/Android/小程序各自完成 Mock 可运行（B/C/D）。
3. 按主链路逐端联调真实接口（先核心：登录、首页、搜索、提问、详情）。
4. 最后统一回归与验收。

## 8. 禁止事项
- 禁止在 B/C/D 直接改 `supabase/migrations`。
- 禁止直接在某一端私自扩展后端字段后不回写共享层。
- 禁止把一个端的 UI 代码直接复制到另一个端而不做平台适配。

## 9. 最小验收清单（每端）
- 能独立启动。
- 核心 6 页可访问：首页、搜索、提问、发现、消息、我的。
- 返回路径清晰，无明显死路。
- 与共享类型/API 无冲突。
- 不破坏其他端主链路。
