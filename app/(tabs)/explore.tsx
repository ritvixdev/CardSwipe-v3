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
// Temporary direct import to fix the issue
const exploreCards = [
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
    id: 'javascript-notes',
    title: 'JavaScript Notes',
    description: 'Essential concepts with examples and code snippets',
    icon: '📚',
    color: '#8b5cf6',
    route: '/(tabs)/explore/javascript-notes',
    category: 'resource',
    itemCount: 8,
    difficulty: 'intermediate',
    estimatedTime: '20 min read',
    isPopular: true
  },
  {
    id: 'practice-quiz',
    title: 'Practice Quiz',
    description: 'Interactive quizzes to test your JavaScript knowledge',
    icon: '🧠',
    color: '#10b981',
    route: '/(tabs)/explore/practice-quiz',
    category: 'resource',
    itemCount: 12,
    difficulty: 'beginner',
    estimatedTime: '15 min',
    isNew: true
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep',
    description: 'Common JavaScript interview questions with detailed answers',
    icon: '💼',
    color: '#f59e0b',
    route: '/(tabs)/explore/interview-prep',
    category: 'resource',
    itemCount: 15,
    difficulty: 'intermediate',
    estimatedTime: '30 min read',
    isPopular: true
  },
  {
    id: 'interview-quiz',
    title: 'Interview Quiz',
    description: 'Practice with real interview questions and scenarios',
    icon: '🎯',
    color: '#ef4444',
    route: '/(tabs)/explore/interview-quiz',
    category: 'resource',
    itemCount: 10,
    difficulty: 'advanced',
    estimatedTime: '25 min',
    isPopular: true
  },
  {
    id: 'learning-roadmap',
    title: 'Learning Roadmap',
    description: 'Structured learning path with visual progress tracking',
    icon: '🗺️',
    color: '#3b82f6',
    route: '/(tabs)/explore/learning-roadmap',
    category: 'resource',
    itemCount: 6,
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
    itemCount: 8,
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
    itemCount: 20,
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

function getExploreCardsByCategory(category: 'permanent' | 'resource'): ExploreCard[] {
  return exploreCards.filter(card => card.category === category);
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 cards per row with margins

export default function ExploreScreen() {
  const themeColors = useThemeColors();
  const progress = useProgressStore((state) => state.progress);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  // Calculate dynamic counts for permanent cards
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const bookmarkedCount = Object.values(progress).filter(p => p.bookmarked).length;

  // Update card counts
  useEffect(() => {
    const completedCard = exploreCards.find(c => c.id === 'completed');
    const bookmarksCard = exploreCards.find(c => c.id === 'bookmarks');
    
    if (completedCard) completedCard.itemCount = completedCount;
    if (bookmarksCard) bookmarksCard.itemCount = bookmarkedCount;
  }, [completedCount, bookmarkedCount]);

  const permanentCards = getExploreCardsByCategory('permanent');
  const resourceCards = getExploreCardsByCategory('resource');

  const handleCardPress = (card: ExploreCard) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Handle navigation based on card type
    if (card.id === 'completed') {
      router.push('/(tabs)/explore/completed');
    } else if (card.id === 'bookmarks') {
      router.push('/(tabs)/explore/bookmarks');
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
        {
          backgroundColor: themeColors.card,
          borderColor: card.color,
        },
      ]}
      onPress={() => handleCardPress(card)}
    >
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
            {permanentCards.map((card) => (
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
            {resourceCards.map((card) => (
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
              .filter(card => card.isPopular)
              .map((card) => (
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
