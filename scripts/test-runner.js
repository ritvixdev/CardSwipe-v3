#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🔄 ${description}...`, 'cyan');
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log(`✅ ${description} completed successfully`, 'green');
    return { success: true, output };
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    log(error.stdout || error.message, 'red');
    return { success: false, error: error.stdout || error.message };
  }
}

function checkTestFiles() {
  const testDirs = ['__tests__'];
  const testFiles = [];
  
  testDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir, { recursive: true });
      files.forEach(file => {
        if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
          testFiles.push(path.join(dir, file));
        }
      });
    }
  });
  
  return testFiles;
}

function generateTestReport(results) {
  log('\n📊 TEST REPORT', 'bright');
  log('=' * 50, 'blue');
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  
  log(`Total Tests: ${totalTests}`, 'blue');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`, 
      passedTests === totalTests ? 'green' : 'yellow');
  
  if (failedTests > 0) {
    log('\n❌ FAILED TESTS:', 'red');
    results.forEach(result => {
      if (!result.success) {
        log(`  - ${result.name}`, 'red');
      }
    });
  }
  
  log('\n' + '=' * 50, 'blue');
}

async function main() {
  log('🧪 COMPREHENSIVE TEST SUITE', 'bright');
  log('Starting automated testing for Tinder-Style Learning App\n', 'cyan');
  
  // Check if test files exist
  const testFiles = checkTestFiles();
  if (testFiles.length === 0) {
    log('⚠️  No test files found!', 'yellow');
    return;
  }
  
  log(`Found ${testFiles.length} test files:`, 'blue');
  testFiles.forEach(file => log(`  - ${file}`, 'blue'));
  
  const results = [];
  
  // 1. Install dependencies if needed
  if (!fs.existsSync('node_modules')) {
    const installResult = runCommand('npm install', 'Installing dependencies');
    results.push({ name: 'Dependency Installation', ...installResult });
    if (!installResult.success) {
      log('Cannot proceed without dependencies', 'red');
      return;
    }
  }
  
  // 2. Run TypeScript check
  const tsResult = runCommand('npx tsc --noEmit', 'TypeScript type checking');
  results.push({ name: 'TypeScript Check', ...tsResult });
  
  // 3. Run unit tests
  const unitTestResult = runCommand('npm run test -- --testPathPattern="__tests__/(store|components|utils)"', 'Unit tests');
  results.push({ name: 'Unit Tests', ...unitTestResult });
  
  // 4. Run integration tests
  const integrationTestResult = runCommand('npm run test -- --testPathPattern="__tests__/integration"', 'Integration tests');
  results.push({ name: 'Integration Tests', ...integrationTestResult });
  
  // 5. Run screen tests
  const screenTestResult = runCommand('npm run test -- --testPathPattern="__tests__/screens"', 'Screen tests');
  results.push({ name: 'Screen Tests', ...screenTestResult });
  
  // 6. Generate coverage report
  const coverageResult = runCommand('npm run test:coverage', 'Coverage analysis');
  results.push({ name: 'Coverage Analysis', ...coverageResult });
  
  // 7. Run accessibility tests (if implemented)
  // const a11yResult = runCommand('npm run test -- --testNamePattern="Accessibility"', 'Accessibility tests');
  // results.push({ name: 'Accessibility Tests', ...a11yResult });
  
  // Generate final report
  generateTestReport(results);
  
  // Check if all critical tests passed
  const criticalTests = ['Unit Tests', 'Integration Tests', 'Screen Tests'];
  const criticalFailures = results.filter(r => 
    criticalTests.includes(r.name) && !r.success
  );
  
  if (criticalFailures.length > 0) {
    log('\n🚨 CRITICAL TEST FAILURES DETECTED!', 'red');
    log('The app may not function correctly. Please fix the failing tests.', 'red');
    process.exit(1);
  } else {
    log('\n🎉 ALL CRITICAL TESTS PASSED!', 'green');
    log('Your Tinder-style learning app is ready for deployment! 🚀', 'green');
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  log('🧪 Test Runner for Tinder-Style Learning App', 'bright');
  log('\nUsage: node scripts/test-runner.js [options]', 'blue');
  log('\nOptions:', 'blue');
  log('  --help, -h     Show this help message', 'blue');
  log('  --watch, -w    Run tests in watch mode', 'blue');
  log('  --coverage, -c Run only coverage analysis', 'blue');
  log('  --unit, -u     Run only unit tests', 'blue');
  log('  --integration, -i Run only integration tests', 'blue');
  process.exit(0);
}

if (args.includes('--watch') || args.includes('-w')) {
  log('🔄 Running tests in watch mode...', 'cyan');
  execSync('npm run test:watch', { stdio: 'inherit' });
} else if (args.includes('--coverage') || args.includes('-c')) {
  runCommand('npm run test:coverage', 'Coverage analysis only');
} else if (args.includes('--unit') || args.includes('-u')) {
  runCommand('npm run test -- --testPathPattern="__tests__/(store|components|utils)"', 'Unit tests only');
} else if (args.includes('--integration') || args.includes('-i')) {
  runCommand('npm run test -- --testPathPattern="__tests__/integration"', 'Integration tests only');
} else {
  main().catch(error => {
    log(`\n💥 Test runner failed: ${error.message}`, 'red');
    process.exit(1);
  });
}
