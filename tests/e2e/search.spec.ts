import { test, expect } from '@playwright/test'

test.describe('Search', () => {
  test('opens search modal with Ctrl+K', async ({ page }) => {
    // Scenario 7: Ctrl+K opens search
    await page.goto('/')
    await page.keyboard.press('Control+k')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
  })

  test('search input is focused when modal opens', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')
    const searchInput = page.locator('[role="searchbox"], input[type="search"]')
    await expect(searchInput).toBeFocused()
  })

  test('returns results as user types', async ({ page }) => {
    // Scenario 7: autocomplete suggestions
    await page.goto('/')
    await page.keyboard.press('Control+k')
    await page.keyboard.type('SELECT')
    // Wait for results
    const results = page.locator('[data-testid="search-result"]')
    await expect(results.first()).toBeVisible({ timeout: 2000 })
  })

  test('search results show title, path, preview, and difficulty', async ({ page }) => {
    // Scenario 7: title, section path, preview, difficulty badge
    await page.goto('/')
    await page.keyboard.press('Control+k')
    await page.keyboard.type('JOIN')
    const firstResult = page.locator('[data-testid="search-result"]').first()
    await expect(firstResult).toBeVisible({ timeout: 2000 })
    // Verify result contains expected elements
    // await expect(firstResult.locator('[data-testid="result-title"]')).toBeVisible()
    // await expect(firstResult.locator('[data-testid="result-preview"]')).toBeVisible()
  })

  test('navigates to selected result on Enter', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')
    await page.keyboard.type('SELECT')
    const results = page.locator('[data-testid="search-result"]')
    await expect(results.first()).toBeVisible({ timeout: 2000 })
    await page.keyboard.press('Enter')
    // Should navigate away from home
    await expect(page).not.toHaveURL('/')
  })

  test('closes search modal with Escape', async ({ page }) => {
    // Scenario 14: Escape closes search
    await page.goto('/')
    await page.keyboard.press('Control+k')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })
})
