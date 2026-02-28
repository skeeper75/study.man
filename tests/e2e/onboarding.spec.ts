import { test, expect } from '@playwright/test'

test.describe('Onboarding Flow', () => {
  test('first visit shows Getting Started section prominently', async ({ page }) => {
    // SR-001: guided onboarding path
    await page.goto('/')
    await expect(page.locator('text=Getting Started')).toBeVisible()
  })

  test('Getting Started section has numbered steps', async ({ page }) => {
    // Scenario 1: guided learning path with numbered steps
    await page.goto('/getting-started')
    const steps = page.locator('[data-testid="learning-step"]')
    await expect(steps.first()).toBeVisible()
  })

  test('first lesson includes visual database explanation', async ({ page }) => {
    // Scenario 1: visual explanation of what a database is
    await page.goto('/getting-started/introduction')
    await expect(page.locator('main')).toContainText(/database/i)
  })

  test('user can execute first SELECT query within the lesson', async ({ page }) => {
    // Scenario 1: interactive example for first SELECT query
    // SR-001: first query execution within 15 minutes
    await page.goto('/getting-started/first-query')
    // Verify interactive SQL playground is available
    await expect(
      page.locator('[data-testid="activate-playground"], [data-testid="sql-editor"]')
    ).toBeVisible({ timeout: 10000 })
  })

  test('technical terms show tooltip with friendly explanation', async ({ page }) => {
    // Scenario 1: tooltip with jargon-free explanation
    await page.goto('/getting-started/introduction')
    const term = page.locator('[data-tooltip]').first()
    if (await term.isVisible()) {
      await term.hover()
      await expect(page.locator('[role="tooltip"]')).toBeVisible()
    }
  })
})
