# xiaohongshu Index

## Site summary

- Entry URL: `https://www.xiaohongshu.com/explore`
- Site type: discover hub + search results + note detail + user homepage + authenticated read-only query surfaces.
- 笔记样本: 一周穿搭
- 用户样本: 小红书搜索, 王玉雯Uvin
- 搜索样本: 穿搭
- 发现页样本: 发现, 图文, 用户, 视频
- 登录页样本: 注册页, 登录页
- 功能页样本: 直播列表, 通知页
- 关注查询样本: 查询关注用户列表, 列出我关注的用户, 我关注了哪些用户

## Reference navigation

- [flows.md](flows.md)
- [recovery.md](recovery.md)
- [approval.md](approval.md)
- [nl-intents.md](nl-intents.md)
- [interaction-model.md](interaction-model.md)

## Sample intent coverage

| Intent | Flow Source | Actionable Targets | Recognition-only Targets |
| --- | --- | --- | --- |
| 搜索笔记 | - | 穿搭 | undefined |
| 查询关注用户列表 | - | 我的关注用户列表 | - |

## Notes

- Search traffic is expected to land on `https://www.xiaohongshu.com/search_result?keyword=...`.
- `open-note` and `download-note` both operate on the verified `/explore/<noteId>` note detail family.
- `open-user` covers the verified `/user/profile/<userId>` homepage family.
- `browse-discover` is the discover surface rooted at `/explore`, not the search results family.
- `open-auth-page` is read-only navigation to login/register entrypoints; it does not imply auto-login or auto-submit.
- `open-utility-page` is currently used for verified utility surfaces such as `/notification`.
- `list-followed-users` is an authenticated read-only query surface layered on top of a reusable persisted profile and the official frontend follow-list runtime.
