# NL Intents

## Search notes

- Slots: `queryText`.
- Examples: `搜索笔记 穿搭`
- Notes: prefer “笔记 / 图文 / 帖子” phrasing over 书籍 / 作品 wording when the request routes to Xiaohongshu.

## Open note pages

- Slots: `noteTitle` or `noteId`.
- Examples: `打开笔记 一周穿搭`
- Detail-family note: keep `/explore/<noteId>` on the same public `open-note` surface.

## Download note bundles

- Slots: `noteTitle`, `noteId`, or resolved note URLs.
- Examples: `下载笔记 一周穿搭`
- Notes: user phrasing may prefer “下载图文”“下载图片帖子”; both should map to the same image-note download flow.

## Open user homepages

- Slots: `userName` or `userId`.
- Examples: `打开用户主页 小红书搜索`, `打开用户主页 王玉雯Uvin`
- User-family note: `/user/profile/<userId>` remains the verified public homepage family.

## Browse discover page

- Slots: `targetMemberId`.
- Examples: `浏览发现页`, `打开发现页 图文`, `打开发现页 用户`, `打开发现页 视频`
- Notes: discover routing should resolve to `/explore`, not `/search_result`.

## Open login/register pages

- Slots: `targetMemberId`.
- Examples: `打开注册页`, `进入注册页`, `打开登录页`, `打开登录页但不自动提交凭证`
- Notes: opening the page is allowed, but filling or submitting credentials is out of scope for automation.

## Open utility pages

- Slots: `targetMemberId`.
- Examples: `打开直播列表`, `打开通知页`, `查看消息页`
- Notes: the current verified authenticated utility surface is notification-oriented.

## List followed users

- Slots: none.
- Examples: `查询关注用户列表`, `列出我关注的用户`, `我关注了哪些用户`
- Notes: requires the local persisted authenticated Xiaohongshu profile and returns a read-only `users[]` result.
- Output modes: `summary`, `users`, JSON, and Markdown summaries are supported by the query entrypoint.
