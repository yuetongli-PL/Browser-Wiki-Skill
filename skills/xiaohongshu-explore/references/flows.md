# Flows

## Table of contents

- [查询关注用户列表](#list-followed-users)
- [搜索笔记](#search-note)

## 查询关注用户列表

- Intent ID: `xiaohongshu-followed-users`
- Intent Type: `list-followed-users`
- Action: `query-followed-users`
- Summary: 查询关注用户列表

- Example user requests: `查询关注用户列表`, `列出我关注的用户`, `我关注了哪些用户`.
- Start state: a valid persisted authenticated Xiaohongshu profile on the local-profile browser.
- Target state: a read-only follow-list result with `users[]`, `name`, `userId`, and `url`.
- Main path: verify authenticated state, then reuse the official frontend runtime module `40122.tF()` to request `/api/sns/web/v1/intimacy/intimacy_list`.
- Fallback path: if the official runtime path is unavailable, reuse existing self-profile/state heuristics and report `partial`, `captcha-gated`, or `unauthenticated` precisely.
- Success signal: the result returns followed-user rows without requiring manual DOM-only enumeration from the self profile page.

## 搜索笔记

- Intent ID: `intent_328848d8b3c8`
- Intent Type: `search-note`
- Action: `search-submit`
- Summary: 搜索笔记

- Example user requests: `搜索笔记 穿搭`
- Start state: any verified public Xiaohongshu page.
- Target state: a search results page on `www.xiaohongshu.com/search_result`.
- Main path: fill the visible search box or navigate directly with `keyword=<query>`.
- Success signal: the final page preserves the query and exposes at least one verified note card.

## Notes

- Xiaohongshu public routing stays on `www.xiaohongshu.com` for discover, search, note detail, and user homepage pages.
- Discover browsing and search are different surfaces: `/explore` is discover, `/search_result` is keyword search.
- Login or register pages may be opened as read-only navigation targets, but credential submission is always manual.
- Notification-style utility pages and follow queries are authenticated read-only surfaces and should never imply account mutation.
- `list-followed-users` uses the same reusable persisted profile boundary as other authenticated Xiaohongshu utilities.
- The current Xiaohongshu skill surface is intentionally read-only and excludes like, favorite, follow mutation, comment, message composition, publish, and purchase actions.
