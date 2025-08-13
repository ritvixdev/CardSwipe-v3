import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from '@/components/ProgressBar';
import { useProgressStore } from '@/store/useProgressStore';

jest.mock('@/store/useProgressStore');

jest.mock('@/hooks/useThemeColors', () => ({
  useThemeColors: () => ({ primary: '#00f', border: '#ccc' })
}));

jest.mock('@/data/processors/dataLoader', () => ({
  lessons: Array(4).fill({})
}));

const mockedUseProgressStore = useProgressStore as jest.Mock;

describe('ProgressBar', () => {
  const renderWithProgress = (completed: number) => {
    const progress: Record<string, any> = {};
    for (let i = 0; i < completed; i++) {
      progress[`lesson-${i}`] = { completed: true };
    }

    mockedUseProgressStore.mockImplementation((selector: any) =>
      selector({ progress })
    );

    return render(<ProgressBar />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const cases = [
    { completed: 0, expected: 0 },
    { completed: 2, expected: 50 },
    { completed: 4, expected: 100 }
  ];

  test.each(cases)(
    'shows $expected% progress when $completed lessons are completed',
    ({ completed, expected }) => {
      const { getByTestId } = renderWithProgress(completed);

      const indicator = getByTestId('progress-indicator');
      expect(indicator.props.children).toBe(`${expected}%`);

      const bar = getByTestId('progress-bar-fill');
      const widthStyle = Array.isArray(bar.props.style)
        ? bar.props.style.find((s: any) => s.width)
        : bar.props.style;
      expect(widthStyle.width).toBe(`${expected}%`);
    }
  );
});

