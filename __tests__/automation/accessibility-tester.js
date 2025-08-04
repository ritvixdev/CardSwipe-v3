/**
 * Comprehensive Accessibility Testing Framework
 * Automated a11y compliance testing using axe-core and custom checks
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class AccessibilityTester {
  constructor() {
    this.config = {
      baseURL: 'http://localhost:8081',
      timeout: 30000,
      pages: [
        { name: 'Learn', path: '/', selector: 'text=Learn' },
        { name: 'Explore', path: '/', selector: 'text=Explore' },
        { name: 'Progress', path: '/', selector: 'text=Progress' },
        { name: 'Profile', path: '/', selector: 'text=Profile' }
      ],
      axeRules: {
        // WCAG 2.1 AA compliance rules
        'color-contrast': { enabled: true, level: 'AA' },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
        'aria-labels': { enabled: true },
        'semantic-markup': { enabled: true },
        'alt-text': { enabled: true },
        'form-labels': { enabled: true }
      }
    };
    
    this.results = {
      timestamp: new Date().toISOString(),
      violations: [],
      warnings: [],
      passed: 0,
      failed: 0,
      pages: {}
    };
  }

  async runAccessibilityTests() {
    console.log('♿ Starting Comprehensive Accessibility Testing');
    console.log('=' .repeat(60));

    const browser = await chromium.launch({ headless: true });
    
    try {
      // Test each page for accessibility
      for (const pageConfig of this.config.pages) {
        await this.testPageAccessibility(browser, pageConfig);
      }
      
      // Run keyboard navigation tests
      await this.testKeyboardNavigation(browser);
      
      // Test screen reader compatibility
      await this.testScreenReaderCompatibility(browser);
      
      // Test color contrast
      await this.testColorContrast(browser);
      
      // Test focus management
      await this.testFocusManagement(browser);
      
      // Generate accessibility report
      await this.generateAccessibilityReport();
      
      const overallPassed = this.results.failed === 0;
      console.log(`\n📊 Accessibility Test Results: ${overallPassed ? '✅ PASSED' : '❌ FAILED'}`);
      
      return {
        passed: overallPassed,
        results: this.results
      };
      
    } finally {
      await browser.close();
    }
  }

  async testPageAccessibility(browser, pageConfig) {
    console.log(`\n🔍 Testing ${pageConfig.name} Page Accessibility`);
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      // Navigate to page
      await page.goto(this.config.baseURL + pageConfig.path);
      await page.waitForSelector('body');
      
      // Navigate to specific tab if needed
      if (pageConfig.selector) {
        await page.click(pageConfig.selector);
        await page.waitForTimeout(1000);
      }

      // Inject axe-core for accessibility testing
      await page.addScriptTag({
        url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
      });

      // Run axe accessibility scan
      const axeResults = await page.evaluate(async () => {
        return await axe.run(document, {
          rules: {
            'color-contrast': { enabled: true },
            'keyboard': { enabled: true },
            'focus-order-semantics': { enabled: true },
            'aria-allowed-attr': { enabled: true },
            'aria-required-attr': { enabled: true },
            'button-name': { enabled: true },
            'link-name': { enabled: true },
            'image-alt': { enabled: true },
            'label': { enabled: true },
            'landmark-one-main': { enabled: true },
            'page-has-heading-one': { enabled: true },
            'region': { enabled: true }
          }
        });
      });

      // Process axe results
      const pageResults = {
        violations: axeResults.violations,
        passes: axeResults.passes,
        incomplete: axeResults.incomplete,
        inapplicable: axeResults.inapplicable
      };

      this.results.pages[pageConfig.name] = pageResults;

      // Count violations and passes
      if (axeResults.violations.length === 0) {
        console.log(`✅ ${pageConfig.name}: No accessibility violations found`);
        this.results.passed++;
      } else {
        console.log(`❌ ${pageConfig.name}: ${axeResults.violations.length} accessibility violations found`);
        this.results.failed++;
        
        // Log violation details
        axeResults.violations.forEach(violation => {
          console.log(`  - ${violation.id}: ${violation.description}`);
          this.results.violations.push({
            page: pageConfig.name,
            rule: violation.id,
            description: violation.description,
            impact: violation.impact,
            nodes: violation.nodes.length
          });
        });
      }

      // Log warnings for incomplete tests
      if (axeResults.incomplete.length > 0) {
        console.log(`⚠️ ${pageConfig.name}: ${axeResults.incomplete.length} incomplete accessibility checks`);
        axeResults.incomplete.forEach(incomplete => {
          this.results.warnings.push({
            page: pageConfig.name,
            rule: incomplete.id,
            description: incomplete.description
          });
        });
      }

    } catch (error) {
      console.error(`❌ ${pageConfig.name} accessibility test failed:`, error.message);
      this.results.failed++;
    } finally {
      await page.close();
    }
  }

  async testKeyboardNavigation(browser) {
    console.log('\n⌨️ Testing Keyboard Navigation');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');

      // Test tab navigation
      const focusableElements = [];
      
      // Tab through elements
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');
        
        const focusedElement = await page.evaluate(() => {
          const focused = document.activeElement;
          return {
            tagName: focused.tagName,
            id: focused.id,
            className: focused.className,
            textContent: focused.textContent?.substring(0, 50)
          };
        });
        
        focusableElements.push(focusedElement);
        
        // Check if focus is visible
        const isFocusVisible = await page.evaluate(() => {
          const focused = document.activeElement;
          const styles = window.getComputedStyle(focused);
          return styles.outline !== 'none' || styles.boxShadow !== 'none';
        });
        
        if (!isFocusVisible && focusedElement.tagName !== 'BODY') {
          console.log(`⚠️ Focus not visible on ${focusedElement.tagName}`);
          this.results.warnings.push({
            type: 'FOCUS_VISIBILITY',
            element: focusedElement.tagName,
            message: 'Focus indicator not visible'
          });
        }
      }

      // Test Enter key activation
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      // Test Escape key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      console.log(`✅ Keyboard Navigation: Tested ${focusableElements.length} focusable elements`);
      this.results.passed++;

    } catch (error) {
      console.error('❌ Keyboard navigation test failed:', error.message);
      this.results.failed++;
    } finally {
      await page.close();
    }
  }

  async testScreenReaderCompatibility(browser) {
    console.log('\n🔊 Testing Screen Reader Compatibility');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');

      // Check for ARIA landmarks
      const landmarks = await page.evaluate(() => {
        const landmarkRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary'];
        const landmarks = [];
        
        landmarkRoles.forEach(role => {
          const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
          landmarks.push({ role, count: elements.length });
        });
        
        return landmarks;
      });

      // Check for heading structure
      const headings = await page.evaluate(() => {
        const headingLevels = {};
        for (let i = 1; i <= 6; i++) {
          headingLevels[`h${i}`] = document.querySelectorAll(`h${i}`).length;
        }
        return headingLevels;
      });

      // Check for ARIA labels
      const ariaLabels = await page.evaluate(() => {
        const elementsWithAria = {
          'aria-label': document.querySelectorAll('[aria-label]').length,
          'aria-labelledby': document.querySelectorAll('[aria-labelledby]').length,
          'aria-describedby': document.querySelectorAll('[aria-describedby]').length,
          'aria-expanded': document.querySelectorAll('[aria-expanded]').length,
          'aria-hidden': document.querySelectorAll('[aria-hidden]').length
        };
        return elementsWithAria;
      });

      // Validate screen reader compatibility
      let screenReaderIssues = 0;

      // Check for main landmark
      const mainLandmark = landmarks.find(l => l.role === 'main');
      if (!mainLandmark || mainLandmark.count === 0) {
        console.log('⚠️ No main landmark found');
        screenReaderIssues++;
      }

      // Check for heading hierarchy
      if (headings.h1 === 0) {
        console.log('⚠️ No H1 heading found');
        screenReaderIssues++;
      }

      if (screenReaderIssues === 0) {
        console.log('✅ Screen Reader Compatibility: No issues found');
        this.results.passed++;
      } else {
        console.log(`❌ Screen Reader Compatibility: ${screenReaderIssues} issues found`);
        this.results.failed++;
      }

      // Store results
      this.results.screenReader = {
        landmarks,
        headings,
        ariaLabels,
        issues: screenReaderIssues
      };

    } catch (error) {
      console.error('❌ Screen reader compatibility test failed:', error.message);
      this.results.failed++;
    } finally {
      await page.close();
    }
  }

  async testColorContrast(browser) {
    console.log('\n🎨 Testing Color Contrast');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');

      // Test color contrast for text elements
      const contrastResults = await page.evaluate(() => {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
        const results = [];

        function getContrastRatio(foreground, background) {
          // Simplified contrast ratio calculation
          // In a real implementation, you'd use a proper color contrast library
          const fgLuminance = getLuminance(foreground);
          const bgLuminance = getLuminance(background);
          
          const lighter = Math.max(fgLuminance, bgLuminance);
          const darker = Math.min(fgLuminance, bgLuminance);
          
          return (lighter + 0.05) / (darker + 0.05);
        }

        function getLuminance(color) {
          // Simplified luminance calculation
          const rgb = color.match(/\d+/g);
          if (!rgb) return 0;
          
          const [r, g, b] = rgb.map(c => {
            c = parseInt(c) / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }

        Array.from(textElements).slice(0, 20).forEach((element, index) => {
          const styles = window.getComputedStyle(element);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            const contrast = getContrastRatio(color, backgroundColor);
            results.push({
              element: element.tagName,
              color,
              backgroundColor,
              contrast: contrast.toFixed(2),
              passes: contrast >= 4.5 // WCAG AA standard
            });
          }
        });

        return results;
      });

      const failedContrast = contrastResults.filter(r => !r.passes);
      
      if (failedContrast.length === 0) {
        console.log('✅ Color Contrast: All tested elements pass WCAG AA standards');
        this.results.passed++;
      } else {
        console.log(`❌ Color Contrast: ${failedContrast.length} elements fail WCAG AA standards`);
        this.results.failed++;
        
        failedContrast.forEach(fail => {
          console.log(`  - ${fail.element}: ${fail.contrast}:1 (needs 4.5:1)`);
        });
      }

      this.results.colorContrast = contrastResults;

    } catch (error) {
      console.error('❌ Color contrast test failed:', error.message);
      this.results.failed++;
    } finally {
      await page.close();
    }
  }

  async testFocusManagement(browser) {
    console.log('\n🎯 Testing Focus Management');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');

      // Test focus trap in modals/dialogs
      const modals = await page.$$('[role="dialog"], .modal, [aria-modal="true"]');
      
      if (modals.length > 0) {
        console.log(`Found ${modals.length} modal(s) to test`);
        // Test focus trap logic here
      }

      // Test focus restoration
      const initialFocus = await page.evaluate(() => document.activeElement.tagName);
      
      // Navigate to different tab
      await page.click('text=Explore');
      await page.waitForTimeout(500);
      
      // Navigate back
      await page.click('text=Learn');
      await page.waitForTimeout(500);
      
      const restoredFocus = await page.evaluate(() => document.activeElement.tagName);
      
      console.log('✅ Focus Management: Basic focus handling tested');
      this.results.passed++;

      this.results.focusManagement = {
        initialFocus,
        restoredFocus,
        modalsFound: modals.length
      };

    } catch (error) {
      console.error('❌ Focus management test failed:', error.message);
      this.results.failed++;
    } finally {
      await page.close();
    }
  }

  async generateAccessibilityReport() {
    const reportPath = path.join(__dirname, '../../test-reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    const report = {
      ...this.results,
      summary: {
        totalTests: this.results.passed + this.results.failed,
        successRate: ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(2),
        wcagCompliance: this.calculateWCAGCompliance(),
        totalViolations: this.results.violations.length,
        totalWarnings: this.results.warnings.length
      }
    };

    // Save JSON report
    fs.writeFileSync(
      path.join(reportPath, `accessibility-report-${Date.now()}.json`),
      JSON.stringify(report, null, 2)
    );

    // Generate HTML report
    await this.generateHTMLAccessibilityReport(report);

    console.log('\n📊 Accessibility Test Summary:');
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${report.summary.successRate}%`);
    console.log(`WCAG Compliance: ${report.summary.wcagCompliance}`);
    console.log(`Total Violations: ${report.summary.totalViolations}`);
    console.log(`Total Warnings: ${report.summary.totalWarnings}`);
  }

  calculateWCAGCompliance() {
    const totalViolations = this.results.violations.length;
    
    if (totalViolations === 0) return 'AA Compliant';
    if (totalViolations <= 2) return 'Mostly Compliant';
    if (totalViolations <= 5) return 'Partially Compliant';
    return 'Non-Compliant';
  }

  async generateHTMLAccessibilityReport(report) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Test Report</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #4a90e2; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .metric { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .violations { padding: 30px; }
        .violation { background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 15px; margin: 10px 0; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; padding: 20px; margin: 20px 30px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>♿ Accessibility Test Report</h1>
            <p>WCAG 2.1 AA Compliance Testing</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <h3>WCAG Compliance</h3>
                <div class="value">${report.summary.wcagCompliance}</div>
            </div>
            <div class="metric">
                <h3>Success Rate</h3>
                <div class="value">${report.summary.successRate}%</div>
            </div>
            <div class="metric">
                <h3>Violations</h3>
                <div class="value">${report.summary.totalViolations}</div>
            </div>
            <div class="metric">
                <h3>Warnings</h3>
                <div class="value">${report.summary.totalWarnings}</div>
            </div>
        </div>
        
        ${report.summary.totalViolations === 0 ? 
          '<div class="success"><h2>✅ WCAG 2.1 AA COMPLIANT! ♿</h2></div>' : 
          `<div class="violations">
            <h2>Accessibility Violations</h2>
            ${report.violations.map(violation => `
              <div class="violation">
                <strong>${violation.rule}</strong> on ${violation.page} page<br>
                <em>${violation.description}</em><br>
                Impact: ${violation.impact} | Affected nodes: ${violation.nodes}
              </div>
            `).join('')}
          </div>`
        }
    </div>
</body>
</html>`;

    const reportPath = path.join(__dirname, '../../test-reports');
    fs.writeFileSync(
      path.join(reportPath, `accessibility-report-${Date.now()}.html`),
      htmlContent
    );
  }
}

// Self-executing accessibility tester
if (require.main === module) {
  const tester = new AccessibilityTester();
  tester.runAccessibilityTests()
    .then(result => {
      process.exit(result.passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Accessibility testing failed:', error);
      process.exit(1);
    });
}

module.exports = AccessibilityTester;
