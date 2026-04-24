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
| currentElementState | already-satisfied, noop | s0000, s0002 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002 |
| Edge IDs | edge_083bb0ea0740, edge_f7609d513136 |
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

- 这个名字可能对应多篇笔记或多个用户，请给我更具体的笔记标题、用户名，或直接说要进入发现页。
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| resolution.status | resolved | s0000, s0002 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002 |
| Edge IDs | edge_083bb0ea0740, edge_f7609d513136 |
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
| approval.status | approved | s0000, s0002 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | - |
| Edge IDs | - |
| Doc Paths | [search-book-search-form.md](../../../knowledge-base/www.xiaohongshu.com/raw/step-6-docs/20260422T172059446Z_www.xiaohongshu.com_docs/intents/search-book-search-form.md) |

### evidence-mismatch

- Severity: `medium`
- Strategy: `retry-once`
- Retryable: `true` (max retries: 1)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| finalUrl | not_in_set | ["https://www.xiaohongshu.com/explore","https://www.xiaohongshu.com/search_result?searchkey=%E7%A9%BF%E6%90%AD&type=51"] |
| title | unmatched | ["- 小红书搜索","小红书 - 你的生活兴趣社区"] |
| currentElementState | neq | "decision-rule.expected" |

#### 恢复动作

- Re-check the expected decision rule and target state.
- Retry the same action once if the mismatch is transient.
- If the mismatch persists, fall back to re-anchor-state.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| currentElementState | decision-rule.expected | s0000, s0002 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002 |
| Edge IDs | edge_083bb0ea0740, edge_f7609d513136 |
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

- 你要搜索哪篇笔记、打开哪个用户主页，还是回到发现页？
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| resolution.status | resolved | s0000, s0002 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002 |
| Edge IDs | edge_083bb0ea0740, edge_f7609d513136 |
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
| resolution.status | resolved | s0000, s0002 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002 |
| Edge IDs | edge_083bb0ea0740, edge_f7609d513136 |
| Doc Paths | - |

### stale-state

- Severity: `medium`
- Strategy: `re-anchor-state`
- Retryable: `true` (max retries: 1)
- Requires Approval: `false`

#### 触发条件

| Field | Op | Value |
| --- | --- | --- |
| currentStateId | unmatched | ["s0000","s0002"] |
| currentElementState | not_in_set | ["s0000","s0002"] |

#### 恢复动作

- Compare currentElementState against analyzed concrete states.
- Re-anchor to the nearest matching analyzed state within the observed URL family.
- If no direct match exists, fall back to the base URL and re-evaluate intent rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| currentStateId | s0000, s0002 | s0000, s0002 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002 |
| Edge IDs | edge_083bb0ea0740, edge_f7609d513136 |
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
| toStateId | not_in_set | ["s0002"] |

#### 恢复动作

- Stop automatic progression after the failed act rule.
- Re-anchor the runtime state to the nearest analyzed state.
- Offer a safe actionable target set before retrying.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| toStateId | s0002 | s0000, s0002 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002 |
| Edge IDs | edge_083bb0ea0740, edge_f7609d513136 |
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
| resolution.status | resolved | s0000, s0002 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002 |
| Edge IDs | edge_083bb0ea0740, edge_f7609d513136 |
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

- 这个目标可以识别，但当前没有可执行的打开或搜索证据。要不要换成已观测到的笔记、用户主页、发现页或登录页入口？
- Resume with re-run-entry-rules.

#### 成功判定

| State Field | Expected Values | State IDs |
| --- | --- | --- |
| resolution.status | resolved | s0000, s0002 |

#### 关联状态 / 证据

| Kind | Value |
| --- | --- |
| State IDs | s0000, s0002 |
| Edge IDs | edge_083bb0ea0740, edge_f7609d513136 |
| Doc Paths | - |
