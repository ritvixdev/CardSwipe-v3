/**
 * REAL Content Inspector - Analyzes actual application content
 * This test inspects the real application and provides detailed analysis
 * of what's actually present on each page
 */

const { test, expect } = require('@playwright/test');

// Configuration for real testing
const TEST_CONFIG = {
  baseURL: 'http://localhost:8082',
  timeout: 30000,
  slowMo: 1000, // Slow down actions to see them happen
};

test.describe('🔍 REAL Content Analysis - Live Application Inspection', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_CONFIG.baseURL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Give React time to fully load
    console.log('🌐 Navigated to application and waiting for full load');
  });

  test('📋 REAL ANALYSIS: Complete page content inspection', async ({ page }) => {
    console.log('🔍 Starting comprehensive content analysis...');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: `test-reports/initial-page-screenshot.png`,
      fullPage: true 
    });
    console.log('📸 Initial screenshot captured');
    
    // Get all text content from the page
    const allText = await page.textContent('body');
    console.log('📄 COMPLETE PAGE TEXT CONTENT:');
    console.log('=' .repeat(80));
    console.log(allText);
    console.log('=' .repeat(80));
    
    // Get page title
    const title = await page.title();
    console.log(`📑 Page Title: ${title}`);
    
    // Get current URL
    const currentUrl = page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);
    
    // Check for any visible elements
    const allElements = await page.locator('*').all();
    console.log(`🔢 Total elements found: ${allElements.length}`);
    
    // Look for common navigation patterns
    const navigationPatterns = [
      'nav', '[role="navigation"]', '.navigation', '.nav',
      '.tab', '.tabs', '[role="tab"]', '[role="tablist"]',
      'button', 'a[href]', '.button', '.btn'
    ];
    
    console.log('🧭 NAVIGATION ELEMENTS ANALYSIS:');
    for (const pattern of navigationPatterns) {
      const elements = page.locator(pattern);
      const count = await elements.count();
      
      if (count > 0) {
        console.log(`  ✅ Found ${count} elements matching: ${pattern}`);
        
        // Get text content of these elements
        for (let i = 0; i < Math.min(count, 5); i++) { // Limit to first 5
          try {
            const element = elements.nth(i);
            const text = await element.textContent();
            const isVisible = await element.isVisible();
            console.log(`    ${i + 1}. "${text}" (visible: ${isVisible})`);
          } catch (error) {
            console.log(`    ${i + 1}. Error reading element: ${error.message}`);
          }
        }
      } else {
        console.log(`  ❌ No elements found for: ${pattern}`);
      }
    }
    
    // Look for specific content patterns
    const contentPatterns = [
      'Learn', 'Explore', 'Progress', 'Profile',
      'Quiz', 'Lesson', 'Card', 'Day', 'Level',
      'Practice', 'Interview', 'Theme', 'Settings'
    ];
    
    console.log('📝 CONTENT PATTERNS ANALYSIS:');
    for (const pattern of contentPatterns) {
      const elements = page.locator(`text=${pattern}`);
      const count = await elements.count();
      
      if (count > 0) {
        console.log(`  ✅ Found "${pattern}" ${count} times`);
        
        // Check if any are clickable
        for (let i = 0; i < Math.min(count, 3); i++) {
          try {
            const element = elements.nth(i);
            const isVisible = await element.isVisible();
            const isEnabled = await element.isEnabled();
            const tagName = await element.evaluate(el => el.tagName);
            
            console.log(`    ${i + 1}. Tag: ${tagName}, Visible: ${isVisible}, Enabled: ${isEnabled}`);
          } catch (error) {
            console.log(`    ${i + 1}. Error analyzing element: ${error.message}`);
          }
        }
      } else {
        console.log(`  ❌ "${pattern}" not found`);
      }
    }
    
    // Check for interactive elements
    const interactiveElements = [
      'button', 'input', 'select', 'textarea', 
      'a[href]', '[onclick]', '[role="button"]'
    ];
    
    console.log('🖱️ INTERACTIVE ELEMENTS ANALYSIS:');
    for (const selector of interactiveElements) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        console.log(`  ✅ Found ${count} ${selector} elements`);
        
        // Analyze first few
        for (let i = 0; i < Math.min(count, 3); i++) {
          try {
            const element = elements.nth(i);
            const text = await element.textContent();
            const isVisible = await element.isVisible();
            const boundingBox = await element.boundingBox();
            
            console.log(`    ${i + 1}. "${text}" - Visible: ${isVisible}, Position: ${boundingBox ? `${boundingBox.x},${boundingBox.y}` : 'N/A'}`);
          } catch (error) {
            console.log(`    ${i + 1}. Error analyzing interactive element: ${error.message}`);
          }
        }
      }
    }
    
    // Check for images and media
    const mediaElements = ['img', 'video', 'audio', 'svg'];
    
    console.log('🖼️ MEDIA ELEMENTS ANALYSIS:');
    for (const selector of mediaElements) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        console.log(`  ✅ Found ${count} ${selector} elements`);
      }
    }
    
    // Check for error messages or loading states
    const statusPatterns = [
      'error', 'loading', 'failed', 'success',
      'spinner', 'loader', 'progress'
    ];
    
    console.log('⚠️ STATUS INDICATORS ANALYSIS:');
    for (const pattern of statusPatterns) {
      const byText = page.locator(`text=${pattern}`);
      const byClass = page.locator(`[class*="${pattern}"]`);
      
      const textCount = await byText.count();
      const classCount = await byClass.count();
      
      if (textCount > 0 || classCount > 0) {
        console.log(`  ⚠️ Found "${pattern}" - Text: ${textCount}, Class: ${classCount}`);
      }
    }
    
    // Get computed styles of body to check theme
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize
      };
    });
    
    console.log('🎨 STYLING ANALYSIS:');
    console.log(`  Background: ${bodyStyles.backgroundColor}`);
    console.log(`  Text Color: ${bodyStyles.color}`);
    console.log(`  Font Family: ${bodyStyles.fontFamily}`);
    console.log(`  Font Size: ${bodyStyles.fontSize}`);
    
    // Check for React/JavaScript errors
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    // Wait a bit to catch any errors
    await page.waitForTimeout(2000);
    
    console.log('🐛 JAVASCRIPT ERRORS ANALYSIS:');
    if (jsErrors.length === 0) {
      console.log('  ✅ No JavaScript errors detected');
    } else {
      console.log(`  ❌ ${jsErrors.length} JavaScript errors found:`);
      jsErrors.forEach((error, index) => {
        console.log(`    ${index + 1}. ${error}`);
      });
    }
    
    // Check network requests
    const requests = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });
    
    // Trigger some interactions to see network activity
    await page.waitForTimeout(1000);
    
    console.log('🌐 NETWORK REQUESTS ANALYSIS:');
    console.log(`  Total requests: ${requests.length}`);
    
    const requestTypes = {};
    requests.forEach(req => {
      requestTypes[req.resourceType] = (requestTypes[req.resourceType] || 0) + 1;
    });
    
    Object.entries(requestTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} requests`);
    });
    
    // Final screenshot
    await page.screenshot({ 
      path: `test-reports/final-analysis-screenshot.png`,
      fullPage: true 
    });
    
    console.log('✅ COMPREHENSIVE CONTENT ANALYSIS COMPLETE');
    console.log('📊 Check test-reports/ directory for screenshots');
  });

  test('🔄 REAL INTERACTION: Attempt to interact with found elements', async ({ page }) => {
    console.log('🔄 Starting interaction attempts...');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Try to find and click any clickable elements
    const clickableSelectors = [
      'button',
      'a[href]',
      '[role="button"]',
      '[onclick]',
      'div[style*="cursor: pointer"]',
      '.clickable',
      '.btn',
      '.button'
    ];
    
    for (const selector of clickableSelectors) {
      try {
        const elements = page.locator(selector);
        const count = await elements.count();
        
        if (count > 0) {
          console.log(`🎯 Found ${count} potentially clickable elements: ${selector}`);
          
          // Try clicking the first visible one
          for (let i = 0; i < count; i++) {
            const element = elements.nth(i);
            const isVisible = await element.isVisible();
            
            if (isVisible) {
              const text = await element.textContent();
              console.log(`  🖱️ Attempting to click: "${text}"`);
              
              try {
                await element.click({ timeout: 5000 });
                await page.waitForTimeout(1000);
                
                // Take screenshot after click
                await page.screenshot({ 
                  path: `test-reports/after-click-${selector.replace(/[^a-zA-Z0-9]/g, '_')}-${i}.png`,
                  fullPage: false 
                });
                
                console.log(`  ✅ Successfully clicked and screenshot taken`);
                
                // Check if URL changed
                const newUrl = page.url();
                console.log(`  📍 URL after click: ${newUrl}`);
                
                break; // Only click first visible element of each type
              } catch (clickError) {
                console.log(`  ❌ Click failed: ${clickError.message}`);
              }
            }
          }
        }
      } catch (error) {
        console.log(`❌ Error with selector ${selector}: ${error.message}`);
      }
    }
    
    console.log('✅ INTERACTION ATTEMPTS COMPLETE');
  });
});
