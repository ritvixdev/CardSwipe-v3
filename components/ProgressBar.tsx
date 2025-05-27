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
      <View style={styles.progressInfo}>
        <Text style={[styles.progressText, { color: themeColors.textSecondary }]}>
          {completedCount} of {totalLessons} completed
        </Text>
        <Text style={[styles.percentText, { color: themeColors.primary }]}>
          {Math.round(percentComplete)}%
        </Text>
      </View>
      
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
  },
  percentText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});