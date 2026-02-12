# V3 Performance Budgets

Date: 2026-02-12

این بودجه‌ها از PR-V3-02 به بعد حالت **blocking** دارند.

## Core UX Budgets (Blocking Baseline)

- LCP: کمتر یا مساوی `8500ms`
- CLS: کمتر یا مساوی `0.10`
- Lighthouse Performance score: حداقل `0.74`

## Delivery Budget

- Total byte weight per audited page: کمتر یا مساوی `460KB`
- بودجه JS per tool برای توسعه feature جدید: هدف طراحی `<= 40KB gzip` (در review فنی چک شود).

## CI Enforcement

- Lighthouse assertions در `lighthouserc.json` با severity = `error` تعریف شده‌اند.
- نقض هر budget باعث fail شدن workflow `lighthouse-ci` می‌شود.

## Required Pages in Audit

- `/`
- `/tools`
- `/topics`
- `/loan`
- `/salary`
- `/image-tools`
- `/date-tools`
- `/pdf-tools/merge/merge-pdf`
- `/offline`

## Notes

- برای کامپوننت‌های سنگین، بارگذاری تنبل (lazy/dynamic import) الزامی است.
- هر feature جدید مالی باید تاثیرش روی LCP/INP و byte weight در PR گزارش شود.
- این مقادیر baseline سخت‌گیرانه‌ی فعلی هستند و در PRهای بهینه‌سازی V3 باید مرحله‌ای کاهش داده شوند.
