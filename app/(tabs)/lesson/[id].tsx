import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useProgressStore } from '@/store/useProgressStore';
import { lessons } from '@/data/processors/dataLoader';
import { Bookmark, Check, ArrowLeft, ArrowRight } from 'lucide-react-native';
import QuizCard from '@/components/QuizCard';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import CodeBlock from '@/components/CodeBlock';
import EnhancedMarkdown from '@/components/EnhancedMarkdown';
import Markdown from 'react-native-markdown-display';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams();
  const lessonId = id as string;
  const { progress, markAsCompleted, toggleBookmark } = useProgressStore();
  const themeColors = useThemeColors();
  const themeMode = useThemeStore((state) => state.mode);
  
  const lesson = lessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: themeColors.text }]}>Lesson Not Found</Text>
          </View>
        </SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: themeColors.error }]}>Lesson not found</Text>
        </View>
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
        {/* Back button and title in same row */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: themeColors.text }]}>{lesson.title}</Text>
          </View>
        </SafeAreaView>

        <View style={styles.lessonHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>{lesson.description}</Text>
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

          {/* Display contentDetails with enhanced markdown that supports syntax highlighting */}
          {lesson.contentDetails ? (
            <EnhancedMarkdown>
              {lesson.contentDetails}
            </EnhancedMarkdown>
          ) : (
            <Text style={[styles.detailsText, { color: themeColors.textSecondary }]}>{lesson.content}</Text>
          )}

          {lesson.codeExample && (
            <>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Code Example</Text>
              <CodeBlock
                code={lesson.codeExample}
                language="javascript"
                size="medium"
                allowWrapping={true}
              />
            </>
          )}

          {lesson.quiz && (
            <QuizCard quiz={lesson.quiz} lessonId={lessonId} />
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
  safeArea: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 20,
    marginLeft: -4, // Move arrow closer to left edge
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for tab bar
  },
  lessonHeader: {
    marginBottom: 24,
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
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  codeControls: {
    flexDirection: 'row',
    gap: 6,
    marginRight: 12,
  },
  codeButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  codeFileName: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeContent: {
    flexDirection: 'row',
    padding: 16,
  },
  lineNumbers: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(128, 128, 128, 0.2)',
    marginRight: 12,
  },
  lineNumber: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'right',
    minWidth: 24,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
