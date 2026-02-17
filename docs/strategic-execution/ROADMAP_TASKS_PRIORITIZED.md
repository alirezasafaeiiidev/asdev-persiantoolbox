# Prioritized Roadmap Tasks - asdev-persiantoolbox

- Generated: 2026-02-17
- Source: `docs/PRODUCT_ROADMAP.md`, `docs/TECHNICAL_SPEC.md`
- Execution mode: Auto (local-first safe)
- Priority model: `P0` (Phase 1 hardening gates) -> `P1` (reliability UX) -> `P2` (growth/SEO/systemization)

| Priority | Phase   | Task                                                     | Status      | Evidence                                                                                                                                                                                       | Next Action                                                |
| -------- | ------- | -------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| P0       | Phase 1 | CSP + Security Headers enforce in runtime                | Done        | `proxy.ts`, `tests/unit/proxy-csp.test.ts`                                                                                                                                                     | Keep policy strict; add regression tests on policy changes |
| P0       | Phase 1 | Local-First gate (no off-origin runtime dependency)      | Done        | `scripts/quality/verify-local-first.ts`, `pnpm gate:local-first` (OK on 2026-02-17)                                                                                                            | Keep gate mandatory in CI                                  |
| P0       | Phase 1 | Quality gates lock (`lint + typecheck + test`)           | Done        | `pnpm ci:quick` passed on 2026-02-17                                                                                                                                                           | Keep as required check before merge                        |
| P1       | Phase 1 | Unified Error System (`useToolError`, ErrorBoundary map) | Done        | `shared/errors/tool.ts`, `shared/errors/ToolErrorBoundary.tsx`, `tests/unit/tool-error-utils.test.ts`, `tests/unit/tool-error-boundary.test.tsx`                                               | Wire boundary/hook into tool shells progressively          |
| P1       | Phase 1 | Heavy file guardrails (size/type/Lite mode guidance)     | Done        | `shared/guardrails/heavy-file.ts`, `tests/unit/heavy-file-guardrails.test.ts`, integration in `features/pdf-tools/compress/compress-pdf.tsx` and `features/image-tools/image-tools.tsx`        | Roll out same contract to remaining heavy routes           |
| P1       | Phase 1 | Registry modularization (per-category + aggregator)      | In Progress | `lib/tools-registry.policy.ts`, `lib/tools-registry.ts`                                                                                                                                        | Continue split of registry data/content into module files  |
| P2       | Phase 2 | SEO systemization (schema/template/internal linking)     | Done        | `app/guides/page.tsx`, `app/guides/[slug]/page.tsx`, `lib/guide-pages.ts`, `lib/seo-tools.ts`, `tests/unit/guide-pages-contract.test.ts`, `tests/unit/seo-category-contract.test.ts`           | Keep guide quality bar/editorial review                    |
| P2       | Phase 3 | Core tool quality upgrade (PDF/Finance benchmarks)       | In Progress | `features/pdf-tools/compress/compress-pdf.tsx` (batch queue + profiles + explainability), `shared/pdf/compression-insights.ts`, `scripts/quality/run-core-bench-gate.ts`, `pnpm ci:quick` pass | Close Finance trust/data-versioning outputs                |
| P2       | Phase 4 | Offline-compatible monetization enablement               | Done        | `lib/offline-license.ts`, `app/pro/page.tsx`, `tests/unit/offline-license.test.ts`                                                                                                             | Add operational key rotation runbook                       |

## Auto Execution Log (2026-02-17)

1. `pnpm ci:quick` -> Passed
2. `pnpm vitest --run tests/unit/proxy-csp.test.ts tests/unit/local-first-gate.test.ts tests/unit/tool-tier-contract.test.ts tests/unit/tools-registry-indexing.test.ts` -> Passed
3. `pnpm vitest --run tests/unit/tool-error-utils.test.ts tests/unit/tool-error-boundary.test.tsx` -> Passed
4. `pnpm vitest --run tests/unit/heavy-file-guardrails.test.ts tests/unit/offline-license.test.ts tests/unit/tool-tier-contract.test.ts` -> Passed
5. `pnpm vitest --run tests/unit/guide-pages-contract.test.ts tests/unit/seo-category-contract.test.ts tests/unit/seo-jsonld-contract.test.ts tests/seo-tools.test.ts tests/unit/pdf-compression-insights.test.ts` -> Passed
6. `pnpm bench:gate` -> Passed (report persisted under `docs/performance/reports/`)
7. `pnpm ci:quick` -> Passed

## Ordered Next Task Queue

1. `P1` Refactor `lib/tools-registry.ts` into modular category files with aggregator compatibility.
2. `P2` Phase 3 Finance trust upgrades: data-version display and professional export flow hardening.
3. `P2` Phase 5 Specialized Pro expansion (OCR/pro toolset MVP rollout).

## Roadmap Completion Audit (2026-02-17)

| Phase                                | Status      | Evidence                                                                                                                                                                           | Gap                                                                      |
| ------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Phase 1 — Hardening & Reliability    | In Progress | `proxy.ts`, `scripts/quality/verify-local-first.ts`, `shared/errors/tool.ts`, `shared/errors/ToolErrorBoundary.tsx`, `shared/guardrails/heavy-file.ts`, `pnpm ci:quick` pass       | Registry data/content modularization still open                          |
| Phase 2 — SEO Systemization          | Done        | `app/guides/page.tsx`, `app/guides/[slug]/page.tsx`, `lib/guide-pages.ts`, `lib/seo-tools.ts`, `tests/unit/guide-pages-contract.test.ts`, `tests/unit/seo-jsonld-contract.test.ts` | Maintain editorial quality of guide cluster                              |
| Phase 3 — Core Tools Quality Upgrade | In Progress | `features/pdf-tools/compress/compress-pdf.tsx`, `shared/pdf/compression-insights.ts`, `scripts/quality/run-core-bench-gate.ts`, `docs/performance/reports/`                        | Finance/HR trust/versioned-data and pro-grade outputs not fully complete |
| Phase 4 — Monetization Enablement    | Done        | `/pro` runtime check in `app/pro/page.tsx`, `lib/offline-license.ts`, `tests/unit/offline-license.test.ts`                                                                         | Key rotation and ops playbook refinement                                 |
| Phase 5 — Specialized Pro Expansion  | Todo        | Base platform and Pro entry route exist                                                                                                                                            | OCR فارسی / specialized pro tools roadmap items are not implemented      |

### Verdict

Roadmap is **not fully complete**.
