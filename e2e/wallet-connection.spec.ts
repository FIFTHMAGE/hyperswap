/**
 * E2E tests for wallet connection
 */

import { test, expect } from '@playwright/test';

test.describe('Wallet Connection', () => {
  test('should show connect wallet button', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('button:has-text("Connect Wallet")');
    await expect(button).toBeVisible();
  });

  test('should open wallet modal on click', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Connect Wallet")');
    // Modal assertions would go here
  });
});
