import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

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

export class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string = '';
  private userId: string = '';
  private sessionStartTime: number = 0;
  private isInitialized: boolean = false;

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
      
      this.isInitialized = true;
      
      // Track app launch
      await this.track('app_launched', {
        platform: Platform.OS,
        device_type: Platform.OS === 'ios' ? 'phone' : 'phone',
        app_version: Application.nativeApplicationVersion,
      });
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
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();
