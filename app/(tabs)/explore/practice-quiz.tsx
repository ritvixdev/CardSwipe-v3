import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Brain, Clock, Target, Trophy, ChevronDown, ChevronRight, BookOpen } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import QuizManager from '@/components/quiz/QuizManager';
import LearningQuizManager from '@/components/quiz/LearningQuizManager';
import { getQuizzesByType, getQuizById, getPracticeQuizCategories, QuizMetadata } from '@/utils/quizLoader';

// Hierarchical category structure for practice quizzes
const categoryHierarchy = {
  'all': { label: 'All', subcategories: [] },
  'fundamentals': {
    label: 'Fundamentals',
    subcategories: ['variables', 'functions', 'data-types', 'operators']
  },
  'advanced': {
    label: 'Advanced',
    subcategories: ['async', 'closures', 'prototypes', 'modules']
  },
  'frameworks': {
    label: 'Frameworks',
    subcategories: ['react', 'vue', 'angular', 'node']
  },
  'algorithms': {
    label: 'Algorithms',
    subcategories: ['sorting', 'searching', 'recursion', 'dynamic-programming']
  },
  'web-dev': {
    label: 'Web Development',
    subcategories: ['html-css', 'dom', 'apis', 'performance']
  }
};

export default function PracticeQuizScreen() {
  const themeColors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState<'learning' | 'timed' | null>(null);

  const categories = Object.keys(categoryHierarchy);

  // Get all practice quizzes
  const allQuizzes = getQuizzesByType('practice');
  const quizMetadata: QuizMetadata[] = allQuizzes.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    category: quiz.category,
    difficulty: quiz.difficulty,
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    description: quiz.description,
    questionCount: quiz.questions.length,
    type: 'practice' as const
  }));

  const getFilteredQuizzes = () => {
    if (selectedSubcategory) {
      // Filter by subcategory - match against quiz topics/categories
      return quizMetadata.filter(quiz => {
        const quizCategory = quiz.category?.toLowerCase() || '';
        const quizTitle = quiz.title?.toLowerCase() || '';
        const subcategoryMatch = selectedSubcategory.toLowerCase().replace('-', ' ');
        return quizCategory.includes(subcategoryMatch) ||
               quizCategory.includes(selectedSubcategory.replace('-', '')) ||
               quizTitle.includes(subcategoryMatch);
      });
    } else if (selectedCategory === 'all') {
      return quizMetadata;
    } else {
      // Filter by main category - match against quiz categories
      const categoryData = categoryHierarchy[selectedCategory];
      if (categoryData && categoryData.subcategories.length > 0) {
        // If category has subcategories, show all quizzes that match the main category
        return quizMetadata.filter(quiz => {
          const quizCategory = quiz.category?.toLowerCase() || '';
          const quizTitle = quiz.title?.toLowerCase() || '';

          // Check if quiz category matches main category
          if (quizCategory.includes(selectedCategory)) return true;

          // Check if quiz category/title matches any subcategory
          return categoryData.subcategories.some(sub =>
            quizCategory.includes(sub.replace('-', ' ')) ||
            quizCategory.includes(sub.replace('-', '')) ||
            quizTitle.includes(sub.replace('-', ' '))
          );
        });
      } else {
        // Simple category match
        return quizMetadata.filter(quiz => {
          const quizCategory = quiz.category?.toLowerCase() || '';
          return quizCategory.includes(selectedCategory);
        });
      }
    }
  };

  const filteredQuizzes = getFilteredQuizzes();

  const handleCategoryPress = (category: string) => {
    const hasSubcategories = categoryHierarchy[category]?.subcategories.length > 0;

    // Always set the selected category to filter cards
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Clear subcategory selection

    if (hasSubcategories) {
      // If category has subcategories, expand/collapse the subcategory pills
      if (expandedCategory === category) {
        setExpandedCategory(null);
      } else {
        setExpandedCategory(category);
      }
    } else {
      // If no subcategories, close any expanded category
      setExpandedCategory(null);
    }
  };

  const handleSubcategoryPress = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const handleQuizPress = (quizId: string, mode: 'learning' | 'timed') => {
    setCurrentQuiz(quizId);
    setQuizMode(mode);
  };

  const handleQuizExit = () => {
    setCurrentQuiz(null);
    setQuizMode(null);
  };

  // If a quiz is selected, show the appropriate quiz interface
  if (currentQuiz && quizMode) {
    const quiz = getQuizById(currentQuiz, 'practice');
    if (quiz) {
      if (quizMode === 'learning') {
        return (
          <LearningQuizManager
            quiz={quiz}
            onExit={handleQuizExit}
            onComplete={(results) => {
              console.log('Learning quiz completed:', results);
              // You can add additional logic here like saving results
            }}
          />
        );
      } else {
        return (
          <QuizManager
            quiz={quiz}
            onExit={handleQuizExit}
            onComplete={(results) => {
              console.log('Timed quiz completed:', results);
              // You can add additional logic here like saving results
            }}
          />
        );
      }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return themeColors.textSecondary;
    }
  };

  const QuizCard = ({ quiz }: { quiz: QuizMetadata }) => (
    <View style={[styles.enhancedQuizCard, { backgroundColor: themeColors.card }]}>
      {/* Header with gradient background */}
      <View style={[styles.cardHeader, { backgroundColor: getDifficultyColor(quiz.difficulty) + '15' }]}>
        <View style={styles.headerTop}>
          <View style={styles.categoryContainer}>
            <Text style={[styles.categoryLabel, { color: themeColors.primary }]}>
              {quiz.category}
            </Text>
            <View style={[styles.difficultyPill, { backgroundColor: getDifficultyColor(quiz.difficulty) }]}>
              <Text style={styles.difficultyLabel}>{quiz.difficulty.toUpperCase()}</Text>
            </View>
          </View>
          <View style={[styles.questionCountBadge, { backgroundColor: themeColors.primary + '20' }]}>
            <Brain size={14} color={themeColors.primary} />
            <Text style={[styles.questionCountText, { color: themeColors.primary }]}>
              {quiz.questionCount}
            </Text>
          </View>
        </View>

        <Text style={[styles.enhancedQuizTitle, { color: themeColors.text }]}>
          {quiz.title}
        </Text>

        <Text style={[styles.enhancedQuizDescription, { color: themeColors.textSecondary }]}>
          {quiz.description}
        </Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Clock size={14} color={getDifficultyColor(quiz.difficulty)} />
          <Text style={[styles.statChipText, { color: themeColors.text }]}>
            {quiz.timeLimit}m
          </Text>
        </View>
        <View style={styles.statChip}>
          <Target size={14} color={getDifficultyColor(quiz.difficulty)} />
          <Text style={[styles.statChipText, { color: themeColors.text }]}>
            {quiz.passingScore}%
          </Text>
        </View>
        <View style={styles.statChip}>
          <Trophy size={14} color={getDifficultyColor(quiz.difficulty)} />
          <Text style={[styles.statChipText, { color: themeColors.text }]}>
            Pass
          </Text>
        </View>
      </View>

      {/* Mode Selection */}
      <View style={styles.modeSection}>
        <Text style={[styles.modePrompt, { color: themeColors.text }]}>
          Choose your approach:
        </Text>

        <View style={styles.enhancedModeContainer}>
          <TouchableOpacity
            style={[styles.enhancedModeCard, { backgroundColor: '#f0fdf4', borderColor: '#10b981' }]}
            onPress={() => handleQuizPress(quiz.id, 'learning')}
            activeOpacity={0.8}
          >
            <View style={[styles.modeIconContainer, { backgroundColor: '#10b981' }]}>
              <BookOpen size={18} color="#ffffff" />
            </View>
            <View style={styles.enhancedModeContent}>
              <Text style={[styles.enhancedModeTitle, { color: '#10b981' }]}>Learn</Text>
              <Text style={[styles.enhancedModeSubtitle, { color: '#059669' }]}>
                No pressure
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.enhancedModeCard, { backgroundColor: '#eff6ff', borderColor: themeColors.primary }]}
            onPress={() => handleQuizPress(quiz.id, 'timed')}
            activeOpacity={0.8}
          >
            <View style={[styles.modeIconContainer, { backgroundColor: themeColors.primary }]}>
              <Clock size={18} color="#ffffff" />
            </View>
            <View style={styles.enhancedModeContent}>
              <Text style={[styles.enhancedModeTitle, { color: themeColors.primary }]}>Test</Text>
              <Text style={[styles.enhancedModeSubtitle, { color: themeColors.primary }]}>
                {quiz.timeLimit}m timer
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back button and title in scrollable content */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: themeColors.text }]}>Practice Quiz</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>Test your JavaScript knowledge</Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map((category) => {
              const categoryData = categoryHierarchy[category];
              const hasSubcategories = categoryData.subcategories.length > 0;
              const isSelected = selectedCategory === category;
              const isExpanded = expandedCategory === category;

              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: isSelected ? themeColors.primary : themeColors.card,
                    }
                  ]}
                  onPress={() => handleCategoryPress(category)}
                >
                  <View style={styles.categoryButtonContent}>
                    <Text
                      style={[
                        styles.categoryButtonText,
                        {
                          color: isSelected ? '#ffffff' : themeColors.text,
                        }
                      ]}
                    >
                      {categoryData.label}
                    </Text>
                    {hasSubcategories && (
                      <View style={styles.expandIcon}>
                        {isExpanded ? (
                          <ChevronDown size={14} color={isSelected ? '#ffffff' : themeColors.text} />
                        ) : (
                          <ChevronRight size={14} color={isSelected ? '#ffffff' : themeColors.text} />
                        )}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Subcategory Pills */}
          {expandedCategory && categoryHierarchy[expandedCategory].subcategories.length > 0 && (
            <View style={styles.subcategoryContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subcategoryContent}
              >
                {categoryHierarchy[expandedCategory].subcategories.map((subcategory) => (
                  <TouchableOpacity
                    key={subcategory}
                    style={[
                      styles.subcategoryButton,
                      {
                        backgroundColor: selectedSubcategory === subcategory ? themeColors.primary : themeColors.background,
                        borderColor: themeColors.primary,
                      }
                    ]}
                    onPress={() => handleSubcategoryPress(subcategory)}
                  >
                    <Text
                      style={[
                        styles.subcategoryButtonText,
                        {
                          color: selectedSubcategory === subcategory ? '#ffffff' : themeColors.primary,
                        }
                      ]}
                    >
                      {subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Quizzes List */}
        <View style={styles.quizzesContainer}>
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
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
    marginLeft: -4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  pageHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
  },
  categoryFilter: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryContent: {
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  categoryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  expandIcon: {
    marginLeft: 2,
  },
  subcategoryContainer: {
    marginTop: 12,
    paddingLeft: 16,
  },
  subcategoryContent: {
    paddingRight: 20,
  },
  subcategoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  subcategoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  quizzesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  // Enhanced Quiz Card Styles
  enhancedQuizCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  difficultyPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  difficultyLabel: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  questionCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questionCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  enhancedQuizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 26,
  },
  enhancedQuizDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  statChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modeSection: {
    padding: 20,
    paddingTop: 16,
  },
  modePrompt: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    opacity: 0.8,
  },
  enhancedModeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  enhancedModeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 10,
  },
  modeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enhancedModeContent: {
    flex: 1,
  },
  enhancedModeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  enhancedModeSubtitle: {
    fontSize: 11,
    opacity: 0.8,
  },

  // Legacy styles (keeping for compatibility)
  quizCard: {
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  quizHeader: {
    gap: 8,
  },
  quizTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizCategory: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
  },
  startButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modeSelectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modeContainer: {
    gap: 12,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  learningCard: {
    // Specific styles for learning card if needed
  },
  timedCard: {
    // Specific styles for timed card if needed
  },
  modeIcon: {
    marginRight: 12,
  },
  modeEmoji: {
    fontSize: 24,
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  // Legacy styles (can be removed later)
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  learningButton: {
    // Specific styles for learning button if needed
  },
  timedButton: {
    // Specific styles for timed button if needed
  },
  modeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
