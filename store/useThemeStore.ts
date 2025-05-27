import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  actions: {
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
  };
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      actions: {
        toggleTheme: () => {
          set((state) => ({
            mode: state.mode === 'dark' ? 'light' : 'dark',
          }));
        },
        setTheme: (mode: ThemeMode) => {
          set({ mode });
        },
      },
    }),
    {
      name: 'js-swipelearn-theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);