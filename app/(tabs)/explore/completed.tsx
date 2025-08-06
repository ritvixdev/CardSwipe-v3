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
import { ArrowLeft, CheckCircle, BookOpen, Clock, Star, Trophy, Search } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useThemeColors } from '@/hooks/useThemeColors';
import { useProgressStore } from '@/store/useProgressStore';
import { getAllLessons } from '@/data/processors/dataLoader';

export default function CompletedScreen() {
  const themeColors = useThemeColors();
  const progress = useProgressStore((state) => state.progress);
  const totalXP = useProgressStore((state) => state.xp);
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

  const completedLessons = lessons.filter(lesson => {
    const lessonProgress = progress[lesson.id];
    if (!lessonProgress) return false;
    
    // Check if lesson is truly completed based on quiz requirements
    const isCompleted = lesson.quiz 
      ? (lessonProgress.score !== undefined && lessonProgress.score >= 70) // Quiz lessons need passing score
      : lessonProgress.completed; // Non-quiz lessons just need to be marked as completed
    
    return isCompleted &&
      (searchQuery === '' || 
       lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       lesson.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const completionRate = lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0;
  const quizzesCompleted = completedLessons.filter(lesson => lesson.quiz).length;

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

  const LessonCard = ({ lesson }: { lesson: any }) => {
    const lessonProgress = progress[lesson.id] || { completed: false, bookmarked: false };
    const completedDate = lessonProgress.completedAt ? new Date(lessonProgress.completedAt) : new Date();
    
    return (
      <TouchableOpacity
        style={[styles.lessonCard, { backgroundColor: themeColors.card }]}
        onPress={() => handleLessonPress(lesson.id)}
      >
        <View style={styles.lessonHeader}>
          <View style={styles.lessonInfo}>
            <View style={styles.lessonTitleRow}>
              <Text style={[styles.dayText, { color: themeColors.primary }]}>
                Day {lesson.day}
              </Text>
              <View style={[styles.completedBadge, { backgroundColor: '#10b981' }]}>
                <CheckCircle size={14} color="#ffffff" />
                <Text style={styles.completedText}>COMPLETED</Text>
              </View>
            </View>
            <Text style={[styles.lessonTitle, { color: themeColors.text }]}>
              {lesson.title}
            </Text>
          </View>
          
          <View style={styles.xpContainer}>
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            <Text style={[styles.xpText, { color: themeColors.text }]}>
              Completed
            </Text>
          </View>
        </View>

        <Text style={[styles.lessonDescription, { color: themeColors.textSecondary }]}>
          {lesson.description}
        </Text>

        <View style={styles.lessonMeta}>
          <View style={styles.metaItem}>
            <Clock size={14} color={themeColors.textSecondary} />
            <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
              Completed {completedDate.toLocaleDateString()}
            </Text>
          </View>
          
          {lesson.quiz && (
            <View style={[styles.quizBadge, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.quizText}>QUIZ PASSED</Text>
            </View>
          )}
        </View>

        {/* Completion Indicator */}
        <View style={styles.performanceContainer}>
          <View style={styles.performanceBar}>
            <View 
              style={[
                styles.performanceFill,
                { 
                  backgroundColor: '#10b981',
                  width: '100%'
                }
              ]}
            />
          </View>
          <Text style={[styles.performanceText, { color: themeColors.textSecondary }]}>
            {lesson.quiz ? 'Quiz Completed' : 'Lesson Completed'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Show loading state while lessons are being loaded
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: themeColors.text, fontSize: 16 }]}>Loading completed lessons...</Text>
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
            Completed Lessons
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {completedLessons.length} lessons mastered
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
        {completedLessons.length > 0 ? (
          <>
            {/* Achievement Stats */}
            <View style={[styles.achievementContainer, { backgroundColor: themeColors.card }]}>
              <View style={styles.achievementHeader}>
                <Trophy size={24} color="#f59e0b" />
                <Text style={[styles.achievementTitle, { color: themeColors.text }]}>
                  Learning Achievement
                </Text>
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <CheckCircle size={20} color="#10b981" />
                  <Text style={[styles.statValue, { color: themeColors.text }]}>
                    {completedLessons.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                    Completed
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <Star size={20} color="#f59e0b" />
                  <Text style={[styles.statValue, { color: themeColors.text }]}>
                    {totalXP}
                  </Text>
                  <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                    Total XP
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <BookOpen size={20} color={themeColors.primary} />
                  <Text style={[styles.statValue, { color: themeColors.text }]}>
                    {quizzesCompleted}
                  </Text>
                  <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                    Quizzes
                  </Text>
                </View>
              </View>

              {/* Progress Visualization */}
              <View style={styles.progressVisualization}>
                <Text style={[styles.progressTitle, { color: themeColors.text }]}>
                  Course Progress
                </Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { backgroundColor: themeColors.border }]}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          backgroundColor: themeColors.primary,
                          width: `${(completedLessons.length / lessons.length) * 100}%`
                        }
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressText, { color: themeColors.textSecondary }]}>
                    {Math.round((completedLessons.length / lessons.length) * 100)}% Complete
                  </Text>
                </View>
              </View>
            </View>

            {/* Lessons */}
            <View style={styles.lessonsContainer}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Your Completed Lessons
              </Text>
              {completedLessons
                .sort((a, b) => b.day - a.day) // Show most recent first
                .map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: themeColors.card }]}>
              <CheckCircle size={48} color={themeColors.inactive} />
            </View>
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
              No Completed Lessons Yet
            </Text>
            <Text style={[styles.emptyDescription, { color: themeColors.textSecondary }]}>
              Start learning and complete lessons to see your progress here. Each completed lesson earns you XP!
            </Text>
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: themeColors.primary }]}
              onPress={() => router.push('/(tabs)/')}
            >
              <Text style={styles.startButtonText}>Start Learning</Text>
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
  achievementContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
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
  progressVisualization: {
    marginTop: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lessonsContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
  lessonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lessonDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  performanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  performanceBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  performanceFill: {
    height: '100%',
    borderRadius: 3,
  },
  performanceText: {
    fontSize: 12,
    fontWeight: '600',
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
  startButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
