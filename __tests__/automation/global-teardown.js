/**
 * Global Teardown for Playwright Tests
 * Cleans up the testing environment after running tests
 */

const fs = require('fs');
const path = require('path');

async function globalTeardown(config) {
  console.log('🧹 Cleaning up test environment...');
  
  // Clean up temporary files if needed
  const tempDirs = [
    'screenshots/temp',
    'test-reports/temp'
  ];
  
  tempDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '../../', dir);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`🗑️ Cleaned up: ${dir}`);
    }
  });
  
  // Generate test summary
  const reportPath = path.join(__dirname, '../../test-reports');
  const summaryPath = path.join(reportPath, 'test-summary.json');
  
  const summary = {
    timestamp: new Date().toISOString(),
    testRun: 'Automated Testing Framework',
    status: 'completed',
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };
  
  if (fs.existsSync(reportPath)) {
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log('📊 Test summary generated');
  }
  
  console.log('✅ Test environment cleanup complete');
}

module.exports = globalTeardown;
