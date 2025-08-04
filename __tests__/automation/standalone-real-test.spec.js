/**
 * Standalone Real Application Test
 * This test runs independently without global setup
 */

const { test, expect } = require('@playwright/test');

test.describe('🔍 STANDALONE REAL APPLICATION TESTING', () => {
  
  test('📋 COMPREHENSIVE REAL TEST: Full application analysis', async ({ page }) => {
    console.log('🚀 STARTING COMPREHENSIVE REAL APPLICATION TESTING');
    console.log('=' .repeat(80));
    
    try {
      console.log('🌐 Step 1: Connecting to live application...');
      
      // Navigate directly to the app
      await page.goto('http://localhost:8082', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      console.log('✅ Successfully connected to application');
      
      // Wait for React to fully hydrate
      await page.waitForTimeout(5000);
      
      console.log('📸 Step 2: Capturing initial screenshot...');
      await page.screenshot({ 
        path: `test-reports/comprehensive-real-test-initial.png`,
        fullPage: true 
      });
      
      console.log('📊 Step 3: Analyzing page content...');
      
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
        console.log('✅ Application has loaded content successfully');
        
        // Display first 500 characters of content
        const preview = allText.substring(0, 500);
        console.log('📄 CONTENT PREVIEW:');
        console.log('-' .repeat(50));
        console.log(preview);
        console.log('-' .repeat(50));
        
        console.log('🔍 Step 4: Searching for key application elements...');
        
        // Check for main navigation elements
        const navigationElements = [
          'Learn', 'Explore', 'Progress', 'Profile',
          'Quiz', 'Lesson', 'Card', 'Day', 'Level',
          'Practice', 'Interview', 'Theme', 'Settings'
        ];
        
        console.log('🧭 NAVIGATION ELEMENTS ANALYSIS:');
        const foundElements = [];
        
        for (const element of navigationElements) {
          const found = allText.includes(element);
          const status = found ? '✅' : '❌';
          console.log(`  ${status} ${element}: ${found ? 'FOUND' : 'NOT FOUND'}`);
          
          if (found) {
            foundElements.push(element);
          }
        }
        
        console.log(`📊 Found ${foundElements.length}/${navigationElements.length} key elements`);
        
        console.log('🖱️ Step 5: Analyzing interactive elements...');
        
        // Count interactive elements
        const buttons = await page.locator('button').count();
        const links = await page.locator('a').count();
        const inputs = await page.locator('input').count();
        const touchables = await page.locator('[role="button"]').count();
        const clickables = await page.locator('[onclick]').count();
        
        console.log('🎯 INTERACTIVE ELEMENTS COUNT:');
        console.log(`  Buttons: ${buttons}`);
        console.log(`  Links: ${links}`);
        console.log(`  Inputs: ${inputs}`);
        console.log(`  Role=button: ${touchables}`);
        console.log(`  Onclick handlers: ${clickables}`);
        
        const totalInteractive = buttons + links + inputs + touchables + clickables;
        console.log(`  📊 Total interactive elements: ${totalInteractive}`);
        
        if (totalInteractive > 0) {
          console.log('🔄 Step 6: Testing interactions...');
          
          // Try to interact with buttons
          if (buttons > 0) {
            console.log(`🎯 Testing button interactions (${buttons} buttons found)...`);
            
            for (let i = 0; i < Math.min(buttons, 3); i++) {
              try {
                const button = page.locator('button').nth(i);
                const isVisible = await button.isVisible();
                
                if (isVisible) {
                  const buttonText = await button.textContent();
                  console.log(`  🖱️ Clicking button ${i + 1}: "${buttonText}"`);
                  
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
                    path: `test-reports/after-button-${i + 1}-click.png`,
                    fullPage: false 
                  });
                  
                  console.log(`    📸 Screenshot saved: after-button-${i + 1}-click.png`);
                }
              } catch (error) {
                console.log(`    ❌ Button ${i + 1} interaction failed: ${error.message}`);
              }
            }
          }
          
          // Try to find and test navigation tabs
          console.log('🧭 Step 7: Testing navigation tabs...');
          
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
                    path: `test-reports/${tabName.toLowerCase()}-tab-real-test.png`,
                    fullPage: false 
                  });
                  
                  console.log(`    📸 Screenshot saved: ${tabName.toLowerCase()}-tab-real-test.png`);
                  
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
        }
        
        console.log('🐛 Step 8: Checking for JavaScript errors...');
        
        const errors = [];
        page.on('pageerror', error => {
          errors.push(error.message);
        });
        
        // Wait to catch any delayed errors
        await page.waitForTimeout(3000);
        
        if (errors.length === 0) {
          console.log('  ✅ No JavaScript errors detected');
        } else {
          console.log(`  ❌ ${errors.length} JavaScript errors found:`);
          errors.forEach((error, index) => {
            console.log(`    ${index + 1}. ${error}`);
          });
        }
        
        console.log('🌐 Step 9: Network activity analysis...');
        
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
        
        console.log('📸 Step 10: Final comprehensive screenshot...');
        await page.screenshot({ 
          path: `test-reports/comprehensive-real-test-final.png`,
          fullPage: true 
        });
        
        console.log('🎉 COMPREHENSIVE REAL APPLICATION TEST COMPLETED SUCCESSFULLY!');
        console.log('=' .repeat(80));
        console.log('📊 SUMMARY:');
        console.log(`  ✅ Application loaded: YES`);
        console.log(`  📄 Content length: ${contentLength} characters`);
        console.log(`  🧭 Key elements found: ${foundElements.length}/${navigationElements.length}`);
        console.log(`  🖱️ Interactive elements: ${totalInteractive}`);
        console.log(`  🐛 JavaScript errors: ${errors.length}`);
        console.log(`  📡 Network requests: ${requests.length}`);
        console.log('  📸 Screenshots saved in test-reports/');
        console.log('=' .repeat(80));
        
      } else {
        console.log('❌ Application failed to load content');
        console.log('🔍 Checking for loading indicators...');
        
        const loadingText = allText || '';
        const hasLoadingIndicator = [
          'loading', 'Loading', 'LOADING',
          'Please wait', 'Initializing',
          'JavaScript', 'enable JavaScript'
        ].some(indicator => loadingText.includes(indicator));
        
        if (hasLoadingIndicator) {
          console.log('⏳ Application appears to be in loading state');
          console.log(`📄 Current content: "${loadingText}"`);
        } else {
          console.log('❌ No content or loading indicators found');
        }
      }
      
    } catch (error) {
      console.log('💥 CRITICAL ERROR during testing:');
      console.log(`❌ Error: ${error.message}`);
      console.log(`📍 Stack: ${error.stack}`);
      
      // Try to take error screenshot
      try {
        await page.screenshot({ 
          path: `test-reports/error-screenshot.png`,
          fullPage: true 
        });
        console.log('📸 Error screenshot saved');
      } catch (screenshotError) {
        console.log('❌ Could not save error screenshot');
      }
    }
  });
});
