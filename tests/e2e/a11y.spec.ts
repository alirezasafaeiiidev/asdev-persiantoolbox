import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ colorScheme: 'light', serviceWorkers: 'block' });

function isContextRaceError(message: string): boolean {
  return (
    message.includes('Execution context was destroyed') ||
    message.includes('frame.evaluate: Test ended')
  );
}

async function waitForStableDocument(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  // networkidle is flaky for modern SPA/app router routes; avoid using it as a strict gate.
  await page
    .locator('h1, main, [role="main"]')
    .first()
    .waitFor({ state: 'visible', timeout: 15_000 });
  // Ensure framer-motion entry animations have settled; otherwise axe may sample transient low-contrast states.
  await page.waitForFunction(() => {
    const el = document.querySelector('h1, main, [role="main"]') as HTMLElement | null;
    if (!el) {
      return true;
    }
    let node: HTMLElement | null = el;
    while (node) {
      const opacity = Number.parseFloat(getComputedStyle(node).opacity || '1');
      if (!Number.isFinite(opacity) || opacity < 1) {
        return false;
      }
      node = node.parentElement;
    }
    return true;
  });
  await page.waitForTimeout(600);
}

async function analyzeA11yWithRetry(page: Page, attempts = 5) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await waitForStableDocument(page);
      return await new AxeBuilder({ page }).analyze();
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      const isNavigationRace = isContextRaceError(message);

      if (!isNavigationRace || attempt === attempts) {
        throw error;
      }

      await page.waitForTimeout(500);
    }
  }

  throw lastError;
}

const routes = [
  '/',
  '/loan',
  '/salary',
  '/date-tools',
  '/pdf-tools/merge/merge-pdf',
  '/image-tools',
  '/offline',
];

routes.forEach((route) => {
  test(`a11y serious/critical violations: ${route}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await waitForStableDocument(page);

    const results = await analyzeA11yWithRetry(page);
    const serious = results.violations.filter((v) =>
      ['serious', 'critical'].includes((v.impact ?? '').toLowerCase()),
    );

    expect(serious, `Serious/critical a11y issues on ${route}`).toHaveLength(0);
  });
});
