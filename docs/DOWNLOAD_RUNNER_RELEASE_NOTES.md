# Download Runner Phase 2 Release Notes

This branch is stacked on the unpublished local `main` download/social base. Do not open a pull request directly against `origin/main` unless the base commits are intentionally included.

## Current Stack

- Base branch: local `main` at `0f16cf2 feat(downloads): add unified runner with legacy adapters`
- Feature branch: `codex/download-runner-phase2`
- Remote status at verification time: `origin/main` remained at `ea462ff`; no upstream was configured for `codex/download-runner-phase2`.

## Included Capabilities

- Unified download runner contracts, manifests, recovery, and legacy adapter normalization.
- Reusable media executor for social media downloads with queue/resume, dedupe, curl fallback, adaptive concurrency, and Instagram post folders.
- Native resource seed resolvers for `22biqu`, `bilibili`, `douyin`, and `xiaohongshu` when concrete resource data is already provided.
- X/Instagram runner facade that maps runner requests into existing social action entrypoints while preserving action-level artifacts.
- Session health preflight for required/auth-required downloads before legacy spawn.
- Updated repo-local and installed Codex skills for `22biqu`, `bilibili`, `x`, and `instagram`.

## Publication Sequence

1. Keep `C:\Users\lyt-p\Desktop\Browser-Wiki-Skill` dirty social files out of this branch.
2. Run `git fetch origin --prune` and confirm `origin/main` did not move.
3. Publish or review the local `main` base stack first.
4. Push `codex/download-runner-phase2` after the base stack is available remotely.
5. Open the phase2 PR against the published base, not against stale `origin/main`.

## Validation

Required before publication:

```powershell
node --test tests\node\*.test.mjs
python -m unittest discover -s tests\python -p "test_*.py"
git status --short --branch
git -C C:\Users\lyt-p\Desktop\Browser-Wiki-Skill status --short --branch
```

The branch intentionally does not perform real authenticated downloads or account login checks. Live X/Instagram completeness remains a separate profile/session verification step.

## Original Worktree Social Changes

Most original dirty social changes have been migrated into this branch. Before discarding the original dirty files, confirm:

- Instagram feed-user archive behavior is covered by the branch.
- Social archive `index.csv` / `index.html` artifacts are covered.
- Media executor owns nested Instagram folders, existing-file reuse, curl fallback, and adaptive concurrency.
- `apiCursorSuppressed` artifact settings and full archive `maxItems >= 2000` are covered.

