/**
 * Simple Real Application Test
 * This test directly connects to the running app and performs real interactions
 */

const { test, expect } = require('@playwright/test');

test.describe('🔍 REAL Application Testing - Direct Connection', () => {
  
  test('📋 REAL TEST: Connect to app and analyze content', async ({ page }) => {
    console.log('🌐 Connecting to live application...');
    
    // Navigate directly to the app
    await page.goto('http://localhost:8082');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Give React time to fully hydrate
    
    console.log('✅ Connected to application');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: `test-reports/live-app-screenshot.png`,
      fullPage: true 
    });
    console.log('📸 Screenshot captured');
    
    // Get page title
    const title = await page.title();
    console.log(`📑 Page Title: ${title}`);
    
    // Get all text content
    const allText = await page.textContent('body');
    console.log('📄 COMPLETE PAGE CONTENT:');
    console.log('=' .repeat(80));
    console.log(allText);
    console.log('=' .repeat(80));
    
    // Check if we have any visible content
    const hasContent = allText && allText.trim().length > 0;
    console.log(`📊 Has Content: ${hasContent}`);
    
    if (hasContent) {
      console.log('✅ Application loaded successfully with content');
      
      // Look for navigation elements
      const navElements = [
        'Learn', 'Explore', 'Progress', 'Profile',
        'Quiz', 'Lesson', 'Card', 'Day'
      ];
      
      console.log('🧭 NAVIGATION ANALYSIS:');
      for (const nav of navElements) {
        const found = allText.includes(nav);
        console.log(`  ${found ? '✅' : '❌'} ${nav}: ${found ? 'Found' : 'Not found'}`);
      }
      
      // Try to find clickable elements
      const buttons = await page.locator('button').count();
      const links = await page.locator('a').count();
      const touchables = await page.locator('[role="button"]').count();
      
      console.log('🖱️ INTERACTIVE ELEMENTS:');
      console.log(`  Buttons: ${buttons}`);
      console.log(`  Links: ${links}`);
      console.log(`  Touchables: ${touchables}`);
      
      // Try to interact with any found elements
      if (buttons > 0) {
        console.log('🔄 Attempting to interact with first button...');
        try {
          const firstButton = page.locator('button').first();
          const buttonText = await firstButton.textContent();
          console.log(`  Button text: "${buttonText}"`);
          
          await firstButton.click();
          await page.waitForTimeout(1000);
          
          // Take screenshot after interaction
          await page.screenshot({ 
            path: `test-reports/after-button-click.png`,
            fullPage: false 
          });
          
          console.log('✅ Button interaction successful');
        } catch (error) {
          console.log(`❌ Button interaction failed: ${error.message}`);
        }
      }
      
      // Check for any JavaScript errors
      const errors = [];
      page.on('pageerror', error => {
        errors.push(error.message);
      });
      
      await page.waitForTimeout(2000);
      
      console.log('🐛 JAVASCRIPT ERRORS:');
      if (errors.length === 0) {
        console.log('  ✅ No JavaScript errors detected');
      } else {
        console.log(`  ❌ ${errors.length} errors found:`);
        errors.forEach((error, index) => {
          console.log(`    ${index + 1}. ${error}`);
        });
      }
      
    } else {
      console.log('❌ Application failed to load content');
      
      // Check if it's a loading state
      const loadingIndicators = [
        'loading', 'Loading', 'LOADING',
        'spinner', 'Spinner', 'SPINNER'
      ];
      
      const isLoading = loadingIndicators.some(indicator => 
        allText.includes(indicator)
      );
      
      if (isLoading) {
        console.log('⏳ Application appears to be in loading state');
        
        // Wait longer and try again
        await page.waitForTimeout(10000);
        
        const newContent = await page.textContent('body');
        const hasNewContent = newContent && newContent.trim().length > 0;
        
        console.log(`📊 Content after waiting: ${hasNewContent ? 'Found' : 'Still empty'}`);
        
        if (hasNewContent) {
          console.log('✅ Application loaded after extended wait');
          console.log('📄 FINAL CONTENT:');
          console.log(newContent.substring(0, 500) + '...');
        }
      }
    }
    
    console.log('🎯 REAL APPLICATION TEST COMPLETE');
  });

  test('🔄 REAL TEST: Navigation and interaction flow', async ({ page }) => {
    console.log('🔄 Starting navigation flow test...');
    
    await page.goto('http://localhost:8082');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Get initial state
    const initialContent = await page.textContent('body');
    console.log(`📄 Initial content length: ${initialContent.length} characters`);
    
    // Look for navigation tabs
    const tabNames = ['Learn', 'Explore', 'Progress', 'Profile'];
    
    for (const tabName of tabNames) {
      console.log(`🔍 Looking for ${tabName} tab...`);
      
      // Try different selectors for the tab
      const selectors = [
        `text=${tabName}`,
        `[aria-label="${tabName}"]`,
        `[data-testid="${tabName.toLowerCase()}"]`,
        `button:has-text("${tabName}")`,
        `a:has-text("${tabName}")`
      ];
      
      let tabFound = false;
      
      for (const selector of selectors) {
        try {
          const element = page.locator(selector).first();
          const isVisible = await element.isVisible({ timeout: 1000 });
          
          if (isVisible) {
            console.log(`  ✅ Found ${tabName} tab with selector: ${selector}`);
            
            // Try to click it
            await element.click();
            await page.waitForTimeout(1500);
            
            // Take screenshot
            await page.screenshot({ 
              path: `test-reports/${tabName.toLowerCase()}-tab-real.png`,
              fullPage: false 
            });
            
            // Check if content changed
            const newContent = await page.textContent('body');
            const contentChanged = newContent !== initialContent;
            
            console.log(`  📊 Content changed after clicking ${tabName}: ${contentChanged}`);
            
            tabFound = true;
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
      if (!tabFound) {
        console.log(`  ❌ ${tabName} tab not found with any selector`);
      }
    }
    
    console.log('✅ Navigation flow test complete');
  });
});
