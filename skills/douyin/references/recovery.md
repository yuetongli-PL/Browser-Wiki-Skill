# Recovery

## Recovery

### already-satisfied

- Severity: `low`
- Strategy: `noop-return`
- Retryable: `false` (max retries: 0)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| resolution.status | eq | "already-satisfied" |

#### 恢复动作

- 当前状态已经满足目标，将返回 noop 计划。
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| currentElementState | already-satisfied, noop | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |
| Edge IDs | edge_0174b5629ce9, edge_01cec12b94be, edge_083bb0ea0740, edge_0a036a63c69f, edge_0ab84720e5d0, edge_10a02c3f639e, edge_1e3ff24f729d, edge_21c8111d875a, edge_241648ba688f, edge_243483b175a4, edge_262c1d88f007, edge_308ebed3a027, edge_338f3180d219, edge_36ca421fae12, edge_379fec7148aa, edge_4790b81b09b7, edge_4a272b453998, edge_4d07f25ecaaa, edge_4f0d7abbbde0, edge_4fb6a4b68d04, edge_50a3aafaf6dd, edge_54208fff4c49, edge_550a4313dd2a, edge_5587f0c8b5ae, edge_58ca1c008305, edge_597cf6fc2920, edge_59d20be66087, edge_5a97e5bb891e, edge_5b810f9f6652, edge_5cb4d3366004, edge_63e08160bfbc, edge_67345fc770d8, edge_67d72218c40f, edge_67e855a78356, edge_6a09dd7c589f, edge_6cdf0f9a231f, edge_75a7902aa122, edge_77a90a56bbaf, edge_77c5268e7f79, edge_8503b6067d66, edge_85f31712adc7, edge_867dd662c02e, edge_87307ffc9bd1, edge_88d338db692b, edge_8b8c53dbe1f4, edge_938a748b7a4e, edge_98a44f60a54f, edge_9c8b552d0fec, edge_a1b21f9641c6, edge_a43d24fc766d, edge_a7a1002ed136, edge_a85fe4e30a20, edge_b005e8b3a670, edge_b0ca9c582819, edge_bab47a5f02e1, edge_bbe1f99471d0, edge_bde077030db4, edge_c1e032a63f13, edge_c58128ebce31, edge_c5b580b5d661, edge_cdb31c32f827, edge_d373122262e4, edge_d4376f823cb9, edge_d9126dcfa942, edge_da957c3eaf38, edge_dc60ce075534, edge_e460e0900ec3, edge_e4a253be4e3a, edge_eb423b19bc8c, edge_ecde38ad4346, edge_f01839d878b3, edge_f09d829500de, edge_f0e64052c0d3, edge_f7609d513136, edge_f7e7b8772232, edge_f9320578022a, edge_f9946b5748ca |
| Doc Paths | - |

### ambiguous-target

- Severity: `low`
- Strategy: `clarify-target`
- Retryable: `false` (max retries: 0)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| resolution.status | eq | "ambiguous-target" |

#### 恢复动作

- 这个说法可能对应多个视频或多个用户，请给我更具体的视频标题或用户名。
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| resolution.status | resolved | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |
| Edge IDs | edge_0174b5629ce9, edge_01cec12b94be, edge_083bb0ea0740, edge_0a036a63c69f, edge_0ab84720e5d0, edge_10a02c3f639e, edge_1e3ff24f729d, edge_21c8111d875a, edge_241648ba688f, edge_243483b175a4, edge_262c1d88f007, edge_308ebed3a027, edge_338f3180d219, edge_36ca421fae12, edge_379fec7148aa, edge_4790b81b09b7, edge_4a272b453998, edge_4d07f25ecaaa, edge_4f0d7abbbde0, edge_4fb6a4b68d04, edge_50a3aafaf6dd, edge_54208fff4c49, edge_550a4313dd2a, edge_5587f0c8b5ae, edge_58ca1c008305, edge_597cf6fc2920, edge_59d20be66087, edge_5a97e5bb891e, edge_5b810f9f6652, edge_5cb4d3366004, edge_63e08160bfbc, edge_67345fc770d8, edge_67d72218c40f, edge_67e855a78356, edge_6a09dd7c589f, edge_6cdf0f9a231f, edge_75a7902aa122, edge_77a90a56bbaf, edge_77c5268e7f79, edge_8503b6067d66, edge_85f31712adc7, edge_867dd662c02e, edge_87307ffc9bd1, edge_88d338db692b, edge_8b8c53dbe1f4, edge_938a748b7a4e, edge_98a44f60a54f, edge_9c8b552d0fec, edge_a1b21f9641c6, edge_a43d24fc766d, edge_a7a1002ed136, edge_a85fe4e30a20, edge_b005e8b3a670, edge_b0ca9c582819, edge_bab47a5f02e1, edge_bbe1f99471d0, edge_bde077030db4, edge_c1e032a63f13, edge_c58128ebce31, edge_c5b580b5d661, edge_cdb31c32f827, edge_d373122262e4, edge_d4376f823cb9, edge_d9126dcfa942, edge_da957c3eaf38, edge_dc60ce075534, edge_e460e0900ec3, edge_e4a253be4e3a, edge_eb423b19bc8c, edge_ecde38ad4346, edge_f01839d878b3, edge_f09d829500de, edge_f0e64052c0d3, edge_f7609d513136, edge_f7e7b8772232, edge_f9320578022a, edge_f9946b5748ca |
| Doc Paths | - |

### approval-required

- Severity: `high`
- Strategy: `ask-approval`
- Retryable: `false` (max retries: 0)
- Requires Approval: `true`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| approvalRuleId | eq | "approval_auth-change" |
| approvalRuleId | eq | "approval_destructive" |
| approvalRuleId | eq | "approval_financial" |
| approvalRuleId | eq | "approval_submit-or-commit" |
| approvalRuleId | eq | "approval_unknown-side-effect" |
| approvalRuleId | eq | "approval_unverified-navigation" |
| approvalRuleId | eq | "approval_upload" |

#### 恢复动作

- Pause automation before executing the risky step.
- Present the matching approval checkpoint and rationale.
- Resume only after explicit human approval.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| approval.status | approved | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0003, s0013, s0014, s0015, s0016, s0017 |
| Edge IDs | edge_1e3ff24f729d, edge_308ebed3a027, edge_379fec7148aa, edge_50a3aafaf6dd, edge_59d20be66087, edge_5b810f9f6652, edge_67d72218c40f, edge_6cdf0f9a231f, edge_88d338db692b, edge_938a748b7a4e, edge_a43d24fc766d, edge_b0ca9c582819, edge_e4a253be4e3a, edge_f01839d878b3, edge_f09d829500de, edge_f7e7b8772232, edge_f9946b5748ca |
| Doc Paths | [打开分类页-category-links-抖音-记录美好生活-小游戏-综艺.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开分类页-category-links-抖音-记录美好生活-小游戏-综艺.md), [打开功能页-utility-links-精选-推荐-用户服务协议.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开功能页-utility-links-精选-推荐-用户服务协议.md), [打开视频-content-links-a计划-香港水师力除猖獗海盗-少林与武当-旗人青年卷入江湖纷争-全16集-西游记续.md](../../../knowledge-base/www.douyin.com/raw/step-6-docs/20260418T150134939Z_www.douyin.com_docs/intents/打开视频-content-links-a计划-香港水师力除猖獗海盗-少林与武当-旗人青年卷入江湖纷争-全16集-西游记续.md) |

### evidence-mismatch

- Severity: `medium`
- Strategy: `retry-once`
- Retryable: `true` (max retries: 1)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| finalUrl | not_in_set | ["https://www.douyin.com/?recommend=1","https://www.douyin.com/aboutus/","https://www.douyin.com/business_license/","https://www.douyin.com/draft/douyin_agreement/douyin_agreement_privacy.html?id=6773901168964798477","https://www.douyin.com/draft/douyin_agreement/douyin_agreement_user.html?id=6773906068725565448","https://www.douyin.com/friend_links","https://www.douyin.com/htmlmap/hotauthor_0_1","https://www.douyin.com/jingxuan","https://www.douyin.com/lvdetail/6533092649350464008?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=hot&recommend_rank_num=13&t=NaN","https://www.douyin.com/lvdetail/6533092649350464008?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=20&t=NaN","https://www.douyin.com/lvdetail/6569382977866826244?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=1&t=NaN","https://www.douyin.com/lvdetail/6669276191335121411?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=10&t=NaN","https://www.douyin.com/lvdetail/6715228735341068811?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=3&t=NaN","https://www.douyin.com/lvdetail/6768777394166694413?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=5&t=NaN","https://www.douyin.com/lvdetail/6775824589931938317?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=16&t=NaN","https://www.douyin.com/lvdetail/6781416114267095559?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=movie&recommend_rank_num=7&t=NaN","https://www.douyin.com/lvdetail/6815862987413258766?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=19&t=NaN","https://www.douyin.com/lvdetail/6815893549557481998?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=20&t=NaN","https://www.douyin.com/lvdetail/6816178204336718350?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=documentation&recommend_rank_num=15&t=NaN","https://www.douyin.com/lvdetail/6961022957674201608?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=7&t=NaN","https://www.douyin.com/lvdetail/7052121382377194020?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=4&t=NaN","https://www.douyin.com/lvdetail/7193725893335122489?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=13&t=NaN","https://www.douyin.com/lvdetail/7276682277475025464?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=6&t=NaN","https://www.douyin.com/lvdetail/7322736128464060979?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=12&t=NaN","https://www.douyin.com/lvdetail/7384274834399691298?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=4&t=NaN","https://www.douyin.com/lvdetail/7384274834399691298?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=10&t=NaN","https://www.douyin.com/lvdetail/7413584383149343271?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=hot&recommend_rank_num=1&t=NaN","https://www.douyin.com/lvdetail/7464478521428017690?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=9&t=NaN","https://www.douyin.com/lvdetail/7502370405719245364?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=17&t=NaN","https://www.douyin.com/lvdetail/7613268073545466374?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=tv&recommend_rank_num=17&t=NaN","https://www.douyin.com/lvdetail/7616599573066154530?enter_from_merge=vs&enter_method=live_cover&previous_page=vs&previous_page_enter_method=live_cover&previous_page_sub_tab=anime&recommend_rank_num=1&t=NaN","https://www.douyin.com/lvdetail/7623958623172952582?enter_from_merge=vschannel&enter_method=live_cover&previous_page=vschannel&previous_page_enter_method=live_cover&previous_page_sub_tab=show&recommend_rank_num=6&t=NaN","https://www.douyin.com/recovery_account/","https://www.douyin.com/vs","https://www.douyin.com/vschannel/anime","https://www.douyin.com/vschannel/documentary","https://www.douyin.com/vschannel/movie","https://www.douyin.com/vschannel/tv","https://www.douyin.com/vschannel/vs"] |
| title | unmatched | ["【抖音】关于我们 - 企业文化,社会责任,总部办公地址,联系方式,市场商务合作","【抖音】记录美好生活-Douyin.com","动画","友情链接 - 抖音","抖音-记录美好生活","抖音热门创作者_第1页 - 抖音","抖音精选电脑版 - 抖音旗下优质视频平台","电影","电视剧","纪录片频道","综艺","验证码中间页"] |
| currentElementState | neq | "decision-rule.expected" |

#### 恢复动作

- Re-check the expected decision rule and target state.
- Retry the same action once if the mismatch is transient.
- If the mismatch persists, fall back to re-anchor-state.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| currentElementState | decision-rule.expected | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |
| Edge IDs | edge_0174b5629ce9, edge_01cec12b94be, edge_083bb0ea0740, edge_0a036a63c69f, edge_0ab84720e5d0, edge_10a02c3f639e, edge_1e3ff24f729d, edge_21c8111d875a, edge_241648ba688f, edge_243483b175a4, edge_262c1d88f007, edge_308ebed3a027, edge_338f3180d219, edge_36ca421fae12, edge_379fec7148aa, edge_4790b81b09b7, edge_4a272b453998, edge_4d07f25ecaaa, edge_4f0d7abbbde0, edge_4fb6a4b68d04, edge_50a3aafaf6dd, edge_54208fff4c49, edge_550a4313dd2a, edge_5587f0c8b5ae, edge_58ca1c008305, edge_597cf6fc2920, edge_59d20be66087, edge_5a97e5bb891e, edge_5b810f9f6652, edge_5cb4d3366004, edge_63e08160bfbc, edge_67345fc770d8, edge_67d72218c40f, edge_67e855a78356, edge_6a09dd7c589f, edge_6cdf0f9a231f, edge_75a7902aa122, edge_77a90a56bbaf, edge_77c5268e7f79, edge_8503b6067d66, edge_85f31712adc7, edge_867dd662c02e, edge_87307ffc9bd1, edge_88d338db692b, edge_8b8c53dbe1f4, edge_938a748b7a4e, edge_98a44f60a54f, edge_9c8b552d0fec, edge_a1b21f9641c6, edge_a43d24fc766d, edge_a7a1002ed136, edge_a85fe4e30a20, edge_b005e8b3a670, edge_b0ca9c582819, edge_bab47a5f02e1, edge_bbe1f99471d0, edge_bde077030db4, edge_c1e032a63f13, edge_c58128ebce31, edge_c5b580b5d661, edge_cdb31c32f827, edge_d373122262e4, edge_d4376f823cb9, edge_d9126dcfa942, edge_da957c3eaf38, edge_dc60ce075534, edge_e460e0900ec3, edge_e4a253be4e3a, edge_eb423b19bc8c, edge_ecde38ad4346, edge_f01839d878b3, edge_f09d829500de, edge_f0e64052c0d3, edge_f7609d513136, edge_f7e7b8772232, edge_f9320578022a, edge_f9946b5748ca |
| Doc Paths | - |

### missing-slot

- Severity: `low`
- Strategy: `clarify-slot`
- Retryable: `false` (max retries: 0)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| resolution.status | eq | "missing-slot" |

#### 恢复动作

- 你要找哪个视频或哪个用户？我可以列出当前有动作证据的候选项。
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| resolution.status | resolved | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |
| Edge IDs | edge_0174b5629ce9, edge_01cec12b94be, edge_083bb0ea0740, edge_0a036a63c69f, edge_0ab84720e5d0, edge_10a02c3f639e, edge_1e3ff24f729d, edge_21c8111d875a, edge_241648ba688f, edge_243483b175a4, edge_262c1d88f007, edge_308ebed3a027, edge_338f3180d219, edge_36ca421fae12, edge_379fec7148aa, edge_4790b81b09b7, edge_4a272b453998, edge_4d07f25ecaaa, edge_4f0d7abbbde0, edge_4fb6a4b68d04, edge_50a3aafaf6dd, edge_54208fff4c49, edge_550a4313dd2a, edge_5587f0c8b5ae, edge_58ca1c008305, edge_597cf6fc2920, edge_59d20be66087, edge_5a97e5bb891e, edge_5b810f9f6652, edge_5cb4d3366004, edge_63e08160bfbc, edge_67345fc770d8, edge_67d72218c40f, edge_67e855a78356, edge_6a09dd7c589f, edge_6cdf0f9a231f, edge_75a7902aa122, edge_77a90a56bbaf, edge_77c5268e7f79, edge_8503b6067d66, edge_85f31712adc7, edge_867dd662c02e, edge_87307ffc9bd1, edge_88d338db692b, edge_8b8c53dbe1f4, edge_938a748b7a4e, edge_98a44f60a54f, edge_9c8b552d0fec, edge_a1b21f9641c6, edge_a43d24fc766d, edge_a7a1002ed136, edge_a85fe4e30a20, edge_b005e8b3a670, edge_b0ca9c582819, edge_bab47a5f02e1, edge_bbe1f99471d0, edge_bde077030db4, edge_c1e032a63f13, edge_c58128ebce31, edge_c5b580b5d661, edge_cdb31c32f827, edge_d373122262e4, edge_d4376f823cb9, edge_d9126dcfa942, edge_da957c3eaf38, edge_dc60ce075534, edge_e460e0900ec3, edge_e4a253be4e3a, edge_eb423b19bc8c, edge_ecde38ad4346, edge_f01839d878b3, edge_f09d829500de, edge_f0e64052c0d3, edge_f7609d513136, edge_f7e7b8772232, edge_f9320578022a, edge_f9946b5748ca |
| Doc Paths | - |

### out-of-domain

- Severity: `high`
- Strategy: `reject`
- Retryable: `false` (max retries: 0)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| resolution.status | eq | "out-of-domain" |

#### 恢复动作

- 当前页面入口只覆盖安全的切换/展开类意图，不支持提交、删除、购买、上传等高风险动作。
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| resolution.status | resolved | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |
| Edge IDs | edge_0174b5629ce9, edge_01cec12b94be, edge_083bb0ea0740, edge_0a036a63c69f, edge_0ab84720e5d0, edge_10a02c3f639e, edge_1e3ff24f729d, edge_21c8111d875a, edge_241648ba688f, edge_243483b175a4, edge_262c1d88f007, edge_308ebed3a027, edge_338f3180d219, edge_36ca421fae12, edge_379fec7148aa, edge_4790b81b09b7, edge_4a272b453998, edge_4d07f25ecaaa, edge_4f0d7abbbde0, edge_4fb6a4b68d04, edge_50a3aafaf6dd, edge_54208fff4c49, edge_550a4313dd2a, edge_5587f0c8b5ae, edge_58ca1c008305, edge_597cf6fc2920, edge_59d20be66087, edge_5a97e5bb891e, edge_5b810f9f6652, edge_5cb4d3366004, edge_63e08160bfbc, edge_67345fc770d8, edge_67d72218c40f, edge_67e855a78356, edge_6a09dd7c589f, edge_6cdf0f9a231f, edge_75a7902aa122, edge_77a90a56bbaf, edge_77c5268e7f79, edge_8503b6067d66, edge_85f31712adc7, edge_867dd662c02e, edge_87307ffc9bd1, edge_88d338db692b, edge_8b8c53dbe1f4, edge_938a748b7a4e, edge_98a44f60a54f, edge_9c8b552d0fec, edge_a1b21f9641c6, edge_a43d24fc766d, edge_a7a1002ed136, edge_a85fe4e30a20, edge_b005e8b3a670, edge_b0ca9c582819, edge_bab47a5f02e1, edge_bbe1f99471d0, edge_bde077030db4, edge_c1e032a63f13, edge_c58128ebce31, edge_c5b580b5d661, edge_cdb31c32f827, edge_d373122262e4, edge_d4376f823cb9, edge_d9126dcfa942, edge_da957c3eaf38, edge_dc60ce075534, edge_e460e0900ec3, edge_e4a253be4e3a, edge_eb423b19bc8c, edge_ecde38ad4346, edge_f01839d878b3, edge_f09d829500de, edge_f0e64052c0d3, edge_f7609d513136, edge_f7e7b8772232, edge_f9320578022a, edge_f9946b5748ca |
| Doc Paths | - |

### stale-state

- Severity: `medium`
- Strategy: `re-anchor-state`
- Retryable: `true` (max retries: 1)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| currentStateId | unmatched | ["s0000","s0002","s0004","s0005","s0006","s0007","s0008","s0009","s0010","s0011","s0013","s0014","s0015","s0016","s0017","s0018","s0019","s0020","s0021","s0029","s0030","s0031","s0032","s0040","s0041","s0042","s0043","s0051","s0052","s0053","s0054","s0062","s0063","s0064","s0065","s0073","s0074","s0075","s0076"] |
| currentElementState | not_in_set | ["s0000","s0002","s0004","s0005","s0006","s0007","s0008","s0009","s0010","s0011","s0013","s0014","s0015","s0016","s0017","s0018","s0019","s0020","s0021","s0029","s0030","s0031","s0032","s0040","s0041","s0042","s0043","s0051","s0052","s0053","s0054","s0062","s0063","s0064","s0065","s0073","s0074","s0075","s0076"] |

#### 恢复动作

- Compare currentElementState against analyzed concrete states.
- Re-anchor to the nearest matching analyzed state within the observed URL family.
- If no direct match exists, fall back to the base URL and re-evaluate intent rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| currentStateId | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |
| Edge IDs | edge_0174b5629ce9, edge_01cec12b94be, edge_083bb0ea0740, edge_0a036a63c69f, edge_0ab84720e5d0, edge_10a02c3f639e, edge_1e3ff24f729d, edge_21c8111d875a, edge_241648ba688f, edge_243483b175a4, edge_262c1d88f007, edge_308ebed3a027, edge_338f3180d219, edge_36ca421fae12, edge_379fec7148aa, edge_4790b81b09b7, edge_4a272b453998, edge_4d07f25ecaaa, edge_4f0d7abbbde0, edge_4fb6a4b68d04, edge_50a3aafaf6dd, edge_54208fff4c49, edge_550a4313dd2a, edge_5587f0c8b5ae, edge_58ca1c008305, edge_597cf6fc2920, edge_59d20be66087, edge_5a97e5bb891e, edge_5b810f9f6652, edge_5cb4d3366004, edge_63e08160bfbc, edge_67345fc770d8, edge_67d72218c40f, edge_67e855a78356, edge_6a09dd7c589f, edge_6cdf0f9a231f, edge_75a7902aa122, edge_77a90a56bbaf, edge_77c5268e7f79, edge_8503b6067d66, edge_85f31712adc7, edge_867dd662c02e, edge_87307ffc9bd1, edge_88d338db692b, edge_8b8c53dbe1f4, edge_938a748b7a4e, edge_98a44f60a54f, edge_9c8b552d0fec, edge_a1b21f9641c6, edge_a43d24fc766d, edge_a7a1002ed136, edge_a85fe4e30a20, edge_b005e8b3a670, edge_b0ca9c582819, edge_bab47a5f02e1, edge_bbe1f99471d0, edge_bde077030db4, edge_c1e032a63f13, edge_c58128ebce31, edge_c5b580b5d661, edge_cdb31c32f827, edge_d373122262e4, edge_d4376f823cb9, edge_d9126dcfa942, edge_da957c3eaf38, edge_dc60ce075534, edge_e460e0900ec3, edge_e4a253be4e3a, edge_eb423b19bc8c, edge_ecde38ad4346, edge_f01839d878b3, edge_f09d829500de, edge_f0e64052c0d3, edge_f7609d513136, edge_f7e7b8772232, edge_f9320578022a, edge_f9946b5748ca |
| Doc Paths | - |

### transition-failed

- Severity: `high`
- Strategy: `re-anchor-state`
- Retryable: `true` (max retries: 1)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| actionOutcome | eq | "failed" |
| toStateId | not_in_set | ["s0000","s0002","s0003","s0004","s0005","s0006","s0007","s0008","s0009","s0010","s0011","s0013","s0014","s0015","s0016","s0017","s0018","s0019","s0020","s0021","s0029","s0030","s0031","s0032","s0040","s0041","s0042","s0043","s0051","s0052","s0053","s0054","s0062","s0063","s0064","s0065","s0073","s0074","s0075","s0076"] |

#### 恢复动作

- Stop automatic progression after the failed act rule.
- Re-anchor the runtime state to the nearest analyzed state.
- Offer a safe actionable target set before retrying.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| toStateId | s0000, s0002, s0003, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |
| Edge IDs | edge_0174b5629ce9, edge_01cec12b94be, edge_083bb0ea0740, edge_0a036a63c69f, edge_0ab84720e5d0, edge_10a02c3f639e, edge_1e3ff24f729d, edge_21c8111d875a, edge_241648ba688f, edge_243483b175a4, edge_262c1d88f007, edge_308ebed3a027, edge_338f3180d219, edge_36ca421fae12, edge_379fec7148aa, edge_4790b81b09b7, edge_4a272b453998, edge_4d07f25ecaaa, edge_4f0d7abbbde0, edge_4fb6a4b68d04, edge_50a3aafaf6dd, edge_54208fff4c49, edge_550a4313dd2a, edge_5587f0c8b5ae, edge_58ca1c008305, edge_597cf6fc2920, edge_59d20be66087, edge_5a97e5bb891e, edge_5b810f9f6652, edge_5cb4d3366004, edge_63e08160bfbc, edge_67345fc770d8, edge_67d72218c40f, edge_67e855a78356, edge_6a09dd7c589f, edge_6cdf0f9a231f, edge_75a7902aa122, edge_77a90a56bbaf, edge_77c5268e7f79, edge_8503b6067d66, edge_85f31712adc7, edge_867dd662c02e, edge_87307ffc9bd1, edge_88d338db692b, edge_8b8c53dbe1f4, edge_938a748b7a4e, edge_98a44f60a54f, edge_9c8b552d0fec, edge_a1b21f9641c6, edge_a43d24fc766d, edge_a7a1002ed136, edge_a85fe4e30a20, edge_b005e8b3a670, edge_b0ca9c582819, edge_bab47a5f02e1, edge_bbe1f99471d0, edge_bde077030db4, edge_c1e032a63f13, edge_c58128ebce31, edge_c5b580b5d661, edge_cdb31c32f827, edge_d373122262e4, edge_d4376f823cb9, edge_d9126dcfa942, edge_da957c3eaf38, edge_dc60ce075534, edge_e460e0900ec3, edge_e4a253be4e3a, edge_eb423b19bc8c, edge_ecde38ad4346, edge_f01839d878b3, edge_f09d829500de, edge_f0e64052c0d3, edge_f7609d513136, edge_f7e7b8772232, edge_f9320578022a, edge_f9946b5748ca |
| Doc Paths | - |

### unknown-intent

- Severity: `medium`
- Strategy: `reject`
- Retryable: `false` (max retries: 0)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| resolution.status | eq | "unknown-intent" |

#### 恢复动作

- 我只支持页面内安全的切换、展开、打开类操作。
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| resolution.status | resolved | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |
| Edge IDs | edge_0174b5629ce9, edge_01cec12b94be, edge_083bb0ea0740, edge_0a036a63c69f, edge_0ab84720e5d0, edge_10a02c3f639e, edge_1e3ff24f729d, edge_21c8111d875a, edge_241648ba688f, edge_243483b175a4, edge_262c1d88f007, edge_308ebed3a027, edge_338f3180d219, edge_36ca421fae12, edge_379fec7148aa, edge_4790b81b09b7, edge_4a272b453998, edge_4d07f25ecaaa, edge_4f0d7abbbde0, edge_4fb6a4b68d04, edge_50a3aafaf6dd, edge_54208fff4c49, edge_550a4313dd2a, edge_5587f0c8b5ae, edge_58ca1c008305, edge_597cf6fc2920, edge_59d20be66087, edge_5a97e5bb891e, edge_5b810f9f6652, edge_5cb4d3366004, edge_63e08160bfbc, edge_67345fc770d8, edge_67d72218c40f, edge_67e855a78356, edge_6a09dd7c589f, edge_6cdf0f9a231f, edge_75a7902aa122, edge_77a90a56bbaf, edge_77c5268e7f79, edge_8503b6067d66, edge_85f31712adc7, edge_867dd662c02e, edge_87307ffc9bd1, edge_88d338db692b, edge_8b8c53dbe1f4, edge_938a748b7a4e, edge_98a44f60a54f, edge_9c8b552d0fec, edge_a1b21f9641c6, edge_a43d24fc766d, edge_a7a1002ed136, edge_a85fe4e30a20, edge_b005e8b3a670, edge_b0ca9c582819, edge_bab47a5f02e1, edge_bbe1f99471d0, edge_bde077030db4, edge_c1e032a63f13, edge_c58128ebce31, edge_c5b580b5d661, edge_cdb31c32f827, edge_d373122262e4, edge_d4376f823cb9, edge_d9126dcfa942, edge_da957c3eaf38, edge_dc60ce075534, edge_e460e0900ec3, edge_e4a253be4e3a, edge_eb423b19bc8c, edge_ecde38ad4346, edge_f01839d878b3, edge_f09d829500de, edge_f0e64052c0d3, edge_f7609d513136, edge_f7e7b8772232, edge_f9320578022a, edge_f9946b5748ca |
| Doc Paths | - |

### unsupported-target

- Severity: `medium`
- Strategy: `fall-back-to-safe-targets`
- Retryable: `false` (max retries: 0)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| resolution.status | eq | "unsupported-target" |

#### 恢复动作

- 这个视频或用户可以识别，但当前没有可执行的动作证据。要不要换一个已观察到可打开的目标？
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| resolution.status | resolved | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002, s0004, s0005, s0006, s0007, s0008, s0009, s0010, s0011, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0029, s0030, s0031, s0032, s0040, s0041, s0042, s0043, s0051, s0052, s0053, s0054, s0062, s0063, s0064, s0065, s0073, s0074, s0075, s0076 |
| Edge IDs | edge_0174b5629ce9, edge_01cec12b94be, edge_083bb0ea0740, edge_0a036a63c69f, edge_0ab84720e5d0, edge_10a02c3f639e, edge_1e3ff24f729d, edge_21c8111d875a, edge_241648ba688f, edge_243483b175a4, edge_262c1d88f007, edge_308ebed3a027, edge_338f3180d219, edge_36ca421fae12, edge_379fec7148aa, edge_4790b81b09b7, edge_4a272b453998, edge_4d07f25ecaaa, edge_4f0d7abbbde0, edge_4fb6a4b68d04, edge_50a3aafaf6dd, edge_54208fff4c49, edge_550a4313dd2a, edge_5587f0c8b5ae, edge_58ca1c008305, edge_597cf6fc2920, edge_59d20be66087, edge_5a97e5bb891e, edge_5b810f9f6652, edge_5cb4d3366004, edge_63e08160bfbc, edge_67345fc770d8, edge_67d72218c40f, edge_67e855a78356, edge_6a09dd7c589f, edge_6cdf0f9a231f, edge_75a7902aa122, edge_77a90a56bbaf, edge_77c5268e7f79, edge_8503b6067d66, edge_85f31712adc7, edge_867dd662c02e, edge_87307ffc9bd1, edge_88d338db692b, edge_8b8c53dbe1f4, edge_938a748b7a4e, edge_98a44f60a54f, edge_9c8b552d0fec, edge_a1b21f9641c6, edge_a43d24fc766d, edge_a7a1002ed136, edge_a85fe4e30a20, edge_b005e8b3a670, edge_b0ca9c582819, edge_bab47a5f02e1, edge_bbe1f99471d0, edge_bde077030db4, edge_c1e032a63f13, edge_c58128ebce31, edge_c5b580b5d661, edge_cdb31c32f827, edge_d373122262e4, edge_d4376f823cb9, edge_d9126dcfa942, edge_da957c3eaf38, edge_dc60ce075534, edge_e460e0900ec3, edge_e4a253be4e3a, edge_eb423b19bc8c, edge_ecde38ad4346, edge_f01839d878b3, edge_f09d829500de, edge_f0e64052c0d3, edge_f7609d513136, edge_f7e7b8772232, edge_f9320578022a, edge_f9946b5748ca |
| Doc Paths | - |
