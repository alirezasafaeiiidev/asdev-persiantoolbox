# 02 – Finance Cluster Architecture

## Scope (V2)

- Loan Calculator
- Salary Calculator
- Bank Interest Calculator
- Finance Hub Page

## Constraints

- Client-only computation
- No external APIs
- No third-party scripts
- Self-hosted assets
- CSP should enforce `connect-src 'self'` (or stricter)

## Recommended structure

Keep using the **existing persian_tools patterns**:

- Tool registry is the source of truth for tool metadata
- Tool pages under current tool routing conventions
- SEO components (ToolSeoContent) used for educational sections

> Avoid introducing parallel routing structures (e.g., new `/app/finance/...`) if your current architecture is `app/(tools)/...`.
