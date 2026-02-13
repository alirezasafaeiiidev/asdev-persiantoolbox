# 04 – Salary Calculator Spec (V2)

## User Goal

Compute salary take-home (toman):

- net salary
- tax
- insurance
- simple breakdown

## Inputs

- gross salary (toman)
- insurance (rate or amount; choose one UI approach for V2)
- tax mode:
  - auto (based on local config for selected year)
  - manual override (optional)

## Logic

- All laws/brackets stored locally as config.
- Deterministic, versioned calculation.

## Outputs

- net salary (toman)
- tax (toman)
- insurance (toman)
- breakdown table

## SEO Requirements

- Title: «محاسبه حقوق ۱۴۰۴ | محاسبه خالص دریافتی با بیمه و مالیات»
- Content: min 1000 words
- FAQ: min 5
- Schema: SoftwareApplication/WebApplication + FAQPage + Breadcrumb

## Educational Content Template

See `templates/seo/salary-content.md`

## FAQ Dataset

See `templates/faq/salary-faq.json`

## Internal Links

Must link to:

- Loan calculator
- Bank interest calculator
- Finance hub
