# Interaction Model

## Capability summary

- 笔记样本: 一周穿搭
- 用户样本: 小红书搜索, 王玉雯Uvin
- 搜索样本: 穿搭
- 发现页样本: 发现, 图文, 用户, 视频
- 登录页样本: 注册页, 登录页
- 功能页样本: 直播列表, 通知页

| Intent | Element | Action | State Field |
| --- | --- | --- | --- |
| 搜索笔记 | el_490b2e0a8d48 (search-form-group) | search-submit | queryText |
| 查询关注用户列表 | follow-users-query (-) | query-followed-users | followUsers |

## Boundary notes

- Public discover, search, note detail, and user homepage pages stay on the verified `www.xiaohongshu.com` family.
- Search pages, note detail pages, and user homepages should expose Xiaohongshu-specific labels such as 笔记、用户主页、发现页 and 通知页 when applicable.
- Login/register entrypoints are navigation-only targets; automation must not auto-fill or auto-submit credentials.
- `list-followed-users` runs against the same authenticated read-only profile boundary and prefers the official frontend follow-list runtime.
- The interaction model is read-only and excludes engagement, publishing, or transaction workflows.
