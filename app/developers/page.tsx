import Container from '@/components/ui/Container';
import Footer from '@/components/ui/Footer';
import Navigation from '@/components/ui/Navigation';
import DevelopersPage from '@/components/features/developers/DevelopersPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'مرکز توسعه‌دهندگان - PersianToolbox',
  description:
    'کتابخانه TypeScript برای توابع تاریخ، اعداد، اعتبارسنجی و ابزارهای فارسی با رویکرد local-first.',
  path: '/developers',
  keywords: ['persiantoolbox', 'typescript', 'persian tools', 'date', 'validation', 'numbers'],
});

export default function DevelopersRoute() {
  return (
    <div className="min-h-dvh flex flex-col page-shell">
      <Navigation />
      <main className="flex-1">
        <Container className="py-10">
          <DevelopersPage />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
