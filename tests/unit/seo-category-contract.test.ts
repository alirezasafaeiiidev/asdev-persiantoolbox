import { describe, expect, it } from 'vitest';
import {
  getCategories,
  getCategoryContent,
  getToolByPath,
  getToolsByCategory,
} from '@/lib/tools-registry';
import { getGuidesByCategory } from '@/lib/guide-pages';

describe('seo category content contract', () => {
  it('ensures each category has guide content and FAQ', () => {
    const categories = getCategories();
    for (const category of categories) {
      const content = getCategoryContent(category.id);
      expect(content, `missing category content for ${category.id}`).toBeDefined();
      expect((content?.paragraphs.length ?? 0) >= 1, `missing paragraphs for ${category.id}`).toBe(
        true,
      );
      expect((content?.faq.length ?? 0) >= 1, `missing faq for ${category.id}`).toBe(true);
    }
  });

  it('ensures each category has linkable destination pages', () => {
    const categories = getCategories();
    for (const category of categories) {
      const tools = getToolsByCategory(category.id);
      const categoryLanding = getToolByPath(category.path);
      const guides = getGuidesByCategory(category.id);
      expect(
        tools.length >= 1 || Boolean(categoryLanding) || guides.length >= 1,
        `category ${category.id} has no linkable pages`,
      ).toBe(true);
    }
  });
});
