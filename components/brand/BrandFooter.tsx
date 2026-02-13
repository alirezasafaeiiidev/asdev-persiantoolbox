import Link from 'next/link';
import { brand } from '@/lib/brand';

export default function BrandFooter() {
  return (
    <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-center px-4 py-3">
      <Link
        href={brand.engineeringHubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-[var(--text-secondary)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-primary)]"
      >
        {brand.footerTextFa}
      </Link>
    </div>
  );
}
