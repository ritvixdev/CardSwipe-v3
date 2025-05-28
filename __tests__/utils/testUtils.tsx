import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Custom render function that includes necessary providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {children}
    </GestureHandlerRootView>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };

// Test utilities for common patterns
export const createMockLesson = (overrides = {}) => ({
  id: 1,
  day: 1,
  title: 'Test Lesson',
  description: 'Test Description',
  content: 'Test Content',
  codeExample: 'console.log("test");',
  difficulty: 'Beginner' as const,
  estimatedTime: 10,
  keyPoints: ['Point 1', 'Point 2'],
  practiceExercise: 'Test Exercise',
  ...overrides,
});

export const createMockProgressState = (overrides = {}) => ({
  progress: {},
  currentDay: 1,
  currentLessonId: 'lesson-001',
  streak: 0,
  lastCompletedDate: null,
  xp: 0,
  markAsCompleted: jest.fn(),
  toggleBookmark: jest.fn(),
  incrementDay: jest.fn(),
  decrementDay: jest.fn(),
  resetProgress: jest.fn(),
  updateStreak: jest.fn(),
  addXp: jest.fn(),
  ...overrides,
});

// Gesture simulation helpers
export const simulateSwipe = (element: any, direction: 'left' | 'right' | 'up' | 'down') => {
  // This would simulate actual swipe gestures
  // Implementation depends on your gesture handling setup
  const gestureEvent = {
    nativeEvent: {
      translationX: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      translationY: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
      velocityX: direction === 'left' ? -500 : direction === 'right' ? 500 : 0,
      velocityY: direction === 'up' ? -500 : direction === 'down' ? 500 : 0,
      state: 5, // END state
    },
  };
  
  // Trigger gesture handler
  if (element.props.onGestureEvent) {
    element.props.onGestureEvent(gestureEvent);
  }
  
  if (element.props.onHandlerStateChange) {
    element.props.onHandlerStateChange(gestureEvent);
  }
};

// Animation testing helpers
export const flushAnimations = () => {
  // Fast-forward all animations
  jest.runAllTimers();
};

// Async testing helpers
export const waitForAnimation = (duration = 300) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

// Store testing helpers
export const resetStore = () => {
  // Reset the store to initial state
  const { useProgressStore } = require('@/store/useProgressStore');
  useProgressStore.getState().resetProgress();
};

// Mock data generators
export const generateMockLessons = (count: number) => {
  return Array.from({ length: count }, (_, index) => createMockLesson({
    id: index + 1,
    day: index + 1,
    title: `Lesson ${index + 1}`,
    description: `Description for lesson ${index + 1}`,
  }));
};

export const generateMockProgress = (completedLessons: number[], bookmarkedLessons: number[]) => {
  const progress: Record<number, any> = {};
  
  completedLessons.forEach(id => {
    progress[id] = {
      completed: true,
      bookmarked: bookmarkedLessons.includes(id),
      lastViewed: new Date().toISOString(),
    };
  });
  
  bookmarkedLessons.forEach(id => {
    if (!progress[id]) {
      progress[id] = {
        completed: false,
        bookmarked: true,
      };
    }
  });
  
  return progress;
};

// Performance testing helpers
export const measureRenderTime = (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

// Accessibility testing helpers
export const checkAccessibility = (element: any) => {
  // Check for common accessibility issues
  const issues = [];
  
  if (!element.props.accessibilityLabel && !element.props.accessibilityLabelledBy) {
    issues.push('Missing accessibility label');
  }
  
  if (!element.props.accessibilityRole) {
    issues.push('Missing accessibility role');
  }
  
  return issues;
};
