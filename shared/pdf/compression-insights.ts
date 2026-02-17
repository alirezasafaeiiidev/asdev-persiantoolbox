export type CompressionProfile = 'lite' | 'balanced' | 'accurate';

export type PdfContentKind = 'text' | 'scanned' | 'mixed';

export type CompressionInsight = {
  kind: PdfContentKind;
  likelyReduction: 'low' | 'medium' | 'high';
  reasonFa: string;
};

function countMatches(input: string, token: string): number {
  const matches = input.match(new RegExp(token, 'g'));
  return matches ? matches.length : 0;
}

export function analyzePdfCompressionPotential(buffer: ArrayBuffer): CompressionInsight {
  const sample = new TextDecoder('latin1').decode(
    buffer.slice(0, Math.min(buffer.byteLength, 250_000)),
  );
  const imageTokens = countMatches(sample, '\\/Image');
  const fontTokens = countMatches(sample, '\\/Font');
  const textTokens = countMatches(sample, 'BT');

  const imageScore = imageTokens * 2;
  const textScore = fontTokens + textTokens;

  if (imageScore >= textScore * 2) {
    return {
      kind: 'scanned',
      likelyReduction: 'low',
      reasonFa: 'این PDF عمدتاً تصویری/اسکن‌شده است؛ کاهش حجم معمولاً محدودتر خواهد بود.',
    };
  }

  if (textScore >= imageScore * 2) {
    return {
      kind: 'text',
      likelyReduction: 'medium',
      reasonFa: 'این PDF بیشتر متنی است و معمولاً کاهش حجم متوسط قابل انتظار است.',
    };
  }

  return {
    kind: 'mixed',
    likelyReduction: 'medium',
    reasonFa: 'ساختار فایل ترکیبی است؛ میزان کاهش حجم به نسبت تصویر و فونت بستگی دارد.',
  };
}

export function resolveCompressionProfile(
  fileSizeBytes: number,
  suggestedMode: 'lite' | 'accurate',
): CompressionProfile {
  if (suggestedMode === 'lite') {
    return 'lite';
  }
  if (fileSizeBytes <= 6 * 1024 * 1024) {
    return 'accurate';
  }
  return 'balanced';
}

export function getLowReductionHint(savingsPercent: number, insight: CompressionInsight): string {
  if (savingsPercent >= 5) {
    return '';
  }
  if (insight.kind === 'scanned') {
    return 'برای فایل‌های اسکن‌شده، کاهش بیشتر معمولاً با افت کیفیت تصویر همراه می‌شود.';
  }
  return 'برای کاهش بیشتر، پروفایل Lite را امتحان کنید یا فایل ورودی را با کیفیت پایین‌تر اسکن کنید.';
}
