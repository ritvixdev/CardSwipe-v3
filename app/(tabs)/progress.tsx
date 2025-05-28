import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useProgressStore } from '@/store/useProgressStore';
import lessons from '@/data/lessons';
import ProgressBar from '@/components/ProgressBar';
import StatsCard from '@/components/StatsCard';
import { Calendar, CheckCircle2 } from 'lucide-react-native';

export default function ProgressScreen() {
  const progress = useProgressStore((state) => state.progress);
  const themeColors = useThemeColors();
  
  // Calculate completed lessons
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const totalLessons = lessons.length;
  
  // Group lessons by completion status
  const completedLessons = lessons.filter(lesson => progress[lesson.id]?.completed);
  const remainingLessons = lessons.filter(lesson => !progress[lesson.id]?.completed);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top', 'bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>Your Progress</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Track your JavaScript learning journey</Text>
        </View>
        
        <StatsCard />
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Overall Progress</Text>
          <ProgressBar />
          
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={[styles.progressStatValue, { color: themeColors.text }]}>{completedCount}</Text>
              <Text style={[styles.progressStatLabel, { color: themeColors.textSecondary }]}>Completed</Text>
            </View>
            
            <View style={styles.progressStat}>
              <Text style={[styles.progressStatValue, { color: themeColors.text }]}>{totalLessons - completedCount}</Text>
              <Text style={[styles.progressStatLabel, { color: themeColors.textSecondary }]}>Remaining</Text>
            </View>
            
            <View style={styles.progressStat}>
              <Text style={[styles.progressStatValue, { color: themeColors.text }]}>{totalLessons}</Text>
              <Text style={[styles.progressStatLabel, { color: themeColors.textSecondary }]}>Total</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Recently Completed</Text>
          
          {completedLessons.length > 0 ? (
            <View style={styles.completedList}>
              {completedLessons.slice(0, 3).map(lesson => (
                <View 
                  key={lesson.id} 
                  style={[
                    styles.completedItem, 
                    { 
                      backgroundColor: themeColors.card,
                      borderLeftColor: themeColors.success 
                    }
                  ]}
                >
                  <CheckCircle2 size={20} color={themeColors.success} />
                  <View style={styles.completedItemContent}>
                    <Text style={[styles.completedItemTitle, { color: themeColors.text }]}>
                      Day {lesson.day}: {lesson.title}
                    </Text>
                    <Text style={[styles.completedItemDate, { color: themeColors.textSecondary }]}>
                      {progress[lesson.id]?.lastViewed 
                        ? new Date(progress[lesson.id]?.lastViewed!).toLocaleDateString() 
                        : 'Recently'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: themeColors.card }]}>
              <Calendar size={32} color={themeColors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
                You haven't completed any lessons yet.
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Up Next</Text>
          
          {remainingLessons.length > 0 ? (
            <View style={styles.upNextList}>
              {remainingLessons.slice(0, 3).map(lesson => (
                <View key={lesson.id} style={[styles.upNextItem, { backgroundColor: themeColors.card }]}>
                  <Text style={[styles.upNextItemDay, { color: themeColors.primary }]}>DAY {lesson.day}</Text>
                  <Text style={[styles.upNextItemTitle, { color: themeColors.text }]}>{lesson.title}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: themeColors.card }]}>
              <CheckCircle2 size={32} color={themeColors.success} />
              <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
                Congratulations! You've completed all lessons.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  progressStat: {
    alignItems: 'center',
    flex: 1,
  },
  progressStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressStatLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  completedList: {
    gap: 12,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
  },
  completedItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  completedItemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  completedItemDate: {
    fontSize: 13,
    marginTop: 4,
  },
  upNextList: {
    gap: 12,
  },
  upNextItem: {
    borderRadius: 12,
    padding: 16,
  },
  upNextItemDay: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  upNextItemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
});