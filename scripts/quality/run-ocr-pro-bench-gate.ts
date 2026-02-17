import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { normalizeOcrText, estimateConfidence } from '../../features/ocr/postprocess';
import { buildDocxDocumentXml, buildOcrJsonExport } from '../../features/ocr/exports';

type BenchKey = 'ocr-normalize' | 'ocr-confidence' | 'ocr-export-json' | 'ocr-export-docx-xml';

type BenchThresholdConfig = {
  iterations: number;
  thresholdsMs: Record<BenchKey, number>;
};

const thresholdPath = resolve(process.cwd(), 'docs/performance/ocr-pro-thresholds.json');
const reportsDir = resolve(process.cwd(), 'docs/performance/reports');

const sample = `اين يك متن نمونه برای OCR است.
شماره فاکتور: 123456
مبلغ: 12500000 تومان
نشانی: تهران، خیابان مثال`;

const sampleLines = sample.split('\n');

const cases: Record<BenchKey, () => unknown> = {
  'ocr-normalize': () => normalizeOcrText(sample),
  'ocr-confidence': () => estimateConfidence(sample),
  'ocr-export-json': () =>
    buildOcrJsonExport({
      sourceName: 'sample.pdf',
      generatedAt: '2026-02-17T00:00:00.000Z',
      pages: [
        {
          pageNumber: 1,
          rawText: sample,
          normalizedText: normalizeOcrText(sample),
          confidence: 0.88,
          confidenceTier: 'high',
          warnings: [],
        },
      ],
    }),
  'ocr-export-docx-xml': () => buildDocxDocumentXml(sampleLines),
};

function benchmark(fn: () => unknown, iterations: number): number {
  for (let i = 0; i < 100; i += 1) {
    fn();
  }
  const start = performance.now();
  for (let i = 0; i < iterations; i += 1) {
    fn();
  }
  const total = performance.now() - start;
  return total / iterations;
}

async function main() {
  const raw = await readFile(thresholdPath, 'utf8');
  const config = JSON.parse(raw) as BenchThresholdConfig;
  const now = new Date();

  const results = Object.entries(cases).map(([key, fn]) => {
    const benchmarkKey = key as BenchKey;
    const avgMs = benchmark(fn, config.iterations);
    const thresholdMs = config.thresholdsMs[benchmarkKey];
    const pass = avgMs <= thresholdMs;

    return {
      benchmark: benchmarkKey,
      avgMs,
      thresholdMs,
      pass,
      driftMs: avgMs - thresholdMs,
    };
  });

  await mkdir(reportsDir, { recursive: true });
  const report = {
    generatedAt: now.toISOString(),
    iterations: config.iterations,
    results,
  };

  const reportPath = resolve(
    reportsDir,
    `ocr-pro-bench-gate-${now.toISOString().replace(/[:.]/g, '-')}.json`,
  );

  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const failed = results.filter((result) => !result.pass);
  if (failed.length > 0) {
    const details = failed
      .map(
        (entry) => `${entry.benchmark}: avg=${entry.avgMs.toFixed(3)}ms > ${entry.thresholdMs}ms`,
      )
      .join(' | ');
    throw new Error(`OCR/Pro benchmark gate failed: ${details}`);
  }

  const summary = results
    .map((entry) => `${entry.benchmark}=${entry.avgMs.toFixed(3)}ms<=${entry.thresholdMs}ms`)
    .join(', ');

  process.stdout.write(`ocr-pro-bench-gate passed (${summary})\n`);
  process.stdout.write(`report: ${reportPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
