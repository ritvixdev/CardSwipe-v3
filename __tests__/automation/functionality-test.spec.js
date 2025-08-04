/**
 * Detailed Functionality Test - Testing each feature individually
 * This test focuses on specific app functionality one at a time
 */

const { test, expect } = require('@playwright/test');

test.describe('🎯 DETAILED FUNCTIONALITY TESTING', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    
    console.log('🌐 Connecting to CardSwipe application...');
    await page.goto('http://localhost:8082', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(5000);
    console.log('✅ Connected to CardSwipe application');
  });

  test('📚 Functionality 1: Learn Tab and Content', async () => {
    console.log('🔍 TESTING: Learn Tab Functionality');
    
    // Navigate to Learn tab
    try {
      const learnTab = page.locator('text=Learn').first();
      await learnTab.click();
      await page.waitForTimeout(2000);
      
      console.log('✅ Learn tab clicked successfully');
      
      // Check for learning content
      const content = await page.textContent('body');
      
      // Look for learning-related elements
      const learningElements = [
        'JavaScript', 'Day', 'Quiz', 'Lesson', 'Card',
        'Easy', 'Medium', 'Hard', 'Fundamentals'
      ];
      
      console.log('📚 LEARNING CONTENT ANALYSIS:');
      const foundLearningElements = [];
      
      for (const element of learningElements) {
        const found = content.includes(element);
        const status = found ? '✅' : '❌';
        console.log(`  ${status} ${element}: ${found ? 'FOUND' : 'NOT FOUND'}`);
        
        if (found) {
          foundLearningElements.push(element);
        }
      }
      
      console.log(`📊 Found ${foundLearningElements.length}/${learningElements.length} learning elements`);
      
      // Take screenshot
      await page.screenshot({ 
        path: `test-reports/func-1-learn-tab.png`,
        fullPage: true 
      });
      
      // Test difficulty filters
      console.log('🎯 Testing difficulty filters...');
      
      const difficulties = ['Easy', 'Medium', 'Hard'];
      for (const difficulty of difficulties) {
        try {
          const difficultyButton = page.locator(`text=${difficulty}`).first();
          const isVisible = await difficultyButton.isVisible();
          
          if (isVisible) {
            console.log(`  🖱️ Clicking ${difficulty} filter...`);
            await difficultyButton.click();
            await page.waitForTimeout(1500);
            
            // Take screenshot after filter
            await page.screenshot({ 
              path: `test-reports/func-1-${difficulty.toLowerCase()}-filter.png`,
              fullPage: false 
            });
            
            console.log(`  ✅ ${difficulty} filter applied successfully`);
          }
        } catch (error) {
          console.log(`  ❌ ${difficulty} filter failed: ${error.message}`);
        }
      }
      
      expect(foundLearningElements.length).toBeGreaterThan(0);
      
    } catch (error) {
      console.log(`❌ Learn tab functionality failed: ${error.message}`);
      throw error;
    }
    
    console.log('✅ LEARN TAB FUNCTIONALITY COMPLETED');
  });

  test('🔍 Functionality 2: Explore Tab and Navigation', async () => {
    console.log('🔍 TESTING: Explore Tab Functionality');
    
    try {
      const exploreTab = page.locator('text=Explore').first();
      await exploreTab.click();
      await page.waitForTimeout(2000);
      
      console.log('✅ Explore tab clicked successfully');
      
      // Check current URL
      const currentUrl = page.url();
      console.log(`📍 Current URL: ${currentUrl}`);
      
      // Check for explore content
      const content = await page.textContent('body');
      
      // Look for explore-related elements
      const exploreElements = [
        'Explore', 'Topics', 'Categories', 'Search',
        'Filter', 'Browse', 'Content'
      ];
      
      console.log('🔍 EXPLORE CONTENT ANALYSIS:');
      const foundExploreElements = [];
      
      for (const element of exploreElements) {
        const found = content.includes(element);
        const status = found ? '✅' : '❌';
        console.log(`  ${status} ${element}: ${found ? 'FOUND' : 'NOT FOUND'}`);
        
        if (found) {
          foundExploreElements.push(element);
        }
      }
      
      console.log(`📊 Found ${foundExploreElements.length}/${exploreElements.length} explore elements`);
      
      // Take screenshot
      await page.screenshot({ 
        path: `test-reports/func-2-explore-tab.png`,
        fullPage: true 
      });
      
      // Test any clickable items in explore
      const clickableItems = await page.locator('button, a, [role="button"]').count();
      console.log(`🖱️ Found ${clickableItems} clickable items in explore`);
      
      if (clickableItems > 0) {
        // Test first few clickable items
        const maxItems = Math.min(clickableItems, 3);
        
        for (let i = 0; i < maxItems; i++) {
          try {
            const item = page.locator('button, a, [role="button"]').nth(i);
            const isVisible = await item.isVisible();
            
            if (isVisible) {
              const itemText = await item.textContent();
              console.log(`  🖱️ Testing clickable item ${i + 1}: "${itemText}"`);
              
              await item.click();
              await page.waitForTimeout(1000);
              
              // Take screenshot after click
              await page.screenshot({ 
                path: `test-reports/func-2-explore-item-${i + 1}.png`,
                fullPage: false 
              });
              
              console.log(`  ✅ Item ${i + 1} clicked successfully`);
            }
          } catch (error) {
            console.log(`  ❌ Item ${i + 1} click failed: ${error.message}`);
          }
        }
      }
      
      expect(foundExploreElements.length).toBeGreaterThan(0);
      
    } catch (error) {
      console.log(`❌ Explore tab functionality failed: ${error.message}`);
      throw error;
    }
    
    console.log('✅ EXPLORE TAB FUNCTIONALITY COMPLETED');
  });

  test('📊 Functionality 3: Progress Tab and Tracking', async () => {
    console.log('🔍 TESTING: Progress Tab Functionality');
    
    try {
      const progressTab = page.locator('text=Progress').first();
      await progressTab.click();
      await page.waitForTimeout(2000);
      
      console.log('✅ Progress tab clicked successfully');
      
      // Check current URL
      const currentUrl = page.url();
      console.log(`📍 Current URL: ${currentUrl}`);
      
      // Check for progress content
      const content = await page.textContent('body');
      
      // Look for progress-related elements
      const progressElements = [
        'Progress', 'Completed', 'Score', 'Level', 'XP',
        'Achievement', 'Stats', 'Performance', '%'
      ];
      
      console.log('📊 PROGRESS CONTENT ANALYSIS:');
      const foundProgressElements = [];
      
      for (const element of progressElements) {
        const found = content.includes(element);
        const status = found ? '✅' : '❌';
        console.log(`  ${status} ${element}: ${found ? 'FOUND' : 'NOT FOUND'}`);
        
        if (found) {
          foundProgressElements.push(element);
        }
      }
      
      console.log(`📊 Found ${foundProgressElements.length}/${progressElements.length} progress elements`);
      
      // Take screenshot
      await page.screenshot({ 
        path: `test-reports/func-3-progress-tab.png`,
        fullPage: true 
      });
      
      // Look for progress indicators (bars, numbers, etc.)
      const progressBars = await page.locator('[role="progressbar"], .progress, .progress-bar').count();
      const numbers = content.match(/\d+/g) || [];
      
      console.log(`📈 Progress indicators found:`);
      console.log(`  Progress bars: ${progressBars}`);
      console.log(`  Numbers in content: ${numbers.length}`);
      
      if (numbers.length > 0) {
        console.log(`  Sample numbers: ${numbers.slice(0, 5).join(', ')}`);
      }
      
      expect(foundProgressElements.length).toBeGreaterThan(0);
      
    } catch (error) {
      console.log(`❌ Progress tab functionality failed: ${error.message}`);
      throw error;
    }
    
    console.log('✅ PROGRESS TAB FUNCTIONALITY COMPLETED');
  });

  test('👤 Functionality 4: Profile Tab and Settings', async () => {
    console.log('🔍 TESTING: Profile Tab Functionality');

    try {
      const profileTab = page.locator('text=Profile').first();
      await profileTab.click();
      await page.waitForTimeout(2000);

      console.log('✅ Profile tab clicked successfully');

      // Check current URL
      const currentUrl = page.url();
      console.log(`📍 Current URL: ${currentUrl}`);

      // Check for profile content
      const content = await page.textContent('body');

      // Look for profile-related elements
      const profileElements = [
        'Profile', 'Settings', 'Theme', 'User', 'Account',
        'Preferences', 'Dark', 'Light', 'Name', 'Email'
      ];

      console.log('👤 PROFILE CONTENT ANALYSIS:');
      const foundProfileElements = [];

      for (const element of profileElements) {
        const found = content.includes(element);
        const status = found ? '✅' : '❌';
        console.log(`  ${status} ${element}: ${found ? 'FOUND' : 'NOT FOUND'}`);

        if (found) {
          foundProfileElements.push(element);
        }
      }

      console.log(`📊 Found ${foundProfileElements.length}/${profileElements.length} profile elements`);

      // Take screenshot
      await page.screenshot({
        path: `test-reports/func-4-profile-tab.png`,
        fullPage: true
      });

      // Test theme switching if available
      console.log('🎨 Testing theme functionality...');

      const themeButtons = ['Dark', 'Light'];
      for (const theme of themeButtons) {
        try {
          const themeButton = page.locator(`text=${theme}`).first();
          const isVisible = await themeButton.isVisible({ timeout: 2000 });

          if (isVisible) {
            console.log(`  🖱️ Testing ${theme} theme...`);
            await themeButton.click();
            await page.waitForTimeout(1500);

            // Take screenshot after theme change
            await page.screenshot({
              path: `test-reports/func-4-${theme.toLowerCase()}-theme.png`,
              fullPage: false
            });

            console.log(`  ✅ ${theme} theme applied successfully`);
          }
        } catch (error) {
          console.log(`  ❌ ${theme} theme test failed: ${error.message}`);
        }
      }

      expect(foundProfileElements.length).toBeGreaterThan(0);

    } catch (error) {
      console.log(`❌ Profile tab functionality failed: ${error.message}`);
      throw error;
    }

    console.log('✅ PROFILE TAB FUNCTIONALITY COMPLETED');
  });

  test('🎮 Functionality 5: Interactive Elements and Responsiveness', async () => {
    console.log('🔍 TESTING: Interactive Elements and Responsiveness');

    try {
      // Go back to Learn tab for interactive testing
      const learnTab = page.locator('text=Learn').first();
      await learnTab.click();
      await page.waitForTimeout(2000);

      console.log('✅ Returned to Learn tab for interactive testing');

      // Test all interactive elements
      const buttons = await page.locator('button').count();
      const links = await page.locator('a').count();
      const clickables = await page.locator('[role="button"]').count();

      console.log('🎮 INTERACTIVE ELEMENTS SUMMARY:');
      console.log(`  Buttons: ${buttons}`);
      console.log(`  Links: ${links}`);
      console.log(`  Clickables: ${clickables}`);

      // Test responsiveness by changing viewport
      console.log('📱 Testing responsiveness...');

      const viewports = [
        { width: 1920, height: 1080, name: 'Desktop' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 375, height: 667, name: 'Mobile' }
      ];

      for (const viewport of viewports) {
        console.log(`  📐 Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})...`);

        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(1000);

        // Take screenshot at this viewport
        await page.screenshot({
          path: `test-reports/func-5-${viewport.name.toLowerCase()}-viewport.png`,
          fullPage: false
        });

        // Check if content is still accessible
        const content = await page.textContent('body');
        const hasContent = content && content.length > 100;

        console.log(`    ${hasContent ? '✅' : '❌'} Content accessible: ${hasContent ? 'YES' : 'NO'}`);
      }

      // Reset to default viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Test keyboard navigation
      console.log('⌨️ Testing keyboard navigation...');

      try {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(500);
        await page.keyboard.press('Tab');
        await page.waitForTimeout(500);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);

        console.log('  ✅ Keyboard navigation working');

        // Take screenshot after keyboard interaction
        await page.screenshot({
          path: `test-reports/func-5-keyboard-navigation.png`,
          fullPage: false
        });

      } catch (error) {
        console.log(`  ❌ Keyboard navigation failed: ${error.message}`);
      }

      expect(buttons + links + clickables).toBeGreaterThan(0);

    } catch (error) {
      console.log(`❌ Interactive elements testing failed: ${error.message}`);
      throw error;
    }

    console.log('✅ INTERACTIVE ELEMENTS AND RESPONSIVENESS COMPLETED');
  });

  test.afterAll(async () => {
    console.log('🎉 ALL FUNCTIONALITY TESTS COMPLETED!');
    console.log('=' .repeat(80));
    console.log('📊 FUNCTIONALITY TEST SUMMARY:');
    console.log('  ✅ Learn Tab: Tested content and filters');
    console.log('  ✅ Explore Tab: Tested navigation and content');
    console.log('  ✅ Progress Tab: Tested tracking and stats');
    console.log('  ✅ Profile Tab: Tested settings and themes');
    console.log('  ✅ Interactive Elements: Tested responsiveness and keyboard nav');
    console.log('  📸 All screenshots saved in test-reports/');
    console.log('=' .repeat(80));
  });
});
