# Approval

## Approval Checkpoints

### Safe Action Whitelist

- Safe actions: `noop`, `activate-member`, `set-expanded`, `set-open`, `navigate`, `search-submit`, `download-book`
- Observed executable actions in current model: `navigate`
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
- 建议回到这些文档：[打开分类页-category-links-抖音-记录美好生活-小游戏-综艺.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开分类页-category-links-抖音-记录美好生活-小游戏-综艺.md), [打开功能页-utility-links-精选-推荐-用户服务协议.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开功能页-utility-links-精选-推荐-用户服务协议.md), [打开视频-content-links-a计划-香港水师力除猖獗海盗-少林与武当-旗人青年卷入江湖纷争-全16集-西游记续.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开视频-content-links-a计划-香港水师力除猖獗海盗-少林与武当-旗人青年卷入江湖纷争-全16集-西游记续.md)

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
- 建议回到这些文档：[打开分类页-category-links-抖音-记录美好生活-小游戏-综艺.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开分类页-category-links-抖音-记录美好生活-小游戏-综艺.md), [打开功能页-utility-links-精选-推荐-用户服务协议.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开功能页-utility-links-精选-推荐-用户服务协议.md), [打开视频-content-links-a计划-香港水师力除猖獗海盗-少林与武当-旗人青年卷入江湖纷争-全16集-西游记续.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开视频-content-links-a计划-香港水师力除猖獗海盗-少林与武当-旗人青年卷入江湖纷争-全16集-西游记续.md)

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
- 建议回到这些文档：[打开分类页-category-links-抖音-记录美好生活-小游戏-综艺.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开分类页-category-links-抖音-记录美好生活-小游戏-综艺.md), [打开功能页-utility-links-精选-推荐-用户服务协议.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开功能页-utility-links-精选-推荐-用户服务协议.md), [打开视频-content-links-a计划-香港水师力除猖獗海盗-少林与武当-旗人青年卷入江湖纷争-全16集-西游记续.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开视频-content-links-a计划-香港水师力除猖獗海盗-少林与武当-旗人青年卷入江湖纷争-全16集-西游记续.md)

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
- 建议回到这些文档：[打开分类页-category-links-抖音-记录美好生活-小游戏-综艺.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开分类页-category-links-抖音-记录美好生活-小游戏-综艺.md), [打开功能页-utility-links-精选-推荐-用户服务协议.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开功能页-utility-links-精选-推荐-用户服务协议.md), [打开视频-content-links-a计划-香港水师力除猖獗海盗-少林与武当-旗人青年卷入江湖纷争-全16集-西游记续.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开视频-content-links-a计划-香港水师力除猖獗海盗-少林与武当-旗人青年卷入江湖纷争-全16集-西游记续.md)

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
| URL Patterns | [{"type":"observed-url-family","value":{"sameOriginRequired":true,"origins":["https://www.douyin.com"],"urls":["https://www.douyin.com/?recommend=1","https://www.douyin.com/aboutus/","https://www.douyin.com/business_license/","https://www.douyin.com/draft/douyin_agreement/douyin_agreement_privacy.html?id=6773901168964798477","https://www.douyin.com/draft/douyin_agreement/douyin_agreement_user.html?id=6773906068725565448","https://www.douyin.com/friend_links","https://www.douyin.com/htmlmap/hotauthor_0_1","https://www.douyin.com/jingxuan","https://www.douyin.com/lvdetail/6533092649350464008?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=hot&recommend_rank_num=13&t=NaN","https://www.douyin.com/lvdetail/6533092649350464008?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=20&t=NaN","https://www.douyin.com/lvdetail/6569382977866826244?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=1&t=NaN","https://www.douyin.com/lvdetail/6669276191335121411?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=10&t=NaN","https://www.douyin.com/lvdetail/6715228735341068811?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=3&t=NaN","https://www.douyin.com/lvdetail/6768777394166694413?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=5&t=NaN","https://www.douyin.com/lvdetail/6775824589931938317?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=16&t=NaN","https://www.douyin.com/lvdetail/6781416114267095559?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=7&t=NaN","https://www.douyin.com/lvdetail/6815862987413258766?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=19&t=NaN","https://www.douyin.com/lvdetail/6815893549557481998?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=20&t=NaN","https://www.douyin.com/lvdetail/6816178204336718350?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=15&t=NaN","https://www.douyin.com/lvdetail/6961022957674201608?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=7&t=NaN","https://www.douyin.com/lvdetail/7052121382377194020?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=4&t=NaN","https://www.douyin.com/lvdetail/7193725893335122489?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=13&t=NaN","https://www.douyin.com/lvdetail/7276682277475025464?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=6&t=NaN","https://www.douyin.com/lvdetail/7322736128464060979?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=12&t=NaN","https://www.douyin.com/lvdetail/7384274834399691298?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=4&t=NaN","https://www.douyin.com/lvdetail/7384274834399691298?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=10&t=NaN","https://www.douyin.com/lvdetail/7413584383149343271?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=hot&recommend_rank_num=1&t=NaN","https://www.douyin.com/lvdetail/7464478521428017690?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=9&t=NaN","https://www.douyin.com/lvdetail/7502370405719245364?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=17&t=NaN","https://www.douyin.com/lvdetail/7613268073545466374?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=17&t=NaN","https://www.douyin.com/lvdetail/7616599573066154530?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=1&t=NaN","https://www.douyin.com/lvdetail/7623958623172952582?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=6&t=NaN","https://www.douyin.com/recovery_account/","https://www.douyin.com/vs","https://www.douyin.com/vschannel/anime","https://www.douyin.com/vschannel/documentary","https://www.douyin.com/vschannel/movie","https://www.douyin.com/vschannel/tv","https://www.douyin.com/vschannel/vs"],"pathPrefixes":["/","/aboutus","/business_license","/draft/douyin_agreement","/friend_links","/htmlmap/hotauthor_0_1","/jingxuan","/lvdetail/6533092649350464008","/lvdetail/6569382977866826244","/lvdetail/6669276191335121411","/lvdetail/6715228735341068811","/lvdetail/6768777394166694413","/lvdetail/6775824589931938317","/lvdetail/6781416114267095559","/lvdetail/6815862987413258766","/lvdetail/6815893549557481998","/lvdetail/6816178204336718350","/lvdetail/6961022957674201608","/lvdetail/7052121382377194020","/lvdetail/7193725893335122489","/lvdetail/7276682277475025464","/lvdetail/7322736128464060979","/lvdetail/7384274834399691298","/lvdetail/7413584383149343271","/lvdetail/7464478521428017690","/lvdetail/7502370405719245364","/lvdetail/7613268073545466374","/lvdetail/7616599573066154530","/lvdetail/7623958623172952582","/recovery_account","/vs","/vschannel/anime","/vschannel/documentary","/vschannel/movie","/vschannel/tv","/vschannel/vs"]}}] |

#### 命中条件

| Field | Op | Value |
| --- | --- | --- |
| finalUrl | not_in_family | {"sameOriginRequired":true,"origins":["https://www.douyin.com"],"urls":["https://www.douyin.com/?recommend=1","https://www.douyin.com/aboutus/","https://www.douyin.com/business_license/","https://www.douyin.com/draft/douyin_agreement/douyin_agreement_privacy.html?id=6773901168964798477","https://www.douyin.com/draft/douyin_agreement/douyin_agreement_user.html?id=6773906068725565448","https://www.douyin.com/friend_links","https://www.douyin.com/htmlmap/hotauthor_0_1","https://www.douyin.com/jingxuan","https://www.douyin.com/lvdetail/6533092649350464008?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=hot&recommend_rank_num=13&t=NaN","https://www.douyin.com/lvdetail/6533092649350464008?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=20&t=NaN","https://www.douyin.com/lvdetail/6569382977866826244?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=1&t=NaN","https://www.douyin.com/lvdetail/6669276191335121411?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=10&t=NaN","https://www.douyin.com/lvdetail/6715228735341068811?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=3&t=NaN","https://www.douyin.com/lvdetail/6768777394166694413?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=5&t=NaN","https://www.douyin.com/lvdetail/6775824589931938317?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=16&t=NaN","https://www.douyin.com/lvdetail/6781416114267095559?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=7&t=NaN","https://www.douyin.com/lvdetail/6815862987413258766?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=19&t=NaN","https://www.douyin.com/lvdetail/6815893549557481998?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=20&t=NaN","https://www.douyin.com/lvdetail/6816178204336718350?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=15&t=NaN","https://www.douyin.com/lvdetail/6961022957674201608?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=7&t=NaN","https://www.douyin.com/lvdetail/7052121382377194020?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=4&t=NaN","https://www.douyin.com/lvdetail/7193725893335122489?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=13&t=NaN","https://www.douyin.com/lvdetail/7276682277475025464?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=6&t=NaN","https://www.douyin.com/lvdetail/7322736128464060979?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=12&t=NaN","https://www.douyin.com/lvdetail/7384274834399691298?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=4&t=NaN","https://www.douyin.com/lvdetail/7384274834399691298?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=10&t=NaN","https://www.douyin.com/lvdetail/7413584383149343271?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=hot&recommend_rank_num=1&t=NaN","https://www.douyin.com/lvdetail/7464478521428017690?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=9&t=NaN","https://www.douyin.com/lvdetail/7502370405719245364?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=17&t=NaN","https://www.douyin.com/lvdetail/7613268073545466374?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=17&t=NaN","https://www.douyin.com/lvdetail/7616599573066154530?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=1&t=NaN","https://www.douyin.com/lvdetail/7623958623172952582?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=6&t=NaN","https://www.douyin.com/recovery_account/","https://www.douyin.com/vs","https://www.douyin.com/vschannel/anime","https://www.douyin.com/vschannel/documentary","https://www.douyin.com/vschannel/movie","https://www.douyin.com/vschannel/tv","https://www.douyin.com/vschannel/vs"],"pathPrefixes":["/","/aboutus","/business_license","/draft/douyin_agreement","/friend_links","/htmlmap/hotauthor_0_1","/jingxuan","/lvdetail/6533092649350464008","/lvdetail/6569382977866826244","/lvdetail/6669276191335121411","/lvdetail/6715228735341068811","/lvdetail/6768777394166694413","/lvdetail/6775824589931938317","/lvdetail/6781416114267095559","/lvdetail/6815862987413258766","/lvdetail/6815893549557481998","/lvdetail/6816178204336718350","/lvdetail/6961022957674201608","/lvdetail/7052121382377194020","/lvdetail/7193725893335122489","/lvdetail/7276682277475025464","/lvdetail/7322736128464060979","/lvdetail/7384274834399691298","/lvdetail/7413584383149343271","/lvdetail/7464478521428017690","/lvdetail/7502370405719245364","/lvdetail/7613268073545466374","/lvdetail/7616599573066154530","/lvdetail/7623958623172952582","/recovery_account","/vs","/vschannel/anime","/vschannel/documentary","/vschannel/movie","/vschannel/tv","/vschannel/vs"]} |

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
