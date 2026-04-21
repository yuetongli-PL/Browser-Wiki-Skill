# Flows

## Table of contents

- [打开视频](#open-video)
- [打开分类页](#open-category)
- [打开功能页](#open-utility-page)

## 打开视频

- Intent ID: `intent_28a6d344ce7b`
- Intent Type: `open-video`
- Action: `navigate`
- Summary: 打开视频

- Example user requests: `打开视频 A计划 香港水师力除猖獗海盗`, `打开视频 A计划续集 成龙不畏强权整治恶人`, `打开视频 E噔的奇葩大挑战 奇思妙想的顶级挑战`, `打开视频 https://www.douyin.com/video/7487317288315258152`, `打开视频 全10期 奇妙通告日 N厨狂喜 限时开启`, `打开视频 全12期 天赐的声音第六季 舞台纯享版 用旋律镌刻故事`, `打开视频 全16集 西游记续 师徒四人历艰难取真经`, `打开视频 全1期 2025抖音新春特别会 邀请每一个特别会的你`
- Start state: the home page, a search results page, a user homepage, or an approved category page.
- Target state: a video detail page on `www.douyin.com/video/<id>`.
- Main path: open a verified video card from search, category, or user-homepage results.
- Success signal: the final page is a video detail page with a stable title and owner link when present.

## 打开分类页

- Intent ID: `intent_919a7d0e1050`
- Intent Type: `open-category`
- Action: `navigate`
- Summary: 打开分类页

- Example user requests: `打开分类 discover`, `打开分类 shipin`, `打开分类 vs`, `打开分类 zhuanti`
- Start state: any verified public Douyin page.
- Target state: an approved category page under `/shipin/`, `/discover/`, `/zhuanti/`, or `/vs`.
- Main path: navigate directly to a verified category entrypoint.
- Success signal: the final URL remains inside the approved Douyin path family.

## 打开功能页

- Intent ID: `intent_3f6b72955f80`
- Intent Type: `open-utility-page`
- Action: `navigate`
- Summary: 打开功能页

- Navigation-only flow inside the verified Douyin URL family.

## Notes

- Douyin public routing stays on `www.douyin.com` for home, search, detail, user, and category pages.
- Authenticated read-only subpages (`我的作品`、`喜欢`、`收藏`、`观看历史`、`关注`) are preserved as sub-scenarios and are not promoted to new public intents.
- `list-followed-users` and `list-followed-updates` are authenticated read-only query flows backed by the local persisted profile and follow cache.
- The current Douyin skill surface is intentionally read-only and excludes any engagement or publishing action.
