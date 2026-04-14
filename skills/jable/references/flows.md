# Flows

## Table of contents

- [打开影片](#open-video)
- [搜索影片](#search-video)
- [打开分类页](#open-category)
- [打开演员页](#open-model)
- [分类榜单查询](#list-category-videos)

## 打开影片

- Intent ID: `intent_700b27d217fb`
- Intent Type: `打开影片`
- Action: `navigate`
- Summary: 打开影片

- Example user requests: `打开ADN-773 白皙美乳女教師校內露出調教 被人撞見我的淫蕩真面目 白峰美羽`, `打开ATID-662 被沒用的部下用「吸吮器」猛吸豆豆,下半身抖到站不起來、高潮崩潰的氣質美腿女上司 夏目彩春`, `打开ATID-662 被沒用的部下用「吸吮器」猛吸豆豆，下半身抖到站不起來、高潮崩潰的氣質美腿女上司 夏目彩春`, `打开ATID-669 沉溺和女友媽媽流汗性交的日子。 夏目彩春`
- Start state: home page, search results page, category page, or any verified public page.
- Target state: a `/videos/...` detail page.
- Main path: open the matching video link.
- Success signal: the final URL matches `/videos/...` and the page shows video metadata.

## 搜索影片

- Intent ID: `intent_85d24b7127d0`
- Intent Type: `搜索影片`
- Action: `search-submit`
- Summary: 搜索影片

- Example user requests: `搜索IPX-238`, `搜索IPX-795`, `搜索JUR-652`
- Start state: any verified public page.
- Target state: a `/search/` results page or a directly resolved `/videos/...` page.
- Main path: fill the search box -> submit -> open the matching video result if needed.
- Success signal: the result page mentions the query or the final URL matches `/videos/...`.
- Disambiguation rule: prefer exact code matches such as `JUR-652` over fuzzy title fragments.

## 打开分类页

- Intent ID: `intent_919a7d0e1050`
- Intent Type: `打开分类页`
- Action: `navigate`
- Summary: 打开分类页

- Example user requests: `打开3P`, `打开Cosplay`, `打开NTR`, `打开OL`
- Start state: home page or a verified public page.
- Target state: a category, tag, hot, or list page.
- Main path: open the matching navigation link.
- Success signal: the final URL stays inside `/categories/`, `/tags/`, `/hot/`, or `/latest-updates/`.
- Known taxonomy groups: 地點(13)、交合(11)、角色(16)、劇情(16)、身材(13)、玩法(19)、衣著(17)

## 打开演员页

- Intent ID: `intent_9fc32a687e40`
- Intent Type: `打开演员页`
- Action: `navigate`
- Summary: 打开演员页

- Example user requests: `打开Tiny演员页`, `打开あおい藍演员页`, `打开あまつか亜夢演员页`, `打开夏目彩春演员页`
- Start state: a video detail page or a verified public page.
- Target state: the linked `/models/...` page.
- Main path: read the model link -> open the model page.
- Success signal: the model name and URL match the selected model.

## 分类榜单查询

- Intent ID: `intent_ab8046b794cb`
- Intent Type: `分类榜单查询`
- Action: `query-ranking`
- Summary: 分类榜单查询

- Example user requests: `3P分类，近期最佳推荐三部`, `Cosplay标签最近更新前五条`, `地點分类最高收藏前三`
- Start state: home page, category page, tag page, or any verified public page.
- Target state: a ranked result list extracted from a verified tag page or a taxonomy group aggregate.
- Main path: resolve the taxonomy target -> open the visible tag or category page -> switch to the requested on-site sort mode -> extract the top N cards.
- Sort semantics: “推荐/最佳/近期最佳” => 综合排序; “最近/近期” => 最近更新; “最多观看/最热” => 最多觀看; “最高收藏/收藏最多” => 最高收藏。
- Group aggregation: when the user targets a first-level category group, aggregate the visible top cards from all tags in that group, dedupe by video URL, then rank the merged set.
- Success signal: return the requested number of ranked cards with title, link, actor names, and any visible metric.

## Notes

- 这组流程以导航为主，不包含下载动作。
- 搜索消歧时，优先区分番号、影片标题和演员名称。
- 询问元数据时，以实时 `/videos/...` 和 `/models/...` 页面为准。
