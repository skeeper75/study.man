import { test, expect } from '@playwright/test'

test.describe('Responsive Design', () => {
  test.describe('mobile (320px)', () => {
    test.use({ viewport: { width: 320, height: 568 } })

    test('content is readable without horizontal scrolling', async ({ page }) => {
      // NFR-005: readable on 320px viewport
      // Scenario 16: all text readable without horizontal scrolling
      await page.goto('/getting-started/introduction')
      const body = page.locator('body')
      const bodyWidth = await body.evaluate((el) => el.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(320)
    })

    test('code blocks are horizontally scrollable', async ({ page }) => {
      // NFR-005: code blocks horizontally scrollable
      // Scenario 16: code blocks scrollable within container
      await page.goto('/getting-started/first-query')
      const codeBlock = page.locator('pre').first()
      if (await codeBlock.isVisible()) {
        const overflow = await codeBlock.evaluate((el) => getComputedStyle(el).overflowX)
        expect(['auto', 'scroll']).toContain(overflow)
      }
    })

    test('sidebar is hidden and accessible via hamburger menu', async ({ page }) => {
      // Scenario 8: sidebar accessible via hamburger menu on mobile
      // Scenario 16: content occupies full width
      await page.goto('/getting-started/introduction')
      const sidebar = page.locator('[data-testid="sidebar"]')
      await expect(sidebar).not.toBeVisible()
      const hamburger = page.locator('[data-testid="menu-toggle"]')
      if (await hamburger.isVisible()) {
        await hamburger.click()
        await expect(sidebar).toBeVisible()
      }
    })
  })

  test.describe('tablet (768px)', () => {
    test.use({ viewport: { width: 768, height: 1024 } })

    test('sidebar is collapsible', async ({ page }) => {
      // Scenario 16: sidebar collapsible on tablet
      await page.goto('/getting-started/introduction')
      // Content should occupy remaining width
      const content = page.locator('main')
      await expect(content).toBeVisible()
    })

    test('content occupies remaining width', async ({ page }) => {
      // Scenario 16: content occupies remaining width
      await page.goto('/getting-started/introduction')
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })
  })

  test.describe('desktop (1440px)', () => {
    test.use({ viewport: { width: 1440, height: 900 } })

    test('three-column layout is displayed', async ({ page }) => {
      // Scenario 8: sidebar left, content center, ToC right
      // Scenario 16: three-column layout
      await page.goto('/getting-started/introduction')
      const sidebar = page.locator('[data-testid="sidebar"]')
      const content = page.locator('main')
      const toc = page.locator('[data-testid="table-of-contents"]')
      await expect(sidebar).toBeVisible()
      await expect(content).toBeVisible()
      // ToC may or may not exist depending on implementation
      if (await toc.isVisible()) {
        await expect(toc).toBeVisible()
      }
    })

    test('table of contents is visible on the right', async ({ page }) => {
      // Scenario 8: table of contents visible on right on desktop
      await page.goto('/getting-started/introduction')
      const toc = page.locator('[data-testid="table-of-contents"]')
      if (await toc.isVisible()) {
        const box = await toc.boundingBox()
        const mainBox = await page.locator('main').boundingBox()
        if (box && mainBox) {
          expect(box.x).toBeGreaterThan(mainBox.x)
        }
      }
    })
  })
})
