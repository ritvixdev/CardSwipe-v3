// Comprehensive Reward System for Learning App
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LearnCard } from '@/data/processors/dataLoader';

export interface ActionReward {
  action: string;
  baseXp: number;
  description: string;
  multipliers?: {
    streak?: number;
    difficulty?: number;
    timeBonus?: number;
  };
}

export interface CardAction {
  cardId: string;
  action: 'swipe_up' | 'swipe_left' | 'swipe_right' | 'card_opened' | 'quiz_completed';
  timestamp: number;
  xpEarned: number;
  bonuses?: string[];
}

export interface CardProgress {
  cardId: string;
  actionsCompleted: Set<string>;
  totalXpEarned: number;
  firstInteraction: number;
  lastInteraction: number;
  streakCount: number;
}

class RewardSystemService {
  private static instance: RewardSystemService;
  private cardProgressKey = '@reward_system_card_progress';
  private dailyStatsKey = '@reward_system_daily_stats';
  
  // XP Reward Configuration - Simple 1 XP for swipes, higher for other actions
  private readonly actionRewards: Record<string, ActionReward> = {
    swipe_up: {
      action: 'swipe_up',
      baseXp: 1,
      description: 'Swiped to next card'
      // No multipliers - exactly 1 XP always
    },
    swipe_left: {
      action: 'swipe_left',
      baseXp: 1,
      description: 'Bookmarked the card'
      // No multipliers - exactly 1 XP always
    },
    swipe_right: {
      action: 'swipe_right',
      baseXp: 1,
      description: 'Liked the card'
      // No multipliers - exactly 1 XP always
    },
    card_opened: {
      action: 'card_opened',
      baseXp: 2,
      description: 'Opened card for detailed view',
      multipliers: { difficulty: 1.3, timeBonus: 1.5 }
    },
    quiz_completed: {
      action: 'quiz_completed',
      baseXp: 5,
      description: 'Completed card quiz',
      multipliers: { difficulty: 2.0, streak: 1.5, timeBonus: 1.2 }
    }
  };

  private cardProgressCache: Map<string, CardProgress> = new Map();
  private dailyStreak = 0;
  private isInitialized = false;

  static getInstance(): RewardSystemService {
    if (!RewardSystemService.instance) {
      RewardSystemService.instance = new RewardSystemService();
    }
    return RewardSystemService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load card progress from storage
      const savedProgress = await AsyncStorage.getItem(this.cardProgressKey);
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        for (const [cardId, progress] of Object.entries(progressData)) {
          this.cardProgressCache.set(cardId, {
            ...(progress as any),
            actionsCompleted: new Set((progress as any).actionsCompleted || [])
          });
        }
      }

      // Load daily stats
      await this.loadDailyStats();
      
      this.isInitialized = true;
      console.log('🎯 Reward System initialized');
    } catch (error) {
      console.error('Failed to initialize reward system:', error);
    }
  }

  // Award XP for card interaction
  async awardXP(
    cardId: string, 
    action: keyof typeof this.actionRewards, 
    lesson: LearnCard,
    onXPAwarded?: (xp: number, action: string, bonuses: string[]) => void
  ): Promise<number> {
    await this.initialize();

    // Check if user already earned XP for this action on this card
    const cardProgress = this.getCardProgress(cardId);
    const actionKey = `${action}_${cardId}`;
    
    if (cardProgress.actionsCompleted.has(actionKey)) {
      console.log(`⚠️ XP already awarded for ${action} on card ${cardId}`);
      return 0; // No XP if already completed this action
    }

    // Calculate XP with bonuses
    const reward = this.actionRewards[action];
    const { xpEarned, bonuses } = this.calculateXPWithBonuses(reward, lesson, cardProgress);

    // Mark action as completed
    cardProgress.actionsCompleted.add(actionKey);
    cardProgress.totalXpEarned += xpEarned;
    cardProgress.lastInteraction = Date.now();
    
    if (cardProgress.firstInteraction === 0) {
      cardProgress.firstInteraction = Date.now();
    }

    // Update daily streak
    this.updateDailyStreak();

    // Save progress
    await this.saveCardProgress();
    
    // Log the action
    const actionLog: CardAction = {
      cardId,
      action,
      timestamp: Date.now(),
      xpEarned,
      bonuses
    };
    
    console.log(`🎉 Awarded ${xpEarned} XP for ${action} on ${lesson.title}`);
    console.log(`📊 Bonuses applied: ${bonuses.join(', ') || 'None'}`);

    // Notify callback
    if (onXPAwarded) {
      onXPAwarded(xpEarned, reward.description, bonuses);
    }

    return xpEarned;
  }

  private calculateXPWithBonuses(
    reward: ActionReward, 
    lesson: LearnCard, 
    cardProgress: CardProgress
  ): { xpEarned: number; bonuses: string[] } {
    let xpEarned = reward.baseXp;
    const bonuses: string[] = [];

    // Only apply multipliers if they exist for this action
    if (!reward.multipliers) {
      // Simple actions (swipes) get no bonuses - exactly base XP
      return { xpEarned, bonuses };
    }

    // Difficulty multiplier
    if (reward.multipliers.difficulty) {
      const difficultyMultipliers = {
        'beginner': 1.0,
        'intermediate': 1.2,
        'advanced': 1.5
      };
      
      const difficultyBonus = difficultyMultipliers[lesson.difficulty];
      const multiplier = difficultyBonus * reward.multipliers.difficulty;
      if (multiplier > 1) {
        xpEarned = Math.round(xpEarned * multiplier);
        bonuses.push(`${lesson.difficulty} difficulty (+${Math.round((multiplier - 1) * 100)}%)`);
      }
    }

    // Streak multiplier
    if (reward.multipliers.streak && this.dailyStreak >= 3) {
      const streakMultiplier = 1 + (Math.min(this.dailyStreak, 10) * 0.1);
      xpEarned = Math.round(xpEarned * streakMultiplier);
      bonuses.push(`${this.dailyStreak}-day streak (+${Math.round((streakMultiplier - 1) * 100)}%)`);
    }

    // Time-based bonuses
    if (reward.multipliers.timeBonus) {
      const hour = new Date().getHours();
      let timeMultiplier = 1;
      
      // Early bird bonus (6-9 AM)
      if (hour >= 6 && hour <= 9) {
        timeMultiplier = 1.2;
        bonuses.push('Early bird bonus (+20%)');
      }
      // Late night bonus (10 PM - 1 AM)  
      else if (hour >= 22 || hour <= 1) {
        timeMultiplier = 1.15;
        bonuses.push('Night owl bonus (+15%)');
      }
      
      if (timeMultiplier > 1) {
        xpEarned = Math.round(xpEarned * timeMultiplier);
      }
    }

    // Perfect day bonus only for higher-value actions
    if (reward.baseXp >= 2) {
      const todayInteractions = this.getTodayInteractionCount();
      if (todayInteractions >= 5 && todayInteractions % 5 === 0) {
        xpEarned += 2;
        bonuses.push('Perfect day bonus (+2 XP)');
      }
    }

    // First interaction bonus only for higher-value actions
    if (reward.baseXp >= 2 && cardProgress.firstInteraction === 0) {
      xpEarned += 1;
      bonuses.push('First interaction (+1 XP)');
    }

    return { xpEarned, bonuses };
  }

  private getCardProgress(cardId: string): CardProgress {
    if (!this.cardProgressCache.has(cardId)) {
      this.cardProgressCache.set(cardId, {
        cardId,
        actionsCompleted: new Set(),
        totalXpEarned: 0,
        firstInteraction: 0,
        lastInteraction: 0,
        streakCount: 0
      });
    }
    return this.cardProgressCache.get(cardId)!;
  }

  private async saveCardProgress(): Promise<void> {
    try {
      const progressData: Record<string, any> = {};
      
      for (const [cardId, progress] of this.cardProgressCache.entries()) {
        progressData[cardId] = {
          ...progress,
          actionsCompleted: Array.from(progress.actionsCompleted)
        };
      }
      
      await AsyncStorage.setItem(this.cardProgressKey, JSON.stringify(progressData));
    } catch (error) {
      console.error('Failed to save card progress:', error);
    }
  }

  private async loadDailyStats(): Promise<void> {
    try {
      const todayKey = new Date().toDateString();
      const dailyStats = await AsyncStorage.getItem(`${this.dailyStatsKey}_${todayKey}`);
      
      if (dailyStats) {
        const stats = JSON.parse(dailyStats);
        this.dailyStreak = stats.streak || 0;
      } else {
        this.dailyStreak = 0;
      }
    } catch (error) {
      console.error('Failed to load daily stats:', error);
    }
  }

  private updateDailyStreak(): void {
    this.dailyStreak += 1;
    
    // Save updated streak
    const todayKey = new Date().toDateString();
    AsyncStorage.setItem(`${this.dailyStatsKey}_${todayKey}`, JSON.stringify({
      streak: this.dailyStreak,
      lastUpdate: Date.now()
    }));
  }

  private getTodayInteractionCount(): number {
    const today = new Date().toDateString();
    let count = 0;
    
    for (const progress of this.cardProgressCache.values()) {
      if (progress.lastInteraction > 0) {
        const interactionDate = new Date(progress.lastInteraction).toDateString();
        if (interactionDate === today) {
          count++;
        }
      }
    }
    
    return count;
  }

  // Get available actions for a card (actions that haven't been completed)
  getAvailableActions(cardId: string): string[] {
    const cardProgress = this.getCardProgress(cardId);
    const availableActions: string[] = [];
    
    for (const action of Object.keys(this.actionRewards)) {
      const actionKey = `${action}_${cardId}`;
      if (!cardProgress.actionsCompleted.has(actionKey)) {
        availableActions.push(action);
      }
    }
    
    return availableActions;
  }

  // Get total XP earned from cards
  getTotalCardXP(): number {
    let total = 0;
    for (const progress of this.cardProgressCache.values()) {
      total += progress.totalXpEarned;
    }
    return total;
  }

  // Get card completion status
  getCardCompletionStatus(cardId: string): {
    completedActions: number;
    totalActions: number;
    totalXpEarned: number;
    isFullyCompleted: boolean;
  } {
    const cardProgress = this.getCardProgress(cardId);
    const totalActions = Object.keys(this.actionRewards).length;
    const completedActions = cardProgress.actionsCompleted.size;
    
    return {
      completedActions,
      totalActions,
      totalXpEarned: cardProgress.totalXpEarned,
      isFullyCompleted: completedActions === totalActions
    };
  }

  // Get stats for analytics/progress screen
  getRewardStats(): {
    totalCardsInteracted: number;
    totalXpFromCards: number;
    averageXpPerCard: number;
    dailyStreak: number;
    todayInteractions: number;
    topActions: Array<{ action: string; count: number }>;
  } {
    const totalCardsInteracted = this.cardProgressCache.size;
    const totalXpFromCards = this.getTotalCardXP();
    const averageXpPerCard = totalCardsInteracted > 0 ? totalXpFromCards / totalCardsInteracted : 0;
    const todayInteractions = this.getTodayInteractionCount();
    
    // Count action frequency
    const actionCounts: Record<string, number> = {};
    for (const progress of this.cardProgressCache.values()) {
      for (const actionKey of progress.actionsCompleted) {
        const action = actionKey.split('_')[0];
        actionCounts[action] = (actionCounts[action] || 0) + 1;
      }
    }
    
    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalCardsInteracted,
      totalXpFromCards,
      averageXpPerCard: Math.round(averageXpPerCard * 100) / 100,
      dailyStreak: this.dailyStreak,
      todayInteractions,
      topActions
    };
  }

  // Clear all reward data (for testing or reset)
  async clearAllData(): Promise<void> {
    try {
      this.cardProgressCache.clear();
      this.dailyStreak = 0;
      await AsyncStorage.multiRemove([this.cardProgressKey]);
      console.log('🧹 Reward system data cleared');
    } catch (error) {
      console.error('Failed to clear reward data:', error);
    }
  }
}

// Export singleton instance
export const rewardSystem = RewardSystemService.getInstance();