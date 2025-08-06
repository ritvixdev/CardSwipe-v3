import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActionMetadata, ActionType, RewardRule, Achievement, EnhancedProgressState } from '@/store/enhancedProgressStore';

// ============================================================================
// ADVANCED TYPE DEFINITIONS
// ============================================================================

export interface RewardContext {
  user: EnhancedProgressState['user'];
  currentSession: EnhancedProgressState['sessions']['current'];
  recentActions: ActionMetadata[];
  completedLessons: number;
  currentStreak: number;
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6 (Sunday = 0)
  seasonalEvents: SeasonalEvent[];
  userBehaviorProfile: UserBehaviorProfile;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  rewardMultiplier: number;
  applicableActions: ActionType[];
  description: string;
  isActive: boolean;
}

export interface UserBehaviorProfile {
  preferredLearningTimes: number[]; // Hours when user is most active
  averageSessionLength: number; // Minutes
  streakConsistency: number; // 0-1, how consistently they maintain streaks
  engagementLevel: 'low' | 'medium' | 'high' | 'very_high';
  learningVelocity: number; // Lessons per week
  preferredContentTypes: string[];
  riskOfChurn: number; // 0-1, likelihood to stop using the app
}

export interface RewardResult {
  xpAwarded: number;
  achievementsUnlocked: string[];
  bonusMultiplier: number;
  baseReward: number;
  appliedBonuses: Array<{
    type: string;
    multiplier: number;
    description: string;
    value: number;
  }>;
  rulesTrigered: string[];
  specialEvents: string[];
}

export interface ConditionEvaluator {
  type: 'action_count' | 'time_based' | 'streak' | 'user_property' | 'session' | 'achievement' | 'custom';
  evaluate: (context: RewardContext, action: ActionMetadata, rule: RewardRule) => Promise<boolean>;
}

export interface RewardCalculator {
  type: 'fixed' | 'multiplier' | 'progressive' | 'tiered' | 'dynamic';
  calculate: (context: RewardContext, action: ActionMetadata, rule: RewardRule) => Promise<number>;
}

// ============================================================================
// REWARD ENGINE SERVICE
// ============================================================================

class RewardEngineService {
  private static instance: RewardEngineService;
  private conditionEvaluators: Map<string, ConditionEvaluator> = new Map();
  private rewardCalculators: Map<string, RewardCalculator> = new Map();
  private seasonalEvents: SeasonalEvent[] = [];
  private ruleCache: Map<string, { rule: RewardRule; lastEvaluation: number; result: boolean }> = new Map();
  
  // Storage keys
  private readonly SEASONAL_EVENTS_KEY = '@reward_engine_seasonal_events';
  private readonly BEHAVIOR_PROFILE_KEY = '@reward_engine_behavior_profile';
  
  // Performance tracking
  private evaluationStats = {
    totalEvaluations: 0,
    cacheHits: 0,
    averageEvaluationTime: 0,
    failedEvaluations: 0
  };
  
  private constructor() {
    this.initializeEvaluators();
    this.initializeCalculators();
    this.loadSeasonalEvents();
  }
  
  static getInstance(): RewardEngineService {
    if (!RewardEngineService.instance) {
      RewardEngineService.instance = new RewardEngineService();
    }
    return RewardEngineService.instance;
  }
  
  // =====================================================================
  // INITIALIZATION
  // =====================================================================
  
  private initializeEvaluators(): void {
    // Action count evaluator
    this.conditionEvaluators.set('action_count', {
      type: 'action_count',
      evaluate: async (context, action, rule) => {
        const conditions = rule.conditions;
        if (!conditions.contextMatchers) return true;
        
        for (const matcher of conditions.contextMatchers) {
          if (matcher.key === 'total_actions') {
            const totalActions = context.recentActions.length;
            return this.evaluateCondition(totalActions, matcher.operator, matcher.value);
          }
          
          if (matcher.key === 'action_frequency') {
            const actionCount = context.recentActions.filter(a => a.actionType === action.actionType).length;
            return this.evaluateCondition(actionCount, matcher.operator, matcher.value);
          }
        }
        
        return true;
      }
    });
    
    // Time-based evaluator
    this.conditionEvaluators.set('time_based', {
      type: 'time_based',
      evaluate: async (context, action, rule) => {
        const conditions = rule.conditions;
        if (!conditions.timeConstraints) return true;
        
        const now = Date.now();
        const timeConstraints = conditions.timeConstraints;
        
        // Check valid time range
        if (timeConstraints.validFrom && now < timeConstraints.validFrom) return false;
        if (timeConstraints.validUntil && now > timeConstraints.validUntil) return false;
        
        // Check cooldown period
        if (timeConstraints.cooldownMinutes) {
          const cooldownMs = timeConstraints.cooldownMinutes * 60 * 1000;
          const lastSimilarAction = context.recentActions.find(a => 
            a.actionType === action.actionType && 
            a.entityId === action.entityId &&
            (now - a.timestamp) < cooldownMs
          );
          
          if (lastSimilarAction) return false;
        }
        
        return true;
      }
    });
    
    // Streak evaluator
    this.conditionEvaluators.set('streak', {
      type: 'streak',
      evaluate: async (context, action, rule) => {
        const conditions = rule.conditions;
        if (!conditions.contextMatchers) return true;
        
        for (const matcher of conditions.contextMatchers) {
          if (matcher.key === 'current_streak') {
            return this.evaluateCondition(context.currentStreak, matcher.operator, matcher.value);
          }
          
          if (matcher.key === 'streak_milestone') {
            // Special streak milestones: 3, 7, 14, 30, 100 days
            const milestones = [3, 7, 14, 30, 100];
            return milestones.includes(context.currentStreak);
          }
        }
        
        return true;
      }
    });
    
    // User property evaluator
    this.conditionEvaluators.set('user_property', {
      type: 'user_property',
      evaluate: async (context, action, rule) => {
        const conditions = rule.conditions;
        if (!conditions.contextMatchers) return true;
        
        for (const matcher of conditions.contextMatchers) {
          if (matcher.key === 'user_level') {
            return this.evaluateCondition(context.user.level, matcher.operator, matcher.value);
          }
          
          if (matcher.key === 'user_xp') {
            return this.evaluateCondition(context.user.xp, matcher.operator, matcher.value);
          }
          
          if (matcher.key === 'engagement_level') {
            return matcher.value === context.userBehaviorProfile.engagementLevel;
          }
          
          if (matcher.key === 'risk_of_churn') {
            return this.evaluateCondition(context.userBehaviorProfile.riskOfChurn, matcher.operator, matcher.value);
          }
        }
        
        return true;
      }
    });
    
    // Session evaluator
    this.conditionEvaluators.set('session', {
      type: 'session',
      evaluate: async (context, action, rule) => {
        const conditions = rule.conditions;
        if (!conditions.contextMatchers || !context.currentSession) return true;
        
        for (const matcher of conditions.contextMatchers) {
          if (matcher.key === 'session_duration') {
            const sessionDuration = (Date.now() - context.currentSession.startTime) / 1000 / 60; // minutes
            return this.evaluateCondition(sessionDuration, matcher.operator, matcher.value);
          }
          
          if (matcher.key === 'session_actions') {
            return this.evaluateCondition(context.currentSession.actionsCount, matcher.operator, matcher.value);
          }
          
          if (matcher.key === 'first_action_of_session') {
            return context.currentSession.actionsCount === 1;
          }
        }
        
        return true;
      }
    });
    
    // Achievement evaluator
    this.conditionEvaluators.set('achievement', {
      type: 'achievement',
      evaluate: async (context, action, rule) => {
        const conditions = rule.conditions;
        if (!conditions.contextMatchers) return true;
        
        for (const matcher of conditions.contextMatchers) {
          if (matcher.key === 'achievements_unlocked') {
            // This would need access to the user's achievements
            // For now, we'll return true as this requires state integration
            return true;
          }
        }
        
        return true;
      }
    });
  }
  
  private initializeCalculators(): void {
    // Fixed reward calculator
    this.rewardCalculators.set('fixed', {
      type: 'fixed',
      calculate: async (context, action, rule) => {
        return rule.rewards.xp || 0;
      }
    });
    
    // Multiplier calculator
    this.rewardCalculators.set('multiplier', {
      type: 'multiplier',
      calculate: async (context, action, rule) => {
        const baseXp = rule.rewards.xp || 0;
        let multiplier = 1;
        
        // Streak multiplier
        if (context.currentStreak >= 3) {
          multiplier += Math.min(context.currentStreak * 0.1, 2.0); // Max 3x multiplier
        }
        
        // Engagement multiplier
        const engagementMultipliers = {
          low: 0.8,
          medium: 1.0,
          high: 1.2,
          very_high: 1.5
        };
        multiplier *= engagementMultipliers[context.userBehaviorProfile.engagementLevel];
        
        // Time of day multiplier
        const preferredTimes = context.userBehaviorProfile.preferredLearningTimes;
        if (preferredTimes.includes(context.timeOfDay)) {
          multiplier *= 1.2;
        }
        
        // Seasonal event multiplier
        const activeEvents = this.seasonalEvents.filter(event => 
          event.isActive && event.applicableActions.includes(action.actionType)
        );
        
        for (const event of activeEvents) {
          multiplier *= event.rewardMultiplier;
        }
        
        return Math.round(baseXp * multiplier);
      }
    });
    
    // Progressive calculator (increases with user progress)
    this.rewardCalculators.set('progressive', {
      type: 'progressive',
      calculate: async (context, action, rule) => {
        const baseXp = rule.rewards.xp || 0;
        const progressMultiplier = 1 + (context.user.level * 0.05); // 5% increase per level
        return Math.round(baseXp * progressMultiplier);
      }
    });
    
    // Tiered calculator (different rewards for different tiers)
    this.rewardCalculators.set('tiered', {
      type: 'tiered',
      calculate: async (context, action, rule) => {
        const baseXp = rule.rewards.xp || 0;
        
        // Define tiers based on user level
        if (context.user.level >= 50) return baseXp * 2;
        if (context.user.level >= 25) return Math.round(baseXp * 1.5);
        if (context.user.level >= 10) return Math.round(baseXp * 1.2);
        
        return baseXp;
      }
    });
    
    // Dynamic calculator (adapts to user behavior)
    this.rewardCalculators.set('dynamic', {
      type: 'dynamic',
      calculate: async (context, action, rule) => {
        const baseXp = rule.rewards.xp || 0;
        let dynamicMultiplier = 1;
        
        // Boost rewards for users at risk of churning
        if (context.userBehaviorProfile.riskOfChurn > 0.7) {
          dynamicMultiplier *= 1.5;
        }
        
        // Reduce rewards for very high engagement users to avoid over-rewarding
        if (context.userBehaviorProfile.engagementLevel === 'very_high') {
          dynamicMultiplier *= 0.9;
        }
        
        // Boost rewards during off-peak times to encourage consistency
        const isOffPeak = !context.userBehaviorProfile.preferredLearningTimes.includes(context.timeOfDay);
        if (isOffPeak) {
          dynamicMultiplier *= 1.3;
        }
        
        return Math.round(baseXp * dynamicMultiplier);
      }
    });
  }
  
  private async loadSeasonalEvents(): Promise<void> {
    try {
      const eventsData = await AsyncStorage.getItem(this.SEASONAL_EVENTS_KEY);
      if (eventsData) {
        this.seasonalEvents = JSON.parse(eventsData);
        this.updateActiveEvents();
      } else {
        // Initialize with default seasonal events
        this.seasonalEvents = this.createDefaultSeasonalEvents();
        await this.saveSeasonalEvents();
      }
    } catch (error) {
      console.error('Failed to load seasonal events:', error);
      this.seasonalEvents = this.createDefaultSeasonalEvents();
    }
  }
  
  private createDefaultSeasonalEvents(): SeasonalEvent[] {
    const now = new Date();
    const year = now.getFullYear();
    
    return [
      {
        id: 'new_year_boost',
        name: 'New Year Learning Boost',
        startDate: new Date(year, 0, 1).getTime(), // January 1st
        endDate: new Date(year, 0, 31).getTime(), // January 31st
        rewardMultiplier: 1.5,
        applicableActions: ['lesson_completed', 'quiz_completed'],
        description: 'Start the year strong with 50% bonus XP!',
        isActive: false
      },
      {
        id: 'summer_learning',
        name: 'Summer Learning Challenge',
        startDate: new Date(year, 5, 1).getTime(), // June 1st
        endDate: new Date(year, 7, 31).getTime(), // August 31st
        rewardMultiplier: 1.3,
        applicableActions: ['card_swipe_up', 'card_swipe_left', 'card_swipe_right', 'lesson_completed'],
        description: 'Keep learning through summer with bonus rewards!',
        isActive: false
      },
      {
        id: 'back_to_school',
        name: 'Back to School Bonus',
        startDate: new Date(year, 8, 1).getTime(), // September 1st
        endDate: new Date(year, 8, 30).getTime(), // September 30th
        rewardMultiplier: 2.0,
        applicableActions: ['lesson_started', 'lesson_completed', 'quiz_completed'],
        description: 'Double XP for September - back to learning!',
        isActive: false
      },
      {
        id: 'weekend_warrior',
        name: 'Weekend Warrior',
        startDate: 0, // Always active on weekends
        endDate: Number.MAX_SAFE_INTEGER,
        rewardMultiplier: 1.2,
        applicableActions: ['card_swipe_up', 'card_swipe_left', 'card_swipe_right', 'lesson_completed', 'quiz_completed'],
        description: '20% bonus XP on weekends!',
        isActive: false // Will be set dynamically based on day of week
      }
    ];
  }
  
  // =====================================================================
  // CORE REWARD EVALUATION
  // =====================================================================
  
  async evaluateReward(
    action: ActionMetadata,
    rules: RewardRule[],
    context: RewardContext
  ): Promise<RewardResult> {
    const startTime = Date.now();
    this.evaluationStats.totalEvaluations++;
    
    const result: RewardResult = {
      xpAwarded: 0,
      achievementsUnlocked: [],
      bonusMultiplier: 1,
      baseReward: 0,
      appliedBonuses: [],
      rulesTrigered: [],
      specialEvents: []
    };
    
    try {
      // Sort rules by priority (higher priority first)
      const sortedRules = rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
      
      for (const rule of sortedRules) {
        const ruleMatches = await this.evaluateRule(rule, action, context);
        
        if (ruleMatches) {
          result.rulesTrigered.push(rule.id);
          
          // Calculate reward using appropriate calculator
          const calculatorType = this.determineCalculatorType(rule);
          const calculator = this.rewardCalculators.get(calculatorType);
          
          if (calculator) {
            const ruleReward = await calculator.calculate(context, action, rule);
            result.baseReward += ruleReward;
          }
          
          // Apply bonus multiplier if specified
          if (rule.rewards.bonusMultiplier) {
            result.bonusMultiplier *= (1 + rule.rewards.bonusMultiplier);
          }
          
          // Add achievements
          if (rule.rewards.achievements) {
            result.achievementsUnlocked.push(...rule.rewards.achievements);
          }
        }
      }
      
      // Apply seasonal bonuses
      result.specialEvents = await this.applySeasonalBonuses(action, context, result);
      
      // Apply behavior-based bonuses
      await this.applyBehaviorBonuses(context, result);
      
      // Calculate final XP
      result.xpAwarded = Math.round(result.baseReward * result.bonusMultiplier);
      
      // Record evaluation time
      const evaluationTime = Date.now() - startTime;
      this.updateEvaluationStats(evaluationTime);
      
    } catch (error) {
      console.error('❌ Reward evaluation failed:', error);
      this.evaluationStats.failedEvaluations++;
      throw error;
    }
    
    return result;
  }
  
  private async evaluateRule(
    rule: RewardRule,
    action: ActionMetadata,
    context: RewardContext
  ): Promise<boolean> {
    // Check cache first
    const cacheKey = `${rule.id}_${action.actionType}_${action.entityId}`;
    const cached = this.ruleCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.lastEvaluation) < 60000) { // 1 minute cache
      this.evaluationStats.cacheHits++;
      return cached.result;
    }
    
    let matches = true;
    
    // Check action type
    if (rule.conditions.actionType) {
      const actionTypes = Array.isArray(rule.conditions.actionType) 
        ? rule.conditions.actionType 
        : [rule.conditions.actionType];
      
      if (!actionTypes.includes(action.actionType)) {
        matches = false;
      }
    }
    
    // Check entity type
    if (matches && rule.conditions.entityType && action.entityType !== rule.conditions.entityType) {
      matches = false;
    }
    
    // Evaluate custom conditions using registered evaluators
    if (matches) {
      for (const [evaluatorType, evaluator] of this.conditionEvaluators.entries()) {
        const conditionResult = await evaluator.evaluate(context, action, rule);
        if (!conditionResult) {
          matches = false;
          break;
        }
      }
    }
    
    // Cache the result
    this.ruleCache.set(cacheKey, {
      rule,
      lastEvaluation: Date.now(),
      result: matches
    });
    
    return matches;
  }
  
  private determineCalculatorType(rule: RewardRule): string {
    // You could add metadata to rules to specify calculator type
    // For now, we'll use some heuristics
    
    if (rule.rewards.bonusMultiplier) return 'multiplier';
    if (rule.id.includes('progressive')) return 'progressive';
    if (rule.id.includes('tiered')) return 'tiered';
    if (rule.id.includes('dynamic')) return 'dynamic';
    
    return 'fixed';
  }
  
  private async applySeasonalBonuses(
    action: ActionMetadata,
    context: RewardContext,
    result: RewardResult
  ): Promise<string[]> {
    const activeEvents: string[] = [];
    
    for (const event of this.seasonalEvents) {
      if (event.isActive && event.applicableActions.includes(action.actionType)) {
        result.bonusMultiplier *= event.rewardMultiplier;
        result.appliedBonuses.push({
          type: 'seasonal',
          multiplier: event.rewardMultiplier,
          description: event.description,
          value: Math.round((event.rewardMultiplier - 1) * 100)
        });
        activeEvents.push(event.name);
      }
    }
    
    return activeEvents;
  }
  
  private async applyBehaviorBonuses(context: RewardContext, result: RewardResult): Promise<void> {
    // First action of the day bonus
    const today = new Date().toDateString();
    const todayActions = context.recentActions.filter(a => 
      new Date(a.timestamp).toDateString() === today
    );
    
    if (todayActions.length === 0) {
      result.bonusMultiplier *= 1.2;
      result.appliedBonuses.push({
        type: 'daily_first',
        multiplier: 1.2,
        description: 'First action of the day',
        value: 20
      });
    }
    
    // Perfect learning time bonus
    const preferredTimes = context.userBehaviorProfile.preferredLearningTimes;
    if (preferredTimes.includes(context.timeOfDay)) {
      result.bonusMultiplier *= 1.1;
      result.appliedBonuses.push({
        type: 'preferred_time',
        multiplier: 1.1,
        description: 'Learning at your preferred time',
        value: 10
      });
    }
    
    // Consistency bonus for maintaining streaks
    if (context.currentStreak >= 7) {
      const consistencyBonus = 1 + Math.min(context.currentStreak / 100, 0.5); // Max 50% bonus
      result.bonusMultiplier *= consistencyBonus;
      result.appliedBonuses.push({
        type: 'consistency',
        multiplier: consistencyBonus,
        description: `${context.currentStreak}-day streak bonus`,
        value: Math.round((consistencyBonus - 1) * 100)
      });
    }
  }
  
  // =====================================================================
  // HELPER METHODS
  // =====================================================================
  
  private evaluateCondition(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'equals':
        return actual === expected;
      case 'contains':
        return Array.isArray(actual) ? actual.includes(expected) : String(actual).includes(String(expected));
      case 'greaterThan':
        return actual > expected;
      case 'lessThan':
        return actual < expected;
      case 'greaterThanOrEqual':
        return actual >= expected;
      case 'lessThanOrEqual':
        return actual <= expected;
      default:
        return true;
    }
  }
  
  private updateActiveEvents(): void {
    const now = Date.now();
    const dayOfWeek = new Date().getDay();
    
    for (const event of this.seasonalEvents) {
      // Check if event is in valid time range
      const inTimeRange = now >= event.startDate && now <= event.endDate;
      
      // Special case for weekend warrior
      if (event.id === 'weekend_warrior') {
        event.isActive = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      } else {
        event.isActive = inTimeRange;
      }
    }
  }
  
  private updateEvaluationStats(evaluationTime: number): void {
    this.evaluationStats.averageEvaluationTime = 
      (this.evaluationStats.averageEvaluationTime * (this.evaluationStats.totalEvaluations - 1) + evaluationTime) /
      this.evaluationStats.totalEvaluations;
  }
  
  // =====================================================================
  // PUBLIC API METHODS
  // =====================================================================
  
  async addSeasonalEvent(event: Omit<SeasonalEvent, 'isActive'>): Promise<void> {
    const newEvent: SeasonalEvent = {
      ...event,
      isActive: false
    };
    
    this.seasonalEvents.push(newEvent);
    this.updateActiveEvents();
    await this.saveSeasonalEvents();
  }
  
  async removeSeasonalEvent(eventId: string): Promise<void> {
    this.seasonalEvents = this.seasonalEvents.filter(event => event.id !== eventId);
    await this.saveSeasonalEvents();
  }
  
  getActiveEvents(): SeasonalEvent[] {
    return this.seasonalEvents.filter(event => event.isActive);
  }
  
  getAllEvents(): SeasonalEvent[] {
    return [...this.seasonalEvents];
  }
  
  addCustomEvaluator(evaluator: ConditionEvaluator): void {
    this.conditionEvaluators.set(evaluator.type, evaluator);
  }
  
  addCustomCalculator(calculator: RewardCalculator): void {
    this.rewardCalculators.set(calculator.type, calculator);
  }
  
  clearCache(): void {
    this.ruleCache.clear();
  }
  
  getEvaluationStats(): typeof this.evaluationStats {
    return { ...this.evaluationStats };
  }
  
  async buildRewardContext(
    userState: EnhancedProgressState['user'],
    currentSession: EnhancedProgressState['sessions']['current'],
    recentActions: ActionMetadata[],
    completedLessons: number,
    userBehaviorProfile?: UserBehaviorProfile
  ): Promise<RewardContext> {
    const now = new Date();
    
    const defaultProfile: UserBehaviorProfile = userBehaviorProfile || {
      preferredLearningTimes: [9, 14, 20], // 9am, 2pm, 8pm
      averageSessionLength: 15,
      streakConsistency: 0.7,
      engagementLevel: 'medium',
      learningVelocity: 3,
      preferredContentTypes: ['interactive'],
      riskOfChurn: 0.3
    };
    
    return {
      user: userState,
      currentSession,
      recentActions,
      completedLessons,
      currentStreak: userState.currentStreak,
      timeOfDay: now.getHours(),
      dayOfWeek: now.getDay(),
      seasonalEvents: this.getActiveEvents(),
      userBehaviorProfile: defaultProfile
    };
  }
  
  // =====================================================================
  // PERSISTENCE
  // =====================================================================
  
  private async saveSeasonalEvents(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SEASONAL_EVENTS_KEY, JSON.stringify(this.seasonalEvents));
    } catch (error) {
      console.error('Failed to save seasonal events:', error);
    }
  }
  
  async reset(): Promise<void> {
    this.seasonalEvents = this.createDefaultSeasonalEvents();
    this.ruleCache.clear();
    this.evaluationStats = {
      totalEvaluations: 0,
      cacheHits: 0,
      averageEvaluationTime: 0,
      failedEvaluations: 0
    };
    
    await AsyncStorage.multiRemove([
      this.SEASONAL_EVENTS_KEY,
      this.BEHAVIOR_PROFILE_KEY
    ]);
    
    console.log('🧹 RewardEngine reset complete');
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const rewardEngine = RewardEngineService.getInstance();

// Export utility functions
export const createRewardRule = (
  id: string,
  name: string,
  description: string,
  conditions: RewardRule['conditions'],
  rewards: RewardRule['rewards'],
  priority = 1
): RewardRule => ({
  id,
  name,
  description,
  conditions,
  rewards,
  priority
});

export const createSeasonalEvent = (
  id: string,
  name: string,
  startDate: Date,
  endDate: Date,
  rewardMultiplier: number,
  applicableActions: ActionType[],
  description: string
): Omit<SeasonalEvent, 'isActive'> => ({
  id,
  name,
  startDate: startDate.getTime(),
  endDate: endDate.getTime(),
  rewardMultiplier,
  applicableActions,
  description
});

export default rewardEngine;