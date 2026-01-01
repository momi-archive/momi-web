import { expect, test } from '@playwright/test'

test.describe('Home Page', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('/')

    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toHaveText('Momi')
  })

  test('should display the description', async ({ page }) => {
    await page.goto('/')

    const description = page.getByText(/your personal archiving service/i)
    await expect(description).toBeVisible()
  })

  test('should have proper layout structure', async ({ page }) => {
    await page.goto('/')

    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })
})
