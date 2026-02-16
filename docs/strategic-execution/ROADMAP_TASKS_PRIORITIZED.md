# Prioritized Roadmap Tasks - asdev-persiantoolbox

- Generated: 2026-02-15
- Source: docs/strategic-execution/REMAINING_EXECUTION_TASKS.md + docs/release/v3-readiness-dashboard.md
- Rule: P0 (release-blocking), P1 (release-cut), P2 (post-deploy deferred)

| Priority | Stage   | Task                                    | Owner                    | DoD                                              | Evidence                                                                       | Acceptance                                     |
| -------- | ------- | --------------------------------------- | ------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------- |
| P0       | Release | Finalize remote release tag state       | release-management       | final tag exists on remote and state marked done | docs/release/v3-readiness-dashboard.md, docs/release/release-state-registry.md | `final_release_tag_remote=done`                |
| P1       | Release | Complete v2 licensing release checklist | release-management/legal | all checklist items checked at release cut       | docs/licensing/v2-license-release-checklist.md                                 | release notes include licensing artifact       |
| P2       | Deploy  | Run production confirmation pack        | DevOps                   | post-deploy checks executed on real base URL     | docs/strategic-execution/REMAINING_EXECUTION_TASKS.md                          | report published under docs/deployment/reports |

## Top 5 Now

1. Publish final remote release tag and sync dashboard/registry state.
2. Execute v2 licensing release checklist during release cut.
3. Attach licensing note/evidence to release artifact.
4. Run production confirmation report after first real deploy window.
5. Archive go/no-go signoff with links to RC/launch/readiness reports.

## UI/UX + SEO Top 5 (2026-02-15)

1. Improve `performance` score on `salary`, `topics`, and `pdf-tools/merge/merge-pdf`.
2. Profile and reduce LCP variance on key tool routes.
3. Keep SEO/A11y thresholds unchanged; treat any future drop as release blocker.
4. Optimize above-the-fold render path for tool landing pages with highest traffic.
5. Re-run `pnpm lighthouse:ci` and publish deltas after each optimization batch.
