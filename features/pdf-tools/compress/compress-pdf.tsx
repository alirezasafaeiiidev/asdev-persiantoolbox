'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card } from '@/components/ui';
import Alert from '@/shared/ui/Alert';
import { createPdfWorkerClient, type PdfWorkerClient } from '@/features/pdf-tools/workerClient';
import { recordHistory } from '@/shared/history/recordHistory';
import RecentHistoryCard from '@/components/features/history/RecentHistoryCard';
import {
  getSuggestedCompressionMode,
  validateHeavyFile,
  validateHeavyFileCount,
} from '@/shared/guardrails/heavy-file';
import {
  analyzePdfCompressionPotential,
  getLowReductionHint,
  resolveCompressionProfile,
  type CompressionInsight,
  type CompressionProfile,
} from '@/shared/pdf/compression-insights';

const PDF_MAX_FILE_SIZE_BYTES = 40 * 1024 * 1024;
const MAX_FILES = 6;

type QueueStatus = 'idle' | 'processing' | 'done' | 'error';
type QueueItem = {
  id: string;
  file: File;
  status: QueueStatus;
  progress: number;
  resultUrl?: string;
  resultSize?: number;
  insight?: CompressionInsight;
  error?: string;
};

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(2)} ${units[index]}`;
}

export default function CompressPdfPage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<CompressionProfile>('balanced');
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<PdfWorkerClient | null>(null);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
      setItems((current) => {
        current.forEach((item) => {
          if (item.resultUrl) {
            URL.revokeObjectURL(item.resultUrl);
          }
        });
        return [];
      });
    };
  }, []);

  const getWorker = () => {
    if (!workerRef.current) {
      workerRef.current = createPdfWorkerClient();
    }
    return workerRef.current;
  };

  const updateItem = (id: string, updater: (item: QueueItem) => QueueItem) => {
    setItems((prev) => prev.map((item) => (item.id === id ? updater(item) : item)));
  };

  const onSelectFile = (fileList: FileList | null) => {
    setError(null);
    if (!fileList || fileList.length === 0) {
      return;
    }

    const selectedFiles = Array.from(fileList);
    const countGuardrail = validateHeavyFileCount(items.length + selectedFiles.length, {
      maxFiles: MAX_FILES,
      fileLabelFa: 'فایل PDF',
    });
    if (!countGuardrail.ok) {
      setError(`${countGuardrail.message}${countGuardrail.hint ? ` ${countGuardrail.hint}` : ''}`);
      return;
    }

    const nextItems: QueueItem[] = [];
    const errors: string[] = [];

    selectedFiles.forEach((selected) => {
      const guardrail = validateHeavyFile(selected, {
        acceptedMimeTypes: ['application/pdf'],
        maxFileSizeBytes: PDF_MAX_FILE_SIZE_BYTES,
        fileLabelFa: `فایل ${selected.name}`,
      });
      if (!guardrail.ok) {
        errors.push(`${guardrail.message}${guardrail.hint ? ` ${guardrail.hint}` : ''}`);
        return;
      }
      nextItems.push({
        id: createId(),
        file: selected,
        status: 'idle',
        progress: 0,
      });
    });

    if (errors.length > 0) {
      setError(errors.slice(0, 2).join(' | '));
    }

    if (nextItems.length > 0) {
      setItems((prev) => [...prev, ...nextItems]);
      if (items.length === 0) {
        const first = nextItems[0];
        if (first) {
          setProfile(
            resolveCompressionProfile(
              first.file.size,
              getSuggestedCompressionMode(first.file.size, 15 * 1024 * 1024),
            ),
          );
        }
      }
    }
  };

  const runCompression = async (item: QueueItem) => {
    updateItem(item.id, (current) => {
      const { error: _error, ...rest } = current;
      void _error;
      return { ...rest, status: 'processing', progress: 0 };
    });

    try {
      const buffer = await item.file.arrayBuffer();
      const insight = analyzePdfCompressionPotential(buffer);
      const selectedProfile =
        profile === 'balanced'
          ? resolveCompressionProfile(
              item.file.size,
              getSuggestedCompressionMode(item.file.size, 15 * 1024 * 1024),
            )
          : profile;
      const worker = getWorker();
      const result = await worker.request(
        { type: 'compress', file: buffer, profile: selectedProfile },
        (value) => {
          updateItem(item.id, (current) => ({
            ...current,
            progress: Math.round(value * 100),
          }));
        },
      );
      const blob = new Blob([result.buffer], { type: 'application/pdf' });
      const resultUrl = URL.createObjectURL(blob);

      updateItem(item.id, (current) => {
        if (current.resultUrl) {
          URL.revokeObjectURL(current.resultUrl);
        }
        return {
          ...current,
          status: 'done',
          progress: 100,
          resultUrl,
          resultSize: blob.size,
          insight,
        };
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      updateItem(item.id, (current) => ({
        ...current,
        status: 'error',
        error: message,
      }));
    }
  };

  const onCompress = async () => {
    setError(null);
    if (items.length === 0) {
      setError('ابتدا حداقل یک فایل PDF را انتخاب کنید.');
      return;
    }

    setBusy(true);
    try {
      for (const item of items) {
        // process queue serially to keep memory usage predictable on mobile
        // eslint-disable-next-line no-await-in-loop
        await runCompression(item);
      }
    } finally {
      setBusy(false);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const current = prev.find((item) => item.id === id);
      if (current?.resultUrl) {
        URL.revokeObjectURL(current.resultUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearQueue = () => {
    items.forEach((item) => {
      if (item.resultUrl) {
        URL.revokeObjectURL(item.resultUrl);
      }
    });
    setItems([]);
    setError(null);
  };

  const totals = useMemo(() => {
    const original = items.reduce((sum, item) => sum + item.file.size, 0);
    const compressed = items.reduce((sum, item) => sum + (item.resultSize ?? 0), 0);
    const savings =
      original > 0 && compressed > 0 ? Math.max(0, ((original - compressed) / original) * 100) : 0;
    return { original, compressed, savings };
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">فشرده سازی PDF</h1>
          <p className="text-lg text-[var(--text-secondary)]">
            فشرده‌سازی تک‌فایل یا چندفایل به‌صورت صف محلی، بدون ارسال به سرور
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex flex-col gap-3">
            <label
              htmlFor="compress-pdf-file"
              className="text-sm font-semibold text-[var(--text-primary)]"
            >
              انتخاب فایل PDF (حداکثر {MAX_FILES} فایل)
            </label>
            <input
              id="compress-pdf-file"
              type="file"
              multiple
              accept="application/pdf"
              onChange={(e) => onSelectFile(e.target.files)}
              className="input-field"
            />
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-secondary)] space-y-2">
            <div>پروفایل فشرده‌سازی</div>
            <select
              id="compress-profile"
              value={profile}
              onChange={(event) => setProfile(event.target.value as CompressionProfile)}
              className="input-field"
              disabled={busy}
            >
              <option value="lite">Lite (سریع‌تر و سبک‌تر)</option>
              <option value="balanced">Balanced (متعادل)</option>
              <option value="accurate">Accurate (حفظ کیفیت)</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={clearQueue}
              disabled={busy || items.length === 0}
            >
              پاک‌سازی صف
            </Button>
            <Button type="button" onClick={onCompress} disabled={busy || items.length === 0}>
              {busy ? 'در حال پردازش صف...' : 'شروع فشرده‌سازی صف'}
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {items.length > 0 && (
            <div className="space-y-3">
              <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                تعداد فایل: {items.length} | حجم کل اولیه: {formatBytes(totals.original)}
                {totals.compressed > 0 && (
                  <span>
                    {' '}
                    | حجم کل جدید: {formatBytes(totals.compressed)} | صرفه‌جویی:{' '}
                    {totals.savings.toFixed(1)}%
                  </span>
                )}
              </div>

              {items.map((item) => {
                const savings =
                  item.resultSize && item.file.size > 0
                    ? Math.max(0, ((item.file.size - item.resultSize) / item.file.size) * 100)
                    : 0;
                const resultSize = item.resultSize;
                const hint = item.insight ? getLowReductionHint(savings, item.insight) : '';
                return (
                  <div
                    key={item.id}
                    className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm text-[var(--text-primary)] font-semibold">
                        {item.file.name}
                      </div>
                      <button
                        type="button"
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        disabled={busy}
                        onClick={() => removeItem(item.id)}
                      >
                        حذف از صف
                      </button>
                    </div>

                    <div className="text-xs text-[var(--text-muted)]">
                      حجم اولیه: {formatBytes(item.file.size)} | وضعیت:{' '}
                      {item.status === 'idle' && 'آماده'}
                      {item.status === 'processing' && 'در حال پردازش'}
                      {item.status === 'done' && 'تکمیل شده'}
                      {item.status === 'error' && 'خطا'}
                    </div>

                    {item.status === 'processing' && (
                      <div className="space-y-1">
                        <div className="h-2 w-full rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                          <div
                            className="h-full bg-[var(--color-primary)] transition-all duration-200"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">{item.progress}%</div>
                      </div>
                    )}

                    {item.error && <Alert variant="danger">{item.error}</Alert>}

                    {item.resultUrl && resultSize !== undefined && (
                      <Alert variant="success" className="space-y-2">
                        <div>
                          حجم جدید: {formatBytes(resultSize)} | صرفه‌جویی: {savings.toFixed(1)}%
                        </div>
                        {item.insight && <div className="text-xs">{item.insight.reasonFa}</div>}
                        {hint && <div className="text-xs">{hint}</div>}
                        <a
                          className="font-semibold underline"
                          href={item.resultUrl}
                          download={`compressed-${item.file.name.replace(/\s+/g, '-')}`}
                          onClick={() =>
                            void recordHistory({
                              tool: 'pdf-compress',
                              inputSummary: `فایل: ${item.file.name}`,
                              outputSummary: `دانلود فایل با حجم ${formatBytes(resultSize)}`,
                            })
                          }
                        >
                          دانلود فایل
                        </a>
                      </Alert>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <RecentHistoryCard
          title="آخرین عملیات PDF"
          toolPrefixes={['pdf-']}
          toolIds={['image-to-pdf']}
        />
      </div>
    </div>
  );
}
