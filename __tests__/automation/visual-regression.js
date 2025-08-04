/**
 * Visual Regression Testing Framework
 * Automated screenshot comparison and visual consistency validation
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

class VisualRegressionTester {
  constructor() {
    this.config = {
      baseURL: 'http://localhost:8081',
      timeout: 30000,
      screenshotPath: path.join(__dirname, '../../screenshots'),
      baselinePath: path.join(__dirname, '../../screenshots/baseline'),
      diffPath: path.join(__dirname, '../../screenshots/diff'),
      threshold: 0.2, // 20% pixel difference threshold
      viewports: [
        { width: 1920, height: 1080, name: 'desktop' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 375, height: 667, name: 'mobile' }
      ],
      pages: [
        { name: 'learn', selector: 'text=Learn', waitFor: '[data-testid="lesson-card"]' },
        { name: 'explore', selector: 'text=Explore', waitFor: 'text=Practice Quiz' },
        { name: 'progress', selector: 'text=Progress', waitFor: '[data-testid="progress-stats"]' },
        { name: 'profile', selector: 'text=Profile', waitFor: '[data-testid="profile-container"]' }
      ],
      components: [
        { name: 'lesson-card', selector: '[data-testid="lesson-card"]' },
        { name: 'topic-selector', selector: '[data-testid="topic-selector"]' },
        { name: 'quiz-interface', selector: '[data-testid="quiz-interface"]' },
        { name: 'progress-bar', selector: '[data-testid="progress-bar"]' }
      ]
    };
    
    this.results = {
      timestamp: new Date().toISOString(),
      screenshots: [],
      comparisons: [],
      passed: 0,
      failed: 0,
      warnings: []
    };

    // Ensure directories exist
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.config.screenshotPath, this.config.baselinePath, this.config.diffPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async runVisualRegressionTests() {
    console.log('👁️ Starting Visual Regression Testing');
    console.log('=' .repeat(60));

    const browser = await chromium.launch({ headless: true });
    
    try {
      // Test full page screenshots
      await this.testFullPageScreenshots(browser);
      
      // Test component screenshots
      await this.testComponentScreenshots(browser);
      
      // Test responsive design
      await this.testResponsiveDesign(browser);
      
      // Test theme variations
      await this.testThemeVariations(browser);
      
      // Generate visual regression report
      await this.generateVisualReport();
      
      const overallPassed = this.results.failed === 0;
      console.log(`\n📊 Visual Regression Results: ${overallPassed ? '✅ PASSED' : '❌ FAILED'}`);
      
      return {
        passed: overallPassed,
        results: this.results
      };
      
    } finally {
      await browser.close();
    }
  }

  async testFullPageScreenshots(browser) {
    console.log('\n📸 Testing Full Page Screenshots');
    console.log('-'.repeat(40));

    for (const viewport of this.config.viewports) {
      const page = await browser.newPage();
      
      try {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(this.config.baseURL);
        await page.waitForSelector('body');

        for (const pageConfig of this.config.pages) {
          try {
            // Navigate to page
            await page.click(pageConfig.selector);
            
            if (pageConfig.waitFor) {
              await page.waitForSelector(pageConfig.waitFor, { timeout: 5000 });
            }
            
            await page.waitForTimeout(1000); // Allow animations to complete

            // Take screenshot
            const screenshotName = `${pageConfig.name}-${viewport.name}-fullpage.png`;
            const screenshotPath = path.join(this.config.screenshotPath, screenshotName);
            
            await page.screenshot({
              path: screenshotPath,
              fullPage: true
            });

            // Compare with baseline
            const comparisonResult = await this.compareWithBaseline(screenshotName);
            
            if (comparisonResult.passed) {
              console.log(`✅ ${pageConfig.name} (${viewport.name}): Visual test passed`);
              this.results.passed++;
            } else {
              console.log(`❌ ${pageConfig.name} (${viewport.name}): Visual regression detected (${comparisonResult.diffPercent}% difference)`);
              this.results.failed++;
            }

            this.results.screenshots.push({
              name: screenshotName,
              page: pageConfig.name,
              viewport: viewport.name,
              type: 'fullpage',
              ...comparisonResult
            });

          } catch (error) {
            console.error(`❌ Screenshot failed for ${pageConfig.name} (${viewport.name}):`, error.message);
            this.results.failed++;
          }
        }
      } finally {
        await page.close();
      }
    }
  }

  async testComponentScreenshots(browser) {
    console.log('\n🧩 Testing Component Screenshots');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');

      for (const component of this.config.components) {
        try {
          // Check if component exists
          const element = await page.$(component.selector);
          
          if (element) {
            // Take component screenshot
            const screenshotName = `component-${component.name}.png`;
            const screenshotPath = path.join(this.config.screenshotPath, screenshotName);
            
            await element.screenshot({
              path: screenshotPath
            });

            // Compare with baseline
            const comparisonResult = await this.compareWithBaseline(screenshotName);
            
            if (comparisonResult.passed) {
              console.log(`✅ ${component.name}: Component visual test passed`);
              this.results.passed++;
            } else {
              console.log(`❌ ${component.name}: Component visual regression detected (${comparisonResult.diffPercent}% difference)`);
              this.results.failed++;
            }

            this.results.screenshots.push({
              name: screenshotName,
              component: component.name,
              type: 'component',
              ...comparisonResult
            });

          } else {
            console.log(`⚠️ Component ${component.name} not found`);
            this.results.warnings.push(`Component ${component.name} not found`);
          }

        } catch (error) {
          console.error(`❌ Component screenshot failed for ${component.name}:`, error.message);
          this.results.failed++;
        }
      }
    } finally {
      await page.close();
    }
  }

  async testResponsiveDesign(browser) {
    console.log('\n📱 Testing Responsive Design');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');

      // Test breakpoint transitions
      const breakpoints = [
        { width: 320, height: 568, name: 'mobile-small' },
        { width: 375, height: 667, name: 'mobile-medium' },
        { width: 414, height: 896, name: 'mobile-large' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1024, height: 768, name: 'tablet-landscape' },
        { width: 1440, height: 900, name: 'desktop' },
        { width: 1920, height: 1080, name: 'desktop-large' }
      ];

      for (const breakpoint of breakpoints) {
        try {
          await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
          await page.waitForTimeout(500); // Allow layout to adjust

          // Take screenshot of main content area
          const screenshotName = `responsive-${breakpoint.name}.png`;
          const screenshotPath = path.join(this.config.screenshotPath, screenshotName);
          
          await page.screenshot({
            path: screenshotPath,
            clip: { x: 0, y: 0, width: breakpoint.width, height: Math.min(breakpoint.height, 800) }
          });

          // Compare with baseline
          const comparisonResult = await this.compareWithBaseline(screenshotName);
          
          if (comparisonResult.passed) {
            console.log(`✅ ${breakpoint.name}: Responsive design test passed`);
            this.results.passed++;
          } else {
            console.log(`❌ ${breakpoint.name}: Responsive design regression detected (${comparisonResult.diffPercent}% difference)`);
            this.results.failed++;
          }

          this.results.screenshots.push({
            name: screenshotName,
            breakpoint: breakpoint.name,
            viewport: `${breakpoint.width}x${breakpoint.height}`,
            type: 'responsive',
            ...comparisonResult
          });

        } catch (error) {
          console.error(`❌ Responsive test failed for ${breakpoint.name}:`, error.message);
          this.results.failed++;
        }
      }
    } finally {
      await page.close();
    }
  }

  async testThemeVariations(browser) {
    console.log('\n🎨 Testing Theme Variations');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');

      const themes = ['light', 'dark'];
      
      for (const theme of themes) {
        try {
          // Switch to theme (if theme toggle exists)
          if (theme === 'dark') {
            await page.click('text=Profile');
            await page.waitForTimeout(500);
            
            const themeToggle = await page.$('[data-testid="theme-toggle"]');
            if (themeToggle) {
              await themeToggle.click();
              await page.waitForTimeout(1000);
            }
          }

          // Take screenshot of each page in this theme
          for (const pageConfig of this.config.pages) {
            await page.click(pageConfig.selector);
            
            if (pageConfig.waitFor) {
              await page.waitForSelector(pageConfig.waitFor, { timeout: 5000 });
            }
            
            await page.waitForTimeout(1000);

            const screenshotName = `theme-${theme}-${pageConfig.name}.png`;
            const screenshotPath = path.join(this.config.screenshotPath, screenshotName);
            
            await page.screenshot({
              path: screenshotPath,
              clip: { x: 0, y: 0, width: 1920, height: 1080 }
            });

            // Compare with baseline
            const comparisonResult = await this.compareWithBaseline(screenshotName);
            
            if (comparisonResult.passed) {
              console.log(`✅ ${theme} theme - ${pageConfig.name}: Theme test passed`);
              this.results.passed++;
            } else {
              console.log(`❌ ${theme} theme - ${pageConfig.name}: Theme regression detected (${comparisonResult.diffPercent}% difference)`);
              this.results.failed++;
            }

            this.results.screenshots.push({
              name: screenshotName,
              theme,
              page: pageConfig.name,
              type: 'theme',
              ...comparisonResult
            });
          }

        } catch (error) {
          console.error(`❌ Theme test failed for ${theme}:`, error.message);
          this.results.failed++;
        }
      }
    } finally {
      await page.close();
    }
  }

  async compareWithBaseline(screenshotName) {
    const currentPath = path.join(this.config.screenshotPath, screenshotName);
    const baselinePath = path.join(this.config.baselinePath, screenshotName);
    const diffPath = path.join(this.config.diffPath, screenshotName);

    // If no baseline exists, create one
    if (!fs.existsSync(baselinePath)) {
      fs.copyFileSync(currentPath, baselinePath);
      console.log(`📝 Created baseline for ${screenshotName}`);
      return {
        passed: true,
        diffPercent: 0,
        isNewBaseline: true
      };
    }

    try {
      // Load images
      const currentImg = PNG.sync.read(fs.readFileSync(currentPath));
      const baselineImg = PNG.sync.read(fs.readFileSync(baselinePath));

      // Ensure images are same size
      if (currentImg.width !== baselineImg.width || currentImg.height !== baselineImg.height) {
        console.log(`⚠️ Image size mismatch for ${screenshotName}`);
        return {
          passed: false,
          diffPercent: 100,
          error: 'Image size mismatch'
        };
      }

      // Compare images
      const diff = new PNG({ width: currentImg.width, height: currentImg.height });
      const numDiffPixels = pixelmatch(
        currentImg.data,
        baselineImg.data,
        diff.data,
        currentImg.width,
        currentImg.height,
        { threshold: 0.1 }
      );

      // Calculate difference percentage
      const totalPixels = currentImg.width * currentImg.height;
      const diffPercent = (numDiffPixels / totalPixels) * 100;

      // Save diff image if there are differences
      if (numDiffPixels > 0) {
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
      }

      const passed = diffPercent <= this.config.threshold;

      return {
        passed,
        diffPercent: diffPercent.toFixed(2),
        diffPixels: numDiffPixels,
        totalPixels,
        diffImagePath: numDiffPixels > 0 ? diffPath : null
      };

    } catch (error) {
      console.error(`❌ Image comparison failed for ${screenshotName}:`, error.message);
      return {
        passed: false,
        diffPercent: 100,
        error: error.message
      };
    }
  }

  async generateVisualReport() {
    const reportPath = path.join(__dirname, '../../test-reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    const report = {
      ...this.results,
      summary: {
        totalTests: this.results.passed + this.results.failed,
        successRate: ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(2),
        totalScreenshots: this.results.screenshots.length,
        regressions: this.results.screenshots.filter(s => !s.passed).length,
        newBaselines: this.results.screenshots.filter(s => s.isNewBaseline).length
      }
    };

    // Save JSON report
    fs.writeFileSync(
      path.join(reportPath, `visual-regression-report-${Date.now()}.json`),
      JSON.stringify(report, null, 2)
    );

    console.log('\n📊 Visual Regression Test Summary:');
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${report.summary.successRate}%`);
    console.log(`Total Screenshots: ${report.summary.totalScreenshots}`);
    console.log(`Visual Regressions: ${report.summary.regressions}`);
    console.log(`New Baselines: ${report.summary.newBaselines}`);
  }
}

// Self-executing visual regression tester
if (require.main === module) {
  const tester = new VisualRegressionTester();
  tester.runVisualRegressionTests()
    .then(result => {
      process.exit(result.passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Visual regression testing failed:', error);
      process.exit(1);
    });
}

module.exports = VisualRegressionTester;
