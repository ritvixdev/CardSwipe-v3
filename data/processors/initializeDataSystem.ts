// ============================================================================
// DATA SYSTEM INITIALIZATION UTILITY
// ============================================================================
// This utility initializes and validates the enhanced data system

import { ensureMigration, debugUtils, getSystemStats } from './dataLoaderAdapter';
import { runQuickTest } from './integrationTest';

interface InitializationResult {
  success: boolean;
  migrationStatus: string;
  testsPassed: boolean;
  systemStats?: any;
  errors: string[];
  warnings: string[];
  performanceMetrics: {
    initializationTime: number;
    testTime: number;
    totalTime: number;
  };
}

export async function initializeDataSystem(options: {
  runTests?: boolean;
  verbose?: boolean;
} = {}): Promise<InitializationResult> {
  const { runTests = true, verbose = true } = options;
  const startTime = Date.now();
  
  const result: InitializationResult = {
    success: false,
    migrationStatus: 'unknown',
    testsPassed: false,
    errors: [],
    warnings: [],
    performanceMetrics: {
      initializationTime: 0,
      testTime: 0,
      totalTime: 0
    }
  };
  
  if (verbose) {
    console.log('🚀 Initializing Enhanced Data System...');
  }
  
  try {
    // Step 1: Run migration if needed
    if (verbose) console.log('📦 Checking migration status...');
    
    const migrationStart = Date.now();
    await ensureMigration();
    result.performanceMetrics.initializationTime = Date.now() - migrationStart;
    
    const migrationStatus = debugUtils.getMigrationStatus();
    result.migrationStatus = migrationStatus.status;
    
    if (verbose) {
      console.log(`✅ Migration ${migrationStatus.status} in ${result.performanceMetrics.initializationTime}ms`);
    }
    
    // Step 2: Get system statistics
    try {
      result.systemStats = await getSystemStats();
      if (verbose) {
        console.log('📊 System statistics collected');
      }
    } catch (error) {
      result.warnings.push(`Failed to collect system stats: ${error.message}`);
      if (verbose) console.warn('⚠️ System stats collection failed');
    }
    
    // Step 3: Run integration tests (optional)
    if (runTests) {
      if (verbose) console.log('🧪 Running integration tests...');
      
      const testStart = Date.now();
      try {
        result.testsPassed = await runQuickTest();
        result.performanceMetrics.testTime = Date.now() - testStart;
        
        if (verbose) {
          console.log(`${result.testsPassed ? '✅' : '❌'} Tests completed in ${result.performanceMetrics.testTime}ms`);
        }
      } catch (error) {
        result.errors.push(`Integration tests failed: ${error.message}`);
        result.performanceMetrics.testTime = Date.now() - testStart;
        
        if (verbose) {
          console.error(`❌ Tests failed in ${result.performanceMetrics.testTime}ms:`, error);
        }
      }
    } else {
      result.testsPassed = true; // Skip tests
    }
    
    // Step 4: Final validation
    result.success = 
      (migrationStatus.isCompleted || migrationStatus.status === 'completed') &&
      (result.testsPassed || !runTests) &&
      result.errors.length === 0;
    
    result.performanceMetrics.totalTime = Date.now() - startTime;
    
    if (verbose) {
      if (result.success) {
        console.log(`🎉 Data system initialization successful! (${result.performanceMetrics.totalTime}ms)`);
      } else {
        console.error(`💥 Data system initialization failed after ${result.performanceMetrics.totalTime}ms`);
      }
    }
    
  } catch (error) {
    result.errors.push(`Initialization failed: ${error.message}`);
    result.performanceMetrics.totalTime = Date.now() - startTime;
    
    if (verbose) {
      console.error(`💥 Critical initialization error after ${result.performanceMetrics.totalTime}ms:`, error);
    }
  }
  
  return result;
}

// Quick initialization for production use
export async function quickInit(): Promise<boolean> {
  try {
    const result = await initializeDataSystem({
      runTests: false,
      verbose: false
    });
    return result.success;
  } catch (error) {
    console.error('Quick initialization failed:', error);
    return false;
  }
}

// Development initialization with full testing
export async function devInit(): Promise<InitializationResult> {
  return await initializeDataSystem({
    runTests: true,
    verbose: true
  });
}

// Export utilities
export const dataSystemUtils = {
  initializeDataSystem,
  quickInit,
  devInit,
  
  // Diagnostic functions
  async getDiagnostics() {
    const migrationStatus = debugUtils.getMigrationStatus();
    const systemStats = await getSystemStats().catch(e => ({ error: e.message }));
    
    return {
      migration: migrationStatus,
      system: systemStats,
      timestamp: Date.now()
    };
  },
  
  async validateSystem() {
    try {
      const validation = await debugUtils.validateData();
      return validation.isValid;
    } catch (error) {
      console.error('System validation failed:', error);
      return false;
    }
  }
};