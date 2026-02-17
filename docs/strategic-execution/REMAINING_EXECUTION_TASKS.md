# Remaining Execution Tasks - asdev-persiantoolbox

- Last updated: 2026-02-17
- Scope: repository roadmap completion audit

## Current State

- Release integrity artifacts are passing (`ci:quick`, `ci:contracts`, rc/launch/doD/state validations).
- Release registry is finalized as `done`:
  - `docs/release/release-state-registry.md`
  - `docs/release/v3-readiness-dashboard.md`
- Product roadmap (`docs/PRODUCT_ROADMAP.md`) is still partially complete.

## Remaining Tasks (Roadmap-Critical)

1. Phase 1 hardening completion

- Status: in progress
- Remaining:
  - modularize `lib/tools-registry.ts` into category modules + aggregator
- Evidence:
  - `docs/strategic-execution/ROADMAP_TASKS_PRIORITIZED.md`

2. Phase 2 SEO systemization completion

- Status: done
- Completed:
  - guide-page content cluster per category added (`/guides/*`)
  - landing-template + internal-linking contract enforced via tests
- Evidence:
  - `app/guides/page.tsx`
  - `app/guides/[slug]/page.tsx`
  - `lib/guide-pages.ts`
  - `tests/unit/guide-pages-contract.test.ts`

3. Phase 3 core quality upgrades

- Status: in progress
- Remaining:
  - finance/HR trust upgrades (data-versioning visibility + pro-grade output flow)
- Completed:
  - benchmark threshold gate + drift reporting integration
  - realistic PDF compression explainability/profile gate baseline
  - batch processing pipeline (queue + multi-file operations) for PDF compress
- Evidence:
  - `scripts/quality/run-core-bench-gate.ts`
  - `docs/performance/core-tools-thresholds.json`
  - `features/pdf-tools/compress/compress-pdf.tsx`
  - `shared/pdf/compression-insights.ts`

4. Phase 4 monetization enablement (local-first compatible)

- Status: done
- Completed:
  - offline signed-license verification connected to runtime pro-gating
- Evidence:
  - `app/pro/page.tsx`
  - `lib/offline-license.ts`
  - `tests/unit/offline-license.test.ts`

5. Phase 5 specialized Pro expansion

- Status: todo
- Remaining:
  - OCR فارسی roadmap items
  - specialized pro toolset rollout (as defined in product roadmap)

## Verdict

Roadmap is **not complete yet**.
