import { describe, expect, it } from 'vitest';
import {
  analyzePdfCompressionPotential,
  getLowReductionHint,
  resolveCompressionProfile,
} from '@/shared/pdf/compression-insights';

describe('pdf compression insights', () => {
  it('classifies scanned-like payloads', () => {
    const source = new TextEncoder().encode('/Image /Image /Image /Font');
    const insight = analyzePdfCompressionPotential(source.buffer);
    expect(insight.kind).toBe('scanned');
    expect(insight.likelyReduction).toBe('low');
  });

  it('suggests accurate profile for small files', () => {
    const profile = resolveCompressionProfile(2 * 1024 * 1024, 'accurate');
    expect(profile).toBe('accurate');
  });

  it('returns low-reduction hint for weak savings', () => {
    const hint = getLowReductionHint(3, {
      kind: 'scanned',
      likelyReduction: 'low',
      reasonFa: 'x',
    });
    expect(hint.length > 0).toBe(true);
  });
});
