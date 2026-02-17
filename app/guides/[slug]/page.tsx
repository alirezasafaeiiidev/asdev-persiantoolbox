import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import Container from '@/components/ui/Container';
import Footer from '@/components/ui/Footer';
import Navigation from '@/components/ui/Navigation';
import { getCspNonce } from '@/lib/csp';
import { getGuideBySlug, getGuideCategory } from '@/lib/guide-pages';
import { buildMetadata } from '@/lib/seo';
import { buildGuideJsonLd } from '@/lib/seo-tools';
import { getToolByPath } from '@/lib/tools-registry';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) {
    return buildMetadata({
      title: 'راهنما یافت نشد - جعبه ابزار فارسی',
      description: 'راهنمای مورد نظر یافت نشد.',
      path: `/guides/${params.slug}`,
    });
  }
  return buildMetadata({
    title: `${guide.title} - جعبه ابزار فارسی`,
    description: guide.description,
    path: `/guides/${guide.slug}`,
  });
}

export default async function GuidePage({ params }: Props) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) {
    notFound();
  }

  const category = getGuideCategory(guide.slug);
  const relatedTools = guide.relatedToolPaths
    .map((path) => getToolByPath(path))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));
  const nonce = await getCspNonce();
  const jsonLd = buildGuideJsonLd({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    category: {
      name: category?.name ?? guide.categoryId,
      path: category?.path ?? '/topics',
    },
    relatedTools: relatedTools.map((tool) => ({
      name: tool.title.replace(' - جعبه ابزار فارسی', ''),
      path: tool.path,
    })),
    faq: guide.faq,
  });

  return (
    <div className="min-h-dvh flex flex-col page-shell">
      <Navigation />
      <main className="flex-1">
        <Container className="py-10 space-y-8">
          <Script
            id={`guide-${guide.slug}-json-ld`}
            type="application/ld+json"
            strategy="afterInteractive"
            nonce={nonce ?? undefined}
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <header className="space-y-3">
            <p className="text-sm text-[var(--text-muted)]">
              راهنمای تخصصی {category?.name ?? guide.categoryId}
            </p>
            <h1 className="text-3xl font-black text-[var(--text-primary)]">{guide.title}</h1>
            <p className="text-[var(--text-secondary)] leading-7">{guide.description}</p>
          </header>

          <section className="space-y-6">
            {guide.sections.map((section) => (
              <article key={section.heading} className="space-y-3">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">{section.heading}</h2>
                <div className="space-y-3 text-[var(--text-secondary)] leading-7">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">ابزارهای مرتبط</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="rounded-full border border-[var(--border-light)] bg-[var(--surface-1)] px-3 py-1 text-sm text-[var(--text-primary)] hover:border-[var(--border-strong)]"
                >
                  {tool.title.replace(' - جعبه ابزار فارسی', '')}
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">سوالات متداول</h2>
            <div className="space-y-3">
              {guide.faq.map((item) => (
                <details
                  key={item.question}
                  className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3"
                >
                  <summary className="cursor-pointer text-[var(--text-primary)] font-semibold">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-[var(--text-secondary)] leading-7">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
