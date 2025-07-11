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
  ],
});
