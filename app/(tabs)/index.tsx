import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { initializeTopics, getCardsByCategory, LearnCard, clearUnusedModules } from '@/data/processors/dataLoader';
import LessonCard from '@/components/LessonCard';
import LearnHeader from '@/components/LearnHeader';
import XPNotification from '@/components/XPNotification';
// import ComprehensivePerformanceDashboard from '@/components/ComprehensivePerformanceDashboard';
// import { memoryLeakPrevention, useMemoryLeakPrevention } from '@/utils/memoryLeakPrevention';

export default function LearnScreen() {
  const store = useProgressStore();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showXPNotification, setShowXPNotification] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('all'); // Default to all lessons
  const [topicsData, setTopicsData] = useState<any[]>([]);
  
  // Memory leak prevention
  // useMemoryLeakPrevention('LearnScreen');
  const [lessons, setLessons] = useState<LearnCard[]>([]);
  const [loading, setLoading] = useState(true);
  const themeColors = useThemeColors();

  // Load lessons for selected topic only (OPTIMIZED lazy loading)
  useEffect(() => {
    const loadLessonsForTopic = async () => {
      try {
        setLoading(true);
        console.log(`🚀 Loading lessons for topic: ${selectedTopic} (optimized)`);
        
        // First, try optimized data loader (NO static imports)
        let loadedLessons: LearnCard[] = [];
        
        if (selectedTopic === 'all' || !selectedTopic) {
          // Use data loader for fundamentals only
          loadedLessons = await getCardsByCategory('fundamentals');
          console.log(`⚡ Loaded: ${loadedLessons.length} fundamentals lessons`);
        } else {
          // Map topic to category and use data loader
          const topicCategoryMap: { [key: string]: string } = {
            'easy': 'fundamentals',
            'medium': 'data-structures', 
            'hard': 'advanced-concepts',
            'interview': 'asynchronous',
            'fundamentals': 'fundamentals'
          };
          
          const category = topicCategoryMap[selectedTopic] || 'fundamentals';
          loadedLessons = await getCardsByCategory(category);
          console.log(`⚡ Loaded: ${loadedLessons.length} lessons for ${selectedTopic} -> ${category}`);
        }
        
        // If loader failed, try traditional loader
        if (loadedLessons.length === 0) {
          console.log('🔄 Falling back to traditional loader...');
        }
        
        // Last resort: use traditional loader (this should be rare)
        if (loadedLessons.length === 0) {
          console.log('⚠️ Using traditional loader as final fallback');
          loadedLessons = await getCardsByCategory('fundamentals');
        }
        
        setLessons(loadedLessons);
        
        // Lessons loaded successfully
        if (loadedLessons.length > 0) {
          console.log(`✅ Successfully loaded ${loadedLessons.length} lessons`);
        }
        
        // Force memory cleanup
        if (global.gc) {
          setTimeout(() => {
            global.gc?.();
            console.log('🧹 Forced garbage collection after lesson load');
          }, 100);
        }
        
      } catch (error) {
        console.error('Failed to load lessons (all methods):', error);
        // Emergency fallback - load minimal data
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    loadLessonsForTopic();
  }, [selectedTopic]); // Re-load when topic changes

  // App initialization
  useEffect(() => {
    
    // Initialize EVERYTHING lazily
    const initializeApp = async () => {
      try {
        console.log('🚀 Starting OPTIMIZED initialization (no static imports)');
        
        // 1. Initialize memory leak prevention first
        // memoryLeakPrevention.initialize({
        //   memoryThreshold: 80,
        //   checkInterval: 10000,
        //   autoCleanup: true
        // });
        
        // 2. Load ONLY topics configuration (minimal data)
        const loadedTopics = await initializeTopics();
        setTopicsData(loadedTopics);
        console.log(`⚡ Loaded ${loadedTopics.length} topics (lazy)`);
        
        // 3. Force memory cleanup after initialization
        clearUnusedModules([]);
        if (global.gc) {
          global.gc();
          console.log('✨ Memory optimized after lazy initialization');
        }
        
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };
    
    initializeApp();
  }, []);

  // React Compiler handles memoization automatically - no manual useMemo needed
  const filteredLessons = lessons.length > 0 ? lessons : [];

  // Get the current lesson based on the current lesson index from filtered lessons
  const currentLesson = filteredLessons[currentLessonIndex] || filteredLessons[0];
  
  // React Compiler handles memoization - no manual useCallback needed
  const handleSwipeLeft = () => {
    // Mark as read/dismiss and then load next card
    console.log('Swipe left - marking lesson', currentLesson?.id, 'as completed');

    if (currentLesson) {
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
    }
  };

  const handleSwipeRight = () => {
    // Like the card and then load next card
    console.log('Swipe right - liking lesson', currentLesson?.id);

    if (currentLesson) {
      // Toggle like for the lesson
      store.toggleLike(currentLesson.id);

      // Load next card after liking (loop back to beginning if at end)
      const newIndex = (currentLessonIndex + 1) % filteredLessons.length;
      setCurrentLessonIndex(newIndex);
      if (newIndex !== 0) {
        store.incrementDay();
      }
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

  // Show loading indicator while lessons are being loaded
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      {/* Header with Topic Selector */}
      <LearnHeader
        topics={topicsData}
        selectedTopic={selectedTopic}
        onTopicSelect={handleTopicSelect}
      />

      <View style={styles.cardContainer}>
        {/* Render multiple cards for Tinder-style stacking with optimization */}
        {filteredLessons.length > 0 && [2, 1, 0].map((cardIndex) => {
          const lessonIndex = (currentLessonIndex + cardIndex) % filteredLessons.length;
          const lesson = filteredLessons[lessonIndex];
          const isTopCard = cardIndex === 0;

          // Optimized card key generation for better performance
          const cardKey = `${lesson.id}-${cardIndex}-${currentLessonIndex}`;

          return (
            <LessonCard
              key={cardKey}
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

      {/* Performance monitoring removed */}
      
      {/* <ComprehensivePerformanceDashboard
        visible={showComprehensiveDashboard}
        onToggle={() => {
          setShowComprehensiveDashboard(!showComprehensiveDashboard);
          // Performance monitoring removed
        }}
      /> */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});