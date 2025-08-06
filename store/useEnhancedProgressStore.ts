import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  EnhancedProgressState, 
  EnhancedProgressActions, 
  EnhancedProgressStore,
  ActionMetadata,
  ActionType,
  RewardRule,
  Achievement,
  UserSession,
  LessonProgress,
  createComputedSelectors
} from './enhancedProgressStore';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const calculateLevel = (xp: number): number => Math.floor(xp / 100) + 1;

const getTodayKey = (): string => new Date().toISOString().split('T')[0];

const getWeekKey = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
};

const getMonthKey = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

// ============================================================================
// DEFAULT ACHIEVEMENTS
// ============================================================================

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_action',
    title: 'Getting Started',
    description: 'Performed your first action in the app',
    icon: '🎯',
    category: 'learning',
    rarity: 'common',
    xpReward: 25,
    conditions: { actionCounts: { card_tap: 1 } }
  },
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Completed your first lesson',
    icon: '📚',
    category: 'learning',
    rarity: 'common',
    xpReward: 50,
    conditions: { lessonsCompleted: 1 }
  },
  {
    id: 'streak_3',
    title: 'Consistent Learner',
    description: 'Maintained a 3-day learning streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'uncommon',
    xpReward: 100,
    conditions: { streakDays: 3 }
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintained a 7-day learning streak',
    icon: '⚡',
    category: 'streak',
    rarity: 'rare',
    xpReward: 200,
    conditions: { streakDays: 7 }
  },
  {
    id: 'streak_30',
    title: 'Dedication Master',
    description: 'Maintained a 30-day learning streak',
    icon: '👑',
    category: 'streak',
    rarity: 'legendary',
    xpReward: 1000,
    conditions: { streakDays: 30 }
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Completed 10 quizzes successfully',
    icon: '🧠',
    category: 'mastery',
    rarity: 'rare',
    xpReward: 300,
    conditions: { actionCounts: { quiz_completed: 10 } }
  },
  {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'Bookmarked 25 lessons for later',
    icon: '📖',
    category: 'engagement',
    rarity: 'uncommon',
    xpReward: 150,
    conditions: { actionCounts: { bookmark_added: 25 } }
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Shared content 5 times',
    icon: '🦋',
    category: 'social',
    rarity: 'uncommon',
    xpReward: 200,
    conditions: { actionCounts: { content_shared: 5 } }
  }
];

// ============================================================================
// DEFAULT REWARD RULES
// ============================================================================

const DEFAULT_REWARD_RULES: RewardRule[] = [
  // Card interaction rewards
  {
    id: 'card_swipe_basic',
    name: 'Basic Card Swipe',
    description: '1 XP for each card swipe',
    conditions: {
      actionType: ['card_swipe_up', 'card_swipe_down', 'card_swipe_left', 'card_swipe_right'],
    },
    rewards: { xp: 1 },
    priority: 1
  },
  {
    id: 'card_opened',
    name: 'Card Opened',
    description: '2 XP for opening card details',
    conditions: {
      actionType: 'card_opened',
      timeConstraints: { cooldownMinutes: 1 }
    },
    rewards: { xp: 2 },
    priority: 2
  },
  {
    id: 'quiz_completed',
    name: 'Quiz Completed',
    description: '5 XP for completing a quiz',
    conditions: {
      actionType: 'quiz_completed',
      timeConstraints: { cooldownMinutes: 5 }
    },
    rewards: { xp: 5 },
    priority: 3
  },
  {
    id: 'lesson_completed',
    name: 'Lesson Completed',
    description: '50 XP for completing a lesson',
    conditions: {
      actionType: 'lesson_completed',
      timeConstraints: { cooldownMinutes: 10 }
    },
    rewards: { xp: 50 },
    priority: 5
  },
  // Bonus multipliers
  {
    id: 'streak_bonus',
    name: 'Streak Bonus',
    description: '20% bonus XP for maintaining streaks',
    conditions: {
      actionType: ['quiz_completed', 'lesson_completed'],
    },
    rewards: { bonusMultiplier: 0.2 },
    priority: 10
  },
  {
    id: 'first_daily_bonus',
    name: 'First Daily Action',
    description: '5 bonus XP for first action of the day',
    conditions: {
      actionType: ['card_swipe_up', 'card_swipe_down', 'card_swipe_left', 'card_swipe_right', 'card_opened'],
    },
    rewards: { xp: 5 },
    priority: 8
  }
];

// ============================================================================
// INITIAL STATE
// ============================================================================

const createInitialState = (): EnhancedProgressState => ({
  user: {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    joinedAt: Date.now(),
    lastActiveAt: Date.now()
  },
  
  lessons: {},
  
  actions: {
    recent: [],
    queue: [],
    totalCount: 0
  },
  
  achievements: {
    unlocked: [],
    available: DEFAULT_ACHIEVEMENTS,
    progress: {}
  },
  
  rewards: {
    rules: DEFAULT_REWARD_RULES,
    xpHistory: [],
    dailyXpGoal: 100,
    weeklyXpGoal: 500
  },
  
  sessions: {
    current: null,
    history: []
  },
  
  analytics: {
    totalActions: 0,
    dailyActions: {},
    weeklyActions: {},
    monthlyActions: {},
    actionFrequency: {} as Record<ActionType, number>,
    screenTimeDaily: {},
    engagementScore: 0,
    learningVelocity: 0,
    streakStats: {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0
    },
    preferredLearningTimes: [],
    topCategories: []
  },
  
  settings: {
    notifications: {
      achievements: true,
      dailyReminders: true,
      streakReminders: true,
      weeklyProgress: true
    },
    privacy: {
      collectAnalytics: true,
      shareUsageData: false
    },
    performance: {
      maxStoredActions: 1000,
      syncIntervalMinutes: 60,
      cacheExpiryHours: 24
    }
  },
  
  system: {
    lastSyncAt: 0,
    version: 1,
    migrationVersion: 1,
    offlineActionsCount: 0,
    cacheStatus: 'fresh'
  }
});

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

const persistConfig = {
  name: 'enhanced-progress-store',
  storage: createJSONStorage(() => AsyncStorage),
  version: 1,
  migrate: (persistedState: any, version: number) => {
    console.log('🔄 Migrating Enhanced Progress Store from version:', version);
    
    if (version < 1) {
      // Migration logic for future versions
      return {
        ...createInitialState(),
        ...persistedState
      };
    }
    
    return persistedState;
  },
  // Only persist essential data for performance
  partialize: (state: EnhancedProgressState) => ({
    user: state.user,
    lessons: state.lessons,
    achievements: state.achievements,
    rewards: {
      ...state.rewards,
      // Don't persist rules, they're managed in code
      rules: []
    },
    analytics: {
      ...state.analytics,
      // Only persist aggregated data
      totalActions: state.analytics.totalActions,
      dailyActions: state.analytics.dailyActions,
      weeklyActions: state.analytics.weeklyActions,
      monthlyActions: state.analytics.monthlyActions,
      actionFrequency: state.analytics.actionFrequency,
      streakStats: state.analytics.streakStats
    },
    settings: state.settings,
    system: state.system
  })
};

// ============================================================================
// MAIN STORE IMPLEMENTATION
// ============================================================================

export const useEnhancedProgressStore = create<EnhancedProgressStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          // Initialize state
          ...createInitialState(),
          
          // =====================================================================
          // CORE ACTION TRACKING
          // =====================================================================
          
          trackAction: async (actionData: Omit<ActionMetadata, 'timestamp'>) => {
            const action: ActionMetadata = {
              ...actionData,
              timestamp: Date.now()
            };
            
            set((state) => {
              // Add to recent actions (keep last N actions)
              state.actions.recent.unshift(action);
              if (state.actions.recent.length > state.settings.performance.maxStoredActions) {
                state.actions.recent = state.actions.recent.slice(0, state.settings.performance.maxStoredActions);
              }
              
              // Update counters
              state.actions.totalCount++;
              state.analytics.totalActions++;
              
              // Update daily/weekly/monthly counters
              const today = getTodayKey();
              const week = getWeekKey();
              const month = getMonthKey();
              
              state.analytics.dailyActions[today] = (state.analytics.dailyActions[today] || 0) + 1;
              state.analytics.weeklyActions[week] = (state.analytics.weeklyActions[week] || 0) + 1;
              state.analytics.monthlyActions[month] = (state.analytics.monthlyActions[month] || 0) + 1;
              
              // Update action frequency
              state.analytics.actionFrequency[action.actionType] = 
                (state.analytics.actionFrequency[action.actionType] || 0) + 1;
              
              // Update last active time
              state.user.lastActiveAt = action.timestamp;
              
              // Update current session if exists
              if (state.sessions.current) {
                state.sessions.current.actionsCount++;
                state.sessions.current.endTime = action.timestamp;
              }
            });
            
            // Evaluate rewards for this action
            await get().evaluateRewards(action);
            
            // Check for achievements
            await get().checkAchievements();
            
            // Update analytics
            get().updateAnalytics();
          },
          
          batchTrackActions: async (actionsData: Omit<ActionMetadata, 'timestamp'>[]) => {
            const actions = actionsData.map(actionData => ({
              ...actionData,
              timestamp: Date.now()
            }));
            
            // Process each action
            for (const action of actions) {
              await get().trackAction(action);
            }
          },
          
          // =====================================================================
          // SESSION MANAGEMENT
          // =====================================================================
          
          startSession: () => {
            const sessionId = generateSessionId();
            
            set((state) => {
              // End current session if exists
              if (state.sessions.current) {
                state.sessions.current.endTime = Date.now();
                state.sessions.history.unshift(state.sessions.current);
                
                // Keep only last 30 sessions
                if (state.sessions.history.length > 30) {
                  state.sessions.history = state.sessions.history.slice(0, 30);
                }
              }
              
              // Start new session
              state.sessions.current = {
                sessionId,
                startTime: Date.now(),
                actionsCount: 0,
                xpEarned: 0,
                lessonsViewed: 0,
                screenTime: 0
              };
            });
            
            return sessionId;
          },
          
          endSession: () => {
            set((state) => {
              if (state.sessions.current) {
                state.sessions.current.endTime = Date.now();
                state.sessions.current.screenTime = 
                  state.sessions.current.endTime - state.sessions.current.startTime;
                
                state.sessions.history.unshift(state.sessions.current);
                state.sessions.current = null;
                
                // Keep only last 30 sessions
                if (state.sessions.history.length > 30) {
                  state.sessions.history = state.sessions.history.slice(0, 30);
                }
              }
            });
          },
          
          updateSessionActivity: () => {
            set((state) => {
              if (state.sessions.current) {
                state.sessions.current.endTime = Date.now();
              }
            });
          },
          
          // =====================================================================
          // REWARD SYSTEM
          // =====================================================================
          
          addRewardRule: (rule: RewardRule) => {
            set((state) => {
              state.rewards.rules.push(rule);
              // Sort by priority (higher priority first)
              state.rewards.rules.sort((a, b) => b.priority - a.priority);
            });
          },
          
          removeRewardRule: (ruleId: string) => {
            set((state) => {
              state.rewards.rules = state.rewards.rules.filter(rule => rule.id !== ruleId);
            });
          },
          
          evaluateRewards: async (action: ActionMetadata) => {
            const state = get();
            let totalXp = 0;
            const unlockedAchievements: string[] = [];
            
            // Evaluate each reward rule
            for (const rule of state.rewards.rules) {
              const matches = await evaluateRewardRule(rule, action, state);
              if (matches) {
                if (rule.rewards.xp) {
                  totalXp += rule.rewards.xp;
                }
                if (rule.rewards.achievements) {
                  unlockedAchievements.push(...rule.rewards.achievements);
                }
              }
            }
            
            // Apply streak bonus if applicable
            if (state.user.currentStreak > 3) {
              const streakBonus = Math.floor(totalXp * 0.1 * Math.min(state.user.currentStreak / 10, 1));
              totalXp += streakBonus;
            }
            
            // Award XP
            if (totalXp > 0) {
              get().awardXp(totalXp, `Action: ${action.actionType}`, `action_${action.timestamp}`);
            }
            
            // Unlock achievements
            for (const achievementId of unlockedAchievements) {
              get().unlockAchievement(achievementId);
            }
            
            return { xp: totalXp, achievements: unlockedAchievements };
          },
          
          awardXp: (amount: number, source: string, actionId?: string) => {
            set((state) => {
              state.user.xp += amount;
              state.user.level = calculateLevel(state.user.xp);
              
              // Add to XP history
              state.rewards.xpHistory.unshift({
                timestamp: Date.now(),
                amount,
                source,
                actionId
              });
              
              // Keep only last 1000 XP awards
              if (state.rewards.xpHistory.length > 1000) {
                state.rewards.xpHistory = state.rewards.xpHistory.slice(0, 1000);
              }
              
              // Update current session if exists
              if (state.sessions.current) {
                state.sessions.current.xpEarned += amount;
              }
            });
          },
          
          // =====================================================================
          // ACHIEVEMENT SYSTEM
          // =====================================================================
          
          checkAchievements: async () => {
            const state = get();
            const newlyUnlocked: string[] = [];
            
            for (const achievement of state.achievements.available) {
              if (state.achievements.unlocked.find(a => a.id === achievement.id)) {
                continue; // Already unlocked
              }
              
              const meetsConditions = await evaluateAchievementConditions(achievement, state);
              if (meetsConditions) {
                get().unlockAchievement(achievement.id);
                newlyUnlocked.push(achievement.id);
              }
            }
            
            return newlyUnlocked;
          },
          
          unlockAchievement: (achievementId: string) => {
            set((state) => {
              const achievement = state.achievements.available.find(a => a.id === achievementId);
              if (achievement && !state.achievements.unlocked.find(a => a.id === achievementId)) {
                state.achievements.unlocked.push({
                  ...achievement,
                  unlockedAt: Date.now()
                });
                
                // Award XP for achievement
                state.user.xp += achievement.xpReward;
                state.user.level = calculateLevel(state.user.xp);
                
                // Add to XP history
                state.rewards.xpHistory.unshift({
                  timestamp: Date.now(),
                  amount: achievement.xpReward,
                  source: `Achievement: ${achievement.title}`
                });
              }
            });
          },
          
          updateAchievementProgress: (achievementId: string, progress: number) => {
            set((state) => {
              state.achievements.progress[achievementId] = Math.min(1, Math.max(0, progress));
            });
          },
          
          // =====================================================================
          // LESSON PROGRESS
          // =====================================================================
          
          updateLessonProgress: (lessonId: string, updates: Partial<LessonProgress>) => {
            set((state) => {
              if (!state.lessons[lessonId]) {
                state.lessons[lessonId] = {
                  lessonId,
                  status: 'not_started',
                  timeSpent: 0,
                  interactions: {
                    views: 0,
                    bookmarked: false,
                    liked: false,
                    shared: false
                  },
                  xpEarned: 0,
                  lastInteractionAt: Date.now()
                };
              }
              
              Object.assign(state.lessons[lessonId], updates);
              state.lessons[lessonId].lastInteractionAt = Date.now();
            });
          },
          
          markLessonCompleted: (lessonId: string, timeSpent = 0) => {
            get().updateLessonProgress(lessonId, {
              status: 'completed',
              completedAt: Date.now(),
              timeSpent
            });
            
            // Track completion action
            get().trackAction({
              actionType: 'lesson_completed',
              entityId: lessonId,
              entityType: 'lesson',
              metadata: { timeSpent }
            });
          },
          
          toggleBookmark: (lessonId: string) => {
            const state = get();
            const currentStatus = state.lessons[lessonId]?.interactions.bookmarked || false;
            
            get().updateLessonProgress(lessonId, {
              interactions: {
                ...state.lessons[lessonId]?.interactions,
                bookmarked: !currentStatus,
                views: (state.lessons[lessonId]?.interactions.views || 0) + 1
              }
            });
            
            // Track bookmark action
            get().trackAction({
              actionType: currentStatus ? 'bookmark_removed' : 'bookmark_added',
              entityId: lessonId,
              entityType: 'lesson'
            });
          },
          
          toggleLike: (lessonId: string) => {
            const state = get();
            const currentStatus = state.lessons[lessonId]?.interactions.liked || false;
            
            get().updateLessonProgress(lessonId, {
              interactions: {
                ...state.lessons[lessonId]?.interactions,
                liked: !currentStatus,
                views: (state.lessons[lessonId]?.interactions.views || 0) + 1
              }
            });
            
            // Track like action
            get().trackAction({
              actionType: currentStatus ? 'like_removed' : 'like_added',
              entityId: lessonId,
              entityType: 'lesson'
            });
          },
          
          // =====================================================================
          // ANALYTICS & INSIGHTS
          // =====================================================================
          
          updateAnalytics: () => {
            set((state) => {
              // Calculate engagement score (0-100)
              const daysActive = Object.keys(state.analytics.dailyActions).length;
              const avgActionsPerDay = state.analytics.totalActions / Math.max(daysActive, 1);
              const streakBonus = Math.min(state.user.currentStreak * 5, 25);
              
              state.analytics.engagementScore = Math.min(100, 
                Math.floor(avgActionsPerDay * 5 + streakBonus));
              
              // Calculate learning velocity (lessons per week)
              const completedLessons = Object.values(state.lessons).filter(l => l.status === 'completed');
              const weeksActive = Math.max(
                (Date.now() - state.user.joinedAt) / (7 * 24 * 60 * 60 * 1000), 
                1
              );
              state.analytics.learningVelocity = completedLessons.length / weeksActive;
              
              // Update streak stats
              state.analytics.streakStats = {
                currentStreak: state.user.currentStreak,
                longestStreak: state.user.longestStreak,
                totalActiveDays: Object.keys(state.analytics.dailyActions).length
              };
            });
          },
          
          calculateEngagementScore: () => {
            const state = get();
            const daysActive = Object.keys(state.analytics.dailyActions).length;
            const avgActionsPerDay = state.analytics.totalActions / Math.max(daysActive, 1);
            const streakBonus = Math.min(state.user.currentStreak * 5, 25);
            
            return Math.min(100, Math.floor(avgActionsPerDay * 5 + streakBonus));
          },
          
          getInsights: () => {
            const state = get();
            const completedLessons = Object.values(state.lessons).filter(l => l.status === 'completed').length;
            const todayXp = state.analytics.dailyActions[getTodayKey()] || 0;
            const weeklyXpProgress = (todayXp / state.rewards.weeklyXpGoal) * 100;
            
            return {
              learningStreak: state.user.currentStreak,
              weeklyProgress: weeklyXpProgress,
              recommendedActions: getRecommendedActions(state),
              nextGoal: getNextGoal(state)
            };
          },
          
          // =====================================================================
          // DATA MANAGEMENT
          // =====================================================================
          
          syncData: async () => {
            set((state) => {
              state.system.lastSyncAt = Date.now();
              state.system.cacheStatus = 'fresh';
              
              // Clear offline queue after successful sync
              state.actions.queue = [];
              state.system.offlineActionsCount = 0;
            });
          },
          
          clearOfflineQueue: () => {
            set((state) => {
              state.actions.queue = [];
              state.system.offlineActionsCount = 0;
            });
          },
          
          exportData: async () => {
            const state = get();
            return JSON.stringify(state, null, 2);
          },
          
          importData: async (data: string) => {
            try {
              const importedState = JSON.parse(data) as EnhancedProgressState;
              set(() => importedState);
            } catch (error) {
              throw new Error('Invalid data format');
            }
          },
          
          resetProgress: () => {
            set(() => createInitialState());
          },
          
          // =====================================================================
          // PERFORMANCE & OPTIMIZATION
          // =====================================================================
          
          cleanupOldData: () => {
            set((state) => {
              const cutoffDate = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days
              
              // Clean old daily actions
              for (const date of Object.keys(state.analytics.dailyActions)) {
                if (new Date(date).getTime() < cutoffDate) {
                  delete state.analytics.dailyActions[date];
                }
              }
              
              // Clean old XP history
              state.rewards.xpHistory = state.rewards.xpHistory.filter(
                entry => entry.timestamp > cutoffDate
              );
              
              // Clean old sessions
              state.sessions.history = state.sessions.history.filter(
                session => session.startTime > cutoffDate
              );
            });
          },
          
          refreshCache: () => {
            set((state) => {
              state.system.cacheStatus = 'fresh';
              state.system.lastSyncAt = Date.now();
            });
          },
          
          optimizeStorage: async () => {
            get().cleanupOldData();
            // Additional optimization logic could be added here
          },
          
          // =====================================================================
          // SETTINGS
          // =====================================================================
          
          updateSettings: (settings: Partial<EnhancedProgressState['settings']>) => {
            set((state) => {
              Object.assign(state.settings, settings);
            });
          },
          
          // =====================================================================
          // COMPUTED GETTERS
          // =====================================================================
          
          getters: createComputedSelectors(get())
        })),
        persistConfig
      )
    ),
    { name: 'EnhancedProgressStore' }
  )
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const evaluateRewardRule = async (
  rule: RewardRule, 
  action: ActionMetadata, 
  state: EnhancedProgressState
): Promise<boolean> => {
  // Check action type match
  if (rule.conditions.actionType) {
    const actionTypes = Array.isArray(rule.conditions.actionType) 
      ? rule.conditions.actionType 
      : [rule.conditions.actionType];
    
    if (!actionTypes.includes(action.actionType)) {
      return false;
    }
  }
  
  // Check entity type match
  if (rule.conditions.entityType && action.entityType !== rule.conditions.entityType) {
    return false;
  }
  
  // Check time constraints (cooldowns, etc.)
  if (rule.conditions.timeConstraints) {
    const constraints = rule.conditions.timeConstraints;
    
    // Check cooldown
    if (constraints.cooldownMinutes) {
      const cooldownMs = constraints.cooldownMinutes * 60 * 1000;
      const lastSimilarAction = state.actions.recent.find(
        a => a.actionType === action.actionType && 
             a.entityId === action.entityId &&
             (action.timestamp - a.timestamp) < cooldownMs
      );
      
      if (lastSimilarAction) {
        return false;
      }
    }
    
    // Check valid time range
    if (constraints.validFrom && action.timestamp < constraints.validFrom) {
      return false;
    }
    
    if (constraints.validUntil && action.timestamp > constraints.validUntil) {
      return false;
    }
  }
  
  return true;
};

const evaluateAchievementConditions = async (
  achievement: Achievement,
  state: EnhancedProgressState
): Promise<boolean> => {
  const conditions = achievement.conditions;
  
  // Check action counts
  if (conditions.actionCounts) {
    for (const [actionType, requiredCount] of Object.entries(conditions.actionCounts)) {
      const actualCount = state.analytics.actionFrequency[actionType as ActionType] || 0;
      if (actualCount < requiredCount) {
        return false;
      }
    }
  }
  
  // Check streak days
  if (conditions.streakDays && state.user.currentStreak < conditions.streakDays) {
    return false;
  }
  
  // Check total XP
  if (conditions.totalXp && state.user.xp < conditions.totalXp) {
    return false;
  }
  
  // Check lessons completed
  if (conditions.lessonsCompleted) {
    const completedCount = Object.values(state.lessons).filter(l => l.status === 'completed').length;
    if (completedCount < conditions.lessonsCompleted) {
      return false;
    }
  }
  
  return true;
};

const getRecommendedActions = (state: EnhancedProgressState): string[] => {
  const recommendations: string[] = [];
  
  // Based on recent activity patterns
  const recentActions = state.actions.recent.slice(0, 10);
  const recentActionTypes = recentActions.map(a => a.actionType);
  
  if (!recentActionTypes.includes('quiz_completed')) {
    recommendations.push('Take a quiz to test your knowledge');
  }
  
  if (!recentActionTypes.includes('lesson_completed')) {
    recommendations.push('Complete a lesson to gain more XP');
  }
  
  if (state.user.currentStreak === 0) {
    recommendations.push('Start a learning streak today!');
  }
  
  return recommendations.slice(0, 3); // Return top 3 recommendations
};

const getNextGoal = (state: EnhancedProgressState): string => {
  const todayXp = state.analytics.dailyActions[getTodayKey()] || 0;
  
  if (todayXp < state.rewards.dailyXpGoal) {
    return `Earn ${state.rewards.dailyXpGoal - todayXp} more XP today`;
  }
  
  const nextLevelXp = (state.user.level * 100) - state.user.xp;
  if (nextLevelXp > 0) {
    return `${nextLevelXp} XP to reach level ${state.user.level + 1}`;
  }
  
  return 'Keep up the great learning momentum!';
};

// Export store and helpers
export { createComputedSelectors };
export type { EnhancedProgressStore };