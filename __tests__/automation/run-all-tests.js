#!/usr/bin/env node

/**
 * Master Test Orchestrator
 * Runs all automated testing frameworks in sequence
 * Provides comprehensive production readiness validation
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Import test frameworks
const AutomatedTestRunner = require('./test-runner');
const PerformanceMonitor = require('./performance-monitor');
const AccessibilityTester = require('./accessibility-tester');
const VisualRegressionTester = require('./visual-regression');

class MasterTestOrchestrator {
  constructor() {
    this.config = {
      timeout: 1800000, // 30 minutes total timeout
      parallel: false,  // Run tests sequentially for stability
      generateCombinedReport: true,
      exitOnFirstFailure: false
    };
    
    this.results = {
      timestamp: new Date().toISOString(),
      frameworks: {},
      overall: {
        passed: 0,
        failed: 0,
        warnings: 0,
        duration: 0
      },
      productionReady: false
    };
  }

  async runAllTestFrameworks() {
    console.log('🚀 COMPREHENSIVE AUTOMATED TESTING FRAMEWORK');
    console.log('=' .repeat(80));
    console.log('🎯 Production Readiness Validation Suite');
    console.log('📊 Testing: UI, Performance, Accessibility, Visual Regression');
    console.log('⏱️ Estimated Duration: 10-15 minutes');
    console.log('=' .repeat(80));

    const startTime = Date.now();

    try {
      // Phase 1: Start the development server
      await this.startDevelopmentServer();

      // Phase 2: Core functionality tests
      await this.runCoreTests();

      // Phase 3: End-to-end tests with Playwright
      await this.runE2ETests();

      // Phase 4: Performance monitoring
      await this.runPerformanceTests();

      // Phase 5: Accessibility testing
      await this.runAccessibilityTests();

      // Phase 6: Visual regression testing
      await this.runVisualRegressionTests();

      // Phase 7: Generate combined report
      await this.generateMasterReport();

      const endTime = Date.now();
      this.results.overall.duration = endTime - startTime;

      // Determine production readiness
      this.results.productionReady = this.results.overall.failed === 0;

      // Display final results
      this.displayFinalResults();

      // Exit with appropriate code
      process.exit(this.results.productionReady ? 0 : 1);

    } catch (error) {
      console.error('💥 Critical Error in Test Orchestrator:', error);
      process.exit(1);
    }
  }

  async startDevelopmentServer() {
    console.log('\n🌐 Starting Development Server');
    console.log('-'.repeat(50));

    try {
      // Check if server is already running
      const isRunning = await this.checkServerStatus();
      
      if (isRunning) {
        console.log('✅ Development server is already running');
        return;
      }

      // Start the server
      console.log('🚀 Starting development server...');
      
      // Start server in background
      const serverProcess = spawn('npm', ['start'], {
        detached: true,
        stdio: 'pipe',
        cwd: path.join(__dirname, '../..')
      });

      // Wait for server to be ready
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      while (attempts < maxAttempts) {
        await this.sleep(1000);
        const ready = await this.checkServerStatus();
        
        if (ready) {
          console.log('✅ Development server is ready');
          return;
        }
        
        attempts++;
      }

      throw new Error('Development server failed to start within timeout');

    } catch (error) {
      console.error('❌ Failed to start development server:', error.message);
      throw error;
    }
  }

  async checkServerStatus() {
    try {
      const response = await fetch('http://localhost:8081');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async runCoreTests() {
    console.log('\n📋 Running Core Functionality Tests');
    console.log('-'.repeat(50));

    try {
      const runner = new AutomatedTestRunner();
      const result = await runner.runAllTests();
      
      this.results.frameworks.core = result;
      this.updateOverallResults(result);
      
      console.log('✅ Core tests completed');
      
    } catch (error) {
      console.error('❌ Core tests failed:', error.message);
      this.results.frameworks.core = { passed: false, error: error.message };
      this.results.overall.failed++;
    }
  }

  async runE2ETests() {
    console.log('\n🎭 Running End-to-End Tests (Playwright)');
    console.log('-'.repeat(50));

    try {
      // Run Playwright tests
      const result = execSync('npx playwright test __tests__/automation/playwright-e2e.spec.js --reporter=json', {
        encoding: 'utf8',
        timeout: 300000, // 5 minutes
        cwd: path.join(__dirname, '../..')
      });

      const playwrightResults = JSON.parse(result);
      const passed = playwrightResults.stats.failed === 0;
      
      this.results.frameworks.e2e = {
        passed,
        stats: playwrightResults.stats,
        duration: playwrightResults.stats.duration
      };

      if (passed) {
        console.log('✅ End-to-end tests completed successfully');
        this.results.overall.passed++;
      } else {
        console.log('❌ End-to-end tests failed');
        this.results.overall.failed++;
      }

    } catch (error) {
      console.error('❌ End-to-end tests failed:', error.message);
      this.results.frameworks.e2e = { passed: false, error: error.message };
      this.results.overall.failed++;
    }
  }

  async runPerformanceTests() {
    console.log('\n⚡ Running Performance Tests');
    console.log('-'.repeat(50));

    try {
      const monitor = new PerformanceMonitor();
      const result = await monitor.runPerformanceTests();
      
      this.results.frameworks.performance = result;
      this.updateOverallResults(result);
      
      console.log('✅ Performance tests completed');
      
    } catch (error) {
      console.error('❌ Performance tests failed:', error.message);
      this.results.frameworks.performance = { passed: false, error: error.message };
      this.results.overall.failed++;
    }
  }

  async runAccessibilityTests() {
    console.log('\n♿ Running Accessibility Tests');
    console.log('-'.repeat(50));

    try {
      const tester = new AccessibilityTester();
      const result = await tester.runAccessibilityTests();
      
      this.results.frameworks.accessibility = result;
      this.updateOverallResults(result);
      
      console.log('✅ Accessibility tests completed');
      
    } catch (error) {
      console.error('❌ Accessibility tests failed:', error.message);
      this.results.frameworks.accessibility = { passed: false, error: error.message };
      this.results.overall.failed++;
    }
  }

  async runVisualRegressionTests() {
    console.log('\n👁️ Running Visual Regression Tests');
    console.log('-'.repeat(50));

    try {
      const tester = new VisualRegressionTester();
      const result = await tester.runVisualRegressionTests();
      
      this.results.frameworks.visualRegression = result;
      this.updateOverallResults(result);
      
      console.log('✅ Visual regression tests completed');
      
    } catch (error) {
      console.error('❌ Visual regression tests failed:', error.message);
      this.results.frameworks.visualRegression = { passed: false, error: error.message };
      this.results.overall.failed++;
    }
  }

  updateOverallResults(result) {
    if (result.passed) {
      this.results.overall.passed++;
    } else {
      this.results.overall.failed++;
    }
  }

  async generateMasterReport() {
    console.log('\n📊 Generating Master Test Report');
    console.log('-'.repeat(50));

    const reportPath = path.join(__dirname, '../../test-reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    // Generate comprehensive JSON report
    const masterReport = {
      ...this.results,
      summary: {
        totalFrameworks: Object.keys(this.results.frameworks).length,
        successRate: ((this.results.overall.passed / (this.results.overall.passed + this.results.overall.failed)) * 100).toFixed(2),
        duration: `${(this.results.overall.duration / 1000 / 60).toFixed(2)} minutes`,
        productionReady: this.results.productionReady,
        timestamp: new Date().toISOString()
      },
      recommendations: this.generateRecommendations()
    };

    // Save master report
    fs.writeFileSync(
      path.join(reportPath, `master-test-report-${Date.now()}.json`),
      JSON.stringify(masterReport, null, 2)
    );

    // Generate HTML dashboard
    await this.generateHTMLDashboard(masterReport);

    console.log('✅ Master report generated successfully');
  }

  generateRecommendations() {
    const recommendations = [];

    // Check each framework result and provide recommendations
    Object.entries(this.results.frameworks).forEach(([framework, result]) => {
      if (!result.passed) {
        switch (framework) {
          case 'core':
            recommendations.push('Fix failing unit tests and integration tests before deployment');
            break;
          case 'performance':
            recommendations.push('Optimize application performance - check bundle size, memory usage, and load times');
            break;
          case 'accessibility':
            recommendations.push('Address accessibility violations to ensure WCAG 2.1 AA compliance');
            break;
          case 'visualRegression':
            recommendations.push('Review visual changes and update baselines if intentional');
            break;
          case 'e2e':
            recommendations.push('Fix end-to-end test failures - check user flows and UI interactions');
            break;
        }
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('🎉 All tests passed! Application is production-ready.');
    }

    return recommendations;
  }

  async generateHTMLDashboard(report) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Production Readiness Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; }
        .dashboard { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
        .status { display: inline-block; padding: 10px 20px; border-radius: 25px; font-weight: bold; margin-top: 15px; }
        .status.ready { background: #10b981; }
        .status.not-ready { background: #ef4444; }
        .frameworks { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .framework { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .framework h3 { margin-bottom: 15px; color: #1f2937; }
        .framework-status { display: inline-block; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: bold; }
        .framework-status.passed { background: #d1fae5; color: #065f46; }
        .framework-status.failed { background: #fee2e2; color: #991b1b; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px; }
        .metric { text-align: center; padding: 15px; background: #f9fafb; border-radius: 8px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #1f2937; }
        .metric-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
        .recommendations { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .recommendations h3 { margin-bottom: 15px; color: #1f2937; }
        .recommendations ul { list-style: none; }
        .recommendations li { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .recommendations li:last-child { border-bottom: none; }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🚀 Production Readiness Dashboard</h1>
            <p>Comprehensive Automated Testing Results</p>
            <div class="status ${report.summary.productionReady ? 'ready' : 'not-ready'}">
                ${report.summary.productionReady ? '✅ PRODUCTION READY' : '❌ NOT PRODUCTION READY'}
            </div>
            <p style="margin-top: 15px;">Generated on ${new Date(report.timestamp).toLocaleString()}</p>
        </div>

        <div class="metrics">
            <div class="metric">
                <div class="metric-value">${report.summary.totalFrameworks}</div>
                <div class="metric-label">Test Frameworks</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.summary.successRate}%</div>
                <div class="metric-label">Success Rate</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.overall.passed}</div>
                <div class="metric-label">Passed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.overall.failed}</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.summary.duration}</div>
                <div class="metric-label">Duration</div>
            </div>
        </div>

        <div class="frameworks">
            ${Object.entries(report.frameworks).map(([name, result]) => `
                <div class="framework">
                    <h3>${this.formatFrameworkName(name)}</h3>
                    <div class="framework-status ${result.passed ? 'passed' : 'failed'}">
                        ${result.passed ? '✅ PASSED' : '❌ FAILED'}
                    </div>
                    <p style="margin-top: 10px; color: #6b7280; font-size: 14px;">
                        ${this.getFrameworkDescription(name)}
                    </p>
                </div>
            `).join('')}
        </div>

        <div class="recommendations">
            <h3>📋 Recommendations</h3>
            <ul>
                ${report.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
            </ul>
        </div>
    </div>
</body>
</html>`;

    const reportPath = path.join(__dirname, '../../test-reports');
    fs.writeFileSync(
      path.join(reportPath, `production-readiness-dashboard-${Date.now()}.html`),
      htmlContent
    );
  }

  formatFrameworkName(name) {
    const names = {
      core: '📋 Core Functionality',
      e2e: '🎭 End-to-End Testing',
      performance: '⚡ Performance Monitoring',
      accessibility: '♿ Accessibility Testing',
      visualRegression: '👁️ Visual Regression'
    };
    return names[name] || name;
  }

  getFrameworkDescription(name) {
    const descriptions = {
      core: 'Unit tests, integration tests, and core functionality validation',
      e2e: 'User flow testing, UI interactions, and cross-browser compatibility',
      performance: 'Load times, memory usage, bundle size, and performance metrics',
      accessibility: 'WCAG 2.1 AA compliance, keyboard navigation, and screen reader support',
      visualRegression: 'Screenshot comparison, responsive design, and visual consistency'
    };
    return descriptions[name] || 'Automated testing framework';
  }

  displayFinalResults() {
    console.log('\n' + '=' .repeat(80));
    console.log('🎯 FINAL PRODUCTION READINESS RESULTS');
    console.log('=' .repeat(80));
    
    console.log(`📊 Overall Status: ${this.results.productionReady ? '✅ PRODUCTION READY' : '❌ NOT PRODUCTION READY'}`);
    console.log(`⏱️ Total Duration: ${(this.results.overall.duration / 1000 / 60).toFixed(2)} minutes`);
    console.log(`✅ Frameworks Passed: ${this.results.overall.passed}`);
    console.log(`❌ Frameworks Failed: ${this.results.overall.failed}`);
    console.log(`📈 Success Rate: ${((this.results.overall.passed / (this.results.overall.passed + this.results.overall.failed)) * 100).toFixed(2)}%`);
    
    console.log('\n📋 Framework Results:');
    Object.entries(this.results.frameworks).forEach(([name, result]) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`  ${status} ${this.formatFrameworkName(name)}: ${result.passed ? 'PASSED' : 'FAILED'}`);
    });
    
    if (this.results.productionReady) {
      console.log('\n🎉 CONGRATULATIONS! Your application is ready for production deployment! 🚀');
    } else {
      console.log('\n⚠️ Please address the failing tests before deploying to production.');
    }
    
    console.log('=' .repeat(80));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Self-executing master orchestrator
if (require.main === module) {
  const orchestrator = new MasterTestOrchestrator();
  orchestrator.runAllTestFrameworks().catch(console.error);
}

module.exports = MasterTestOrchestrator;
