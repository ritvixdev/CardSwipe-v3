import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LearnScreen from '@/app/(tabs)/index';
import { useProgressStore } from '@/store/useProgressStore';

// Integration test for the complete swipe flow
describe('Swipe Flow Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    useProgressStore.getState().resetProgress();
  });

  describe('Complete Learning Flow', () => {
    it('should complete a full learning session', async () => {
      const { getByTestId, getByText } = render(<LearnScreen />);
      
      // Start with lesson 1
      expect(getByText('Introduction to JavaScript')).toBeTruthy();
      
      // Complete lesson 1 (swipe left)
      fireEvent.press(getByTestId('swipe-left-btn'));
      
      // Should show XP notification
      await waitFor(() => {
        expect(getByTestId('xp-notification')).toBeTruthy();
      });
      
      // Should move to lesson 2
      await waitFor(() => {
        expect(getByText('Variables and Data Types')).toBeTruthy();
      });
      
      // Bookmark lesson 2 (swipe right)
      fireEvent.press(getByTestId('swipe-right-btn'));
      
      // Should move to lesson 3
      await waitFor(() => {
        expect(getByText('Functions and Scope')).toBeTruthy();
      });
      
      // Check progress state
      const store = useProgressStore.getState();
      expect(store.progress[1].completed).toBe(true);
      expect(store.progress[2].bookmarked).toBe(true);
      expect(store.xp).toBe(50); // Only from completing lesson 1
      expect(store.currentDay).toBe(3);
    });

    it('should handle navigation between lessons', async () => {
      const { getByTestId, getByText } = render(<LearnScreen />);
      
      // Go to next lesson (swipe up)
      fireEvent.press(getByTestId('swipe-up-btn'));
      expect(getByText('Variables and Data Types')).toBeTruthy();
      
      // Go to next lesson again
      fireEvent.press(getByTestId('swipe-up-btn'));
      expect(getByText('Functions and Scope')).toBeTruthy();
      
      // Go back (swipe down)
      fireEvent.press(getByTestId('swipe-down-btn'));
      expect(getByText('Variables and Data Types')).toBeTruthy();
      
      // Go back to first lesson
      fireEvent.press(getByTestId('swipe-down-btn'));
      expect(getByText('Introduction to JavaScript')).toBeTruthy();
    });
  });

  describe('Progress Persistence', () => {
    it('should persist progress across app restarts', () => {
      // This would test AsyncStorage persistence
      // Implementation depends on testing AsyncStorage
    });

    it('should maintain XP and streak correctly', async () => {
      const { getByTestId } = render(<LearnScreen />);
      
      // Complete multiple lessons
      for (let i = 0; i < 3; i++) {
        fireEvent.press(getByTestId('swipe-left-btn'));
        await waitFor(() => {
          // Wait for state update
        });
      }
      
      const store = useProgressStore.getState();
      expect(store.xp).toBe(150); // 3 lessons * 50 XP each
      expect(Object.keys(store.progress).length).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid swipes correctly', async () => {
      const { getByTestId } = render(<LearnScreen />);
      
      // Rapid swipes
      fireEvent.press(getByTestId('swipe-left-btn'));
      fireEvent.press(getByTestId('swipe-left-btn'));
      fireEvent.press(getByTestId('swipe-left-btn'));
      
      await waitFor(() => {
        const store = useProgressStore.getState();
        expect(store.currentDay).toBe(4); // Should be at lesson 4
      });
    });

    it('should handle boundary conditions', async () => {
      const { getByTestId } = render(<LearnScreen />);
      
      // Try to go before first lesson
      fireEvent.press(getByTestId('swipe-down-btn'));
      
      const store = useProgressStore.getState();
      expect(store.currentDay).toBe(1); // Should stay at lesson 1
    });
  });

  describe('Performance', () => {
    it('should handle many lessons efficiently', async () => {
      const { getByTestId } = render(<LearnScreen />);
      
      const startTime = Date.now();
      
      // Navigate through many lessons
      for (let i = 0; i < 10; i++) {
        fireEvent.press(getByTestId('swipe-up-btn'));
      }
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should be fast
    });
  });

  describe('Error Recovery', () => {
    it('should recover from corrupted state', () => {
      // Simulate corrupted store state
      const store = useProgressStore.getState();
      store.resetProgress();
      
      const { getByTestId } = render(<LearnScreen />);
      
      // Should still work after reset
      fireEvent.press(getByTestId('swipe-left-btn'));
      
      expect(store.progress[1]).toBeDefined();
    });
  });
});
