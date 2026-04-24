# 微信小程序前端主线执行稿（对齐 iOS 基线）

## Step 1. 小程序页面映射 + 路由清单

### 计划
- 以当前 iOS/H5 信息架构为基线，优先落地 5 Tab + 2 主链路功能页（提问、详情）。
- 先保证导航闭环（Tab、详情跳转、返回）可用，再补细分子页面。
- 路由命名采用小程序扁平 `pages/*/index`，参数通过 query 传递。

### 涉及文件
- `docs/wechat-miniapp-migration-execution.md`
- `apps/wechat-miniprogram/app.json`

### 页面映射（iOS -> 微信小程序）
| iOS 基线页面 | 小程序页面路径 | 路由类型 | 备注 |
|---|---|---|---|
| 首页（Index） | `pages/home/index` | Tab | 主入口 |
| 搜索（SearchResults） | `pages/search/index` | Tab | 统一搜索入口 |
| 提问（NewQuestion） | `pages/ask/index` | 普通页 | 由首页/搜索 CTA 进入 |
| 发现（Discover） | `pages/discover/index` | Tab | 列表 + 详情跳转 |
| 消息（Messages） | `pages/messages/index` | Tab | 会话列表 |
| 我的（Profile） | `pages/profile/index` | Tab | 个人中心 + 授权 |
| 问题详情（QuestionDetail） | `pages/question-detail/index` | 普通页 | 复用问题 ID |

### 路由清单
- Tab 路由（`switchTab`）
1. `pages/home/index`
2. `pages/search/index`
3. `pages/discover/index`
4. `pages/messages/index`
5. `pages/profile/index`

- 非 Tab 路由（`navigateTo`）
1. `pages/ask/index`
2. `pages/question-detail/index?id={questionId}`

## Step 2. 小程序特化改造清单（P0/P1）

### 计划
- P0 先覆盖“可运行 + 微信生态兼容 + 主链路可验收”。
- P1 再处理体验增强和性能细化，不阻塞联调。

### 涉及文件
- `docs/wechat-miniapp-migration-execution.md`
- `apps/wechat-miniprogram/app.js`
- `apps/wechat-miniprogram/app.json`
- `apps/wechat-miniprogram/app.wxss`
- `apps/wechat-miniprogram/utils/*`

### P0（必须）
1. 页面栈改造：Tab 页必须使用 `switchTab`，详情/提问使用 `navigateTo`。
2. 下拉刷新：5 个核心页均开启 `enablePullDownRefresh`，支持停止动画。
3. 分享能力：各页实现 `onShareAppMessage`，详情页带参数。
4. 授权与登录：接入 `wx.login` 与最小 `wx.getUserProfile` 授权流程（Mock token 先跑通）。
5. 安全区适配：底部导航和页面容器适配 `safeArea`。
6. Mock 先行：统一通过 `utils/request.js` 和 `utils/mock.js` 返回可运行数据。
7. 冲突处理：字段/状态/RPC 以 A 口径收敛，建立单点映射文件。

### P1（后续）
1. 真机手势与页面返回动画细化（接近 iOS 交互反馈）。
2. 图片懒加载、列表分片渲染、骨架屏细化。
3. 分享卡片图与 SEO 文案统一。
4. 埋点与错误上报（小程序端）。
5. Mock 到真实接口的灰度切换开关与回滚策略。
