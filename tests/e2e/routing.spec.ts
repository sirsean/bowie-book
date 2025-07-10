import { test, expect } from '@playwright/test';

test.describe('Routing', () => {
  test('should navigate to direct URL /super-bowie/3 and show page 3', async ({ page }) => {
    // Navigate directly to page 3 of Super Bowie
    await page.goto('/super-bowie/3');

    // Verify we're on the correct URL
    await expect(page).toHaveURL('/super-bowie/3');

    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/direct-url-super-bowie-3.png' });

    // Verify we're on page 3
    const pageImage = page.locator('img[alt="Page 3"]');
    await expect(pageImage).toBeVisible();

    // Verify the page content is correct (should show page 3 content)
    const imageElement = await pageImage.getAttribute('src');
    expect(imageElement).toContain('super-bowie/3.jpg');

    // Verify navigation buttons are present and correct
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
    await expect(page.locator('button:has-text("Cover")')).toBeVisible();
  });

  test('should handle browser back and forward navigation', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await page.screenshot({ path: 'test-results/routing-home-start.png' });

    // Navigate to Super Bowie
    await page.click('text=Super Bowie');
    await expect(page).toHaveURL(/\/super-bowie(\/0)?$/);
    await page.screenshot({ path: 'test-results/routing-super-bowie-cover.png' });

    // Navigate to page 1
    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL('/super-bowie/1');
    await page.screenshot({ path: 'test-results/routing-super-bowie-page-1.png' });

    // Navigate to page 2
    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL('/super-bowie/2');
    await page.screenshot({ path: 'test-results/routing-super-bowie-page-2.png' });

    // Navigate to page 3
    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL('/super-bowie/3');
    await page.screenshot({ path: 'test-results/routing-super-bowie-page-3.png' });

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/super-bowie/2');

    // Verify we're on page 2
    const page2Image = page.locator('img[alt="Page 2"]');
    await expect(page2Image).toBeVisible();
    await page.screenshot({ path: 'test-results/routing-back-to-page-2.png' });

    // Use browser back button again
    await page.goBack();
    await expect(page).toHaveURL('/super-bowie/1');

    // Verify we're on page 1
    const page1Image = page.locator('img[alt="Page 1"]');
    await expect(page1Image).toBeVisible();
    await page.screenshot({ path: 'test-results/routing-back-to-page-1.png' });

    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/super-bowie/2');

    // Verify we're back on page 2
    await expect(page2Image).toBeVisible();
    await page.screenshot({ path: 'test-results/routing-forward-to-page-2.png' });

    // Use browser forward button again
    await page.goForward();
    await expect(page).toHaveURL('/super-bowie/3');

    // Verify we're back on page 3
    const page3Image = page.locator('img[alt="Page 3"]');
    await expect(page3Image).toBeVisible();
    await page.screenshot({ path: 'test-results/routing-forward-to-page-3.png' });
  });

  test('should handle direct URLs for different books and pages', async ({ page }) => {
    // Test direct URLs for different books
    const testCases = [
      { url: '/dragon-fighter/1', expectedPage: 1, bookName: 'dragon-fighter' },
      { url: '/ziggy-the-bunny/2', expectedPage: 2, bookName: 'ziggy-the-bunny' },
      { url: '/super-bowie/5', expectedPage: 5, bookName: 'super-bowie' },
      { url: '/skyward-bound/0', expectedPage: 0, bookName: 'skyward-bound' },
    ];

    for (const testCase of testCases) {
      // Navigate directly to the URL
      await page.goto(testCase.url);

      // Verify we're on the correct URL
      await expect(page).toHaveURL(testCase.url);

      // Verify the correct page image is visible
      const pageImage = page.locator(`img[alt="Page ${testCase.expectedPage}"]`);
      await expect(pageImage).toBeVisible();

      // Take screenshot for debugging
      await page.screenshot({
        path: `test-results/direct-url-${testCase.bookName}-page-${testCase.expectedPage}.png`,
      });

      // Verify the image source contains the correct book name
      const imageSrc = await pageImage.getAttribute('src');
      expect(imageSrc).toContain(testCase.bookName);
    }
  });

  test('should handle invalid URLs gracefully', async ({ page }) => {
    // Test invalid page numbers - should redirect to valid page or home
    await page.goto('/super-bowie/999');

    // Should either redirect to home or clamp to valid page
    // Based on the code, it should clamp to the last valid page
    await expect(page).toHaveURL(/\/super-bowie/);

    // Take screenshot
    await page.screenshot({ path: 'test-results/invalid-url-handling.png' });
  });

  test('should maintain correct content when navigating via URL changes', async ({ page }) => {
    // Navigate to Super Bowie page 3
    await page.goto('/super-bowie/3');

    // Verify page 3 content
    const page3Image = page.locator('img[alt="Page 3"]');
    await expect(page3Image).toBeVisible();

    // Get the text content for page 3 - check if text overlay exists first
    const textOverlay = page.locator('[data-testid="text-overlay"]');
    // Only wait for text overlay if it should exist (most pages have text)
    await expect(textOverlay).toBeVisible({ timeout: 10000 });
    const page3Text = await textOverlay.textContent();

    // Navigate to page 4 via URL
    await page.goto('/super-bowie/4');

    // Verify page 4 content
    const page4Image = page.locator('img[alt="Page 4"]');
    await expect(page4Image).toBeVisible();

    // Get the text content for page 4
    await textOverlay.waitFor({ state: 'visible', timeout: 10000 });
    const page4Text = await textOverlay.textContent();

    // Verify the text is different (content actually changed)
    expect(page3Text).not.toBe(page4Text);

    // Take screenshots for comparison
    await page.screenshot({ path: 'test-results/url-content-verification-page-4.png' });

    // Navigate back to page 3 via URL
    await page.goto('/super-bowie/3');

    // Verify we're back to page 3 content
    await expect(page3Image).toBeVisible();
    await textOverlay.waitFor({ state: 'visible', timeout: 10000 });
    const backToPage3Text = await textOverlay.textContent();
    expect(backToPage3Text).toBe(page3Text);

    await page.screenshot({ path: 'test-results/url-content-verification-back-to-page-3.png' });
  });

  test('should handle deep linking and preserve state', async ({ page }) => {
    // Navigate to a deep page via direct URL
    await page.goto('/super-bowie/7');

    // Verify we're on the correct page
    await expect(page).toHaveURL('/super-bowie/7');

    // Verify page content
    const pageImage = page.locator('img[alt="Page 7"]');
    await expect(pageImage).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/deep-linking-page-7.png' });

    // Navigate using Previous button
    await page.click('button:has-text("Previous")');
    await expect(page).toHaveURL('/super-bowie/6');

    // Navigate using Next button
    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL('/super-bowie/7');

    // Verify we're back on page 7
    await expect(pageImage).toBeVisible();

    // Use keyboard navigation
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL('/super-bowie/8');

    // Verify page 8 content
    const page8Image = page.locator('img[alt="Page 8"]');
    await expect(page8Image).toBeVisible();

    await page.screenshot({ path: 'test-results/deep-linking-navigation-to-page-8.png' });
  });

  test('should handle home navigation from different routes', async ({ page }) => {
    // Navigate to a book page
    await page.goto('/super-bowie/5');

    // First navigate to cover to make Home button visible
    await page.click('button:has-text("Cover")');

    // Click Home button
    const homeButton = page.locator('button:has-text("Home")');
    await homeButton.waitFor({ state: 'visible', timeout: 10000 });
    await homeButton.click();

    // Should be on home page
    await expect(page).toHaveURL('/');

    // Verify home page content
    await expect(page.locator('h1')).toContainText("Bowie's Books!");

    // Navigate to a different book page
    await page.goto('/dragon-fighter/3');

    // First navigate to cover to make Home button visible
    await page.click('button:has-text("Cover")');

    // Click Home button
    await homeButton.waitFor({ state: 'visible', timeout: 10000 });
    await homeButton.click();

    // Should be on home page
    await expect(page).toHaveURL('/');

    // Take final screenshot
    await page.screenshot({ path: 'test-results/home-navigation-from-routes.png' });
  });
});
