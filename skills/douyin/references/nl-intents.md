# NL Intents

## Open video pages

- Slots: `videoTitle` or `videoId`
- Examples: `打开视频 A计划 香港水师力除猖獗海盗`, `打开视频 A计划续集 成龙不畏强权整治恶人`, `打开视频 E噔的奇葩大挑战 奇思妙想的顶级挑战`, `打开视频 https://www.douyin.com/video/7487317288315258152`, `打开视频 全10期 奇妙通告日 N厨狂喜 限时开启`, `打开视频 全12期 天赐的声音第六季 舞台纯享版 用旋律镌刻故事`, `打开视频 全16集 西游记续 师徒四人历艰难取真经`, `打开视频 全1期 2025抖音新春特别会 邀请每一个特别会的你`
- Detail-family note: keep `/video/<id>` on the existing public `open-video` surface.

## Open category pages

- Slots: `categoryName`
- Examples: `打开分类 discover`, `打开分类 shipin`, `打开分类 vs`, `打开分类 zhuanti`
