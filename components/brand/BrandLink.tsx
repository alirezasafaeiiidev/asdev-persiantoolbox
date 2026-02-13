import Link from 'next/link';
import { brand } from '@/lib/brand';

interface BrandLinkProps {
  className?: string;
}

export default function BrandLink({ className }: BrandLinkProps) {
  return (
    <Link
      href={brand.engineeringRequestUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {brand.requestLabelFa}
    </Link>
  );
}
