# C-Android 前端主线执行记录（v1）

日期：2026-04-22  
负责人：C-安卓前端主线

## Step 1 计划 + 涉及文件
### 计划
- 以 B-iOS 基线路由与核心组件为源，生成 Android 页面映射清单（不改信息架构）。
- 明确 Android 侧页面入口、复用组件、主数据来源（A 主线口径）。

### 涉及文件
- `src/App.tsx`
- `docs/multi-end-ios-reuse-mapping-v1.md`
- `docs/multi-end-client-consumption-matrix-v1.md`
- `packages/shared-api/endpoints.ts`
- `packages/shared-types/index.ts`

### 安卓页面映射清单（iOS -> Android）
| iOS 基线路由 | Android 路由 | Android 壳层/组件 | 主数据来源（A 为准） |
|---|---|---|---|
| `/` 首页 | `/` 首页 | `AppScreen` + `BottomNav` + `SearchBar` | `useQuestions` / `useHotTopics` / `useExperts` |
| `/search` 搜索 | `/search` 搜索 | `AppScreen` + 搜索头部 + `PageStateCard` | `search_app_content_v2` / `get_search_suggestions_v2` |
| `/new` 提问 | `/new` 提问 | `AppScreen` + `SubPageHeader` + 表单组件 | `create_question_secure`（Mock 兜底） |
| `/discover` 发现 | `/discover` 发现 | `AppScreen` + `BottomNav` + `DiscoverFeed` | `posts/follows` 相关查询（Mock 兜底） |
| `/messages` 消息 | `/messages` 消息 | `AppScreen` + `BottomNav` + 会话列表 | `get_user_conversations`（Mock 兜底） |
| `/profile` 我的 | `/profile` 我的 | `AppScreen` + `BottomNav` + `SettingsMenu` | `profiles` + stats/account 查询 |
| `/question/:id` 问题详情 | `/question/:id` 问题详情 | `AppScreen` + 问题头/回答区 + `PageStateCard` | `questions/answers` + `accept_answer_v2` |
| `/expert/:id` 专家详情 | `/expert/:id` 专家详情 | `AppScreen` + `SubPageHeader` | `experts/skill_offers` |
| `/chat/:chatId` 聊天详情 | `/chat/:chatId` 聊天详情 | `AppScreen` + 消息流 | `messages` + `send_direct_message`（Mock 兜底） |
| `/topic/:topicId` 专题详情 | `/topic/:topicId` 专题详情 | `AppScreen` + 专题内容 | `topics/discussions` |

### 状态
- 已完成：安卓页面映射清单。
- 未完成：无。
- 下一步：进入 Step 2，输出 Android 差异改造优先级。

---

## Step 2 计划 + 涉及文件
### 计划
- 识别 iOS 与 Android 的平台差异，拆分为 P0（必须本轮完成）/P1（联调前可补）。
- 约束：不新增后端能力，不开新 Pack，字段/状态/RPC 冲突以 A 为准。

### 涉及文件
- `src/utils/platform.ts`
- `src/hooks/useNativeShell.ts`
- `src/components/SwipeBackWrapper.tsx`
- `src/components/BottomNav.tsx`
- `src/index.css`
- `src/config/runtimeMode.ts`

### 安卓差异改造清单（P0 / P1）
#### P0（本轮完成）
- Android 平台识别：补齐 `android/ios/web` 判定，避免仅 native 二值。
- Android 返回策略：接入原生 backButton 监听，优先回退 web history。
- 手势差异：Android 关闭 iOS 风格左缘滑返，防止与系统返回手势冲突。
- 键盘/底栏：键盘弹起时给底栏避让能力，避免遮挡输入区。
- Mock 先行：Android 支持 `mock=1` / `localStorage.android_mock_mode=1` / `VITE_ANDROID_MOCK_DEFAULT`，先可运行。

#### P1（下一轮）
- Android 状态栏深浅色自适配（按页面主题动态切换）。
- Android 触感反馈（按钮、发布、发送）统一化。
- Android 回退链路埋点（区分系统返回与页面返回）。
- 详情页滚动惯性/回弹参数进一步贴近 Material 体验。

### 状态
- 已完成：P0 清单落地并进入代码。
- 未完成：P1（不阻塞当前可运行与后续联调）。
- 下一步：进入 Step 3，搭建安卓骨架与 token/状态组件。

---

## Step 3 计划 + 涉及文件
### 计划
- 搭建 Android 容器工程与前端壳层适配能力。
- 统一导航、状态组件和平台 token，保证后续页面可批量复用。

### 涉及文件
- 新增：`android/`（Capacitor Android 容器）
- 新增：`src/hooks/useNativeShell.ts`
- 新增：`src/design/platformThemeTokens.ts`
- 改造：`src/App.tsx`
- 改造：`src/utils/platform.ts`
- 改造：`src/components/layout/AppScreen.tsx`
- 改造：`src/components/BottomNav.tsx`
- 改造：`src/components/SwipeBackWrapper.tsx`
- 改造：`src/index.css`

### 状态
- 已完成：
  - Android 容器创建：`npx cap add android`
  - Android Web 资源同步：`npx cap sync android`
  - 壳层接入 `useNativeShell`（平台/键盘/body dataset）
  - 底部导航、页面容器、手势策略完成 Android 适配
  - token 文件新增（iOS/Android 双集）
- 未完成：无。
- 下一步：进入 Step 4，主链路页面以 Mock 可运行为先落地。

---

## Step 4 计划 + 涉及文件
### 计划
- 落地核心主链路页面（首页/搜索/提问/发现/消息/我的 + 详情页）的 Android 可运行版本。
- 优先 Mock 跑通，再逐步切真实接口。

### 涉及文件
- 新增：`src/config/runtimeMode.ts`
- 改造：`src/hooks/useQuestions.ts`
- 改造：`src/hooks/useMessages.ts`
- 改造：`src/hooks/usePosts.ts`
- 改造：`src/hooks/useFollowingPosts.ts`
- 改造：`src/hooks/useLocalPosts.ts`

### 落地结果
- 首页 `/`：真实数据 + demo merge；Android mock 模式可稳定展示。
- 搜索 `/search`：v2 RPC 主路径 + fallback；Android mock 模式可运行。
- 提问 `/new`：mock 模式下可直接走本地成功返回，不阻塞流程演示。
- 发现 `/discover`：推荐/关注/同城三流在 mock 模式下均有可展示数据。
- 消息 `/messages` + `/chat/:chatId`：mock 会话与消息链路已接入。
- 我的 `/profile`：保留既有登录态逻辑，可在 mock 模式下不阻塞全局运行。
- 详情页 `/question/:id`：question/answer mock 数据可读；回答提交 mock 可跑通。

### 状态
- 已完成：核心链路“安卓可运行 + Mock 先行”落地。
- 未完成：我的页深层子页 mock 不做扩展（按当前约束非阻塞）。
- 下一步：进入 Step 5，逐页验收并输出联调阻塞项。

---

## Step 5 计划 + 涉及文件
### 计划
- 逐页验收核心链路，区分“已通过 / 待联调 / 阻塞”。
- 输出仅与后端联调相关的阻塞问题（按 P0/P1）。

### 涉及文件
- `src/pages/Index.tsx`
- `src/pages/SearchResults.tsx`
- `src/pages/NewQuestion.tsx`
- `src/pages/Discover.tsx`
- `src/pages/Messages.tsx`
- `src/pages/Profile.tsx`
- `src/pages/QuestionDetail.tsx`
- `src/pages/ExpertDetail.tsx`
- `src/pages/ChatDetail.tsx`

### 逐页验收结论
| 页面 | 可运行（Mock） | 真实接口状态 | 结论 |
|---|---|---|---|
| 首页 | 通过 | 部分真实 | 通过 |
| 搜索 | 通过 | v2 RPC 主路径 | 通过 |
| 提问 | 通过 | 需登录 + RPC | 通过（联调待切真实） |
| 发现 | 通过 | 依赖 posts/follows | 通过（联调待切真实） |
| 消息 | 通过 | 依赖 get_user_conversations/messages | 通过（联调待切真实） |
| 我的 | 通过 | 依赖 profile/stats | 通过 |
| 问题详情 | 通过 | 依赖 questions/answers | 通过 |
| 专家详情 | 通过 | 依赖 experts/skill_offers | 通过 |
| 聊天详情 | 通过 | 依赖 send_direct_message | 通过（联调待切真实） |

### 阻塞联调问题（P0 / P1）
#### P0（阻塞切真实）
1. Android 端尚未统一注入“联调环境账号/鉴权态”，消息、提问、我的深层写操作在未登录时只能走 mock。  
2. 发现流涉及 `posts/follows` 在部分环境中 schema 演进不一致，需 A 主线确认最终字段（`author_id/user_id` 已做兼容但仍需统一）。

#### P1（不阻塞 mock 可运行）
1. 状态栏深浅色与页面主题的动态切换未收口。  
2. Android 物理返回键与业务 fallback 的埋点缺失，回归时难以定位误返回。  
3. 我的页二级功能（收益/社群/设置子页）尚未做“全链路 mock-真实切换开关”的细粒度覆盖。

### 状态
- 已完成：逐页验收与阻塞清单输出。
- 未完成：P1 项待联调窗口内补齐。
- 下一步：按 A 主线仲裁结果逐项切换真实接口并回归。
