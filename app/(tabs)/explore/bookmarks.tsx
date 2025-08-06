import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Bookmark, BookOpen, Clock, Star, Search } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useThemeColors } from '@/hooks/useThemeColors';
import { useProgressStore } from '@/store/useProgressStore';
import { getAllLessons } from '@/data/processors/dataLoader';

export default function BookmarksScreen() {
  const themeColors = useThemeColors();
  const progress = useProgressStore((state) => state.progress);
  const [searchQuery, setSearchQuery] = useState('');
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load lessons on component mount
  useEffect(() => {
    const loadLessons = async () => {
      try {
        const allLessons = await getAllLessons();
        setLessons(allLessons);
      } catch (error) {
        console.error('Failed to load lessons:', error);
        setLessons([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadLessons();
  }, []);

  const bookmarkedLessons = lessons.filter(lesson => 
    progress[lesson.id]?.bookmarked &&
    (searchQuery === '' || 
     lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     lesson.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleLessonPress = (lessonId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(`/(tabs)/lesson/${lessonId}` as any);
  };

  const removeBookmark = (lessonId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    useProgressStore.getState().toggleBookmark(lessonId);
  };

  const LessonCard = ({ lesson }: { lesson: any }) => {
    const lessonProgress = progress[lesson.id] || { completed: false, bookmarked: false };
    
    return (
      <TouchableOpacity
        style={[styles.lessonCard, { backgroundColor: themeColors.card }]}
        onPress={() => handleLessonPress(lesson.id)}
      >
        <View style={styles.lessonHeader}>
          <View style={styles.lessonInfo}>
            <Text style={[styles.dayText, { color: themeColors.primary }]}>
              Day {lesson.day}
            </Text>
            <Text style={[styles.lessonTitle, { color: themeColors.text }]}>
              {lesson.title}
            </Text>
          </View>
          
          <View style={styles.lessonActions}>
            {lessonProgress.completed && (
              <View style={[styles.statusBadge, { backgroundColor: '#10b981' }]}>
                <Text style={styles.statusText}>✓</Text>
              </View>
            )}
            
            <TouchableOpacity
              style={[styles.bookmarkButton, { backgroundColor: themeColors.primary }]}
              onPress={() => removeBookmark(lesson.id)}
            >
              <Bookmark size={16} color="#ffffff" fill="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.lessonDescription, { color: themeColors.textSecondary }]}>
          {lesson.description}
        </Text>

        <View style={styles.lessonMeta}>
          <View style={styles.metaItem}>
            <Clock size={14} color={themeColors.textSecondary} />
            <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
              {lesson.estimatedTime}
            </Text>
          </View>
          
          {lesson.quiz && (
            <View style={[styles.quizBadge, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.quizText}>QUIZ</Text>
            </View>
          )}
          
          <View style={styles.metaItem}>
            <Star size={14} color="#f59e0b" />
            <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
              XP Earned
            </Text>
          </View>
        </View>


      </TouchableOpacity>
    );
  };

  // Show loading state while lessons are being loaded
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: themeColors.text, fontSize: 16 }]}>Loading bookmarked lessons...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={themeColors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Bookmarked Lessons
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {bookmarkedLessons.length} saved for later
          </Text>
        </View>

        <TouchableOpacity style={[styles.searchButton, { backgroundColor: themeColors.card }]}>
          <Search size={20} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {bookmarkedLessons.length > 0 ? (
          <>
            {/* Stats */}
            <View style={[styles.statsContainer, { backgroundColor: themeColors.card }]}>
              <View style={styles.statItem}>
                <Bookmark size={20} color={themeColors.primary} />
                <Text style={[styles.statValue, { color: themeColors.text }]}>
                  {bookmarkedLessons.length}
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  Bookmarked
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <BookOpen size={20} color={themeColors.primary} />
                <Text style={[styles.statValue, { color: themeColors.text }]}>
                  {bookmarkedLessons.filter(lesson => progress[lesson.id]?.completed).length}
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  Completed
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Star size={20} color={themeColors.primary} />
                <Text style={[styles.statValue, { color: themeColors.text }]}>
                  {bookmarkedLessons.filter(lesson => lesson.quiz).length}
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  With Quiz
                </Text>
              </View>
            </View>

            {/* Lessons */}
            <View style={styles.lessonsContainer}>
              {bookmarkedLessons?.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: themeColors.card }]}>
              <Bookmark size={48} color={themeColors.inactive} />
            </View>
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
              No Bookmarked Lessons
            </Text>
            <Text style={[styles.emptyDescription, { color: themeColors.textSecondary }]}>
              Swipe left on lessons in the main learning interface to bookmark them for later review.
            </Text>
            <TouchableOpacity
              style={[styles.exploreButton, { backgroundColor: themeColors.primary }]}
              onPress={() => router.push('/(tabs)/')}
            >
              <Text style={styles.exploreButtonText}>Start Learning</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra space for tab bar
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  lessonsContainer: {
    gap: 16,
  },
  lessonCard: {
    padding: 20,
    borderRadius: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  lessonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  quizBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quizText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 280,
  },
  exploreButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
