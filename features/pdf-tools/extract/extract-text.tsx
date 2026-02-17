'use client';

import { useMemo, useState } from 'react';
import { Button, Card } from '@/components/ui';
import Alert from '@/shared/ui/Alert';
import { loadPdfJs } from '@/features/pdf-tools/lazy-deps';
import { createOcrQueue } from '@/features/ocr/queue';
import { estimateConfidence, normalizeOcrText } from '@/features/ocr/postprocess';
import { buildOcrDocxBlob, buildOcrJsonExport } from '@/features/ocr/exports';
import type { OcrDocumentResult, OcrPageResult } from '@/features/ocr/types';
import { recordHistory } from '@/shared/history/recordHistory';
import RecentHistoryCard from '@/components/features/history/RecentHistoryCard';

const isPdfOcrEnabled = process.env['NEXT_PUBLIC_FEATURE_PDF_OCR'] !== '0';

type PdfTextItem = {
  str?: string;
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function tierBadgeClass(tier: OcrPageResult['confidenceTier']) {
  if (tier === 'high') {
    return 'bg-[rgb(var(--color-success-rgb)/0.14)] text-[var(--color-success)] border-[rgb(var(--color-success-rgb)/0.35)]';
  }
  if (tier === 'medium') {
    return 'bg-[rgb(var(--color-warning-rgb)/0.14)] text-[var(--color-warning)] border-[rgb(var(--color-warning-rgb)/0.35)]';
  }
  return 'bg-[rgb(var(--color-danger-rgb)/0.12)] text-[var(--color-danger)] border-[rgb(var(--color-danger-rgb)/0.35)]';
}

export default function ExtractTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OcrDocumentResult | null>(null);

  const fullText = useMemo(() => {
    if (!result) {
      return '';
    }
    return result.pages.map((page) => page.normalizedText).join('\n\n');
  }, [result]);

  const onSelectFile = (files: FileList | null) => {
    setError(null);
    setResult(null);

    if (!files || files.length === 0) {
      return;
    }

    const selected = files[0];
    if (!selected || selected.type !== 'application/pdf') {
      setError('فقط فایل PDF قابل انتخاب است.');
      return;
    }

    setFile(selected);
  };

  const runExtraction = async () => {
    setError(null);
    setResult(null);
    setProgress(0);

    if (!isPdfOcrEnabled) {
      setError('قابلیت OCR در این محیط غیرفعال است.');
      return;
    }

    if (!file) {
      setError('ابتدا فایل PDF را انتخاب کنید.');
      return;
    }

    setBusy(true);
    try {
      const { GlobalWorkerOptions, getDocument } = await loadPdfJs();
      GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString();

      const buffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: new Uint8Array(buffer) }).promise;

      const queue = createOcrQueue(1);
      const pages: OcrPageResult[] = [];
      let completed = 0;

      const jobs = Array.from({ length: pdf.numPages }, (_, index) => {
        const pageNumber = index + 1;
        return queue.enqueue({
          id: `ocr-page-${pageNumber}`,
          run: async () => {
            const page = await pdf.getPage(pageNumber);
            const textContent = await page.getTextContent();
            const rawText = textContent.items
              .map((item) => {
                const candidate = item as PdfTextItem;
                return candidate.str ?? '';
              })
              .join(' ')
              .trim();

            const normalizedText = normalizeOcrText(rawText);
            const confidenceMeta = estimateConfidence(normalizedText);

            const pageResult: OcrPageResult = {
              pageNumber,
              rawText,
              normalizedText,
              confidence: confidenceMeta.confidence,
              confidenceTier: confidenceMeta.tier,
              warnings: confidenceMeta.warnings,
            };

            completed += 1;
            setProgress(Math.round((completed / pdf.numPages) * 100));
            return pageResult;
          },
        });
      });

      const orderedPages = await Promise.all(jobs);
      pages.push(...orderedPages.sort((a, b) => a.pageNumber - b.pageNumber));

      const documentResult: OcrDocumentResult = {
        sourceName: file.name,
        generatedAt: new Date().toISOString(),
        pages,
      };

      setResult(documentResult);
      void recordHistory({
        tool: 'pdf-ocr-extract-text',
        inputSummary: `فایل: ${file.name}`,
        outputSummary: `استخراج ${pages.length} صفحه`,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'خطای نامشخص رخ داد.');
    } finally {
      setBusy(false);
    }
  };

  const onExportTxt = () => {
    if (!result) {
      return;
    }
    downloadBlob(new Blob([fullText], { type: 'text/plain;charset=utf-8' }), 'ocr-output.txt');
  };

  const onExportJson = () => {
    if (!result) {
      return;
    }
    const json = buildOcrJsonExport(result);
    downloadBlob(new Blob([json], { type: 'application/json;charset=utf-8' }), 'ocr-output.json');
  };

  const onExportDocx = async () => {
    if (!result) {
      return;
    }
    const lines = fullText.split(/\r?\n/);
    const blob = await buildOcrDocxBlob(lines);
    downloadBlob(blob, 'ocr-output.docx');
  };

  return (
    <div className="space-y-6">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            OCR فارسی و استخراج متن PDF
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            پردازش کاملاً محلی برای استخراج متن، نرمال‌سازی فارسی و خروجی حرفه‌ای.
          </p>
        </div>

        {!isPdfOcrEnabled && (
          <Alert variant="warning">
            قابلیت OCR در این محیط خاموش است. برای فعال‌سازی، `NEXT_PUBLIC_FEATURE_PDF_OCR=1` را
            تنظیم کنید.
          </Alert>
        )}

        <Card className="p-6 space-y-4" aria-busy={busy}>
          <div className="flex flex-col gap-3">
            <label
              htmlFor="ocr-pdf-file"
              className="text-sm font-semibold text-[var(--text-primary)]"
            >
              انتخاب فایل PDF
            </label>
            <input
              id="ocr-pdf-file"
              type="file"
              accept="application/pdf"
              className="input-field"
              onChange={(event) => onSelectFile(event.target.files)}
            />
          </div>

          {file && (
            <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              فایل انتخاب‌شده: {file.name}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFile(null)}
              disabled={busy || !file}
            >
              تغییر فایل
            </Button>
            <Button type="button" onClick={runExtraction} disabled={busy || !isPdfOcrEnabled}>
              {busy ? 'در حال استخراج متن...' : 'شروع OCR'}
            </Button>
          </div>

          {busy && (
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-[var(--text-muted)]" role="status" aria-live="polite">
                {progress}%
              </div>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}
        </Card>

        {result && (
          <Card className="p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                خروجی OCR ({result.pages.length} صفحه)
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="secondary" onClick={onExportTxt}>
                  خروجی TXT
                </Button>
                <Button type="button" variant="secondary" onClick={onExportJson}>
                  خروجی JSON
                </Button>
                <Button type="button" onClick={() => void onExportDocx()}>
                  خروجی DOCX
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {result.pages.map((page) => (
                <article
                  key={page.pageNumber}
                  className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      صفحه {page.pageNumber}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${tierBadgeClass(page.confidenceTier)}`}
                    >
                      {page.confidenceTier} ({Math.round(page.confidence * 100)}%)
                    </span>
                  </div>
                  {page.warnings.length > 0 && (
                    <ul className="mb-2 list-disc space-y-1 pr-5 text-xs text-[var(--text-muted)]">
                      {page.warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">
                    {page.normalizedText || 'متنی تشخیص داده نشد.'}
                  </p>
                </article>
              ))}
            </div>
          </Card>
        )}

        <RecentHistoryCard
          title="آخرین عملیات PDF"
          toolPrefixes={['pdf-']}
          toolIds={['pdf-ocr-extract-text']}
        />
      </div>
    </div>
  );
}
