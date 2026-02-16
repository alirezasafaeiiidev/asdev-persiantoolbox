import { spawnSync } from 'node:child_process';

const allowedLevels = ['low', 'moderate', 'high', 'critical'];

function getThreshold() {
  const raw = String(process.env['AUDIT_LEVEL'] ?? 'high').toLowerCase();
  return allowedLevels.includes(raw) ? raw : 'high';
}

function levelRank(level) {
  const idx = allowedLevels.indexOf(level);
  return idx >= 0 ? idx : -1;
}

function runPnpmAudit(mode) {
  const args = ['audit', '--json'];
  if (mode === 'prod') {
    args.push('--prod');
  } else if (mode === 'dev') {
    args.push('--dev');
  }

  const result = spawnSync('pnpm', args, { encoding: 'utf8' });
  // pnpm may return non-zero even when JSON is produced; prefer parsing stdout.
  const raw = (result.stdout || '').trim();
  if (!raw) {
    return { ok: true, data: null, raw: '' };
  }

  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end < 0 || end <= start) {
    return { ok: false, error: `Unexpected pnpm audit output for ${mode}.` };
  }

  try {
    const parsed = JSON.parse(raw.slice(start, end + 1));
    return { ok: true, data: parsed, raw: raw.slice(start, end + 1) };
  } catch (error) {
    return {
      ok: false,
      error: `Failed to parse pnpm audit JSON for ${mode}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

function summarizeAdvisories(auditJson) {
  const advisories = auditJson?.advisories && typeof auditJson.advisories === 'object'
    ? Object.values(auditJson.advisories)
    : [];

  const counts = { low: 0, moderate: 0, high: 0, critical: 0, unknown: 0 };
  const blocking = [];

  for (const item of advisories) {
    const severityRaw = item?.severity ? String(item.severity).toLowerCase() : 'unknown';
    const severity = allowedLevels.includes(severityRaw) ? severityRaw : 'unknown';

    if (severity === 'unknown') {
      counts.unknown += 1;
    } else {
      counts[severity] += 1;
    }

    blocking.push({
      module: item?.module_name ?? 'unknown',
      title: item?.title ?? 'unknown',
      severity,
      url: item?.url ?? null,
    });
  }

  return { counts, advisories: blocking };
}

function main() {
  const threshold = getThreshold();
  const thresholdRank = levelRank(threshold);

  const prod = runPnpmAudit('prod');
  const dev = runPnpmAudit('dev');

  if (!prod.ok) {
    console.error(`[security] ${prod.error}`);
    process.exit(1);
  }
  if (!dev.ok) {
    console.error(`[security] ${dev.error}`);
    process.exit(1);
  }

  const prodSummary = prod.data ? summarizeAdvisories(prod.data) : null;
  const devSummary = dev.data ? summarizeAdvisories(dev.data) : null;

  const merged = { low: 0, moderate: 0, high: 0, critical: 0, unknown: 0 };
  for (const summary of [prodSummary, devSummary]) {
    if (!summary) {
      continue;
    }
    for (const key of Object.keys(merged)) {
      merged[key] += summary.counts[key];
    }
  }

  console.log(
    `[security] pnpm audit summary (threshold=${threshold}): low=${merged.low}, moderate=${merged.moderate}, high=${merged.high}, critical=${merged.critical}, unknown=${merged.unknown}`,
  );

  const blocking = [];
  for (const summary of [prodSummary, devSummary]) {
    if (!summary) {
      continue;
    }
    for (const adv of summary.advisories) {
      const rank = levelRank(adv.severity);
      if (rank >= thresholdRank) {
        blocking.push(adv);
      }
    }
  }

  if (blocking.length > 0) {
    console.error(`[security] Blocking vulnerabilities detected (>=${threshold}):`);
    for (const adv of blocking.slice(0, 20)) {
      console.error(`- [${adv.severity}] ${adv.module}: ${adv.title}${adv.url ? ` (${adv.url})` : ''}`);
    }
    if (blocking.length > 20) {
      console.error(`- ... and ${blocking.length - 20} more`);
    }
    process.exit(1);
  }
}

main();

