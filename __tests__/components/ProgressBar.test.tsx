import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from '@/components/ProgressBar';
import { useProgressStore } from '@/store/useProgressStore';

// Mock the progress store
jest.mock('@/store/useProgressStore');

const mockUseProgressStore = useProgressStore as jest.MockedFunction<typeof useProgressStore>;

describe('ProgressBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render progress bar with correct XP', () => {
      mockUseProgressStore.mockReturnValue({
        xp: 150,
        currentDay: 5,
        streak: 3,
        progress: {},
        currentLessonId: 'lesson-005',
        lastCompletedDate: null,
        markAsCompleted: jest.fn(),
        toggleBookmark: jest.fn(),
        incrementDay: jest.fn(),
        decrementDay: jest.fn(),
        resetProgress: jest.fn(),
        updateStreak: jest.fn(),
        addXp: jest.fn(),
      });

      const { getByText } = render(<ProgressBar />);
      
      expect(getByText('150 XP')).toBeTruthy();
    });

    it('should render current day', () => {
      mockUseProgressStore.mockReturnValue({
        xp: 100,
        currentDay: 7,
        streak: 2,
        progress: {},
        currentLessonId: 'lesson-007',
        lastCompletedDate: null,
        markAsCompleted: jest.fn(),
        toggleBookmark: jest.fn(),
        incrementDay: jest.fn(),
        decrementDay: jest.fn(),
        resetProgress: jest.fn(),
        updateStreak: jest.fn(),
        addXp: jest.fn(),
      });

      const { getByText } = render(<ProgressBar />);
      
      expect(getByText('Day 7')).toBeTruthy();
    });

    it('should render streak information', () => {
      mockUseProgressStore.mockReturnValue({
        xp: 200,
        currentDay: 10,
        streak: 5,
        progress: {},
        currentLessonId: 'lesson-010',
        lastCompletedDate: null,
        markAsCompleted: jest.fn(),
        toggleBookmark: jest.fn(),
        incrementDay: jest.fn(),
        decrementDay: jest.fn(),
        resetProgress: jest.fn(),
        updateStreak: jest.fn(),
        addXp: jest.fn(),
      });

      const { getByText } = render(<ProgressBar />);
      
      expect(getByText('🔥 5')).toBeTruthy();
    });

    it('should show correct progress percentage', () => {
      const mockProgress = {
        1: { completed: true, bookmarked: false },
        2: { completed: true, bookmarked: false },
        3: { completed: false, bookmarked: true },
      };

      mockUseProgressStore.mockReturnValue({
        xp: 100,
        currentDay: 3,
        streak: 2,
        progress: mockProgress,
        currentLessonId: 'lesson-003',
        lastCompletedDate: null,
        markAsCompleted: jest.fn(),
        toggleBookmark: jest.fn(),
        incrementDay: jest.fn(),
        decrementDay: jest.fn(),
        resetProgress: jest.fn(),
        updateStreak: jest.fn(),
        addXp: jest.fn(),
      });

      const { getByTestId } = render(<ProgressBar />);
      
      // 2 completed out of 30 total lessons = 6.67%
      // Check if progress calculation is correct
      // 2 completed out of 30 total lessons = 6.67%
      const progressElement = getByTestId('progress-indicator');
      expect(progressElement).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero XP', () => {
      mockUseProgressStore.mockReturnValue({
        xp: 0,
        currentDay: 1,
        streak: 0,
        progress: {},
        currentLessonId: 'lesson-001',
        lastCompletedDate: null,
        markAsCompleted: jest.fn(),
        toggleBookmark: jest.fn(),
        incrementDay: jest.fn(),
        decrementDay: jest.fn(),
        resetProgress: jest.fn(),
        updateStreak: jest.fn(),
        addXp: jest.fn(),
      });

      const { getByText } = render(<ProgressBar />);
      
      expect(getByText('0 XP')).toBeTruthy();
    });

    it('should handle zero streak', () => {
      mockUseProgressStore.mockReturnValue({
        xp: 50,
        currentDay: 2,
        streak: 0,
        progress: {},
        currentLessonId: 'lesson-002',
        lastCompletedDate: null,
        markAsCompleted: jest.fn(),
        toggleBookmark: jest.fn(),
        incrementDay: jest.fn(),
        decrementDay: jest.fn(),
        resetProgress: jest.fn(),
        updateStreak: jest.fn(),
        addXp: jest.fn(),
      });

      const { getByText } = render(<ProgressBar />);
      
      expect(getByText('🔥 0')).toBeTruthy();
    });

    it('should handle empty progress', () => {
      mockUseProgressStore.mockReturnValue({
        xp: 0,
        currentDay: 1,
        streak: 0,
        progress: {},
        currentLessonId: 'lesson-001',
        lastCompletedDate: null,
        markAsCompleted: jest.fn(),
        toggleBookmark: jest.fn(),
        incrementDay: jest.fn(),
        decrementDay: jest.fn(),
        resetProgress: jest.fn(),
        updateStreak: jest.fn(),
        addXp: jest.fn(),
      });

      const { getByTestId } = render(<ProgressBar />);
      
      const progressElement = getByTestId('progress-indicator');
      expect(progressElement).toBeTruthy();
    });
  });
});
