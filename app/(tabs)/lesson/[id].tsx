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
            {
              backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#f8f8f8',
              borderColor: themeMode === 'dark' ? '#333' : '#e0e0e0'
            }
          ]}>
            <View style={[
              styles.codeHeader,
              {
                backgroundColor: themeMode === 'dark' ? '#2d2d30' : '#f0f0f0',
                borderBottomColor: themeMode === 'dark' ? '#333' : '#e0e0e0'
              }
            ]}>
              <View style={styles.codeControls}>
                <View style={[styles.codeButton, { backgroundColor: '#ff5f56' }]} />
                <View style={[styles.codeButton, { backgroundColor: '#ffbd2e' }]} />
                <View style={[styles.codeButton, { backgroundColor: '#27ca3f' }]} />
              </View>
              <Text style={[styles.codeFileName, { color: themeMode === 'dark' ? '#cccccc' : '#666666' }]}>

              </Text>
            </View>
            <View style={styles.codeContent}>
              <View style={styles.lineNumbers}>
                {lesson.codeExample.split('\n').map((_, index) => (
                  <Text key={index} style={[styles.lineNumber, { color: themeMode === 'dark' ? '#858585' : '#999999' }]}>
                    {index + 1}
                  </Text>
                ))}
              </View>
              <Text style={[
                styles.codeText,
                { color: themeMode === 'dark' ? '#d4d4d4' : '#333333' }
              ]}>
                {lesson.codeExample}
              </Text>
            </View>
          </View>
          
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
  scrollContent: {
    padding: 16,
    paddingBottom: 90, // Space for tab bar
  },
  header: {
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

  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 24,
  },
});