# 03 – Loan Calculator Spec (V2)

## User Goal

Compute loan metrics in **toman**:

- Monthly installment
- Total payment
- Total interest
- Optional: effective annual rate for derived-rate mode

## Input (UI)

- Calculation type:
  - installment (compute monthly payment)
  - rate (derive rate from monthly payment)
  - principal (derive principal from monthly payment)
  - months (derive months from monthly payment)
- Loan type:
  - regular
  - qarzolhasaneh (rate clamped to <= 4%)
  - stepped (optional, can be shipped in V2 if already present)
- Fields:
  - principal (toman)
  - annualRate (%)
  - months
  - monthlyPayment (toman) (for derived modes)
  - stepped options (if enabled)

## Output

- monthlyPayment (toman)
- totalPayment (toman)
- totalInterest (toman)
- Optional: step breakdown (if stepped mode)

## Edge Cases

- Zero interest
- Months <= 0
- Negative/NaN inputs
- Very large numbers (performance + formatting)

## SEO Requirements

- Title: «محاسبه اقساط وام | جدول دقیق اقساط + بدون ثبت‌نام»
- Meta description: mention “local processing” + “no signup”
- Content: min 1200 words
- FAQ: min 5
- Schema: SoftwareApplication/WebApplication + FAQPage + Breadcrumb

## Educational Content Template (copy/paste)

See `templates/seo/loan-content.md`

## FAQ Dataset (copy/paste)

See `templates/faq/loan-faq.json`

## Internal Links

Must link to:

- Salary calculator
- Bank interest calculator
- Finance hub
