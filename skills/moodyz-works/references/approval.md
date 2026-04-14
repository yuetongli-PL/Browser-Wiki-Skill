# Approval

## Approval Checkpoints

### Safe Action Whitelist

- Safe actions: `noop`, `activate-member`, `set-expanded`, `set-open`, `navigate`, `search-submit`, `download-book`
- Observed executable actions in current model: `navigate`, `search-submit`
- Current page status: 当前已观测模型中无必须审批的 in-domain 动作。

### Submit Or Commit

- Severity: `high`
- Why approval: Submitting, confirming, publishing, or otherwise committing user-visible changes requires explicit approval.
- Default recovery: `ask-approval`

#### 触发点

| Trigger Type | Values |
| --- | --- |
| Action IDs | submit, commit, publish, confirm |
| Intent Types | submit, commit |
| Keywords | 提交, 确认, 发布, commit, submit, publish, confirm |
| URL Patterns | [] |

#### 命中条件

| Field | Op | Value |
| --- | --- | --- |
| utteranceText | regex | "提交\|确认\|发布\|commit\|submit\|publish\|confirm" |
| targetLabel | regex | "提交\|确认\|发布\|commit\|submit\|publish\|confirm" |
| actionId | in | ["submit","commit","publish","confirm"] |
| intentType | in | ["submit","commit"] |

#### 当前页面是否已有该类动作

- 有潜在命中证据。

#### 审批通过后

- 仅在显式人工批准后继续执行对应动作。
- 执行完成后仍需按 recovery-rules 校验 URL、状态与证据。

#### 审批拒绝后

- 退回到安全意图集合。
- 建议回到这些文档：[actions.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/actions.md), [open-actress-author-links-七瀬-石原希望-松本.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-actress-author-links-七瀬-石原希望-松本.md), [open-category-category-links-予約作品-作品検索-快感-続-痙攣性交-絶頂潮該当作品.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-category-category-links-予約作品-作品検索-快感-続-痙攣性交-絶頂潮該当作品.md), [open-utility-page-utility-links-web-募集-社員募集-中途採用.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-utility-page-utility-links-web-募集-社員募集-中途採用.md), [open-work-content-links-顔面特化-2d射精管理-回春-嬢-同棲-m飼育-恋距離-神-脳-淫語-僕.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-work-content-links-顔面特化-2d射精管理-回春-嬢-同棲-m飼育-恋距離-神-脳-淫語-僕.md), [search-work-search-form.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/search-work-search-form.md), [common-failures.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/recovery/common-failures.md)

### Destructive

- Severity: `critical`
- Why approval: Deleting, removing, clearing, or otherwise destructive actions require approval.
- Default recovery: `ask-approval`

#### 触发点

| Trigger Type | Values |
| --- | --- |
| Action IDs | delete, remove, clear, destroy |
| Intent Types | delete, remove |
| Keywords | 删除, 移除, 清空, 销毁, delete, remove, clear, destroy |
| URL Patterns | [] |

#### 命中条件

| Field | Op | Value |
| --- | --- | --- |
| utteranceText | regex | "删除\|移除\|清空\|销毁\|delete\|remove\|clear\|destroy" |
| targetLabel | regex | "删除\|移除\|清空\|销毁\|delete\|remove\|clear\|destroy" |
| actionId | in | ["delete","remove","clear","destroy"] |
| intentType | in | ["delete","remove"] |

#### 当前页面是否已有该类动作

- 当前已观测模型中没有该类 in-domain 动作。

#### 审批通过后

- 仅在显式人工批准后继续执行对应动作。
- 执行完成后仍需按 recovery-rules 校验 URL、状态与证据。

#### 审批拒绝后

- 退回到安全意图集合。
- 建议回到这些文档：[open-actress-author-links-七瀬-石原希望-松本.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-actress-author-links-七瀬-石原希望-松本.md), [open-category-category-links-予約作品-作品検索-快感-続-痙攣性交-絶頂潮該当作品.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-category-category-links-予約作品-作品検索-快感-続-痙攣性交-絶頂潮該当作品.md), [open-utility-page-utility-links-web-募集-社員募集-中途採用.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-utility-page-utility-links-web-募集-社員募集-中途採用.md), [open-work-content-links-顔面特化-2d射精管理-回春-嬢-同棲-m飼育-恋距離-神-脳-淫語-僕.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-work-content-links-顔面特化-2d射精管理-回春-嬢-同棲-m飼育-恋距離-神-脳-淫語-僕.md), [search-work-search-form.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/search-work-search-form.md), [common-failures.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/recovery/common-failures.md)

### Financial

- Severity: `critical`
- Why approval: Purchasing, paying, ordering, or any financial transaction requires approval.
- Default recovery: `ask-approval`

#### 触发点

| Trigger Type | Values |
| --- | --- |
| Action IDs | buy, purchase, pay, checkout, order |
| Intent Types | purchase, payment |
| Keywords | 购买, 支付, 付款, 结算, 下单, buy, purchase, pay, checkout, order |
| URL Patterns | [] |

#### 命中条件

| Field | Op | Value |
| --- | --- | --- |
| utteranceText | regex | "购买\|支付\|付款\|结算\|下单\|buy\|purchase\|pay\|checkout\|order" |
| targetLabel | regex | "购买\|支付\|付款\|结算\|下单\|buy\|purchase\|pay\|checkout\|order" |
| actionId | in | ["buy","purchase","pay","checkout","order"] |
| intentType | in | ["purchase","payment"] |

#### 当前页面是否已有该类动作

- 当前已观测模型中没有该类 in-domain 动作。

#### 审批通过后

- 仅在显式人工批准后继续执行对应动作。
- 执行完成后仍需按 recovery-rules 校验 URL、状态与证据。

#### 审批拒绝后

- 退回到安全意图集合。
- 建议回到这些文档：[open-actress-author-links-七瀬-石原希望-松本.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-actress-author-links-七瀬-石原希望-松本.md), [open-category-category-links-予約作品-作品検索-快感-続-痙攣性交-絶頂潮該当作品.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-category-category-links-予約作品-作品検索-快感-続-痙攣性交-絶頂潮該当作品.md), [open-utility-page-utility-links-web-募集-社員募集-中途採用.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-utility-page-utility-links-web-募集-社員募集-中途採用.md), [open-work-content-links-顔面特化-2d射精管理-回春-嬢-同棲-m飼育-恋距離-神-脳-淫語-僕.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-work-content-links-顔面特化-2d射精管理-回春-嬢-同棲-m飼育-恋距離-神-脳-淫語-僕.md), [search-work-search-form.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/search-work-search-form.md), [common-failures.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/recovery/common-failures.md)

### Upload

- Severity: `high`
- Why approval: Uploading or importing user content requires approval.
- Default recovery: `ask-approval`

#### 触发点

| Trigger Type | Values |
| --- | --- |
| Action IDs | upload, import, attach |
| Intent Types | upload, import |
| Keywords | 上传, 导入, 附件, upload, import, attach |
| URL Patterns | [] |

#### 命中条件

| Field | Op | Value |
| --- | --- | --- |
| utteranceText | regex | "上传\|导入\|附件\|upload\|import\|attach" |
| targetLabel | regex | "上传\|导入\|附件\|upload\|import\|attach" |
| actionId | in | ["upload","import","attach"] |
| intentType | in | ["upload","import"] |

#### 当前页面是否已有该类动作

- 当前已观测模型中没有该类 in-domain 动作。

#### 审批通过后

- 仅在显式人工批准后继续执行对应动作。
- 执行完成后仍需按 recovery-rules 校验 URL、状态与证据。

#### 审批拒绝后

- 退回到安全意图集合。
- 建议回到这些文档：[open-actress-author-links-七瀬-石原希望-松本.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-actress-author-links-七瀬-石原希望-松本.md), [open-category-category-links-予約作品-作品検索-快感-続-痙攣性交-絶頂潮該当作品.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-category-category-links-予約作品-作品検索-快感-続-痙攣性交-絶頂潮該当作品.md), [open-utility-page-utility-links-web-募集-社員募集-中途採用.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-utility-page-utility-links-web-募集-社員募集-中途採用.md), [open-work-content-links-顔面特化-2d射精管理-回春-嬢-同棲-m飼育-恋距離-神-脳-淫語-僕.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/open-work-content-links-顔面特化-2d射精管理-回春-嬢-同棲-m飼育-恋距離-神-脳-淫語-僕.md), [search-work-search-form.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/intents/search-work-search-form.md), [common-failures.md](../../../knowledge-base/moodyz.com/raw/operation-docs/20260414T023828766Z_moodyz.com_docs/recovery/common-failures.md)

### Auth Change

- Severity: `high`
- Why approval: Logging in, logging out, authorizing, or changing identity context requires approval.
- Default recovery: `ask-approval`

#### 触发点

| Trigger Type | Values |
| --- | --- |
| Action IDs | login, logout, authorize, grant |
| Intent Types | auth, login |
| Keywords | 登录, 退出, 授权, 连接账户, login, logout, authorize, sign in, sign out |
| URL Patterns | [] |

#### 命中条件

| Field | Op | Value |
| --- | --- | --- |
| utteranceText | regex | "登录\|退出\|授权\|连接账户\|login\|logout\|authorize\|sign in\|sign out" |
| targetLabel | regex | "登录\|退出\|授权\|连接账户\|login\|logout\|authorize\|sign in\|sign out" |
| actionId | in | ["login","logout","authorize","grant"] |
| intentType | in | ["auth","login"] |

#### 当前页面是否已有该类动作

- 当前已观测模型中没有该类 in-domain 动作。

#### 审批通过后

- 仅在显式人工批准后继续执行对应动作。
- 执行完成后仍需按 recovery-rules 校验 URL、状态与证据。

#### 审批拒绝后

- 退回到安全意图集合。
- 建议回到这些文档：无直接文档命中，退回 README / intents 文档

### Unverified Navigation

- Severity: `high`
- Why approval: Navigating outside the observed URL family requires approval.
- Default recovery: `reject`

#### 触发点

| Trigger Type | Values |
| --- | --- |
| Action IDs | - |
| Intent Types | - |
| Keywords | - |
| URL Patterns | [{"type":"observed-url-family","value":{"sameOriginRequired":true,"origins":["https://moodyz.com","https://x.com"],"urls":["https://moodyz.com/actress/detail/713324","https://moodyz.com/actress/detail/713450","https://moodyz.com/actress/detail/713490","https://moodyz.com/actress/detail/713569","https://moodyz.com/actress/detail/713592","https://moodyz.com/actress/detail/796011","https://moodyz.com/actress/detail/810311","https://moodyz.com/actress/detail/849666","https://moodyz.com/actress/detail/869367","https://moodyz.com/recruit/2","https://moodyz.com/recruit/9","https://moodyz.com/search","https://moodyz.com/search/list?keyword=%E4%B8%83%E7%80%AC%E3%82%A2%E3%83%AA%E3%82%B9","https://moodyz.com/search/list?keyword=%E5%85%AB%E6%9C%A8%E5%A5%88%E3%80%85","https://moodyz.com/search/list?keyword=%E5%A5%A5%E4%BA%95%E5%8D%83%E6%99%B4","https://moodyz.com/search/list?keyword=%E5%B0%8F%E9%87%8E%E5%85%AD%E8%8A%B1","https://moodyz.com/search/list?keyword=%E6%9D%BE%E6%9C%AC%E3%81%84%E3%81%A1%E3%81%8B","https://moodyz.com/search/list?keyword=AV&countup=0","https://moodyz.com/search/list?keyword=MOODYZ&countup=0","https://moodyz.com/top","https://moodyz.com/works/date","https://moodyz.com/works/detail/MIAA729","https://moodyz.com/works/detail/MIDA492","https://moodyz.com/works/detail/MIDA560?page_from=actress&sys_code=71112","https://moodyz.com/works/detail/MIDA622","https://moodyz.com/works/detail/MIDV257","https://moodyz.com/works/detail/MIHD007","https://moodyz.com/works/detail/MIRD267?page_from=actress&sys_code=71252","https://moodyz.com/works/detail/MIRD270","https://moodyz.com/works/detail/MIRD277","https://moodyz.com/works/detail/MIRD277?page_from=actress&sys_code=70768","https://moodyz.com/works/detail/MIRD277?page_from=actress&sys_code=71252","https://moodyz.com/works/detail/MIZD515?page_from=actress&sys_code=75403","https://moodyz.com/works/detail/MIZD517?page_from=actress&sys_code=72164","https://moodyz.com/works/detail/MIZD523","https://moodyz.com/works/detail/MIZD533","https://moodyz.com/works/detail/MIZD533?page_from=actress&sys_code=70768","https://moodyz.com/works/detail/MNGS040","https://moodyz.com/works/detail/MNGS040?page_from=actress&sys_code=71252","https://moodyz.com/works/detail/MNGS050","https://moodyz.com/works/detail/MNGS050?page_from=actress&sys_code=71252","https://moodyz.com/works/list/date/2022-11-15","https://moodyz.com/works/list/date/2022-12-20","https://moodyz.com/works/list/date/2023-10-17","https://moodyz.com/works/list/date/2023-11-21","https://moodyz.com/works/list/date/2025-12-16","https://moodyz.com/works/list/reserve","https://moodyz.com/works/list/series/3872","https://x.com/MOODYZ_official"],"pathPrefixes":["/actress/detail","/MOODYZ_official","/recruit/2","/recruit/9","/search","/search/list","/top","/works/date","/works/detail","/works/list"]}}] |

#### 命中条件

| Field | Op | Value |
| --- | --- | --- |
| finalUrl | not_in_family | {"sameOriginRequired":true,"origins":["https://moodyz.com","https://x.com"],"urls":["https://moodyz.com/actress/detail/713324","https://moodyz.com/actress/detail/713450","https://moodyz.com/actress/detail/713490","https://moodyz.com/actress/detail/713569","https://moodyz.com/actress/detail/713592","https://moodyz.com/actress/detail/796011","https://moodyz.com/actress/detail/810311","https://moodyz.com/actress/detail/849666","https://moodyz.com/actress/detail/869367","https://moodyz.com/recruit/2","https://moodyz.com/recruit/9","https://moodyz.com/search","https://moodyz.com/search/list?keyword=%E4%B8%83%E7%80%AC%E3%82%A2%E3%83%AA%E3%82%B9","https://moodyz.com/search/list?keyword=%E5%85%AB%E6%9C%A8%E5%A5%88%E3%80%85","https://moodyz.com/search/list?keyword=%E5%A5%A5%E4%BA%95%E5%8D%83%E6%99%B4","https://moodyz.com/search/list?keyword=%E5%B0%8F%E9%87%8E%E5%85%AD%E8%8A%B1","https://moodyz.com/search/list?keyword=%E6%9D%BE%E6%9C%AC%E3%81%84%E3%81%A1%E3%81%8B","https://moodyz.com/search/list?keyword=AV&countup=0","https://moodyz.com/search/list?keyword=MOODYZ&countup=0","https://moodyz.com/top","https://moodyz.com/works/date","https://moodyz.com/works/detail/MIAA729","https://moodyz.com/works/detail/MIDA492","https://moodyz.com/works/detail/MIDA560?page_from=actress&sys_code=71112","https://moodyz.com/works/detail/MIDA622","https://moodyz.com/works/detail/MIDV257","https://moodyz.com/works/detail/MIHD007","https://moodyz.com/works/detail/MIRD267?page_from=actress&sys_code=71252","https://moodyz.com/works/detail/MIRD270","https://moodyz.com/works/detail/MIRD277","https://moodyz.com/works/detail/MIRD277?page_from=actress&sys_code=70768","https://moodyz.com/works/detail/MIRD277?page_from=actress&sys_code=71252","https://moodyz.com/works/detail/MIZD515?page_from=actress&sys_code=75403","https://moodyz.com/works/detail/MIZD517?page_from=actress&sys_code=72164","https://moodyz.com/works/detail/MIZD523","https://moodyz.com/works/detail/MIZD533","https://moodyz.com/works/detail/MIZD533?page_from=actress&sys_code=70768","https://moodyz.com/works/detail/MNGS040","https://moodyz.com/works/detail/MNGS040?page_from=actress&sys_code=71252","https://moodyz.com/works/detail/MNGS050","https://moodyz.com/works/detail/MNGS050?page_from=actress&sys_code=71252","https://moodyz.com/works/list/date/2022-11-15","https://moodyz.com/works/list/date/2022-12-20","https://moodyz.com/works/list/date/2023-10-17","https://moodyz.com/works/list/date/2023-11-21","https://moodyz.com/works/list/date/2025-12-16","https://moodyz.com/works/list/reserve","https://moodyz.com/works/list/series/3872","https://x.com/MOODYZ_official"],"pathPrefixes":["/actress/detail","/MOODYZ_official","/recruit/2","/recruit/9","/search","/search/list","/top","/works/date","/works/detail","/works/list"]} |

#### 当前页面是否已有该类动作

- 当前已观测模型中没有该类 in-domain 动作。

#### 审批通过后

- 仅在显式人工批准后继续执行对应动作。
- 执行完成后仍需按 recovery-rules 校验 URL、状态与证据。

#### 审批拒绝后

- 退回到安全意图集合。
- 建议回到这些文档：无直接文档命中，退回 README / intents 文档

### Unknown Side Effect

- Severity: `high`
- Why approval: Any action outside the safe whitelist is treated as side-effectful and requires approval.
- Default recovery: `ask-approval`

#### 触发点

| Trigger Type | Values |
| --- | --- |
| Action IDs | - |
| Intent Types | - |
| Keywords | - |
| URL Patterns | [] |

#### 命中条件

| Field | Op | Value |
| --- | --- | --- |
| actionId | not_in_set | ["noop","activate-member","set-expanded","set-open","navigate","search-submit","download-book"] |

#### 当前页面是否已有该类动作

- 当前已观测模型中没有该类 in-domain 动作。

#### 审批通过后

- 仅在显式人工批准后继续执行对应动作。
- 执行完成后仍需按 recovery-rules 校验 URL、状态与证据。

#### 审批拒绝后

- 退回到安全意图集合。
- 建议回到这些文档：无直接文档命中，退回 README / intents 文档
