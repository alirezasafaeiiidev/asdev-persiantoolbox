export type OcrConfidenceTier = 'high' | 'medium' | 'low';

export type OcrPageResult = {
  pageNumber: number;
  rawText: string;
  normalizedText: string;
  confidence: number;
  confidenceTier: OcrConfidenceTier;
  warnings: string[];
};

export type OcrDocumentResult = {
  sourceName: string;
  generatedAt: string;
  pages: OcrPageResult[];
};

export type OcrQueueJob<T> = {
  id: string;
  run: () => Promise<T>;
};
