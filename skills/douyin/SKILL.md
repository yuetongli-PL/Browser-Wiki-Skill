---
name: douyin
description: Instruction-only Skill for https://www.douyin.com/?recommend=1. Use when Codex needs to search videos, open verified video pages, open verified user homepages, navigate approved douyin category pages, or inspect authenticated read-only douyin surfaces inside the douyin URL family.
---

# douyin Skill

## Scope

- Site: `https://www.douyin.com/?recommend=1`
- Stay inside the verified `www.douyin.com` URL family.
- Safe actions: `navigate`
- Supported tasks: 打开视频、打开分类页、复用本地登录态查看只读子页.
- Public navigation model: home, search, video detail, user homepage, and approved category pages remain public read-only surfaces.
- Follow-query entrypoint: `node src/entrypoints/sites/douyin-query-follow.mjs https://www.douyin.com/?recommend=1 --intent list-followed-updates --window 今天`.

## Sample coverage

- 视频样本: A计划 香港水师力除猖獗海盗, A计划续集 成龙不畏强权整治恶人, E噔的奇葩大挑战 奇思妙想的顶级挑战, https://www.douyin.com/video/7487317288315258152, 全10期 奇妙通告日 N厨狂喜 限时开启, 全12期 天赐的声音第六季 舞台纯享版 用旋律镌刻故事, 全16集 西游记续 师徒四人历艰难取真经, 全1期 2025抖音新春特别会 邀请每一个特别会的你
- 用户样本: https://www.douyin.com/user/MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ, 动画, 抖音-记录美好生活, 电影, 电视剧, 纪录片频道, 综艺
- 搜索样本: 新闻
- 分类样本: discover, shipin, vs, zhuanti
- 公开用户子页: https://www.douyin.com/user/MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ, https://www.douyin.com/user/MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ?showTab=post
- 登录态只读子页: https://www.douyin.com/follow?tab=feed, https://www.douyin.com/follow?tab=user, https://www.douyin.com/user/self?showTab=collect, https://www.douyin.com/user/self?showTab=history, https://www.douyin.com/user/self?showTab=like, https://www.douyin.com/user/self?showTab=post

## Execution policy

- Public Douyin pages MUST use the built-in browser.
- Authenticated Douyin pages MUST use the local-profile browser with a reusable persisted session.
- Login bootstrap MUST run through `node .\scripts\site-login.mjs https://www.douyin.com/ --profile-path profiles/www.douyin.com.json --no-headless --reuse-login-state --no-auto-login`.
- The first Douyin login is always manual in a visible browser; do not save or submit account credentials automatically.
- Authenticated read-only subpages include `/user/self?showTab=post|like|collect|history` and `/follow?tab=feed|user`.
- `list-followed-users` and `list-followed-updates` are cache-first authenticated read-only queries backed by the local persisted profile.
- Query filters: support followed-user filtering, title keywords, global limits, and updated-only output over the authenticated follow cache.
- Query outputs: support `summary`, `users`, `groups`, `videos`, plus Markdown summaries for operator-friendly reads.
- Optional prewarm: `site-keepalive --refresh-follow-cache` refreshes recent active followed-user caches after a healthy keepalive.
- Routing table: public pages -> `builtin-browser`; authenticated read-only pages -> `local-profile-browser`; login bootstrap -> `site-login`.

## Reading order

1. Start with [references/index.md](references/index.md).
2. For task execution details, read [references/flows.md](references/flows.md).
3. For user utterances and slot mapping, read [references/nl-intents.md](references/nl-intents.md).
4. For failure handling, read [references/recovery.md](references/recovery.md).
5. For approval boundaries, read [references/approval.md](references/approval.md).
6. For the structured site model, read [references/interaction-model.md](references/interaction-model.md).

## Safety boundary

- Search, public navigation, and authenticated read-only inspection are low-risk actions.
- `喜欢`、`收藏`、`观看历史`、`关注` stay as authenticated read-only subpages and are not promoted into new public intents.
- Followed-update extraction is strict per user homepage and does not use `/follow?tab=feed` as the final correctness source.
- No like, favorite, follow, comment, private message, upload, or publish mutation is in scope.

## Do not do

- Do not leave the verified douyin URL family.
- Do not invent unobserved engagement or publishing workflows.
- Do not open authenticated Douyin surfaces in the built-in browser.
- Do not submit auth forms or any unknown side-effect action without approval.
