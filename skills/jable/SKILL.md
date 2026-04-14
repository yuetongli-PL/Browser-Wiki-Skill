---
name: jable
description: Instruction-only Skill for https://jable.tv/. Use when Codex needs to search videos, open verified video or actor pages, navigate the approved jable URL family, or extract objective top-N lists from verified category and tag pages.
---

# jable Skill

## Scope

- Site: `https://jable.tv/`
- Stay inside the verified `jable.tv` URL family.
- Safe actions: `navigate`, `query-ranking`
- Supported tasks: 搜索影片、打开影片页、打开演员页、打开分类或标签页、按分类或标签提取前 N 条榜单.
- Ranking query entrypoint: `node query-jable-ranking.mjs <url> --query "<自然语言请求>"`.

## Sample coverage

- 影片样本: ADN-773 白皙美乳女教師校內露出調教 被人撞見我的淫蕩真面目 白峰美羽, ATID-662 被沒用的部下用「吸吮器」猛吸豆豆,下半身抖到站不起來、高潮崩潰的氣質美腿女上司 夏目彩春, ATID-662 被沒用的部下用「吸吮器」猛吸豆豆，下半身抖到站不起來、高潮崩潰的氣質美腿女上司 夏目彩春, ATID-669 沉溺和女友媽媽流汗性交的日子。 夏目彩春, DASS-891 【人生で最も特別な日ーそれは結婚式─】新婦の目を盗んで、何度も何度も繰り返す生ハメ強●ズコバコSEX!唾液を絡ませて腰を振りまくる変態ウエディングプランナー 白峰美羽, DASS-891 【人生で最も特別な日ーそれは結婚式─】新婦の目を盗んで、何度も何度も繰り返す生ハメ強●ズコバコSEX！唾液を絡ませて腰を振りまくる変態ウエディングプランナー 白峰美羽, Ipx 238 C Ipx 238 C IPX-238 傲嬌巨乳女僕櫻空桃, Ipx 238 C IPX-238 傲嬌巨乳女僕櫻空桃, IPX-370 和美麗的姐姐希崎傑西卡交換口水濃密接吻做愛, IPX-401 暗戀的班花西宮夢花著我的錢還在我家和除了我以外的所有男生做愛忍無可忍的我強行內射了她
- 演员样本: Tiny, あおい藍, あまつか亜夢, 夏目彩春, 希崎ジェシカ, 愛才りあ, 明日花キララ, 桃乃木かな, 桜空もも, 白峰ミウ
- 搜索样本: IPX-238, IPX-795, JUR-652
- 分类组: 地點(13)、交合(11)、角色(16)、劇情(16)、身材(13)、玩法(19)、衣著(17)

## Reading order

1. Start with [references/index.md](references/index.md).
2. For task execution details, read [references/flows.md](references/flows.md).
3. For user utterances and slot mapping, read [references/nl-intents.md](references/nl-intents.md).
4. For failure handling, read [references/recovery.md](references/recovery.md).
5. For approval boundaries, read [references/approval.md](references/approval.md).
6. For the structured site model, read [references/interaction-model.md](references/interaction-model.md).

## Safety boundary

- Search and public navigation are low-risk actions.
- “推荐/最佳”统一解释为站内公开排序结果，不做主观推荐。
- 一级分类组查询默认按组内所有标签页聚合、去重后取前 N 条。
- Keep answers inside verified video, actor, category, tag, and search pages.
- No downloads, purchases, auth submission, or off-site navigation are in scope.

## Do not do

- Do not leave the verified jable URL family.
- Do not invent unobserved actions or side-effect flows.
- Do not submit auth forms, uploads, payments, or unknown forms without approval.
