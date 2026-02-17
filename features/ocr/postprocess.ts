import { cleanPersianText, toPersianNumbers } from '@/shared/utils/localization/persian';
import type { OcrConfidenceTier } from '@/features/ocr/types';

const persianCharRegex = /[\u0600-\u06FF]/g;

export function normalizeOcrText(input: string): string {
  const cleaned = cleanPersianText(input)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
  return toPersianNumbers(cleaned);
}

export function estimateConfidence(text: string): {
  confidence: number;
  tier: OcrConfidenceTier;
  warnings: string[];
} {
  const length = text.trim().length;
  const persianMatches = text.match(persianCharRegex) ?? [];
  const persianRatio = length > 0 ? persianMatches.length / length : 0;
  const warnings: string[] = [];

  if (length === 0) {
    warnings.push('هیچ متنی در این صفحه تشخیص داده نشد.');
    return { confidence: 0, tier: 'low', warnings };
  }

  let confidence = Math.min(1, 0.35 + Math.min(0.45, length / 1200) + Math.min(0.2, persianRatio));

  if (length < 40) {
    warnings.push('حجم متن تشخیص‌داده‌شده کم است (احتمال اسکن تصویری).');
    confidence -= 0.2;
  }

  if (persianRatio < 0.2) {
    warnings.push('نسبت کاراکتر فارسی پایین است؛ خروجی نیازمند بازبینی است.');
    confidence -= 0.1;
  }

  confidence = Math.max(0, Math.min(1, confidence));
  const tier: OcrConfidenceTier =
    confidence >= 0.75 ? 'high' : confidence >= 0.45 ? 'medium' : 'low';

  return { confidence, tier, warnings };
}
