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

      store.markAsCompleted(1);

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.progress[1]).toEqual({
        completed: true,
        bookmarked: false,
        lastViewed: expect.any(String),
      });
      expect(updatedStore.xp).toBe(50);
      expect(updatedStore.lastCompletedDate).toBe(new Date().toISOString().split('T')[0]);
    });

    it('should not add XP if lesson already completed', () => {
      const store = useProgressStore.getState();

      // Mark as completed first time
      store.markAsCompleted(1);
      const xpAfterFirst = useProgressStore.getState().xp;

      // Mark as completed second time
      store.markAsCompleted(1);
      const xpAfterSecond = useProgressStore.getState().xp;

      expect(xpAfterSecond).toBe(xpAfterFirst); // XP should not increase
    });
  });

  describe('toggleBookmark', () => {
    it('should bookmark a lesson', () => {
      const store = useProgressStore.getState();

      store.toggleBookmark(1);

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.progress[1]).toEqual({
        completed: false,
        bookmarked: true,
      });
    });

    it('should unbookmark a bookmarked lesson', () => {
      const store = useProgressStore.getState();

      // Bookmark first
      store.toggleBookmark(1);

      // Unbookmark
      store.toggleBookmark(1);

      const updatedStore = useProgressStore.getState();
      expect(updatedStore.progress[1].bookmarked).toBe(false);
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
