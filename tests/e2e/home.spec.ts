import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page and display 6 book covers with correct titles', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/home-page.png' });

    // Verify the page title
    await expect(page.locator('h1')).toContainText("Bowie's Books!");

    // Wait for images to load
    await page.waitForLoadState('networkidle');

    // Define expected book titles
    const expectedBooks = [
      'Bonne Adventure',
      'Dragon Fighter',
      'Skyward Bound',
      'Ziggy the Bunny',
      'Super Bowie',
      'Superkitty Saves Bunnytown',
    ];

    // Check that we have exactly 6 book covers
    const bookCovers = page.locator('[alt*="Cover"]');
    await expect(bookCovers).toHaveCount(6);

    // Verify each book title is visible
    for (const title of expectedBooks) {
      const bookTitle = page.locator('text=' + title);
      await expect(bookTitle).toBeVisible();
    }

    // Verify each book cover image is visible and loaded
    for (let i = 0; i < expectedBooks.length; i++) {
      const bookCover = bookCovers.nth(i);
      await expect(bookCover).toBeVisible();

      // Check that image has loaded (not broken)
      const src = await bookCover.getAttribute('src');
      expect(src).toBeTruthy();
    }

    // Verify clicking on each book cover navigates to the correct book
    for (let i = 0; i < expectedBooks.length; i++) {
      const bookLink = page.locator('a').nth(i);
      const href = await bookLink.getAttribute('href');
      expect(href).toBeTruthy();

      // Book links should start with /book-id format
      expect(href).toMatch(/^\/[a-z-]+$/);
    }

    // Take final screenshot
    await page.screenshot({ path: 'test-results/home-page-final.png' });
  });

  test('should have accessible book covers', async ({ page }) => {
    await page.goto('/');

    // Check that all images have proper alt text
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt).toContain('Cover');
    }
  });
});
