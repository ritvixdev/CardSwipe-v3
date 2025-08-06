import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// COMPREHENSIVE TYPE DEFINITIONS
// ============================================================================

export type ActionType = 
  // Card Interactions
  | 'card_swipe_up' | 'card_swipe_down' | 'card_swipe_left' | 'card_swipe_right'
  | 'card_tap' | 'card_long_press' | 'card_double_tap' | 'card_opened' | 'card_closed'
  // Content Interactions  
  | 'quiz_started' | 'quiz_completed' | 'quiz_failed' | 'quiz_answer_selected'
  | 'code_example_viewed' | 'code_example_copied' | 'code_example_run'
  // Learning Progress
  | 'lesson_started' | 'lesson_completed' | 'lesson_paused' | 'lesson_resumed'
  | 'bookmark_added' | 'bookmark_removed' | 'like_added' | 'like_removed'
  // Navigation & Engagement
  | 'screen_viewed' | 'search_performed' | 'filter_applied' | 'help_accessed'
  // Social & Sharing
  | 'content_shared' | 'feedback_submitted' | 'goal_set' | 'achievement_unlocked'
  // System Events
  | 'app_launched' | 'app_backgrounded' | 'app_foregrounded' | 'offline_action_synced';

export interface ActionMetadata {
  actionType: ActionType;
  timestamp: number;
  entityId: string; // lesson ID, card ID, etc.
  entityType: 'lesson' | 'card' | 'quiz' | 'screen' | 'system';
  context?: {
    screenName?: string;
    previousAction?: ActionType;
    sessionId?: string;
    deviceInfo?: {
      platform: string;
      version: string;
      networkStatus: 'online' | 'offline';
    };
  };
  metadata?: Record<string, any>; // Flexible additional data
}

export interface RewardRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    actionType?: ActionType | ActionType[];
    entityType?: string;
    contextMatchers?: Array<{
      key: string;
      operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
      value: any;
    }>;
    timeConstraints?: {
      cooldownMinutes?: number;
      validFrom?: number;
      validUntil?: number;
    };
  };
  rewards: {
    xp?: number;
    achievements?: string[];
    bonusMultiplier?: number;
    customRewards?: Array<{
      type: string;
      value: any;
    }>;
  };
  priority: number; // Higher priority rules are evaluated first
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'learning' | 'engagement' | 'mastery' | 'social' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  conditions: {
    actionCounts?: Record<ActionType, number>;
    streakDays?: number;
    totalXp?: number;
    lessonsCompleted?: number;
    customConditions?: Array<{
      key: string;
      operation: string;
      value: any;
    }>;
  };
  unlockedAt?: number;
  progress?: number; // 0-1, for progressive achievements
}

export interface UserSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  actionsCount: number;
  xpEarned: number;
  lessonsViewed: number;
  screenTime: number; // milliseconds
  peakEngagementTime?: number;
}

export interface LessonProgress {
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  firstViewedAt?: number;
  completedAt?: number;
  timeSpent: number; // milliseconds
  interactions: {
    views: number;
    bookmarked: boolean;
    liked: boolean;
    shared: boolean;
  };
  quiz?: {
    attempts: number;
    bestScore: number;
    averageScore: number;
    completedAt?: number;
  };
  xpEarned: number;
  lastInteractionAt: number;
}

export interface UserAnalytics {
  totalActions: number;
  dailyActions: Record<string, number>; // YYYY-MM-DD -> count
  weeklyActions: Record<string, number>; // YYYY-WW -> count
  monthlyActions: Record<string, number>; // YYYY-MM -> count
  actionFrequency: Record<ActionType, number>;
  screenTimeDaily: Record<string, number>; // YYYY-MM-DD -> milliseconds
  engagementScore: number; // 0-100
  learningVelocity: number; // lessons per week
  streakStats: {
    currentStreak: number;
    longestStreak: number;
    totalActiveDays: number;
  };
  preferredLearningTimes: number[]; // hour of day (0-23)
  topCategories: Array<{ category: string; timeSpent: number; completion: number }>;
}

// ============================================================================
// MAIN STATE INTERFACE
// ============================================================================

export interface EnhancedProgressState {
  // User Progress
  user: {
    id: string;
    xp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    joinedAt: number;
    lastActiveAt: number;
  };

  // Lessons & Learning
  lessons: Record<string, LessonProgress>;
  
  // Actions & History
  actions: {
    recent: ActionMetadata[]; // Last 1000 actions for quick access
    queue: ActionMetadata[]; // Offline actions waiting to be processed
    totalCount: number;
  };

  // Achievements & Rewards
  achievements: {
    unlocked: Achievement[];
    available: Achievement[];
    progress: Record<string, number>; // achievement_id -> progress (0-1)
  };

  // Reward System
  rewards: {
    rules: RewardRule[];
    xpHistory: Array<{ timestamp: number; amount: number; source: string; actionId?: string }>;
    dailyXpGoal: number;
    weeklyXpGoal: number;
  };

  // Session Management
  sessions: {
    current: UserSession | null;
    history: UserSession[]; // Last 30 sessions
  };

  // Analytics & Insights
  analytics: UserAnalytics;

  // Settings & Preferences
  settings: {
    notifications: {
      achievements: boolean;
      dailyReminders: boolean;
      streakReminders: boolean;
      weeklyProgress: boolean;
    };
    privacy: {
      collectAnalytics: boolean;
      shareUsageData: boolean;
    };
    performance: {
      maxStoredActions: number;
      syncIntervalMinutes: number;
      cacheExpiryHours: number;
    };
  };

  // System State
  system: {
    lastSyncAt: number;
    version: number;
    migrationVersion: number;
    offlineActionsCount: number;
    cacheStatus: 'fresh' | 'stale' | 'invalid';
  };
}

// ============================================================================
// ACTION INTERFACES
// ============================================================================

export interface EnhancedProgressActions {
  // Core Action Tracking
  trackAction: (action: Omit<ActionMetadata, 'timestamp'>) => Promise<void>;
  batchTrackActions: (actions: Omit<ActionMetadata, 'timestamp'>[]) => Promise<void>;
  
  // Session Management
  startSession: () => string; // Returns session ID
  endSession: () => void;
  updateSessionActivity: () => void;

  // Reward System
  addRewardRule: (rule: RewardRule) => void;
  removeRewardRule: (ruleId: string) => void;
  evaluateRewards: (action: ActionMetadata) => Promise<{ xp: number; achievements: string[] }>;
  awardXp: (amount: number, source: string, actionId?: string) => void;

  // Achievement System
  checkAchievements: () => Promise<string[]>; // Returns newly unlocked achievement IDs
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;

  // Lesson Progress
  updateLessonProgress: (lessonId: string, updates: Partial<LessonProgress>) => void;
  markLessonCompleted: (lessonId: string, timeSpent?: number) => void;
  toggleBookmark: (lessonId: string) => void;
  toggleLike: (lessonId: string) => void;

  // Analytics & Insights
  updateAnalytics: () => void;
  calculateEngagementScore: () => number;
  getInsights: () => {
    learningStreak: number;
    weeklyProgress: number;
    recommendedActions: string[];
    nextGoal: string;
  };

  // Data Management
  syncData: () => Promise<void>;
  clearOfflineQueue: () => void;
  exportData: () => Promise<string>; // JSON export
  importData: (data: string) => Promise<void>;
  resetProgress: () => void;

  // Performance & Optimization
  cleanupOldData: () => void;
  refreshCache: () => void;
  optimizeStorage: () => Promise<void>;

  // Settings
  updateSettings: (settings: Partial<EnhancedProgressState['settings']>) => void;
  
  // Selectors (Computed Properties)
  getters: {
    currentLevel: () => number;
    xpToNextLevel: () => number;
    dailyXpProgress: () => { earned: number; goal: number; percentage: number };
    weeklyXpProgress: () => { earned: number; goal: number; percentage: number };
    topActions: () => Array<{ action: ActionType; count: number; percentage: number }>;
    learningStats: () => {
      lessonsCompleted: number;
      averageTimePerLesson: number;
      favoriteCategories: string[];
      completionRate: number;
    };
    recentActivity: () => Array<{
      date: string;
      actions: number;
      xp: number;
      lessonsCompleted: number;
    }>;
  };
}

// ============================================================================
// PERFORMANCE-OPTIMIZED SELECTORS
// ============================================================================

export const createSelectors = <T extends object>(store: T) => {
  const selectors = {} as { [K in keyof T]: () => T[K] };
  
  for (const key in store) {
    selectors[key] = () => store[key];
  }
  
  return selectors;
};

// Memoized computed selectors for performance
export const createComputedSelectors = (store: any) => ({
  // Level calculation with memoization
  currentLevel: () => Math.floor(store.user.xp / 100) + 1,
  
  // XP progress calculations
  xpToNextLevel: () => {
    const currentLevel = Math.floor(store.user.xp / 100) + 1;
    return (currentLevel * 100) - store.user.xp;
  },
  
  // Daily XP progress
  dailyXpProgress: () => {
    const today = new Date().toISOString().split('T')[0];
    const todayXp = store.analytics.dailyActions[today] || 0;
    return {
      earned: todayXp,
      goal: store.rewards.dailyXpGoal,
      percentage: Math.min((todayXp / store.rewards.dailyXpGoal) * 100, 100)
    };
  },
  
  // Learning statistics
  learningStats: () => {
    const lessons = Object.values(store.lessons) as LessonProgress[];
    const completed = lessons.filter(l => l.status === 'completed');
    const totalTime = lessons.reduce((sum, l) => sum + l.timeSpent, 0);
    
    return {
      lessonsCompleted: completed.length,
      averageTimePerLesson: lessons.length > 0 ? totalTime / lessons.length : 0,
      completionRate: lessons.length > 0 ? (completed.length / lessons.length) * 100 : 0,
      totalTimeSpent: totalTime
    };
  }
});

// Export type for the complete store
export type EnhancedProgressStore = EnhancedProgressState & EnhancedProgressActions;