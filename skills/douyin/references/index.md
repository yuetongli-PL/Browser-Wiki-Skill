# douyin Index

## Site summary

- Entry URL: `https://www.douyin.com/?recommend=1`
- Site type: video catalog + user homepage navigation + authenticated read-only subpages.
- 视频样本: A计划 香港水师力除猖獗海盗, A计划续集 成龙不畏强权整治恶人, E噔的奇葩大挑战 奇思妙想的顶级挑战, https://www.douyin.com/video/7487317288315258152, 全10期 奇妙通告日 N厨狂喜 限时开启, 全12期 天赐的声音第六季 舞台纯享版 用旋律镌刻故事, 全16集 西游记续 师徒四人历艰难取真经, 全1期 2025抖音新春特别会 邀请每一个特别会的你
- 用户样本: https://www.douyin.com/user/MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ, 动画, 抖音-记录美好生活, 电影, 电视剧, 纪录片频道, 综艺
- 搜索样本: 新闻
- 分类样本: discover, shipin, vs, zhuanti
- 公开用户子页: https://www.douyin.com/user/MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ, https://www.douyin.com/user/MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ?showTab=post
- 登录态只读子页: https://www.douyin.com/follow?tab=feed, https://www.douyin.com/follow?tab=user, https://www.douyin.com/user/self?showTab=collect, https://www.douyin.com/user/self?showTab=history, https://www.douyin.com/user/self?showTab=like, https://www.douyin.com/user/self?showTab=post

## Reference navigation

- [flows.md](flows.md)
- [recovery.md](recovery.md)
- [approval.md](approval.md)
- [nl-intents.md](nl-intents.md)
- [interaction-model.md](interaction-model.md)

## Sample intent coverage

| Intent | Flow Source | Actionable Targets | Recognition-only Targets |
| --- | --- | --- | --- |
| 打开分类页 | - | discover, shipin, vs, zhuanti | 小游戏 |
| 打开视频 | - | A计划 香港水师力除猖獗海盗, A计划续集 成龙不畏强权整治恶人, E噔的奇葩大挑战 奇思妙想的顶级挑战, https://www.douyin.com/video/7487317288315258152, 全10期 奇妙通告日 N厨狂喜 限时开启, 全12期 天赐的声音第六季 舞台纯享版 用旋律镌刻故事, 全16集 西游记续 师徒四人历艰难取真经, 全1期 2025抖音新春特别会 邀请每一个特别会的你 | - |
| 打开功能页 | - | 友情链接, 推荐, 用户服务协议, 站点地图, 精选, 联系我们, 营业执照, 账号找回, 隐私政策 | - |

## Notes

- `open-author` covers public `www.douyin.com/user/<id>` user homepages.
- `我的作品`、`喜欢`、`收藏`、`观看历史`、`关注` remain authenticated read-only subpages and are not exposed as new public intents.
- `list-followed-users` and `list-followed-updates` are authenticated read-only query surfaces layered on top of `/follow?tab=user` and `user/<id>?showTab=post`.
- Query responses can be projected as `summary`, `users`, `groups`, or `videos`, and Markdown output is available for operator-facing reviews.
- Video rows expose provenance and confidence fields such as `source`, `timeSource`, and `timeConfidence`.
- The reusable local profile is bootstrapped through `site-login` in a visible browser and reused by later local-profile runs.
