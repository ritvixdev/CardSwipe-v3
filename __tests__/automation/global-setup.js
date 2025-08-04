/**
 * Global Setup for Playwright Tests
 * Prepares the testing environment before running tests
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function globalSetup(config) {
  console.log('🔧 Setting up global test environment...');
  
  // Ensure test directories exist
  const testDirs = [
    'test-reports',
    'screenshots',
    'screenshots/baseline',
    'screenshots/diff'
  ];
  
  testDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '../../', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
  
  // Wait for the web server to be ready
  console.log('⏳ Waiting for web server to be ready...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds timeout
  
  while (attempts < maxAttempts) {
    try {
      await page.goto('http://localhost:8081', { timeout: 2000 });
      
      // Check if the app has loaded
      await page.waitForSelector('body', { timeout: 2000 });
      
      console.log('✅ Web server is ready');
      break;
      
    } catch (error) {
      attempts++;
      
      if (attempts >= maxAttempts) {
        console.error('❌ Web server failed to start within timeout');
        throw new Error('Web server not ready');
      }
      
      console.log(`⏳ Attempt ${attempts}/${maxAttempts} - waiting for server...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  await browser.close();
  
  // Set up test data if needed
  console.log('📋 Test environment setup complete');
}

module.exports = globalSetup;
