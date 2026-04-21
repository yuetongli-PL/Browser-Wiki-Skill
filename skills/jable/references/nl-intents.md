# NL Intents

## 搜索影片

- Slots: `queryText`
- Examples: `搜索IPX-238`, `搜索IPX-795`, `搜索JUR-652`
- Notes: prefer exact video codes or exact titles when available.

## 打开影片

- Slots: `videoTitle`
- Examples: `打开ADN-773 白皙美乳女教師校內露出調教 被人撞見我的淫蕩真面目 白峰美羽`, `打开ATID-662 被沒用的部下用「吸吮器」猛吸豆豆,下半身抖到站不起來、高潮崩潰的氣質美腿女上司 夏目彩春`, `打开ATID-662 被沒用的部下用「吸吮器」猛吸豆豆，下半身抖到站不起來、高潮崩潰的氣質美腿女上司 夏目彩春`, `打开ATID-669 沉溺和女友媽媽流汗性交的日子。 夏目彩春`

## 打开演员页

- Slots: `actorName`
- Examples: `打开Tiny演员页`, `打开あおい藍演员页`, `打开あまつか亜夢演员页`, `打开夏目彩春演员页`

## 打开分类页

- Slots: `targetLabel`
- Examples: `打开3P`, `打开Cosplay`, `打开NTR`, `打开OL`
- Groups: 地點（便利店、健身房、圖書館、學校、廁所…）；交合（中出、乳交、口交、口爆、接吻…）；角色（OL、主播、人妻、偶像、家庭教師…）；劇情（NTR、下雨天、偷拍、催眠、出軌…）；身材（嬌小、少女、巨乳、熟女、白虎…）；玩法（3P、一日十回、凌辱、刑具、多P…）；衣著（Cosplay、兔女郎、吊帶襪、和服、女僕…）

## 分类榜单查询

- Slots: `targetLabel`, `sortMode`, `limit`, `scopeType`
- Examples: `3P分类，近期最佳推荐三部`, `Cosplay标签最近更新前五条`, `地點分类最高收藏前三`
- Sort defaults: `推荐/最佳/近期最佳 => 综合排序`; `最近/近期 => 最近更新`; `最多观看/最热 => 最多觀看`; `最高收藏/收藏最多 => 最高收藏`。
- Scope: supports all extracted taxonomy tags and all first-level category groups.
- Execution: `node src/entrypoints/sites/jable-ranking.mjs https://jable.tv/ --query "<请求>"`.
