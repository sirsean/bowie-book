import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000, // Increased timeout for slower actions
  webServer: {
    command: 'npm run preview',
    port: 4173,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 1280, height: 720 },
    video: 'retain-on-failure',
    actionTimeout: 10000, // Increased action timeout
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        hasTouch: true, // Enable touch events for touchscreen tests
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        hasTouch: true, // Enable touch events for touchscreen tests
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        hasTouch: true, // Enable touch events for touchscreen tests
      },
      // Skip webkit tests locally on macOS to avoid flakes:
      // Only run on CI environment by skipping when not in CI
      testIgnore: process.env.CI ? [] : ['**/*'],
    },
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 12'],
        hasTouch: true, // Enable touch events for mobile testing
      },
      // Skip mobile tests locally on macOS due to WebKit issues:
      // Only run on CI environment by skipping when not in CI
      testIgnore: process.env.CI ? [] : ['**/*'],
    },
  ],
});
