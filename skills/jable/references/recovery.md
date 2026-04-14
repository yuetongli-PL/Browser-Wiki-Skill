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
| currentElementState | already-satisfied, noop | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |
| Edge IDs | edge_04f5f6d3e225, edge_083bb0ea0740, edge_098f115fd961, edge_0c451ae7c815, edge_0c732bf25f34, edge_0dedfd3f9f44, edge_104de0f2cde3, edge_192676b7f88a, edge_203eb953f032, edge_22983ba98e6b, edge_2319e352f503, edge_2362ae88d8a8, edge_24a4d112ea54, edge_26438ba40e0b, edge_2700c5c85950, edge_2724cbf57f88, edge_2b159d2bf33f, edge_2f08384e32d9, edge_2f9c8bdf57ed, edge_308ebed3a027, edge_3302e52c61f8, edge_36ca421fae12, edge_3be6f1d77558, edge_3c560f02e48d, edge_443971abaaf2, edge_4500f6aeb5ee, edge_4cd9ffe42a88, edge_52bfe60ee179, edge_5a97e5bb891e, edge_5b1ee992212d, edge_5b810f9f6652, edge_5e00d3bf4284, edge_5f364453275c, edge_636e7b4f8c48, edge_64b01633ecdb, edge_657bceaf3d42, edge_6e79b2b83303, edge_7855522ef6f2, edge_7ac6ff480ad2, edge_7f14e3b05e1b, edge_853fdc594db8, edge_8b5e0432cf77, edge_964b26ddc92c, edge_975292aabe18, edge_9bab016181af, edge_9bff0685f0b3, edge_a1b21f9641c6, edge_a1b8a6b0d4a0, edge_b745f110daa1, edge_b7ee28b96e86, edge_bbe1f99471d0, edge_bfc9c2e0abe0, edge_c0af2889258f, edge_c0e51a397b02, edge_c2472df9951f, edge_c36674f7948e, edge_c78c19451eaf, edge_c910cf4f0f37, edge_c98074fd6e7e, edge_cdd8435c025f, edge_d638e9e2807f, edge_d6a6ec8d2b4d, edge_d7abb4ac74e1, edge_d81cc4aa4ec8, edge_db54d049fde5, edge_dfd9d9a618fd, edge_e1c6b21dfb07, edge_e525f7e5117a, edge_e6a146555a13, edge_ea6520bfcd07, edge_eea3f4ff0eab, edge_f37adbca7dae, edge_f387ebf70d03, edge_f5844f721fa0, edge_f7609d513136, edge_f85d5ee761dd, edge_fa28040a01ee, edge_fa88ceaf740c, edge_fb190c9da75d |
| Doc Paths | [分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md) |

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

- 这个说法可能对应多部影片或多个演员，请给我更具体的番号、片名或演员名。
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| resolution.status | resolved | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |
| Edge IDs | edge_04f5f6d3e225, edge_083bb0ea0740, edge_098f115fd961, edge_0c451ae7c815, edge_0c732bf25f34, edge_0dedfd3f9f44, edge_104de0f2cde3, edge_192676b7f88a, edge_203eb953f032, edge_22983ba98e6b, edge_2319e352f503, edge_2362ae88d8a8, edge_24a4d112ea54, edge_26438ba40e0b, edge_2700c5c85950, edge_2724cbf57f88, edge_2b159d2bf33f, edge_2f08384e32d9, edge_2f9c8bdf57ed, edge_308ebed3a027, edge_3302e52c61f8, edge_36ca421fae12, edge_3be6f1d77558, edge_3c560f02e48d, edge_443971abaaf2, edge_4500f6aeb5ee, edge_4cd9ffe42a88, edge_52bfe60ee179, edge_5a97e5bb891e, edge_5b1ee992212d, edge_5b810f9f6652, edge_5e00d3bf4284, edge_5f364453275c, edge_636e7b4f8c48, edge_64b01633ecdb, edge_657bceaf3d42, edge_6e79b2b83303, edge_7855522ef6f2, edge_7ac6ff480ad2, edge_7f14e3b05e1b, edge_853fdc594db8, edge_8b5e0432cf77, edge_964b26ddc92c, edge_975292aabe18, edge_9bab016181af, edge_9bff0685f0b3, edge_a1b21f9641c6, edge_a1b8a6b0d4a0, edge_b745f110daa1, edge_b7ee28b96e86, edge_bbe1f99471d0, edge_bfc9c2e0abe0, edge_c0af2889258f, edge_c0e51a397b02, edge_c2472df9951f, edge_c36674f7948e, edge_c78c19451eaf, edge_c910cf4f0f37, edge_c98074fd6e7e, edge_cdd8435c025f, edge_d638e9e2807f, edge_d6a6ec8d2b4d, edge_d7abb4ac74e1, edge_d81cc4aa4ec8, edge_db54d049fde5, edge_dfd9d9a618fd, edge_e1c6b21dfb07, edge_e525f7e5117a, edge_e6a146555a13, edge_ea6520bfcd07, edge_eea3f4ff0eab, edge_f37adbca7dae, edge_f387ebf70d03, edge_f5844f721fa0, edge_f7609d513136, edge_f85d5ee761dd, edge_fa28040a01ee, edge_fa88ceaf740c, edge_fb190c9da75d |
| Doc Paths | [分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md) |

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
| approval.status | approved | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |
| Edge IDs | edge_04f5f6d3e225, edge_083bb0ea0740, edge_098f115fd961, edge_0c451ae7c815, edge_0c732bf25f34, edge_104de0f2cde3, edge_192676b7f88a, edge_203eb953f032, edge_22983ba98e6b, edge_2319e352f503, edge_2362ae88d8a8, edge_24a4d112ea54, edge_26438ba40e0b, edge_2700c5c85950, edge_2724cbf57f88, edge_2b159d2bf33f, edge_2f08384e32d9, edge_308ebed3a027, edge_3302e52c61f8, edge_36ca421fae12, edge_3be6f1d77558, edge_3c560f02e48d, edge_443971abaaf2, edge_4500f6aeb5ee, edge_4cd9ffe42a88, edge_52bfe60ee179, edge_5b1ee992212d, edge_5b810f9f6652, edge_5e00d3bf4284, edge_5f364453275c, edge_636e7b4f8c48, edge_64b01633ecdb, edge_657bceaf3d42, edge_6e79b2b83303, edge_7855522ef6f2, edge_7ac6ff480ad2, edge_7f14e3b05e1b, edge_853fdc594db8, edge_8b5e0432cf77, edge_964b26ddc92c, edge_975292aabe18, edge_9bab016181af, edge_9bff0685f0b3, edge_a1b21f9641c6, edge_a1b8a6b0d4a0, edge_b745f110daa1, edge_b7ee28b96e86, edge_bbe1f99471d0, edge_bfc9c2e0abe0, edge_c0af2889258f, edge_c0e51a397b02, edge_c2472df9951f, edge_c36674f7948e, edge_c78c19451eaf, edge_c910cf4f0f37, edge_c98074fd6e7e, edge_cdd8435c025f, edge_d638e9e2807f, edge_d6a6ec8d2b4d, edge_d7abb4ac74e1, edge_d81cc4aa4ec8, edge_db54d049fde5, edge_dfd9d9a618fd, edge_e1c6b21dfb07, edge_e525f7e5117a, edge_e6a146555a13, edge_ea6520bfcd07, edge_eea3f4ff0eab, edge_f37adbca7dae, edge_f387ebf70d03, edge_f5844f721fa0, edge_f7609d513136, edge_f85d5ee761dd, edge_fa28040a01ee, edge_fa88ceaf740c, edge_fb190c9da75d |
| Doc Paths | [actions.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/actions.md), [分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md), [common-failures.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/recovery/common-failures.md) |

### evidence-mismatch

- Severity: `medium`
- Strategy: `retry-once`
- Retryable: `true` (max retries: 1)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| finalUrl | not_in_set | ["https://jable.tv/","https://jable.tv/categories/","https://jable.tv/models/","https://jable.tv/models/2b60db870ab2d4375486d15a61f1b735/","https://jable.tv/models/2bf4c69cec5e6547b338e9fc8b9fd086/","https://jable.tv/models/3cfba41761d71d4bbd3635cc4b6c20fd/","https://jable.tv/models/76deee4a66140394afb9b342222318c9/","https://jable.tv/models/95898564176258a0cff5ef1f3e45431e/","https://jable.tv/models/hara-sarasa/","https://jable.tv/models/jessica-kizaki/","https://jable.tv/models/kirara-asuka/","https://jable.tv/models/kurea-hasumi/","https://jable.tv/models/momonogi-kana/","https://jable.tv/models/sakura-momo/","https://jable.tv/models/tiny/","https://jable.tv/models/yume-nishimiya/","https://jable.tv/search/IPX-238/","https://jable.tv/search/IPX-795/","https://jable.tv/search/JUR-652/","https://jable.tv/tags/Cosplay/","https://jable.tv/videos/adn-773/","https://jable.tv/videos/atid-662/","https://jable.tv/videos/atid-669/","https://jable.tv/videos/dass-891/","https://jable.tv/videos/ipx-238-c/","https://jable.tv/videos/ipx-370/","https://jable.tv/videos/ipx-401/","https://jable.tv/videos/ipx-590/","https://jable.tv/videos/ipx-607/","https://jable.tv/videos/ipx-700/","https://jable.tv/videos/ipx-795/","https://jable.tv/videos/ipzz-672/","https://jable.tv/videos/ipzz-698/","https://jable.tv/videos/ipzz-781/","https://jable.tv/videos/ipzz-805/","https://jable.tv/videos/ipzz-812/","https://jable.tv/videos/ipzz-815/","https://jable.tv/videos/ipzz-830/","https://jable.tv/videos/ipzz-842/","https://jable.tv/videos/jur-637/","https://jable.tv/videos/jur-652/","https://jable.tv/videos/mimk-051/","https://jable.tv/videos/mukd-564/","https://jable.tv/videos/mvg-158/","https://jable.tv/videos/rbd-834/","https://jable.tv/videos/snis-744/","https://jable.tv/videos/ssni-142/","https://jable.tv/videos/ure-133/","https://jable.tv/videos/waaa-634/","https://jable.tv/videos/wsa-001/"] |
| title | unmatched | ["ADN-773 白皙美乳女教師校內露出調教 被人撞見我的淫蕩真面目 白峰美羽 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","ATID-662 被沒用的部下用「吸吮器」猛吸豆豆，下半身抖到站不起來、高潮崩潰的氣質美腿女上司 夏目彩春 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","ATID-669 沉溺和女友媽媽流汗性交的日子。 夏目彩春 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","Cosplay AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","DASS-891 【人生で最も特別な日ーそれは結婚式─】新婦の目を盗んで、何度も何度も繰り返す生ハメ強●ズコバコSEX！唾液を絡ませて腰を振りまくる変態ウエディングプランナー 白峰美羽 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPX 238 AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPX 795 AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPX-238 傲嬌巨乳女僕櫻空桃 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPX-370 和美麗的姐姐希崎傑西卡交換口水濃密接吻做愛 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPX-401 暗戀的班花西宮夢花著我的錢還在我家和除了我以外的所有男生做愛忍無可忍的我強行內射了她 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPX-590 初めて尽くしの大絶頂4本番 専属第2弾 全6コーナー性欲覚醒SPECIAL 天使亞夢 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPX-607 要不要做愛？和超可愛制服美少女做愛的學園性活 天使亞夢 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPX-700 等待預約1年！美腳優雅美女幫你榨乾精巢的超高級男性保健護理 白峰美羽 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPX-795 桃乃木香奈x可愛衣裝=無敵組合！讓你沉浸自慰的至高射精引導 桃乃木香奈 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPZZ-672 和極度討厭的兩位絕倫人渣上司，在溫泉旅館意外同房。超正巨乳OL被他們精液射滿全身，整晚被幹屈辱輪●最後高潮墮落。 桃乃木香奈 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPZZ-698 -最終印象- IDEAPOCKET傳奇美巨乳偶像桃乃木香奈正式引退。 桃乃木香奈 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPZZ-781 拍了100多部AV、已經高潮麻木的巨乳美女櫻空桃，被強力春藥浸泡到邊緣，徹底崩壞鬼畜高潮 櫻空桃 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPZZ-805 男ウケが良過ぎるあざと可愛い新人女子社員嫉妬に狂った女上司達はレ×プ合コンを計画！飲ませて酔わせて眠らせて思う存分、眠●した後…トドメの媚薬キメセク孕ませ輪●！ 櫻空桃 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPZZ-812 昨晚醉到打炮了之後，早上才知道事實的我，和軟弱又可愛的敏感後輩高潮連連的性愛，死也要再來一次 愛才莉亞 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPZZ-815 在交友軟體遇到的美女居然是兒子幼稚園的美乳女老師…每天早上以爸爸身份見面，晚上卻以男人身份無套內射不倫的背德關係 西宮夢 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPZZ-830 死ぬほど大嫌いな上司と出張先の温泉旅館でまさかの相部屋に…醜い絶倫おやじに何度も何度もイカされてしまった私。 愛才莉亞 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","IPZZ-842 ねぇセックスしてみる？ 何でも話せる10年来の女友達と酔った勢いでラブホへ…初めての距離感に戸惑いながらもエロ過ぎる彼女に興奮を抑えきれず何度もハメまくった夜 西宮夢 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","JUR 652 AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","JUR-637 傳說的留級 讓留級超久的問題中年更生的巨乳女教師・結美的濃密教育 風間由美 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","JUR-652 性欲が強過ぎる彼女の母がどストライクな僕は、彼女に内緒で何度も何度も勃起チ○ポを捧げています…。 蓮實克蕾兒 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","MIMK-051 經典漫改時間停止俱樂部被臭老頭強●內射的美女教師 希崎傑西卡 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","MUKD-564 私たち、気持ちいいことに鬼ハマり中。 とある日のオフパコ中出し乱交 ～ボランティア委員編～ 葵藍 有馬美月 片寄秋華 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","MVG-158 尻穴中毒同人コスプレイヤー アナルFUCK撮影会！HARDモード！ 青井藍 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","RBD-834 受虐狂人妻希崎傑西卡的覺醒變態的身體在多次侵犯內射後不再隱藏 希崎傑西卡 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","SNIS-744 讓明日花綺羅角色扮演然後隨時隨地潮吹 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","SSNI-142 明日花綺羅奪走你的處男 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","Tiny 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","URE-133 系列累計超過20萬下載！ 在同人界超人氣的近●交配漫畫！！ 原作:HIGEFURAI 可以和我最愛的巨乳媽媽盡情做愛的日子 寫實版 風間由美 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","WAAA-634 「もうイッてるってばぁ！」状態で何度も中出し！ 蓮實克蕾兒 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","WSA-001 新人 世界的美少女AVデビュー アジアの奇跡 Tiny - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","あおい藍 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","あまつか亜夢 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","主題 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","夏目彩春 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","女優 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","希崎ジェシカ 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","愛才りあ 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","明日花キララ 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","桃乃木かな 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","桜空もも 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","白峰ミウ 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","蓮実クレア 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","西宮ゆめ 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽","風間ゆみ 出演的AV在線看 - Jable.TV \| 免費高清AV在線看 \| J片 AV看到飽"] |
| currentElementState | neq | "decision-rule.expected" |

#### 恢复动作

- Re-check the expected decision rule and target state.
- Retry the same action once if the mismatch is transient.
- If the mismatch persists, fall back to re-anchor-state.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| currentElementState | decision-rule.expected | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |
| Edge IDs | edge_04f5f6d3e225, edge_083bb0ea0740, edge_098f115fd961, edge_0c451ae7c815, edge_0c732bf25f34, edge_0dedfd3f9f44, edge_104de0f2cde3, edge_192676b7f88a, edge_203eb953f032, edge_22983ba98e6b, edge_2319e352f503, edge_2362ae88d8a8, edge_24a4d112ea54, edge_26438ba40e0b, edge_2700c5c85950, edge_2724cbf57f88, edge_2b159d2bf33f, edge_2f08384e32d9, edge_2f9c8bdf57ed, edge_308ebed3a027, edge_3302e52c61f8, edge_36ca421fae12, edge_3be6f1d77558, edge_3c560f02e48d, edge_443971abaaf2, edge_4500f6aeb5ee, edge_4cd9ffe42a88, edge_52bfe60ee179, edge_5a97e5bb891e, edge_5b1ee992212d, edge_5b810f9f6652, edge_5e00d3bf4284, edge_5f364453275c, edge_636e7b4f8c48, edge_64b01633ecdb, edge_657bceaf3d42, edge_6e79b2b83303, edge_7855522ef6f2, edge_7ac6ff480ad2, edge_7f14e3b05e1b, edge_853fdc594db8, edge_8b5e0432cf77, edge_964b26ddc92c, edge_975292aabe18, edge_9bab016181af, edge_9bff0685f0b3, edge_a1b21f9641c6, edge_a1b8a6b0d4a0, edge_b745f110daa1, edge_b7ee28b96e86, edge_bbe1f99471d0, edge_bfc9c2e0abe0, edge_c0af2889258f, edge_c0e51a397b02, edge_c2472df9951f, edge_c36674f7948e, edge_c78c19451eaf, edge_c910cf4f0f37, edge_c98074fd6e7e, edge_cdd8435c025f, edge_d638e9e2807f, edge_d6a6ec8d2b4d, edge_d7abb4ac74e1, edge_d81cc4aa4ec8, edge_db54d049fde5, edge_dfd9d9a618fd, edge_e1c6b21dfb07, edge_e525f7e5117a, edge_e6a146555a13, edge_ea6520bfcd07, edge_eea3f4ff0eab, edge_f37adbca7dae, edge_f387ebf70d03, edge_f5844f721fa0, edge_f7609d513136, edge_f85d5ee761dd, edge_fa28040a01ee, edge_fa88ceaf740c, edge_fb190c9da75d |
| Doc Paths | [分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md) |

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

- 你要找哪部影片或哪个演员？我可以列出当前有动作证据的候选项。
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| resolution.status | resolved | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |
| Edge IDs | edge_04f5f6d3e225, edge_083bb0ea0740, edge_098f115fd961, edge_0c451ae7c815, edge_0c732bf25f34, edge_0dedfd3f9f44, edge_104de0f2cde3, edge_192676b7f88a, edge_203eb953f032, edge_22983ba98e6b, edge_2319e352f503, edge_2362ae88d8a8, edge_24a4d112ea54, edge_26438ba40e0b, edge_2700c5c85950, edge_2724cbf57f88, edge_2b159d2bf33f, edge_2f08384e32d9, edge_2f9c8bdf57ed, edge_308ebed3a027, edge_3302e52c61f8, edge_36ca421fae12, edge_3be6f1d77558, edge_3c560f02e48d, edge_443971abaaf2, edge_4500f6aeb5ee, edge_4cd9ffe42a88, edge_52bfe60ee179, edge_5a97e5bb891e, edge_5b1ee992212d, edge_5b810f9f6652, edge_5e00d3bf4284, edge_5f364453275c, edge_636e7b4f8c48, edge_64b01633ecdb, edge_657bceaf3d42, edge_6e79b2b83303, edge_7855522ef6f2, edge_7ac6ff480ad2, edge_7f14e3b05e1b, edge_853fdc594db8, edge_8b5e0432cf77, edge_964b26ddc92c, edge_975292aabe18, edge_9bab016181af, edge_9bff0685f0b3, edge_a1b21f9641c6, edge_a1b8a6b0d4a0, edge_b745f110daa1, edge_b7ee28b96e86, edge_bbe1f99471d0, edge_bfc9c2e0abe0, edge_c0af2889258f, edge_c0e51a397b02, edge_c2472df9951f, edge_c36674f7948e, edge_c78c19451eaf, edge_c910cf4f0f37, edge_c98074fd6e7e, edge_cdd8435c025f, edge_d638e9e2807f, edge_d6a6ec8d2b4d, edge_d7abb4ac74e1, edge_d81cc4aa4ec8, edge_db54d049fde5, edge_dfd9d9a618fd, edge_e1c6b21dfb07, edge_e525f7e5117a, edge_e6a146555a13, edge_ea6520bfcd07, edge_eea3f4ff0eab, edge_f37adbca7dae, edge_f387ebf70d03, edge_f5844f721fa0, edge_f7609d513136, edge_f85d5ee761dd, edge_fa28040a01ee, edge_fa88ceaf740c, edge_fb190c9da75d |
| Doc Paths | [分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md) |

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
| resolution.status | resolved | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |
| Edge IDs | edge_04f5f6d3e225, edge_083bb0ea0740, edge_098f115fd961, edge_0c451ae7c815, edge_0c732bf25f34, edge_0dedfd3f9f44, edge_104de0f2cde3, edge_192676b7f88a, edge_203eb953f032, edge_22983ba98e6b, edge_2319e352f503, edge_2362ae88d8a8, edge_24a4d112ea54, edge_26438ba40e0b, edge_2700c5c85950, edge_2724cbf57f88, edge_2b159d2bf33f, edge_2f08384e32d9, edge_2f9c8bdf57ed, edge_308ebed3a027, edge_3302e52c61f8, edge_36ca421fae12, edge_3be6f1d77558, edge_3c560f02e48d, edge_443971abaaf2, edge_4500f6aeb5ee, edge_4cd9ffe42a88, edge_52bfe60ee179, edge_5a97e5bb891e, edge_5b1ee992212d, edge_5b810f9f6652, edge_5e00d3bf4284, edge_5f364453275c, edge_636e7b4f8c48, edge_64b01633ecdb, edge_657bceaf3d42, edge_6e79b2b83303, edge_7855522ef6f2, edge_7ac6ff480ad2, edge_7f14e3b05e1b, edge_853fdc594db8, edge_8b5e0432cf77, edge_964b26ddc92c, edge_975292aabe18, edge_9bab016181af, edge_9bff0685f0b3, edge_a1b21f9641c6, edge_a1b8a6b0d4a0, edge_b745f110daa1, edge_b7ee28b96e86, edge_bbe1f99471d0, edge_bfc9c2e0abe0, edge_c0af2889258f, edge_c0e51a397b02, edge_c2472df9951f, edge_c36674f7948e, edge_c78c19451eaf, edge_c910cf4f0f37, edge_c98074fd6e7e, edge_cdd8435c025f, edge_d638e9e2807f, edge_d6a6ec8d2b4d, edge_d7abb4ac74e1, edge_d81cc4aa4ec8, edge_db54d049fde5, edge_dfd9d9a618fd, edge_e1c6b21dfb07, edge_e525f7e5117a, edge_e6a146555a13, edge_ea6520bfcd07, edge_eea3f4ff0eab, edge_f37adbca7dae, edge_f387ebf70d03, edge_f5844f721fa0, edge_f7609d513136, edge_f85d5ee761dd, edge_fa28040a01ee, edge_fa88ceaf740c, edge_fb190c9da75d |
| Doc Paths | [分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md) |

### stale-state

- Severity: `medium`
- Strategy: `re-anchor-state`
- Retryable: `true` (max retries: 1)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| currentStateId | unmatched | ["s0000","s0001","s0002","s0003","s0004","s0006","s0007","s0008","s0009","s0010","s0012","s0013","s0014","s0015","s0016","s0017","s0018","s0019","s0020","s0021","s0022","s0023","s0024","s0025","s0026","s0029","s0030","s0031","s0033","s0034","s0035","s0038","s0040","s0041","s0042","s0043","s0044","s0045","s0046","s0047","s0048","s0049","s0050","s0051","s0052","s0053","s0054","s0055","s0057","s0059"] |
| currentElementState | not_in_set | ["s0000","s0001","s0002","s0003","s0004","s0006","s0007","s0008","s0009","s0010","s0012","s0013","s0014","s0015","s0016","s0017","s0018","s0019","s0020","s0021","s0022","s0023","s0024","s0025","s0026","s0029","s0030","s0031","s0033","s0034","s0035","s0038","s0040","s0041","s0042","s0043","s0044","s0045","s0046","s0047","s0048","s0049","s0050","s0051","s0052","s0053","s0054","s0055","s0057","s0059"] |

#### 恢复动作

- Compare currentElementState against analyzed concrete states.
- Re-anchor to the nearest matching analyzed state within the observed URL family.
- If no direct match exists, fall back to the base URL and re-evaluate intent rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| currentStateId | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |
| Edge IDs | edge_04f5f6d3e225, edge_083bb0ea0740, edge_098f115fd961, edge_0c451ae7c815, edge_0c732bf25f34, edge_0dedfd3f9f44, edge_104de0f2cde3, edge_192676b7f88a, edge_203eb953f032, edge_22983ba98e6b, edge_2319e352f503, edge_2362ae88d8a8, edge_24a4d112ea54, edge_26438ba40e0b, edge_2700c5c85950, edge_2724cbf57f88, edge_2b159d2bf33f, edge_2f08384e32d9, edge_2f9c8bdf57ed, edge_308ebed3a027, edge_3302e52c61f8, edge_36ca421fae12, edge_3be6f1d77558, edge_3c560f02e48d, edge_443971abaaf2, edge_4500f6aeb5ee, edge_4cd9ffe42a88, edge_52bfe60ee179, edge_5a97e5bb891e, edge_5b1ee992212d, edge_5b810f9f6652, edge_5e00d3bf4284, edge_5f364453275c, edge_636e7b4f8c48, edge_64b01633ecdb, edge_657bceaf3d42, edge_6e79b2b83303, edge_7855522ef6f2, edge_7ac6ff480ad2, edge_7f14e3b05e1b, edge_853fdc594db8, edge_8b5e0432cf77, edge_964b26ddc92c, edge_975292aabe18, edge_9bab016181af, edge_9bff0685f0b3, edge_a1b21f9641c6, edge_a1b8a6b0d4a0, edge_b745f110daa1, edge_b7ee28b96e86, edge_bbe1f99471d0, edge_bfc9c2e0abe0, edge_c0af2889258f, edge_c0e51a397b02, edge_c2472df9951f, edge_c36674f7948e, edge_c78c19451eaf, edge_c910cf4f0f37, edge_c98074fd6e7e, edge_cdd8435c025f, edge_d638e9e2807f, edge_d6a6ec8d2b4d, edge_d7abb4ac74e1, edge_d81cc4aa4ec8, edge_db54d049fde5, edge_dfd9d9a618fd, edge_e1c6b21dfb07, edge_e525f7e5117a, edge_e6a146555a13, edge_ea6520bfcd07, edge_eea3f4ff0eab, edge_f37adbca7dae, edge_f387ebf70d03, edge_f5844f721fa0, edge_f7609d513136, edge_f85d5ee761dd, edge_fa28040a01ee, edge_fa88ceaf740c, edge_fb190c9da75d |
| Doc Paths | [分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md) |

### transition-failed

- Severity: `high`
- Strategy: `re-anchor-state`
- Retryable: `true` (max retries: 1)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| actionOutcome | eq | "failed" |
| toStateId | not_in_set | ["s0001","s0002","s0003","s0004","s0006","s0007","s0008","s0009","s0010","s0012","s0013","s0014","s0015","s0016","s0017","s0018","s0019","s0020","s0021","s0022","s0023","s0024","s0025","s0026","s0029","s0030","s0031","s0033","s0034","s0035","s0038","s0040","s0041","s0042","s0043","s0044","s0045","s0046","s0047","s0048","s0049","s0050","s0051","s0052","s0053","s0054","s0055","s0057","s0059"] |

#### 恢复动作

- Stop automatic progression after the failed act rule.
- Re-anchor the runtime state to the nearest analyzed state.
- Offer a safe actionable target set before retrying.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| toStateId | s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |
| Edge IDs | edge_04f5f6d3e225, edge_083bb0ea0740, edge_098f115fd961, edge_0c451ae7c815, edge_0c732bf25f34, edge_0dedfd3f9f44, edge_104de0f2cde3, edge_192676b7f88a, edge_203eb953f032, edge_22983ba98e6b, edge_2319e352f503, edge_2362ae88d8a8, edge_24a4d112ea54, edge_26438ba40e0b, edge_2700c5c85950, edge_2724cbf57f88, edge_2b159d2bf33f, edge_2f08384e32d9, edge_2f9c8bdf57ed, edge_308ebed3a027, edge_3302e52c61f8, edge_36ca421fae12, edge_3be6f1d77558, edge_3c560f02e48d, edge_443971abaaf2, edge_4500f6aeb5ee, edge_4cd9ffe42a88, edge_52bfe60ee179, edge_5a97e5bb891e, edge_5b1ee992212d, edge_5b810f9f6652, edge_5e00d3bf4284, edge_5f364453275c, edge_636e7b4f8c48, edge_64b01633ecdb, edge_657bceaf3d42, edge_6e79b2b83303, edge_7855522ef6f2, edge_7ac6ff480ad2, edge_7f14e3b05e1b, edge_853fdc594db8, edge_8b5e0432cf77, edge_964b26ddc92c, edge_975292aabe18, edge_9bab016181af, edge_9bff0685f0b3, edge_a1b21f9641c6, edge_a1b8a6b0d4a0, edge_b745f110daa1, edge_b7ee28b96e86, edge_bbe1f99471d0, edge_bfc9c2e0abe0, edge_c0af2889258f, edge_c0e51a397b02, edge_c2472df9951f, edge_c36674f7948e, edge_c78c19451eaf, edge_c910cf4f0f37, edge_c98074fd6e7e, edge_cdd8435c025f, edge_d638e9e2807f, edge_d6a6ec8d2b4d, edge_d7abb4ac74e1, edge_d81cc4aa4ec8, edge_db54d049fde5, edge_dfd9d9a618fd, edge_e1c6b21dfb07, edge_e525f7e5117a, edge_e6a146555a13, edge_ea6520bfcd07, edge_eea3f4ff0eab, edge_f37adbca7dae, edge_f387ebf70d03, edge_f5844f721fa0, edge_f7609d513136, edge_f85d5ee761dd, edge_fa28040a01ee, edge_fa88ceaf740c, edge_fb190c9da75d |
| Doc Paths | [分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md) |

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
| resolution.status | resolved | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |
| Edge IDs | edge_04f5f6d3e225, edge_083bb0ea0740, edge_098f115fd961, edge_0c451ae7c815, edge_0c732bf25f34, edge_0dedfd3f9f44, edge_104de0f2cde3, edge_192676b7f88a, edge_203eb953f032, edge_22983ba98e6b, edge_2319e352f503, edge_2362ae88d8a8, edge_24a4d112ea54, edge_26438ba40e0b, edge_2700c5c85950, edge_2724cbf57f88, edge_2b159d2bf33f, edge_2f08384e32d9, edge_2f9c8bdf57ed, edge_308ebed3a027, edge_3302e52c61f8, edge_36ca421fae12, edge_3be6f1d77558, edge_3c560f02e48d, edge_443971abaaf2, edge_4500f6aeb5ee, edge_4cd9ffe42a88, edge_52bfe60ee179, edge_5a97e5bb891e, edge_5b1ee992212d, edge_5b810f9f6652, edge_5e00d3bf4284, edge_5f364453275c, edge_636e7b4f8c48, edge_64b01633ecdb, edge_657bceaf3d42, edge_6e79b2b83303, edge_7855522ef6f2, edge_7ac6ff480ad2, edge_7f14e3b05e1b, edge_853fdc594db8, edge_8b5e0432cf77, edge_964b26ddc92c, edge_975292aabe18, edge_9bab016181af, edge_9bff0685f0b3, edge_a1b21f9641c6, edge_a1b8a6b0d4a0, edge_b745f110daa1, edge_b7ee28b96e86, edge_bbe1f99471d0, edge_bfc9c2e0abe0, edge_c0af2889258f, edge_c0e51a397b02, edge_c2472df9951f, edge_c36674f7948e, edge_c78c19451eaf, edge_c910cf4f0f37, edge_c98074fd6e7e, edge_cdd8435c025f, edge_d638e9e2807f, edge_d6a6ec8d2b4d, edge_d7abb4ac74e1, edge_d81cc4aa4ec8, edge_db54d049fde5, edge_dfd9d9a618fd, edge_e1c6b21dfb07, edge_e525f7e5117a, edge_e6a146555a13, edge_ea6520bfcd07, edge_eea3f4ff0eab, edge_f37adbca7dae, edge_f387ebf70d03, edge_f5844f721fa0, edge_f7609d513136, edge_f85d5ee761dd, edge_fa28040a01ee, edge_fa88ceaf740c, edge_fb190c9da75d |
| Doc Paths | [分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md) |

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

- 这个影片或演员可以识别，但当前没有可执行的动作证据。要不要换一个已观察到可打开的目标？
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| resolution.status | resolved | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0001, s0002, s0003, s0004, s0006, s0007, s0008, s0009, s0010, s0012, s0013, s0014, s0015, s0016, s0017, s0018, s0019, s0020, s0021, s0022, s0023, s0024, s0025, s0026, s0029, s0030, s0031, s0033, s0034, s0035, s0038, s0040, s0041, s0042, s0043, s0044, s0045, s0046, s0047, s0048, s0049, s0050, s0051, s0052, s0053, s0054, s0055, s0057, s0059 |
| Edge IDs | edge_04f5f6d3e225, edge_083bb0ea0740, edge_098f115fd961, edge_0c451ae7c815, edge_0c732bf25f34, edge_0dedfd3f9f44, edge_104de0f2cde3, edge_192676b7f88a, edge_203eb953f032, edge_22983ba98e6b, edge_2319e352f503, edge_2362ae88d8a8, edge_24a4d112ea54, edge_26438ba40e0b, edge_2700c5c85950, edge_2724cbf57f88, edge_2b159d2bf33f, edge_2f08384e32d9, edge_2f9c8bdf57ed, edge_308ebed3a027, edge_3302e52c61f8, edge_36ca421fae12, edge_3be6f1d77558, edge_3c560f02e48d, edge_443971abaaf2, edge_4500f6aeb5ee, edge_4cd9ffe42a88, edge_52bfe60ee179, edge_5a97e5bb891e, edge_5b1ee992212d, edge_5b810f9f6652, edge_5e00d3bf4284, edge_5f364453275c, edge_636e7b4f8c48, edge_64b01633ecdb, edge_657bceaf3d42, edge_6e79b2b83303, edge_7855522ef6f2, edge_7ac6ff480ad2, edge_7f14e3b05e1b, edge_853fdc594db8, edge_8b5e0432cf77, edge_964b26ddc92c, edge_975292aabe18, edge_9bab016181af, edge_9bff0685f0b3, edge_a1b21f9641c6, edge_a1b8a6b0d4a0, edge_b745f110daa1, edge_b7ee28b96e86, edge_bbe1f99471d0, edge_bfc9c2e0abe0, edge_c0af2889258f, edge_c0e51a397b02, edge_c2472df9951f, edge_c36674f7948e, edge_c78c19451eaf, edge_c910cf4f0f37, edge_c98074fd6e7e, edge_cdd8435c025f, edge_d638e9e2807f, edge_d6a6ec8d2b4d, edge_d7abb4ac74e1, edge_d81cc4aa4ec8, edge_db54d049fde5, edge_dfd9d9a618fd, edge_e1c6b21dfb07, edge_e525f7e5117a, edge_e6a146555a13, edge_ea6520bfcd07, edge_eea3f4ff0eab, edge_f37adbca7dae, edge_f387ebf70d03, edge_f5844f721fa0, edge_f7609d513136, edge_f85d5ee761dd, edge_fa28040a01ee, edge_fa88ceaf740c, edge_fb190c9da75d |
| Doc Paths | [分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/分类榜单查询-分类链接-分类页-演员列表-标签-cosplay.md), [打开分类页-分类链接-分类页-演员列表-标签-cosplay.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开分类页-分类链接-分类页-演员列表-标签-cosplay.md), [打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开影片-影片链接-adn-773-白皙美乳女教師校內露出調教-被人撞見我的淫蕩真面目-白峰美羽-atid-669-沉溺.md), [打开演员页-演员链接-tiny-藍-亜夢.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/打开演员页-演员链接-tiny-藍-亜夢.md), [搜索影片-搜索表单.md](../../../knowledge-base/jable.tv/raw/step-6-docs/20260414T113553438Z_jable.tv_docs/intents/搜索影片-搜索表单.md) |
