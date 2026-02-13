# 08 – Definition of Done (Finance V2)

A finance tool page is “Done” when all are true:

- Tool works client-side (no external requests)
- Inputs validated; errors localized (Persian)
- Results shown in **toman**
- SEO:
  - unique title + meta description
  - H1
  - educational content (min 800–1500 words)
  - FAQ (min 5)
  - schema injected and validates
- Internal links: related tools + hub
- Performance: no heavy bundles; avoid expensive re-renders
- Tests:
  - unit tests for core calculations
  - edge cases (zero rate, large values)

Finance Cluster is “Done” when:

- Hub + (at least) Loan + Salary are shipped
- Interest tool shipped if included in V2 scope
- Lighthouse >= 95 on finance pages
- No external runtime dependency confirmed
