# Interaction Model

## Capability summary

- 视频样本: A计划 香港水师力除猖獗海盗, A计划续集 成龙不畏强权整治恶人, E噔的奇葩大挑战 奇思妙想的顶级挑战, https://www.douyin.com/video/7487317288315258152, 全10期 奇妙通告日 N厨狂喜 限时开启, 全12期 天赐的声音第六季 舞台纯享版 用旋律镌刻故事, 全16集 西游记续 师徒四人历艰难取真经, 全1期 2025抖音新春特别会 邀请每一个特别会的你
- 用户样本: https://www.douyin.com/user/MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ, 动画, 抖音-记录美好生活, 电影, 电视剧, 纪录片频道, 综艺
- 搜索样本: 新闻
- 分类样本: discover, shipin, vs, zhuanti
- 公开用户子页: https://www.douyin.com/user/MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ, https://www.douyin.com/user/MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ?showTab=post
- 登录态只读子页: https://www.douyin.com/follow?tab=feed, https://www.douyin.com/follow?tab=user, https://www.douyin.com/user/self?showTab=collect, https://www.douyin.com/user/self?showTab=history, https://www.douyin.com/user/self?showTab=like, https://www.douyin.com/user/self?showTab=post

| Intent | Element | Action | State Field |
| --- | --- | --- | --- |
| 打开分类页 | el_c95fa93298a2 (category-link-group) | navigate | activeMemberId |
| 打开视频 | el_4d24b363a217 (content-link-group) | navigate | activeMemberId |
| 打开功能页 | el_93c4071f6d43 (utility-link-group) | navigate | activeMemberId |

## Boundary notes

- Public search, detail, author, and category pages stay on the verified `www.douyin.com` family.
- `/user/self?showTab=post|like|collect|history` and `/follow?tab=feed|user` are authenticated read-only sub-scenarios.
- `list-followed-users` and `list-followed-updates` execute against the same authenticated read-only surfaces and persist cache under the local Douyin browser profile.
- Follow-query results support projection into `summary`, `users`, `groups`, and `videos`, with Markdown summaries for compact reporting.
- Cached rows may carry `source`, `timeSource`, and `timeConfidence` to surface result provenance and timestamp quality.
- The interaction model is read-only and excludes like, favorite, follow, comment, messaging, and publishing actions.
