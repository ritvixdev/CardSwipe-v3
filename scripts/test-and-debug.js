#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bright: '\x1b[1m',
  reset: '\x1b[0m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`🔍 ${title}`, 'bright');
  log('='.repeat(60), 'cyan');
}

// Test categories with specific focus areas
const testCategories = {
  'critical': {
    name: 'Critical System Tests',
    description: 'Tests that prevent infinite loops and crashes',
    patterns: ['**/store/*.test.*', '**/hooks/*.test.*'],
    timeout: 30000
  },
  'components': {
    name: 'Component Tests',
    description: 'UI component functionality and rendering',
    patterns: ['**/__tests__/components/*.test.*'],
    timeout: 15000
  },
  'integration': {
    name: 'Integration Tests',
    description: 'Screen and user flow testing',
    patterns: ['**/__tests__/screens/*.test.*', '**/__tests__/integration/*.test.*'],
    timeout: 20000
  },
  'performance': {
    name: 'Performance Tests',
    description: 'Memory leaks and performance issues',
    patterns: ['**/__tests__/performance/*.test.*'],
    timeout: 45000
  }
};

// Common React anti-patterns that cause infinite loops
const antiPatterns = [
  {
    name: 'useEffect without dependencies',
    pattern: /useEffect\s*\(\s*\(\s*\)\s*=>\s*{[\s\S]*?}\s*\)/g,
    severity: 'high',
    message: 'useEffect without dependency array can cause infinite loops'
  },
  {
    name: 'setState in render',
    pattern: /return\s*\([\s\S]*?set[A-Z]\w*\s*\([\s\S]*?\)/g,
    severity: 'critical',
    message: 'setState calls in render method cause infinite re-renders'
  },
  {
    name: 'Object creation in JSX',
    pattern: /\{\s*\{[\s\S]*?\}\s*\}/g,
    severity: 'medium',
    message: 'Object literals in JSX cause unnecessary re-renders'
  },
  {
    name: 'Function creation in JSX',
    pattern: /\(\s*\)\s*=>\s*[\s\S]*?(?=\s*[}>])/g,
    severity: 'medium',
    message: 'Arrow functions in JSX cause unnecessary re-renders'
  }
];

async function runCommand(command, description) {
  log(`\n📋 ${description}...`, 'blue');
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      timeout: 60000
    });
    log(`✅ ${description} completed`, 'green');
    return { success: true, output };
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    return { success: false, error: error.message, output: error.stdout };
  }
}

function scanForAntiPatterns() {
  logSection('SCANNING FOR REACT ANTI-PATTERNS');
  
  const sourceFiles = [
    'components/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'store/**/*.{ts,tsx}'
  ];
  
  const issues = [];
  
  // Get all TypeScript/React files
  const files = execSync(`find . -name "*.tsx" -o -name "*.ts" | grep -E "(components|app|hooks|store)" | head -20`, { encoding: 'utf8' })
    .split('\n')
    .filter(f => f.trim());
  
  files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      antiPatterns.forEach(pattern => {
        const matches = content.match(pattern.pattern);
        if (matches) {
          issues.push({
            file,
            pattern: pattern.name,
            severity: pattern.severity,
            message: pattern.message,
            matches: matches.length
          });
        }
      });
    } catch (error) {
      log(`⚠️  Could not scan ${file}: ${error.message}`, 'yellow');
    }
  });
  
  // Report findings
  if (issues.length === 0) {
    log('✅ No anti-patterns detected!', 'green');
  } else {
    log(`⚠️  Found ${issues.length} potential issues:`, 'yellow');
    
    issues.forEach(issue => {
      const color = issue.severity === 'critical' ? 'red' : 
                   issue.severity === 'high' ? 'yellow' : 'blue';
      log(`  ${issue.severity.toUpperCase()}: ${issue.file}`, color);
      log(`    ${issue.message} (${issue.matches} occurrences)`, 'white');
    });
  }
  
  return issues;
}

async function runTestCategory(category, config) {
  logSection(`${config.name.toUpperCase()}`);
  log(config.description, 'cyan');
  
  const results = [];
  
  for (const pattern of config.patterns) {
    try {
      log(`\n🧪 Running tests: ${pattern}`, 'blue');
      
      const command = `npm test -- --testPathPattern="${pattern}" --verbose --detectOpenHandles --forceExit --maxWorkers=1`;
      const result = await runCommand(command, `Testing ${pattern}`);
      
      results.push({
        pattern,
        success: result.success,
        output: result.output || result.error
      });
      
      if (!result.success) {
        log(`❌ Test failures in ${pattern}`, 'red');
        // Extract key error information
        if (result.output) {
          const lines = result.output.split('\n');
          const errorLines = lines.filter(line => 
            line.includes('Error:') || 
            line.includes('Failed:') ||
            line.includes('Maximum update depth') ||
            line.includes('Cannot read properties')
          );
          
          if (errorLines.length > 0) {
            log('Key errors:', 'red');
            errorLines.slice(0, 5).forEach(line => {
              log(`  ${line.trim()}`, 'red');
            });
          }
        }
      }
      
    } catch (error) {
      log(`💥 Critical error in ${pattern}: ${error.message}`, 'red');
      results.push({
        pattern,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

async function checkAppHealth() {
  logSection('APPLICATION HEALTH CHECK');
  
  const healthChecks = [
    {
      name: 'Dependencies',
      command: 'npm ls --depth=0',
      critical: true
    },
    {
      name: 'TypeScript Compilation',
      command: 'npx tsc --noEmit',
      critical: true
    },
    {
      name: 'Expo Configuration',
      command: 'npx expo doctor',
      critical: false
    },
    {
      name: 'Bundle Analysis',
      command: 'npx expo export --platform web --dev',
      critical: false
    }
  ];
  
  const results = [];
  
  for (const check of healthChecks) {
    const result = await runCommand(check.command, check.name);
    results.push({
      name: check.name,
      success: result.success,
      critical: check.critical,
      output: result.output || result.error
    });
    
    if (!result.success && check.critical) {
      log(`🚨 Critical health check failed: ${check.name}`, 'red');
      break;
    }
  }
  
  return results;
}

function generateReport(antiPatterns, healthResults, testResults) {
  logSection('COMPREHENSIVE TEST REPORT');
  
  const report = {
    timestamp: new Date().toISOString(),
    antiPatterns: antiPatterns.length,
    criticalIssues: antiPatterns.filter(p => p.severity === 'critical').length,
    healthStatus: healthResults.every(r => r.success || !r.critical),
    testResults: testResults
  };
  
  // Summary
  log('\n📊 SUMMARY:', 'bright');
  log(`Anti-patterns found: ${report.antiPatterns}`, report.antiPatterns === 0 ? 'green' : 'yellow');
  log(`Critical issues: ${report.criticalIssues}`, report.criticalIssues === 0 ? 'green' : 'red');
  log(`Health status: ${report.healthStatus ? 'HEALTHY' : 'ISSUES DETECTED'}`, report.healthStatus ? 'green' : 'red');
  
  // Test results summary
  let totalTests = 0;
  let passedTests = 0;
  
  Object.entries(testResults).forEach(([category, results]) => {
    const categoryPassed = results.filter(r => r.success).length;
    const categoryTotal = results.length;
    totalTests += categoryTotal;
    passedTests += categoryPassed;
    
    log(`${category}: ${categoryPassed}/${categoryTotal} passed`, categoryPassed === categoryTotal ? 'green' : 'red');
  });
  
  log(`\nOverall: ${passedTests}/${totalTests} test categories passed`, passedTests === totalTests ? 'green' : 'red');
  
  // Recommendations
  log('\n💡 RECOMMENDATIONS:', 'bright');
  
  if (report.criticalIssues > 0) {
    log('🚨 URGENT: Fix critical anti-patterns causing infinite loops', 'red');
  }
  
  if (report.antiPatterns > 0) {
    log('⚠️  Review and fix React anti-patterns for better performance', 'yellow');
  }
  
  if (!report.healthStatus) {
    log('🔧 Resolve health check failures before deployment', 'yellow');
  }
  
  if (passedTests < totalTests) {
    log('🧪 Fix failing tests to ensure app stability', 'yellow');
  }
  
  if (report.criticalIssues === 0 && report.antiPatterns === 0 && report.healthStatus && passedTests === totalTests) {
    log('🎉 All checks passed! App is ready for production.', 'green');
  }
  
  // Save detailed report
  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
  log('\n📄 Detailed report saved to test-report.json', 'blue');
  
  return report;
}

async function main() {
  log('🚀 COMPREHENSIVE APP TESTING & DEBUGGING SUITE', 'bright');
  log('Detecting infinite loops, performance issues, and test failures\n', 'cyan');
  
  try {
    // 1. Scan for anti-patterns that cause infinite loops
    const antiPatterns = scanForAntiPatterns();
    
    // 2. Check application health
    const healthResults = await checkAppHealth();
    
    // 3. Run test categories
    const testResults = {};
    
    for (const [key, config] of Object.entries(testCategories)) {
      testResults[key] = await runTestCategory(key, config);
    }
    
    // 4. Generate comprehensive report
    const report = generateReport(antiPatterns, healthResults, testResults);
    
    // 5. Exit with appropriate code
    const hasErrors = report.criticalIssues > 0 || !report.healthStatus;
    process.exit(hasErrors ? 1 : 0);
    
  } catch (error) {
    log(`💥 Fatal error: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { scanForAntiPatterns, runTestCategory, checkAppHealth };
