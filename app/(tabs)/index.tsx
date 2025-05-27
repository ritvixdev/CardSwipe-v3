import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import lessons from '@/data/lessons';
import LessonCard from '@/components/LessonCard';
import ProgressBar from '@/components/ProgressBar';

export default function LearnScreen() {
  const { currentDay, actions } = useProgressStore();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const themeColors = useThemeColors();
  
  // Find the lesson for the current day
  const currentLesson = lessons.find(lesson => lesson.day === currentDay) || lessons[0];
  
  // Reset to the correct lesson when currentDay changes
  useEffect(() => {
    const index = lessons.findIndex(lesson => lesson.day === currentDay);
    if (index !== -1) {
      setCurrentLessonIndex(index);
    }
  }, [currentDay]);
  
  const handleSwipeLeft = () => {
    // Mark as read
    actions.markAsCompleted(currentLesson.id);
  };
  
  const handleSwipeRight = () => {
    // Bookmark
    actions.toggleBookmark(currentLesson.id);
  };
  
  const handleSwipeUp = () => {
    // Go to next lesson
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      actions.incrementDay();
    }
  };
  
  const handleSwipeDown = () => {
    // Go to previous lesson
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      actions.decrementDay();
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <View style={styles.progressContainer}>
        <ProgressBar />
      </View>
      
      <View style={styles.cardContainer}>
        <LessonCard
          lesson={currentLesson}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onSwipeUp={handleSwipeUp}
          onSwipeDown={handleSwipeDown}
        />
      </View>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});