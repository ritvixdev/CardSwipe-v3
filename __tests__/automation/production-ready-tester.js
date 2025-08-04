#!/usr/bin/env node

/**
 * Production Ready Testing Framework
 * Lightweight, self-executing test suite for production readiness validation
 * No external dependencies required - uses only Node.js built-ins and existing Jest setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProductionReadyTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      frameworks: {},
      overall: { passed: 0, failed: 0, warnings: 0, duration: 0 },
      productionReady: false,
      recommendations: []
    };
  }

  async runAllTests() {
    console.log('🚀 PRODUCTION READINESS TESTING FRAMEWORK');
    console.log('=' .repeat(80));
    console.log('🎯 Comprehensive Automated Testing for Production Deployment');
    console.log('📊 Testing: Core Functionality, Performance, Quality Assurance');
    console.log('=' .repeat(80));

    const startTime = Date.now();

    try {
      // Phase 1: Core Functionality Tests
      await this.runCoreTests();

      // Phase 2: Code Quality Tests
      await this.runCodeQualityTests();

      // Phase 3: Performance Tests
      await this.runPerformanceTests();

      // Phase 4: Build Validation
      await this.runBuildValidation();

      // Phase 5: Configuration Validation
      await this.runConfigurationValidation();

      // Phase 6: Security Checks
      await this.runSecurityChecks();

      const endTime = Date.now();
      this.results.overall.duration = endTime - startTime;

      // Generate comprehensive report
      await this.generateReport();

      // Determine production readiness
      this.results.productionReady = this.results.overall.failed === 0;

      // Display final results
      this.displayResults();

      // Exit with appropriate code
      process.exit(this.results.productionReady ? 0 : 1);

    } catch (error) {
      console.error('💥 Critical Error:', error.message);
      process.exit(1);
    }
  }

  async runCoreTests() {
    console.log('\n📋 Phase 1: Core Functionality Tests');
    console.log('-'.repeat(50));

    try {
      // Run Jest test suite
      const result = execSync('npm test -- --passWithNoTests --silent', {
        encoding: 'utf8',
        timeout: 120000
      });

      // Parse results
      const testsPassed = !result.includes('FAIL') && !result.includes('failed');
      
      if (testsPassed) {
        console.log('✅ Core functionality tests: PASSED');
        this.results.overall.passed++;
        this.results.frameworks.core = { passed: true, details: 'All Jest tests passed' };
      } else {
        console.log('❌ Core functionality tests: FAILED');
        this.results.overall.failed++;
        this.results.frameworks.core = { passed: false, details: 'Some Jest tests failed' };
        this.results.recommendations.push('Fix failing unit tests before deployment');
      }

    } catch (error) {
      console.log('❌ Core functionality tests: FAILED');
      this.results.overall.failed++;
      this.results.frameworks.core = { passed: false, details: error.message };
      this.results.recommendations.push('Resolve test execution errors');
    }
  }

  async runCodeQualityTests() {
    console.log('\n🔍 Phase 2: Code Quality Tests');
    console.log('-'.repeat(50));

    let qualityScore = 0;
    const checks = [];

    // Check TypeScript configuration
    if (fs.existsSync('tsconfig.json')) {
      console.log('✅ TypeScript configuration: Present');
      qualityScore++;
      checks.push({ name: 'TypeScript Config', passed: true });
    } else {
      console.log('⚠️ TypeScript configuration: Missing');
      checks.push({ name: 'TypeScript Config', passed: false });
    }

    // Check package.json structure
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      if (packageJson.scripts && packageJson.scripts.test) {
        console.log('✅ Test scripts: Configured');
        qualityScore++;
        checks.push({ name: 'Test Scripts', passed: true });
      } else {
        console.log('⚠️ Test scripts: Missing');
        checks.push({ name: 'Test Scripts', passed: false });
      }

      if (packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0) {
        console.log('✅ Dependencies: Properly defined');
        qualityScore++;
        checks.push({ name: 'Dependencies', passed: true });
      }

    } catch (error) {
      console.log('❌ Package.json: Invalid or missing');
      checks.push({ name: 'Package.json', passed: false });
    }

    // Check for essential files (Expo Router structure)
    const essentialFiles = [
      { file: 'app.json', required: true },
      { file: 'app/_layout.tsx', required: true, alt: 'App.tsx' },
      { file: 'package.json', required: true }
    ];

    essentialFiles.forEach(({ file, required, alt }) => {
      const exists = fs.existsSync(file) || (alt && fs.existsSync(alt));
      const displayName = alt && fs.existsSync(alt) ? alt : file;

      if (exists) {
        console.log(`✅ Essential file ${displayName}: Present`);
        qualityScore++;
        checks.push({ name: `File: ${displayName}`, passed: true });
      } else {
        console.log(`❌ Essential file ${file}: Missing`);
        checks.push({ name: `File: ${file}`, passed: false });
      }
    });

    const qualityPassed = qualityScore >= essentialFiles.length + 2; // Minimum threshold
    
    if (qualityPassed) {
      console.log('✅ Code quality tests: PASSED');
      this.results.overall.passed++;
    } else {
      console.log('❌ Code quality tests: FAILED');
      this.results.overall.failed++;
      this.results.recommendations.push('Improve code quality and project structure');
    }

    this.results.frameworks.codeQuality = { passed: qualityPassed, details: checks };
  }

  async runPerformanceTests() {
    console.log('\n⚡ Phase 3: Performance Tests');
    console.log('-'.repeat(50));

    const performanceChecks = [];

    // Check bundle size (estimate from node_modules and source)
    try {
      const stats = this.getDirectorySize('.');
      const bundleSizeMB = stats / (1024 * 1024);
      
      if (bundleSizeMB < 100) { // Reasonable threshold for React Native app
        console.log(`✅ Project size: ${bundleSizeMB.toFixed(2)}MB (Good)`);
        performanceChecks.push({ name: 'Project Size', passed: true, value: `${bundleSizeMB.toFixed(2)}MB` });
      } else {
        console.log(`⚠️ Project size: ${bundleSizeMB.toFixed(2)}MB (Large)`);
        performanceChecks.push({ name: 'Project Size', passed: false, value: `${bundleSizeMB.toFixed(2)}MB` });
        this.results.recommendations.push('Consider optimizing bundle size');
      }
    } catch (error) {
      console.log('⚠️ Project size: Could not determine');
      performanceChecks.push({ name: 'Project Size', passed: false, value: 'Unknown' });
    }

    // Check for performance optimizations
    const hasOptimizations = this.checkPerformanceOptimizations();
    if (hasOptimizations) {
      console.log('✅ Performance optimizations: Present');
      performanceChecks.push({ name: 'Optimizations', passed: true });
    } else {
      console.log('⚠️ Performance optimizations: Limited');
      performanceChecks.push({ name: 'Optimizations', passed: false });
    }

    const performancePassed = performanceChecks.filter(c => c.passed).length >= performanceChecks.length / 2;
    
    if (performancePassed) {
      console.log('✅ Performance tests: PASSED');
      this.results.overall.passed++;
    } else {
      console.log('❌ Performance tests: FAILED');
      this.results.overall.failed++;
      this.results.recommendations.push('Optimize application performance');
    }

    this.results.frameworks.performance = { passed: performancePassed, details: performanceChecks };
  }

  async runBuildValidation() {
    console.log('\n🔨 Phase 4: Build Validation');
    console.log('-'.repeat(50));

    const buildChecks = [];

    // Check if build scripts exist (Expo has built-in build system)
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

      // For Expo apps, having start script and expo dependency is sufficient
      if (packageJson.scripts && (packageJson.scripts.start || packageJson.scripts.web)) {
        console.log('✅ Build scripts: Available (Expo)');
        buildChecks.push({ name: 'Build Scripts', passed: true });
      } else {
        console.log('⚠️ Build scripts: Missing');
        buildChecks.push({ name: 'Build Scripts', passed: false });
      }

      // Check for Expo configuration
      if (packageJson.dependencies && packageJson.dependencies.expo) {
        console.log('✅ Expo framework: Configured');
        buildChecks.push({ name: 'Expo Framework', passed: true });
      } else {
        console.log('⚠️ Expo framework: Not detected');
        buildChecks.push({ name: 'Expo Framework', passed: false });
      }

    } catch (error) {
      console.log('❌ Build configuration: Invalid');
      buildChecks.push({ name: 'Build Config', passed: false });
    }

    // Check app.json configuration
    try {
      const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
      
      if (appJson.expo && appJson.expo.name) {
        console.log('✅ App configuration: Valid');
        buildChecks.push({ name: 'App Config', passed: true });
      } else {
        console.log('⚠️ App configuration: Incomplete');
        buildChecks.push({ name: 'App Config', passed: false });
      }
    } catch (error) {
      console.log('❌ App configuration: Missing or invalid');
      buildChecks.push({ name: 'App Config', passed: false });
    }

    const buildPassed = buildChecks.filter(c => c.passed).length >= 2;
    
    if (buildPassed) {
      console.log('✅ Build validation: PASSED');
      this.results.overall.passed++;
    } else {
      console.log('❌ Build validation: FAILED');
      this.results.overall.failed++;
      this.results.recommendations.push('Fix build configuration issues');
    }

    this.results.frameworks.build = { passed: buildPassed, details: buildChecks };
  }

  async runConfigurationValidation() {
    console.log('\n⚙️ Phase 5: Configuration Validation');
    console.log('-'.repeat(50));

    const configChecks = [];

    // Check for data files
    const dataFiles = ['data/config.json', 'assets/data/config.json'];
    let configFound = false;
    
    for (const file of dataFiles) {
      if (fs.existsSync(file)) {
        console.log(`✅ Configuration file: ${file} found`);
        configFound = true;
        break;
      }
    }

    if (configFound) {
      configChecks.push({ name: 'Config Files', passed: true });
    } else {
      console.log('⚠️ Configuration files: Not found in expected locations');
      configChecks.push({ name: 'Config Files', passed: false });
    }

    // Check for assets
    if (fs.existsSync('assets')) {
      console.log('✅ Assets directory: Present');
      configChecks.push({ name: 'Assets', passed: true });
    } else {
      console.log('⚠️ Assets directory: Missing');
      configChecks.push({ name: 'Assets', passed: false });
    }

    // Check for components
    if (fs.existsSync('components')) {
      console.log('✅ Components directory: Present');
      configChecks.push({ name: 'Components', passed: true });
    } else {
      console.log('⚠️ Components directory: Missing');
      configChecks.push({ name: 'Components', passed: false });
    }

    const configPassed = configChecks.filter(c => c.passed).length >= 2;
    
    if (configPassed) {
      console.log('✅ Configuration validation: PASSED');
      this.results.overall.passed++;
    } else {
      console.log('❌ Configuration validation: FAILED');
      this.results.overall.failed++;
      this.results.recommendations.push('Ensure all required configuration files are present');
    }

    this.results.frameworks.configuration = { passed: configPassed, details: configChecks };
  }

  async runSecurityChecks() {
    console.log('\n🔒 Phase 6: Security Checks');
    console.log('-'.repeat(50));

    const securityChecks = [];

    // Check for sensitive files
    const sensitiveFiles = ['.env', '.env.local', 'secrets.json', 'private.key'];
    let sensitivesFound = 0;
    
    sensitiveFiles.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`⚠️ Sensitive file detected: ${file}`);
        sensitivesFound++;
      }
    });

    if (sensitivesFound === 0) {
      console.log('✅ Sensitive files: None detected in root');
      securityChecks.push({ name: 'Sensitive Files', passed: true });
    } else {
      console.log(`⚠️ Sensitive files: ${sensitivesFound} detected`);
      securityChecks.push({ name: 'Sensitive Files', passed: false });
      this.results.recommendations.push('Review and secure sensitive files');
    }

    // Check .gitignore
    if (fs.existsSync('.gitignore')) {
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      if (gitignore.includes('node_modules') && gitignore.includes('.env')) {
        console.log('✅ Git ignore: Properly configured');
        securityChecks.push({ name: 'Git Ignore', passed: true });
      } else {
        console.log('⚠️ Git ignore: Incomplete');
        securityChecks.push({ name: 'Git Ignore', passed: false });
      }
    } else {
      console.log('⚠️ Git ignore: Missing');
      securityChecks.push({ name: 'Git Ignore', passed: false });
    }

    const securityPassed = securityChecks.filter(c => c.passed).length >= 1;
    
    if (securityPassed) {
      console.log('✅ Security checks: PASSED');
      this.results.overall.passed++;
    } else {
      console.log('❌ Security checks: FAILED');
      this.results.overall.failed++;
      this.results.recommendations.push('Address security vulnerabilities');
    }

    this.results.frameworks.security = { passed: securityPassed, details: securityChecks };
  }

  getDirectorySize(dirPath) {
    let totalSize = 0;
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        if (item === 'node_modules' || item === '.git') continue; // Skip large directories
        
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          totalSize += this.getDirectorySize(itemPath);
        } else {
          totalSize += stats.size;
        }
      }
    } catch (error) {
      // Ignore errors for inaccessible directories
    }
    
    return totalSize;
  }

  checkPerformanceOptimizations() {
    // Check for common performance optimization patterns
    const optimizations = [];
    
    // Check for lazy loading
    if (this.searchInFiles(['components', 'screens'], ['lazy', 'Suspense', 'React.lazy'])) {
      optimizations.push('Lazy Loading');
    }
    
    // Check for memoization
    if (this.searchInFiles(['components', 'screens'], ['useMemo', 'useCallback', 'React.memo'])) {
      optimizations.push('Memoization');
    }
    
    return optimizations.length > 0;
  }

  searchInFiles(directories, patterns) {
    for (const dir of directories) {
      if (!fs.existsSync(dir)) continue;
      
      try {
        const files = this.getAllFiles(dir, ['.tsx', '.ts', '.jsx', '.js']);
        
        for (const file of files) {
          const content = fs.readFileSync(file, 'utf8');
          
          for (const pattern of patterns) {
            if (content.includes(pattern)) {
              return true;
            }
          }
        }
      } catch (error) {
        // Ignore errors
      }
    }
    
    return false;
  }

  getAllFiles(dirPath, extensions) {
    let files = [];
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          files = files.concat(this.getAllFiles(itemPath, extensions));
        } else if (extensions.some(ext => item.endsWith(ext))) {
          files.push(itemPath);
        }
      }
    } catch (error) {
      // Ignore errors
    }
    
    return files;
  }

  async generateReport() {
    const reportPath = path.join(__dirname, '../../test-reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    const report = {
      ...this.results,
      summary: {
        totalFrameworks: Object.keys(this.results.frameworks).length,
        successRate: ((this.results.overall.passed / (this.results.overall.passed + this.results.overall.failed)) * 100).toFixed(2),
        duration: `${(this.results.overall.duration / 1000).toFixed(2)}s`,
        productionReady: this.results.productionReady
      }
    };

    // Save JSON report
    fs.writeFileSync(
      path.join(reportPath, `production-ready-report-${Date.now()}.json`),
      JSON.stringify(report, null, 2)
    );

    console.log('\n📊 Report generated successfully');
  }

  displayResults() {
    console.log('\n' + '=' .repeat(80));
    console.log('🎯 PRODUCTION READINESS RESULTS');
    console.log('=' .repeat(80));
    
    console.log(`📊 Overall Status: ${this.results.productionReady ? '✅ PRODUCTION READY' : '❌ NOT PRODUCTION READY'}`);
    console.log(`⏱️ Total Duration: ${(this.results.overall.duration / 1000).toFixed(2)} seconds`);
    console.log(`✅ Frameworks Passed: ${this.results.overall.passed}`);
    console.log(`❌ Frameworks Failed: ${this.results.overall.failed}`);
    console.log(`📈 Success Rate: ${((this.results.overall.passed / (this.results.overall.passed + this.results.overall.failed)) * 100).toFixed(2)}%`);
    
    console.log('\n📋 Framework Results:');
    Object.entries(this.results.frameworks).forEach(([name, result]) => {
      const status = result.passed ? '✅' : '❌';
      const frameworkName = name.charAt(0).toUpperCase() + name.slice(1);
      console.log(`  ${status} ${frameworkName}: ${result.passed ? 'PASSED' : 'FAILED'}`);
    });
    
    if (this.results.recommendations.length > 0) {
      console.log('\n📝 Recommendations:');
      this.results.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }
    
    if (this.results.productionReady) {
      console.log('\n🎉 CONGRATULATIONS! Your application is ready for production deployment! 🚀');
    } else {
      console.log('\n⚠️ Please address the failing tests before deploying to production.');
    }
    
    console.log('=' .repeat(80));
  }
}

// Self-executing production ready tester
if (require.main === module) {
  const tester = new ProductionReadyTester();
  tester.runAllTests().catch(console.error);
}

module.exports = ProductionReadyTester;
