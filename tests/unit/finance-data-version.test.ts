import { describe, expect, it } from 'vitest';
import { getFinanceDataVersion } from '@/lib/finance-data-version';

describe('finance data version contract', () => {
  it('returns version metadata for all finance tools', () => {
    const toolIds = ['loan', 'salary', 'interest'] as const;

    for (const toolId of toolIds) {
      const payload = getFinanceDataVersion(toolId);
      expect(payload.tool).toBe(toolId);
      expect(payload.version.length).toBeGreaterThan(1);
      expect(payload.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(payload.source.length).toBeGreaterThan(3);
      expect(payload.notes.length).toBeGreaterThan(0);
    }
  });

  it('keeps salary metadata tied to local versioned feed', () => {
    const salary = getFinanceDataVersion('salary');

    expect(salary.version).toBe('v1');
    expect(salary.source).toBe('local-versioned-json');
  });
});
