// Simple Playwright configuration without global setup
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '__tests__/automation',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['line'],
    ['html', { outputFolder: 'test-reports/playwright-report' }]
  ],
  outputDir: 'test-reports/test-results',
  
  use: {
    baseURL: 'http://localhost:8082',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
