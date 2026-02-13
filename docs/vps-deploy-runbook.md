# Runbook استقرار روی VPS (Ubuntu 22.04 + PM2 + Nginx)

> آخرین به‌روزرسانی: 2026-02-12

## 1) پیش‌نیازهای سرور

```bash
sudo apt update
sudo apt install -y nginx curl git rsync ufw fail2ban

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# pnpm + pm2
sudo corepack enable
corepack prepare pnpm@9.15.0 --activate
sudo npm install -g pm2
```

## 2) ساخت کاربر deploy و مسیرها

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /var/www/persian-tools/{releases,current,shared/env,shared/logs,tmp}
sudo chown -R deploy:deploy /var/www/persian-tools
```

## 3) تنظیم Nginx

```bash
sudo cp ops/nginx/persian-tools.conf /etc/nginx/sites-available/persian-tools.conf
sudo ln -s /etc/nginx/sites-available/persian-tools.conf /etc/nginx/sites-enabled/persian-tools.conf
sudo nginx -t
sudo systemctl reload nginx
```

پس از DNS صحیح:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d persian-tools.ir -d www.persian-tools.ir
```

## 4) فایل‌های env

- از `env.staging.example` و `env.production.example` استفاده کنید.
- نسخه واقعی را base64 کنید و در GitHub Secrets بگذارید.

```bash
pnpm deploy:env:encode -- .env.staging.real
pnpm deploy:env:encode -- .env.production.real
```

## 5) گردش استقرار

1. `deploy-staging.yml` روی push به `main` اجرا می‌شود.
2. بعد از تایید staging، `deploy-production.yml` به صورت دستی اجرا می‌شود.
3. قبل از deploy این گیت‌ها اجرا شوند:
   - `pnpm ci:quick`
   - `pnpm ci:contracts`
   - `pnpm deploy:readiness:run`
4. بعد از deploy، گزارش post-deploy تولید می‌شود:
   - `pnpm deploy:post:report`

## 6) rollback

```bash
sudo -u deploy bash /var/www/persian-tools/current/production/ops/deploy/rollback.sh \
  --env production \
  --base-dir /var/www/persian-tools
```

## 7) کنترل میزبانی چندسایته (اجباری قبل از deploy)

جزئیات رجیستری پورت و سیاست storage/cache در `docs/HOSTING_MULTI_SITE_FA.md` نگه‌داری می‌شود.

```bash
sudo /var/www/persian-tools/current/production/scripts/deploy/check-hosting-sync.sh --strict
```
