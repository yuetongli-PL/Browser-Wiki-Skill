---
name: xiaohongshu-explore
description: Instruction-only Skill for https://www.xiaohongshu.com/explore. Use when Codex needs to search Xiaohongshu notes, open verified note pages, download image-first note bundles, open verified user homepages, browse the discover page, query followed users with a reusable authenticated profile, open notification-style utility pages, or open login/register pages without submitting credentials automatically.
---

# xiaohongshu Skill

## Scope

- Site: `https://www.xiaohongshu.com/explore`
- Stay inside the verified `www.xiaohongshu.com` URL family.
- Safe actions: `navigate`
- Supported tasks: 搜索笔记、打开笔记、下载图文笔记、打开用户主页、浏览发现页、打开登录 / 注册页、打开通知 / 功能页、查询关注用户列表.
- Verified navigation model: `/explore` -> `/search_result?keyword=...` -> `/explore/<noteId>` -> `/user/profile/<userId>`.
- Follow-query entrypoint: `node src/entrypoints/sites/xiaohongshu-query-follow.mjs https://www.xiaohongshu.com/notification --intent list-followed-users --format markdown --reuse-login-state --no-headless`.

## Sample coverage

- 笔记样本: 一周穿搭
- 用户样本: 小红书搜索, 王玉雯Uvin
- 搜索样本: 穿搭
- 发现页样本: 发现, 图文, 用户, 视频
- 登录页样本: 注册页, 登录页
- 功能页样本: 直播列表, 通知页
- 关注查询样本: 查询关注用户列表, 列出我关注的用户, 我关注了哪些用户

## Execution policy

- Public Xiaohongshu pages MUST use the built-in browser.
- Authenticated Xiaohongshu queries MUST reuse the local persisted profile in a visible browser when required.
- Search requests should land on `/search_result` and preserve the `keyword` query parameter.
- Discover-page navigation should resolve to `/explore`; note detail pages stay on `/explore/<noteId>`.
- Login or register pages may be opened for manual inspection or bootstrap, but credential input and submission are always manual and never automatic.
- Notification-style utility pages and follow queries are authenticated read-only surfaces when reusable login state exists.
- `list-followed-users` prefers the official frontend runtime module and falls back to existing self-profile heuristics only when the official path is unavailable.
- Routing table: public discover/search/note/user pages -> `builtin-browser`; notification/follow-query pages -> `local-profile-browser`; login/register pages -> manual auth bootstrap only.

## Reading order

1. Start with [references/index.md](references/index.md).
2. For task execution details, read [references/flows.md](references/flows.md).
3. For user utterances and slot mapping, read [references/nl-intents.md](references/nl-intents.md).
4. For failure handling, read [references/recovery.md](references/recovery.md).
5. For approval boundaries, read [references/approval.md](references/approval.md).
6. For the structured site model, read [references/interaction-model.md](references/interaction-model.md).

## Safety boundary

- 搜索笔记、浏览发现页、打开笔记详情、打开用户主页、打开通知页、查询关注用户列表都属于低风险只读动作。
- 打开登录页或注册页是允许的，但 automation 只能停在页面打开这一步，不能自动提交凭证。
- `list-followed-users` 只返回只读的 `users[]` 结果，不会触发关注、取关、私信或其他账号状态变更。
- 不包含点赞、收藏、关注、评论、私信、发布、购买或任何未知副作用动作。

## Do not do

- Do not leave the verified Xiaohongshu URL family.
- Do not invent unobserved engagement, publishing, or transaction workflows.
- Do not auto-fill or auto-submit auth forms without explicit approval.
- Do not treat discover/search/user/notification navigation or follow queries as permission to mutate account state.
