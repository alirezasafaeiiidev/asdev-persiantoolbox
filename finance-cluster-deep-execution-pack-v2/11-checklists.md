# 11 – Checklists

## Local-first compliance (must pass)

- [ ] No third-party scripts
- [ ] No external network calls (off-origin)
- [ ] Self-host fonts/assets
- [ ] CSP enforces `connect-src 'self'` (or stricter)

## SEO checklist per tool

- [ ] Unique title + description
- [ ] Canonical URL correct
- [ ] H1 matches intent
- [ ] 800–1500 words educational content
- [ ] FAQ (min 5) + JSON-LD
- [ ] Breadcrumb + app schema
- [ ] Internal links to hub + related tools

## Performance checklist

- [ ] Lighthouse >= 95 on the tool page
- [ ] Avoid heavy libraries (charts optional)
- [ ] Memoize expensive calculations
- [ ] Avoid re-rendering big tables on input change

## Deploy readiness

- [ ] CI green
- [ ] Post-deploy smoke test checklist completed
