import Link from 'next/link';
import InterestPage from '@/components/features/interest/InterestPage';
import ToolSeoContent from '@/components/seo/ToolSeoContent';
import { buildMetadata } from '@/lib/seo';
import { getToolByPathOrThrow } from '@/lib/tools-registry';

const tool = getToolByPathOrThrow('/interest');

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords,
  path: tool.path,
});

export default function InterestRoute() {
  return (
    <div className="space-y-10">
      <InterestPage />
      <ToolSeoContent tool={tool} />
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">ابزارهای مرتبط مالی</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/loan"
            className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            محاسبه‌گر وام
          </Link>
          <Link
            href="/salary"
            className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            محاسبه‌گر حقوق
          </Link>
          <Link
            href="/tools"
            className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            هاب مالی
          </Link>
        </div>
      </section>
    </div>
  );
}
