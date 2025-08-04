/**
 * Comprehensive Performance Monitoring Framework
 * Automated performance testing, memory leak detection, and optimization validation
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.config = {
      baseURL: 'http://localhost:8081',
      timeout: 30000,
      thresholds: {
        loadTime: 3000,           // 3 seconds
        firstContentfulPaint: 1500, // 1.5 seconds
        largestContentfulPaint: 2500, // 2.5 seconds
        cumulativeLayoutShift: 0.1,   // CLS score
        firstInputDelay: 100,     // 100ms
        memoryUsage: 50 * 1024 * 1024, // 50MB
        bundleSize: 2 * 1024 * 1024,   // 2MB
        renderTime: 100           // 100ms
      },
      iterations: 3,
      warmupRuns: 1
    };
    
    this.results = {
      timestamp: new Date().toISOString(),
      metrics: {},
      passed: 0,
      failed: 0,
      warnings: []
    };
  }

  async runPerformanceTests() {
    console.log('⚡ Starting Comprehensive Performance Testing');
    console.log('=' .repeat(60));

    const browser = await chromium.launch({ headless: true });
    
    try {
      // Core Web Vitals Testing
      await this.testCoreWebVitals(browser);
      
      // Memory Usage Testing
      await this.testMemoryUsage(browser);
      
      // Bundle Size Analysis
      await this.testBundleSize(browser);
      
      // Render Performance Testing
      await this.testRenderPerformance(browser);
      
      // Memory Leak Detection
      await this.testMemoryLeaks(browser);
      
      // Network Performance Testing
      await this.testNetworkPerformance(browser);
      
      // Generate performance report
      await this.generatePerformanceReport();
      
      const overallPassed = this.results.failed === 0;
      console.log(`\n📊 Performance Test Results: ${overallPassed ? '✅ PASSED' : '❌ FAILED'}`);
      
      return {
        passed: overallPassed,
        results: this.results
      };
      
    } finally {
      await browser.close();
    }
  }

  async testCoreWebVitals(browser) {
    console.log('\n🎯 Testing Core Web Vitals');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      // Enable performance monitoring
      await page.goto('about:blank');
      
      // Inject performance monitoring script
      await page.addInitScript(() => {
        window.performanceMetrics = {
          navigationStart: 0,
          loadComplete: 0,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0,
          firstInputDelay: 0
        };

        // Monitor navigation timing
        window.addEventListener('load', () => {
          const navigation = performance.getEntriesByType('navigation')[0];
          window.performanceMetrics.navigationStart = navigation.startTime;
          window.performanceMetrics.loadComplete = navigation.loadEventEnd - navigation.startTime;
        });

        // Monitor paint timing
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              window.performanceMetrics.firstContentfulPaint = entry.startTime;
            }
            if (entry.name === 'largest-contentful-paint') {
              window.performanceMetrics.largestContentfulPaint = entry.value;
            }
          }
        });
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

        // Monitor layout shifts
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          window.performanceMetrics.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      });

      // Navigate to the application
      const startTime = Date.now();
      await page.goto(this.config.baseURL);
      await page.waitForSelector('body', { timeout: this.config.timeout });
      const loadTime = Date.now() - startTime;

      // Wait for metrics to be collected
      await page.waitForTimeout(2000);

      // Collect performance metrics
      const metrics = await page.evaluate(() => window.performanceMetrics);
      
      // Test load time
      this.testMetric('loadTime', loadTime, this.config.thresholds.loadTime, 'ms');
      
      // Test Core Web Vitals
      if (metrics.firstContentfulPaint > 0) {
        this.testMetric('firstContentfulPaint', metrics.firstContentfulPaint, 
          this.config.thresholds.firstContentfulPaint, 'ms');
      }
      
      if (metrics.largestContentfulPaint > 0) {
        this.testMetric('largestContentfulPaint', metrics.largestContentfulPaint, 
          this.config.thresholds.largestContentfulPaint, 'ms');
      }
      
      if (metrics.cumulativeLayoutShift >= 0) {
        this.testMetric('cumulativeLayoutShift', metrics.cumulativeLayoutShift, 
          this.config.thresholds.cumulativeLayoutShift, 'score');
      }

      this.results.metrics.coreWebVitals = {
        loadTime,
        ...metrics
      };

    } catch (error) {
      console.error('❌ Core Web Vitals test failed:', error.message);
      this.results.failed++;
    } finally {
      await page.close();
    }
  }

  async testMemoryUsage(browser) {
    console.log('\n🧠 Testing Memory Usage');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');
      
      // Wait for app to stabilize
      await page.waitForTimeout(3000);
      
      // Get memory usage
      const memoryUsage = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });

      if (memoryUsage) {
        this.testMetric('memoryUsage', memoryUsage.usedJSHeapSize, 
          this.config.thresholds.memoryUsage, 'bytes');
        
        this.results.metrics.memoryUsage = memoryUsage;
      } else {
        console.log('⚠️ Memory API not available in this browser');
        this.results.warnings.push('Memory API not available');
      }

    } catch (error) {
      console.error('❌ Memory usage test failed:', error.message);
      this.results.failed++;
    } finally {
      await page.close();
    }
  }

  async testBundleSize(browser) {
    console.log('\n📦 Testing Bundle Size');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    let totalSize = 0;
    
    try {
      // Monitor network requests
      page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('.js') || url.includes('.css')) {
          try {
            const buffer = await response.body();
            totalSize += buffer.length;
          } catch (e) {
            // Ignore errors for individual resources
          }
        }
      });

      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');
      await page.waitForTimeout(3000);

      this.testMetric('bundleSize', totalSize, this.config.thresholds.bundleSize, 'bytes');
      this.results.metrics.bundleSize = totalSize;

    } catch (error) {
      console.error('❌ Bundle size test failed:', error.message);
      this.results.failed++;
    } finally {
      await page.close();
    }
  }

  async testRenderPerformance(browser) {
    console.log('\n🎨 Testing Render Performance');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');

      // Test component render times
      const renderTimes = [];
      
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        
        // Trigger re-render by navigating between tabs
        await page.click('text=Explore');
        await page.waitForTimeout(100);
        await page.click('text=Learn');
        await page.waitForTimeout(100);
        
        const renderTime = Date.now() - startTime;
        renderTimes.push(renderTime);
      }

      const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
      
      this.testMetric('renderTime', avgRenderTime, this.config.thresholds.renderTime, 'ms');
      this.results.metrics.renderPerformance = {
        averageRenderTime: avgRenderTime,
        renderTimes
      };

    } catch (error) {
      console.error('❌ Render performance test failed:', error.message);
      this.results.failed++;
    } finally {
      await page.close();
    }
  }

  async testMemoryLeaks(browser) {
    console.log('\n🔍 Testing Memory Leaks');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    
    try {
      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');

      // Get initial memory
      const initialMemory = await page.evaluate(() => 
        performance.memory ? performance.memory.usedJSHeapSize : 0
      );

      // Perform memory-intensive operations
      for (let i = 0; i < 10; i++) {
        // Navigate between tabs
        await page.click('text=Explore');
        await page.waitForTimeout(200);
        await page.click('text=Progress');
        await page.waitForTimeout(200);
        await page.click('text=Profile');
        await page.waitForTimeout(200);
        await page.click('text=Learn');
        await page.waitForTimeout(200);
      }

      // Force garbage collection if available
      await page.evaluate(() => {
        if (window.gc) {
          window.gc();
        }
      });

      await page.waitForTimeout(1000);

      // Get final memory
      const finalMemory = await page.evaluate(() => 
        performance.memory ? performance.memory.usedJSHeapSize : 0
      );

      const memoryIncrease = finalMemory - initialMemory;
      const memoryLeakThreshold = 10 * 1024 * 1024; // 10MB

      this.testMetric('memoryLeak', memoryIncrease, memoryLeakThreshold, 'bytes');
      this.results.metrics.memoryLeak = {
        initialMemory,
        finalMemory,
        memoryIncrease
      };

    } catch (error) {
      console.error('❌ Memory leak test failed:', error.message);
      this.results.failed++;
    } finally {
      await page.close();
    }
  }

  async testNetworkPerformance(browser) {
    console.log('\n🌐 Testing Network Performance');
    console.log('-'.repeat(40));

    const page = await browser.newPage();
    const networkMetrics = {
      requests: 0,
      totalSize: 0,
      slowRequests: 0
    };
    
    try {
      page.on('response', async (response) => {
        networkMetrics.requests++;
        
        const timing = response.timing();
        const responseTime = timing.responseEnd - timing.requestStart;
        
        if (responseTime > 1000) { // Slow request threshold: 1 second
          networkMetrics.slowRequests++;
        }
        
        try {
          const buffer = await response.body();
          networkMetrics.totalSize += buffer.length;
        } catch (e) {
          // Ignore errors for individual resources
        }
      });

      await page.goto(this.config.baseURL);
      await page.waitForSelector('body');
      await page.waitForTimeout(3000);

      // Test network efficiency
      const efficiency = networkMetrics.slowRequests / networkMetrics.requests;
      const maxSlowRequestRatio = 0.1; // Max 10% slow requests

      this.testMetric('networkEfficiency', efficiency, maxSlowRequestRatio, 'ratio');
      this.results.metrics.networkPerformance = networkMetrics;

    } catch (error) {
      console.error('❌ Network performance test failed:', error.message);
      this.results.failed++;
    } finally {
      await page.close();
    }
  }

  testMetric(name, value, threshold, unit) {
    const passed = value <= threshold;
    
    if (passed) {
      console.log(`✅ ${name}: ${this.formatValue(value, unit)} (threshold: ${this.formatValue(threshold, unit)})`);
      this.results.passed++;
    } else {
      console.log(`❌ ${name}: ${this.formatValue(value, unit)} exceeds threshold ${this.formatValue(threshold, unit)}`);
      this.results.failed++;
    }
  }

  formatValue(value, unit) {
    switch (unit) {
      case 'bytes':
        return `${(value / 1024 / 1024).toFixed(2)}MB`;
      case 'ms':
        return `${value.toFixed(2)}ms`;
      case 'score':
        return value.toFixed(3);
      case 'ratio':
        return `${(value * 100).toFixed(1)}%`;
      default:
        return value.toString();
    }
  }

  async generatePerformanceReport() {
    const reportPath = path.join(__dirname, '../../test-reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    const report = {
      ...this.results,
      summary: {
        totalTests: this.results.passed + this.results.failed,
        successRate: ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(2),
        performanceGrade: this.calculatePerformanceGrade()
      }
    };

    // Save JSON report
    fs.writeFileSync(
      path.join(reportPath, `performance-report-${Date.now()}.json`),
      JSON.stringify(report, null, 2)
    );

    console.log('\n📊 Performance Test Summary:');
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${report.summary.successRate}%`);
    console.log(`Performance Grade: ${report.summary.performanceGrade}`);
  }

  calculatePerformanceGrade() {
    const successRate = (this.results.passed / (this.results.passed + this.results.failed)) * 100;
    
    if (successRate >= 95) return 'A+';
    if (successRate >= 90) return 'A';
    if (successRate >= 85) return 'B+';
    if (successRate >= 80) return 'B';
    if (successRate >= 75) return 'C+';
    if (successRate >= 70) return 'C';
    return 'F';
  }
}

// Self-executing performance monitor
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.runPerformanceTests()
    .then(result => {
      process.exit(result.passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Performance testing failed:', error);
      process.exit(1);
    });
}

module.exports = PerformanceMonitor;
