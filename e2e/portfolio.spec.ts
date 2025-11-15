/**
 * E2E tests for portfolio page
 */

import { test, expect } from '@playwright/test';

test.describe('Portfolio', () => {
  test.skip('should require wallet connection', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.locator('text=Connect Wallet')).toBeVisible();
  });

  test.skip('should display portfolio value', async ({ page }) => {
    await page.goto('/portfolio');
    // Would need authenticated state
    await expect(page.locator('[data-testid="portfolio-value"]')).toBeVisible();
  });
});
