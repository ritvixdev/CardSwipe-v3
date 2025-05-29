import { analyticsService } from './AnalyticsService';
import { notificationService } from './NotificationService';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'xp' | 'completion' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  condition: (stats: UserStats) => boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserStats {
  totalXP: number;
  currentStreak: number;
  maxStreak: number;
  completedLessons: number;
  totalLessons: number;
  quizzesCompleted: number;
  correctAnswers: number;
  totalAnswers: number;
  daysActive: number;
  bookmarkedLessons: number;
  averageSessionTime: number;
  totalStudyTime: number;
  perfectDays: number; // Days with 100% quiz accuracy
  weekendLearner: boolean;
  nightOwl: boolean; // Studies after 10 PM
  earlyBird: boolean; // Studies before 8 AM
  speedLearner: boolean; // Completes lessons quickly
  thoroughLearner: boolean; // Spends time on each lesson
}

const achievements: Achievement[] = [
  // Learning Achievements
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first JavaScript lesson',
    icon: '🎯',
    category: 'learning',
    rarity: 'common',
    xpReward: 25,
    condition: (stats) => stats.completedLessons >= 1,
  },
  {
    id: 'week_one',
    title: 'Week One Warrior',
    description: 'Complete your first week of learning',
    icon: '📅',
    category: 'learning',
    rarity: 'common',
    xpReward: 100,
    condition: (stats) => stats.completedLessons >= 7,
  },
  {
    id: 'halfway_hero',
    title: 'Halfway Hero',
    description: 'Complete 15 lessons - you\'re halfway there!',
    icon: '🏃‍♂️',
    category: 'learning',
    rarity: 'rare',
    xpReward: 200,
    condition: (stats) => stats.completedLessons >= 15,
  },
  {
    id: 'javascript_master',
    title: 'JavaScript Master',
    description: 'Complete all 30 JavaScript lessons',
    icon: '👑',
    category: 'completion',
    rarity: 'legendary',
    xpReward: 500,
    condition: (stats) => stats.completedLessons >= 30,
  },

  // Streak Achievements
  {
    id: 'streak_3',
    title: 'Getting Started',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    xpReward: 50,
    condition: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '⚡',
    category: 'streak',
    rarity: 'rare',
    xpReward: 150,
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'streak_30',
    title: 'Unstoppable Force',
    description: 'Maintain a 30-day learning streak',
    icon: '🚀',
    category: 'streak',
    rarity: 'legendary',
    xpReward: 1000,
    condition: (stats) => stats.currentStreak >= 30,
  },

  // XP Achievements
  {
    id: 'xp_500',
    title: 'Rising Star',
    description: 'Earn 500 experience points',
    icon: '⭐',
    category: 'xp',
    rarity: 'common',
    xpReward: 50,
    condition: (stats) => stats.totalXP >= 500,
  },
  {
    id: 'xp_2000',
    title: 'Knowledge Seeker',
    description: 'Earn 2,000 experience points',
    icon: '🌟',
    category: 'xp',
    rarity: 'rare',
    xpReward: 200,
    condition: (stats) => stats.totalXP >= 2000,
  },
  {
    id: 'xp_5000',
    title: 'XP Legend',
    description: 'Earn 5,000 experience points',
    icon: '💫',
    category: 'xp',
    rarity: 'epic',
    xpReward: 500,
    condition: (stats) => stats.totalXP >= 5000,
  },

  // Special Achievements
  {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Get 100% quiz accuracy for 7 days straight',
    icon: '💯',
    category: 'special',
    rarity: 'epic',
    xpReward: 300,
    condition: (stats) => stats.perfectDays >= 7,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete 10 lessons after 10 PM',
    icon: '🦉',
    category: 'special',
    rarity: 'rare',
    xpReward: 150,
    condition: (stats) => stats.nightOwl,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete 10 lessons before 8 AM',
    icon: '🐦',
    category: 'special',
    rarity: 'rare',
    xpReward: 150,
    condition: (stats) => stats.earlyBird,
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Learn on weekends for 4 weeks straight',
    icon: '⚔️',
    category: 'special',
    rarity: 'epic',
    xpReward: 250,
    condition: (stats) => stats.weekendLearner,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete 20 lessons in under 5 minutes each',
    icon: '💨',
    category: 'special',
    rarity: 'rare',
    xpReward: 200,
    condition: (stats) => stats.speedLearner,
  },
  {
    id: 'thorough_scholar',
    title: 'Thorough Scholar',
    description: 'Spend over 15 minutes on 20 lessons',
    icon: '📚',
    category: 'special',
    rarity: 'rare',
    xpReward: 200,
    condition: (stats) => stats.thoroughLearner,
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Answer 100 quiz questions correctly',
    icon: '🧠',
    category: 'learning',
    rarity: 'epic',
    xpReward: 300,
    condition: (stats) => stats.correctAnswers >= 100,
  },
  {
    id: 'bookmark_collector',
    title: 'Bookmark Collector',
    description: 'Bookmark 15 lessons for future reference',
    icon: '🔖',
    category: 'learning',
    rarity: 'common',
    xpReward: 75,
    condition: (stats) => stats.bookmarkedLessons >= 15,
  },
];

export class AchievementService {
  private static instance: AchievementService;
  private unlockedAchievements: Set<string> = new Set();

  static getInstance(): AchievementService {
    if (!AchievementService.instance) {
      AchievementService.instance = new AchievementService();
    }
    return AchievementService.instance;
  }

  async initialize(): Promise<void> {
    try {
      const unlocked = await analyticsService.getUserProperty('unlocked_achievements', []);
      this.unlockedAchievements = new Set(unlocked);
    } catch (error) {
      console.error('Failed to initialize achievements:', error);
    }
  }

  async checkAchievements(stats: UserStats): Promise<Achievement[]> {
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of achievements) {
      if (!this.unlockedAchievements.has(achievement.id) && achievement.condition(stats)) {
        await this.unlockAchievement(achievement, stats);
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  private async unlockAchievement(achievement: Achievement, stats: UserStats): Promise<void> {
    try {
      // Mark as unlocked
      this.unlockedAchievements.add(achievement.id);
      achievement.unlockedAt = new Date().toISOString();

      // Save to storage
      const unlockedArray = Array.from(this.unlockedAchievements);
      await analyticsService.setUserProperty('unlocked_achievements', unlockedArray);

      // Award XP
      const currentXP = await analyticsService.getUserProperty('totalXP', 0);
      await analyticsService.setUserProperty('totalXP', currentXP + achievement.xpReward);

      // Track achievement unlock
      await analyticsService.track('achievement_unlocked', {
        achievement_id: achievement.id,
        achievement_title: achievement.title,
        achievement_category: achievement.category,
        achievement_rarity: achievement.rarity,
        xp_reward: achievement.xpReward,
        total_achievements: this.unlockedAchievements.size,
      });

      // Show notification
      await notificationService.showAchievementNotification(
        achievement.title,
        `${achievement.description} (+${achievement.xpReward} XP)`
      );

      console.log(`🏆 Achievement unlocked: ${achievement.title}`);
    } catch (error) {
      console.error('Failed to unlock achievement:', error);
    }
  }

  getUnlockedAchievements(): Achievement[] {
    return achievements.filter(achievement => 
      this.unlockedAchievements.has(achievement.id)
    ).map(achievement => ({
      ...achievement,
      unlockedAt: achievement.unlockedAt || new Date().toISOString(),
    }));
  }

  getLockedAchievements(): Achievement[] {
    return achievements.filter(achievement => 
      !this.unlockedAchievements.has(achievement.id)
    );
  }

  getAllAchievements(): Achievement[] {
    return achievements.map(achievement => ({
      ...achievement,
      unlockedAt: this.unlockedAchievements.has(achievement.id) 
        ? achievement.unlockedAt || new Date().toISOString()
        : undefined,
    }));
  }

  getAchievementProgress(stats: UserStats): Achievement[] {
    return achievements.map(achievement => {
      const isUnlocked = this.unlockedAchievements.has(achievement.id);
      let progress = 0;
      let maxProgress = 1;

      if (!isUnlocked) {
        // Calculate progress for specific achievements
        switch (achievement.id) {
          case 'first_lesson':
            progress = Math.min(stats.completedLessons, 1);
            maxProgress = 1;
            break;
          case 'week_one':
            progress = Math.min(stats.completedLessons, 7);
            maxProgress = 7;
            break;
          case 'halfway_hero':
            progress = Math.min(stats.completedLessons, 15);
            maxProgress = 15;
            break;
          case 'javascript_master':
            progress = Math.min(stats.completedLessons, 30);
            maxProgress = 30;
            break;
          case 'streak_3':
            progress = Math.min(stats.currentStreak, 3);
            maxProgress = 3;
            break;
          case 'streak_7':
            progress = Math.min(stats.currentStreak, 7);
            maxProgress = 7;
            break;
          case 'streak_30':
            progress = Math.min(stats.currentStreak, 30);
            maxProgress = 30;
            break;
          case 'xp_500':
            progress = Math.min(stats.totalXP, 500);
            maxProgress = 500;
            break;
          case 'xp_2000':
            progress = Math.min(stats.totalXP, 2000);
            maxProgress = 2000;
            break;
          case 'xp_5000':
            progress = Math.min(stats.totalXP, 5000);
            maxProgress = 5000;
            break;
          case 'quiz_master':
            progress = Math.min(stats.correctAnswers, 100);
            maxProgress = 100;
            break;
          case 'bookmark_collector':
            progress = Math.min(stats.bookmarkedLessons, 15);
            maxProgress = 15;
            break;
          default:
            progress = achievement.condition(stats) ? 1 : 0;
            maxProgress = 1;
        }
      } else {
        progress = maxProgress;
      }

      return {
        ...achievement,
        progress,
        maxProgress,
        unlockedAt: isUnlocked ? achievement.unlockedAt : undefined,
      };
    });
  }

  getAchievementStats(): {
    total: number;
    unlocked: number;
    locked: number;
    completionRate: number;
    totalXPFromAchievements: number;
  } {
    const total = achievements.length;
    const unlocked = this.unlockedAchievements.size;
    const locked = total - unlocked;
    const completionRate = (unlocked / total) * 100;
    
    const totalXPFromAchievements = achievements
      .filter(achievement => this.unlockedAchievements.has(achievement.id))
      .reduce((sum, achievement) => sum + achievement.xpReward, 0);

    return {
      total,
      unlocked,
      locked,
      completionRate,
      totalXPFromAchievements,
    };
  }

  async resetAchievements(): Promise<void> {
    try {
      this.unlockedAchievements.clear();
      await analyticsService.setUserProperty('unlocked_achievements', []);
      await analyticsService.track('achievements_reset');
    } catch (error) {
      console.error('Failed to reset achievements:', error);
    }
  }
}

// Export singleton instance
export const achievementService = AchievementService.getInstance();
