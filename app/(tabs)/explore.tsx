import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Filter, TrendingUp, Clock, Star, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useThemeColors } from '@/hooks/useThemeColors';
import { useProgressStore } from '@/store/useProgressStore';
import { designPatterns, codingQuestions, getAllLessons, getNotes, getQuizzes, getInterviewQuestions } from '@/data/processors/dataLoader';
// Base explore cards template
const baseExploreCards = [
  {
    id: 'completed',
    title: 'Completed Lessons',
    description: 'Review your completed JavaScript lessons and track your progress',
    icon: '✅',
    color: '#10b981',
    route: '/(tabs)/explore/completed',
    category: 'permanent',
    itemCount: 0
  },
  {
    id: 'bookmarks',
    title: 'Bookmarked Lessons',
    description: 'Quick access to your saved lessons for later review',
    icon: '🔖',
    color: '#3b82f6',
    route: '/(tabs)/explore/bookmarks',
    category: 'permanent',
    itemCount: 0
  },
  {
    id: 'liked',
    title: 'Liked Lessons',
    description: 'Your favorite lessons that you enjoyed the most',
    icon: '❤️',
    color: '#ef4444',
    route: '/(tabs)/explore/liked',
    category: 'permanent',
    itemCount: 0
  },
  {
    id: 'javascript-notes',
    title: 'JavaScript Notes',
    description: 'Comprehensive notes covering all JavaScript concepts',
    icon: '📝',
    color: '#10b981',
    route: '/(tabs)/explore/javascript-notes',
    category: 'resource',
    itemCount: 0, // Will be updated dynamically
    difficulty: 'beginner',
    estimatedTime: '2 hours read'
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep',
    description: 'Common JavaScript interview questions and answers',
    icon: '💼',
    color: '#f59e0b',
    route: '/(tabs)/explore/interview-prep',
    category: 'resource',
    itemCount: 0, // Will be updated dynamically
    difficulty: 'intermediate',
    estimatedTime: '3 hours',
    isPopular: true
  },
  {
    id: 'practice-quiz',
    title: 'Practice Quiz',
    description: 'Test your JavaScript knowledge with interactive quizzes',
    icon: '🧠',
    color: '#8b5cf6',
    route: '/(tabs)/explore/practice-quiz',
    category: 'resource',
    itemCount: 0, // Will be updated dynamically
    difficulty: 'beginner',
    estimatedTime: '20 min'
  },
  {
    id: 'interview-quiz',
    title: 'Interview Quiz',
    description: 'Advanced quiz questions commonly asked in interviews',
    icon: '🎯',
    color: '#ef4444',
    route: '/(tabs)/explore/interview-quiz',
    category: 'resource',
    itemCount: 0, // Will be updated dynamically
    difficulty: 'advanced',
    estimatedTime: '30 min',
    isNew: true
  },
  {
    id: 'learning-roadmap',
    title: 'Learning Roadmap',
    description: 'Structured learning path with visual progress tracking',
    icon: '🗺️',
    color: '#3b82f6',
    route: '/(tabs)/explore/learning-roadmap',
    category: 'resource',
    itemCount: 0, // Will be updated dynamically
    difficulty: 'beginner',
    estimatedTime: 'Self-paced',
    isNew: true
  },
  {
    id: 'design-patterns',
    title: 'Design Patterns',
    description: 'Common JavaScript design patterns with examples',
    icon: '🏗️',
    color: '#6366f1',
    route: '/(tabs)/explore/design-patterns',
    category: 'resource',
    itemCount: designPatterns?.length || 0,
    difficulty: 'advanced',
    estimatedTime: '45 min read'
  },
  {
    id: 'coding-questions',
    title: 'Coding Questions',
    description: 'Algorithm challenges with detailed explanations',
    icon: '💻',
    color: '#8b5cf6',
    route: '/(tabs)/explore/coding-questions',
    category: 'resource',
    itemCount: codingQuestions?.length || 0,
    difficulty: 'intermediate',
    estimatedTime: '30 min',
    isPopular: true
  }
];

interface ExploreCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  category: 'permanent' | 'resource';
  itemCount?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

function getExploreCardsByCategory(category: 'permanent' | 'resource', dynamicCounts: {[key: string]: number}): ExploreCard[] {
  return baseExploreCards.filter(card => card.category === category).map(card => ({
    ...card,
    itemCount: dynamicCounts[card.id] !== undefined ? dynamicCounts[card.id] : card.itemCount
  }));
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 cards per row with margins
const isMobile = width < 768; // Consider devices under 768px width as mobile/tablet

export default function ExploreScreen() {
  const themeColors = useThemeColors();
  const progress = useProgressStore((state) => state.progress);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [lessons, setLessons] = useState<any[]>([]);
  const [dynamicCounts, setDynamicCounts] = useState<{[key: string]: number}>({});

  // Load lessons data and dynamic counts
  useEffect(() => {
    const loadLessons = async () => {
      try {
        const allLessons = await getAllLessons();
        setLessons(allLessons);
      } catch (error) {
        console.error('Failed to load lessons:', error);
        setLessons([]);
      }
    };
    loadLessons();
  }, []);

  // Load dynamic counts for explore categories
  useEffect(() => {
    const loadDynamicCounts = async () => {
      try {
        const [notes, quizzes, interviews, patterns, coding] = await Promise.all([
          getNotes(),
          getQuizzes(),
          getInterviewQuestions(),
          designPatterns || [],
          codingQuestions || []
        ]);
        
        setDynamicCounts({
          'javascript-notes': notes.length,
          'practice-quiz': quizzes.length,
          'interview-prep': interviews.length,
          'interview-quiz': Math.floor(interviews.length * 0.6), // Subset for advanced quiz
          'design-patterns': patterns.length,
          'coding-questions': coding.length,
          'learning-roadmap': 6 // Static for now
        });
        
        console.log('📊 Dynamic counts loaded:', {
          notes: notes.length,
          quizzes: quizzes.length,
          interviews: interviews.length,
          patterns: patterns.length,
          coding: coding.length
        });
      } catch (error) {
        console.error('Failed to load dynamic counts:', error);
      }
    };
    loadDynamicCounts();
  }, []);

  // Calculate dynamic counts for permanent cards
  // For completed: only count lessons with quizzes that have been answered correctly
  const completedCount = Object.entries(progress).filter(([lessonId, lessonProgress]) => {
    if (!lessonProgress.completed) return false;
    
    // Find the lesson data to check if it has a quiz
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.quiz) {
      // If lesson doesn't have a quiz, don't count it as completed
      return false;
    }
    
    // Only count as completed if the lesson has a quiz and was completed with a passing score
    // We assume that if it's marked as completed and has a score, the quiz was answered correctly
    return lessonProgress.score !== undefined && lessonProgress.score >= 70; // 70% passing score
  }).length;
  
  const bookmarkedCount = Object.values(progress).filter(p => p.bookmarked).length;
  const likedCount = Object.values(progress).filter(p => p.liked).length;

  // Create reactive explore cards with updated counts
  const exploreCards = baseExploreCards.map(card => {
    if (card.id === 'completed') {
      return { ...card, itemCount: completedCount };
    }
    if (card.id === 'bookmarks') {
      return { ...card, itemCount: bookmarkedCount };
    }
    if (card.id === 'liked') {
      return { ...card, itemCount: likedCount };
    }
    // Apply dynamic counts for resource cards
    if (dynamicCounts[card.id] !== undefined) {
      return { ...card, itemCount: dynamicCounts[card.id] };
    }
    return card;
  });

  const permanentCards = exploreCards.filter(card => card.category === 'permanent');
  const resourceCards = exploreCards.filter(card => card.category === 'resource');

  const handleCardPress = (card: ExploreCard) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Handle navigation based on card type
    if (card.id === 'completed') {
      router.push('/(tabs)/explore/completed');
    } else if (card.id === 'bookmarks') {
      router.push('/(tabs)/explore/bookmarks');
    } else if (card.id === 'liked') {
      router.push('/(tabs)/explore/liked');
    } else if (card.id === 'javascript-notes') {
      router.push('/(tabs)/explore/javascript-notes');
    } else if (card.id === 'interview-prep') {
      router.push('/(tabs)/explore/interview-prep');
    } else if (card.id === 'practice-quiz') {
      router.push('/(tabs)/explore/practice-quiz');
    } else if (card.id === 'interview-quiz') {
      router.push('/(tabs)/explore/interview-quiz');
    } else if (card.id === 'learning-roadmap') {
      router.push('/(tabs)/explore/learning-roadmap');
    } else if (card.id === 'design-patterns') {
      router.push('/(tabs)/explore/design-patterns');
    } else if (card.id === 'coding-questions') {
      router.push('/(tabs)/explore/coding-questions');
    } else {
      router.push(card.route as any);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return themeColors.textSecondary;
    }
  };

  const PermanentCard = ({ card }: { card: ExploreCard }) => (
    <TouchableOpacity
      style={[
        styles.permanentCard,
        isMobile && styles.permanentCardMobile,
        {
          backgroundColor: themeColors.card,
          borderColor: card.color,
        },
      ]}
      onPress={() => handleCardPress(card)}
    >
      {isMobile ? (
        // Mobile view: Only emoji and number
        <View style={styles.permanentCardMobileContent}>
          <Text style={[styles.permanentCardIconMobile, { color: card.color }]}>{card.icon}</Text>
          <Text style={[styles.countNumberMobile, { color: themeColors.text }]}>
            {card.itemCount}
          </Text>
        </View>
      ) : (
        // Desktop view: Full content
        <>
          <View style={styles.permanentCardTop}>
            <Text style={[styles.permanentCardIcon, { color: card.color }]}>{card.icon}</Text>
            <View style={styles.permanentCardCount}>
              <Text style={[styles.countNumber, { color: themeColors.text }]}>
                {card.itemCount}
              </Text>
              <Text style={[styles.countLabel, { color: themeColors.textSecondary }]}>
                items
              </Text>
            </View>
          </View>

          <View style={styles.permanentCardContent}>
            <Text style={[styles.permanentCardTitle, { color: themeColors.text }]}>
              {card.title}
            </Text>
            <Text style={[styles.permanentCardDescription, { color: themeColors.textSecondary }]}>
              {card.description}
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );

  const ResourceCard = ({ card }: { card: ExploreCard }) => (
    <TouchableOpacity
      style={[
        styles.resourceCard,
        {
          backgroundColor: themeColors.card,
          width: cardWidth,
        },
      ]}
      onPress={() => handleCardPress(card)}
    >
      {/* Card Header */}
      <View style={styles.resourceCardHeader}>
        <Text style={[styles.resourceCardIcon, { color: card.color }]}>{card.icon}</Text>
        
        {/* Badges */}
        <View style={styles.badges}>
          {card.isNew && (
            <View style={[styles.badge, { backgroundColor: '#10b981' }]}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
          {card.isPopular && (
            <View style={[styles.badge, { backgroundColor: '#f59e0b' }]}>
              <Text style={styles.badgeText}>HOT</Text>
            </View>
          )}
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.resourceCardContent}>
        <Text style={[styles.resourceCardTitle, { color: themeColors.text }]}>
          {card.title}
        </Text>
        <Text style={[styles.resourceCardDescription, { color: themeColors.textSecondary }]}>
          {card.description}
        </Text>
      </View>

      {/* Card Footer */}
      <View style={styles.resourceCardFooter}>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📚</Text>
            <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
              {card.itemCount} items
            </Text>
          </View>
          
          {card.difficulty && (
            <View style={styles.metaItem}>
              <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor(card.difficulty) }]} />
              <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
                {card.difficulty}
              </Text>
            </View>
          )}
        </View>
        
        {card.estimatedTime && (
          <View style={styles.timeContainer}>
            <Clock size={12} color={themeColors.textSecondary} />
            <Text style={[styles.timeText, { color: themeColors.textSecondary }]}>
              {card.estimatedTime}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} testID="explore-screen">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: themeColors.text }]}>Explore</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: themeColors.card }]}>
              <Search size={20} color={themeColors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: themeColors.card }]}>
              <Filter size={20} color={themeColors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Quick Access Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Quick Access
            </Text>
            <View style={styles.sectionIcon}>
              <Zap size={16} color={themeColors.primary} />
            </View>
          </View>
          
          <View style={styles.permanentCardsContainer}>
            {permanentCards?.map((card) => (
              <PermanentCard key={card.id} card={card} />
            ))}
          </View>
        </View>

        {/* Learning Resources Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Learning Resources
            </Text>
            <View style={styles.sectionIcon}>
              <TrendingUp size={16} color={themeColors.primary} />
            </View>
          </View>
          
          <View style={styles.resourceCardsContainer}>
            {resourceCards?.map((card) => (
              <ResourceCard key={card.id} card={card} />
            ))}
          </View>
        </View>

        {/* Popular This Week */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Popular This Week
            </Text>
            <View style={styles.sectionIcon}>
              <Star size={16} color={themeColors.primary} />
            </View>
          </View>
          
          <View style={styles.resourceCardsContainer}>
            {resourceCards
              ?.filter(card => card.isPopular)
              ?.map((card) => (
                <ResourceCard key={`popular-${card.id}`} card={card} />
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
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
    paddingHorizontal: 0,
    paddingBottom: 100, // Extra space for tab bar
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  sectionIcon: {
    opacity: 0.7,
  },
  permanentCardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  permanentCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    minHeight: 120,
  },
  permanentCardMobile: {
    minHeight: 80,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permanentCardMobileContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  permanentCardIconMobile: {
    fontSize: 32,
    marginBottom: 4,
  },
  countNumberMobile: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  permanentCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  permanentCardIcon: {
    fontSize: 28,
  },
  permanentCardCount: {
    alignItems: 'center',
  },
  countNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  countLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  permanentCardContent: {
    flex: 1,
  },
  permanentCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  permanentCardDescription: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
  },
  resourceCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  resourceCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  resourceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resourceCardIcon: {
    fontSize: 28,
  },
  badges: {
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resourceCardContent: {
    marginBottom: 16,
  },
  resourceCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  resourceCardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  resourceCardFooter: {
    gap: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 12,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
  },
});
