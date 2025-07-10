import { test, expect } from '@playwright/test';

test.describe('Book Navigation', () => {
  test('should navigate through book pages using buttons', async ({ page }) => {
    // Start at home page
    await page.goto('/');

    // Click on Super Bowie book
    await page.click('text=Super Bowie');

    // Should be on the cover page (accept both /super-bowie and /super-bowie/0)
    await expect(page).toHaveURL(/\/super-bowie(\/0)?$/);

    // Take screenshot of cover
    await page.screenshot({ path: 'test-results/super-bowie-cover.png' });

    // Verify we're on the cover page
    const coverImage = page.locator('img[alt="Page 0"]');
    await expect(coverImage).toBeVisible();

    // Navigate through all pages using Next button
    let currentPage = 0;
    const totalPages = 12; // Super Bowie has 12 pages (0-11)

    while (currentPage < totalPages - 1) {
      // Click Next button
      await page.click('button:has-text("Next")');
      currentPage++;

      // Verify we're on the correct page
      await expect(page).toHaveURL(new RegExp(`/super-bowie/${currentPage}`));

      // Verify page image is visible
      const pageImage = page.locator(`img[alt="Page ${currentPage}"]`);
      await expect(pageImage).toBeVisible();

      // Take screenshot of each page
      await page.screenshot({ path: `test-results/super-bowie-page-${currentPage}.png` });
    }

    // On the last page, Next button should say "Finish"
    await expect(page.locator('button:has-text("Finish")')).toBeVisible();

    // Navigate back through pages using Previous button
    while (currentPage > 0) {
      await page.click('button:has-text("Previous")');
      currentPage--;

      // Verify we're on the correct page
      await expect(page).toHaveURL(new RegExp(`/super-bowie/${currentPage}`));

      // Verify page image is visible
      const pageImage = page.locator(`img[alt="Page ${currentPage}"]`);
      await expect(pageImage).toBeVisible();
    }

    // On the first page, Previous button should say "Home"
    const homeButton = page.locator('button:has-text("Home")');
    await expect(homeButton).toBeVisible();

    // Click Home button to return to home page
    await homeButton.click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate through book pages using keyboard', async ({ page }) => {
    // Navigate directly to Super Bowie
    await page.goto('/super-bowie');

    // Take initial screenshot
    await page.screenshot({ path: 'test-results/keyboard-nav-start.png' });

    // Navigate forward through pages using Arrow Right
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');

      // Verify we've moved to the next page
      await expect(page).toHaveURL(new RegExp(`/super-bowie/${i + 1}`));

      // Verify page image is visible
      const pageImage = page.locator(`img[alt="Page ${i + 1}"]`);
      await expect(pageImage).toBeVisible();

      // Take screenshot
      await page.screenshot({ path: `test-results/keyboard-nav-page-${i + 1}.png` });
    }

    // Navigate backward using Arrow Left
    for (let i = 2; i >= 0; i--) {
      await page.keyboard.press('ArrowLeft');

      // Verify we've moved to the previous page
      await expect(page).toHaveURL(new RegExp(`/super-bowie/${i}`));

      // Verify page image is visible
      const pageImage = page.locator(`img[alt="Page ${i}"]`);
      await expect(pageImage).toBeVisible();
    }

    // Should be back at the cover (accept both /super-bowie and /super-bowie/0)
    await expect(page).toHaveURL(/\/super-bowie(\/0)?$/);
  });

  test('should navigate through book pages using mobile swipe', async ({ page }) => {
    // Navigate to Super Bowie
    await page.goto('/super-bowie');

    // Get the touch overlay elements - variables will be used for touch simulation

    // Take initial screenshot
    await page.screenshot({ path: 'test-results/mobile-swipe-start.png' });

    // Simulate swipe forward (tap right side) for 3 pages
    for (let i = 0; i < 3; i++) {
      // Use touchscreen.tap on the right side of the screen to simulate swipe
      await page.touchscreen.tap(1000, 400); // Right side tap

      // Verify we've moved to the next page
      await expect(page).toHaveURL(new RegExp(`/super-bowie/${i + 1}`));

      // Verify page image is visible
      const pageImage = page.locator(`img[alt="Page ${i + 1}"]`);
      await expect(pageImage).toBeVisible();

      // Take screenshot
      await page.screenshot({ path: `test-results/mobile-swipe-page-${i + 1}.png` });
    }

    // Simulate swipe backward (tap left side) for 3 pages
    for (let i = 2; i >= 0; i--) {
      // Use touchscreen.tap on the left side of the screen to simulate swipe
      await page.touchscreen.tap(280, 400); // Left side tap

      // Verify we've moved to the previous page
      await expect(page).toHaveURL(new RegExp(`/super-bowie/${i}`));

      // Verify page image is visible
      const pageImage = page.locator(`img[alt="Page ${i}"]`);
      await expect(pageImage).toBeVisible();
    }

    // Should be back at the cover (accept both /super-bowie and /super-bowie/0)
    await expect(page).toHaveURL(/\/super-bowie(\/0)?$/);
  });

  test('should test Cover button navigation', async ({ page }) => {
    // Navigate to a middle page
    await page.goto('/super-bowie/5');

    // Verify we're on page 5
    await expect(page).toHaveURL(/\/super-bowie\/5$/);

    // Click Cover button (only visible when not on cover)
    await page.click('button:has-text("Cover")');

    // Should be back at the cover (accept both /super-bowie and /super-bowie/0)
    await expect(page).toHaveURL(/\/super-bowie(\/0)?$/);

    // Take screenshot
    await page.screenshot({ path: 'test-results/cover-button-navigation.png' });
  });

  test('should handle different books', async ({ page }) => {
    // Test with a different book - Dragon Fighter
    await page.goto('/');
    await page.click('text=Dragon Fighter');

    // Should navigate to Dragon Fighter (accept both /dragon-fighter and /dragon-fighter/0)
    await expect(page).toHaveURL(/\/dragon-fighter(\/0)?$/);

    // Navigate through a few pages
    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL(/\/dragon-fighter\/1$/);

    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/\/dragon-fighter\/2$/);

    // Take screenshot
    await page.screenshot({ path: 'test-results/dragon-fighter-navigation.png' });

    // Return to cover
    const coverButton = page.locator('button:has-text("Cover")');
    await coverButton.waitFor({ state: 'visible', timeout: 10000 });
    await coverButton.click();

    // Return home - add wait for button visibility
    const homeButton = page.locator('button:has-text("Home")');
    await homeButton.waitFor({ state: 'visible', timeout: 10000 });
    await homeButton.click();
    await expect(page).toHaveURL('/');
  });
});
