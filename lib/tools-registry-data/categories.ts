import type { ToolCategory } from '@/lib/tools-registry-data/types';

export const categories: Record<string, ToolCategory> = {
  pdf: { id: 'pdf-tools', name: 'ابزارهای PDF', path: '/pdf-tools' },
  image: { id: 'image-tools', name: 'ابزارهای تصویر', path: '/image-tools' },
  date: { id: 'date-tools', name: 'ابزارهای تاریخ', path: '/date-tools' },
  text: { id: 'text-tools', name: 'ابزارهای متنی', path: '/text-tools' },
  finance: { id: 'finance-tools', name: 'ابزارهای مالی', path: '/tools' },
};

export function categoryOrThrow(key: string): ToolCategory {
  const category = categories[key];
  if (!category) {
    throw new Error(`Unknown category key: ${key}`);
  }
  return category;
}
