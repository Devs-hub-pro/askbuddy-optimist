# 多端协作规则（Freeze 版）

## 1. 主线分工
- A：后端契约与共享层（唯一事实来源）
- B：iOS 前端
- C：Android 前端
- D：微信小程序前端

字段、状态机、RPC 命名冲突一律回 A 仲裁。

## 2. 当前目录边界（严格执行）
- iOS：`src + ios`
- Android：`android`
- 小程序：`apps/wechat-miniprogram`
- 后端：`supabase`
- 共享：`packages/shared-types`、`packages/shared-api`

## 3. 分支规范
- iOS：`feat/ios-*`
- Android：`feat/android-*`
- 小程序：`feat/miniapp-*`
- 共享/契约：`feat/shared-*` 或 `chore/*`

禁止跨端混合提交。

## 4. 环境规范
- 各自 local 开发，不共享日常 dev。
- 联调统一走共享 `staging`。
- 真机测试/内测优先 `staging` 或 `prod-like`。

## 5. Freeze 约束
仅允许：
- bugfix
- 小 patch
- cleanup

不允许：
- 新 Pack
- 大规模重构
- 大范围目录搬迁（需单独迁移窗口）
