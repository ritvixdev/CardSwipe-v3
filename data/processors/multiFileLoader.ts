// ============================================================================
// MULTI-FILE LOADER - HANDLES MULTIPLE JSON FILES PER TOPIC
// ============================================================================
// This system loads content from multiple JSON files to enable better content management

import { LearnCard, JavaScriptNote, Quiz, InterviewQuestion, DesignPattern, CodingQuestion } from './dataLoader';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface FileMetadata {
  fileId: string;
  topic: string;
  subtopic?: string;
  partNumber: number;
  totalParts: number;
  cardCount?: number;
  noteCount?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  prerequisites: string[];
  nextFile?: string;
  previousFile?: string;
  tags: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface MultiFileData<T> {
  metadata: FileMetadata;
  cards?: T[];
  notes?: JavaScriptNote[];
  quizzes?: Quiz[];
  interviews?: InterviewQuestion[];
  patterns?: DesignPattern[];
  coding?: CodingQuestion[];
}

export interface TopicManifest {
  topicId: string;
  name: string;
  description: string;
  totalFiles: number;
  totalCards: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  files: {
    fileId: string;
    path: string;
    subtopic: string;
    cardCount: number;
    difficulty: string;
  }[];
  prerequisites: string[];
  tags: string[];
  version: string;
  updatedAt: string;
}

// Cache interface for multi-file content
interface MultiFileCache {
  [key: string]: {
    data: any[];
    metadata: FileMetadata;
    timestamp: number;
    expiry: number;
  };
}

// ============================================================================
// MULTI-FILE LOADER CLASS
// ============================================================================

class MultiFileLoader {
  private cache: MultiFileCache = {};
  private loadingPromises: Map<string, Promise<any>> = new Map();
  private topicManifests: Map<string, TopicManifest> = new Map();
  
  // Cache configuration
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_CACHE_SIZE = 100; // Max cached files
  
  constructor() {
    this.setupPeriodicCleanup();
  }

  // ============================================================================
  // TOPIC MANIFEST MANAGEMENT
  // ============================================================================

  async loadTopicManifest(topicId: string): Promise<TopicManifest | null> {
    if (this.topicManifests.has(topicId)) {
      return this.topicManifests.get(topicId)!;
    }

    try {
      const manifestPath = `/data/learn/topics/${topicId}.json`;
      const manifest = await this.importJSON(manifestPath);
      
      if (manifest) {
        this.topicManifests.set(topicId, manifest);
        return manifest;
      }
    } catch (error) {
      console.warn(`Topic manifest not found for: ${topicId}`);
    }

    return null;
  }

  async getAvailableTopics(): Promise<string[]> {
    // Get list of available topic manifests
    const topics = ['fundamentals', 'data-structures', 'control-flow', 'functions', 'advanced', 'dom'];
    const availableTopics: string[] = [];

    for (const topic of topics) {
      const manifest = await this.loadTopicManifest(topic);
      if (manifest) {
        availableTopics.push(topic);
      }
    }

    return availableTopics;
  }

  // ============================================================================
  // MULTI-FILE CONTENT LOADING
  // ============================================================================

  async loadTopicPart<T>(topic: string, partNumber: number, type: 'cards' | 'notes' | 'quizzes' = 'cards'): Promise<T[]> {
    const cacheKey = `${topic}-${type}-${partNumber}`;
    
    // Check cache first
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) {
      return cached;
    }

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return await this.loadingPromises.get(cacheKey)!;
    }

    // Start loading
    const loadPromise = this.performTopicPartLoad<T>(topic, partNumber, type);
    this.loadingPromises.set(cacheKey, loadPromise);

    try {
      const result = await loadPromise;
      this.loadingPromises.delete(cacheKey);
      return result;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      console.error(`Failed to load ${topic} part ${partNumber}:`, error);
      return [];
    }
  }

  private async performTopicPartLoad<T>(topic: string, partNumber: number, type: 'cards' | 'notes' | 'quizzes'): Promise<T[]> {
    // Get topic manifest to find the correct file
    const manifest = await this.loadTopicManifest(topic);
    
    if (manifest && manifest.files.length > 0) {
      // Find file by part number or use the first available file
      const targetFile = manifest.files.find(f => f.fileId.endsWith(`-${partNumber.toString().padStart(3, '0')}`)) 
                        || manifest.files[Math.min(partNumber - 1, manifest.files.length - 1)];

      if (targetFile) {
        return await this.loadFileContent<T>(targetFile.path, type);
      }
    }

    // Fallback: Try to construct file path based on naming convention
    const filePath = this.constructFilePath(topic, partNumber, type);
    return await this.loadFileContent<T>(filePath, type);
  }

  async loadCompleteTopic<T>(topic: string, type: 'cards' | 'notes' | 'quizzes' = 'cards'): Promise<T[]> {
    const cacheKey = `${topic}-${type}-complete`;
    
    // Check cache
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const manifest = await this.loadTopicManifest(topic);
      const allContent: T[] = [];

      if (manifest && manifest.files.length > 0) {
        // Load all files for the topic
        const loadPromises = manifest.files.map(file => 
          this.loadFileContent<T>(file.path, type).catch(error => {
            console.warn(`Failed to load file ${file.path}:`, error);
            return [];
          })
        );

        const results = await Promise.all(loadPromises);
        results.forEach(content => allContent.push(...content));
      } else {
        // Fallback: Try to load parts sequentially until we find no more
        let partNumber = 1;
        let hasMoreParts = true;

        while (hasMoreParts && partNumber <= 10) { // Max 10 parts per topic
          try {
            const partContent = await this.loadTopicPart<T>(topic, partNumber, type);
            if (partContent.length > 0) {
              allContent.push(...partContent);
              partNumber++;
            } else {
              hasMoreParts = false;
            }
          } catch (error) {
            hasMoreParts = false;
          }
        }
      }

      // Cache complete topic
      this.addToCache(cacheKey, allContent, {
        fileId: cacheKey,
        topic,
        subtopic: 'complete',
        partNumber: 0,
        totalParts: 1,
        difficulty: 'beginner',
        prerequisites: [],
        tags: [topic],
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log(`✅ Loaded complete topic: ${topic} (${allContent.length} items)`);
      return allContent;

    } catch (error) {
      console.error(`Failed to load complete topic ${topic}:`, error);
      return [];
    }
  }

  // ============================================================================
  // FILE LOADING UTILITIES
  // ============================================================================

  private async loadFileContent<T>(filePath: string, type: 'cards' | 'notes' | 'quizzes'): Promise<T[]> {
    try {
      const fileData = await this.importJSON(filePath) as MultiFileData<T>;
      
      if (!fileData) {
        return [];
      }

      let content: T[] = [];
      
      switch (type) {
        case 'cards':
          content = fileData.cards || [];
          break;
        case 'notes':
          content = (fileData.notes || []) as T[];
          break;
        case 'quizzes':
          content = (fileData.quizzes || []) as T[];
          break;
      }

      // Cache individual file
      if (fileData.metadata) {
        this.addToCache(fileData.metadata.fileId, content, fileData.metadata);
      }

      return content;
    } catch (error) {
      console.warn(`Could not load file: ${filePath}`, error);
      return [];
    }
  }

  private constructFilePath(topic: string, partNumber: number, type: 'cards' | 'notes' | 'quizzes'): string {
    const paddedPart = partNumber.toString().padStart(3, '0');
    
    switch (type) {
      case 'cards':
        return `/data/learn/cards/${topic}/${topic}-${paddedPart}.json`;
      case 'notes':
        return `/data/explore/javascript-notes/${topic}-notes-${paddedPart}.json`;
      case 'quizzes':
        return `/data/explore/practice-quiz/${topic}-quiz-${paddedPart}.json`;
      default:
        return `/data/learn/cards/${topic}/${topic}-${paddedPart}.json`;
    }
  }

  private async importJSON(path: string): Promise<any> {
    try {
      // Dynamic imports are not supported in React Native/Expo bundler
      // Using require() instead for static bundling compatibility
      const module = require(path);
      return module.default || module;
    } catch (error) {
      // Fallback to try different path formats
      const alternativePaths = [
        path.replace('/data/', '../'),
        path.replace('.json', ''),
        path.replace('-', '_')
      ];

      for (const altPath of alternativePaths) {
        try {
          const module = require(altPath);
          return module.default || module;
        } catch (altError) {
          continue;
        }
      }
      
      throw error;
    }
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  private getFromCache<T>(key: string): T[] | null {
    const cached = this.cache[key];
    if (cached && Date.now() < cached.expiry) {
      return cached.data as T[];
    }
    
    if (cached) {
      delete this.cache[key];
    }
    
    return null;
  }

  private addToCache<T>(key: string, data: T[], metadata: FileMetadata): void {
    // Check cache size limit
    if (Object.keys(this.cache).length >= this.MAX_CACHE_SIZE) {
      this.evictOldestCache();
    }

    this.cache[key] = {
      data,
      metadata,
      timestamp: Date.now(),
      expiry: Date.now() + this.CACHE_TTL
    };
  }

  private evictOldestCache(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of Object.entries(this.cache)) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      delete this.cache[oldestKey];
    }
  }

  private setupPeriodicCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of Object.entries(this.cache)) {
        if (now > entry.expiry) {
          delete this.cache[key];
        }
      }
    }, 5 * 60 * 1000); // Clean every 5 minutes
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  // Load cards by topic with automatic part management
  async getCardsByTopic(topic: string, limit?: number): Promise<LearnCard[]> {
    const cards = await this.loadCompleteTopic<LearnCard>(topic, 'cards');
    return limit ? cards.slice(0, limit) : cards;
  }

  // Load specific part of a topic
  async getTopicPart(topic: string, part: number): Promise<LearnCard[]> {
    return await this.loadTopicPart<LearnCard>(topic, part, 'cards');
  }

  // Load notes for explore section
  async getNotesByTopic(topic: string): Promise<JavaScriptNote[]> {
    return await this.loadCompleteTopic<JavaScriptNote>(topic, 'notes');
  }

  // Load quizzes for explore section
  async getQuizzesByTopic(topic: string): Promise<Quiz[]> {
    return await this.loadCompleteTopic<Quiz>(topic, 'quizzes');
  }

  // Get topic information
  async getTopicInfo(topicId: string): Promise<TopicManifest | null> {
    return await this.loadTopicManifest(topicId);
  }

  // Search across multiple files
  async searchContent(query: string, type: 'cards' | 'notes' | 'quizzes' = 'cards'): Promise<any[]> {
    const topics = await this.getAvailableTopics();
    const allResults: any[] = [];

    const searchPromises = topics.map(async topic => {
      const content = await this.loadCompleteTopic(topic, type);
      return content.filter(item => this.matchesQuery(item, query));
    });

    const results = await Promise.all(searchPromises);
    results.forEach(topicResults => allResults.push(...topicResults));

    return allResults;
  }

  private matchesQuery(item: any, query: string): boolean {
    const searchString = query.toLowerCase();
    
    return (
      item.title?.toLowerCase().includes(searchString) ||
      item.content?.toLowerCase().includes(searchString) ||
      item.description?.toLowerCase().includes(searchString) ||
      item.tags?.some((tag: string) => tag.toLowerCase().includes(searchString))
    );
  }

  // Cache management utilities
  clearCache(): void {
    this.cache = {};
    this.topicManifests.clear();
    console.log('🧹 Multi-file cache cleared');
  }

  getCacheStats() {
    return {
      totalCached: Object.keys(this.cache).length,
      cacheSize: this.MAX_CACHE_SIZE,
      manifestsCached: this.topicManifests.size,
      loadingPromises: this.loadingPromises.size
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const multiFileLoader = new MultiFileLoader();
export default multiFileLoader;