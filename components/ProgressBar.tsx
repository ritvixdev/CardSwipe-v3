import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useProgressStore } from '@/store/useProgressStore';
import { lessons } from '@/data/processors/dataLoader';

const ProgressBar = memo(function ProgressBar() {
  const progress = useProgressStore((state) => state.progress);
  const themeColors = useThemeColors();
  
  // Memoize calculations to prevent recalculation on every render
  const { completedCount, totalLessons, percentComplete } = useMemo(() => {
    const completed = Object.values(progress).filter(p => p.completed).length;
    const total = lessons.length;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      completedCount: completed,
      totalLessons: total,
      percentComplete: percent
    };
  }, [progress]);

  // Memoize progress bar styles to prevent recreation
  const progressBarStyle = useMemo(() => ([
    styles.progressBar,
    {
      width: `${percentComplete}%`,
      backgroundColor: themeColors.primary
    }
  ]), [percentComplete, themeColors.primary]);
  
  return (
    <View style={styles.container} testID="progress-bar-container">
      <View style={styles.progressRow}>
        <View style={[styles.progressBarContainer, { backgroundColor: themeColors.border }]}>
          <View
            style={progressBarStyle}
            testID="progress-bar-fill"
          />
        </View>
        <Text style={[styles.percentText, { color: themeColors.primary }]} testID="progress-indicator">
          {Math.round(percentComplete)}%
        </Text>
      </View>
    </View>
  );
});

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  percentText: {
    fontWeight: 'bold',
    fontSize: 14,
    minWidth: 40,
    textAlign: 'right',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});