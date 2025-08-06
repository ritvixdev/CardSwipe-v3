import AsyncStorage from '@react-native-async-storage/async-storage';
import { compress, decompress } from 'lz-string';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessedAt: number;
  size: number; // bytes
  compressed: boolean;
}

export interface CacheConfig {
  maxMemorySize: number; // MB
  maxStorageSize: number; // MB
  defaultTTL: number; // milliseconds
  compressionThreshold: number; // bytes
  enableCompression: boolean;
  maxEntries: number;
  cleanupInterval: number; // milliseconds
  evictionPolicy: 'LRU' | 'LFU' | 'FIFO';
}

export interface StorageStats {
  totalSize: number;
  entryCount: number;
  hitRate: number;
  missRate: number;
  compressionRatio: number;
  memoryUsage: number;
  storageUsage: number;
  evictionCount: number;
  lastCleanup: number;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  compressions: number;
  decompressions: number;
  totalOperations: number;
  averageAccessTime: number;
}

// ============================================================================
// PERFORMANCE-OPTIMIZED CACHE & STORAGE SERVICE
// ============================================================================

class CacheStorageService {
  private static instance: CacheStorageService;
  private config: CacheConfig;
  
  // Multi-level cache
  private memoryCache: Map<string, CacheEntry> = new Map();
  private memorySize = 0;
  
  // Performance metrics
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    compressions: 0,
    decompressions: 0,
    totalOperations: 0,
    averageAccessTime: 0
  };
  
  // Background operations
  private cleanupTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;
  
  // Storage keys
  private readonly CACHE_PREFIX = '@cache_';
  private readonly METADATA_KEY = '@cache_metadata';
  private readonly CONFIG_KEY = '@cache_config';
  
  private constructor() {
    this.config = {
      maxMemorySize: 10, // 10MB
      maxStorageSize: 50, // 50MB
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      compressionThreshold: 1024, // 1KB
      enableCompression: true,
      maxEntries: 1000,
      cleanupInterval: 5 * 60 * 1000, // 5 minutes
      evictionPolicy: 'LRU'
    };
    
    this.initialize();
  }
  
  static getInstance(): CacheStorageService {
    if (!CacheStorageService.instance) {
      CacheStorageService.instance = new CacheStorageService();
    }
    return CacheStorageService.instance;
  }
  
  // =====================================================================
  // INITIALIZATION
  // =====================================================================
  
  private async initialize(): Promise<void> {
    try {
      await this.loadConfig();
      await this.loadCacheMetadata();
      await this.startBackgroundCleanup();
      
      this.isInitialized = true;
      console.log('💾 CacheStorageService initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize CacheStorageService:', error);
    }
  }
  
  private async loadConfig(): Promise<void> {
    try {
      const savedConfig = await AsyncStorage.getItem(this.CONFIG_KEY);
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('Failed to load cache config:', error);
    }
  }
  
  private async loadCacheMetadata(): Promise<void> {
    try {
      const metadata = await AsyncStorage.getItem(this.METADATA_KEY);
      if (metadata) {
        this.metrics = { ...this.metrics, ...JSON.parse(metadata) };
      }
    } catch (error) {
      console.error('Failed to load cache metadata:', error);
    }
  }
  
  private startBackgroundCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      this.performCleanup();
    }, this.config.cleanupInterval);
  }
  
  // =====================================================================
  // CORE CACHE OPERATIONS
  // =====================================================================
  
  async set<T>(
    key: string,
    data: T,
    ttl: number = this.config.defaultTTL,
    options: {
      forceCompression?: boolean;
      priority?: 'low' | 'medium' | 'high';
      tags?: string[];
    } = {}
  ): Promise<boolean> {
    const startTime = performance.now();
    
    try {
      const serialized = JSON.stringify(data);
      const size = new Blob([serialized]).size;
      const shouldCompress = this.config.enableCompression && 
        (options.forceCompression || size > this.config.compressionThreshold);
      
      let processedData = serialized;
      let compressed = false;
      
      if (shouldCompress) {
        processedData = compress(serialized);
        compressed = true;
        this.metrics.compressions++;
      }
      
      const entry: CacheEntry<T> = {
        data: processedData as any,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
        accessCount: 0,
        lastAccessedAt: Date.now(),
        size,
        compressed
      };
      
      // Store in memory cache
      await this.setMemoryCache(key, entry);
      
      // Store in persistent storage
      await this.setPersistentCache(key, entry);
      
      this.updateMetrics(startTime);
      return true;
      
    } catch (error) {
      console.error('❌ Cache set failed:', error);
      return false;
    }
  }
  
  async get<T>(key: string): Promise<T | null> {
    const startTime = performance.now();
    this.metrics.totalOperations++;
    
    try {
      // Try memory cache first
      let entry = this.memoryCache.get(key);
      
      if (entry) {
        // Check expiration
        if (Date.now() > entry.expiresAt) {
          await this.delete(key);
          this.metrics.misses++;
          return null;
        }
        
        // Update access metrics
        entry.accessCount++;
        entry.lastAccessedAt = Date.now();
        
        this.metrics.hits++;
        const data = await this.deserializeData<T>(entry);
        this.updateMetrics(startTime);
        return data;
      }
      
      // Try persistent cache
      entry = await this.getPersistentCache(key);
      
      if (entry) {
        // Check expiration
        if (Date.now() > entry.expiresAt) {
          await this.delete(key);
          this.metrics.misses++;
          return null;
        }
        
        // Load into memory cache for faster future access
        await this.setMemoryCache(key, entry);
        
        // Update access metrics
        entry.accessCount++;
        entry.lastAccessedAt = Date.now();
        
        this.metrics.hits++;
        const data = await this.deserializeData<T>(entry);
        this.updateMetrics(startTime);
        return data;
      }
      
      this.metrics.misses++;
      this.updateMetrics(startTime);
      return null;
      
    } catch (error) {
      console.error('❌ Cache get failed:', error);
      this.metrics.misses++;
      this.updateMetrics(startTime);
      return null;
    }
  }
  
  async has(key: string): Promise<boolean> {
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key)!;
      return Date.now() <= entry.expiresAt;
    }
    
    try {
      const entry = await this.getPersistentCache(key);
      return entry !== null && Date.now() <= entry.expiresAt;
    } catch {
      return false;
    }
  }
  
  async delete(key: string): Promise<boolean> {
    try {
      // Remove from memory cache
      const memoryEntry = this.memoryCache.get(key);
      if (memoryEntry) {
        this.memorySize -= memoryEntry.size;
        this.memoryCache.delete(key);
      }
      
      // Remove from persistent storage
      await AsyncStorage.removeItem(this.getCacheKey(key));
      
      return true;
    } catch (error) {
      console.error('❌ Cache delete failed:', error);
      return false;
    }
  }
  
  async clear(): Promise<void> {
    try {
      // Clear memory cache
      this.memoryCache.clear();
      this.memorySize = 0;
      
      // Clear persistent storage
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
      
      // Reset metrics
      this.metrics.hits = 0;
      this.metrics.misses = 0;
      this.metrics.evictions = 0;
      
      console.log('🧹 Cache cleared successfully');
    } catch (error) {
      console.error('❌ Cache clear failed:', error);
    }
  }
  
  // =====================================================================
  // MEMORY CACHE OPERATIONS
  // =====================================================================
  
  private async setMemoryCache(key: string, entry: CacheEntry): Promise<void> {
    // Check if we need to evict entries
    if (this.memoryCache.size >= this.config.maxEntries ||
        this.memorySize + entry.size > this.config.maxMemorySize * 1024 * 1024) {
      await this.evictMemoryEntries(entry.size);
    }
    
    // Add to memory cache
    this.memoryCache.set(key, entry);
    this.memorySize += entry.size;
  }
  
  private async evictMemoryEntries(requiredSize: number): Promise<void> {
    const entries = Array.from(this.memoryCache.entries());
    
    // Sort based on eviction policy
    switch (this.config.evictionPolicy) {
      case 'LRU':
        entries.sort(([, a], [, b]) => a.lastAccessedAt - b.lastAccessedAt);
        break;
      case 'LFU':
        entries.sort(([, a], [, b]) => a.accessCount - b.accessCount);
        break;
      case 'FIFO':
        entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
        break;
    }
    
    let freedSize = 0;
    const maxMemoryBytes = this.config.maxMemorySize * 1024 * 1024;
    
    for (const [key, entry] of entries) {
      if (this.memorySize - freedSize <= maxMemoryBytes * 0.8 && 
          freedSize >= requiredSize) {
        break;
      }
      
      this.memoryCache.delete(key);
      freedSize += entry.size;
      this.metrics.evictions++;
    }
    
    this.memorySize -= freedSize;
  }
  
  // =====================================================================
  // PERSISTENT CACHE OPERATIONS
  // =====================================================================
  
  private async setPersistentCache(key: string, entry: CacheEntry): Promise<void> {
    try {
      const serialized = JSON.stringify(entry);
      await AsyncStorage.setItem(this.getCacheKey(key), serialized);
    } catch (error) {
      console.error('Failed to set persistent cache:', error);
    }
  }
  
  private async getPersistentCache(key: string): Promise<CacheEntry | null> {
    try {
      const data = await AsyncStorage.getItem(this.getCacheKey(key));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get persistent cache:', error);
      return null;
    }
  }
  
  // =====================================================================
  // DATA SERIALIZATION
  // =====================================================================
  
  private async deserializeData<T>(entry: CacheEntry): Promise<T> {
    let data = entry.data;
    
    if (entry.compressed) {
      data = decompress(data as string);
      this.metrics.decompressions++;
    }
    
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    
    return data as T;
  }
  
  // =====================================================================
  // ADVANCED OPERATIONS
  // =====================================================================
  
  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};
    
    await Promise.all(
      keys.map(async (key) => {
        result[key] = await this.get<T>(key);
      })
    );
    
    return result;
  }
  
  async setMultiple<T>(
    entries: Array<{ key: string; data: T; ttl?: number }>,
    options?: { forceCompression?: boolean; priority?: 'low' | 'medium' | 'high' }
  ): Promise<boolean[]> {
    return Promise.all(
      entries.map(entry => 
        this.set(entry.key, entry.data, entry.ttl, options)
      )
    );
  }
  
  async deleteMultiple(keys: string[]): Promise<boolean[]> {
    return Promise.all(keys.map(key => this.delete(key)));
  }
  
  async getByPrefix<T>(prefix: string): Promise<Record<string, T>> {
    const result: Record<string, T> = {};
    
    // Search memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (key.startsWith(prefix) && Date.now() <= entry.expiresAt) {
        result[key] = await this.deserializeData<T>(entry);
      }
    }
    
    // Search persistent cache
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const matchingKeys = allKeys
        .filter(key => key.startsWith(this.getCacheKey(prefix)))
        .map(key => key.replace(this.CACHE_PREFIX, ''));
      
      for (const key of matchingKeys) {
        if (!result[key]) {
          const data = await this.get<T>(key);
          if (data !== null) {
            result[key] = data;
          }
        }
      }
    } catch (error) {
      console.error('Failed to get by prefix:', error);
    }
    
    return result;
  }
  
  async deleteByPrefix(prefix: string): Promise<number> {
    let deletedCount = 0;
    
    // Delete from memory cache
    const memoryKeys = Array.from(this.memoryCache.keys())
      .filter(key => key.startsWith(prefix));
    
    for (const key of memoryKeys) {
      if (await this.delete(key)) {
        deletedCount++;
      }
    }
    
    // Delete from persistent storage
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const matchingKeys = allKeys
        .filter(key => key.startsWith(this.getCacheKey(prefix)));
      
      await AsyncStorage.multiRemove(matchingKeys);
      deletedCount += matchingKeys.length;
    } catch (error) {
      console.error('Failed to delete by prefix:', error);
    }
    
    return deletedCount;
  }
  
  // =====================================================================
  // CACHE MANAGEMENT
  // =====================================================================
  
  private async performCleanup(): Promise<void> {
    try {
      const startTime = Date.now();
      let cleanedCount = 0;
      
      // Clean expired entries from memory cache
      for (const [key, entry] of this.memoryCache.entries()) {
        if (Date.now() > entry.expiresAt) {
          await this.delete(key);
          cleanedCount++;
        }
      }
      
      // Clean expired entries from persistent storage
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      for (const key of cacheKeys) {
        const cacheKey = key.replace(this.CACHE_PREFIX, '');
        const entry = await this.getPersistentCache(cacheKey);
        
        if (entry && Date.now() > entry.expiresAt) {
          await this.delete(cacheKey);
          cleanedCount++;
        }
      }
      
      // Save updated metrics
      await this.saveMetadata();
      
      if (cleanedCount > 0) {
        console.log(`🧹 Cache cleanup completed: ${cleanedCount} expired entries removed in ${Date.now() - startTime}ms`);
      }
      
    } catch (error) {
      console.error('❌ Cache cleanup failed:', error);
    }
  }
  
  async optimizeStorage(): Promise<void> {
    try {
      console.log('🔧 Starting storage optimization...');
      const startTime = Date.now();
      
      // Compress uncompressed entries that exceed threshold
      let compressedCount = 0;
      
      for (const [key, entry] of this.memoryCache.entries()) {
        if (!entry.compressed && 
            entry.size > this.config.compressionThreshold &&
            this.config.enableCompression) {
          
          const compressed = compress(JSON.stringify(entry.data));
          const newEntry: CacheEntry = {
            ...entry,
            data: compressed as any,
            compressed: true,
            size: new Blob([compressed]).size
          };
          
          this.memoryCache.set(key, newEntry);
          await this.setPersistentCache(key, newEntry);
          compressedCount++;
        }
      }
      
      // Perform cleanup
      await this.performCleanup();
      
      const endTime = Date.now();
      console.log(`✅ Storage optimization completed in ${endTime - startTime}ms: ${compressedCount} entries compressed`);
      
    } catch (error) {
      console.error('❌ Storage optimization failed:', error);
    }
  }
  
  // =====================================================================
  // ANALYTICS & MONITORING
  // =====================================================================
  
  async getStorageStats(): Promise<StorageStats> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      let totalSize = 0;
      let compressedSize = 0;
      
      for (const key of cacheKeys) {
        const cacheKey = key.replace(this.CACHE_PREFIX, '');
        const entry = await this.getPersistentCache(cacheKey);
        if (entry) {
          totalSize += entry.size;
          if (entry.compressed) {
            compressedSize += entry.size;
          }
        }
      }
      
      const hitRate = this.metrics.totalOperations > 0 
        ? (this.metrics.hits / this.metrics.totalOperations) * 100 
        : 0;
        
      const missRate = 100 - hitRate;
      const compressionRatio = totalSize > 0 ? (compressedSize / totalSize) * 100 : 0;
      
      return {
        totalSize,
        entryCount: this.memoryCache.size + cacheKeys.length,
        hitRate,
        missRate,
        compressionRatio,
        memoryUsage: this.memorySize,
        storageUsage: totalSize,
        evictionCount: this.metrics.evictions,
        lastCleanup: Date.now()
      };
      
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        totalSize: 0,
        entryCount: 0,
        hitRate: 0,
        missRate: 0,
        compressionRatio: 0,
        memoryUsage: this.memorySize,
        storageUsage: 0,
        evictionCount: this.metrics.evictions,
        lastCleanup: 0
      };
    }
  }
  
  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }
  
  async exportCacheData(): Promise<string> {
    try {
      const data = {};
      
      // Export memory cache
      for (const [key, entry] of this.memoryCache.entries()) {
        (data as any)[key] = await this.deserializeData(entry);
      }
      
      // Export persistent cache
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      for (const key of cacheKeys) {
        const cacheKey = key.replace(this.CACHE_PREFIX, '');
        if (!(data as any)[cacheKey]) {
          const entry = await this.getPersistentCache(cacheKey);
          if (entry) {
            (data as any)[cacheKey] = await this.deserializeData(entry);
          }
        }
      }
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export cache data:', error);
      throw error;
    }
  }
  
  // =====================================================================
  // CONFIGURATION
  // =====================================================================
  
  async updateConfig(newConfig: Partial<CacheConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    
    try {
      await AsyncStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.config));
      
      // Restart cleanup with new interval
      this.startBackgroundCleanup();
      
      console.log('⚙️ Cache configuration updated');
    } catch (error) {
      console.error('Failed to update cache config:', error);
    }
  }
  
  getConfig(): CacheConfig {
    return { ...this.config };
  }
  
  // =====================================================================
  // UTILITY METHODS
  // =====================================================================
  
  private getCacheKey(key: string): string {
    return `${this.CACHE_PREFIX}${key}`;
  }
  
  private updateMetrics(startTime: number): void {
    const duration = performance.now() - startTime;
    this.metrics.averageAccessTime = 
      (this.metrics.averageAccessTime * (this.metrics.totalOperations - 1) + duration) /
      this.metrics.totalOperations;
  }
  
  private async saveMetadata(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.METADATA_KEY, JSON.stringify(this.metrics));
    } catch (error) {
      console.error('Failed to save cache metadata:', error);
    }
  }
  
  // =====================================================================
  // CLEANUP & RESET
  // =====================================================================
  
  async reset(): Promise<void> {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    await this.clear();
    
    this.metrics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      compressions: 0,
      decompressions: 0,
      totalOperations: 0,
      averageAccessTime: 0
    };
    
    await AsyncStorage.multiRemove([this.METADATA_KEY, this.CONFIG_KEY]);
    
    console.log('🧹 CacheStorageService reset complete');
  }
  
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const cacheStorage = CacheStorageService.getInstance();

// Utility functions for common cache patterns
export const withCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  const cached = await cacheStorage.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  const data = await fetcher();
  await cacheStorage.set(key, data, ttl);
  return data;
};

export const memoize = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string,
  ttl?: number
) => {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = keyGenerator ? keyGenerator(...args) : `memoized_${fn.name}_${JSON.stringify(args)}`;
    
    return withCache(
      key,
      () => fn(...args),
      ttl
    );
  };
};

export default cacheStorage;