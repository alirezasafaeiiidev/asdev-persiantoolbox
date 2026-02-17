import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { calculateLoan } from '../../features/loan/loan.logic';
import { calculateSalary } from '../../features/salary';
import { calculateInterest } from '../../features/interest/interest.logic';

type BenchmarkKey = 'loan' | 'salary' | 'interest';

type BenchThresholdConfig = {
  iterations: number;
  thresholdsMs: Record<BenchmarkKey, number>;
};

const thresholdPath = resolve(process.cwd(), 'docs/performance/core-tools-thresholds.json');
const reportsDir = resolve(process.cwd(), 'docs/performance/reports');

const cases: Record<BenchmarkKey, () => unknown> = {
  loan: () =>
    calculateLoan({
      principal: 500_000_000,
      annualInterestRatePercent: 23,
      months: 36,
      loanType: 'regular',
      calculationType: 'installment',
    }),
  salary: () =>
    calculateSalary({
      baseSalary: 150_000_000,
      workingDays: 30,
      workExperienceYears: 4,
      overtimeHours: 16,
      nightOvertimeHours: 8,
      holidayOvertimeHours: 4,
      missionDays: 2,
      isMarried: true,
      numberOfChildren: 2,
      hasWorkerCoupon: true,
      hasTransportation: true,
      otherBenefits: 10_000_000,
      otherDeductions: 5_000_000,
      isDevelopmentZone: false,
    }),
  interest: () =>
    calculateInterest({
      principal: 250_000_000,
      annualRatePercent: 20,
      months: 18,
      mode: 'compound',
      timesPerYear: 12,
    }),
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
    const benchmarkKey = key as BenchmarkKey;
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
    `core-tools-bench-gate-${now.toISOString().replace(/[:.]/g, '-')}.json`,
  );
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const failed = results.filter((result) => !result.pass);
  if (failed.length > 0) {
    const details = failed
      .map(
        (entry) => `${entry.benchmark}: avg=${entry.avgMs.toFixed(3)}ms > ${entry.thresholdMs}ms`,
      )
      .join(' | ');
    throw new Error(`Core benchmark gate failed: ${details}`);
  }

  const summary = results
    .map((entry) => `${entry.benchmark}=${entry.avgMs.toFixed(3)}ms<=${entry.thresholdMs}ms`)
    .join(', ');
  process.stdout.write(`core-bench-gate passed (${summary})\n`);
  process.stdout.write(`report: ${reportPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
