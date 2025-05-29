import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { lessons } from '@/data/processors/dataLoader';
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

    // Load next card after marking as read (loop back to beginning if at end)
    const newIndex = (currentLessonIndex + 1) % lessons.length;
    setCurrentLessonIndex(newIndex);
    if (newIndex !== 0) {
      store.incrementDay();
    }
  };

  const handleSwipeRight = () => {
    // Bookmark the card and then load next card
    console.log('Swipe right - bookmarking lesson', currentLesson.id);

    // Toggle bookmark for the lesson
    store.toggleBookmark(currentLesson.id);

    // Load next card after bookmarking (loop back to beginning if at end)
    const newIndex = (currentLessonIndex + 1) % lessons.length;
    setCurrentLessonIndex(newIndex);
    if (newIndex !== 0) {
      store.incrementDay();
    }
  };

  const handleSwipeUp = () => {
    // Load next card (loop back to beginning if at end)
    const newIndex = (currentLessonIndex + 1) % lessons.length;
    setCurrentLessonIndex(newIndex);
    if (newIndex !== 0) {
      store.incrementDay();
    }
  };

  const handleSwipeDown = () => {
    // Go to previous card (loop to end if at beginning)
    const newIndex = currentLessonIndex === 0 ? lessons.length - 1 : currentLessonIndex - 1;
    setCurrentLessonIndex(newIndex);
    if (currentLessonIndex !== 0) {
      store.decrementDay();
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>


      <View style={styles.progressContainer}>
        <ProgressBar />
      </View>

      <View style={styles.cardContainer}>
        {/* Render multiple cards for Tinder-style stacking */}
        {[2, 1, 0].map((cardIndex) => {
          const lessonIndex = (currentLessonIndex + cardIndex) % lessons.length;
          const lesson = lessons[lessonIndex];
          const isTopCard = cardIndex === 0;

          return (
            <LessonCard
              key={`${lesson.id}-${cardIndex}`}
              lesson={lesson}
              onSwipeLeft={isTopCard ? handleSwipeLeft : () => {}}
              onSwipeRight={isTopCard ? handleSwipeRight : () => {}}
              onSwipeUp={isTopCard ? handleSwipeUp : () => {}}
              onSwipeDown={isTopCard ? handleSwipeDown : () => {}}
              index={cardIndex}
              isTopCard={isTopCard}
            />
          );
        })}
      </View>

      <XPNotification
        visible={showXPNotification}
        xpGained={xpGained}
        onComplete={() => setShowXPNotification(false)}
      />
    </SafeAreaView>
  );
}



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
    paddingBottom: 90, // Space for tab bar
  },
});