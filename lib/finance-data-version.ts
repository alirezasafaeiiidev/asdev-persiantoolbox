import salaryLawsData from '@/data/salary-laws/v1.json';

export type FinanceToolId = 'loan' | 'salary' | 'interest';

export type FinanceDataVersion = {
  tool: FinanceToolId;
  label: string;
  version: string;
  updatedAt: string;
  source: string;
  notes: string[];
};

const salaryYears = Object.keys(salaryLawsData.years)
  .map((year) => Number(year))
  .filter((year) => Number.isFinite(year))
  .sort((a, b) => a - b);

const salaryCoverage =
  salaryYears.length > 1
    ? `${salaryYears[0]}-${salaryYears[salaryYears.length - 1]}`
    : `${salaryYears[0] ?? ''}`;

const FINANCE_DATA_VERSIONS: Record<FinanceToolId, FinanceDataVersion> = {
  loan: {
    tool: 'loan',
    label: 'موتور محاسبه وام',
    version: 'loan-formula-v3',
    updatedAt: '2026-02-12',
    source: 'local-formula-engine',
    notes: ['فرمول اقساط مساوی + حالت‌های معکوس', 'پشتیبانی از وام عادی/قرض‌الحسنه/پلکانی'],
  },
  salary: {
    tool: 'salary',
    label: 'قوانین حقوق و دستمزد',
    version: salaryLawsData.version,
    updatedAt: salaryLawsData.updatedAt,
    source: salaryLawsData.source,
    notes: [
      `دامنه داده سال‌ها: ${salaryCoverage}`,
      `منطقه داده: ${salaryLawsData.region}`,
      'نسخه‌گذاری‌شده و قابل رهگیری در مخزن',
    ],
  },
  interest: {
    tool: 'interest',
    label: 'موتور محاسبه سود سپرده',
    version: 'interest-formula-v2',
    updatedAt: '2026-02-12',
    source: 'local-formula-engine',
    notes: ['پوشش سود ساده و مرکب', 'عدم وابستگی به API خارجی در زمان اجرا'],
  },
};

export function getFinanceDataVersion(tool: FinanceToolId): FinanceDataVersion {
  return FINANCE_DATA_VERSIONS[tool];
}
