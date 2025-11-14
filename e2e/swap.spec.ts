/**
 * E2E tests for swap functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Swap Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/swap');
  });

  test('should display swap interface', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /swap/i })).toBeVisible();
    await expect(page.getByPlaceholder(/search.*token/i).first()).toBeVisible();
  });

  test('should show connect wallet button when not connected', async ({ page }) => {
    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    await expect(connectButton).toBeVisible();
  });

  test('should allow entering swap amount', async ({ page }) => {
    const amountInput = page.getByPlaceholder('0.0').first();
    await amountInput.fill('1.5');
    await expect(amountInput).toHaveValue('1.5');
  });

  test('should display swap settings button', async ({ page }) => {
    const settingsButton = page.getByRole('button', { name: /settings/i });
    await expect(settingsButton).toBeVisible();
  });

  test('should open settings modal when clicked', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/slippage tolerance/i)).toBeVisible();
  });
});

