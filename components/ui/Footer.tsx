import BrandFooter from '@/components/brand/BrandFooter';

export default function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-light)] bg-[var(--surface-1)]/95 backdrop-blur-xl">
      <BrandFooter />
    </footer>
  );
}
