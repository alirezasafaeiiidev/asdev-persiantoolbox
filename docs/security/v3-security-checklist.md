# V3 Security Checklist

این چک‌لیست برای تمام PRهای V3 که روی runtime، ابزارهای مالی، SEO یا deployment اثر می‌گذارند الزامی است.

## 1) Local-First Runtime

- [ ] هیچ `fetch` یا `sendBeacon` خارج از same-origin اضافه نشده است.
- [ ] هیچ `WebSocket`/`EventSource` خارج از دامنه‌های مجاز اضافه نشده است.
- [ ] هیچ `script src` یا `import` با URL خارجی در runtime اضافه نشده است.
- [ ] `pnpm gate:local-first` بدون خطا اجرا می‌شود.

## 2) CSP and Security Headers

- [ ] هدر `Content-Security-Policy` فعال است.
- [ ] `connect-src 'self'` حفظ شده است.
- [ ] `unsafe-eval` فقط در non-production باقی مانده است.
- [ ] `Strict-Transport-Security`, `X-Frame-Options`, `Referrer-Policy` برقرار هستند.

## 3) Data and Privacy

- [ ] داده‌های مالی فقط local (مرورگر) پردازش/ذخیره می‌شوند.
- [ ] هیچ dependency runtime جدید از CDN/API خارجی اضافه نشده است.
- [ ] اگر تغییر حقوقی/Privacy policy لازم است، merge فقط بعد از تایید انسانی انجام می‌شود.

## 4) Required Verification

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] CI سبز: `ci-core`, `lighthouse-ci`, `deploy-staging`
