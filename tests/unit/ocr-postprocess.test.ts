import { describe, expect, it } from 'vitest';
import { estimateConfidence, normalizeOcrText } from '@/features/ocr/postprocess';

describe('ocr postprocess', () => {
  it('normalizes Arabic variants to Persian text and digits', () => {
    const value = normalizeOcrText('اين متن عربي 123 است');
    expect(value).toContain('این متن عرب');
    expect(value).toContain('۱۲۳');
    expect(value).toContain('است');
  });

  it('marks empty text as low confidence', () => {
    const result = estimateConfidence('   ');
    expect(result.tier).toBe('low');
    expect(result.confidence).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('returns high/medium confidence for dense Persian text', () => {
    const result = estimateConfidence(
      'این یک متن فارسی کامل برای ارزیابی کیفیت OCR در سند مالی است.',
    );
    expect(['high', 'medium']).toContain(result.tier);
    expect(result.confidence).toBeGreaterThan(0.4);
  });
});
