import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LessonProgress {
  completed: boolean;
  bookmarked: boolean;
  lastViewed?: string;
  completedAt?: string;
  timeSpent?: number; // in seconds
  score?: number; // quiz score if applicable
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  xpReward: number;
  category: 'streak' | 'lessons' | 'quiz' | 'special';
}

interface WeeklyGoal {
  lessonsTarget: number;
  xpTarget: number;
  currentLessons: number;
  currentXp: number;
  weekStart: string;
}

interface ProgressState {
  progress: Record<string, LessonProgress>;
  currentDay: number;
  currentLessonId: string;
  streak: number;
  maxStreak: number;
  lastCompletedDate: string | null;
  xp: number;
  level: number;
  achievements: Achievement[];
  weeklyGoal: WeeklyGoal;
  totalTimeSpent: number; // in seconds
  quizzesTaken: number;
  averageQuizScore: number;
  lastActiveDate: string | null;

  // Actions
  markAsCompleted: (lessonId: string, timeSpent?: number) => void;
  toggleBookmark: (lessonId: string) => void;
  incrementDay: () => void;
  decrementDay: () => void;
  resetProgress: () => void;
  updateStreak: () => void;
  addXp: (amount: number) => void;
  addQuizScore: (score: number) => void;
  checkAchievements: () => void;
  updateWeeklyGoal: () => void;
  getLevel: () => number;
  getXpForNextLevel: () => number;
  updateLastActive: () => void;
}

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_lesson', title: 'Getting Started', description: 'Complete your first lesson', icon: '🎯', xpReward: 25, category: 'lessons' as const },
  { id: 'streak_3', title: 'Consistent Learner', description: 'Maintain a 3-day streak', icon: '🔥', xpReward: 50, category: 'streak' as const },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡', xpReward: 100, category: 'streak' as const },
  { id: 'streak_30', title: 'Dedication Master', description: 'Maintain a 30-day streak', icon: '👑', xpReward: 500, category: 'streak' as const },
  { id: 'lessons_5', title: 'Knowledge Seeker', description: 'Complete 5 lessons', icon: '📚', xpReward: 75, category: 'lessons' as const },
  { id: 'lessons_10', title: 'Learning Machine', description: 'Complete 10 lessons', icon: '🚀', xpReward: 150, category: 'lessons' as const },
  { id: 'lessons_20', title: 'JavaScript Ninja', description: 'Complete 20 lessons', icon: '🥷', xpReward: 300, category: 'lessons' as const },
  { id: 'quiz_perfect', title: 'Perfect Score', description: 'Get 100% on a quiz', icon: '💯', xpReward: 100, category: 'quiz' as const },
  { id: 'quiz_master', title: 'Quiz Master', description: 'Take 10 quizzes', icon: '🧠', xpReward: 200, category: 'quiz' as const },
  { id: 'early_bird', title: 'Early Bird', description: 'Complete a lesson before 9 AM', icon: '🌅', xpReward: 50, category: 'special' as const },
  { id: 'night_owl', title: 'Night Owl', description: 'Complete a lesson after 10 PM', icon: '🦉', xpReward: 50, category: 'special' as const },
];

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      currentDay: 1,
      currentLessonId: 'lesson-001',
      streak: 0,
      maxStreak: 0,
      lastCompletedDate: null,
      xp: 0,
      level: 1,
      achievements: [],
      weeklyGoal: {
        lessonsTarget: 5,
        xpTarget: 500,
        currentLessons: 0,
        currentXp: 0,
        weekStart: new Date().toISOString().split('T')[0],
      },
      totalTimeSpent: 0,
      quizzesTaken: 0,
      averageQuizScore: 0,
      lastActiveDate: null,
      
      markAsCompleted: (lessonId: string, timeSpent = 0) => {
        set((state) => {
          const lessonProgress = state.progress[lessonId] || { completed: false, bookmarked: false };

          // Only add XP if not already completed
          let xpToAdd = 0;
          if (!lessonProgress.completed) {
            xpToAdd = 50; // Base XP for completing a lesson

            // Bonus XP for time-based achievements
            const hour = new Date().getHours();
            if (hour < 9) xpToAdd += 25; // Early bird bonus
            if (hour >= 22) xpToAdd += 25; // Night owl bonus
          }

          const now = new Date().toISOString();

          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                ...lessonProgress,
                completed: true,
                lastViewed: now,
                completedAt: now,
                timeSpent: (lessonProgress.timeSpent || 0) + timeSpent,
              },
            },
            xp: state.xp + xpToAdd,
            totalTimeSpent: state.totalTimeSpent + timeSpent,
            lastCompletedDate: new Date().toISOString().split('T')[0],
          };
        });

        // Update streak and check achievements
        get().updateStreak();
        get().checkAchievements();
        get().updateWeeklyGoal();
        get().updateLastActive();
      },
      
      toggleBookmark: (lessonId: string) => {
        set((state) => {
          const lessonProgress = state.progress[lessonId] || { completed: false, bookmarked: false };
          
          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                ...lessonProgress,
                bookmarked: !lessonProgress.bookmarked,
              },
            },
          };
        });
      },
      
      incrementDay: () => {
        set((state) => ({
          currentDay: Math.min(state.currentDay + 1, 30),
        }));
      },
      
      decrementDay: () => {
        set((state) => ({
          currentDay: Math.max(state.currentDay - 1, 1),
        }));
      },
      
      resetProgress: () => {
        set({
          progress: {},
          currentDay: 1,
          streak: 0,
          lastCompletedDate: null,
          xp: 0,
        });
      },
      
      updateStreak: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastDate = state.lastCompletedDate;

          if (!lastDate) {
            return { streak: 1, maxStreak: Math.max(1, state.maxStreak), lastCompletedDate: today };
          }

          const lastDateObj = new Date(lastDate);
          const todayObj = new Date(today);

          // Calculate the difference in days
          const diffTime = Math.abs(todayObj.getTime() - lastDateObj.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // If today is the same as last completed, keep streak
          if (diffDays === 0) {
            return { streak: state.streak };
          }

          // If yesterday was the last completed day, increment streak
          if (diffDays === 1) {
            const newStreak = state.streak + 1;
            return {
              streak: newStreak,
              maxStreak: Math.max(newStreak, state.maxStreak),
              lastCompletedDate: today
            };
          }

          // If more than 1 day has passed, reset streak
          return { streak: 1, lastCompletedDate: today };
        });
      },
      
      addXp: (amount: number) => {
        set((state) => ({
          xp: state.xp + amount,
          level: get().getLevel(),
        }));
      },

      addQuizScore: (score: number) => {
        set((state) => {
          const newQuizCount = state.quizzesTaken + 1;
          const newAverageScore = ((state.averageQuizScore * state.quizzesTaken) + score) / newQuizCount;

          return {
            quizzesTaken: newQuizCount,
            averageQuizScore: newAverageScore,
          };
        });

        // Check for quiz achievements
        get().checkAchievements();
      },

      checkAchievements: () => {
        const state = get();
        const completedLessons = Object.values(state.progress).filter(p => p.completed).length;
        const unlockedAchievements = [...state.achievements];

        ACHIEVEMENTS.forEach(achievement => {
          // Skip if already unlocked
          if (unlockedAchievements.find(a => a.id === achievement.id)) return;

          let shouldUnlock = false;

          switch (achievement.id) {
            case 'first_lesson':
              shouldUnlock = completedLessons >= 1;
              break;
            case 'lessons_5':
              shouldUnlock = completedLessons >= 5;
              break;
            case 'lessons_10':
              shouldUnlock = completedLessons >= 10;
              break;
            case 'lessons_20':
              shouldUnlock = completedLessons >= 20;
              break;
            case 'streak_3':
              shouldUnlock = state.streak >= 3;
              break;
            case 'streak_7':
              shouldUnlock = state.streak >= 7;
              break;
            case 'streak_30':
              shouldUnlock = state.streak >= 30;
              break;
            case 'quiz_perfect':
              shouldUnlock = state.averageQuizScore === 100 && state.quizzesTaken > 0;
              break;
            case 'quiz_master':
              shouldUnlock = state.quizzesTaken >= 10;
              break;
            case 'early_bird':
              // Check if any lesson was completed before 9 AM
              shouldUnlock = Object.values(state.progress).some(p => {
                if (p.completedAt) {
                  const hour = new Date(p.completedAt).getHours();
                  return hour < 9;
                }
                return false;
              });
              break;
            case 'night_owl':
              // Check if any lesson was completed after 10 PM
              shouldUnlock = Object.values(state.progress).some(p => {
                if (p.completedAt) {
                  const hour = new Date(p.completedAt).getHours();
                  return hour >= 22;
                }
                return false;
              });
              break;
          }

          if (shouldUnlock) {
            unlockedAchievements.push({
              ...achievement,
              unlockedAt: new Date().toISOString(),
            });
          }
        });

        // Update state if new achievements were unlocked
        if (unlockedAchievements.length > state.achievements.length) {
          const newAchievements = unlockedAchievements.slice(state.achievements.length);
          const totalXpReward = newAchievements.reduce((sum, a) => sum + a.xpReward, 0);

          set({
            achievements: unlockedAchievements,
            xp: state.xp + totalXpReward,
          });
        }
      },

      updateWeeklyGoal: () => {
        set((state) => {
          const today = new Date();
          const weekStart = new Date(state.weeklyGoal.weekStart);
          const daysDiff = Math.floor((today.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));

          // If it's a new week, reset the goal
          if (daysDiff >= 7) {
            return {
              weeklyGoal: {
                lessonsTarget: 5,
                xpTarget: 500,
                currentLessons: 0,
                currentXp: 0,
                weekStart: today.toISOString().split('T')[0],
              },
            };
          }

          // Update current progress
          const completedThisWeek = Object.values(state.progress).filter(p => {
            if (p.completedAt) {
              const completedDate = new Date(p.completedAt);
              return completedDate >= weekStart;
            }
            return false;
          }).length;

          return {
            weeklyGoal: {
              ...state.weeklyGoal,
              currentLessons: completedThisWeek,
              currentXp: Math.min(state.xp, state.weeklyGoal.xpTarget),
            },
          };
        });
      },

      getLevel: () => {
        const state = get();
        return Math.floor(state.xp / 100) + 1; // 100 XP per level
      },

      getXpForNextLevel: () => {
        const state = get();
        const currentLevel = get().getLevel();
        const xpForCurrentLevel = (currentLevel - 1) * 100;
        return (currentLevel * 100) - state.xp;
      },

      updateLastActive: () => {
        set({
          lastActiveDate: new Date().toISOString().split('T')[0],
        });
      },
    }),
    {
      name: 'js-swipelearn-progress',
      storage: createJSONStorage(() => AsyncStorage),
      version: 6, // Increment version for new gamification features
      migrate: (persistedState: any, version: number) => {
        // Handle migration from old data structure
        if (version < 6) {
          return {
            progress: persistedState?.progress || {},
            currentDay: persistedState?.currentDay || 1,
            currentLessonId: persistedState?.currentLessonId || 'variables-basics',
            streak: persistedState?.streak || 0,
            maxStreak: persistedState?.maxStreak || persistedState?.streak || 0,
            lastCompletedDate: persistedState?.lastCompletedDate || null,
            xp: persistedState?.xp || 0,
            level: 1,
            achievements: [],
            weeklyGoal: {
              lessonsTarget: 5,
              xpTarget: 500,
              currentLessons: 0,
              currentXp: 0,
              weekStart: new Date().toISOString().split('T')[0],
            },
            totalTimeSpent: 0,
            quizzesTaken: 0,
            averageQuizScore: 0,
            lastActiveDate: null,
          };
        }
        return persistedState;
      },
    }
  )
);
