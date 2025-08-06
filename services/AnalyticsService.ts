import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import { ActionMetadata, ActionType, EnhancedProgressState } from '@/store/enhancedProgressStore';

// ============================================================================
// COMPREHENSIVE TYPE DEFINITIONS
// ============================================================================

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId: string;
}

interface UserProperties {
  deviceType: string;
  platform: string;
  appVersion: string;
  firstLaunch: string;
  totalSessions: number;
  totalLearningTime: number;
  completedLessons: number;
  currentStreak: number;
  maxStreak: number;
  totalXP: number;
}

export interface EngagementMetrics {
  dailyActiveStreak: number;
  sessionFrequency: number; // sessions per week
  averageSessionDuration: number; // minutes
  actionDiversity: number; // 0-1, variety of actions performed
  contentCompletionRate: number; // 0-1
  interactionDepth: number; // 0-1, how deeply users engage with content
  socialEngagement: number; // 0-1, sharing, feedback, etc.
  overallScore: number; // 0-100
}

export interface LearningPattern {
  id: string;
  name: string;
  description: string;
  indicators: Array<{
    metric: string;
    threshold: number;
    operator: 'above' | 'below' | 'equals';
  }>;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface PredictiveInsights {
  churnRisk: {
    score: number; // 0-1
    factors: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
    recommendations: string[];
  };
  nextBestAction: {
    action: ActionType;
    entityId: string;
    confidence: number;
    expectedOutcome: string;
  };
  optimalLearningTime: {
    preferredHours: number[];
    recommendedSessionLength: number;
    confidence: number;
  };
}

export interface BehaviorAnalysis {
  engagement: EngagementMetrics;
  patterns: LearningPattern[];
  insights: PredictiveInsights;
  lastUpdated: number;
}

export interface AnalyticsConfig {
  enableRealTimeAnalysis: boolean;
  analysisIntervalMinutes: number;
  retentionDays: number;
  privacyMode: 'full' | 'anonymized' | 'minimal';
  enablePredictiveAnalytics: boolean;
  maxStoredReports: number;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string = '';
  private userId: string = '';
  private sessionStartTime: number = 0;
  private isInitialized: boolean = false;
  
  // Advanced analytics properties
  private config: AnalyticsConfig;
  private behaviorAnalysis: BehaviorAnalysis | null = null;
  private analysisTimer: NodeJS.Timeout | null = null;
  
  // Storage keys
  private readonly BEHAVIOR_ANALYSIS_KEY = '@analytics_behavior_analysis';
  private readonly CONFIG_KEY = '@analytics_config';
  
  // Performance tracking
  private analyticsStats = {
    totalAnalyses: 0,
    averageAnalysisTime: 0,
    cacheHitRate: 0,
    predictionAccuracy: 0
  };

  constructor() {
    this.config = {
      enableRealTimeAnalysis: true,
      analysisIntervalMinutes: 15,
      retentionDays: 90,
      privacyMode: 'anonymized',
      enablePredictiveAnalytics: true,
      maxStoredReports: 50
    };
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Generate or retrieve user ID
      this.userId = await this.getUserId();
      
      // Start new session
      await this.startSession();
      
      // Initialize user properties
      await this.initializeUserProperties();
      
      // Initialize advanced analytics
      await this.loadConfig();
      await this.loadBehaviorAnalysis();
      
      if (this.config.enableRealTimeAnalysis) {
        this.startRealTimeAnalysis();
      }
      
      this.isInitialized = true;
      
      // Track app launch
      await this.track('app_launched', {
        platform: Platform.OS,
        device_type: Platform.OS === 'ios' ? 'phone' : 'phone',
        app_version: Application.nativeApplicationVersion,
      });
      
      console.log('📊 Enhanced AnalyticsService initialized');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  private async getUserId(): Promise<string> {
    try {
      let userId = await AsyncStorage.getItem('analytics_user_id');
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem('analytics_user_id', userId);
      }
      return userId;
    } catch (error) {
      console.error('Failed to get user ID:', error);
      return `user_${Date.now()}`;
    }
  }

  private async startSession(): Promise<void> {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.sessionStartTime = Date.now();
    
    // Increment session count
    const totalSessions = await this.getUserProperty('totalSessions', 0);
    await this.setUserProperty('totalSessions', totalSessions + 1);
  }

  private async initializeUserProperties(): Promise<void> {
    const isFirstLaunch = await AsyncStorage.getItem('analytics_first_launch');
    
    if (!isFirstLaunch) {
      await AsyncStorage.setItem('analytics_first_launch', new Date().toISOString());
      await this.setUserProperty('firstLaunch', new Date().toISOString());
      await this.track('first_app_launch');
    }

    // Set device properties
    await this.setUserProperty('deviceType', Platform.OS === 'ios' ? 'phone' : 'phone');
    await this.setUserProperty('platform', Platform.OS);
    await this.setUserProperty('appVersion', Application.nativeApplicationVersion || '1.0.0');
  }

  async track(event: string, properties?: Record<string, any>): Promise<void> {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized');
      return;
    }

    try {
      const analyticsEvent: AnalyticsEvent = {
        event,
        properties: properties || {},
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId,
      };

      // Store event locally (in production, you'd send to analytics service)
      await this.storeEvent(analyticsEvent);
      
      // Log for development
      console.log('Analytics Event:', analyticsEvent);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  private async storeEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const events = await this.getStoredEvents();
      events.push(event);
      
      // Keep only last 1000 events to prevent storage bloat
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }
      
      await AsyncStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to store event:', error);
    }
  }

  private async getStoredEvents(): Promise<AnalyticsEvent[]> {
    try {
      const eventsJson = await AsyncStorage.getItem('analytics_events');
      return eventsJson ? JSON.parse(eventsJson) : [];
    } catch (error) {
      console.error('Failed to get stored events:', error);
      return [];
    }
  }

  async setUserProperty(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(`analytics_user_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to set user property:', error);
    }
  }

  async getUserProperty(key: string, defaultValue?: any): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(`analytics_user_${key}`);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error('Failed to get user property:', error);
      return defaultValue;
    }
  }

  // Learning-specific tracking methods
  async trackLessonStarted(lessonId: number, lessonTitle: string): Promise<void> {
    await this.track('lesson_started', {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
    });
  }

  async trackLessonCompleted(lessonId: number, lessonTitle: string, timeSpent: number): Promise<void> {
    await this.track('lesson_completed', {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      time_spent_seconds: timeSpent,
    });

    // Update user properties
    const completedLessons = await this.getUserProperty('completedLessons', 0);
    await this.setUserProperty('completedLessons', completedLessons + 1);

    const totalLearningTime = await this.getUserProperty('totalLearningTime', 0);
    await this.setUserProperty('totalLearningTime', totalLearningTime + timeSpent);
  }

  async trackLessonBookmarked(lessonId: number, lessonTitle: string): Promise<void> {
    await this.track('lesson_bookmarked', {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
    });
  }

  async trackQuizCompleted(lessonId: number, correct: boolean, timeSpent: number): Promise<void> {
    await this.track('quiz_completed', {
      lesson_id: lessonId,
      correct,
      time_spent_seconds: timeSpent,
    });
  }

  async trackSwipeGesture(direction: 'left' | 'right' | 'up' | 'down', lessonId: number): Promise<void> {
    await this.track('swipe_gesture', {
      direction,
      lesson_id: lessonId,
    });
  }

  async trackStreakUpdated(newStreak: number): Promise<void> {
    await this.track('streak_updated', {
      streak_count: newStreak,
    });

    await this.setUserProperty('currentStreak', newStreak);

    const maxStreak = await this.getUserProperty('maxStreak', 0);
    if (newStreak > maxStreak) {
      await this.setUserProperty('maxStreak', newStreak);
      await this.track('new_max_streak', { streak_count: newStreak });
    }
  }

  async trackXPEarned(amount: number, source: string): Promise<void> {
    await this.track('xp_earned', {
      amount,
      source,
    });

    const totalXP = await this.getUserProperty('totalXP', 0);
    await this.setUserProperty('totalXP', totalXP + amount);
  }

  async trackSettingsChanged(setting: string, value: any): Promise<void> {
    await this.track('settings_changed', {
      setting,
      value,
    });
  }

  async trackAppBackgrounded(): Promise<void> {
    const sessionDuration = Date.now() - this.sessionStartTime;
    await this.track('app_backgrounded', {
      session_duration_seconds: Math.floor(sessionDuration / 1000),
    });
  }

  async trackAppForegrounded(): Promise<void> {
    await this.track('app_foregrounded');
    // Start new session
    await this.startSession();
  }

  // Get analytics summary for user
  async getAnalyticsSummary(): Promise<UserProperties> {
    return {
      deviceType: await this.getUserProperty('deviceType', 'unknown'),
      platform: await this.getUserProperty('platform', Platform.OS),
      appVersion: await this.getUserProperty('appVersion', '1.0.0'),
      firstLaunch: await this.getUserProperty('firstLaunch', new Date().toISOString()),
      totalSessions: await this.getUserProperty('totalSessions', 0),
      totalLearningTime: await this.getUserProperty('totalLearningTime', 0),
      completedLessons: await this.getUserProperty('completedLessons', 0),
      currentStreak: await this.getUserProperty('currentStreak', 0),
      maxStreak: await this.getUserProperty('maxStreak', 0),
      totalXP: await this.getUserProperty('totalXP', 0),
    };
  }

  // Export data for user (GDPR compliance)
  async exportUserData(): Promise<{ events: AnalyticsEvent[]; properties: UserProperties }> {
    const events = await this.getStoredEvents();
    const properties = await this.getAnalyticsSummary();
    
    return { events, properties };
  }

  // Delete all user data (GDPR compliance)
  async deleteUserData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const analyticsKeys = keys.filter(key => key.startsWith('analytics_'));
      await AsyncStorage.multiRemove(analyticsKeys);
      
      console.log('User analytics data deleted');
    } catch (error) {
      console.error('Failed to delete user data:', error);
    }
  }

  // =====================================================================
  // ADVANCED ANALYTICS METHODS
  // =====================================================================

  private async loadConfig(): Promise<void> {
    try {
      const savedConfig = await AsyncStorage.getItem(this.CONFIG_KEY);
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('Failed to load analytics config:', error);
    }
  }

  private async loadBehaviorAnalysis(): Promise<void> {
    try {
      const savedAnalysis = await AsyncStorage.getItem(this.BEHAVIOR_ANALYSIS_KEY);
      if (savedAnalysis) {
        this.behaviorAnalysis = JSON.parse(savedAnalysis);
        
        // Check if analysis is stale
        const staleThreshold = this.config.analysisIntervalMinutes * 60 * 1000;
        if (this.behaviorAnalysis && 
            (Date.now() - this.behaviorAnalysis.lastUpdated) > staleThreshold) {
          this.refreshBehaviorAnalysis();
        }
      }
    } catch (error) {
      console.error('Failed to load behavior analysis:', error);
    }
  }

  private startRealTimeAnalysis(): void {
    if (this.analysisTimer) {
      clearInterval(this.analysisTimer);
    }
    
    this.analysisTimer = setInterval(() => {
      this.refreshBehaviorAnalysis();
    }, this.config.analysisIntervalMinutes * 60 * 1000);
  }

  async analyzeUserBehavior(
    userState: EnhancedProgressState,
    recentActions: ActionMetadata[]
  ): Promise<BehaviorAnalysis> {
    const startTime = Date.now();
    this.analyticsStats.totalAnalyses++;
    
    try {
      const engagement = await this.calculateEngagementMetrics(userState, recentActions);
      const patterns = await this.identifyLearningPatterns(userState, recentActions);
      const insights = await this.generatePredictiveInsights(userState, recentActions, engagement);
      
      const analysis: BehaviorAnalysis = {
        engagement,
        patterns,
        insights,
        lastUpdated: Date.now()
      };
      
      this.behaviorAnalysis = analysis;
      await this.saveBehaviorAnalysis();
      
      const analysisTime = Date.now() - startTime;
      this.updateAnalyticsStats(analysisTime);
      
      return analysis;
    } catch (error) {
      console.error('❌ Behavior analysis failed:', error);
      throw error;
    }
  }

  private async calculateEngagementMetrics(
    userState: EnhancedProgressState,
    recentActions: ActionMetadata[]
  ): Promise<EngagementMetrics> {
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    
    // Calculate daily active streak
    const dailyActiveStreak = this.calculateActiveStreak(userState.analytics.dailyActions);
    
    // Calculate session frequency
    const recentSessions = userState.sessions.history.filter(
      session => (now - session.startTime) <= weekMs
    );
    const sessionFrequency = recentSessions.length;
    
    // Calculate average session duration
    const validSessions = recentSessions.filter(s => s.endTime);
    const averageSessionDuration = validSessions.length > 0
      ? validSessions.reduce((sum, s) => sum + (s.endTime! - s.startTime), 0) / validSessions.length / (60 * 1000)
      : 0;
    
    // Calculate action diversity
    const uniqueActionTypes = new Set(recentActions.map(a => a.actionType));
    const actionDiversity = uniqueActionTypes.size / 25;
    
    // Calculate content completion rate
    const lessonsStarted = Object.keys(userState.lessons).length;
    const lessonsCompleted = Object.values(userState.lessons).filter(l => l.status === 'completed').length;
    const contentCompletionRate = lessonsStarted > 0 ? lessonsCompleted / lessonsStarted : 0;
    
    // Calculate interaction depth
    const deepInteractions = recentActions.filter(a => 
      ['lesson_completed', 'quiz_completed', 'code_example_run', 'content_shared'].includes(a.actionType)
    ).length;
    const totalInteractions = recentActions.length;
    const interactionDepth = totalInteractions > 0 ? deepInteractions / totalInteractions : 0;
    
    // Calculate social engagement
    const socialActions = recentActions.filter(a => 
      ['content_shared', 'feedback_submitted'].includes(a.actionType)
    ).length;
    const socialEngagement = Math.min(socialActions / 10, 1);
    
    // Calculate overall engagement score (0-100)
    const overallScore = Math.round(
      (dailyActiveStreak / 30) * 20 +
      Math.min(sessionFrequency / 7, 1) * 20 +
      Math.min(averageSessionDuration / 30, 1) * 15 +
      actionDiversity * 15 +
      contentCompletionRate * 20 +
      interactionDepth * 10
    );
    
    return {
      dailyActiveStreak,
      sessionFrequency,
      averageSessionDuration,
      actionDiversity,
      contentCompletionRate,
      interactionDepth,
      socialEngagement,
      overallScore
    };
  }

  private calculateActiveStreak(dailyActions: Record<string, number>): number {
    const sortedDates = Object.keys(dailyActions).sort().reverse();
    let streak = 0;
    
    for (const date of sortedDates) {
      if (dailyActions[date] > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private async identifyLearningPatterns(
    userState: EnhancedProgressState,
    recentActions: ActionMetadata[]
  ): Promise<LearningPattern[]> {
    const patterns: LearningPattern[] = [];
    
    // Pattern 1: Consistent Learner
    if (userState.user.currentStreak >= 7) {
      patterns.push({
        id: 'consistent_learner',
        name: 'Consistent Learner',
        description: 'Maintains regular learning habits',
        indicators: [
          { metric: 'dailyActiveStreak', threshold: 7, operator: 'above' }
        ],
        recommendations: [
          'Consider increasing daily learning goals',
          'Try more challenging content',
          'Share achievements with others'
        ],
        riskLevel: 'low'
      });
    }
    
    // Pattern 2: At Risk of Churn
    const daysSinceLastAction = userState.user.lastActiveAt 
      ? (Date.now() - userState.user.lastActiveAt) / (24 * 60 * 60 * 1000)
      : 0;
    
    if (daysSinceLastAction > 3) {
      patterns.push({
        id: 'churn_risk',
        name: 'At Risk of Churn',
        description: 'Showing signs of decreased engagement',
        indicators: [
          { metric: 'daysSinceLastAction', threshold: 3, operator: 'above' }
        ],
        recommendations: [
          'Send gentle re-engagement notification',
          'Offer easier content to rebuild momentum',
          'Highlight progress made so far'
        ],
        riskLevel: 'high'
      });
    }
    
    return patterns;
  }

  private async generatePredictiveInsights(
    userState: EnhancedProgressState,
    recentActions: ActionMetadata[],
    engagement: EngagementMetrics
  ): Promise<PredictiveInsights> {
    // Calculate churn risk
    let churnRisk = 0;
    const factors: Array<{ factor: string; impact: number; description: string }> = [];
    
    const daysSinceActive = (Date.now() - userState.user.lastActiveAt) / (24 * 60 * 60 * 1000);
    if (daysSinceActive > 7) {
      churnRisk += 0.3;
      factors.push({
        factor: 'inactivity',
        impact: 0.3,
        description: `${Math.round(daysSinceActive)} days since last activity`
      });
    }
    
    if (engagement.overallScore < 30) {
      churnRisk += 0.25;
      factors.push({
        factor: 'low_engagement',
        impact: 0.25,
        description: `Low engagement score (${engagement.overallScore})`
      });
    }
    
    const recommendations = [];
    if (churnRisk > 0.5) {
      recommendations.push('Send re-engagement campaign');
      recommendations.push('Offer simplified content');
    }
    
    // Predict next best action
    const recentActionTypes = recentActions.slice(0, 10).map(a => a.actionType);
    const nextBestAction = !recentActionTypes.includes('lesson_completed') 
      ? {
          action: 'lesson_started' as ActionType,
          entityId: 'recommended_lesson',
          confidence: 0.8,
          expectedOutcome: 'Complete a lesson to build momentum'
        }
      : {
          action: 'quiz_started' as ActionType,
          entityId: 'recommended_quiz',
          confidence: 0.7,
          expectedOutcome: 'Test knowledge and earn bonus XP'
        };
    
    // Determine optimal learning times
    const hourCounts: Record<number, number> = {};
    recentActions.forEach(action => {
      const hour = new Date(action.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const preferredHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
    
    return {
      churnRisk: {
        score: Math.min(churnRisk, 1),
        factors,
        recommendations
      },
      nextBestAction,
      optimalLearningTime: {
        preferredHours: preferredHours.length > 0 ? preferredHours : [9, 14, 20],
        recommendedSessionLength: 20,
        confidence: preferredHours.length > 0 ? 0.8 : 0.3
      }
    };
  }

  async refreshBehaviorAnalysis(): Promise<void> {
    try {
      // This would integrate with the enhanced progress store
      console.log('📊 Refreshing behavior analysis...');
    } catch (error) {
      console.error('Failed to refresh behavior analysis:', error);
    }
  }

  getBehaviorAnalysis(): BehaviorAnalysis | null {
    return this.behaviorAnalysis;
  }

  getAnalyticsStats(): typeof this.analyticsStats {
    return { ...this.analyticsStats };
  }

  async updateConfig(newConfig: Partial<AnalyticsConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    
    try {
      await AsyncStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.config));
      
      if (this.config.enableRealTimeAnalysis) {
        this.startRealTimeAnalysis();
      } else if (this.analysisTimer) {
        clearInterval(this.analysisTimer);
        this.analysisTimer = null;
      }
    } catch (error) {
      console.error('Failed to update analytics config:', error);
    }
  }

  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  private async saveBehaviorAnalysis(): Promise<void> {
    try {
      if (this.behaviorAnalysis) {
        await AsyncStorage.setItem(this.BEHAVIOR_ANALYSIS_KEY, JSON.stringify(this.behaviorAnalysis));
      }
    } catch (error) {
      console.error('Failed to save behavior analysis:', error);
    }
  }

  private updateAnalyticsStats(analysisTime: number): void {
    this.analyticsStats.averageAnalysisTime = 
      (this.analyticsStats.averageAnalysisTime * (this.analyticsStats.totalAnalyses - 1) + analysisTime) /
      this.analyticsStats.totalAnalyses;
  }

  // Cleanup method for app shutdown
  destroy(): void {
    if (this.analysisTimer) {
      clearInterval(this.analysisTimer);
      this.analysisTimer = null;
    }
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();
