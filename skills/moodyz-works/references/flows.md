# Flows

## Table of contents

- [search-work](#search-work)
- [open-utility-page](#open-utility-page)
- [open-category](#open-category)
- [open-actress](#open-actress)
- [open-work](#open-work)

## search-work

- Intent ID: `intent_3bb189e93c34`
- Intent Type: `search-work`
- Action: `search-submit`
- Summary: search-work

- Example user requests: `搜索《七瀬アリス》`, `搜索《八木奈々》`, `搜索《奥井千晴》`, `搜索《小野六花》`, `搜索《松本いちか》`
- Start state: any verified public page.
- Target state: a `/search/list` results page or a directly resolved work page.
- Main path: fill the search box -> submit -> open the matching result if needed.
- Success signal: the result page mentions the query or the final URL is a `/works/detail/...` page.

## open-utility-page

- Intent ID: `intent_3f6b72955f80`
- Intent Type: `open-utility-page`
- Action: `navigate`
- Summary: open-utility-page


## open-category

- Intent ID: `intent_919a7d0e1050`
- Intent Type: `open-category`
- Action: `navigate`
- Summary: open-category


## open-actress

- Intent ID: `intent_94b2c4c8056b`
- Intent Type: `open-actress`
- Action: `navigate`
- Summary: open-actress

- Example user requests: `打开七瀬アリス女优页`, `打开佐々倉ひより女优页`, `打开八木奈々女优页`, `打开小野六花女优页`
- Start state: a work detail page or a verified public page.
- Target state: the linked actress page.
- Main path: read the actress link -> open the actress page.
- Success signal: the actress name and URL match the selected actress.

## open-work

- Intent ID: `intent_96c31c59b954`
- Intent Type: `open-work`
- Action: `navigate`
- Summary: open-work

- Example user requests: `打开《10人のチ○ポと1人花びら大回転ノンストップ連続SEX》`, `打开《21歳、現役女子大生。身長146センチ。友達1人。日本で唯一「エロ研究サークル」で活動する彼女の》`, `打开《MOODYZのS級美少女たちにニタニタ見つめられながら、甘く優しく扱かれたい！甘サド美少女乳首舐》`, `打开《MOODYZファン感謝祭バコバコバスツアー2025VRアナザーストーリー VRだけでは撮りきれな》`
- Start state: home page, search results page, category page, or any verified public page.
- Target state: a work detail page.
- Main path: open the matching work link.
- Success signal: the URL matches `/works/detail/...` and the page shows the work metadata.

## Notes

- This site flow set is currently navigation-first, not chapter-download oriented.
- For live metadata questions, trust the current work detail HTML over search-engine snippets or stale cached result pages.
- Search disambiguation should separate work titles from actress names before opening a result.
