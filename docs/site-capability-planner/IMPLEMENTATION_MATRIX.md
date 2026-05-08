# Site Capability Planner Layer Implementation Matrix

Last updated: 2026-05-09

Allowed statuses: `not_started`, `partial`, `implemented`, `verified`,
`blocked`.

Final Planner goal summary:

- `verified`: 20
- `implemented`: 0
- `partial`: 0
- `not_started`: 0
- `blocked`: 0

Status policy: existing Site Capability Layer and Site Capability Graph evidence
is useful migration input, but it does not make a Site Capability Planner Layer
section `verified`. A Planner section only becomes `verified` after
Planner-specific code evidence, test evidence, validation command, validation
result, matrix update, and QualityGateReviewAgent acceptance exist without
violating Planner / Graph / Layer / SiteAdapter / downloader / Session /
Redaction boundaries. Final gate evidence is recorded in Section 20 and
validated by `tests/node/site-capability-planner/matrix.test.mjs`.

Final gate boundary statement: Site Capability Layer remains the execution
entrypoint, Site Capability Graph remains declarative, and Planner remains
descriptor-only and non-executing. Planner remains descriptor-only for final
validation and does not directly call SiteAdapter, downloader, session/browser
runtime, ArtifactService, lifecycle dispatch, or Graph mutation/execution
paths. Planner-derived artifacts keep `redactionRequired=true` and must pass
SecurityGuard / Redaction before any write path. Final validation evidence:
Planner matrix validator passed 6/6, full Planner suite passed 79/79,
intent-to-add `git diff --check` passed, and
`node tools\prepublish-secret-scan.mjs` passed scanning 616 candidate files.

## 1. Core Positioning

- Section name: Core Positioning
- Requirement summary: Planner is the task decision layer and generates
  CapabilityPlan without executing tasks.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/dry-run.mjs` adds the
  first Planner entrypoint, `createDryRunCapabilityPlan()`, which validates
  PlanRequest and PlanContext, consumes only a validated Graph via the Planner
  loader, resolves Graph-sourced routes, runs the context checker, and returns a
  descriptor-only CapabilityPlan plus PlannerDryRunResult and lifecycle event.
  It explicitly disables execution, Layer handoff, SiteAdapter invocation,
  downloader invocation, session/runtime materialization, artifact service,
  lifecycle dispatch, external telemetry, logs, and Graph mutation.
- Existing test evidence: `tests/node/site-capability-planner/dry-run.test.mjs`
  proves a ready CapabilityPlan can be generated from a synthetic validated
  Graph, proves blocked context stays descriptor-only with a Planner reasonCode,
  rejects non-dry-run handoff mode, and verifies runtime/handoff flags remain
  false.
- Verification command: `node --check src\sites\capability\planner\dry-run.mjs`;
  `node --check tests\node\site-capability-planner\dry-run.test.mjs`;
  `node --test tests\node\site-capability-planner\dry-run.test.mjs`;
  `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs tests\node\site-capability-planner\observability.test.mjs tests\node\site-capability-planner\dry-run.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`;
  `node tools\prepublish-secret-scan.mjs`.
- Verification result: Syntax checks passed; focused dry-run suite passed 6/6;
  combined focused Planner suite passed 52/52; intent-to-add diff check passed;
  prepublish secret scan passed, scanning 610 candidate files.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Do not reuse Graph descriptor-only closure as Planner completion.
- Last updated: 2026-05-09
- Responsible subagent: RepoMatrixAuditor
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 2. Non-goals

- Section name: Non-goals
- Requirement summary: Planner must not bypass auth, CAPTCHA, anti-bot,
  access-control, Graph, Layer, SiteAdapter, downloader, Session, or Redaction
  boundaries.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/validator.mjs`
  rejects Planner non-goal bypass fields and aliases including CAPTCHA solver
  or bypass fields, MFA/2FA bypass, anti-bot bypass, access-control bypass,
  platform/risk-control evasion, permission/paywall/VIP bypass, credential
  extraction, privilege expansion, and privilege escalation. Existing Planner
  validators also reject raw credentials, raw sessions, SiteAdapter runtime
  output, downloader payloads, browser runtime, and executable handlers.
- Existing test evidence: `tests/node/site-capability-planner/non-goals-boundary.test.mjs`
  scans Planner module imports and re-exports for forbidden execution-side
  boundaries, rejects explicit non-goal bypass fields, verifies safe
  blocked/manual-recovery descriptors remain allowed, and rejects raw runtime
  payloads without echoing synthetic secrets.
- Verification command: `node --check src\sites\capability\planner\validator.mjs`;
  `node --check tests\node\site-capability-planner\non-goals-boundary.test.mjs`;
  `node --test tests\node\site-capability-planner\non-goals-boundary.test.mjs`;
  `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs tests\node\site-capability-planner\observability.test.mjs tests\node\site-capability-planner\dry-run.test.mjs tests\node\site-capability-planner\non-goals-boundary.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`;
  `node tools\prepublish-secret-scan.mjs`.
- Verification result: Syntax checks passed; focused non-goals suite passed
  5/5; combined focused Planner suite passed 57/57; intent-to-add diff check
  passed; prepublish secret scan passed, scanning 611 candidate files.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Planner cannot contain runtime handlers, downloader payloads, raw
  credentials, or browser profile material.
- Last updated: 2026-05-09
- Responsible subagent: QualityGateReviewAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 3. Relationship With Site Capability Layer And Graph

- Section name: Relationship With Site Capability Layer And Graph
- Requirement summary: Planner consumes validated Graph descriptors and hands
  plans to Layer-governed dry-run or execution paths; Graph remains
  declarative and Layer remains the execution entrypoint.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/loader.mjs` adds a
  Planner-owned validated Graph loader contract that accepts Graph plus a passed
  validation report, rejects missing/unvalidated/failed Graph inputs, and returns
  a descriptor-only `PlannerGraphSource` summary with `redactionRequired=true`.
  The summary records `safeSummaryOnly=true`, `routeResolutionAllowed=false`,
  `executionAllowed=false`, and `layerHandoffAllowed=false`. It does not call
  route resolution, Layer execution, SiteAdapter, downloader, SessionView,
  DownloadPolicy, or StandardTaskList paths. `dry-run.mjs` composes the
  validated Graph loader, route resolver, and context checker to produce a
  descriptor-only CapabilityPlan without Layer dispatch or runtime execution.
  `layer-handoff.mjs` adds a descriptor-only
  `PlannerLayerHandoffDescriptor` that targets `site-capability-layer` while
  keeping Layer dispatch, lifecycle dispatch, and execution flags false; it requires a validated
  PlannerDryRunResult, a compatible CapabilityPlan, consistent route/version
  fields, a cataloged reasonCode for blocked handoff states, and rejects
  runtime payload fields.
- Existing test evidence: `tests/node/site-capability-planner/graph-loader.test.mjs`
  validates a synthetic Graph fixture through `validateSiteCapabilityGraph()`,
  accepts only passed validation reports, rejects missing/failed/finding-bearing
  validation reports, rejects graph version/schema mismatches, rejects sensitive
  and runtime fields, and checks the summary is descriptor-only and
  redaction-required. `tests/node/site-capability-planner/layer-handoff.test.mjs`
  verifies ready and blocked Layer handoff descriptors, missing or mismatched
  nested dry-run results, required identity fields, runtime payload rejection,
  execution-flag rejection, and nested CapabilityPlan validation.
- Verification command: `node --check src\sites\capability\planner\loader.mjs`;
  `node --check src\sites\capability\planner\layer-handoff.mjs`;
  `node --check tests\node\site-capability-planner\layer-handoff.test.mjs`;
  `node --test tests\node\site-capability-planner\layer-handoff.test.mjs`;
  `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs tests\node\site-capability-planner\observability.test.mjs tests\node\site-capability-planner\dry-run.test.mjs tests\node\site-capability-planner\non-goals-boundary.test.mjs tests\node\site-capability-planner\layer-handoff.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`.
- Verification result: Syntax checks passed; focused Layer handoff suite passed
  6/6; combined focused Planner suite passed 63/63; diff check passed;
  prepublish secret scan passed, scanning 613 candidate files.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Do not let Planner bypass Layer or treat Graph as executable.
- Last updated: 2026-05-09
- Responsible subagent: GraphLayerIntegrationAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 4. Planner Layered Structure

- Section name: Planner Layered Structure
- Requirement summary: Planner should be split into schema, validator, loader,
  route resolver, context checker, reason mapping, redaction guard, artifact
  governance, observability, and dry-run entrypoint modules.
- Current status: `verified`
- Existing code evidence: Planner-specific modules now exist under
  `src/sites/capability/planner/`: `schema.mjs`, `validator.mjs`,
  `loader.mjs`, `route-resolver.mjs`, `context-checker.mjs`,
  `fallback-strategy.mjs`, `reason-codes.mjs`, `plan-artifact.mjs`,
  `observability.mjs`, `dry-run.mjs`, `layer-handoff.mjs`, and `index.mjs`.
  They cover the first schema, validator, validated Graph loader,
  Graph-sourced route resolver, descriptor-only context checker,
  Graph-sourced fallback/degradation strategy, Planner reasonCode taxonomy,
  audit-before-artifact Planner artifact governance, descriptor-only Planner
  observability, descriptor-only dry-run CapabilityPlan generation, and
  descriptor-only Planner-to-Layer handoff compatibility slices without
  touching existing dirty
  Layer/Graph/downloader files.
- Existing test evidence: `tests/node/site-capability-planner/schema-validator.test.mjs`,
  `graph-loader.test.mjs`, `route-resolver.test.mjs`,
  `context-checker.test.mjs`, `reason-codes.test.mjs`,
  `plan-artifact.test.mjs`, `observability.test.mjs`, and
  `dry-run.test.mjs`, `fallback-strategy.test.mjs`,
  `non-goals-boundary.test.mjs`, and `layer-handoff.test.mjs` cover the current
  module slices.
- Verification command: `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs tests\node\site-capability-planner\observability.test.mjs tests\node\site-capability-planner\dry-run.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`;
  `node tools\prepublish-secret-scan.mjs`.
- Verification result: Focused Planner schema + graph loader + route resolver +
  context checker + fallback strategy + reasonCode + plan artifact +
  observability + dry-run + non-goals + Layer handoff suite passed 73/73;
  focused fallback strategy suite passed 10/10; focused Layer handoff suite passed
  6/6; focused dry-run suite passed 6/6; intent-to-add diff check passed;
  prepublish secret scan passed after fallback changes, scanning 615 candidate
  files.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Do not create empty shells without validators and tests.
- Last updated: 2026-05-09
- Responsible subagent: PlannerContractSchemaAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 5. Planner Input Model: PlanRequest / PlanContext

- Section name: Planner Input Model: PlanRequest / PlanContext
- Requirement summary: Define versioned PlanRequest and minimized PlanContext
  without raw credentials or dynamic browser state.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/schema.mjs` defines
  Planner schema version, `PlanRequest`, `PlanContext`, and related PlanContext
  state schema definitions; `src/sites/capability/planner/validator.mjs`
  validates required `taskId`, site/url, normalized intent or intent input, and
  rejects forbidden sensitive/runtime fields through Planner-specific guards plus
  SecurityGuard forbidden-pattern checks.
- Existing test evidence: `tests/node/site-capability-planner/schema-validator.test.mjs`
  covers schema definition listing, valid PlanRequest/PlanContext fixtures,
  missing site/url, unresolved intent, raw cookie/session-style fields,
  sensitive query values, headers, storage state, credential refs, and no-secret
  echo assertions.
- Verification command: `node --check src\sites\capability\planner\schema.mjs`;
  `node --check src\sites\capability\planner\validator.mjs`;
  `node --check src\sites\capability\planner\index.mjs`;
  `node --check tests\node\site-capability-planner\schema-validator.test.mjs`;
  `node --test tests\node\site-capability-planner\schema-validator.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`.
- Verification result: Syntax checks passed; focused Planner schema/validator
  suite passed 11/11; diff check passed.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Must reject raw cookies, tokens, authorization headers, session
  ids, browser profile identifiers, account identifiers, and network
  identifiers.
- Last updated: 2026-05-09
- Responsible subagent: PlannerContractSchemaAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 6. Planner Output Model: CapabilityPlan / PlanStep / PlanDecision

- Section name: Planner Output Model: CapabilityPlan / PlanStep / PlanDecision
- Requirement summary: Define versioned CapabilityPlan outputs with
  plannerVersion, graphVersion, selectedRoute source, decisions, steps,
  requirements, risk summary, fallbacks, expected artifacts, and
  redactionRequired.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/schema.mjs` lists
  `CapabilityPlan`, `PlanStep`, `PlanDecision`, `PlanRequirementSummary`,
  `PlanRiskSummary`, `PlanFailure`, `PlanArtifact`, and `PlanManifest`
  contracts; `src/sites/capability/planner/validator.mjs` validates minimum
  CapabilityPlan fields, `plannerVersion`, `graphVersion`, Graph-sourced
  `selectedRoute`, Graph-sourced fallbacks, top-level `redactionRequired`, and
  redaction-required expected artifact descriptors.
- Existing test evidence: `tests/node/site-capability-planner/schema-validator.test.mjs`
  validates a minimal descriptor-only CapabilityPlan and rejects missing version
  fields, missing/non-Graph selectedRoute sources, non-Graph fallback sources,
  unredacted expected artifacts, `standardTaskList`, SiteAdapter runtime
  decisions, downloader tasks, and non-readOnly plans without approval.
- Verification command: `node --test tests\node\site-capability-planner\schema-validator.test.mjs`.
- Verification result: Focused Planner schema/validator suite passed 11/11.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: PlanStep must be a descriptor, not executable downloader work.
- Last updated: 2026-05-09
- Responsible subagent: PlannerContractSchemaAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 7. Intent Normalization

- Section name: Intent Normalization
- Requirement summary: Planner accepts standard normalized intent or invokes a
  governed normalizer without taking over SiteAdapter semantics.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/dry-run.mjs` exports
  `normalizePlannerIntent()`, which validates PlanRequest, accepts only
  `normalizedIntent`, `intentInput.normalizedIntent`, or
  `intentInput.standardIntent`, and rejects unresolved intent with
  `planner.intent_unresolved`. It does not infer site-specific semantics from
  URL or call SiteAdapter.
- Existing test evidence: `tests/node/site-capability-planner/dry-run.test.mjs`
  covers the `intentInput.standardIntent` path when `normalizedIntent` is
  omitted, and existing schema-validator tests cover missing normalized intent
  rejection.
- Verification command: `node --test tests\node\site-capability-planner\dry-run.test.mjs`;
  `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs tests\node\site-capability-planner\observability.test.mjs tests\node\site-capability-planner\dry-run.test.mjs`.
- Verification result: Focused dry-run suite passed 6/6; combined focused
  Planner suite passed 52/52.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Do not embed site-specific URL/page interpretation in Planner.
- Last updated: 2026-05-09
- Responsible subagent: PlannerContractSchemaAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 8. Capability / Route Resolution

- Section name: Capability / Route Resolution
- Requirement summary: Resolve site plus intent to capability, capability to
  route, route to endpoint/requirements/risk/schema/artifact refs, and select
  route by priority/safety/compatibility from validated Graph only.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/loader.mjs` establishes
  the validated Graph source prerequisite; `src/sites/capability/planner/route-resolver.mjs`
  resolves site plus normalized intent or capability id to a Graph
  `CapabilityNode`, resolves Graph `routeRefs` to `RouteNode` descriptors,
  selects the highest-priority Graph route, emits Graph-sourced route
  candidates, and preserves execution-disabled descriptor-only output.
- Existing test evidence: `tests/node/site-capability-planner/graph-loader.test.mjs`
  verifies Graph validation provenance; `tests/node/site-capability-planner/route-resolver.test.mjs`
  verifies highest-priority route selection, Graph-declared fallback
  descriptors, missing graph source, graph version mismatch, unresolved site,
  unresolved capability, unresolved route refs, sensitive/runtime route field
  rejection, non-Graph route rejection, and execution/downloader flag rejection.
- Verification command: `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs`.
- Verification result: Focused Planner schema + graph loader + route resolver
  suite passed 21/21.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Fallbacks and route candidates must explicitly come from Graph.
- Last updated: 2026-05-09
- Responsible subagent: GraphLayerIntegrationAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 9. Requirement / Context Checking

- Section name: Requirement / Context Checking
- Requirement summary: Check auth, session, signer, approval, risk, graph
  version, layer compatibility, adapter capability, schema availability, and
  agent exposure.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/context-checker.mjs`
  consumes a descriptor-only route resolution plus minimized PlanContext summary
  and checks graph validation state, Layer compatibility, adapter capability,
  schema availability, agent exposure, auth, session, signer, approval, and
  risk policy without materializing sessions, signers, Layer handoff, or runtime
  execution.
- Existing test evidence: `tests/node/site-capability-planner/context-checker.test.mjs`
  covers satisfied requirements, auth/session/signer/approval failures,
  graph/layer/adapter/schema/agent exposure failures, risk policy blocks,
  sensitive/runtime material rejection, and runtime materialization flag
  rejection.
- Verification command: `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs`.
- Verification result: Focused Planner schema + graph loader + route resolver +
  context checker suite passed 27/27.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Context checker must not obtain or persist missing auth/session.
- Last updated: 2026-05-09
- Responsible subagent: ContextRiskSecurityAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 10. RiskPolicy / Approval Gate

- Section name: RiskPolicy / Approval Gate
- Requirement summary: Enforce Graph-declared risk policies and approval
  requirements before route readiness.
- Current status: `verified`
- Existing code evidence: `context-checker.mjs` maps non-readOnly or
  approval-required plans without approval to `planner.approval_required` and
  maps risk policy or risk state blocks to `planner.route_forbidden_by_risk`
  while preserving source risk reason, cooldown, manual recovery, and
  degradation flags as descriptor metadata.
- Existing test evidence: `context-checker.test.mjs` covers approval-required
  failure and risk-policy block failure with source reason preservation.
- Verification command: `node --test tests\node\site-capability-planner\context-checker.test.mjs`.
- Verification result: Focused Planner context checker suite passed 6/6 as part
  of the combined 27/27 Planner suite.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Non-readOnly capability must require approval.
- Last updated: 2026-05-09
- Responsible subagent: ContextRiskSecurityAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 11. AuthRequirement / SessionRequirement / SignerRequirement

- Section name: AuthRequirement / SessionRequirement / SignerRequirement
- Requirement summary: Planner checks declared auth/session/signer descriptors
  without raw cookies, raw sessions, raw profile material, or signer secrets.
- Current status: `verified`
- Existing code evidence: `context-checker.mjs` checks descriptor-only
  auth/session/signer requirements against minimized PlanContext state and maps
  unsatisfied requirements to `planner.auth_required`,
  `planner.session_required`, and `planner.signer_required` without requiring
  raw cookies, SessionView materialization, signer secrets, or browser profile
  material.
- Existing test evidence: `context-checker.test.mjs` covers auth, session, and
  signer unsatisfied failures and raw sensitive/runtime material rejection.
- Verification command: `node --test tests\node\site-capability-planner\context-checker.test.mjs`.
- Verification result: Focused Planner context checker suite passed 6/6 as part
  of the combined 27/27 Planner suite.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: RequiresCookie must never mean raw cookie material in Planner.
- Last updated: 2026-05-09
- Responsible subagent: ContextRiskSecurityAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 12. Fallback / Degradation Strategy

- Section name: Fallback / Degradation Strategy
- Requirement summary: Select fallback or degradation only from validated
  Graph-declared fallback routes.
- Current status: `verified`
- Existing code evidence: `route-resolver.mjs` reads only the selected Graph
  `RouteNode.fallbackRouteRefs` and emits fallback descriptors with
  `source=site-capability-graph`; it rejects unresolved fallback refs through the
  same route-ref resolver. `fallback-strategy.mjs` consumes only compatible
  `PlannerRouteResolution` and descriptor-only `PlannerContextCheck`, returns
  `PlannerFallbackDecision`, selects only Graph-sourced fallbacks from
  `routeResolution.fallbacks`, maps degradable missing fallbacks to
  `planner.fallback_not_found`, preserves blocked/source reason metadata, keeps
  execution/dispatch/runtime flags false, and rejects runtime or sensitive
  payload fields. `dry-run.mjs` now includes `fallbackDecision` and can produce
  a descriptor-only degraded CapabilityPlan when a risk-blocked route has a
  Graph-declared fallback.
- Existing test evidence: `route-resolver.test.mjs` verifies a selected
  high-priority route can expose a Graph-declared metadata fallback and that the
  fallback descriptor remains Graph-sourced. `fallback-strategy.test.mjs`
  covers satisfied context with no fallback, degradable risk-blocked fallback
  selection, degradable missing fallback mapping to
  `planner.fallback_not_found`, version/schema degradation decisions,
  non-degradable blocked failures, non-Graph fallback rejection, route/context
  mismatch rejection, runtime/sensitive payload rejection without secret echo,
  input non-mutation, and dry-run degraded plan integration.
- Verification command: `node --check src\sites\capability\planner\fallback-strategy.mjs`;
  `node --check tests\node\site-capability-planner\fallback-strategy.test.mjs`;
  `node --test tests\node\site-capability-planner\fallback-strategy.test.mjs`;
  `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\dry-run.test.mjs tests\node\site-capability-planner\fallback-strategy.test.mjs tests\node\site-capability-planner\non-goals-boundary.test.mjs`;
  `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\fallback-strategy.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs tests\node\site-capability-planner\observability.test.mjs tests\node\site-capability-planner\dry-run.test.mjs tests\node\site-capability-planner\non-goals-boundary.test.mjs tests\node\site-capability-planner\layer-handoff.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`;
  `node tools\prepublish-secret-scan.mjs`.
- Verification result: Syntax checks passed; focused fallback strategy suite
  passed 10/10; focused fallback-related suite passed 48/48; combined focused
  Planner suite passed 73/73; intent-to-add diff check passed; prepublish
  secret scan passed, scanning 615 candidate files.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Planner must return `planner.fallback_not_found` when Graph has
  no fallback.
- Last updated: 2026-05-09
- Responsible subagent: GraphLayerIntegrationAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 13. Failure Modes / reasonCode

- Section name: Failure Modes / reasonCode
- Requirement summary: Define Planner reasonCodes and semantics for retry,
  cooldown, manual intervention, degradation, artifact writes, and Layer
  handoff.
- Current status: `verified`
- Existing code evidence: `validator.mjs`, `loader.mjs`, and
  `route-resolver.mjs` throw Planner-specific error codes for invalid requests,
  missing/unvalidated Graph input, incompatible versions, missing route sources,
  missing capability, unresolved site, unresolved route refs, missing approval,
  artifact redaction requirements, and sensitive/runtime material rejection.
  `context-checker.mjs` adds descriptor failures for auth, session, signer,
  approval, risk, graph validation, Layer compatibility, adapter capability,
  schema availability, and agent exposure. `src/sites/capability/planner/reason-codes.mjs`
  defines the Planner reasonCode catalog, required failure semantics, source
  Graph reason mappings, and compatibility assertions.
- Existing test evidence: `schema-validator.test.mjs`, `graph-loader.test.mjs`,
  and `route-resolver.test.mjs` assert representative Planner error `code`
  values for request invalidity, graph missing/not validated, version
  incompatibility, site/capability/route unresolved, approval required, and
  sensitive material rejection. `context-checker.test.mjs` asserts context
  failure reasonCodes and source risk reason preservation.
  `tests/node/site-capability-planner/reason-codes.test.mjs` verifies the full
  required Planner reasonCode list, retry/cooldown/manual/degradation semantics,
  artifact-write and Layer-handoff denial defaults, Graph source reason mapping,
  cataloged context checker failures, and malformed catalog rejection.
- Verification command: `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs`.
- Verification result: Focused Planner schema + graph loader + route resolver +
  context checker + reasonCode suite passed 32/32.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Do not blur Graph reasonCodes and Planner reasonCodes without a
  mapping.
- Last updated: 2026-05-09
- Responsible subagent: ContextRiskSecurityAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 14. Versioning / Compatibility

- Section name: Versioning / Compatibility
- Requirement summary: Enforce Planner schema, planner, Graph, Layer, artifact,
  and reason taxonomy compatibility versions.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/schema.mjs` defines
  `SITE_CAPABILITY_PLANNER_SCHEMA_VERSION`,
  `SITE_CAPABILITY_PLANNER_VERSION`, compatible schema versions, and
  `createPlannerCompatibilityDeclaration()`; `validator.mjs` fail-closes
  incompatible Planner schema versions and requires CapabilityPlan
  `plannerVersion` and `graphVersion`; `loader.mjs` fail-closes Graph validation
  report graphVersion mismatches, expected Graph data version mismatches, and
  expected Graph schema version mismatches.
- Existing test evidence: `tests/node/site-capability-planner/schema-validator.test.mjs`
  covers current schema compatibility, future schema rejection, required
  `plannerVersion`, required `graphVersion`, and compatibility declaration
  fail-closed behavior; `tests/node/site-capability-planner/graph-loader.test.mjs`
  covers Graph validation report graphVersion mismatch, expected graphVersion
  mismatch, and expected graphSchemaVersion mismatch.
- Verification command: `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs`.
- Verification result: Focused Planner schema + graph loader suite passed 16/16.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Fail closed on unknown incompatible Graph or Layer versions.
- Last updated: 2026-05-09
- Responsible subagent: PlannerContractSchemaAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 15. Trust Boundary

- Section name: Trust Boundary
- Requirement summary: Planner consumes only validated Graph, policy
  descriptors, minimized context, compatibility metadata, and redacted fixtures.
- Current status: `verified`
- Existing code evidence: `validator.mjs` rejects Planner sensitive/runtime
  fields across PlanRequest, PlanContext, CapabilityPlan, PlanArtifact, and
  PlanManifest; `loader.mjs` applies the same guard to incoming Graph and
  validation report inputs before returning a summary descriptor only;
  `route-resolver.mjs` applies the same guard to Graph route input and route
  resolution output.
  `context-checker.mjs` applies the same guard to route resolution, PlanContext,
  requirement, capability, and risk policy inputs, and emits descriptor-only
  checks with runtime materialization disabled. `plan-artifact.mjs` applies the
  same guard plus SecurityGuard redaction before artifact or manifest writes,
  returns descriptor-only write evidence, writes audit before artifact, and
  disables Layer handoff, SiteAdapter, downloader, runtime materialization,
  ArtifactService, and Graph mutation flags in the public result.
  `observability.mjs` rejects payload-bearing lifecycle fields, validates only
  cataloged Planner reasonCodes, requires redaction-required descriptor-only
  event flags, and disables external telemetry, lifecycle dispatch, execution,
  Layer handoff, SiteAdapter, downloader, ArtifactService, and Graph mutation.
  `dry-run.mjs` and `layer-handoff.mjs` preserve the same trust boundary across
  generated CapabilityPlan, PlannerDryRunResult, lifecycle event, and
  PlannerLayerHandoffDescriptor outputs; the Layer handoff descriptor requires
  nested dry-run validation and keeps Layer dispatch, execution, SiteAdapter,
  downloader, session/runtime materialization, ArtifactService, telemetry, logs,
  lifecycle dispatch, and Graph mutation disabled.
- Existing test evidence: `schema-validator.test.mjs` rejects runtime products
  in plans; `graph-loader.test.mjs` rejects Graph descriptors containing
  sensitive headers and executable route handler fields; `route-resolver.test.mjs`
  rejects sensitive/runtime route fields and execution/downloader flags;
  `context-checker.test.mjs` rejects sensitive headers, SessionView-shaped
  requirement material, runtime materialization flags, and Layer handoff flags.
  `plan-artifact.test.mjs` rejects missing redaction, sensitive payloads before
  persistence, unsafe write inputs before partial files are created, unguarded
  write claims, non-audit-first ordering, and payload-bearing write results.
  `observability.test.mjs` rejects sensitive/runtime event material without
  secret echo, payload fields, uncataloged reasonCodes, and runtime/telemetry
  claims. `dry-run.test.mjs`, `non-goals-boundary.test.mjs`, and
  `layer-handoff.test.mjs` cover descriptor-only dry-run and Layer handoff
  outputs, import-boundary enforcement, nested dry-run validation, runtime
  payload denial, execution-flag denial, blocked handoff reasonCodes, and
  no-secret-echo behavior.
- Verification command: `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs tests\node\site-capability-planner\observability.test.mjs tests\node\site-capability-planner\dry-run.test.mjs tests\node\site-capability-planner\non-goals-boundary.test.mjs tests\node\site-capability-planner\layer-handoff.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`;
  `node tools\prepublish-secret-scan.mjs`.
- Verification result: Focused Planner schema + graph loader + route resolver +
  context checker + reasonCode + plan artifact + observability + dry-run +
  non-goals + Layer handoff suite passed 63/63; focused Layer handoff suite
  passed 6/6; intent-to-add diff check passed; prepublish secret scan passed,
  scanning 613 candidate files.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Reject executable handlers, downloader command payloads, runtime
  SiteAdapter products, and unredacted artifacts.
- Last updated: 2026-05-09
- Responsible subagent: QualityGateReviewAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 16. SecurityGuard / Redaction Integration

- Section name: SecurityGuard / Redaction Integration
- Requirement summary: Planner-derived artifacts must require redaction and
  pass SecurityGuard / Redaction before persistence.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/validator.mjs` imports
  `assertNoForbiddenPatterns()` and `isSensitiveFieldName()` from
  `security-guard.mjs`, adds Planner-specific denied sensitive/runtime field
  checks, requires `CapabilityPlan.redactionRequired=true`, and requires
  `PlanArtifact`, `PlanManifest`, and `expectedArtifacts[]` to be
  redaction-required descriptors; `loader.mjs` rejects sensitive/runtime fields
  in Graph loader input and emits only redaction-required graph source summaries.
  `src/sites/capability/planner/plan-artifact.mjs` adds Planner-local
  `preparePlannerArtifactForWrite()`, `preparePlannerManifestForWrite()`,
  `writePlannerArtifact()`, `writePlannerManifest()`, and
  `assertPlannerArtifactWriteResultCompatible()` paths that use
  `prepareRedactedArtifactJsonWithAudit()` before persistence, write audit
  before artifact, expose only safe write-result descriptors, and reject
  payload-bearing result fields.
- Existing test evidence: `tests/node/site-capability-planner/schema-validator.test.mjs`
  rejects raw cookie/session-shaped fields, sensitive query values, browser
  profile fields, headers, storage state, credential refs, unredacted expected
  artifacts, unredacted PlanArtifact/PlanManifest entries, StandardTaskList,
  SiteAdapter runtime decisions, and downloader tasks; tests assert sensitive
  synthetic values are not echoed in error messages.
  `tests/node/site-capability-planner/graph-loader.test.mjs` rejects Graph
  inputs carrying sensitive headers or runtime handler fields.
  `tests/node/site-capability-planner/route-resolver.test.mjs` rejects route
  resolver inputs carrying sensitive query values or executable handler fields.
  `tests/node/site-capability-planner/context-checker.test.mjs` rejects
  sensitive headers and SessionView-shaped requirement material.
  `tests/node/site-capability-planner/plan-artifact.test.mjs` covers
  audit-before-artifact writes for PlanArtifact and PlanManifest, missing
  redaction rejection, sensitive payload rejection before persistence, no
  partial writes for unsafe inputs, write-result payload-field rejection, and
  audit metadata compatibility.
- Verification command: `node --test tests\node\site-capability-planner\schema-validator.test.mjs`;
  `node --test tests\node\site-capability-planner\graph-loader.test.mjs`;
  `node --test tests\node\site-capability-planner\route-resolver.test.mjs`;
  `node --test tests\node\site-capability-planner\context-checker.test.mjs`;
  `node --test tests\node\site-capability-planner\plan-artifact.test.mjs`;
  `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`;
  `node tools\prepublish-secret-scan.mjs`.
- Verification result: Focused Planner schema + graph loader + route resolver +
  context checker + reasonCode + plan artifact suite passed 40/40; focused
  PlanArtifact suite passed 8/8; diff check passed; prepublish secret scan
  passed, scanning 606 candidate files.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Any planner artifact write path without SecurityGuard /
  Redaction is a blocker.
- Last updated: 2026-05-09
- Responsible subagent: ContextRiskSecurityAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 17. Plan Artifact / Plan Manifest Governance

- Section name: Plan Artifact / Plan Manifest Governance
- Requirement summary: Govern PlanArtifact, PlanManifest, dry-run output,
  Layer handoff descriptor, validation report, redaction audit summary, and
  planner lifecycle fixtures.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/schema.mjs` lists
  `PlanArtifact`, `PlanManifest`, and `PlannerArtifactWriteResult`;
  `validator.mjs` validates redaction-required PlanArtifact and PlanManifest
  descriptors and rejects Planner sensitive/runtime fields. `plan-artifact.mjs`
  adds Planner-local artifact governance functions:
  `preparePlannerArtifactForWrite()`, `preparePlannerManifestForWrite()`,
  `writePlannerArtifact()`, `writePlannerManifest()`,
  `createPlanManifestFromArtifacts()`, and
  `assertPlannerArtifactWriteResultCompatible()`. The write path uses
  SecurityGuard redaction and audit preparation before persistence, writes the
  audit file before the artifact or manifest file, and returns only
  descriptor-only write evidence.
- Existing test evidence: `tests/node/site-capability-planner/plan-artifact.test.mjs`
  covers redacted artifact preparation, guarded PlanArtifact writes, guarded
  PlanManifest writes, missing-redaction rejection, sensitive payload rejection,
  fail-before-persistence behavior with no partial files, redaction-required
  manifest building, unguarded write claim rejection, non-audit-first write
  result rejection, payload-bearing write result rejection, and audit metadata
  compatibility. `schema-validator.test.mjs` covers PlanManifest validation and
  redaction-required expected artifacts.
- Verification command: `node --check src\sites\capability\planner\plan-artifact.mjs`;
  `node --check tests\node\site-capability-planner\plan-artifact.test.mjs`;
  `node --test tests\node\site-capability-planner\plan-artifact.test.mjs`;
  `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`;
  `node tools\prepublish-secret-scan.mjs`.
- Verification result: Syntax checks passed; focused PlanArtifact suite passed
  8/8; combined focused Planner suite passed 40/40; diff check passed;
  prepublish secret scan passed, scanning 606 candidate files.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Planner artifacts are not runtime execution records.
- Last updated: 2026-05-09
- Responsible subagent: ContextRiskSecurityAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 18. Observability / Lifecycle Events

- Section name: Observability / Lifecycle Events
- Requirement summary: Define Planner trace/correlation/task/site/intent/
  capability/route/version/decision/reason/risk/validation/artifact/redaction
  event fields with real producer or focused test coverage.
- Current status: `verified`
- Existing code evidence: `src/sites/capability/planner/schema.mjs` now lists
  `PlannerLifecycleEvent`; `src/sites/capability/planner/observability.mjs`
  adds a Planner-local lifecycle event descriptor factory and compatibility
  validator. It covers `traceId`, `correlationId`, `taskId`, site descriptors,
  normalized intent, capability, route, Graph version, planner version, Layer
  compatibility version, adapter id, planner decision, cataloged reasonCode,
  risk state, validation result, artifact write event, and redaction event
  summaries. It rejects payload-bearing observability fields and disables
  execution, Layer handoff, lifecycle dispatch, external telemetry,
  SiteAdapter, downloader, ArtifactService, runtime materialization, logs, and
  Graph mutation.
- Existing test evidence: `tests/node/site-capability-planner/observability.test.mjs`
  validates a descriptor-only Planner lifecycle event, required field
  fail-closed behavior, compatible schema enforcement, cataloged reasonCode
  checks, guarded artifact write event integration, redaction summary
  validation, sensitive/runtime material rejection without secret echo, payload
  field rejection, and runtime/telemetry flag rejection.
- Verification command: `node --check src\sites\capability\planner\observability.mjs`;
  `node --check tests\node\site-capability-planner\observability.test.mjs`;
  `node --test tests\node\site-capability-planner\observability.test.mjs`;
  `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs tests\node\site-capability-planner\observability.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`;
  `node tools\prepublish-secret-scan.mjs`.
- Verification result: Syntax checks passed; focused Planner observability
  suite passed 6/6; combined focused Planner suite passed 46/46;
  intent-to-add diff check passed; prepublish secret scan passed, scanning 608
  candidate files.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Do not add fake metrics or external telemetry.
- Last updated: 2026-05-09
- Responsible subagent: TestVerificationAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 19. Testing Strategy

- Section name: Testing Strategy
- Requirement summary: Add schema, validator, graph loader, route resolver,
  context checker, risk, approval, fallback, reasonCode, compatibility,
  redaction, artifact, dry-run entrypoint, and Layer compatibility tests.
- Current status: `verified`
- Existing code evidence: Planner-specific schema, validator, validated Graph
  loader, route resolver, context checker, fallback strategy, reasonCode
  catalog, artifact governance, observability, and dry-run entrypoint modules
  now exist under `src/sites/capability/planner/`; `layer-handoff.mjs` adds
  descriptor-only Site Capability Layer compatibility output.
- Existing test evidence: `tests/node/site-capability-planner/schema-validator.test.mjs`
  is the first Planner-specific focused test suite and covers positive and
  negative schema/validator behavior with synthetic fixtures only.
  `tests/node/site-capability-planner/graph-loader.test.mjs` adds validated
  Graph loader tests with synthetic Graph fixtures and no live site access.
  `route-resolver.test.mjs`, `context-checker.test.mjs`,
  `reason-codes.test.mjs`, `plan-artifact.test.mjs`, and
  `observability.test.mjs`, `dry-run.test.mjs`,
  `fallback-strategy.test.mjs`, and `non-goals-boundary.test.mjs` cover
  priority route selection, Graph-declared fallback descriptors,
  context/risk/approval failures, fallback/degradation decisions, reasonCode
  semantics, guarded Planner artifact/manifest writes, descriptor-only Planner
  lifecycle event validation, descriptor-only dry-run CapabilityPlan generation,
  and Planner non-goals/import boundaries. `layer-handoff.test.mjs` covers ready
  and blocked PlannerLayerHandoffDescriptor outputs, missing or mismatched
  nested dry-run results, required identity fields, runtime payload rejection,
  execution-flag rejection, and nested CapabilityPlan validation.
  `matrix.test.mjs` validates the Planner documentation set, the 20-section
  DESIGN and implementation matrix structure, allowed status values, top-level
  status count consistency, required evidence fields, conservative non-verified
  status, stale fallback/handoff wording, and current Planner test/module
  evidence.
- Verification command: `node --check src\sites\capability\planner\schema.mjs`;
  `node --check src\sites\capability\planner\validator.mjs`;
  `node --check src\sites\capability\planner\index.mjs`;
  `node --check src\sites\capability\planner\loader.mjs`;
  `node --check src\sites\capability\planner\route-resolver.mjs`;
  `node --check src\sites\capability\planner\context-checker.mjs`;
  `node --check src\sites\capability\planner\fallback-strategy.mjs`;
  `node --check src\sites\capability\planner\reason-codes.mjs`;
  `node --check src\sites\capability\planner\plan-artifact.mjs`;
  `node --check src\sites\capability\planner\observability.mjs`;
  `node --check src\sites\capability\planner\dry-run.mjs`;
  `node --check src\sites\capability\planner\layer-handoff.mjs`;
  `node --check tests\node\site-capability-planner\schema-validator.test.mjs`;
  `node --check tests\node\site-capability-planner\graph-loader.test.mjs`;
  `node --check tests\node\site-capability-planner\route-resolver.test.mjs`;
  `node --check tests\node\site-capability-planner\context-checker.test.mjs`;
  `node --check tests\node\site-capability-planner\fallback-strategy.test.mjs`;
  `node --check tests\node\site-capability-planner\reason-codes.test.mjs`;
  `node --check tests\node\site-capability-planner\plan-artifact.test.mjs`;
  `node --check tests\node\site-capability-planner\observability.test.mjs`;
  `node --check tests\node\site-capability-planner\dry-run.test.mjs`;
  `node --check tests\node\site-capability-planner\non-goals-boundary.test.mjs`;
  `node --check tests\node\site-capability-planner\layer-handoff.test.mjs`;
  `node --check tests\node\site-capability-planner\matrix.test.mjs`;
  `node --test tests\node\site-capability-planner\matrix.test.mjs`;
  `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\fallback-strategy.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs tests\node\site-capability-planner\observability.test.mjs tests\node\site-capability-planner\dry-run.test.mjs tests\node\site-capability-planner\non-goals-boundary.test.mjs tests\node\site-capability-planner\layer-handoff.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`;
  `node tools\prepublish-secret-scan.mjs`.
- Verification result: Syntax checks passed; focused Planner schema + graph
  loader + route resolver + context checker + fallback strategy + reasonCode +
  plan artifact + observability + dry-run +
  non-goals + Layer handoff suite passed 73/73; focused fallback strategy suite
  passed 10/10; focused Layer handoff suite passed 6/6; focused non-goals suite passed 5/5;
  focused dry-run suite passed 6/6; focused observability
  suite passed 6/6; focused PlanArtifact suite passed 8/8; focused Planner
  matrix final-state validator suite passed 6/6; combined focused Planner suite including
  matrix final-state validation passed 79/79; intent-to-add diff check passed. Prepublish
  secret scan passed after the final matrix validator update, scanning 616 candidate
  files.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Do not claim verification from unrelated tests.
- Last updated: 2026-05-09
- Responsible subagent: TestVerificationAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## 20. Standard Outputs And Final Goal

- Section name: Standard Outputs And Final Goal
- Requirement summary: Complete Planner standard products and verify sections
  1-20 with code, tests, validation results, and final QualityGate acceptance.
- Current status: `verified`
- Existing code evidence: Standard Planner products now include versioned
  schema definitions, validators, validated Graph loader, route resolver,
  context checker, reasonCode catalog, artifact governance, observability
  descriptor producer, fallback/degradation strategy, non-goal guards,
  `createDryRunCapabilityPlan()` producing CapabilityPlan plus
  PlannerDryRunResult, and
  `createPlannerLayerHandoffDescriptor()` producing descriptor-only Layer
  compatibility output.
- Existing test evidence: Planner-focused suites cover schema/validator, graph
  loader, route resolver, context checker, reasonCode catalog, artifact
  governance, observability descriptor, fallback/degradation decisions, dry-run
  entrypoint behavior, Planner non-goals/import boundaries, Layer compatibility
  descriptors, and Planner documentation/matrix structure.
- Verification command: `node --test tests\node\site-capability-planner\schema-validator.test.mjs tests\node\site-capability-planner\graph-loader.test.mjs tests\node\site-capability-planner\route-resolver.test.mjs tests\node\site-capability-planner\context-checker.test.mjs tests\node\site-capability-planner\fallback-strategy.test.mjs tests\node\site-capability-planner\reason-codes.test.mjs tests\node\site-capability-planner\plan-artifact.test.mjs tests\node\site-capability-planner\observability.test.mjs tests\node\site-capability-planner\dry-run.test.mjs tests\node\site-capability-planner\non-goals-boundary.test.mjs tests\node\site-capability-planner\layer-handoff.test.mjs tests\node\site-capability-planner\matrix.test.mjs`;
  `git add --intent-to-add -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git diff --check -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner; git reset -q -- src\sites\capability\planner tests\node\site-capability-planner docs\site-capability-planner`;
  `node tools\prepublish-secret-scan.mjs`.
- Verification result: Combined focused Planner suite including matrix
  final-state validation passed 79/79; intent-to-add diff check passed; prepublish secret
  scan passed, scanning 616 candidate files.
- Current gaps: None known for the current Planner goal after final validation.
- Next smallest task: Maintain Planner regression coverage and matrix evidence when changing Planner behavior.
- Risk notes: Entire goal is incomplete until all Planner sections are
  `verified`; documentation alone is not final completion.
- Last updated: 2026-05-09
- Responsible subagent: QualityGateReviewAgent
- QualityGateReviewAgent conclusion: Final Accepted by QualityGateReviewAgent; verified.

## First Five Minimal Verifiable Implementation Tasks

1. Establish Planner schema and minimum CapabilityPlan validator.
   - Target sections: 5, 6, 14, 16, 19.
   - Verification: Planner schema/validator focused tests.

2. Add raw credential and runtime product rejection tests.
   - Target sections: 2, 5, 15, 16.
   - Verification: Planner validator negative tests.

3. Add validated Graph loader contract.
   - Target sections: 3, 8, 14.
   - Verification: Graph loader tests using synthetic validated and invalid
     graph descriptors.

4. Add route resolver with priority and fallback selection.
   - Target sections: 8, 12, 13.
   - Verification: route selection, priority, and fallback tests.

5. Add context checker for auth/session/signer/risk/approval gates.
   - Target sections: 9, 10, 11, 13.
   - Verification: context unsatisfied, risk-blocked, approval-required, and
     requirement reasonCode tests.

## Goal 1 Initialization Review

Goal 1 created the Planner documentation set only. It did not create code, add
tests, or promote any section to `verified`.

- RepoMatrixAuditor: preflight required; current repository has substantial
  pre-existing uncommitted changes, so implementation must remain narrowly
  scoped.
- PlannerContractSchemaAgent: first implementation should be schema and
  validator focused.
- GraphLayerIntegrationAgent: existing Graph validation and route/fallback
  evidence are migration inputs only; Planner must still implement its own
  loader/resolver path.
- ContextRiskSecurityAgent: existing redaction and SecurityGuard paths are
  migration inputs; Planner must still add direct artifact/redaction checks.
- TestVerificationAgent: first verification should be focused Planner tests,
  not broad unrelated suites.
- QualityGateReviewAgent: initialization accepted only as scope setup; no
  Planner section is verified.
