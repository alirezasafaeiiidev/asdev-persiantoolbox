# راهنمای میزبانی چندسایته روی یک VPS

## هدف

هماهنگ‌سازی استقرار `persian_tools` و `my_portfolio` روی یک سرور بدون تداخل و آماده‌سازی برای سایت سوم.

## رجیستری پورت مشترک

- `persian-tools`:
  - production: `3000`
  - staging: `3001`
- `my-portfolio`:
  - production: `3002`
  - staging: `3003`
- رزرو برای سایت سوم:
  - production: `3004`
  - staging: `3005`

## سیاست Storage و Cache

- ساختار هر اپ باید جدا باشد: `/var/www/<app-slug>/...`
- فایل env فقط در `shared/env` نگه‌داری شود.
- لاگ فقط در `shared/logs` نگه‌داری شود.
- cacheهای `.next/cache` فقط داخل هر release باشند تا با rotation خودکار release پاک شوند.

## چک قبل از هر Deploy

روی سرور اجرا کنید:

```bash
sudo /var/www/persian-tools/current/production/scripts/deploy/check-hosting-sync.sh --strict
```

این چک موارد زیر را تایید می‌کند:

- عدم تداخل پورت‌ها
- وضعیت مسیرهای release/env/log
- snapshot از listenerهای پورت‌های `3000` تا `3005`
