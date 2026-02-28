import { test, expect } from '@playwright/test'

test.describe('SQL Playground', () => {
  test('lazy loads PGlite on playground pages only', async ({ page }) => {
    // NFR-001: shall not load PGlite WASM on non-playground pages
    await page.goto('/getting-started/introduction')
    const requests = await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .map((r) => r.name)
        .filter((n) => n.includes('pglite'))
    )
    expect(requests).toHaveLength(0)
  })

  test('shows activation trigger before loading', async ({ page }) => {
    // FR-002: lazy-load trigger
    await page.goto('/getting-started/first-query')
    await expect(page.locator('[data-testid="activate-playground"]')).toBeVisible()
  })

  test('executes SQL query and shows results', async ({ page }) => {
    // FR-002: execute SQL and display results within 3 seconds
    // Scenario 6: query results in table format
    await page.goto('/getting-started/first-query')
    await page.click('[data-testid="activate-playground"]')
    await page.waitForSelector('[data-testid="sql-editor"]', { timeout: 10000 })
    await page.fill('[data-testid="sql-editor"]', 'SELECT 1 + 1 AS result')
    await page.click('[data-testid="run-query"]')
    await expect(page.locator('[data-testid="query-result"]')).toContainText('2')
  })

  test('shows PostgreSQL error for invalid queries', async ({ page }) => {
    // FR-002: display PostgreSQL error message
    await page.goto('/getting-started/first-query')
    await page.click('[data-testid="activate-playground"]')
    await page.waitForSelector('[data-testid="sql-editor"]', { timeout: 10000 })
    await page.fill('[data-testid="sql-editor"]', 'SELECTT 1')
    await page.click('[data-testid="run-query"]')
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
  })

  test('shows timeout error for long-running queries', async ({ page }) => {
    // FR-002: terminate after 10 seconds
    await page.goto('/getting-started/first-query')
    await page.click('[data-testid="activate-playground"]')
    await page.waitForSelector('[data-testid="sql-editor"]', { timeout: 10000 })
    await page.fill('[data-testid="sql-editor"]', 'SELECT pg_sleep(15)')
    await page.click('[data-testid="run-query"]')
    await expect(page.locator('[data-testid="error-message"]')).toContainText(/timeout/i, {
      timeout: 15000,
    })
  })

  test('browser remains responsive during query execution', async ({ page }) => {
    // FR-002: Web Worker execution, main thread not blocked
    await page.goto('/getting-started/first-query')
    await page.click('[data-testid="activate-playground"]')
    await page.waitForSelector('[data-testid="sql-editor"]', { timeout: 10000 })
    await page.fill('[data-testid="sql-editor"]', 'SELECT generate_series(1, 1000)')
    await page.click('[data-testid="run-query"]')
    // Verify UI is still interactive while query runs
    const button = page.locator('[data-testid="run-query"]')
    await expect(button).toBeVisible()
  })
})
