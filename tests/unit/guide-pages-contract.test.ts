import { describe, expect, it } from 'vitest';
import { getGuidePages, validateGuideLinkPaths } from '@/lib/guide-pages';
import { getCategories } from '@/lib/tools-registry';

describe('guide pages contract', () => {
  it('ensures each category has at least one guide page', () => {
    const categories = getCategories();
    const guides = getGuidePages();
    for (const category of categories) {
      const count = guides.filter((guide) => guide.categoryId === category.id).length;
      expect(count >= 1, `category ${category.id} has no guide page`).toBe(true);
    }
  });

  it('ensures guide related paths point to existing registry routes', () => {
    const { valid, invalidPaths } = validateGuideLinkPaths();
    expect(valid, `invalid guide links: ${invalidPaths.join(', ')}`).toBe(true);
  });
});
