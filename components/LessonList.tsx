import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Lesson } from '@/types/lesson';
import { useProgressStore } from '@/store/useProgressStore';
import { router } from 'expo-router';
import { Bookmark, Check, ChevronRight, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface LessonListProps {
  lessons: Lesson[];
  showBookmarkedOnly?: boolean;
}

const LessonList = memo(function LessonList({ lessons, showBookmarkedOnly = false }: LessonListProps) {
  const progress = useProgressStore((state) => state.progress);
  const themeColors = useThemeColors();
  
  // Memoize filtered lessons to prevent unnecessary recalculations
  const filteredLessons = useMemo(() => {
    return showBookmarkedOnly 
      ? lessons.filter(lesson => progress[lesson.id]?.bookmarked)
      : lessons;
  }, [lessons, showBookmarkedOnly, progress]);
  
  // Memoize lesson press handler
  const handleLessonPress = useCallback((lesson: Lesson) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/lesson/${lesson.id}`);
  }, []);

  // Memoize getItemLayout for better FlatList performance
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 100, // Approximate item height
    offset: 100 * index,
    index,
  }), []);

  // Memoize keyExtractor
  const keyExtractor = useCallback((item: Lesson) => item.id.toString(), []);
  
  if (filteredLessons.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
          {showBookmarkedOnly 
            ? "You haven't bookmarked any lessons yet." 
            : "No lessons available."}
        </Text>
      </View>
    );
  }
  
  // Memoize renderItem to prevent unnecessary re-renders
  const renderItem = useCallback(({ item }: { item: Lesson }) => {
    const lessonProgress = progress[item.id] || { completed: false, bookmarked: false, liked: false };
    
    return (
      <TouchableOpacity 
        style={[
          styles.lessonItem,
          { 
            backgroundColor: themeColors.card,
            borderColor: themeColors.border
          },
          lessonProgress.completed && {
            borderLeftWidth: 4,
            borderLeftColor: themeColors.success,
          }
        ]}
        onPress={() => handleLessonPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.lessonContent}>
          <View style={[styles.dayBadge, { backgroundColor: themeColors.primary }]}>
            <Text style={styles.dayText}>DAY {item.day}</Text>
          </View>
          
          <Text style={[styles.lessonTitle, { color: themeColors.text }]}>{item.title}</Text>
          <Text style={[styles.lessonSummary, { color: themeColors.textSecondary }]} numberOfLines={2}>
            {item.summary}
          </Text>
        </View>
        
        <View style={styles.lessonActions}>
          {lessonProgress.completed && (
            <View style={styles.statusIcon}>
              <Check size={16} color={themeColors.success} />
            </View>
          )}
          
          {lessonProgress.bookmarked && (
            <View style={styles.statusIcon}>
              <Bookmark size={16} color={themeColors.primary} fill={themeColors.primary} />
            </View>
          )}
          
          {lessonProgress.liked && (
            <View style={styles.statusIcon}>
              <Heart size={16} color="#ef4444" fill="#ef4444" />
            </View>
          )}
          
          <ChevronRight size={20} color={themeColors.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  }, [progress, themeColors, handleLessonPress]);

  return (
    <FlatList
      data={filteredLessons}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContainer}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={10}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={50}

    />
  );
});

export default LessonList;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  lessonContent: {
    flex: 1,
  },
  dayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  dayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lessonSummary: {
    fontSize: 14,
  },
  lessonActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});