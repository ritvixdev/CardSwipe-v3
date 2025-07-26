/**
 * Smoke tests to verify basic app functionality
 * These tests should run quickly and catch major issues
 */

describe('Basic App Functionality', () => {
  describe('Store Initialization', () => {
    it('should initialize progress store without errors', () => {
      expect(() => {
        const { useProgressStore } = require('@/store/useProgressStore');
        const store = useProgressStore.getState();
        
        // Basic store structure should exist
        expect(store).toHaveProperty('progress');
        expect(store).toHaveProperty('xp');
        expect(store).toHaveProperty('level');
        expect(store).toHaveProperty('streak');
        expect(store).toHaveProperty('markAsCompleted');
        expect(store).toHaveProperty('toggleBookmark');
        expect(store).toHaveProperty('addXp');
        expect(store).toHaveProperty('resetProgress');
      }).not.toThrow();
    });

    it('should initialize theme store without errors', () => {
      expect(() => {
        const { useThemeStore } = require('@/store/useThemeStore');
        const store = useThemeStore.getState();
        
        // Basic theme structure should exist
        expect(store).toHaveProperty('mode');
        expect(store).toHaveProperty('toggleTheme');
        expect(['light', 'dark']).toContain(store.mode);
      }).not.toThrow();
    });
  });

  describe('Data Loading', () => {
    it('should load lesson data without errors', () => {
      expect(() => {
        const { lessons } = require('@/data/processors/dataLoader');
        
        expect(Array.isArray(lessons)).toBe(true);
        expect(lessons.length).toBeGreaterThan(0);
        
        // Check first lesson structure
        if (lessons.length > 0) {
          const firstLesson = lessons[0];
          expect(firstLesson).toHaveProperty('id');
          expect(firstLesson).toHaveProperty('title');
          expect(firstLesson).toHaveProperty('description');
        }
      }).not.toThrow();
    });
  });

  describe('Basic Store Operations', () => {
    it('should handle lesson completion without infinite loops', () => {
      const { useProgressStore } = require('@/store/useProgressStore');
      const store = useProgressStore.getState();
      
      const initialXp = store.xp;
      const initialProgress = Object.keys(store.progress).length;
      
      // Complete a lesson
      store.markAsCompleted('test-lesson-001');
      
      const updatedStore = useProgressStore.getState();
      
      // Verify changes
      expect(updatedStore.progress['test-lesson-001']).toBeDefined();
      expect(updatedStore.progress['test-lesson-001'].completed).toBe(true);
      expect(updatedStore.xp).toBeGreaterThanOrEqual(initialXp);
      
      // Verify no infinite loop (should complete quickly)
      const startTime = Date.now();
      store.markAsCompleted('test-lesson-002');
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should handle theme changes without infinite loops', () => {
      const { useThemeStore } = require('@/store/useThemeStore');
      const store = useThemeStore.getState();
      
      const initialMode = store.mode;
      
      // Toggle theme
      const startTime = Date.now();
      store.toggleTheme();
      const endTime = Date.now();
      
      const updatedStore = useThemeStore.getState();
      
      // Verify theme changed
      expect(updatedStore.mode).not.toBe(initialMode);
      
      // Verify no infinite loop
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle multiple rapid operations without crashing', () => {
      const { useProgressStore } = require('@/store/useProgressStore');
      const store = useProgressStore.getState();
      
      const startTime = Date.now();
      
      // Perform multiple operations rapidly
      for (let i = 0; i < 10; i++) {
        store.markAsCompleted(`rapid-test-${i}`);
        store.toggleBookmark(`bookmark-test-${i}`);
        store.addXp(10);
      }
      
      const endTime = Date.now();
      
      // Should complete all operations quickly
      expect(endTime - startTime).toBeLessThan(500);
      
      // Verify final state is consistent
      const finalStore = useProgressStore.getState();
      expect(Object.keys(finalStore.progress).length).toBeGreaterThanOrEqual(10);
      expect(finalStore.xp).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid inputs gracefully', () => {
      const { useProgressStore } = require('@/store/useProgressStore');
      const store = useProgressStore.getState();
      
      expect(() => {
        // Test with invalid inputs
        store.markAsCompleted('');
        store.markAsCompleted(null as any);
        store.markAsCompleted(undefined as any);
        store.toggleBookmark('');
        store.addXp(NaN);
        store.addXp(Infinity);
      }).not.toThrow();
    });

    it('should maintain store integrity after errors', () => {
      const { useProgressStore } = require('@/store/useProgressStore');
      const store = useProgressStore.getState();
      
      const initialState = {
        xp: store.xp,
        level: store.level,
        streak: store.streak,
        progressCount: Object.keys(store.progress).length,
      };
      
      // Try operations that might cause issues
      try {
        store.addXp(-1000000);
        store.markAsCompleted('');
        store.toggleBookmark(null as any);
      } catch (error) {
        // Errors are acceptable, but state should remain valid
      }
      
      const finalStore = useProgressStore.getState();
      
      // Store should still be functional
      expect(typeof finalStore.xp).toBe('number');
      expect(typeof finalStore.level).toBe('number');
      expect(typeof finalStore.streak).toBe('number');
      expect(typeof finalStore.progress).toBe('object');
      expect(finalStore.progress).not.toBeNull();
    });
  });

  describe('Performance Checks', () => {
    it('should initialize stores quickly', () => {
      const startTime = Date.now();
      
      const { useProgressStore } = require('@/store/useProgressStore');
      const { useThemeStore } = require('@/store/useThemeStore');
      
      useProgressStore.getState();
      useThemeStore.getState();
      
      const endTime = Date.now();
      
      // Store initialization should be fast
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle concurrent operations efficiently', () => {
      const { useProgressStore } = require('@/store/useProgressStore');
      const store = useProgressStore.getState();
      
      const startTime = Date.now();
      
      // Simulate concurrent operations
      const operations = [];
      for (let i = 0; i < 50; i++) {
        operations.push(() => store.markAsCompleted(`concurrent-${i}`));
        operations.push(() => store.addXp(5));
        operations.push(() => store.toggleBookmark(`bookmark-${i}`));
      }
      
      // Execute all operations
      operations.forEach(op => op());
      
      const endTime = Date.now();
      
      // Should handle all operations efficiently
      expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second
      
      // Verify final state
      const finalStore = useProgressStore.getState();
      expect(Object.keys(finalStore.progress).length).toBeGreaterThan(0);
    });
  });

  describe('Memory Management', () => {
    it('should not create memory leaks during normal operations', () => {
      const { useProgressStore } = require('@/store/useProgressStore');
      const store = useProgressStore.getState();
      
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform many operations
      for (let i = 0; i < 100; i++) {
        store.markAsCompleted(`memory-test-${i}`);
        store.toggleBookmark(`memory-bookmark-${i}`);
        
        // Occasionally reset to prevent excessive growth
        if (i % 50 === 0) {
          store.resetProgress();
        }
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });
});
