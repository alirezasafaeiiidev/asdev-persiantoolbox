import { describe, expect, it } from 'vitest';
import {
  getSuggestedCompressionMode,
  validateHeavyFile,
  validateHeavyFileCount,
} from '@/shared/guardrails/heavy-file';

describe('heavy file guardrails', () => {
  it('blocks unsupported file types', () => {
    const file = new File(['hello'], 'bad.txt', { type: 'text/plain' });
    const result = validateHeavyFile(file, {
      acceptedMimeTypes: ['application/pdf'],
      maxFileSizeBytes: 1024,
      fileLabelFa: 'فایل تست',
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe('UNSUPPORTED_FILE_TYPE');
  });

  it('blocks oversized files', () => {
    const largeFile = new File([new Uint8Array(2048)], 'x.pdf', { type: 'application/pdf' });
    const result = validateHeavyFile(largeFile, {
      acceptedMimeTypes: ['application/pdf'],
      maxFileSizeBytes: 1024,
      fileLabelFa: 'فایل PDF',
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe('FILE_TOO_LARGE');
  });

  it('blocks over-limit file counts', () => {
    const result = validateHeavyFileCount(9, { maxFiles: 8, fileLabelFa: 'تصویر' });
    expect(result.ok).toBe(false);
    expect(result.code).toBe('TOO_MANY_FILES');
  });

  it('recommends lite mode for large files', () => {
    expect(getSuggestedCompressionMode(9 * 1024 * 1024, 8 * 1024 * 1024)).toBe('lite');
    expect(getSuggestedCompressionMode(2 * 1024 * 1024, 8 * 1024 * 1024)).toBe('accurate');
  });
});
