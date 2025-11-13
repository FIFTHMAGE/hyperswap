import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should display the landing page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h2')).toContainText('Your Year')
  })

  test('should have connect wallet button', async ({ page }) => {
    await page.goto('/')
    const connectButton = page.getByRole('button', { name: /connect/i })
    await expect(connectButton).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('h2')).toBeVisible()
  })
})

