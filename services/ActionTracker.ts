import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { ActionMetadata, ActionType } from '@/store/enhancedProgressStore';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TrackingConfig {
  batchSize: number;
  batchIntervalMs: number;
  maxQueueSize: number;
  retryAttempts: number;
  retryDelayMs: number;
  enableOfflineStorage: boolean;
  enablePerformanceMonitoring: boolean;
  enableDetailedLogging: boolean;
}

export interface ActionContext {
  screenName?: string;
  previousAction?: ActionType;
  sessionId?: string;
  userAgent?: string;
  networkStatus: 'online' | 'offline';
  batteryLevel?: number;
  memoryUsage?: number;
  performanceMetrics?: {
    renderTime?: number;
    interactionDelay?: number;
    loadTime?: number;
  };
}

export interface QueuedAction extends ActionMetadata {
  retryCount: number;
  queuedAt: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface BatchPayload {
  batchId: string;
  actions: QueuedAction[];
  timestamp: number;
  deviceInfo: {
    platform: string;
    version: string;
    model?: string;
    screenSize?: { width: number; height: number };
  };
}

export interface TrackingMetrics {
  totalActions: number;
  successfulBatches: number;
  failedBatches: number;
  retryAttempts: number;
  averageLatency: number;
  queueSize: number;
  lastSyncTimestamp: number;
  errorRate: number;
}

// ============================================================================
// COMPREHENSIVE ACTION TRACKER SERVICE
// ============================================================================

class ActionTrackerService {
  private static instance: ActionTrackerService;
  private config: TrackingConfig;
  private actionQueue: QueuedAction[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private isOnline = true;
  private currentSessionId: string | null = null;
  private metrics: TrackingMetrics;
  
  // Storage keys
  private readonly QUEUE_STORAGE_KEY = '@action_tracker_queue';
  private readonly METRICS_STORAGE_KEY = '@action_tracker_metrics';
  private readonly CONFIG_STORAGE_KEY = '@action_tracker_config';
  
  // Performance monitoring
  private performanceStartTimes: Map<string, number> = new Map();
  private latencyHistory: number[] = [];
  
  private constructor() {
    this.config = {
      batchSize: 50,
      batchIntervalMs: 30000, // 30 seconds
      maxQueueSize: 1000,
      retryAttempts: 3,
      retryDelayMs: 5000,
      enableOfflineStorage: true,
      enablePerformanceMonitoring: true,
      enableDetailedLogging: __DEV__
    };
    
    this.metrics = {
      totalActions: 0,
      successfulBatches: 0,
      failedBatches: 0,
      retryAttempts: 0,
      averageLatency: 0,
      queueSize: 0,
      lastSyncTimestamp: 0,
      errorRate: 0
    };
    
    this.initialize();
  }
  
  static getInstance(): ActionTrackerService {
    if (!ActionTrackerService.instance) {
      ActionTrackerService.instance = new ActionTrackerService();
    }
    return ActionTrackerService.instance;
  }
  
  // =====================================================================
  // INITIALIZATION
  // =====================================================================
  
  private async initialize(): Promise<void> {
    try {
      // Load persisted configuration
      await this.loadConfig();
      
      // Load persisted queue
      await this.loadQueue();
      
      // Load metrics
      await this.loadMetrics();
      
      // Set up network monitoring
      this.setupNetworkMonitoring();
      
      // Start batch processing
      this.startBatchProcessing();
      
      // Load existing session or create new one
      this.currentSessionId = await this.getOrCreateSessionId();
      
      if (this.config.enableDetailedLogging) {
        console.log('🔍 ActionTracker initialized:', {
          queueSize: this.actionQueue.length,
          isOnline: this.isOnline,
          sessionId: this.currentSessionId
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize ActionTracker:', error);
    }
  }
  
  private async loadConfig(): Promise<void> {
    try {
      const savedConfig = await AsyncStorage.getItem(this.CONFIG_STORAGE_KEY);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        this.config = { ...this.config, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load ActionTracker config:', error);
    }
  }
  
  private async loadQueue(): Promise<void> {
    try {
      if (!this.config.enableOfflineStorage) return;
      
      const savedQueue = await AsyncStorage.getItem(this.QUEUE_STORAGE_KEY);
      if (savedQueue) {
        this.actionQueue = JSON.parse(savedQueue);
        this.metrics.queueSize = this.actionQueue.length;
      }
    } catch (error) {
      console.error('Failed to load ActionTracker queue:', error);
      this.actionQueue = [];
    }
  }
  
  private async loadMetrics(): Promise<void> {
    try {
      const savedMetrics = await AsyncStorage.getItem(this.METRICS_STORAGE_KEY);
      if (savedMetrics) {
        this.metrics = { ...this.metrics, ...JSON.parse(savedMetrics) };
      }
    } catch (error) {
      console.error('Failed to load ActionTracker metrics:', error);
    }
  }
  
  // =====================================================================
  // CORE TRACKING FUNCTIONALITY
  // =====================================================================
  
  async trackAction(
    actionType: ActionType,
    entityId: string,
    entityType: 'lesson' | 'card' | 'quiz' | 'screen' | 'system',
    metadata?: Record<string, any>,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<void> {
    try {
      const timestamp = Date.now();
      const context = await this.buildActionContext();
      
      const action: QueuedAction = {
        actionType,
        timestamp,
        entityId,
        entityType,
        context,
        metadata,
        retryCount: 0,
        queuedAt: timestamp,
        priority
      };
      
      // Add to queue
      await this.enqueueAction(action);
      
      // Update metrics
      this.metrics.totalActions++;
      this.updateMetrics();
      
      if (this.config.enableDetailedLogging) {
        console.log(`📊 Action tracked: ${actionType} on ${entityType}:${entityId}`);
      }
      
      // Trigger immediate processing for critical actions
      if (priority === 'critical' && this.isOnline) {
        await this.processBatch(true);
      }
      
    } catch (error) {
      console.error('❌ Failed to track action:', error);
      throw error;
    }
  }
  
  async trackBatch(actions: Array<{
    actionType: ActionType;
    entityId: string;
    entityType: 'lesson' | 'card' | 'quiz' | 'screen' | 'system';
    metadata?: Record<string, any>;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  }>): Promise<void> {
    try {
      const timestamp = Date.now();
      const context = await this.buildActionContext();
      
      const queuedActions: QueuedAction[] = actions.map(actionData => ({
        actionType: actionData.actionType,
        timestamp,
        entityId: actionData.entityId,
        entityType: actionData.entityType,
        context,
        metadata: actionData.metadata,
        retryCount: 0,
        queuedAt: timestamp,
        priority: actionData.priority || 'medium'
      }));
      
      // Add all actions to queue
      for (const action of queuedActions) {
        await this.enqueueAction(action);
      }
      
      // Update metrics
      this.metrics.totalActions += actions.length;
      this.updateMetrics();
      
      if (this.config.enableDetailedLogging) {
        console.log(`📊 Batch tracked: ${actions.length} actions`);
      }
      
    } catch (error) {
      console.error('❌ Failed to track batch:', error);
      throw error;
    }
  }
  
  // =====================================================================
  // SPECIALIZED TRACKING METHODS
  // =====================================================================
  
  async trackCardInteraction(
    cardId: string,
    interactionType: 'swipe_up' | 'swipe_down' | 'swipe_left' | 'swipe_right' | 'tap' | 'long_press' | 'double_tap',
    metadata?: {
      swipeVelocity?: number;
      swipeDistance?: number;
      swipeDirection?: number;
      pressureSensitive?: number;
      duration?: number;
    }
  ): Promise<void> {
    const actionType = `card_${interactionType}` as ActionType;
    await this.trackAction(actionType, cardId, 'card', metadata, 'medium');
  }
  
  async trackLearningProgress(
    lessonId: string,
    progressType: 'started' | 'completed' | 'paused' | 'resumed',
    metadata?: {
      timeSpent?: number;
      completionPercentage?: number;
      difficulty?: string;
      category?: string;
    }
  ): Promise<void> {
    const actionType = `lesson_${progressType}` as ActionType;
    await this.trackAction(actionType, lessonId, 'lesson', metadata, 'high');
  }
  
  async trackQuizActivity(
    quizId: string,
    activityType: 'started' | 'completed' | 'failed' | 'answer_selected',
    metadata?: {
      score?: number;
      timeSpent?: number;
      questionIndex?: number;
      selectedAnswer?: string;
      correctAnswer?: string;
      attempts?: number;
    }
  ): Promise<void> {
    const actionType = `quiz_${activityType}` as ActionType;
    await this.trackAction(actionType, quizId, 'quiz', metadata, 'high');
  }
  
  async trackNavigation(
    screenName: string,
    metadata?: {
      previousScreen?: string;
      navigationMethod?: 'tab' | 'button' | 'swipe' | 'back';
      timeOnPreviousScreen?: number;
      deepLink?: string;
    }
  ): Promise<void> {
    await this.trackAction('screen_viewed', screenName, 'screen', metadata, 'low');
  }
  
  async trackEngagement(
    entityId: string,
    engagementType: 'bookmark_added' | 'bookmark_removed' | 'like_added' | 'like_removed' | 'content_shared',
    entityType: 'lesson' | 'card' = 'lesson',
    metadata?: {
      shareMethod?: string;
      shareTarget?: string;
      userSentiment?: 'positive' | 'negative' | 'neutral';
    }
  ): Promise<void> {
    await this.trackAction(engagementType, entityId, entityType, metadata, 'medium');
  }
  
  async trackPerformance(
    eventType: 'app_launch' | 'app_crash' | 'memory_warning' | 'network_error',
    metadata?: {
      launchTime?: number;
      memoryUsage?: number;
      crashReason?: string;
      errorCode?: string;
      stackTrace?: string;
    }
  ): Promise<void> {
    await this.trackAction(eventType as ActionType, 'system', 'system', metadata, 'critical');
  }
  
  // =====================================================================
  // QUEUE MANAGEMENT
  // =====================================================================
  
  private async enqueueAction(action: QueuedAction): Promise<void> {
    // Check queue size limit
    if (this.actionQueue.length >= this.config.maxQueueSize) {
      // Remove oldest low priority actions to make space
      this.actionQueue = this.actionQueue.filter(a => a.priority !== 'low');
      
      if (this.actionQueue.length >= this.config.maxQueueSize) {
        // Still at capacity, remove oldest medium priority
        this.actionQueue.sort((a, b) => a.queuedAt - b.queuedAt);
        this.actionQueue = this.actionQueue.slice(this.config.batchSize);
      }
    }
    
    // Add action to queue with priority sorting
    this.actionQueue.push(action);
    this.sortQueueByPriority();
    
    // Update queue size metric
    this.metrics.queueSize = this.actionQueue.length;
    
    // Persist queue if offline storage enabled
    if (this.config.enableOfflineStorage) {
      await this.persistQueue();
    }
  }
  
  private sortQueueByPriority(): void {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    this.actionQueue.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, sort by timestamp
      return a.queuedAt - b.queuedAt;
    });
  }
  
  private async persistQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.QUEUE_STORAGE_KEY, JSON.stringify(this.actionQueue));
    } catch (error) {
      console.error('Failed to persist action queue:', error);
    }
  }
  
  // =====================================================================
  // BATCH PROCESSING
  // =====================================================================
  
  private startBatchProcessing(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
    
    this.batchTimer = setInterval(() => {
      this.processBatch(false);
    }, this.config.batchIntervalMs);
  }
  
  private async processBatch(forceBatch = false): Promise<void> {
    if (this.actionQueue.length === 0) return;
    
    // Don't process if offline unless forced
    if (!this.isOnline && !forceBatch) return;
    
    // Determine batch size
    const batchSize = forceBatch ? this.actionQueue.length : Math.min(this.config.batchSize, this.actionQueue.length);
    
    if (batchSize === 0) return;
    
    // Extract batch from queue
    const batch = this.actionQueue.splice(0, batchSize);
    this.metrics.queueSize = this.actionQueue.length;
    
    try {
      await this.sendBatch(batch);
      this.metrics.successfulBatches++;
      
      if (this.config.enableDetailedLogging) {
        console.log(`✅ Batch sent successfully: ${batch.length} actions`);
      }
      
    } catch (error) {
      console.error('❌ Failed to send batch:', error);
      
      // Add failed actions back to queue with retry logic
      await this.handleBatchFailure(batch, error);
      this.metrics.failedBatches++;
    }
    
    // Update persisted queue
    if (this.config.enableOfflineStorage) {
      await this.persistQueue();
    }
    
    this.updateMetrics();
  }
  
  private async sendBatch(actions: QueuedAction[]): Promise<void> {
    const startTime = Date.now();
    
    const batch: BatchPayload = {
      batchId: `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      actions,
      timestamp: Date.now(),
      deviceInfo: await this.getDeviceInfo()
    };
    
    // In a real implementation, this would send to your analytics service
    // For now, we'll simulate the network call and process locally
    await this.simulateBatchSend(batch);
    
    // Record latency
    const latency = Date.now() - startTime;
    this.latencyHistory.push(latency);
    if (this.latencyHistory.length > 100) {
      this.latencyHistory = this.latencyHistory.slice(-100);
    }
    
    // Update average latency
    this.metrics.averageLatency = this.latencyHistory.reduce((a, b) => a + b, 0) / this.latencyHistory.length;
  }
  
  private async simulateBatchSend(batch: BatchPayload): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    // Simulate occasional network failures
    if (Math.random() < 0.05) { // 5% failure rate
      throw new Error('Network timeout');
    }
    
    // Process actions locally (integrate with enhanced progress store)
    try {
      const { useEnhancedProgressStore } = await import('@/store/useEnhancedProgressStore');
      const store = useEnhancedProgressStore.getState();
      
      for (const action of batch.actions) {
        await store.trackAction({
          actionType: action.actionType,
          entityId: action.entityId,
          entityType: action.entityType,
          context: action.context,
          metadata: action.metadata
        });
      }
      
    } catch (error) {
      console.error('Failed to process batch locally:', error);
      throw error;
    }
  }
  
  private async handleBatchFailure(actions: QueuedAction[], error: any): Promise<void> {
    // Increment retry count for each action
    const retriableActions = actions
      .map(action => ({ ...action, retryCount: action.retryCount + 1 }))
      .filter(action => action.retryCount <= this.config.retryAttempts);
    
    // Add retriable actions back to front of queue
    this.actionQueue.unshift(...retriableActions);
    this.sortQueueByPriority();
    
    this.metrics.retryAttempts += retriableActions.length;
    
    if (this.config.enableDetailedLogging) {
      console.log(`🔄 Retrying ${retriableActions.length} actions (attempt ${retriableActions[0]?.retryCount || 0}/${this.config.retryAttempts})`);
    }
  }
  
  // =====================================================================
  // CONTEXT BUILDING
  // =====================================================================
  
  private async buildActionContext(): Promise<ActionContext> {
    const networkState = await NetInfo.fetch();
    
    const context: ActionContext = {
      sessionId: this.currentSessionId || undefined,
      networkStatus: networkState.isConnected ? 'online' : 'offline'
    };
    
    // Add performance metrics if enabled
    if (this.config.enablePerformanceMonitoring) {
      context.performanceMetrics = await this.collectPerformanceMetrics();
    }
    
    return context;
  }
  
  private async collectPerformanceMetrics(): Promise<ActionContext['performanceMetrics']> {
    // In a real implementation, you would collect actual performance metrics
    // For now, we'll return mock data
    return {
      renderTime: Math.random() * 16, // Simulate render time in ms
      interactionDelay: Math.random() * 100, // Simulate interaction delay
      loadTime: Math.random() * 1000 // Simulate load time
    };
  }
  
  private async getDeviceInfo(): Promise<BatchPayload['deviceInfo']> {
    // In React Native, you would use react-native-device-info
    // For now, we'll return mock data
    return {
      platform: 'unknown',
      version: '1.0.0'
    };
  }
  
  // =====================================================================
  // SESSION MANAGEMENT
  // =====================================================================
  
  private async getOrCreateSessionId(): Promise<string> {
    const SESSION_KEY = '@action_tracker_session';
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
    
    try {
      const sessionData = await AsyncStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const { sessionId, timestamp } = JSON.parse(sessionData);
        
        // Check if session is still valid
        if (Date.now() - timestamp < SESSION_DURATION) {
          return sessionId;
        }
      }
      
      // Create new session
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({
        sessionId: newSessionId,
        timestamp: Date.now()
      }));
      
      return newSessionId;
      
    } catch (error) {
      console.error('Failed to manage session:', error);
      return `session_${Date.now()}_fallback`;
    }
  }
  
  // =====================================================================
  // NETWORK MONITORING
  // =====================================================================
  
  private setupNetworkMonitoring(): void {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected || false;
      
      if (wasOffline && this.isOnline) {
        // Back online - process queued actions
        this.processBatch(true);
        
        if (this.config.enableDetailedLogging) {
          console.log('📶 Back online - processing queued actions');
        }
      }
    });
  }
  
  // =====================================================================
  // METRICS & ANALYTICS
  // =====================================================================
  
  private async updateMetrics(): Promise<void> {
    // Calculate error rate
    const totalBatches = this.metrics.successfulBatches + this.metrics.failedBatches;
    this.metrics.errorRate = totalBatches > 0 ? (this.metrics.failedBatches / totalBatches) * 100 : 0;
    
    // Update last sync timestamp
    this.metrics.lastSyncTimestamp = Date.now();
    
    // Persist metrics
    try {
      await AsyncStorage.setItem(this.METRICS_STORAGE_KEY, JSON.stringify(this.metrics));
    } catch (error) {
      console.error('Failed to persist metrics:', error);
    }
  }
  
  getMetrics(): TrackingMetrics {
    return { ...this.metrics };
  }
  
  getQueueStatus(): {
    size: number;
    oldestAction: number | null;
    priorityBreakdown: Record<string, number>;
  } {
    const priorityBreakdown: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    this.actionQueue.forEach(action => {
      priorityBreakdown[action.priority]++;
    });
    
    const oldestAction = this.actionQueue.length > 0 
      ? Math.min(...this.actionQueue.map(a => a.queuedAt))
      : null;
    
    return {
      size: this.actionQueue.length,
      oldestAction,
      priorityBreakdown
    };
  }
  
  // =====================================================================
  // CONFIGURATION & MANAGEMENT
  // =====================================================================
  
  async updateConfig(newConfig: Partial<TrackingConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    
    try {
      await AsyncStorage.setItem(this.CONFIG_STORAGE_KEY, JSON.stringify(this.config));
      
      // Restart batch processing with new interval
      this.startBatchProcessing();
      
    } catch (error) {
      console.error('Failed to update ActionTracker config:', error);
    }
  }
  
  getConfig(): TrackingConfig {
    return { ...this.config };
  }
  
  async flushQueue(): Promise<void> {
    if (this.actionQueue.length > 0) {
      await this.processBatch(true);
    }
  }
  
  async clearQueue(): Promise<void> {
    this.actionQueue = [];
    this.metrics.queueSize = 0;
    
    if (this.config.enableOfflineStorage) {
      await AsyncStorage.removeItem(this.QUEUE_STORAGE_KEY);
    }
  }
  
  async reset(): Promise<void> {
    // Clear queue
    await this.clearQueue();
    
    // Reset metrics
    this.metrics = {
      totalActions: 0,
      successfulBatches: 0,
      failedBatches: 0,
      retryAttempts: 0,
      averageLatency: 0,
      queueSize: 0,
      lastSyncTimestamp: 0,
      errorRate: 0
    };
    
    // Clear persisted data
    await AsyncStorage.multiRemove([
      this.QUEUE_STORAGE_KEY,
      this.METRICS_STORAGE_KEY
    ]);
    
    console.log('🧹 ActionTracker reset complete');
  }
  
  // Cleanup method for app shutdown
  destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const actionTracker = ActionTrackerService.getInstance();

// Export specialized tracking functions for easy use
export const trackCardInteraction = (
  cardId: string,
  interactionType: 'swipe_up' | 'swipe_down' | 'swipe_left' | 'swipe_right' | 'tap' | 'long_press' | 'double_tap',
  metadata?: any
) => actionTracker.trackCardInteraction(cardId, interactionType, metadata);

export const trackLearningProgress = (
  lessonId: string,
  progressType: 'started' | 'completed' | 'paused' | 'resumed',
  metadata?: any
) => actionTracker.trackLearningProgress(lessonId, progressType, metadata);

export const trackQuizActivity = (
  quizId: string,
  activityType: 'started' | 'completed' | 'failed' | 'answer_selected',
  metadata?: any
) => actionTracker.trackQuizActivity(quizId, activityType, metadata);

export const trackNavigation = (
  screenName: string,
  metadata?: any
) => actionTracker.trackNavigation(screenName, metadata);

export const trackEngagement = (
  entityId: string,
  engagementType: 'bookmark_added' | 'bookmark_removed' | 'like_added' | 'like_removed' | 'content_shared',
  entityType: 'lesson' | 'card' = 'lesson',
  metadata?: any
) => actionTracker.trackEngagement(entityId, engagementType, entityType, metadata);

export default actionTracker;