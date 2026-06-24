import { test, expect } from '@playwright/test';

test('homepage shows the welcome heading', async ({ page }) => {
  await page.goto('/');

  // Web-first assertion auto-waits for the SPA to render the heading.
  await expect(page.locator('h1')).toContainText('Benvenuto');
});
