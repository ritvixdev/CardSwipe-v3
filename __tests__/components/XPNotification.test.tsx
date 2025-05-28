import React from 'react';
import { render, act } from '@testing-library/react-native';
import XPNotification from '@/components/XPNotification';

// Mock Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  RN.Animated.spring = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  RN.Animated.parallel = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  return RN;
});

describe('XPNotification', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render when visible is true', () => {
      const { getByText } = render(
        <XPNotification visible={true} xpGained={50} onComplete={mockOnComplete} />
      );
      
      expect(getByText('+50 XP')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByText } = render(
        <XPNotification visible={false} xpGained={50} onComplete={mockOnComplete} />
      );
      
      expect(queryByText('+50 XP')).toBeNull();
    });

    it('should display correct XP amount', () => {
      const { getByText } = render(
        <XPNotification visible={true} xpGained={100} onComplete={mockOnComplete} />
      );
      
      expect(getByText('+100 XP')).toBeTruthy();
    });

    it('should render star icon', () => {
      const { getByTestId } = render(
        <XPNotification visible={true} xpGained={25} onComplete={mockOnComplete} />
      );
      
      // Assuming you add testID to the Star component
      expect(getByTestId('xp-star-icon')).toBeTruthy();
    });
  });

  describe('Animation Lifecycle', () => {
    it('should call onComplete after animation sequence', () => {
      render(
        <XPNotification visible={true} xpGained={50} onComplete={mockOnComplete} />
      );
      
      // Fast-forward through the hold duration (1500ms)
      act(() => {
        jest.advanceTimersByTime(1500);
      });
      
      expect(mockOnComplete).toHaveBeenCalled();
    });

    it('should not call onComplete when not visible', () => {
      render(
        <XPNotification visible={false} xpGained={50} onComplete={mockOnComplete} />
      );
      
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      expect(mockOnComplete).not.toHaveBeenCalled();
    });
  });

  describe('Props Validation', () => {
    it('should handle zero XP', () => {
      const { getByText } = render(
        <XPNotification visible={true} xpGained={0} onComplete={mockOnComplete} />
      );
      
      expect(getByText('+0 XP')).toBeTruthy();
    });

    it('should handle large XP values', () => {
      const { getByText } = render(
        <XPNotification visible={true} xpGained={9999} onComplete={mockOnComplete} />
      );
      
      expect(getByText('+9999 XP')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', () => {
      const { getByLabelText } = render(
        <XPNotification visible={true} xpGained={75} onComplete={mockOnComplete} />
      );
      
      expect(getByLabelText('Gained 75 experience points')).toBeTruthy();
    });

    it('should be accessible to screen readers', () => {
      const { getByA11yRole } = render(
        <XPNotification visible={true} xpGained={50} onComplete={mockOnComplete} />
      );
      
      expect(getByA11yRole('alert')).toBeTruthy();
    });
  });
});
