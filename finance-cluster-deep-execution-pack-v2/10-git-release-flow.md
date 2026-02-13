# 10 – Git / Release Flow for V2

## Recommended branches

- `main`: always deployable
- `release/v2`: integration branch for V2
- `feature/*`: small changes, merged into `release/v2`

## Workflow

1. `git checkout main && git pull`
2. `git checkout -b release/v2`
3. Create small feature branches:
   - `feature/v2-foundation`
   - `feature/v2-loan`
   - `feature/v2-salary`
4. Merge into `release/v2`, keep it green.
5. When ready: merge `release/v2` → `main`
6. Tag:
   - `v2.0.0` for first V2 release
   - `v2.0.1` for hotfixes

## Pre-push checklist

- `pnpm lint`
- `pnpm test`
- `pnpm build`
- (if enabled) `pnpm test:e2e`

## V2 policy

- Phases 0–3 only.
- Phase 4+ deferred to V3.
