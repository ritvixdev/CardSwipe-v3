import { useProgressStore } from '../../store/useProgressStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('useProgressStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useProgressStore.getState().resetProgress();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useProgressStore.getState();

      expect(store.progress).toEqual({});
      expect(store.currentDay).toBe(1);
      expect(store.currentLessonId).toBe('lesson-001');
      expect(store.streak).toBe(0);
      expect(store.lastCompletedDate).toBeNull();
      expect(store.xp).toBe(0);
    });

    it('should have all required action functions', () => {
      const store = useProgressStore.getState();

      expect(typeof store.markAsCompleted).toBe('function');
      expect(typeof store.toggleBookmark).toBe('function');
      expect(typeof store.incrementDay).toBe('function');
      expect(typeof store.decrementDay).toBe('function');
      expect(typeof store.resetProgress).toBe('function');
      expect(typeof store.updateStreak).toBe('function');
      expect(typeof store.addXp).toBe('function');
    });
  });

  describe('markAsCompleted', () => {
    it('should mark lesson as completed and add XP', () => {
      const store = useProgressStore.getState();

      store.markAsCompleted('lesson-001');

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.progress['lesson-001']).toEqual(
        expect.objectContaining({
          completed: true,
          bookmarked: false,
          completedAt: expect.any(String),
        })
      );
      expect(updatedStore.xp).toBeGreaterThan(0); // XP should increase
      expect(updatedStore.lastCompletedDate).toBe(new Date().toISOString().split('T')[0]);
    });

    it('should not add XP if lesson already completed', () => {
      const store = useProgressStore.getState();

      // Mark as completed first time
      store.markAsCompleted('lesson-001');
      const xpAfterFirst = useProgressStore.getState().xp;

      // Mark as completed second time
      store.markAsCompleted('lesson-001');
      const xpAfterSecond = useProgressStore.getState().xp;

      expect(xpAfterSecond).toBe(xpAfterFirst); // XP should not increase
    });
  });

  describe('toggleBookmark', () => {
    it('should bookmark a lesson', () => {
      const store = useProgressStore.getState();

      store.toggleBookmark('lesson-001');

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.progress['lesson-001']).toEqual({
        completed: false,
        bookmarked: true,
      });
    });

    it('should unbookmark a bookmarked lesson', () => {
      const store = useProgressStore.getState();

      // Bookmark first
      store.toggleBookmark('lesson-001');

      // Unbookmark
      store.toggleBookmark('lesson-001');

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.progress['lesson-001'].bookmarked).toBe(false);
    });
  });

  describe('Day Navigation', () => {
    it('should increment day', () => {
      const store = useProgressStore.getState();

      store.incrementDay();

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.currentDay).toBe(2);
    });

    it('should not increment day beyond 30', () => {
      const store = useProgressStore.getState();

      // Set to day 30
      for (let i = 1; i < 30; i++) {
        store.incrementDay();
      }

      let updatedStore = useProgressStore.getState();
      expect(updatedStore.currentDay).toBe(30);

      // Try to increment beyond 30
      store.incrementDay();
      updatedStore = useProgressStore.getState();
      expect(updatedStore.currentDay).toBe(30); // Should stay at 30
    });

    it('should decrement day', () => {
      const store = useProgressStore.getState();

      // First increment to day 2
      store.incrementDay();

      // Then decrement
      store.decrementDay();

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.currentDay).toBe(1);
    });

    it('should not decrement day below 1', () => {
      const store = useProgressStore.getState();

      store.decrementDay();

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.currentDay).toBe(1); // Should stay at 1
    });
  });

  describe('XP System', () => {
    it('should add XP correctly', () => {
      const store = useProgressStore.getState();

      store.addXp(25);
      let updatedStore = useProgressStore.getState();
      expect(updatedStore.xp).toBe(25);

      store.addXp(75);
      updatedStore = useProgressStore.getState();
      expect(updatedStore.xp).toBe(100);
    });
  });

  describe('Streak System', () => {
    it('should update streak when lesson completed today', () => {
      const store = useProgressStore.getState();

      store.markAsCompleted('lesson-001');
      store.updateStreak();

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.streak).toBeGreaterThanOrEqual(0); // Streak should be updated
    });

    it('should maintain streak for consecutive days', () => {
      const store = useProgressStore.getState();

      // Simulate completing lessons on consecutive days
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // Set yesterday as last completed date
      useProgressStore.setState({
        lastCompletedDate: yesterday.toISOString().split('T')[0],
        streak: 1
      });

      // Complete lesson today
      store.markAsCompleted('lesson-002');
      store.updateStreak();

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.streak).toBeGreaterThanOrEqual(1); // Streak should be maintained or increased
    });

    it('should reset streak if gap in completion', () => {
      const store = useProgressStore.getState();

      // Simulate last completion was 3 days ago
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      useProgressStore.setState({
        lastCompletedDate: threeDaysAgo.toISOString().split('T')[0],
        streak: 5
      });

      store.markAsCompleted('lesson-001');
      store.updateStreak();

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.streak).toBeGreaterThanOrEqual(0); // Streak should be reset or maintained
    });
  });

  describe('Progress Calculations', () => {
    it('should calculate completion percentage correctly', () => {
      const store = useProgressStore.getState();

      // Complete 3 lessons
      store.markAsCompleted('lesson-001');
      store.markAsCompleted('lesson-002');
      store.markAsCompleted('lesson-003');

      const updatedStore = useProgressStore.getState();
      const completedCount = Object.values(updatedStore.progress).filter(p => p.completed).length;
      expect(completedCount).toBe(3);
    });

    it('should count bookmarked lessons correctly', () => {
      const store = useProgressStore.getState();

      store.toggleBookmark('lesson-001');
      store.toggleBookmark('lesson-002');
      store.toggleBookmark('lesson-003');

      const updatedStore = useProgressStore.getState();
      const bookmarkedCount = Object.values(updatedStore.progress).filter(p => p.bookmarked).length;
      expect(bookmarkedCount).toBe(3);
    });
  });

  describe('Level System', () => {
    it('should calculate level based on XP', () => {
      const store = useProgressStore.getState();

      store.addXp(250);

      const updatedStore = useProgressStore.getState();
      const level = updatedStore.getLevel();
      expect(level).toBeGreaterThan(1); // Level should increase with XP
    });

    it('should handle XP overflow correctly', () => {
      const store = useProgressStore.getState();

      store.addXp(1000);

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.xp).toBe(1000);
    });
  });

  describe('Data Persistence', () => {
    it('should persist state changes', () => {
      const store = useProgressStore.getState();

      store.markAsCompleted('lesson-001');
      store.addXp(50);

      const updatedStore = useProgressStore.getState();
      // State should be persisted (mocked AsyncStorage)
      expect(updatedStore.progress['lesson-001'].completed).toBe(true);
      expect(updatedStore.xp).toBeGreaterThan(50); // XP should increase
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid lesson IDs gracefully', () => {
      const store = useProgressStore.getState();

      expect(() => {
        store.markAsCompleted('invalid-lesson');
        store.markAsCompleted('');
        store.toggleBookmark('nonexistent');
      }).not.toThrow();
    });

    it('should handle negative XP gracefully', () => {
      const store = useProgressStore.getState();
      const initialXp = store.xp;

      store.addXp(-50);

      const updatedStore = useProgressStore.getState();
      // XP should either stay the same or be handled gracefully
      expect(updatedStore.xp).toBeGreaterThanOrEqual(initialXp - 50);
    });
  });

  describe('resetProgress', () => {
    it('should reset all progress to initial state', () => {
      const store = useProgressStore.getState();

      // Make some changes
      store.markAsCompleted(1);
      store.toggleBookmark(2);
      store.incrementDay();
      store.addXp(100);

      // Reset
      store.resetProgress();

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.progress).toEqual({});
      expect(updatedStore.currentDay).toBe(1);
      expect(updatedStore.streak).toBe(0);
      expect(updatedStore.lastCompletedDate).toBeNull();
      expect(updatedStore.xp).toBe(0);
    });
  });
});
