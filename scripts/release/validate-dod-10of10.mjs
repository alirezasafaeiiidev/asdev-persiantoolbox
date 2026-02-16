import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

function fail(message) {
  console.error(`[release:dod] ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

const contractPath = resolve(process.cwd(), 'docs/release/release-dod-10of10.json');
assert(existsSync(contractPath), 'Missing DoD contract: docs/release/release-dod-10of10.json');

let contract;
try {
  contract = JSON.parse(readFileSync(contractPath, 'utf8'));
} catch (error) {
  fail(`Invalid JSON in release-dod-10of10.json: ${error instanceof Error ? error.message : String(error)}`);
}

assert(contract && typeof contract === 'object' && !Array.isArray(contract), 'DoD contract must be an object.');
assert(contract.version === 1, 'DoD contract version must be 1.');
assert(isNonEmptyString(contract.name), 'DoD contract must include a non-empty name.');
assert(isNonEmptyString(contract.description), 'DoD contract must include a non-empty description.');

const requiredDocs = Array.isArray(contract.requiredDocs) ? contract.requiredDocs : [];
const requiredWorkflows = Array.isArray(contract.requiredWorkflows) ? contract.requiredWorkflows : [];
const axes = Array.isArray(contract.axes) ? contract.axes : null;

assert(axes && axes.length > 0, 'DoD contract must include a non-empty axes array.');

for (const docPath of requiredDocs) {
  assert(isNonEmptyString(docPath), 'requiredDocs must be an array of strings.');
  assert(existsSync(resolve(process.cwd(), docPath)), `Missing required doc: ${docPath}`);
}

for (const wfPath of requiredWorkflows) {
  assert(isNonEmptyString(wfPath), 'requiredWorkflows must be an array of strings.');
  assert(existsSync(resolve(process.cwd(), wfPath)), `Missing required workflow: ${wfPath}`);
}

const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));
const scripts = pkg?.scripts && typeof pkg.scripts === 'object' ? pkg.scripts : {};

const allowedTiers = new Set(['core', 'extended']);
const seenAxisIds = new Set();
const seenCheckIds = new Set();

function ensureCommandIsRunnable(command) {
  assert(isNonEmptyString(command), 'Each check.command must be a non-empty string.');
  const trimmed = command.trim();
  assert(
    trimmed.startsWith('pnpm ') || trimmed.startsWith('node ') || trimmed.startsWith('tsx '),
    `Unsupported command format in DoD (use pnpm/node/tsx): "${trimmed}"`,
  );

  if (trimmed.startsWith('pnpm ')) {
    const sub = trimmed.slice('pnpm '.length).trim();
    const scriptName = sub.split(/\s+/)[0];

    // Only enforce local scripts for stable governance; ignore pnpm exec/dlx patterns.
    if (scriptName && !['exec', 'dlx', 'install'].includes(scriptName)) {
      assert(
        Object.prototype.hasOwnProperty.call(scripts, scriptName),
        `DoD references missing package.json script: "${scriptName}" (from "${trimmed}")`,
      );
    }
  }
}

for (const axis of axes) {
  assert(axis && typeof axis === 'object' && !Array.isArray(axis), 'Each axis must be an object.');
  assert(isNonEmptyString(axis.id), 'Each axis must have a non-empty id.');
  assert(!seenAxisIds.has(axis.id), `Duplicate axis id: ${axis.id}`);
  seenAxisIds.add(axis.id);

  assert(isNonEmptyString(axis.title), `Axis "${axis.id}" must have a non-empty title.`);
  assert(allowedTiers.has(axis.tier), `Axis "${axis.id}" must have tier "core" or "extended".`);
  assert(typeof axis.blocking === 'boolean', `Axis "${axis.id}" must have boolean blocking.`);

  const checks = Array.isArray(axis.checks) ? axis.checks : null;
  assert(checks && checks.length > 0, `Axis "${axis.id}" must include non-empty checks array.`);

  for (const check of checks) {
    assert(check && typeof check === 'object' && !Array.isArray(check), `Axis "${axis.id}" check must be an object.`);
    assert(isNonEmptyString(check.id), `Axis "${axis.id}" check must include non-empty id.`);
    assert(!seenCheckIds.has(check.id), `Duplicate check id: ${check.id}`);
    seenCheckIds.add(check.id);
    ensureCommandIsRunnable(check.command);
  }
}

console.log('[release:dod] OK: release DoD 10/10 contract is valid.');

