---
name: moodyz-works
description: Instruction-only Skill for https://moodyz.com/works/date. Use when Codex needs to search works, open verified work or actress pages, and navigate the approved moodyz URL family.
---

# moodyz Skill

## Scope

- Site: `https://moodyz.com/works/date`
- Stay inside the verified `moodyz.com` URL family.
- Safe actions: `click-toggle`, `navigate`, `search-submit`, `select-member`
- Supported tasks: search 作品, open 作品 pages, open 女优 pages, open category and list pages, open utility pages.

## Current Site Capability status

- Moodyz remains public read-only metadata/navigation; no native downloader or authenticated session flow is claimed.
- Use HTTP/read-only probes and local validation fixtures for live checks.
- Preserve official work names, actress links, release/date metadata, and source URLs when producing catalog-style answers.
- For month-level work lists, use the project entrypoint `node src/entrypoints/sites/moodyz-month-catalog.mjs --month YYYY-MM` or the same daily-probe strategy. Do not rely only on `/works/date`, search snippets, or a rendered page excerpt.
- Probe every day in the requested month with `/works/list/date/YYYY-MM-DD`, keep dates that contain real `/works/detail/` links, and de-duplicate by detail URL before reporting totals.

## Sample coverage

- Works: 10人のチ○ポと1人花びら大回転ノンストップ連続SEX, 21歳、現役女子大生。身長146センチ。友達1人。日本で唯一「エロ研究サークル」で活動する彼女の, MOODYZのS級美少女たちにニタニタ見つめられながら、甘く優しく扱かれたい！甘サド美少女乳首舐, MOODYZファン感謝祭バコバコバスツアー2025VRアナザーストーリー VRだけでは撮りきれな, MOODYZファン感謝祭バコバコバスツアー2026 25周年専属大集合！大乱交！大感謝スペシャル, MOODYZ初専属超ハーレム MOODYZ ONLY ONE STARS みんな好きだ。, あの伝説のフェスが2年半ぶりに再開…NO SEX、NO LIFE！相部屋NTR, ナイトプールで彼女の親友の逆NTR 超肉食なエロがり美女の誘惑に我慢できず中出し浮気
- Actresses: 七瀬アリス, 佐々倉ひより, 八木奈々, 小野六花, 松本いちか, 石原希望, 石川澪, 葵いぶき
- Search queries: 七瀬アリス, 八木奈々, 奥井千晴, 小野六花, 松本いちか

## Reading order

1. Start with [references/index.md](references/index.md).
2. For task execution details, read [references/flows.md](references/flows.md).
3. For user utterances and slot mapping, read [references/nl-intents.md](references/nl-intents.md).
4. For failure handling, read [references/recovery.md](references/recovery.md).
5. For approval boundaries, read [references/approval.md](references/approval.md).
6. For the structured site model, read [references/interaction-model.md](references/interaction-model.md).

## Safety boundary

- Search and public navigation are low-risk actions.
- Login or register pages may be opened, but credential submission is out of scope.

## Do not do

- Do not leave the verified moodyz URL family.
- Do not invent unobserved actions or side-effect flows.
- Do not submit auth forms, uploads, payments, or unknown forms without approval.
