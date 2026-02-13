# Changelog

> Last updated: 2026-02-12

## [Unreleased]

### Changed

- Removed account, admin, subscription, history, and monetization surfaces.
- Deleted obsolete docs, snapshots, and historical reports.
- Removed Postgres and related server modules, tests, and scripts.
- Dropped Storybook, Typedoc, and MCP Postgres dependencies.
- Simplified ops/deploy documentation and readiness gates.
- Cleaned ad/consent and monetization artifacts from codebase.
- Added minimal brand attribution standard:
  - `lib/brand.ts`
  - `components/brand/BrandFooter.tsx`
  - `components/brand/BrandLink.tsx`
- Updated navigation and footer to include canonical engineering request/hub links.
- Updated README with `Brand Attribution` section.

### Added

- New address conversion tool (Persian address → English).

## [2.0.0] - 2026-02-12

### Added

- V2 UI simplification and new text tool.
