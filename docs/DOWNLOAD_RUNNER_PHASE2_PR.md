# Download Runner Phase 2 PR Draft

## Title

Download runner Phase 2: native resolvers, social facade, and recovery hardening

## Base Branch

This is a stacked Phase 2 PR. It must be based on the published Phase 1 branch or on `main` after Phase 1 has merged.

Do not open this PR directly against stale `origin/main` at `ea462ff`. The Phase 1 base stack is required first; otherwise the PR includes both the 6 base commits and the 22 Phase 2 commits in one review.

Current verified stack shape:

- `origin/main`: `ea462ff merge origin/main into local main`
- local `main`: `0f16cf2 feat(downloads): add unified runner with legacy adapters`
- Phase 2 branch: `codex/download-runner-phase2` after final publication packaging
- Ahead counts: `origin/main +28` total, `local main +22` for Phase 2, with local `main` itself `origin/main +6`

## Summary

Phase 2 extends the download runner from a unified legacy-adapter base into a more complete runner stack with native resolver coverage, shared media execution, social action routing, recovery diagnostics, and release documentation.

## Changes

- Adds and hardens resumable run recovery, retry/resume behavior, manifest contracts, and recovery diagnostics.
- Extracts a reusable media executor for social/archive downloads, including queue/resume, existing-file reuse, curl fallback support, nested Instagram folders, and adaptive concurrency coverage.
- Splits site download modules and expands native resolver coverage with stable resource seeds.
- Routes social requests through the runner facade while preserving existing action artifacts and archive defaults.
- Adds session health preflight and session-aware recovery runbook improvements.
- Adds migration, operation, release notes, and PR documentation for the stacked release.

## Publication Order

1. Publish Phase 1 first from local `main` against `origin/main`.
2. Wait for Phase 1 to be merged, or push it as a named remote base branch for stacked review.
3. Push `codex/download-runner-phase2`.
4. Open Phase 2 against the published Phase 1 branch or updated `main`.
5. If Phase 1 merges after Phase 2 is pushed, update Phase 2 onto the merged base before final review.

## Stack Commit Summary

Phase 1 base stack, local `main` ahead of `origin/main` by 6 commits:

- `0a1c7d3 feat: add social X and Instagram workflows`
- `88c0199 feat: improve social live operations`
- `b553851 fix: harden social action media relation and state flows`
- `28f22a3 feat: add social live dashboard and health tasks`
- `6ad20a5 fix: refine social api cursor and run state handling`
- `0f16cf2 feat(downloads): add unified runner with legacy adapters`

Phase 2 stack, `codex/download-runner-phase2` ahead of local `main` by 22 commits:

- `6077270 fix(downloads): harden runner resume and retry semantics`
- `4942760 feat(downloads): extract reusable media executor`
- `e9870fe feat(downloads): modularize site planners and resolvers`
- `d61bfc3 feat(downloads): add resumable run recovery`
- `f1cf767 feat(downloads): split site download modules`
- `acfa646 feat(downloads): harden run recovery diagnostics`
- `6c91134 feat(downloads): formalize manifest artifact contract`
- `25f401d feat(downloads): harden shared media executor for social archives`
- `bd6ced9 feat(social): preserve archive media improvements on download runner branch`
- `2f1ac7f feat(downloads): add first native site resource resolver`
- `4069600 feat(downloads): unify recovery across generic media and legacy runs`
- `0eeaebd docs(downloads): document runner migration and operation flow`
- `b347bff feat(downloads): add native media seed resolvers`
- `9123a77 feat(downloads): add session health preflight`
- `f55d4cb fix(social): preserve archive defaults in runner branch`
- `2878a57 feat(downloads): route social requests through runner facade`
- `9fb90e0 docs(downloads): add phase2 release notes`
- `18ddee9 feat(downloads): improve session-aware recovery runbooks`
- `3fe4aac feat(downloads): expand native resolver coverage with stable seeds`
- `419035a docs(downloads): prepare phase2 release package`
- `9d96c45 test(social): preserve migrated download alias coverage`
- `docs(downloads): finalize phase2 publication package` (this publication documentation commit)

## Validation

Before publication, rerun:

```powershell
node --test tests\node\*.test.mjs
python -m unittest discover -s tests\python -p "test_*.py"
git status --short --branch
```

Latest release notes record:

- Focused download/social suite: 113 passed.
- `node --test tests\node\*.test.mjs`: 556 passed.
- `python -m unittest discover -s tests\python -p "test_*.py"`: 46 passed.

Live authenticated X/Instagram completeness is not covered by these tests and should remain a separate profile/session verification step.
