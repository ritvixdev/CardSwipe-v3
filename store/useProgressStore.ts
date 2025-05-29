import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LessonProgress {
  completed: boolean;
  bookmarked: boolean;
  lastViewed?: string;
}

interface ProgressState {
  progress: Record<string, LessonProgress>;
  currentDay: number;
  currentLessonId: string;
  streak: number;
  lastCompletedDate: string | null;
  xp: number;

  // Actions
  markAsCompleted: (lessonId: string) => void;
  toggleBookmark: (lessonId: string) => void;
  incrementDay: () => void;
  decrementDay: () => void;
  resetProgress: () => void;
  updateStreak: () => void;
  addXp: (amount: number) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      currentDay: 1,
      currentLessonId: 'lesson-001',
      streak: 0,
      lastCompletedDate: null,
      xp: 0,
      
      markAsCompleted: (lessonId: string) => {
        set((state) => {
          const lessonProgress = state.progress[lessonId] || { completed: false, bookmarked: false };
          
          // Only add XP if not already completed
          let xpToAdd = 0;
          if (!lessonProgress.completed) {
            xpToAdd = 50; // XP for completing a lesson
          }
          
          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                ...lessonProgress,
                completed: true,
                lastViewed: new Date().toISOString(),
              },
            },
            xp: state.xp + xpToAdd,
            lastCompletedDate: new Date().toISOString().split('T')[0],
          };
        });
        
        // Update streak after marking as completed
        get().updateStreak();
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
            return { streak: 1, lastCompletedDate: today };
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
            return { streak: state.streak + 1, lastCompletedDate: today };
          }
          
          // If more than 1 day has passed, reset streak
          return { streak: 1, lastCompletedDate: today };
        });
      },
      
      addXp: (amount: number) => {
        set((state) => ({
          xp: state.xp + amount,
        }));
      },
    }),
    {
      name: 'js-swipelearn-progress',
      storage: createJSONStorage(() => AsyncStorage),
      version: 5, // Increment version to clear old cached data with new JSON structure
      migrate: (persistedState: any, version: number) => {
        // Handle migration from old data structure
        if (version < 5) {
          return {
            progress: {},
            currentDay: 1,
            currentLessonId: 'variables-basics',
            streak: 0,
            lastCompletedDate: null,
            xp: 0,
          };
        }
        return persistedState;
      },
    }
  )
);
