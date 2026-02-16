import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { toolsRegistry, getCategories, type ToolEntry, type ToolTier } from '@/lib/tools-registry';

type Coverage = {
  e2eSpecs: string[];
};

const DEFAULT_SCENARIOS = [
  'صفحه ابزار بدون خطا لود شود.',
  'ورودی نامعتبر پیام خطای واضح بدهد (بدون کرش).',
  'خروجی قابل کپی/دانلود باشد (در صورت وجود).',
  'روی موبایل و دسکتاپ UI نشکند (RTL/فونت/اسکرول).',
];

const OFFLINE_SCENARIOS = [
  'در حالت offline صفحه ابزار قابل استفاده باشد (بدون درخواست شبکه).',
  'پس از refresh همچنان کار کند و cache مشکلی ایجاد نکند.',
];

function scenariosForTool(tool: ToolEntry): string[] {
  const scenarios = [...DEFAULT_SCENARIOS];
  if (tool.tier === 'Offline-Guaranteed') {
    scenarios.push(...OFFLINE_SCENARIOS);
  }

  if (tool.path.startsWith('/pdf-tools/')) {
    scenarios.push('فایل PDF ورودی معتبر دریافت و خروجی فایل تولید کند.');
  }
  if (tool.path.startsWith('/image-tools')) {
    scenarios.push('فایل تصویر ورودی معتبر دریافت و خروجی فایل تولید کند.');
  }
  if (tool.path === '/loan' || tool.path === '/salary' || tool.path === '/interest') {
    scenarios.push('فرمول محاسبات با چند مثال واقعی تایید شود.');
  }
  if (tool.path.startsWith('/text-tools')) {
    scenarios.push('متن ورودی/خروجی در RTL درست نمایش داده شود.');
  }

  return Array.from(new Set(scenarios));
}

function renderTierBadge(tier: ToolTier): string {
  switch (tier) {
    case 'Offline-Guaranteed':
      return 'Offline-Guaranteed';
    case 'Hybrid':
      return 'Hybrid';
    case 'Online-Required':
      return 'Online-Required';
    default:
      return String(tier);
  }
}

function detectCoverage(tool: ToolEntry): Coverage {
  // Conservative: we only map E2E by known high-level routes today.
  // Deeper per-tool mapping is intentionally manual until a dedicated test registry exists.
  const e2eSpecs: string[] = [];

  const matches: Array<[string, string]> = [
    ['/offline', 'tests/e2e/offline.spec.ts'],
    ['/', 'tests/e2e/home.spec.ts'],
    ['/tools', 'tests/e2e/routes.spec.ts'],
    ['/topics', 'tests/e2e/routes.spec.ts'],
    ['/pdf-tools', 'tests/e2e/routes.spec.ts'],
    ['/image-tools', 'tests/e2e/routes.spec.ts'],
    ['/date-tools', 'tests/e2e/routes.spec.ts'],
    ['/text-tools', 'tests/e2e/routes.spec.ts'],
  ];

  for (const [prefix, spec] of matches) {
    if (
      tool.path === prefix ||
      tool.path.startsWith(`${prefix}/`) ||
      (prefix === '/' && tool.path === '/')
    ) {
      if (!e2eSpecs.includes(spec)) {
        e2eSpecs.push(spec);
      }
    }
  }

  return { e2eSpecs };
}

function toMarkdownList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function toolRow(tool: ToolEntry): string {
  const coverage = detectCoverage(tool);
  const scenarios = scenariosForTool(tool);

  return [
    `### ${tool.title}`,
    '',
    `- مسیر: \`${tool.path}\``,
    `- نوع: \`${tool.kind}\``,
    `- دسته: \`${tool.category?.id ?? 'n/a'}\``,
    `- Tier: \`${renderTierBadge(tool.tier)}\``,
    tool.indexable ? '- Indexable: `true`' : '- Indexable: `false`',
    `- آخرین بروزرسانی: \`${tool.lastModified}\``,
    '',
    '**سناریوهای QA (Manual + Automation Targets)**',
    toMarkdownList(scenarios),
    '',
    '**پوشش تست فعلی**',
    coverage.e2eSpecs.length > 0
      ? toMarkdownList(coverage.e2eSpecs.map((s) => `E2E: \`${s}\``))
      : '- E2E: `none`',
    '',
  ].join('\n');
}

function main() {
  const categories = getCategories();
  const tools = toolsRegistry.filter((tool) => tool.kind === 'tool');
  const hubs = toolsRegistry.filter((tool) => tool.kind === 'hub');

  const header = [
    '# Tools QA Matrix',
    '',
    'این فایل به صورت خودکار از `lib/tools-registry.ts` تولید می‌شود.',
    'برای به روزرسانی: `pnpm qa:matrix:generate`',
    '',
    '## دسته ها',
    ...categories.map((cat) => `- \`${cat.id}\`: ${cat.name}`),
    '',
    '## هاب ها',
    hubs.length > 0 ? hubs.map((hub) => `- \`${hub.path}\`: ${hub.title}`) : ['- none'],
    '',
    '## ابزارها',
    '',
  ].join('\n');

  const body = tools
    .slice()
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((tool) => toolRow(tool))
    .join('\n');

  const outPath = resolve(process.cwd(), 'docs/qa/TOOLS_QA_MATRIX.md');
  writeFileSync(outPath, `${header}${body}`, 'utf8');
  // eslint-disable-next-line no-console
  console.log(`[qa] generated: docs/qa/TOOLS_QA_MATRIX.md (${tools.length} tools)`);
}

main();
