/**
 * E2E tests for swap flow
 */

import { test, expect } from '@playwright/test';

test.describe('Swap Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/swap');
  });

  test('should display swap interface', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Swap');
  });

  test('should allow token input', async ({ page }) => {
    const input = page.locator('input[placeholder="0.0"]').first();
    await input.fill('100');
    await expect(input).toHaveValue('100');
  });

  test('should connect wallet button exists', async ({ page }) => {
    const button = page.locator('button:has-text("Connect Wallet")');
    await expect(button).toBeVisible();
  });

  test('should show token selector', async ({ page }) => {
    const button = page.locator('button:has-text("Select Token")').first();
    await expect(button).toBeVisible();
  });
});
