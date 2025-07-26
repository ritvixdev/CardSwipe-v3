const { execSync } = require('child_process');

// Comprehensive testing scripts
module.exports = {
  scripts: {
    // Critical tests that must pass before any deployment
    'test:critical': {
      description: 'Run critical tests that detect infinite loops and crashes',
      script: 'jest --testPathPattern="critical|store" --detectOpenHandles --forceExit --maxWorkers=1 --verbose'
    },
    
    // Component tests with performance monitoring
    'test:components': {
      description: 'Run component tests with render performance tracking',
      script: 'jest --testPathPattern="components" --detectOpenHandles --forceExit --maxWorkers=1'
    },
    
    // Integration tests for user flows
    'test:integration': {
      description: 'Run integration tests for complete user journeys',
      script: 'jest --testPathPattern="screens|integration" --detectOpenHandles --forceExit --maxWorkers=1'
    },
    
    // Performance and memory leak detection
    'test:performance': {
      description: 'Run performance tests and memory leak detection',
      script: 'jest --testPathPattern="performance" --detectOpenHandles --forceExit --maxWorkers=1 --logHeapUsage'
    },
    
    // Complete test suite with comprehensive reporting
    'test:full': {
      description: 'Run complete test suite with detailed reporting',
      script: 'node scripts/test-and-debug.js'
    },
    
    // Quick smoke test for development
    'test:smoke': {
      description: 'Quick smoke test to verify basic functionality',
      script: 'jest --testPathPattern="basic|smoke" --detectOpenHandles --forceExit --maxWorkers=1 --bail'
    },
    
    // Test with coverage reporting
    'test:coverage': {
      description: 'Run tests with coverage reporting',
      script: 'jest --coverage --detectOpenHandles --forceExit --maxWorkers=1'
    },
    
    // Watch mode for development
    'test:watch': {
      description: 'Run tests in watch mode for development',
      script: 'jest --watch --detectOpenHandles --maxWorkers=1'
    },
    
    // Debug mode with detailed logging
    'test:debug': {
      description: 'Run tests in debug mode with detailed logging',
      script: 'jest --verbose --detectOpenHandles --forceExit --maxWorkers=1 --no-cache'
    },
    
    // Pre-commit tests (fast and essential)
    'test:pre-commit': {
      description: 'Fast essential tests for pre-commit hooks',
      script: 'jest --testPathPattern="critical" --detectOpenHandles --forceExit --maxWorkers=1 --bail --silent'
    },
    
    // CI/CD pipeline tests
    'test:ci': {
      description: 'Tests optimized for CI/CD environments',
      script: 'jest --ci --coverage --detectOpenHandles --forceExit --maxWorkers=2 --maxConcurrency=2'
    },
    
    // Memory profiling
    'test:memory': {
      description: 'Run tests with memory profiling',
      script: 'jest --detectOpenHandles --forceExit --maxWorkers=1 --logHeapUsage --expose-gc'
    }
  }
};

// Helper functions for test execution
function runTestSuite(suiteName) {
  const suite = module.exports.scripts[suiteName];
  if (!suite) {
    console.error(`❌ Test suite "${suiteName}" not found`);
    process.exit(1);
  }
  
  console.log(`🚀 Running: ${suite.description}`);
  
  try {
    execSync(suite.script, { 
      stdio: 'inherit',
      timeout: 300000 // 5 minutes timeout
    });
    console.log(`✅ ${suiteName} completed successfully`);
  } catch (error) {
    console.error(`❌ ${suiteName} failed:`, error.message);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const suiteName = process.argv[2];
  
  if (!suiteName) {
    console.log('📋 Available test suites:');
    Object.entries(module.exports.scripts).forEach(([name, config]) => {
      console.log(`  ${name}: ${config.description}`);
    });
    console.log('\nUsage: node package-scripts.js <suite-name>');
    process.exit(0);
  }
  
  runTestSuite(suiteName);
}

module.exports.runTestSuite = runTestSuite;
