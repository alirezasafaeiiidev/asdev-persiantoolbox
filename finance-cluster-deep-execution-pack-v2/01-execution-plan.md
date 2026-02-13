# 01 – V2 Execution Plan (Phases 0–3)

## Principle

- **Priority-driven**: move to next phase only after acceptance criteria are met.
- **Fast iteration**: small PRs, each independently deployable.
- **Local-first**: no runtime external dependencies.

---

## Phase 0 — Foundation (Must-fix before scaling SEO)

### Goals

- Brand/domain canonical is consistent everywhere
- Local-first constraints are enforceable (no accidental regressions)
- Repo hygiene aligned with your platform standards

### Tasks

1. **Brand Canon**
   - Create a single source of truth (e.g., `BRAND` object) for:
     - `siteName` (جعبه ابزار فارسی)
     - `baseUrl` (https://persiantoolbox.ir)
     - `tagline` (ابزارهای آنلاین فارسی، سریع و امن)
   - Ensure the canonical URL generation uses this value.
   - Ensure sitemap and OpenGraph links use the same base URL.

2. **Local-first enforcement**
   - Add a CI/checklist gate that fails if:
     - Any external `http(s)://` is introduced (except documentation text links if you allow them)
     - Any third-party `<script src=...>` is introduced
     - Any runtime `fetch` goes off-origin
   - Confirm fonts are self-hosted (no Google Fonts).

3. **SEO pipeline consistency**
   - Confirm the tool registry is the only source for:
     - tool routes
     - titles/descriptions
     - OG image generation
   - Confirm build fails fast if a tool page is missing required SEO meta.

### Acceptance Criteria

- Canonical domain fully consistent
- “No external runtime dependency” gate exists (CI or at minimum an enforced pre-merge checklist)
- Build & tests pass

---

## Phase 1 — SEO Engine (Finance-first)

### Goals

- Finance Cluster becomes the top-quality SEO entry point
- Every tool page becomes a “landing page” (tool + education + FAQ + schema)

### Tasks

1. **Finance Hub page**
   - A category hub that lists finance tools, explains usage, links internally, includes FAQ + schema.
2. **Tool pages (Loan / Salary / Interest)**
   - Each tool page has:
     - H1 + intro
     - Tool UI (client-side)
     - Result block
     - Educational content (minimum 800–1500 words/tool)
     - FAQ (min 5)
     - Schema (SoftwareApplication/WebApplication + FAQPage + Breadcrumb)
     - Links to related finance tools + hub
3. **Internal linking**
   - Enforce a linking matrix across finance pages

### Acceptance Criteria

- Finance Hub published
- 2–3 finance tools published with full SEO sections
- Structured data validates
- Lighthouse pages >= 95 for core pages

---

## Phase 2 — Conversion (Traffic → Users)

### Goals

- Improve engagement without violating local-first constraints
- Increase pages/session and returning visits

### Tasks

1. Related tools component (cross-tool navigation)
2. Save calculation locally (localStorage) + simple dashboard
3. Micro-UX: copy result, share link, sticky summary (non-intrusive)

### Acceptance Criteria

- Related tools block appears on finance pages
- Saved calculations work locally
- No new external dependency introduced

---

## Phase 3 — Authority & Brand

### Goals

- Transform from “tool site” to “trusted reference”
- Increase brand searches and trust signals

### Tasks

1. `/about`, `/how-it-works`, `/privacy` pages
2. Transparency blocks on finance pages:
   - “All calculations happen locally in your browser”
3. Consistent brand voice + design tokens adoption (where applicable)

### Acceptance Criteria

- Authority pages live
- Consistent brand and privacy messaging across finance cluster

---

## V3 Note

Phase 4+ (Monetization) is intentionally postponed to V3.
