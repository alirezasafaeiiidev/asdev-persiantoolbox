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

- Status: done
- Completed:
  - modularized registry into `lib/tools-registry-data/*` modules with aggregator compatibility
- Evidence:
  - `lib/tools-registry.ts`
  - `lib/tools-registry-data/types.ts`
  - `lib/tools-registry-data/categories.ts`
  - `lib/tools-registry-data/category-content.ts`
  - `lib/tools-registry-data/raw-tools-registry.ts`

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

- Status: done
- Completed:
  - benchmark threshold gate + drift reporting integration
  - realistic PDF compression explainability/profile gate baseline
  - batch processing pipeline (queue + multi-file operations) for PDF compress
  - finance/HR trust upgrades (data-version visibility + CSV output flow)
- Evidence:
  - `scripts/quality/run-core-bench-gate.ts`
  - `docs/performance/core-tools-thresholds.json`
  - `features/pdf-tools/compress/compress-pdf.tsx`
  - `shared/pdf/compression-insights.ts`
  - `components/features/finance/FinanceTrustBlock.tsx`
  - `lib/finance-data-version.ts`
  - `shared/utils/csv.ts`
  - `components/features/loan/LoanPage.tsx`
  - `components/features/salary/SalaryPage.tsx`
  - `components/features/interest/InterestPage.tsx`

4. Phase 4 monetization enablement (local-first compatible)

- Status: done
- Completed:
  - offline signed-license verification connected to runtime pro-gating
- Evidence:
  - `app/pro/page.tsx`
  - `lib/offline-license.ts`
  - `tests/unit/offline-license.test.ts`

5. Phase 5 specialized Pro expansion

- Status: done
- Completed:
  - OCR intake contract and offline queue manager
  - Persian OCR post-processing pipeline (normalization + confidence tiers)
  - specialized pro outputs (DOCX/JSON export contracts)
  - QA matrix + benchmark gate for OCR/pro tools
  - ops/runbook integration for offline license continuity
- Evidence:
  - `features/pdf-tools/extract/extract-text.tsx`
  - `features/ocr/queue.ts`
  - `features/ocr/postprocess.ts`
  - `features/ocr/exports.ts`
  - `scripts/quality/run-ocr-pro-bench-gate.ts`
  - `docs/performance/ocr-pro-thresholds.json`
  - `docs/qa/OCR_PRO_QA_MATRIX.md`
  - `docs/release/OCR_PRO_ROLLOUT_RUNBOOK.md`

## Verdict

Roadmap is **complete on current planned phases**.
