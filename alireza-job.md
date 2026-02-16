# Alireza Job Checklist (P0/P1)

این فایل کارهایی است که نیاز به اقدام شما (Owner) دارد یا نیازمند دسترسی/تصمیم شماست. من فعلا هیچ deploy به production انجام نمی‌دهم.

## P0 - Security (Immediate)

- [ ] پسورد `root` را فورا تغییر دهید (اطلاعات ورود در چت مطرح شده و از نظر امنیتی سوخته محسوب می‌شود).
- [ ] ورود با SSH Key را فعال کنید و ورود با پسورد را ببندید:
  - [ ] کلید عمومی را به `~/.ssh/authorized_keys` اضافه کنید.
  - [ ] در `/etc/ssh/sshd_config` تنظیم کنید:
    - `PasswordAuthentication no`
    - `PermitRootLogin prohibit-password` (یا بهتر: `no` و استفاده از یوزر deploy + sudo)
  - [ ] `systemctl reload sshd`
- [ ] یک یوزر عملیاتی بسازید (پیشنهادی: `deploy`) و دسترسی sudo محدود بدهید:
  - [ ] `adduser deploy`
  - [ ] `usermod -aG sudo deploy`
  - [ ] کلید SSH deploy را ست کنید.

## P0 - DNS + HTTPS (No Browser Warnings)

- [ ] اطمینان از اینکه کاربران فقط با دامنه وارد می‌شوند نه IP/hostname:
  - اگر با `IP` یا `vm29334-...` باز کنید، چون certificate برای `persiantoolbox.ir` است، مرورگر خطای امنیتی می‌دهد.
- [ ] رکوردهای DNS:
  - [ ] `persiantoolbox.ir` -> A به IP سرور
  - [ ] `www.persiantoolbox.ir` -> A به IP سرور
  - [ ] `staging.persiantoolbox.ir` -> A به IP سرور (اگر staging روی همین VPS است)
- [ ] صدور/تمدید TLS با Let's Encrypt (certbot) برای دامنه‌ها.
- [ ] اگر HSTS فعال است (هست): قبل از هر تغییر زیرساخت، مطمئن شوید 443 درست و پایدار است؛ چون مرورگرها HTTPS را اجباری می‌کنند.

## P0 - Analytics (بدون Google Analytics)

Google Analytics برای کاربران داخل ایران/با محدودیت‌ها قابل اتکا نیست و همچنین از نظر حریم خصوصی هم مطلوب نیست.

- [ ] تصمیم: Analytics روشن باشد یا فعلا خاموش؟
  - اگر روشن: من برایتان `NEXT_PUBLIC_ANALYTICS_ID` و `ANALYTICS_INGEST_SECRET` تولید می‌کنم.
- [ ] اگر روشن شد: secret نباید سمت مرورگر لو برود.
  - [ ] `ANALYTICS_INGEST_SECRET` را فقط در env سرور نگه دارید.
  - [ ] nginx باید روی مسیر `/api/analytics` هدر `x-pt-analytics-secret` را به upstream inject کند.

## P1 - Google Search Console Verification (SEO)

- [ ] وارد Google Search Console شوید و property دامنه را اضافه کنید.
- [ ] روش HTML tag را انتخاب کنید و مقدار `content` را بردارید.
- [ ] مقدار را به من بدهید تا در env ها ست کنیم:
  - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...`

## P1 - VPN/Filter Issue (Needs Evidence)

برای اینکه مشکل "وقتی VPN روشن است سایت باز نمی‌شود" را حل کنیم، به داده واقعی نیاز داریم.

- [ ] از روی یک دستگاه که VPN روشن است خروجی این‌ها را بفرستید:
  - [ ] `nslookup persiantoolbox.ir`
  - [ ] `curl -I https://persiantoolbox.ir --max-time 15`
  - [ ] نام VPN/Provider و کشور خروجی (Exit location)
- [ ] اگر مشکل فقط روی یک ISP یا یک VPN خاص است، معمولاً علت یکی از این‌هاست:
  - IP دیتاسنتر توسط VPN/ISP بلاک شده
  - مشکل IPv6/IPv4 fallback (اگر VPN IPv6 بدهد و DNS AAAA نداریم)
  - TLS inspection / MITM توسط VPN

## P1 - Future Paid Tools (Readiness Only)

- [ ] برای نسخه بعدی: انتخاب gateway پرداخت (ایرانی/بین‌المللی) و مدل اشتراک.
- [ ] وقتی آماده بودید، نیاز داریم:
  - [ ] `DATABASE_URL` واقعی staging/production
  - [ ] `SUBSCRIPTION_WEBHOOK_SECRET`
