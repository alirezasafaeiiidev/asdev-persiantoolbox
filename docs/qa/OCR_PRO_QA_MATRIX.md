# OCR/Pro QA Matrix

## Scope

- مسیر: `/pdf-tools/extract/extract-text`
- قابلیت‌ها: OCR/Extract local-first، confidence tier، خروجی TXT/JSON/DOCX
- وابستگی شبکه: ندارد (offline-first)

## Functional Gates

- `G1` فایل PDF معتبر انتخاب شود و پردازش بدون کرش اجرا شود.
- `G2` برای هر صفحه خروجی متنی + confidence tier نمایش داده شود.
- `G3` هشدار صفحات کم‌متن یا کم‌اعتماد نمایش داده شود.
- `G4` خروجی‌های `TXT`، `JSON` و `DOCX` قابل دانلود باشند.
- `G5` در نبود متن قابل استخراج، صفحه با پیام fallback کامل شود.

## Resilience Gates

- `R1` ورودی غیر PDF رد شود.
- `R2` فایل خالی/خراب پیام خطای واضح بدهد.
- `R3` در refresh صفحه وضعیت شکسته ایجاد نشود.
- `R4` در حالت offline ابزار بدون API خارجی کار کند.

## Pro/Operations Gates

- `P1` Benchmark gate (`pnpm bench:ocr-pro`) پاس شود.
- `P2` گزارش benchmark در `docs/performance/reports/` ثبت شود.
- `P3` مسیر rollback مستند و قابل اجرا باشد.
