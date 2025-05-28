import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useProgressStore } from '@/store/useProgressStore';
import lessons from '@/data/lessons';
import { Bookmark, Check, ArrowLeft, ArrowRight } from 'lucide-react-native';
import QuizCard from '@/components/QuizCard';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams();
  const lessonId = parseInt(id as string);
  
  const progress = useProgressStore((state) => state.progress);
  const markAsCompleted = useProgressStore((state) => state.markAsCompleted);
  const toggleBookmark = useProgressStore((state) => state.toggleBookmark);
  const themeColors = useThemeColors();
  const themeMode = useThemeStore((state) => state.mode);
  
  const lesson = lessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.error }]}>Lesson not found</Text>
      </View>
    );
  }
  
  const lessonProgress = progress[lessonId] || { completed: false, bookmarked: false };
  
  const handleMarkAsCompleted = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    markAsCompleted(lessonId);
  };

  const handleToggleBookmark = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleBookmark(lessonId);
  };
  
  // Find previous and next lessons
  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.dayBadge, { backgroundColor: themeColors.primary }]}>
            <Text style={styles.dayText}>DAY {lesson.day}</Text>
          </View>
          <Text style={[styles.title, { color: themeColors.text }]}>{lesson.title}</Text>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>{lesson.summary}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { backgroundColor: themeColors.card, borderColor: themeColors.border },
              lessonProgress.completed && { 
                backgroundColor: themeColors.success,
                borderColor: themeColors.success
              }
            ]}
            onPress={handleMarkAsCompleted}
          >
            <Check size={20} color={lessonProgress.completed ? '#fff' : themeColors.text} />
            <Text style={[
              styles.actionText,
              { color: themeColors.text },
              lessonProgress.completed && { color: '#fff' }
            ]}>
              {lessonProgress.completed ? 'Completed' : 'Mark as Completed'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { backgroundColor: themeColors.card, borderColor: themeColors.border },
              lessonProgress.bookmarked && { 
                backgroundColor: themeColors.primary,
                borderColor: themeColors.primary
              }
            ]}
            onPress={handleToggleBookmark}
          >
            <Bookmark 
              size={20} 
              color={lessonProgress.bookmarked ? '#fff' : themeColors.text}
              fill={lessonProgress.bookmarked ? '#fff' : 'transparent'}
            />
            <Text style={[
              styles.actionText,
              { color: themeColors.text },
              lessonProgress.bookmarked && { color: '#fff' }
            ]}>
              {lessonProgress.bookmarked ? 'Bookmarked' : 'Bookmark'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Lesson Details</Text>
          <Text style={[styles.detailsText, { color: themeColors.textSecondary }]}>{lesson.details}</Text>
          
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Code Example</Text>
          <View style={[
            styles.codeBlock, 
            { backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)' }
          ]}>
            <Text style={[
              styles.codeText, 
              { color: themeMode === 'dark' ? '#e2e2e2' : '#333333' }
            ]}>
              {lesson.codeExample}
            </Text>
          </View>
          
          {lesson.quiz && (
            <QuizCard quiz={lesson.quiz} lessonId={lessonId} />
          )}
        </View>
        
        <View style={styles.navigation}>
          {prevLesson ? (
            <TouchableOpacity 
              style={[styles.navButton, { backgroundColor: themeColors.card }]}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <ArrowLeft size={20} color={themeColors.text} />
              <View style={styles.navContent}>
                <Text style={[styles.navLabel, { color: themeColors.textSecondary }]}>Previous</Text>
                <Text style={[styles.navTitle, { color: themeColors.text }]} numberOfLines={1}>
                  Day {prevLesson.day}: {prevLesson.title}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          
          {nextLesson ? (
            <TouchableOpacity 
              style={[styles.navButton, styles.navButtonRight, { backgroundColor: themeColors.card }]}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <View style={styles.navContent}>
                <Text style={[styles.navLabel, { color: themeColors.textSecondary }]}>Next</Text>
                <Text style={[styles.navTitle, { color: themeColors.text }]} numberOfLines={1}>
                  Day {nextLesson.day}: {nextLesson.title}
                </Text>
              </View>
              <ArrowRight size={20} color={themeColors.text} />
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  dayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  dayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 24,
  },
  detailsText: {
    fontSize: 16,
    lineHeight: 24,
  },
  codeBlock: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    maxWidth: '48%',
  },
  navButtonRight: {
    justifyContent: 'flex-end',
  },
  navContent: {
    marginHorizontal: 8,
  },
  navLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 24,
  },
});