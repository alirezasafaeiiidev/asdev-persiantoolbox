import Link from 'next/link';
import { cookies } from 'next/headers';
import { buildMetadata } from '@/lib/seo';
import { verifyOfflineLicenseToken } from '@/lib/offline-license';

export const metadata = buildMetadata({
  title: 'PersianToolbox Pro - دسترسی سازمانی',
  description:
    'نسخه Pro برای سرویس‌های آنلاین و دسترسی سازمانی. این بخش نیازمند اتصال اینترنت است.',
  path: '/pro',
});

export default async function ProPage() {
  const cookieStore = await cookies();
  const licenseToken = cookieStore.get('ptb_pro_license')?.value;
  const publicKey = process.env['OFFLINE_LICENSE_PUBLIC_KEY'];
  const verification =
    licenseToken && publicKey
      ? verifyOfflineLicenseToken(licenseToken, publicKey)
      : { valid: false as const };

  return (
    <div className="max-w-3xl mx-auto section-surface p-8 text-center space-y-4">
      <h1 className="text-3xl font-black text-[var(--text-primary)]">PersianToolbox Pro</h1>
      <p className="text-[var(--text-secondary)] leading-7">
        این مسیر برای قابلیت‌های Pro و دسترسی سازمانی آماده‌سازی شده است.
      </p>
      <p className="text-sm text-[var(--color-warning)]">
        برای استفاده از امکانات Pro اتصال اینترنت الزامی است.
      </p>
      <p
        className={`text-sm ${verification.valid ? 'text-[var(--color-success)]' : 'text-[var(--text-muted)]'}`}
      >
        {verification.valid ? 'مجوز آفلاین معتبر شناسایی شد.' : 'مجوز آفلاین معتبر شناسایی نشد.'}
      </p>
      <div className="pt-2">
        <Link href="/support" className="btn btn-primary px-5 py-2 text-sm">
          درخواست دسترسی سازمانی
        </Link>
      </div>
    </div>
  );
}
