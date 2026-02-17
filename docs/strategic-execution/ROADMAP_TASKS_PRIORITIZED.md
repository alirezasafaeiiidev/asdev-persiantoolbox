# Prioritized Roadmap Tasks - asdev-persiantoolbox

- Generated: 2026-02-17
- Source: `docs/PRODUCT_ROADMAP.md`, `docs/TECHNICAL_SPEC.md`
- Execution mode: Auto (local-first safe)
- Priority model: `P0` (Phase 1 hardening gates) -> `P1` (reliability UX) -> `P2` (growth/SEO/systemization)

| Priority | Phase   | Task                                                     | Status | Evidence                                                                                                                                                                                                                                                            | Next Action                                                |
| -------- | ------- | -------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| P0       | Phase 1 | CSP + Security Headers enforce in runtime                | Done   | `proxy.ts`, `tests/unit/proxy-csp.test.ts`                                                                                                                                                                                                                          | Keep policy strict; add regression tests on policy changes |
| P0       | Phase 1 | Local-First gate (no off-origin runtime dependency)      | Done   | `scripts/quality/verify-local-first.ts`, `pnpm gate:local-first` (OK on 2026-02-17)                                                                                                                                                                                 | Keep gate mandatory in CI                                  |
| P0       | Phase 1 | Quality gates lock (`lint + typecheck + test`)           | Done   | `pnpm ci:quick` passed on 2026-02-17                                                                                                                                                                                                                                | Keep as required check before merge                        |
| P1       | Phase 1 | Unified Error System (`useToolError`, ErrorBoundary map) | Done   | `shared/errors/tool.ts`, `shared/errors/ToolErrorBoundary.tsx`, `tests/unit/tool-error-utils.test.ts`, `tests/unit/tool-error-boundary.test.tsx`                                                                                                                    | Wire boundary/hook into tool shells progressively          |
| P1       | Phase 1 | Heavy file guardrails (size/type/Lite mode guidance)     | Done   | `shared/guardrails/heavy-file.ts`, `tests/unit/heavy-file-guardrails.test.ts`, integration in `features/pdf-tools/compress/compress-pdf.tsx` and `features/image-tools/image-tools.tsx`                                                                             | Roll out same contract to remaining heavy routes           |
| P1       | Phase 1 | Registry modularization (per-category + aggregator)      | Done   | `lib/tools-registry.ts`, `lib/tools-registry-data/types.ts`, `lib/tools-registry-data/categories.ts`, `lib/tools-registry-data/category-content.ts`, `lib/tools-registry-data/raw-tools-registry.ts`                                                                | Keep contract tests for registry/tier coverage             |
| P2       | Phase 2 | SEO systemization (schema/template/internal linking)     | Done   | `app/guides/page.tsx`, `app/guides/[slug]/page.tsx`, `lib/guide-pages.ts`, `lib/seo-tools.ts`, `tests/unit/guide-pages-contract.test.ts`, `tests/unit/seo-category-contract.test.ts`                                                                                | Keep guide quality bar/editorial review                    |
| P2       | Phase 3 | Core tool quality upgrade (PDF/Finance benchmarks)       | Done   | `components/features/finance/FinanceTrustBlock.tsx`, `lib/finance-data-version.ts`, `shared/utils/csv.ts`, `components/features/loan/LoanPage.tsx`, `components/features/salary/SalaryPage.tsx`, `components/features/interest/InterestPage.tsx`                    | Keep test coverage for trust/export contracts              |
| P2       | Phase 4 | Offline-compatible monetization enablement               | Done   | `lib/offline-license.ts`, `app/pro/page.tsx`, `tests/unit/offline-license.test.ts`                                                                                                                                                                                  | Add operational key rotation runbook                       |
| P1       | Phase 5 | OCR intake + processing + exports                        | Done   | `features/pdf-tools/extract/extract-text.tsx`, `features/ocr/queue.ts`, `features/ocr/postprocess.ts`, `features/ocr/exports.ts`, `tests/unit/ocr-queue.test.ts`, `tests/unit/ocr-postprocess.test.ts`, `tests/unit/ocr-exports.test.ts`, `tests/e2e/tools.spec.ts` | Keep OCR regression corpus updated                         |
| P2       | Phase 5 | OCR/Pro quality and ops gates                            | Done   | `scripts/quality/run-ocr-pro-bench-gate.ts`, `docs/performance/ocr-pro-thresholds.json`, `docs/qa/OCR_PRO_QA_MATRIX.md`, `docs/release/OCR_PRO_ROLLOUT_RUNBOOK.md`                                                                                                  | Keep benchmark baselines calibrated per release            |

## Auto Execution Log (2026-02-17)

1. `pnpm ci:quick` -> Passed
2. `pnpm vitest --run tests/unit/proxy-csp.test.ts tests/unit/local-first-gate.test.ts tests/unit/tool-tier-contract.test.ts tests/unit/tools-registry-indexing.test.ts` -> Passed
3. `pnpm vitest --run tests/unit/tool-error-utils.test.ts tests/unit/tool-error-boundary.test.tsx` -> Passed
4. `pnpm vitest --run tests/unit/heavy-file-guardrails.test.ts tests/unit/offline-license.test.ts tests/unit/tool-tier-contract.test.ts` -> Passed
5. `pnpm vitest --run tests/unit/guide-pages-contract.test.ts tests/unit/seo-category-contract.test.ts tests/unit/seo-jsonld-contract.test.ts tests/seo-tools.test.ts tests/unit/pdf-compression-insights.test.ts` -> Passed
6. `pnpm bench:gate` -> Passed (report persisted under `docs/performance/reports/`)
7. `pnpm ci:quick` -> Passed
8. `pnpm playwright test tests/e2e/tools.spec.ts -g "pdf ocr extract text page should render primary action" --project=chromium` -> Passed

## Ordered Next Task Queue

1. `P1` Continuous: OCR corpus expansion and edge-case stabilization.
2. `P1` Continuous: confidence calibration against scanned/noisy documents.

## Roadmap Completion Audit (2026-02-17)

| Phase                                | Status | Evidence                                                                                                                                                                                                   | Gap                                                                 |
| ------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Phase 1 — Hardening & Reliability    | Done   | `proxy.ts`, `scripts/quality/verify-local-first.ts`, `shared/errors/tool.ts`, `shared/errors/ToolErrorBoundary.tsx`, `shared/guardrails/heavy-file.ts`, `lib/tools-registry-data/*`, `pnpm ci:quick` pass  | Keep the modular registry contract stable under tests               |
| Phase 2 — SEO Systemization          | Done   | `app/guides/page.tsx`, `app/guides/[slug]/page.tsx`, `lib/guide-pages.ts`, `lib/seo-tools.ts`, `tests/unit/guide-pages-contract.test.ts`, `tests/unit/seo-jsonld-contract.test.ts`                         | Maintain editorial quality of guide cluster                         |
| Phase 3 — Core Tools Quality Upgrade | Done   | `features/pdf-tools/compress/compress-pdf.tsx`, `shared/pdf/compression-insights.ts`, `scripts/quality/run-core-bench-gate.ts`, `components/features/finance/FinanceTrustBlock.tsx`, `shared/utils/csv.ts` | Continue expanding export/test coverage for future finance features |
| Phase 4 — Monetization Enablement    | Done   | `/pro` runtime check in `app/pro/page.tsx`, `lib/offline-license.ts`, `tests/unit/offline-license.test.ts`                                                                                                 | Key rotation and ops playbook refinement                            |
| Phase 5 — Specialized Pro Expansion  | Done   | `features/pdf-tools/extract/extract-text.tsx`, `features/ocr/*`, `scripts/quality/run-ocr-pro-bench-gate.ts`, `docs/qa/OCR_PRO_QA_MATRIX.md`, `docs/release/OCR_PRO_ROLLOUT_RUNBOOK.md`                    | Keep iterative quality and corpus improvements                      |

### Verdict

Roadmap is **complete on current scope**.
