import Link from 'next/link';
import Container from '@/components/ui/Container';
import Footer from '@/components/ui/Footer';
import Navigation from '@/components/ui/Navigation';
import { buildMetadata } from '@/lib/seo';
import { getGuidePages } from '@/lib/guide-pages';
import { getCategories } from '@/lib/tools-registry';

export const metadata = buildMetadata({
  title: 'راهنماهای تخصصی ابزارها - جعبه ابزار فارسی',
  description: 'مجموعه راهنماهای عمیق برای استفاده بهتر از ابزارهای PDF، تصویر، تاریخ، متن و مالی.',
  path: '/guides',
});

export default function GuidesPage() {
  const guides = getGuidePages();
  const categories = new Map(getCategories().map((category) => [category.id, category]));

  return (
    <div className="min-h-dvh flex flex-col page-shell">
      <Navigation />
      <main className="flex-1">
        <Container className="py-10 space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-black text-[var(--text-primary)]">راهنماهای تخصصی</h1>
            <p className="text-[var(--text-secondary)] leading-7">
              هر راهنما یک سناریوی واقعی را قدم‌به‌قدم پوشش می‌دهد و به ابزارهای مرتبط لینک می‌دهد.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2">
            {guides.map((guide) => {
              const category = categories.get(guide.categoryId);
              return (
                <article
                  key={guide.slug}
                  className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)] p-5 space-y-3"
                >
                  <p className="text-xs text-[var(--text-muted)]">
                    {category?.name ?? guide.categoryId}
                  </p>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{guide.title}</h2>
                  <p className="text-[var(--text-secondary)] leading-7">{guide.description}</p>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="inline-flex text-sm font-semibold text-[var(--color-primary)]"
                  >
                    مطالعه راهنما
                  </Link>
                </article>
              );
            })}
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
