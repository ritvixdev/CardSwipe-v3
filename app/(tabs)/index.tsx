import React, { useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { lessons, topics, getLessonsByTopic } from '@/data/processors/dataLoader';
import LessonCard from '@/components/LessonCard';
import LearnHeader from '@/components/LearnHeader';
import XPNotification from '@/components/XPNotification';

export default function LearnScreen() {
  const store = useProgressStore();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showXPNotification, setShowXPNotification] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('all'); // Default to all lessons
  const themeColors = useThemeColors();

  // Get filtered lessons based on selected topic
  const filteredLessons = useMemo(() => {
    return getLessonsByTopic(selectedTopic);
  }, [selectedTopic]);

  // Get the current lesson based on the current lesson index from filtered lessons
  const currentLesson = filteredLessons[currentLessonIndex] || filteredLessons[0];
  
  const handleSwipeLeft = () => {
    // Mark as read/dismiss and then load next card
    console.log('Swipe left - marking lesson', currentLesson.id, 'as completed');

    // Mark lesson as completed and show XP notification
    store.markAsCompleted(currentLesson.id);
    setXpGained(50);
    setShowXPNotification(true);

    // Load next card after marking as read (loop back to beginning if at end)
    const newIndex = (currentLessonIndex + 1) % filteredLessons.length;
    setCurrentLessonIndex(newIndex);
    if (newIndex !== 0) {
      store.incrementDay();
    }
  };

  const handleSwipeRight = () => {
    // Like the card and then load next card
    console.log('Swipe right - liking lesson', currentLesson.id);

    // Toggle like for the lesson
    store.toggleLike(currentLesson.id);

    // Load next card after liking (loop back to beginning if at end)
    const newIndex = (currentLessonIndex + 1) % filteredLessons.length;
    setCurrentLessonIndex(newIndex);
    if (newIndex !== 0) {
      store.incrementDay();
    }
  };

  const handleSwipeUp = () => {
    // Load next card (loop back to beginning if at end)
    const newIndex = (currentLessonIndex + 1) % filteredLessons.length;
    setCurrentLessonIndex(newIndex);
    if (newIndex !== 0) {
      store.incrementDay();
    }
  };

  const handleSwipeDown = () => {
    // Go to previous card (loop to end if at beginning)
    const newIndex = currentLessonIndex === 0 ? filteredLessons.length - 1 : currentLessonIndex - 1;
    setCurrentLessonIndex(newIndex);
    if (currentLessonIndex !== 0) {
      store.decrementDay();
    }
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentLessonIndex(0); // Reset to first card when changing topic
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      {/* Header with Topic Selector */}
      <LearnHeader
        topics={topics}
        selectedTopic={selectedTopic}
        onTopicSelect={handleTopicSelect}
      />

      <View style={styles.cardContainer}>
        {/* Render multiple cards for Tinder-style stacking */}
        {filteredLessons.length > 0 && [2, 1, 0].map((cardIndex) => {
          const lessonIndex = (currentLessonIndex + cardIndex) % filteredLessons.length;
          const lesson = filteredLessons[lessonIndex];
          const isTopCard = cardIndex === 0;

          return (
            <LessonCard
              key={`${lesson.id}-${cardIndex}-${selectedTopic}`}
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
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});