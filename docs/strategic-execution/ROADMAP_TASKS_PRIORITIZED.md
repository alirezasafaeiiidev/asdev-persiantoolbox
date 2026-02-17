# Prioritized Roadmap Tasks - asdev-persiantoolbox

- Generated: 2026-02-17
- Source: `docs/PRODUCT_ROADMAP.md`, `docs/TECHNICAL_SPEC.md`
- Execution mode: Auto (local-first safe)
- Priority model: `P0` (Phase 1 hardening gates) -> `P1` (reliability UX) -> `P2` (growth/SEO/systemization)

| Priority | Phase   | Task                                                     | Status | Evidence                                                                                                                                                                                                                                         | Next Action                                                |
| -------- | ------- | -------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| P0       | Phase 1 | CSP + Security Headers enforce in runtime                | Done   | `proxy.ts`, `tests/unit/proxy-csp.test.ts`                                                                                                                                                                                                       | Keep policy strict; add regression tests on policy changes |
| P0       | Phase 1 | Local-First gate (no off-origin runtime dependency)      | Done   | `scripts/quality/verify-local-first.ts`, `pnpm gate:local-first` (OK on 2026-02-17)                                                                                                                                                              | Keep gate mandatory in CI                                  |
| P0       | Phase 1 | Quality gates lock (`lint + typecheck + test`)           | Done   | `pnpm ci:quick` passed on 2026-02-17                                                                                                                                                                                                             | Keep as required check before merge                        |
| P1       | Phase 1 | Unified Error System (`useToolError`, ErrorBoundary map) | Done   | `shared/errors/tool.ts`, `shared/errors/ToolErrorBoundary.tsx`, `tests/unit/tool-error-utils.test.ts`, `tests/unit/tool-error-boundary.test.tsx`                                                                                                 | Wire boundary/hook into tool shells progressively          |
| P1       | Phase 1 | Heavy file guardrails (size/type/Lite mode guidance)     | Done   | `shared/guardrails/heavy-file.ts`, `tests/unit/heavy-file-guardrails.test.ts`, integration in `features/pdf-tools/compress/compress-pdf.tsx` and `features/image-tools/image-tools.tsx`                                                          | Roll out same contract to remaining heavy routes           |
| P1       | Phase 1 | Registry modularization (per-category + aggregator)      | Done   | `lib/tools-registry.ts`, `lib/tools-registry-data/types.ts`, `lib/tools-registry-data/categories.ts`, `lib/tools-registry-data/category-content.ts`, `lib/tools-registry-data/raw-tools-registry.ts`                                             | Keep contract tests for registry/tier coverage             |
| P2       | Phase 2 | SEO systemization (schema/template/internal linking)     | Done   | `app/guides/page.tsx`, `app/guides/[slug]/page.tsx`, `lib/guide-pages.ts`, `lib/seo-tools.ts`, `tests/unit/guide-pages-contract.test.ts`, `tests/unit/seo-category-contract.test.ts`                                                             | Keep guide quality bar/editorial review                    |
| P2       | Phase 3 | Core tool quality upgrade (PDF/Finance benchmarks)       | Done   | `components/features/finance/FinanceTrustBlock.tsx`, `lib/finance-data-version.ts`, `shared/utils/csv.ts`, `components/features/loan/LoanPage.tsx`, `components/features/salary/SalaryPage.tsx`, `components/features/interest/InterestPage.tsx` | Keep test coverage for trust/export contracts              |
| P2       | Phase 4 | Offline-compatible monetization enablement               | Done   | `lib/offline-license.ts`, `app/pro/page.tsx`, `tests/unit/offline-license.test.ts`                                                                                                                                                               | Add operational key rotation runbook                       |

## Auto Execution Log (2026-02-17)

1. `pnpm ci:quick` -> Passed
2. `pnpm vitest --run tests/unit/proxy-csp.test.ts tests/unit/local-first-gate.test.ts tests/unit/tool-tier-contract.test.ts tests/unit/tools-registry-indexing.test.ts` -> Passed
3. `pnpm vitest --run tests/unit/tool-error-utils.test.ts tests/unit/tool-error-boundary.test.tsx` -> Passed
4. `pnpm vitest --run tests/unit/heavy-file-guardrails.test.ts tests/unit/offline-license.test.ts tests/unit/tool-tier-contract.test.ts` -> Passed
5. `pnpm vitest --run tests/unit/guide-pages-contract.test.ts tests/unit/seo-category-contract.test.ts tests/unit/seo-jsonld-contract.test.ts tests/seo-tools.test.ts tests/unit/pdf-compression-insights.test.ts` -> Passed
6. `pnpm bench:gate` -> Passed (report persisted under `docs/performance/reports/`)
7. `pnpm ci:quick` -> Passed

## Ordered Next Task Queue

1. `P1` Phase 5 / Task 1: OCR intake contract and offline queue manager (`feature toggle` + `quality gate`).
2. `P1` Phase 5 / Task 2: Persian OCR post-processing pipeline (normalization + confidence buckets + fallback UX).
3. `P1` Phase 5 / Task 3: Pro specialized outputs (DOCX/structured JSON export) with local-first execution path.
4. `P2` Phase 5 / Task 4: QA matrix and benchmark suite for OCR/pro tools.
5. `P2` Phase 5 / Task 5: Pro docs and ops runbook (offline license continuity + rollback checks).

## Roadmap Completion Audit (2026-02-17)

| Phase                                | Status   | Evidence                                                                                                                                                                                                   | Gap                                                                 |
| ------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Phase 1 — Hardening & Reliability    | Done     | `proxy.ts`, `scripts/quality/verify-local-first.ts`, `shared/errors/tool.ts`, `shared/errors/ToolErrorBoundary.tsx`, `shared/guardrails/heavy-file.ts`, `lib/tools-registry-data/*`, `pnpm ci:quick` pass  | Keep the modular registry contract stable under tests               |
| Phase 2 — SEO Systemization          | Done     | `app/guides/page.tsx`, `app/guides/[slug]/page.tsx`, `lib/guide-pages.ts`, `lib/seo-tools.ts`, `tests/unit/guide-pages-contract.test.ts`, `tests/unit/seo-jsonld-contract.test.ts`                         | Maintain editorial quality of guide cluster                         |
| Phase 3 — Core Tools Quality Upgrade | Done     | `features/pdf-tools/compress/compress-pdf.tsx`, `shared/pdf/compression-insights.ts`, `scripts/quality/run-core-bench-gate.ts`, `components/features/finance/FinanceTrustBlock.tsx`, `shared/utils/csv.ts` | Continue expanding export/test coverage for future finance features |
| Phase 4 — Monetization Enablement    | Done     | `/pro` runtime check in `app/pro/page.tsx`, `lib/offline-license.ts`, `tests/unit/offline-license.test.ts`                                                                                                 | Key rotation and ops playbook refinement                            |
| Phase 5 — Specialized Pro Expansion  | Taskized | Base platform and Pro entry route exist                                                                                                                                                                    | Execution backlog is broken into prioritized implementation tasks   |

### Verdict

Roadmap is **not fully complete**.
