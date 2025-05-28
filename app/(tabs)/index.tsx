import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import lessons from '@/data/lessons';
import LessonCard from '@/components/LessonCard';
import ProgressBar from '@/components/ProgressBar';
import XPNotification from '@/components/XPNotification';

export default function LearnScreen() {
  const store = useProgressStore();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showXPNotification, setShowXPNotification] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const themeColors = useThemeColors();

  // Get the current lesson based on the current lesson index
  const currentLesson = lessons[currentLessonIndex] || lessons[0];
  
  const handleSwipeLeft = () => {
    // Mark as read/dismiss and then load next card
    console.log('Swipe left - marking lesson', currentLesson.id, 'as completed');

    // Mark lesson as completed and show XP notification
    store.markAsCompleted(currentLesson.id);
    setXpGained(50);
    setShowXPNotification(true);

    // Load next card after marking as read
    if (currentLessonIndex < lessons.length - 1) {
      const newIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(newIndex);
      store.incrementDay();
    }
  };

  const handleSwipeRight = () => {
    // Bookmark the card and then load next card
    console.log('Swipe right - bookmarking lesson', currentLesson.id);

    // Toggle bookmark for the lesson
    store.toggleBookmark(currentLesson.id);

    // Load next card after bookmarking
    if (currentLessonIndex < lessons.length - 1) {
      const newIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(newIndex);
      store.incrementDay();
    }
  };

  const handleSwipeUp = () => {
    // Load next card
    if (currentLessonIndex < lessons.length - 1) {
      const newIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(newIndex);
      store.incrementDay();
    }
  };

  const handleSwipeDown = () => {
    // Go to previous card
    if (currentLessonIndex > 0) {
      const newIndex = currentLessonIndex - 1;
      setCurrentLessonIndex(newIndex);
      store.decrementDay();
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top', 'bottom']}>
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

      <XPNotification
        visible={showXPNotification}
        xpGained={xpGained}
        onComplete={() => setShowXPNotification(false)}
      />
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