// ============================================================================
// DATA LOADER ADAPTER - SEAMLESS INTEGRATION WITH SCALABLE ARCHITECTURE
// ============================================================================
// This adapter bridges the existing dataLoader.ts with the new ScalableDataLoader
// Provides backward compatibility while enabling new features

// TODO: These imports are for future architecture - currently disabled
// import { scalableDataLoader } from '../architecture/ScalableDataLoader';
// import { dataMigrationService } from '../architecture/DataMigrationPlan';
// import { EnhancedCard } from '../architecture/schemas';

// Re-export existing types for backward compatibility
export * from './dataLoader';

// Migration status tracking
let migrationStatus: 'not_started' | 'in_progress' | 'completed' = 'not_started';
let migrationPromise: Promise<void> | null = null;

// ============================================================================
// MIGRATION ORCHESTRATOR
// ============================================================================

async function ensureMigration(): Promise<void> {
  if (migrationStatus === 'completed') {
    return;
  }

  if (migrationStatus === 'in_progress' && migrationPromise) {
    return migrationPromise;
  }

  migrationStatus = 'in_progress';
  migrationPromise = performMigration();
  
  try {
    await migrationPromise;
    migrationStatus = 'completed';
    console.log('✅ Data architecture migration completed successfully');
  } catch (error) {
    migrationStatus = 'not_started';
    migrationPromise = null;
    console.error('❌ Migration failed, falling back to legacy system:', error);
    throw error;
  }
}

async function performMigration(): Promise<void> {
  console.log('🔄 Starting data architecture migration...');
  
  try {
    // TODO: Migration functionality disabled until architecture is implemented
    console.log('⚠️ Migration temporarily disabled - using legacy data loader');
    
    // Legacy fallback - no migration needed for now
    return Promise.resolve();
    
    /* Future implementation:
    // Check if migration is needed
    const status = await dataMigrationService.getMigrationStatus();
    
    if (status.isNeeded) {
      console.log('📦 Migrating current data structure to scalable architecture...');
      
      // Run the migration
      const result = await dataMigrationService.migrateToNewArchitecture();
      
      if (!result.success) {
        throw new Error(`Migration failed: ${result.errors.join(', ')}`);
      }
      
      console.log(`✅ Successfully migrated ${result.migratedCards} cards to new architecture`);
    }
    
    // Initialize the scalable data loader
    await scalableDataLoader.initialize();
    */
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// ============================================================================
// ENHANCED DATA ACCESS LAYER
// ============================================================================

// Enhanced lesson interface that includes new features
export interface EnhancedLearnCard {
  // Legacy fields (backward compatible)
  id: string;
  title: string;
  day?: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  description: string;
  content: string;
  contentDetails?: string;
  codeExample?: string;
  keyPoints: string[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  tags: string[];
  isCompleted: boolean;
  isBookmarked: boolean;
  
  // New enhanced fields
  domainId?: string;
  topicId?: string;
  skills?: string[];
  concepts?: string[];
  frameworks?: string[];
  prerequisites?: string[];
  recommendations?: string[];
  analytics?: {
    viewCount?: number;
    completionRate?: number;
    averageRating?: number;
    timeToComplete?: number;
  };
}

// TODO: Convert EnhancedCard to legacy format - disabled until architecture is implemented
// function convertToLegacyCard(enhancedCard: EnhancedCard): EnhancedLearnCard {
//   return {
//     id: enhancedCard.id,
//     title: enhancedCard.title,
//     day: enhancedCard.order || 0,
//     category: enhancedCard.domainId || 'fundamentals',
//     difficulty: enhancedCard.difficulty,
//     estimatedTime: `${enhancedCard.estimatedMinutes || 10} min`,
//     description: enhancedCard.content.description,
//     content: enhancedCard.content.sections?.[0]?.content || enhancedCard.content.description,
//     contentDetails: enhancedCard.content.summary,
//     codeExample: enhancedCard.content.codeExamples?.[0]?.code,
//     keyPoints: enhancedCard.concepts || [],
//     quiz: enhancedCard.content.quiz ? {
//       question: enhancedCard.content.quiz.questions[0]?.question || '',
//       options: enhancedCard.content.quiz.questions[0]?.options || [],
//       correctAnswer: enhancedCard.content.quiz.questions[0]?.correctAnswers?.[0] || 0,
//       explanation: enhancedCard.content.quiz.questions[0]?.explanation || ''
//     } : {
//       question: '',
//       options: [],
//       correctAnswer: 0,
//       explanation: ''
//     },
//     tags: enhancedCard.tags,
//     isCompleted: enhancedCard.progress.isCompleted,
//     isBookmarked: enhancedCard.progress.isBookmarked,
//     
//     // Enhanced fields
//     domainId: enhancedCard.domainId,
//     topicId: enhancedCard.topicId,
//     skills: enhancedCard.skills,
//     concepts: enhancedCard.concepts,
//     frameworks: enhancedCard.frameworks,
//     prerequisites: enhancedCard.prerequisites,
//     recommendations: enhancedCard.recommendations,
//     analytics: {
//       viewCount: enhancedCard.analytics.viewCount,
//       completionRate: enhancedCard.analytics.completionRate,
//       averageRating: enhancedCard.analytics.averageRating,
//       timeToComplete: enhancedCard.analytics.timeToComplete
//     }
//   };
// }

// ============================================================================
// ENHANCED API WITH FALLBACK SUPPORT
// ============================================================================

// Enhanced lesson loading with intelligent fallback - now using multi-file system
export async function getCardsByCategory(category: string): Promise<EnhancedLearnCard[]> {
  try {
    // Try enhanced multi-file loading first
    console.log(`🔄 Enhanced loading for category: ${category}`);
    const legacyDataLoader = await import('./dataLoader');
    
    // Use enhanced category loading with multi-file support
    const enhancedCards = await legacyDataLoader.getCardsByCategoryEnhanced(category);
    
    if (enhancedCards.length > 0) {
      console.log(`✅ Enhanced category loading: ${enhancedCards.length} cards for ${category}`);
      return enhancedCards;
    }
    
    // Fallback to legacy system
    console.log(`⚠️ Enhanced loading empty, using legacy for category: ${category}`);
    return await legacyDataLoader.getCardsByCategory(category);
    
    /* Future implementation:
    // Try new scalable system first
    await ensureMigration();
    
    // Map legacy categories to domains/topics
    const domainMapping: { [key: string]: string } = {
      'fundamentals': 'javascript',
      'data-structures': 'algorithms',
      'control-flow': 'javascript',
      'web-development': 'javascript',
      'asynchronous': 'javascript',
      'advanced-concepts': 'javascript'
    };

    const domainId = domainMapping[category] || 'javascript';
    
    // Use advanced search to find cards
    const result = await scalableDataLoader.getCards({
      domains: [domainId],
      limit: 100
    });
    */

    // TODO: Scalable system results disabled
    // if (result.cards.length > 0) {
    //   console.log(`✅ Loaded ${result.cards.length} cards from scalable system for category: ${category}`);
    //   return result.cards.map(convertToLegacyCard);
    // }

    // Legacy system only for now
    // console.log(`⚠️ Falling back to legacy system for category: ${category}`);
    // const legacyDataLoader = await import('./dataLoader');
    // return await legacyDataLoader.getCardsByCategory(category);
    
  } catch (error) {
    console.error(`Failed to load cards for category ${category}:`, error);
    
    // Emergency fallback to legacy system
    try {
      const legacyDataLoader = await import('./dataLoader');
      return await legacyDataLoader.getCardsByCategory(category);
    } catch (legacyError) {
      console.error('Legacy fallback also failed:', legacyError);
      return [];
    }
  }
}

// Enhanced search with multi-file system
export async function searchLessons(query: string): Promise<EnhancedLearnCard[]> {
  try {
    // Try enhanced multi-file search first
    console.log(`🔍 Enhanced search for query: "${query}"`);
    const legacyDataLoader = await import('./dataLoader');
    
    // Use enhanced search with multi-file support
    const enhancedResults = await legacyDataLoader.searchLessonsEnhanced(query);
    
    if (enhancedResults.length > 0) {
      console.log(`✅ Enhanced search: ${enhancedResults.length} results for "${query}"`);
      return enhancedResults;
    }
    
    // Fallback to legacy search
    console.log(`⚠️ Enhanced search empty, using legacy search for: "${query}"`);
    return await legacyDataLoader.searchLessons(query);
    
    /* Future implementation:
    await ensureMigration();
    
    const result = await scalableDataLoader.searchCards(query, { limit: 50 });
    
    if (result.cards.length > 0) {
      console.log(`🔍 Found ${result.cards.length} cards using scalable search`);
      return result.cards.map(convertToLegacyCard);
    }

    // Fallback to legacy search
    const legacyDataLoader = await import('./dataLoader');
    return await legacyDataLoader.searchLessons(query);
    */
    
  } catch (error) {
    console.error(`Search failed for query "${query}":`, error);
    
    // Emergency fallback
    try {
      const legacyDataLoader = await import('./dataLoader');
      return await legacyDataLoader.searchLessons(query);
    } catch (legacyError) {
      console.error('Legacy search fallback failed:', legacyError);
      return [];
    }
  }
}

// Enhanced lessons by difficulty with scalable filtering - temporarily using legacy only
export async function getLessonsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<EnhancedLearnCard[]> {
  try {
    // TODO: Scalable system disabled - using legacy fallback only
    console.log(`⚠️ Using legacy system for difficulty: ${difficulty}`);
    const legacyDataLoader = await import('./dataLoader');
    return await legacyDataLoader.getLessonsByDifficulty(difficulty);
    
    /* Future implementation:
    await ensureMigration();
    
    const result = await scalableDataLoader.getCards({
      difficulties: [difficulty],
      limit: 100
    });

    if (result.cards.length > 0) {
      console.log(`📊 Found ${result.cards.length} ${difficulty} cards using scalable system`);
      return result.cards.map(convertToLegacyCard);
    }

    // Fallback to legacy system
    const legacyDataLoader = await import('./dataLoader');
    return await legacyDataLoader.getLessonsByDifficulty(difficulty);
    */
    
  } catch (error) {
    console.error(`Failed to load ${difficulty} lessons:`, error);
    
    // Emergency fallback
    try {
      const legacyDataLoader = await import('./dataLoader');
      return await legacyDataLoader.getLessonsByDifficulty(difficulty);
    } catch (legacyError) {
      console.error('Legacy difficulty fallback failed:', legacyError);
      return [];
    }
  }
}

// Enhanced lesson by ID with performance optimization - temporarily using legacy only
export async function getLessonById(id: string): Promise<EnhancedLearnCard | undefined> {
  try {
    // TODO: Scalable system disabled - using legacy fallback only
    console.log(`⚠️ Using legacy system for lesson ID: ${id}`);
    const legacyDataLoader = await import('./dataLoader');
    return await legacyDataLoader.getLessonById(id);
    
    /* Future implementation:
    await ensureMigration();
    
    const card = await scalableDataLoader.getCardById(id);
    
    if (card) {
      console.log(`⚡ Found card ${id} using scalable system`);
      return convertToLegacyCard(card);
    }

    // Fallback to legacy system
    const legacyDataLoader = await import('./dataLoader');
    return await legacyDataLoader.getLessonById(id);
    */
    
  } catch (error) {
    console.error(`Failed to load lesson ${id}:`, error);
    
    // Emergency fallback
    try {
      const legacyDataLoader = await import('./dataLoader');
      return await legacyDataLoader.getLessonById(id);
    } catch (legacyError) {
      console.error('Legacy ID lookup fallback failed:', legacyError);
      return undefined;
    }
  }
}

// Enhanced topic-based loading - temporarily using legacy only
export async function getLessonsByTopic(topicId: string): Promise<EnhancedLearnCard[]> {
  try {
    // TODO: Scalable system disabled - using legacy fallback only
    console.log(`⚠️ Using legacy system for topic: ${topicId}`);
    const legacyDataLoader = await import('./dataLoader');
    return await legacyDataLoader.getLessonsByTopic(topicId);
    
    /* Future implementation:
    await ensureMigration();
    
    if (!topicId || topicId === 'all') {
      // Load from fundamentals domain
      const result = await scalableDataLoader.getCards({
        domains: ['javascript'],
        limit: 100
      });
      
      if (result.cards.length > 0) {
        return result.cards.map(convertToLegacyCard);
      }
    } else {
      // Try to get cards by topic
      const cards = await scalableDataLoader.getCardsByTopic(topicId);
      
      if (cards.length > 0) {
        console.log(`📚 Found ${cards.length} cards for topic: ${topicId}`);
        return cards.map(convertToLegacyCard);
      }
    }

    // Fallback to legacy system
    const legacyDataLoader = await import('./dataLoader');
    return await legacyDataLoader.getLessonsByTopic(topicId);
    */
    
  } catch (error) {
    console.error(`Failed to load lessons for topic ${topicId}:`, error);
    
    // Emergency fallback
    try {
      const legacyDataLoader = await import('./dataLoader');
      return await legacyDataLoader.getLessonsByTopic(topicId);
    } catch (legacyError) {
      console.error('Legacy topic fallback failed:', legacyError);
      return [];
    }
  }
}

// ============================================================================
// NEW ENHANCED FEATURES
// ============================================================================

// Get popular content using analytics - temporarily using legacy fallback
export async function getPopularLessons(limit: number = 20): Promise<EnhancedLearnCard[]> {
  try {
    // TODO: Scalable system disabled - using legacy fallback
    console.log(`⚠️ Using legacy system for popular lessons (limit: ${limit})`);
    return await getCardsByCategory('fundamentals');
    
    /* Future implementation:
    await ensureMigration();
    
    const cards = await scalableDataLoader.getPopularCards(limit);
    return cards.map(convertToLegacyCard);
    */
    
  } catch (error) {
    console.error('Failed to load popular lessons:', error);
    
    // Fallback to regular lessons
    return await getCardsByCategory('fundamentals');
  }
}

// Get trending content - temporarily using legacy fallback
export async function getTrendingLessons(limit: number = 20): Promise<EnhancedLearnCard[]> {
  try {
    // TODO: Scalable system disabled - using legacy fallback
    console.log(`⚠️ Using legacy system for trending lessons (limit: ${limit})`);
    return await getCardsByCategory('fundamentals');
    
    /* Future implementation:
    await ensureMigration();
    
    const cards = await scalableDataLoader.getTrendingCards(limit);
    return cards.map(convertToLegacyCard);
    */
    
  } catch (error) {
    console.error('Failed to load trending lessons:', error);
    
    // Fallback to regular lessons
    return await getCardsByCategory('fundamentals');
  }
}

// Advanced filtering with multiple criteria - temporarily using legacy fallback
export async function getFilteredLessons(filters: {
  domains?: string[];
  topics?: string[];
  difficulties?: string[];
  tags?: string[];
  limit?: number;
}): Promise<EnhancedLearnCard[]> {
  try {
    // TODO: Scalable system disabled - using legacy fallback
    console.log(`⚠️ Using legacy system for filtered lessons`);
    
    // Fallback to category-based loading
    const domain = filters.domains?.[0] || 'javascript';
    const categoryMap: { [key: string]: string } = {
      'javascript': 'fundamentals',
      'react': 'web-development',
      'algorithms': 'data-structures'
    };
    
    return await getCardsByCategory(categoryMap[domain] || 'fundamentals');
    
    /* Future implementation:
    await ensureMigration();
    
    const result = await scalableDataLoader.getCards(filters);
    return result.cards.map(convertToLegacyCard);
    */
    
  } catch (error) {
    console.error('Failed to load filtered lessons:', error);
    
    // Fallback to category-based loading
    const domain = filters.domains?.[0] || 'javascript';
    const categoryMap: { [key: string]: string } = {
      'javascript': 'fundamentals',
      'react': 'web-development',
      'algorithms': 'data-structures'
    };
    
    return await getCardsByCategory(categoryMap[domain] || 'fundamentals');
  }
}

// Get system statistics and performance metrics - temporarily using legacy only
export async function getSystemStats() {
  try {
    // TODO: Scalable system disabled - using legacy stats only
    console.log(`⚠️ Using legacy system stats only`);
    const legacyDataLoader = await import('./dataLoader');
    const legacyStats = legacyDataLoader.getMemoryStats();
    
    return {
      scalableSystem: { disabled: true },
      legacySystem: legacyStats,
      migrationStatus,
      performance: { cacheHitRate: 0, avgSearchTime: 0, totalQueries: 0 }
    };
    
    /* Future implementation:
    await ensureMigration();
    
    const scalableStats = scalableDataLoader.getSystemStats();
    const legacyDataLoader = await import('./dataLoader');
    const legacyStats = legacyDataLoader.getMemoryStats();
    
    return {
      scalableSystem: scalableStats,
      legacySystem: legacyStats,
      migrationStatus,
      performance: {
        cacheHitRate: scalableStats.cacheStats ? 
          (scalableStats.cacheHits / (scalableStats.cacheHits + scalableStats.cacheMisses)) * 100 : 0,
        avgSearchTime: scalableStats.averageSearchTime || 0,
        totalQueries: scalableStats.searchQueries || 0
      }
    };
    */
    
  } catch (error) {
    console.error('Failed to get system stats:', error);
    return {
      error: error.message,
      migrationStatus,
      performance: { cacheHitRate: 0, avgSearchTime: 0, totalQueries: 0 }
    };
  }
}

// Clear all caches for memory optimization - temporarily using legacy only
export async function clearAllCaches(): Promise<void> {
  try {
    // TODO: Scalable system disabled - clear legacy caches only
    console.log('⚠️ Clearing legacy system caches only');
    
    // Clear legacy system caches
    const legacyDataLoader = await import('./dataLoader');
    legacyDataLoader.clearUnusedModules();
    
    console.log('🧹 Legacy caches cleared successfully');
    
    /* Future implementation:
    // Clear scalable system caches
    if (migrationStatus === 'completed') {
      await scalableDataLoader.clearCache();
    }
    
    // Clear legacy system caches
    const legacyDataLoader = await import('./dataLoader');
    legacyDataLoader.clearUnusedModules();
    
    console.log('🧹 All caches cleared successfully');
    */
    
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}

// ============================================================================
// DEVELOPMENT AND DEBUG UTILITIES
// ============================================================================

export const debugUtils = {
  async forceMigration() {
    // TODO: Migration disabled - reset status only
    console.log('⚠️ Migration functionality disabled');
    migrationStatus = 'not_started';
    migrationPromise = null;
    // await ensureMigration(); // Disabled
  },
  
  getMigrationStatus() {
    return { 
      status: migrationStatus, 
      isInProgress: migrationStatus === 'in_progress',
      isCompleted: migrationStatus === 'completed'
    };
  },
  
  async validateData() {
    try {
      // TODO: Validation disabled - return placeholder
      console.log('⚠️ Data validation disabled');
      return { isValid: true, issues: [], disabled: true };
      
      /* Future implementation:
      await ensureMigration();
      return await dataMigrationService.validateMigration();
      */
    } catch (error) {
      return { isValid: false, issues: [error.message] };
    }
  },
  
  getSystemStats,
  clearAllCaches
};

// ============================================================================
// EXPORT ENHANCED API
// ============================================================================

// Export enhanced functions with backward compatibility
export {
  // Enhanced existing functions
  getCardsByCategory,
  searchLessons,
  getLessonsByDifficulty,
  getLessonById,
  getLessonsByTopic,
  
  // New enhanced features
  getPopularLessons,
  getTrendingLessons,
  getFilteredLessons,
  getSystemStats,
  clearAllCaches,
  
  // Migration utilities
  ensureMigration,
  migrationStatus,
};

// Re-export all legacy functions for backward compatibility
export * from './dataLoader';