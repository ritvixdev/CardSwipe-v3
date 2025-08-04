/**
 * Playwright Configuration for Automated Testing
 * Comprehensive cross-browser testing setup
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Test directory
  testDir: './__tests__/automation',
  
  // Global test timeout
  timeout: 30 * 1000, // 30 seconds per test
  
  // Expect timeout for assertions
  expect: {
    timeout: 5000
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'test-reports/playwright-report' }],
    ['json', { outputFile: 'test-reports/playwright-results.json' }],
    ['junit', { outputFile: 'test-reports/playwright-junit.xml' }],
    ['list']
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:8081',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Emulate user preferences
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Tablet testing
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Global setup and teardown
  globalSetup: require.resolve('./__tests__/automation/global-setup.js'),
  globalTeardown: require.resolve('./__tests__/automation/global-teardown.js'),

  // Web server configuration
  webServer: {
    command: 'npm start',
    port: 8081,
    timeout: 120 * 1000, // 2 minutes
    reuseExistingServer: !process.env.CI,
  },
});
