import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('home page has no WCAG 2.1 AA violations', async ({ page }) => {
    // NFR-002: WCAG 2.1 AA compliance
    // Scenario 14: zero critical or serious violations
    await page.goto('/')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('content page has no WCAG 2.1 AA violations', async ({ page }) => {
    await page.goto('/getting-started/introduction')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('supports keyboard-only navigation', async ({ page }) => {
    // Scenario 14: all interactive elements reachable via keyboard
    await page.goto('/')
    // Tab to first focusable element
    await page.keyboard.press('Tab')
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName)
    expect(firstFocused).toBeTruthy()
    expect(firstFocused).not.toBe('BODY')
  })

  test('Ctrl+K opens search and Escape closes it', async ({ page }) => {
    // Scenario 14: keyboard navigation for search
    await page.goto('/')
    await page.keyboard.press('Control+k')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('focus indicators are clearly visible', async ({ page }) => {
    // Scenario 14: focus indicators clearly visible
    await page.goto('/')
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    // Check that focus has a visible outline
    const outline = await focusedElement.evaluate(
      (el) => getComputedStyle(el).outlineStyle
    )
    expect(outline).not.toBe('none')
  })

  test('heading hierarchy is logical', async ({ page }) => {
    // Scenario 14: heading hierarchy h1 -> h2 -> h3
    await page.goto('/getting-started/introduction')
    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      return Array.from(headingElements).map((h) => ({
        level: parseInt(h.tagName[1]),
        text: h.textContent?.trim(),
      }))
    })
    // Verify there is exactly one h1
    const h1s = headings.filter((h) => h.level === 1)
    expect(h1s.length).toBe(1)
    // Verify no heading level skips (e.g., h1 -> h3 without h2)
    for (let i = 1; i < headings.length; i++) {
      expect(headings[i].level).toBeLessThanOrEqual(headings[i - 1].level + 1)
    }
  })

  test('images have descriptive alt text', async ({ page }) => {
    // Scenario 14: all images have descriptive alt text
    await page.goto('/getting-started/introduction')
    const images = page.locator('img')
    const count = await images.count()
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt).toBeTruthy()
      expect(alt!.length).toBeGreaterThan(0)
    }
  })
})
