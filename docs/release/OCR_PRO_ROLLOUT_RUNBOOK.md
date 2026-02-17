# OCR/Pro Rollout Runbook

## Phase Gates

### Gate A - Build Integrity

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm test:ci`
4. `pnpm build`

Exit condition: همه مراحل پاس شوند.

### Gate B - OCR/Pro Quality

1. `pnpm bench:ocr-pro`
2. بررسی گزارش جدید در `docs/performance/reports/`
3. بازبینی `docs/qa/OCR_PRO_QA_MATRIX.md`

Exit condition: benchmark پاس و گزارش تولید شود.

### Gate C - Release Readiness

1. `pnpm deploy:readiness:validate`
2. `pnpm release:state:validate`

Exit condition: وضعیت Release روی `ready` باقی بماند.

## Rollback

- اگر Gate B یا Gate C شکست خورد:

1. release فعلی را freeze کنید.
2. rollback به آخرین commit پایدار انجام شود.
3. دوباره `pnpm build` و smoke چک اجرا شود.

## Offline License Continuity

- OCR مسیر local-first است و برای runtime dependency به سرویس خارجی متکی نیست.
- مسیرهای Pro نیازمند حفظ مکانیزم `offline-license` هستند:

1. اعتبارسنجی کلید عمومی (`OFFLINE_LICENSE_PUBLIC_KEY`) قبل از انتشار.
2. عدم تغییر قرارداد token verification بدون تست رگرسیون.

## Evidence Pack

- Build logs
- Test summary
- OCR benchmark report path
- Rollback readiness note
