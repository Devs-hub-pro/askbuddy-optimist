# shared-api

多端共享 API 查询/调用层（Freeze 基线）。

## 当前范围（Freeze 白名单）

- 搜索：`search_app_content_v2`、`get_search_suggestions_v2`
- 受控动作：`accept_answer_v2`、`create_system_notification_v2`、`transition_order_status_v2`
- 消息通知：会话/发送/未读/已读相关 RPC 名称常量
- 发现与辅助：`get_channel_feed`、`get_channel_featured`、`upsert_search_history`
- Deprecated 常量清单（仅兼容，不允许新端新增依赖）

> Freeze 阶段仅做对齐，不扩展新功能。
