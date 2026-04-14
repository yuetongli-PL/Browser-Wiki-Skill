# Approval

## Approval Checkpoints

### Safe Action Whitelist

- Safe actions: `noop`, `activate-member`, `set-expanded`, `set-open`, `navigate`, `search-submit`, `download-book`
- Observed executable actions in current model: `navigate`, `query-ranking`, `search-submit`
- Current page status: 当前模型中存在需审批动作。

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
- 建议回到这些文档：[actions.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/actions.md), [分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md), [common-failures.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/recovery/common-failures.md)

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
- 建议回到这些文档：[分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md), [common-failures.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/recovery/common-failures.md)

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
- 建议回到这些文档：[分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md), [common-failures.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/recovery/common-failures.md)

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
- 建议回到这些文档：[分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md), [common-failures.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/recovery/common-failures.md)

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
| URL Patterns | [{"type":"observed-url-family","value":{"sameOriginRequired":true,"origins":["https://jable.tv"],"urls":["https://jable.tv/","https://jable.tv/categories/","https://jable.tv/models/","https://jable.tv/models/2b60db870ab2d4375486d15a61f1b735/","https://jable.tv/models/2bf4c69cec5e6547b338e9fc8b9fd086/","https://jable.tv/models/3cfba41761d71d4bbd3635cc4b6c20fd/","https://jable.tv/models/76deee4a66140394afb9b342222318c9/","https://jable.tv/models/95898564176258a0cff5ef1f3e45431e/","https://jable.tv/models/hara-sarasa/","https://jable.tv/models/jessica-kizaki/","https://jable.tv/models/kirara-asuka/","https://jable.tv/models/kurea-hasumi/","https://jable.tv/models/momonogi-kana/","https://jable.tv/models/sakura-momo/","https://jable.tv/models/tiny/","https://jable.tv/models/yume-nishimiya/","https://jable.tv/search/IPX-238/","https://jable.tv/search/IPX-795/","https://jable.tv/search/JUR-652/","https://jable.tv/tags/Cosplay/","https://jable.tv/videos/adn-773/","https://jable.tv/videos/atid-662/","https://jable.tv/videos/atid-669/","https://jable.tv/videos/dass-891/","https://jable.tv/videos/ipx-238-c/","https://jable.tv/videos/ipx-370/","https://jable.tv/videos/ipx-401/","https://jable.tv/videos/ipx-590/","https://jable.tv/videos/ipx-607/","https://jable.tv/videos/ipx-700/","https://jable.tv/videos/ipx-795/","https://jable.tv/videos/ipzz-672/","https://jable.tv/videos/ipzz-698/","https://jable.tv/videos/ipzz-781/","https://jable.tv/videos/ipzz-805/","https://jable.tv/videos/ipzz-812/","https://jable.tv/videos/ipzz-815/","https://jable.tv/videos/ipzz-830/","https://jable.tv/videos/ipzz-842/","https://jable.tv/videos/jur-637/","https://jable.tv/videos/jur-652/","https://jable.tv/videos/mimk-051/","https://jable.tv/videos/mukd-564/","https://jable.tv/videos/mvg-158/","https://jable.tv/videos/rbd-834/","https://jable.tv/videos/snis-744/","https://jable.tv/videos/ssni-142/","https://jable.tv/videos/ure-133/","https://jable.tv/videos/waaa-634/","https://jable.tv/videos/wsa-001/"],"pathPrefixes":["/","/categories","/models","/models/2b60db870ab2d4375486d15a61f1b735","/models/2bf4c69cec5e6547b338e9fc8b9fd086","/models/3cfba41761d71d4bbd3635cc4b6c20fd","/models/76deee4a66140394afb9b342222318c9","/models/95898564176258a0cff5ef1f3e45431e","/models/hara-sarasa","/models/jessica-kizaki","/models/kirara-asuka","/models/kurea-hasumi","/models/momonogi-kana","/models/sakura-momo","/models/tiny","/models/yume-nishimiya","/search/IPX-238","/search/IPX-795","/search/JUR-652","/tags/Cosplay","/videos/adn-773","/videos/atid-662","/videos/atid-669","/videos/dass-891","/videos/ipx-238-c","/videos/ipx-370","/videos/ipx-401","/videos/ipx-590","/videos/ipx-607","/videos/ipx-700","/videos/ipx-795","/videos/ipzz-672","/videos/ipzz-698","/videos/ipzz-781","/videos/ipzz-805","/videos/ipzz-812","/videos/ipzz-815","/videos/ipzz-830","/videos/ipzz-842","/videos/jur-637","/videos/jur-652","/videos/mimk-051","/videos/mukd-564","/videos/mvg-158","/videos/rbd-834","/videos/snis-744","/videos/ssni-142","/videos/ure-133","/videos/waaa-634","/videos/wsa-001"]}}] |

#### 命中条件

| Field | Op | Value |
| --- | --- | --- |
| finalUrl | not_in_family | {"sameOriginRequired":true,"origins":["https://jable.tv"],"urls":["https://jable.tv/","https://jable.tv/categories/","https://jable.tv/models/","https://jable.tv/models/2b60db870ab2d4375486d15a61f1b735/","https://jable.tv/models/2bf4c69cec5e6547b338e9fc8b9fd086/","https://jable.tv/models/3cfba41761d71d4bbd3635cc4b6c20fd/","https://jable.tv/models/76deee4a66140394afb9b342222318c9/","https://jable.tv/models/95898564176258a0cff5ef1f3e45431e/","https://jable.tv/models/hara-sarasa/","https://jable.tv/models/jessica-kizaki/","https://jable.tv/models/kirara-asuka/","https://jable.tv/models/kurea-hasumi/","https://jable.tv/models/momonogi-kana/","https://jable.tv/models/sakura-momo/","https://jable.tv/models/tiny/","https://jable.tv/models/yume-nishimiya/","https://jable.tv/search/IPX-238/","https://jable.tv/search/IPX-795/","https://jable.tv/search/JUR-652/","https://jable.tv/tags/Cosplay/","https://jable.tv/videos/adn-773/","https://jable.tv/videos/atid-662/","https://jable.tv/videos/atid-669/","https://jable.tv/videos/dass-891/","https://jable.tv/videos/ipx-238-c/","https://jable.tv/videos/ipx-370/","https://jable.tv/videos/ipx-401/","https://jable.tv/videos/ipx-590/","https://jable.tv/videos/ipx-607/","https://jable.tv/videos/ipx-700/","https://jable.tv/videos/ipx-795/","https://jable.tv/videos/ipzz-672/","https://jable.tv/videos/ipzz-698/","https://jable.tv/videos/ipzz-781/","https://jable.tv/videos/ipzz-805/","https://jable.tv/videos/ipzz-812/","https://jable.tv/videos/ipzz-815/","https://jable.tv/videos/ipzz-830/","https://jable.tv/videos/ipzz-842/","https://jable.tv/videos/jur-637/","https://jable.tv/videos/jur-652/","https://jable.tv/videos/mimk-051/","https://jable.tv/videos/mukd-564/","https://jable.tv/videos/mvg-158/","https://jable.tv/videos/rbd-834/","https://jable.tv/videos/snis-744/","https://jable.tv/videos/ssni-142/","https://jable.tv/videos/ure-133/","https://jable.tv/videos/waaa-634/","https://jable.tv/videos/wsa-001/"],"pathPrefixes":["/","/categories","/models","/models/2b60db870ab2d4375486d15a61f1b735","/models/2bf4c69cec5e6547b338e9fc8b9fd086","/models/3cfba41761d71d4bbd3635cc4b6c20fd","/models/76deee4a66140394afb9b342222318c9","/models/95898564176258a0cff5ef1f3e45431e","/models/hara-sarasa","/models/jessica-kizaki","/models/kirara-asuka","/models/kurea-hasumi","/models/momonogi-kana","/models/sakura-momo","/models/tiny","/models/yume-nishimiya","/search/IPX-238","/search/IPX-795","/search/JUR-652","/tags/Cosplay","/videos/adn-773","/videos/atid-662","/videos/atid-669","/videos/dass-891","/videos/ipx-238-c","/videos/ipx-370","/videos/ipx-401","/videos/ipx-590","/videos/ipx-607","/videos/ipx-700","/videos/ipx-795","/videos/ipzz-672","/videos/ipzz-698","/videos/ipzz-781","/videos/ipzz-805","/videos/ipzz-812","/videos/ipzz-815","/videos/ipzz-830","/videos/ipzz-842","/videos/jur-637","/videos/jur-652","/videos/mimk-051","/videos/mukd-564","/videos/mvg-158","/videos/rbd-834","/videos/snis-744","/videos/ssni-142","/videos/ure-133","/videos/waaa-634","/videos/wsa-001"]} |

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

- 有潜在命中证据。

#### 审批通过后

- 仅在显式人工批准后继续执行对应动作。
- 执行完成后仍需按 recovery-rules 校验 URL、状态与证据。

#### 审批拒绝后

- 退回到安全意图集合。
- 建议回到这些文档：无直接文档命中，退回 README / intents 文档
