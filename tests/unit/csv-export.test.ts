import { describe, expect, it } from 'vitest';
import { buildCsvContent } from '@/shared/utils/csv';

describe('csv export utility', () => {
  it('builds CSV with explicit headers and BOM', () => {
    const csv = buildCsvContent(
      [
        { field: 'netSalary', value: 12000000 },
        { field: 'mode', value: 'gross-to-net' },
      ],
      ['field', 'value'],
    );

    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('"field","value"');
    expect(csv).toContain('"netSalary","12000000"');
  });

  it('escapes quotes correctly', () => {
    const csv = buildCsvContent([{ note: 'نرخ "موثر"', value: 23.1 }], ['note', 'value']);

    expect(csv).toContain('"نرخ ""موثر"""');
  });
});
