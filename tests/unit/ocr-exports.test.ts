import { describe, expect, it } from 'vitest';
import { buildDocxDocumentXml, buildOcrJsonExport } from '@/features/ocr/exports';

describe('ocr exports', () => {
  it('builds stable json export payload', () => {
    const output = buildOcrJsonExport({
      sourceName: 'file.pdf',
      generatedAt: '2026-02-17T00:00:00.000Z',
      pages: [
        {
          pageNumber: 1,
          rawText: 'abc',
          normalizedText: 'abc',
          confidence: 0.8,
          confidenceTier: 'high',
          warnings: [],
        },
      ],
    });

    expect(output).toContain('"sourceName": "file.pdf"');
    expect(output).toContain('"confidenceTier": "high"');
  });

  it('escapes xml in docx content', () => {
    const xml = buildDocxDocumentXml(['5 < 7 & 9 > 4']);
    expect(xml).toContain('&lt;');
    expect(xml).toContain('&amp;');
    expect(xml).toContain('&gt;');
  });
});
