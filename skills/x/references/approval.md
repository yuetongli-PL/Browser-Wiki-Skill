# Approval

## Approval Checkpoints

### Safe Action Whitelist

- Safe actions: `noop`, `activate-member`, `set-expanded`, `set-open`, `navigate`, `search-submit`, `download-book`, `query-social`, `download-media`
- Observed executable actions in current model: `navigate`, `search-submit`, `select-member`
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
- 建议回到这些文档：[open-book-content-links-18-x.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/open-book-content-links-18-x.md), [search-book-search-form.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/search-book-search-form.md), [set-active-member-tab-group-for-you-following.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/set-active-member-tab-group-for-you-following.md)

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
- 建议回到这些文档：[open-book-content-links-18-x.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/open-book-content-links-18-x.md), [search-book-search-form.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/search-book-search-form.md), [set-active-member-tab-group-for-you-following.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/set-active-member-tab-group-for-you-following.md)

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
- 建议回到这些文档：[open-book-content-links-18-x.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/open-book-content-links-18-x.md), [search-book-search-form.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/search-book-search-form.md), [set-active-member-tab-group-for-you-following.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/set-active-member-tab-group-for-you-following.md)

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
- 建议回到这些文档：[open-book-content-links-18-x.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/open-book-content-links-18-x.md), [search-book-search-form.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/search-book-search-form.md), [set-active-member-tab-group-for-you-following.md](../../../knowledge-base/x.com/raw/step-6-docs/20260426T044909510Z_x.com_docs/intents/set-active-member-tab-group-for-you-following.md)

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
| URL Patterns | [{"type":"observed-url-family","value":{"sameOriginRequired":true,"origins":["https://x.com"],"urls":["https://x.com/home","https://x.com/home?searchkey=open+source","https://x.com/opensource/status/1646527756281315330"],"pathPrefixes":["/home","/opensource/status"]}}] |

#### 命中条件

| Field | Op | Value |
| --- | --- | --- |
| finalUrl | not_in_family | {"sameOriginRequired":true,"origins":["https://x.com"],"urls":["https://x.com/home","https://x.com/home?searchkey=open+source","https://x.com/opensource/status/1646527756281315330"],"pathPrefixes":["/home","/opensource/status"]} |

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
