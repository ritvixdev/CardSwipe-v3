/**
 * Sequential Playwright Test - One functionality at a time
 * This test runs one browser instance and tests each functionality sequentially
 */

const { test, expect } = require('@playwright/test');

test.describe('🔄 SEQUENTIAL APPLICATION TESTING', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    // Create a single browser context and page for all tests
    const context = await browser.newContext();
    page = await context.newPage();
    
    console.log('🌐 Connecting to application...');
    await page.goto('http://localhost:8082', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for React to fully hydrate
    await page.waitForTimeout(5000);
    console.log('✅ Connected to application');
  });

  test('📋 Step 1: Initial Page Load and Content Analysis', async () => {
    console.log('🔍 STEP 1: Analyzing initial page load...');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: `test-reports/step-1-initial-load.png`,
      fullPage: true 
    });
    
    // Get page metadata
    const title = await page.title();
    const url = page.url();
    console.log(`📑 Page Title: "${title}"`);
    console.log(`🌐 Current URL: ${url}`);
    
    // Get all text content
    const allText = await page.textContent('body');
    const contentLength = allText ? allText.length : 0;
    
    console.log(`📄 Total content length: ${contentLength} characters`);
    
    if (contentLength > 0) {
      console.log('✅ Application loaded successfully with content');
      
      // Display first 300 characters of content
      const preview = allText.substring(0, 300);
      console.log('📄 CONTENT PREVIEW:');
      console.log('-'.repeat(50));
      console.log(preview);
      console.log('-'.repeat(50));
      
      // Check for key application elements
      const keyElements = [
        'Learn', 'Explore', 'Progress', 'Profile',
        'Quiz', 'Lesson', 'Card', 'Day'
      ];
      
      console.log('🧭 KEY ELEMENTS FOUND:');
      const foundElements = [];
      
      for (const element of keyElements) {
        const found = allText.includes(element);
        const status = found ? '✅' : '❌';
        console.log(`  ${status} ${element}: ${found ? 'FOUND' : 'NOT FOUND'}`);
        
        if (found) {
          foundElements.push(element);
        }
      }
      
      console.log(`📊 Found ${foundElements.length}/${keyElements.length} key elements`);
      
      // Basic assertion
      expect(contentLength).toBeGreaterThan(0);
      expect(foundElements.length).toBeGreaterThan(0);
      
    } else {
      console.log('❌ Application failed to load content');
      throw new Error('Application did not load content');
    }
    
    console.log('✅ STEP 1 COMPLETED: Initial page load analysis');
  });

  test('🖱️ Step 2: Interactive Elements Analysis', async () => {
    console.log('🔍 STEP 2: Analyzing interactive elements...');
    
    // Count interactive elements
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    const inputs = await page.locator('input').count();
    const touchables = await page.locator('[role="button"]').count();
    
    console.log('🎯 INTERACTIVE ELEMENTS COUNT:');
    console.log(`  Buttons: ${buttons}`);
    console.log(`  Links: ${links}`);
    console.log(`  Inputs: ${inputs}`);
    console.log(`  Role=button: ${touchables}`);
    
    const totalInteractive = buttons + links + inputs + touchables;
    console.log(`  📊 Total interactive elements: ${totalInteractive}`);
    
    // Take screenshot
    await page.screenshot({ 
      path: `test-reports/step-2-interactive-elements.png`,
      fullPage: false 
    });
    
    // Basic assertion
    expect(totalInteractive).toBeGreaterThan(0);
    
    console.log('✅ STEP 2 COMPLETED: Interactive elements analysis');
  });

  test('🔄 Step 3: Button Interaction Testing', async () => {
    console.log('🔍 STEP 3: Testing button interactions...');
    
    const buttons = await page.locator('button').count();
    
    if (buttons > 0) {
      console.log(`🎯 Testing button interactions (${buttons} buttons found)...`);
      
      // Test up to 3 buttons to avoid overwhelming
      const maxButtons = Math.min(buttons, 3);
      
      for (let i = 0; i < maxButtons; i++) {
        try {
          const button = page.locator('button').nth(i);
          const isVisible = await button.isVisible();
          
          if (isVisible) {
            const buttonText = await button.textContent();
            console.log(`  🖱️ Testing button ${i + 1}: "${buttonText}"`);
            
            // Get content before click
            const beforeClick = await page.textContent('body');
            
            await button.click();
            await page.waitForTimeout(1500);
            
            // Get content after click
            const afterClick = await page.textContent('body');
            const contentChanged = beforeClick !== afterClick;
            
            console.log(`    📊 Content changed: ${contentChanged ? 'YES' : 'NO'}`);
            
            // Take screenshot after interaction
            await page.screenshot({ 
              path: `test-reports/step-3-button-${i + 1}-click.png`,
              fullPage: false 
            });
            
            console.log(`    📸 Screenshot saved: step-3-button-${i + 1}-click.png`);
          }
        } catch (error) {
          console.log(`    ❌ Button ${i + 1} interaction failed: ${error.message}`);
        }
      }
    } else {
      console.log('❌ No buttons found to test');
    }
    
    console.log('✅ STEP 3 COMPLETED: Button interaction testing');
  });

  test('🧭 Step 4: Navigation Tab Testing', async () => {
    console.log('🔍 STEP 4: Testing navigation tabs...');

    const tabNames = ['Learn', 'Explore', 'Progress', 'Profile'];

    for (const tabName of tabNames) {
      console.log(`  🔍 Testing ${tabName} tab...`);

      // Try multiple selectors
      const selectors = [
        `text=${tabName}`,
        `button:has-text("${tabName}")`,
        `a:has-text("${tabName}")`,
        `[aria-label="${tabName}"]`,
        `[data-testid="${tabName.toLowerCase()}"]`
      ];

      let tabInteracted = false;

      for (const selector of selectors) {
        try {
          const element = page.locator(selector).first();
          const isVisible = await element.isVisible({ timeout: 2000 });

          if (isVisible) {
            console.log(`    ✅ Found ${tabName} with selector: ${selector}`);

            // Get URL before click
            const beforeUrl = page.url();

            await element.click();
            await page.waitForTimeout(2000);

            // Check if URL or content changed
            const afterUrl = page.url();
            const urlChanged = beforeUrl !== afterUrl;

            console.log(`    📍 URL changed: ${urlChanged ? 'YES' : 'NO'}`);
            console.log(`    📍 Before: ${beforeUrl}`);
            console.log(`    📍 After: ${afterUrl}`);

            // Take screenshot
            await page.screenshot({
              path: `test-reports/step-4-${tabName.toLowerCase()}-tab.png`,
              fullPage: false
            });

            console.log(`    📸 Screenshot saved: step-4-${tabName.toLowerCase()}-tab.png`);

            tabInteracted = true;
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }

      if (!tabInteracted) {
        console.log(`    ❌ Could not interact with ${tabName} tab`);
      }
    }

    console.log('✅ STEP 4 COMPLETED: Navigation tab testing');
  });

  test('🐛 Step 5: JavaScript Error Detection', async () => {
    console.log('🔍 STEP 5: Checking for JavaScript errors...');

    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Wait to catch any delayed errors
    await page.waitForTimeout(3000);

    // Trigger some interactions to potentially cause errors
    try {
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
    } catch (error) {
      console.log(`    ⚠️ Reload error: ${error.message}`);
    }

    if (errors.length === 0) {
      console.log('  ✅ No JavaScript errors detected');
    } else {
      console.log(`  ❌ ${errors.length} JavaScript errors found:`);
      errors.forEach((error, index) => {
        console.log(`    ${index + 1}. ${error}`);
      });
    }

    // Take screenshot
    await page.screenshot({
      path: `test-reports/step-5-error-check.png`,
      fullPage: false
    });

    console.log('✅ STEP 5 COMPLETED: JavaScript error detection');
  });

  test('📡 Step 6: Network Activity Analysis', async () => {
    console.log('🔍 STEP 6: Analyzing network activity...');

    const requests = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    // Trigger some activity
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log(`  📡 Total network requests: ${requests.length}`);

    const requestTypes = {};
    requests.forEach(req => {
      requestTypes[req.resourceType] = (requestTypes[req.resourceType] || 0) + 1;
    });

    console.log('  📊 Request types:');
    Object.entries(requestTypes).forEach(([type, count]) => {
      console.log(`    ${type}: ${count}`);
    });

    // Take screenshot
    await page.screenshot({
      path: `test-reports/step-6-network-analysis.png`,
      fullPage: false
    });

    console.log('✅ STEP 6 COMPLETED: Network activity analysis');
  });

  test('📸 Step 7: Final Comprehensive Screenshot', async () => {
    console.log('🔍 STEP 7: Taking final comprehensive screenshot...');

    // Take final full page screenshot
    await page.screenshot({
      path: `test-reports/step-7-final-comprehensive.png`,
      fullPage: true
    });

    console.log('📸 Final comprehensive screenshot saved');
    console.log('✅ STEP 7 COMPLETED: Final comprehensive screenshot');
  });

  test.afterAll(async () => {
    console.log('🎉 ALL SEQUENTIAL TESTS COMPLETED!');
    console.log('=' .repeat(80));
    console.log('📊 SUMMARY:');
    console.log('  ✅ All tests ran sequentially with single browser instance');
    console.log('  📸 Screenshots saved in test-reports/');
    console.log('  🔄 No multiple browser instances spawned');
    console.log('=' .repeat(80));
  });
});
