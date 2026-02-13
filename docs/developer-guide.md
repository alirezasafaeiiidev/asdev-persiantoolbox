# راهنمای توسعه‌دهنده (Developer Guide)

> آخرین به‌روزرسانی: 2026-02-12

## ساختار پیشنهادی برای ابزار جدید

1. مسیر صفحه: `app/<category>/<tool>/page.tsx`
2. منطق ویژگی: `features/<category>/<tool>/`
3. ابزار مشترک: `shared/`
4. UI مشترک: `components/` یا `shared/ui/`

## چک‌لیست طراحی و UI

- از توکن‌های `shared/constants/tokens.ts` استفاده کنید.
- کلاس‌های منطقی RTL (`start/end`, `ms/me`) را رعایت کنید.
- حالت‌های `loading/empty/error` را مشخص کنید.
- انیمیشن‌ها باید `prefers-reduced-motion` را رعایت کنند.

## چک‌لیست دسترس‌پذیری

- برای ورودی‌ها label معتبر و `aria-*` لازم را اضافه کنید.
- ناوبری کامل با کیبورد در مسیر اصلی ابزار ممکن باشد.

## چک‌لیست حریم خصوصی و امنیت

- پردازش داده local-first بماند.
- از اسکریپت runtime خارجی استفاده نکنید.

## چک‌لیست PWA و آفلاین

- مسیرهای اصلی ابزار در حالت آفلاین باید fallback داشته باشند.
- برای تغییرات SW، `CACHE_VERSION` را افزایش دهید.

## الگوی تست

```bash
pnpm run lint
pnpm run typecheck
pnpm vitest --run
pnpm run build
```

## منابع مرجع

- `docs/project-standards.md`
- `docs/operations.md`
- `CONTRIBUTING.md`
