import Link from 'next/link';
import { getPublicSiteSettings } from '@/lib/server/siteSettings';

export default async function Footer() {
  const settings = await getPublicSiteSettings();
  const year = new Date().getFullYear();
  const portfolioHref = settings.portfolioUrl ?? '/asdev-portfolio';
  const orderHref = settings.orderUrl ?? settings.portfolioUrl ?? '/services';

  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-light)] bg-[var(--surface-1)]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-center px-4 py-3">
        <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
          <span className="text-xs font-semibold text-[var(--text-muted)]">
            © {year} PersianToolbox
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
            <Link
              href="/services"
              className="rounded-full border border-transparent px-2.5 py-1.5 transition-colors hover:border-[var(--border-light)] hover:text-[var(--text-primary)]"
            >
              درخواست ابزار اختصاصی
            </Link>
            <span aria-hidden="true" className="h-3 w-px bg-[var(--border-light)]" />
            <a
              href={orderHref}
              target={orderHref.startsWith('/') ? undefined : '_blank'}
              rel={orderHref.startsWith('/') ? undefined : 'noopener noreferrer'}
              className="rounded-full border border-transparent px-2.5 py-1.5 transition-colors hover:border-[var(--border-light)] hover:text-[var(--text-primary)]"
              title="اگر ابزار خاصی نیاز دارید، تیم ما آن را برای شما پیاده‌سازی می‌کند."
            >
              اگر ابزار خاصی نیاز دارید
            </a>
            <span aria-hidden="true" className="h-3 w-px bg-[var(--border-light)]" />
            <a
              href={portfolioHref}
              target={portfolioHref.startsWith('/') ? undefined : '_blank'}
              rel={portfolioHref.startsWith('/') ? undefined : 'noopener noreferrer'}
              className="rounded-full border border-transparent px-2.5 py-1.5 transition-colors hover:border-[var(--border-light)] hover:text-[var(--text-primary)]"
              title={settings.developerBrandText}
            >
              توسعه و اجرا توسط {settings.developerName}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
