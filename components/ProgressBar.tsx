import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useProgressStore } from '@/store/useProgressStore';
import lessons from '@/data/lessons';

export default function ProgressBar() {
  const progress = useProgressStore((state) => state.progress);
  const themeColors = useThemeColors();
  
  // Calculate completed lessons
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const totalLessons = lessons.length;
  const percentComplete = (completedCount / totalLessons) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <View style={[styles.progressBarContainer, { backgroundColor: themeColors.border }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${percentComplete}%`,
                backgroundColor: themeColors.primary
              }
            ]}
          />
        </View>
        <Text style={[styles.percentText, { color: themeColors.primary }]}>
          {Math.round(percentComplete)}%
        </Text>
      </View>
    </View>
  );
}

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