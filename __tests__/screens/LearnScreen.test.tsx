import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LearnScreen from '@/app/(tabs)/index';
import { useProgressStore } from '@/store/useProgressStore';

// Mock the progress store
jest.mock('@/store/useProgressStore');

// Mock components
jest.mock('@/components/LessonCard', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return function MockLessonCard({ lesson, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }) {
    return (
      <View testID="lesson-card">
        <Text>{lesson.title}</Text>
        <TouchableOpacity testID="swipe-left-btn" onPress={onSwipeLeft}>
          <Text>Swipe Left</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="swipe-right-btn" onPress={onSwipeRight}>
          <Text>Swipe Right</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="swipe-up-btn" onPress={onSwipeUp}>
          <Text>Swipe Up</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="swipe-down-btn" onPress={onSwipeDown}>
          <Text>Swipe Down</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

jest.mock('@/components/ProgressBar', () => {
  const { View, Text } = require('react-native');
  return function MockProgressBar() {
    return (
      <View testID="progress-bar">
        <Text>Progress Bar</Text>
      </View>
    );
  };
});

jest.mock('@/components/XPNotification', () => {
  const { View, Text } = require('react-native');
  return function MockXPNotification({ visible, xpGained }) {
    if (!visible) return null;
    return (
      <View testID="xp-notification">
        <Text>+{xpGained} XP</Text>
      </View>
    );
  };
});

const mockUseProgressStore = useProgressStore as jest.MockedFunction<typeof useProgressStore>;

describe('LearnScreen', () => {
  const mockStore = {
    markAsCompleted: jest.fn(),
    toggleBookmark: jest.fn(),
    incrementDay: jest.fn(),
    decrementDay: jest.fn(),
    resetProgress: jest.fn(),
    updateStreak: jest.fn(),
    addXp: jest.fn(),
    progress: {},
    currentDay: 1,
    currentLessonId: 'lesson-001',
    streak: 0,
    lastCompletedDate: null,
    xp: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProgressStore.mockReturnValue(mockStore);
  });

  describe('Rendering', () => {
    it('should render learn screen with all components', () => {
      const { getByTestId } = render(<LearnScreen />);
      
      expect(getByTestId('progress-bar')).toBeTruthy();
      expect(getByTestId('lesson-card')).toBeTruthy();
    });

    it('should render current lesson', () => {
      const { getByText } = render(<LearnScreen />);
      
      // Should show the first lesson by default
      expect(getByText('Introduction to JavaScript')).toBeTruthy();
    });
  });

  describe('Swipe Functionality', () => {
    it('should handle swipe left (complete lesson)', async () => {
      const { getByTestId } = render(<LearnScreen />);
      
      fireEvent.press(getByTestId('swipe-left-btn'));
      
      expect(mockStore.markAsCompleted).toHaveBeenCalledWith(1);
      expect(mockStore.incrementDay).toHaveBeenCalled();
    });

    it('should handle swipe right (bookmark lesson)', async () => {
      const { getByTestId } = render(<LearnScreen />);
      
      fireEvent.press(getByTestId('swipe-right-btn'));
      
      expect(mockStore.toggleBookmark).toHaveBeenCalledWith(1);
      expect(mockStore.incrementDay).toHaveBeenCalled();
    });

    it('should handle swipe up (next lesson)', async () => {
      const { getByTestId } = render(<LearnScreen />);
      
      fireEvent.press(getByTestId('swipe-up-btn'));
      
      expect(mockStore.incrementDay).toHaveBeenCalled();
    });

    it('should handle swipe down (previous lesson)', async () => {
      const { getByTestId } = render(<LearnScreen />);
      
      fireEvent.press(getByTestId('swipe-down-btn'));
      
      expect(mockStore.decrementDay).toHaveBeenCalled();
    });
  });

  describe('XP Notification', () => {
    it('should show XP notification when lesson completed', async () => {
      const { getByTestId, queryByTestId } = render(<LearnScreen />);
      
      // Initially no notification
      expect(queryByTestId('xp-notification')).toBeNull();
      
      // Complete a lesson
      fireEvent.press(getByTestId('swipe-left-btn'));
      
      // Should show XP notification
      await waitFor(() => {
        expect(getByTestId('xp-notification')).toBeTruthy();
      });
    });

    it('should show correct XP amount in notification', async () => {
      const { getByTestId, getByText } = render(<LearnScreen />);
      
      fireEvent.press(getByTestId('swipe-left-btn'));
      
      await waitFor(() => {
        expect(getByText('+50 XP')).toBeTruthy();
      });
    });
  });

  describe('Lesson Navigation', () => {
    it('should not go below first lesson', () => {
      const { getByTestId } = render(<LearnScreen />);
      
      // Try to go to previous lesson when already at first
      fireEvent.press(getByTestId('swipe-down-btn'));
      
      // Should still be at lesson 1
      expect(mockStore.decrementDay).not.toHaveBeenCalled();
    });

    it('should not go beyond last lesson', () => {
      // Mock being at the last lesson
      const { getByTestId } = render(<LearnScreen />);
      
      // Simulate being at lesson 30 (last lesson)
      // This would require setting up the component state properly
    });
  });

  describe('Error Handling', () => {
    it('should handle store errors gracefully', () => {
      mockStore.markAsCompleted.mockImplementation(() => {
        throw new Error('Store error');
      });

      const { getByTestId } = render(<LearnScreen />);
      
      // Should not crash when store throws error
      expect(() => {
        fireEvent.press(getByTestId('swipe-left-btn'));
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper screen reader support', () => {
      const { getByLabelText } = render(<LearnScreen />);
      
      expect(getByLabelText(/learn screen/i)).toBeTruthy();
    });

    it('should announce lesson changes to screen readers', () => {
      // This would test screen reader announcements
      // Implementation depends on accessibility setup
    });
  });
});
