// ============================================================================
// INTEGRATION TEST FOR SCALABLE DATA ARCHITECTURE
// ============================================================================
// This file tests the integration between legacy and new data systems

import { 
  getCardsByCategory, 
  searchLessons, 
  getLessonsByDifficulty,
  getLessonById,
  getLessonsByTopic,
  getPopularLessons,
  getTrendingLessons,
  getFilteredLessons,
  getSystemStats,
  debugUtils,
  EnhancedLearnCard
} from './dataLoaderAdapter';

// Test configuration
const TEST_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  MIN_EXPECTED_RESULTS: 1,
  TEST_CATEGORIES: ['fundamentals', 'data-structures', 'asynchronous'],
  TEST_DIFFICULTIES: ['beginner', 'intermediate', 'advanced'] as const,
  TEST_SEARCH_QUERIES: ['function', 'array', 'promise', 'variable']
};

interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  resultCount?: number;
  error?: string;
  details?: any;
}

class IntegrationTestSuite {
  private results: TestResult[] = [];
  
  async runAllTests(): Promise<{ 
    passed: number; 
    failed: number; 
    results: TestResult[];
    summary: any;
  }> {
    console.log('🚀 Starting Integration Test Suite for Scalable Data Architecture');
    
    const startTime = Date.now();
    
    // Test 1: Migration Status
    await this.testMigrationStatus();
    
    // Test 2: Basic Card Loading
    await this.testBasicCardLoading();
    
    // Test 3: Search Functionality
    await this.testSearchFunctionality();
    
    // Test 4: Difficulty Filtering
    await this.testDifficultyFiltering();
    
    // Test 5: Individual Card Retrieval
    await this.testIndividualCardRetrieval();
    
    // Test 6: Topic-based Loading
    await this.testTopicBasedLoading();
    
    // Test 7: Enhanced Features
    await this.testEnhancedFeatures();
    
    // Test 8: Performance and Caching
    await this.testPerformanceAndCaching();
    
    // Test 9: Error Handling and Fallbacks
    await this.testErrorHandling();
    
    // Test 10: Data Integrity
    await this.testDataIntegrity();
    
    const totalTime = Date.now() - startTime;
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    
    const summary = {
      totalTests: this.results.length,
      passed,
      failed,
      duration: totalTime,
      migrationStatus: debugUtils.getMigrationStatus(),
      systemStats: await getSystemStats().catch(e => ({ error: e.message }))
    };
    
    console.log('📊 Integration Test Suite Completed');
    console.log(`✅ Passed: ${passed}, ❌ Failed: ${failed}, ⏱️  Total Time: ${totalTime}ms`);
    
    return {
      passed,
      failed,
      results: this.results,
      summary
    };
  }
  
  private async runTest(testName: string, testFn: () => Promise<any>): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Running: ${testName}`);
      
      const result = await Promise.race([
        testFn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), TEST_CONFIG.TIMEOUT)
        )
      ]);
      
      const duration = Date.now() - startTime;
      const testResult: TestResult = {
        testName,
        passed: true,
        duration,
        resultCount: Array.isArray(result) ? result.length : (result ? 1 : 0),
        details: result
      };
      
      console.log(`✅ ${testName} - ${duration}ms - ${testResult.resultCount} results`);
      this.results.push(testResult);
      return testResult;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const testResult: TestResult = {
        testName,
        passed: false,
        duration,
        error: error.message
      };
      
      console.error(`❌ ${testName} failed: ${error.message}`);
      this.results.push(testResult);
      return testResult;
    }
  }
  
  private async testMigrationStatus(): Promise<void> {
    await this.runTest('Migration Status Check', async () => {
      const status = debugUtils.getMigrationStatus();
      
      if (!status) {
        throw new Error('Migration status not available');
      }
      
      console.log(`📋 Migration Status: ${status.status}`);
      
      return {
        status: status.status,
        isCompleted: status.isCompleted,
        isInProgress: status.isInProgress
      };
    });
  }
  
  private async testBasicCardLoading(): Promise<void> {
    for (const category of TEST_CONFIG.TEST_CATEGORIES) {
      await this.runTest(`Load Cards - ${category}`, async () => {
        const cards = await getCardsByCategory(category);
        
        if (!Array.isArray(cards)) {
          throw new Error('Expected array of cards');
        }
        
        if (cards.length < TEST_CONFIG.MIN_EXPECTED_RESULTS) {
          throw new Error(`Expected at least ${TEST_CONFIG.MIN_EXPECTED_RESULTS} cards, got ${cards.length}`);
        }
        
        // Validate card structure
        const firstCard = cards[0];
        const requiredFields = ['id', 'title', 'category', 'difficulty', 'content'];
        
        for (const field of requiredFields) {
          if (!firstCard[field]) {
            throw new Error(`Missing required field: ${field}`);
          }
        }
        
        return cards;
      });
    }
  }
  
  private async testSearchFunctionality(): Promise<void> {
    for (const query of TEST_CONFIG.TEST_SEARCH_QUERIES) {
      await this.runTest(`Search - "${query}"`, async () => {
        const results = await searchLessons(query);
        
        if (!Array.isArray(results)) {
          throw new Error('Expected array of search results');
        }
        
        // Verify search relevance
        if (results.length > 0) {
          const firstResult = results[0];
          const isRelevant = 
            firstResult.title.toLowerCase().includes(query.toLowerCase()) ||
            firstResult.content.toLowerCase().includes(query.toLowerCase()) ||
            firstResult.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
            
          if (!isRelevant) {
            console.warn(`Search result may not be relevant for query: ${query}`);
          }
        }
        
        return results;
      });
    }
  }
  
  private async testDifficultyFiltering(): Promise<void> {
    for (const difficulty of TEST_CONFIG.TEST_DIFFICULTIES) {
      await this.runTest(`Filter by Difficulty - ${difficulty}`, async () => {
        const cards = await getLessonsByDifficulty(difficulty);
        
        if (!Array.isArray(cards)) {
          throw new Error('Expected array of cards');
        }
        
        // Verify all cards have correct difficulty
        if (cards.length > 0) {
          const wrongDifficulty = cards.find(card => card.difficulty !== difficulty);
          if (wrongDifficulty) {
            throw new Error(`Found card with wrong difficulty: expected ${difficulty}, got ${wrongDifficulty.difficulty}`);
          }
        }
        
        return cards;
      });
    }
  }
  
  private async testIndividualCardRetrieval(): Promise<void> {
    await this.runTest('Individual Card Retrieval', async () => {
      // First get a card to test with
      const cards = await getCardsByCategory('fundamentals');
      if (cards.length === 0) {
        throw new Error('No cards available for testing individual retrieval');
      }
      
      const testCard = cards[0];
      const retrievedCard = await getLessonById(testCard.id);
      
      if (!retrievedCard) {
        throw new Error(`Failed to retrieve card with ID: ${testCard.id}`);
      }
      
      if (retrievedCard.id !== testCard.id) {
        throw new Error(`Retrieved card ID mismatch: expected ${testCard.id}, got ${retrievedCard.id}`);
      }
      
      return retrievedCard;
    });
  }
  
  private async testTopicBasedLoading(): Promise<void> {
    const testTopics = ['all', 'fundamentals', 'easy', 'medium'];
    
    for (const topic of testTopics) {
      await this.runTest(`Load by Topic - ${topic}`, async () => {
        const cards = await getLessonsByTopic(topic);
        
        if (!Array.isArray(cards)) {
          throw new Error('Expected array of cards');
        }
        
        return cards;
      });
    }
  }
  
  private async testEnhancedFeatures(): Promise<void> {
    await this.runTest('Popular Lessons', async () => {
      const cards = await getPopularLessons(10);
      
      if (!Array.isArray(cards)) {
        throw new Error('Expected array of popular cards');
      }
      
      if (cards.length > 10) {
        throw new Error(`Expected max 10 cards, got ${cards.length}`);
      }
      
      return cards;
    });
    
    await this.runTest('Trending Lessons', async () => {
      const cards = await getTrendingLessons(5);
      
      if (!Array.isArray(cards)) {
        throw new Error('Expected array of trending cards');
      }
      
      if (cards.length > 5) {
        throw new Error(`Expected max 5 cards, got ${cards.length}`);
      }
      
      return cards;
    });
    
    await this.runTest('Advanced Filtering', async () => {
      const cards = await getFilteredLessons({
        domains: ['javascript'],
        difficulties: ['beginner'],
        limit: 20
      });
      
      if (!Array.isArray(cards)) {
        throw new Error('Expected array of filtered cards');
      }
      
      if (cards.length > 20) {
        throw new Error(`Expected max 20 cards, got ${cards.length}`);
      }
      
      // Verify filtering worked
      if (cards.length > 0) {
        const wrongDifficulty = cards.find(card => card.difficulty !== 'beginner');
        if (wrongDifficulty) {
          console.warn(`Filter may not have worked perfectly: found ${wrongDifficulty.difficulty} card`);
        }
      }
      
      return cards;
    });
  }
  
  private async testPerformanceAndCaching(): Promise<void> {
    await this.runTest('Performance and Caching', async () => {
      // Test caching by making the same request twice
      const startTime1 = Date.now();
      const cards1 = await getCardsByCategory('fundamentals');
      const duration1 = Date.now() - startTime1;
      
      const startTime2 = Date.now();
      const cards2 = await getCardsByCategory('fundamentals');
      const duration2 = Date.now() - startTime2;
      
      const performance = {
        firstRequest: duration1,
        secondRequest: duration2,
        cacheEfficiency: duration2 < duration1,
        resultsConsistent: cards1.length === cards2.length
      };
      
      if (!performance.resultsConsistent) {
        throw new Error('Cache results inconsistent between requests');
      }
      
      return performance;
    });
  }
  
  private async testErrorHandling(): Promise<void> {
    await this.runTest('Error Handling - Invalid ID', async () => {
      const card = await getLessonById('invalid-id-12345');
      
      // Should return undefined for invalid ID, not throw
      if (card !== undefined) {
        console.warn('Expected undefined for invalid ID, but got result');
      }
      
      return { handled: true, result: card };
    });
    
    await this.runTest('Error Handling - Invalid Category', async () => {
      const cards = await getCardsByCategory('invalid-category-xyz');
      
      if (!Array.isArray(cards)) {
        throw new Error('Should return empty array for invalid category');
      }
      
      return cards;
    });
  }
  
  private async testDataIntegrity(): Promise<void> {
    await this.runTest('Data Integrity Check', async () => {
      const cards = await getCardsByCategory('fundamentals');
      
      if (cards.length === 0) {
        throw new Error('No cards to test data integrity');
      }
      
      const issues: string[] = [];
      
      cards.forEach((card, index) => {
        // Check for required fields
        if (!card.id) issues.push(`Card ${index}: missing id`);
        if (!card.title) issues.push(`Card ${index}: missing title`);
        if (!card.content) issues.push(`Card ${index}: missing content`);
        
        // Check for valid difficulty
        if (!['beginner', 'intermediate', 'advanced'].includes(card.difficulty)) {
          issues.push(`Card ${index}: invalid difficulty ${card.difficulty}`);
        }
        
        // Check for valid category
        if (!card.category) {
          issues.push(`Card ${index}: missing category`);
        }
        
        // Check tags array
        if (card.tags && !Array.isArray(card.tags)) {
          issues.push(`Card ${index}: tags should be array`);
        }
      });
      
      if (issues.length > 0) {
        throw new Error(`Data integrity issues found: ${issues.join(', ')}`);
      }
      
      return {
        cardsChecked: cards.length,
        issuesFound: issues.length,
        status: 'valid'
      };
    });
  }
}

// ============================================================================
// EXPORT TEST UTILITIES
// ============================================================================

export async function runIntegrationTests(): Promise<any> {
  const testSuite = new IntegrationTestSuite();
  return await testSuite.runAllTests();
}

export async function runQuickTest(): Promise<boolean> {
  try {
    console.log('🚀 Running quick integration test...');
    
    // Test basic functionality
    const cards = await getCardsByCategory('fundamentals');
    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error('Basic card loading failed');
    }
    
    const searchResults = await searchLessons('function');
    if (!Array.isArray(searchResults)) {
      throw new Error('Search functionality failed');
    }
    
    console.log('✅ Quick test passed - system is working');
    return true;
    
  } catch (error) {
    console.error('❌ Quick test failed:', error);
    return false;
  }
}

export const testUtils = {
  runIntegrationTests,
  runQuickTest,
  config: TEST_CONFIG
};

// Auto-run quick test in development mode
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    runQuickTest().catch(error => {
      console.warn('Development quick test failed:', error);
    });
  }, 2000);
}