import Container from '@/components/ui/Container';
import Footer from '@/components/ui/Footer';
import Navigation from '@/components/ui/Navigation';
import { buildMetadata } from '@/lib/seo';
import { getPublicSiteSettings } from '@/lib/server/siteSettings';

export const metadata = buildMetadata({
  title: 'خدمات PersianToolbox - جعبه ابزار فارسی',
  description: 'خدمات توسعه، بومی‌سازی و سخت‌سازی محصول دیجیتال بر پایه رویکرد local-first',
  path: '/services',
});

const serviceItems = [
  {
    title: 'پیاده‌سازی ابزارهای سفارشی',
    detail: 'توسعه ابزارهای اختصاصی فارسی با تمرکز بر عملکرد بالا و پردازش محلی.',
  },
  {
    title: 'بهینه‌سازی و پایداری محصول',
    detail: 'بهبود کیفیت کد، تست‌پذیری و استانداردسازی مسیر انتشار نسخه.',
  },
  {
    title: 'مشاوره فنی و اجرایی',
    detail: 'تحلیل مسیر تحویل، کاهش ریسک عملیاتی و طراحی قراردادهای اجرایی.',
  },
];

export default async function ServicesPage() {
  const settings = await getPublicSiteSettings();
  const orderHref = settings.orderUrl ?? settings.portfolioUrl;
  const portfolioFallback = settings.portfolioUrl ?? '/asdev-portfolio';

  return (
    <div className="min-h-dvh flex flex-col page-shell">
      <Navigation />
      <main className="flex-1">
        <Container className="py-10 space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-black text-[var(--text-primary)]">خدمات</h1>
            <p className="text-[var(--text-secondary)] leading-7">
              این صفحه نمای کلی خدمات اجرایی PersianToolbox را ارائه می‌کند و بخشی از مسیر شفاف
              تحویل در محیط توسعه است.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">سرفصل خدمات</h2>
            <ul className="list-disc space-y-2 pr-5 text-[var(--text-secondary)]">
              {serviceItems.map((item) => (
                <li key={item.title}>
                  <span className="font-semibold text-[var(--text-primary)]">{item.title}: </span>
                  {item.detail}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/92 p-6 shadow-[var(--shadow-subtle)]">
            <h2 className="text-xl font-black text-[var(--text-primary)]">درخواست ابزار اختصاصی</h2>
            <p className="mt-2 text-[var(--text-secondary)] leading-7">
              اگر ابزار خاصی نیاز دارید، تیم ما آن را متناسب با نیاز شما طراحی و پیاده‌سازی می‌کند.
              برای هماهنگی و مشاهده نمونه‌کارها از لینک زیر استفاده کنید.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {orderHref ? (
                <a
                  href={orderHref}
                  target={orderHref.startsWith('/') ? undefined : '_blank'}
                  rel={orderHref.startsWith('/') ? undefined : 'noopener noreferrer'}
                  className="btn btn-primary btn-md px-5"
                >
                  ثبت درخواست
                </a>
              ) : (
                <span className="text-sm font-semibold text-[var(--text-muted)]">
                  برای فعال شدن لینک، مقدار `ORDER_URL` یا `PORTFOLIO_URL` را تنظیم کنید.
                </span>
              )}
              {settings.portfolioUrl ? (
                <a
                  href={settings.portfolioUrl}
                  target={settings.portfolioUrl.startsWith('/') ? undefined : '_blank'}
                  rel={settings.portfolioUrl.startsWith('/') ? undefined : 'noopener noreferrer'}
                  className="btn btn-secondary btn-md px-5"
                >
                  مشاهده صفحه شخصی
                </a>
              ) : (
                <a href={portfolioFallback} className="btn btn-secondary btn-md px-5">
                  مشاهده صفحه شخصی
                </a>
              )}
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
