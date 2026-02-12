/* eslint-disable no-console */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Violation = {
  file: string;
  line: number;
  rule: string;
  value: string;
};

const ROOT = process.cwd();
const RUNTIME_ROOTS = ['app', 'components', 'features', 'lib', 'shared'] as const;
const RUNTIME_FILES = ['proxy.ts', 'next.config.mjs', 'public/sw.js'] as const;
const ALLOWED_HOSTS = new Set([
  'persiantoolbox.ir',
  'www.persiantoolbox.ir',
  'staging.persiantoolbox.ir',
  'localhost',
  '127.0.0.1',
]);

const FETCH_ABSOLUTE_URL = /\b(?:fetch|sendBeacon)\s*\(\s*(['"`])(https?:\/\/[^'"`]+)\1/g;
const REQUEST_ABSOLUTE_URL = /\bnew\s+Request\s*\(\s*(['"`])(https?:\/\/[^'"`]+)\1/g;
const WEBSOCKET_OR_EVENTSOURCE_ABSOLUTE_URL =
  /\bnew\s+(?:WebSocket|EventSource)\s*\(\s*(['"`])((?:wss?|https?):\/\/[^'"`]+)\1/g;
const XHR_ABSOLUTE_URL =
  /\b\.open\s*\(\s*(['"`])(?:GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\1\s*,\s*(['"`])(https?:\/\/[^'"`]+)\2/g;
const SCRIPT_SRC_EXTERNAL = /<(?:Script|script)\b[^>]*\bsrc\s*=\s*(['"`])(https?:\/\/[^'"`]+)\1/g;
const IMPORT_EXTERNAL = /\b(?:import|export)\b[\s\S]*?\bfrom\s*(['"`])(https?:\/\/[^'"`]+)\1/g;
const DYNAMIC_IMPORT_EXTERNAL = /\bimport\s*\(\s*(['"`])(https?:\/\/[^'"`]+)\1\s*\)/g;
type ScanOptions = {
  runtimeRoots?: readonly string[];
  runtimeFiles?: readonly string[];
};

function isAllowedUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return ALLOWED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function lineAt(text: string, index: number): number {
  return text.slice(0, index).split('\n').length;
}

function scanByPattern(
  file: string,
  text: string,
  rule: string,
  pattern: RegExp,
  urlGroupIndex: number,
): Violation[] {
  const violations: Violation[] = [];
  for (const match of text.matchAll(pattern)) {
    const url = match[urlGroupIndex];
    if (!url || isAllowedUrl(url)) {
      continue;
    }
    violations.push({
      file,
      line: lineAt(text, match.index ?? 0),
      rule,
      value: url,
    });
  }
  return violations;
}

function listFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }
  const entries = readdirSync(root);
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(root, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...listFiles(full));
      continue;
    }
    if (!/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) {
      continue;
    }
    files.push(full);
  }
  return files;
}

export function scanLocalFirstViolations(cwd = ROOT, options: ScanOptions = {}): Violation[] {
  const runtimeRoots = options.runtimeRoots ?? RUNTIME_ROOTS;
  const runtimeFiles = options.runtimeFiles ?? RUNTIME_FILES;
  const files = [
    ...runtimeRoots.flatMap((segment) => listFiles(path.join(cwd, segment))),
    ...runtimeFiles
      .map((segment) => path.join(cwd, segment))
      .filter((segment) => existsSync(segment)),
  ];

  const violations: Violation[] = [];

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const relative = path.relative(cwd, file);
    violations.push(
      ...scanByPattern(relative, text, 'fetch_off_origin', FETCH_ABSOLUTE_URL, 2),
      ...scanByPattern(relative, text, 'request_off_origin', REQUEST_ABSOLUTE_URL, 2),
      ...scanByPattern(
        relative,
        text,
        'websocket_or_eventsource_off_origin',
        WEBSOCKET_OR_EVENTSOURCE_ABSOLUTE_URL,
        2,
      ),
      ...scanByPattern(relative, text, 'xhr_off_origin', XHR_ABSOLUTE_URL, 3),
      ...scanByPattern(relative, text, 'script_external_src', SCRIPT_SRC_EXTERNAL, 2),
      ...scanByPattern(relative, text, 'import_external', IMPORT_EXTERNAL, 2),
      ...scanByPattern(relative, text, 'dynamic_import_external', DYNAMIC_IMPORT_EXTERNAL, 2),
    );
  }

  return violations;
}

function main() {
  const violations = scanLocalFirstViolations();
  if (violations.length === 0) {
    console.log('[local-first] OK: no off-origin runtime dependency found');
    return;
  }

  console.error('[local-first] FAILED: runtime off-origin dependency detected');
  for (const issue of violations) {
    console.error(`- ${issue.file}:${issue.line} [${issue.rule}] ${issue.value}`);
  }
  process.exitCode = 1;
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (entryPath === fileURLToPath(import.meta.url)) {
  main();
}
