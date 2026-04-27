# Download Runner Phase 2 Release Notes

This branch is stacked on the unpublished local `main` download/social base. Do not open a pull request directly against `origin/main` unless the base commits are intentionally included.

## Current Stack

- Base branch: local `main` at `0f16cf2 feat(downloads): add unified runner with legacy adapters`
- Feature branch: `codex/download-runner-phase2`
- Remote status at verification time: `origin/main` remained at `ea462ff`; no upstream was configured for `codex/download-runner-phase2`.
- Stack shape: `origin/main` < local `main` < `codex/download-runner-phase2`.
- Ahead counts after final publication packaging: local `main` is ahead of `origin/main` by 6 commits; `codex/download-runner-phase2` is ahead of local `main` by 22 commits and ahead of `origin/main` by 28 commits.
- Phase 1 base stack requirement: the 6-commit local `main` stack must be published or merged before Phase 2. Phase 2 must not be opened directly against stale `origin/main`, because that would mix the base social/download runner work with the Phase 2 feature changes.

## Included Capabilities

- Unified download runner contracts, manifests, recovery, and legacy adapter normalization.
- Reusable media executor for social media downloads with queue/resume, dedupe, curl fallback, adaptive concurrency, and Instagram post folders.
- Native resource seed resolvers for `bilibili`, `douyin`, and `xiaohongshu` when concrete resource data is already provided.
- `22biqu` native dry-run resolver support for provided chapter data and local book-content fixture/KB roots.
- X/Instagram runner facade that maps runner requests into existing social action entrypoints while preserving action-level artifacts.
- Session health preflight for required/auth-required downloads before legacy spawn.
- Updated repo-local and installed Codex skills for `22biqu`, `bilibili`, `x`, and `instagram`.

## Publication Sequence

1. Keep `C:\Users\lyt-p\Desktop\Browser-Wiki-Skill` dirty social files out of this branch.
2. Run `git fetch origin --prune` and confirm `origin/main` did not move.
3. Publish or review the local `main` base stack first as the Phase 1 PR against `origin/main`.
4. Wait until Phase 1 is either merged into `origin/main` or available as a remote base branch for stacked review.
5. Push `codex/download-runner-phase2` only after the Phase 1 base is available remotely.
6. Open the Phase 2 PR against the published Phase 1 branch or the updated `main`, not against stale `origin/main`.
7. If Phase 1 is merged after the Phase 2 branch was pushed, rebase or merge Phase 2 onto the new remote base before asking for final review.

## Stack Commit Summary

Phase 1 base stack, currently local `main` ahead of `origin/main` by 6 commits:

- `0a1c7d3 feat: add social X and Instagram workflows`
- `88c0199 feat: improve social live operations`
- `b553851 fix: harden social action media relation and state flows`
- `28f22a3 feat: add social live dashboard and health tasks`
- `6ad20a5 fix: refine social api cursor and run state handling`
- `0f16cf2 feat(downloads): add unified runner with legacy adapters`

Phase 2 stack, currently `codex/download-runner-phase2` ahead of local `main` by 22 commits:

- Runner reliability and recovery: resumable run recovery, hardened retry/resume semantics, manifest artifact contract, recovery diagnostics, and generic/legacy recovery unification.
- Modular runner architecture: reusable media executor, modular site planners/resolvers, split site download modules, first native site resource resolver, native seed resolvers, and expanded native resolver coverage.
- Social/archive integration: preserves social archive media improvements, archive defaults, and routes social requests through the runner facade.
- Operational hardening: session health preflight and session-aware recovery runbooks.
- Release documentation: runner migration/operation flow, Phase 2 release notes, and release package preparation.

Full Phase 2 commit list:

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

## Phase 2 PR Draft

Use `docs/DOWNLOAD_RUNNER_PHASE2_PR.md` as the PR body draft. The critical base instruction is:

- Base Phase 2 on the published Phase 1 branch or merged `main`.
- Do not base Phase 2 directly on old `origin/main` at `ea462ff`.
- Current stacked diff size is `origin/main +28` total, split as `local main +6` base plus `Phase 2 +22`.

## Validation

Required before publication:

```powershell
node --test tests\node\*.test.mjs
python -m unittest discover -s tests\python -p "test_*.py"
git status --short --branch
git -C C:\Users\lyt-p\Desktop\Browser-Wiki-Skill status --short --branch
```

Latest local validation after final social test-intent migration:

- Focused download/social suite: 113 passed.
- `node --test tests\node\*.test.mjs`: 556 passed.
- `python -m unittest discover -s tests\python -p "test_*.py"`: 46 passed.

The branch intentionally does not perform real authenticated downloads or account login checks. Live X/Instagram completeness remains a separate profile/session verification step.

## Original Worktree Social Changes

The original worktree still has two dirty social files:

- `src/sites/social/actions/router.mjs`
- `tests/node/social-action-router.test.mjs`

Static comparison shows the runtime behavior has been migrated into this branch:

- Instagram feed-user archive behavior is covered by the branch.
- Social archive `index.csv` / `index.html` artifacts are covered.
- Media executor owns nested Instagram folders, existing-file reuse, curl fallback retry arguments, and adaptive concurrency.
- `apiCursorSuppressed` artifact settings and full archive `maxItems >= 2000` are covered.
- Download tests now cover nested folder, existing-file reuse, curl fallback, and adaptive concurrency behavior that used to sit in the social router area.

Final social test-intent migration is covered in this branch:

- Explicit legacy CLI alias regression for `--download-concurrency`, `--download-retries`, and `--download-backoff-ms`.
- Instagram carousel fixture realism with `media_type: 1/2` alongside `image_versions2` and `video_versions`.

No core runtime gap was found in the static comparison.
