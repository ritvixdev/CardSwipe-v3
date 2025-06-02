import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Brain, Clock, Target, Trophy, Briefcase, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import QuizManager from '@/components/quiz/QuizManager';
import LearningQuizManager from '@/components/quiz/LearningQuizManager';
import { getQuizzesByType, getQuizById, QuizMetadata } from '@/utils/quizLoader';

// Hierarchical category structure for interview quizzes
const categoryHierarchy = {
  'all': { label: 'All', subcategories: [] },
  'technical': {
    label: 'Technical',
    subcategories: ['algorithms', 'data-structures', 'system-design', 'coding']
  },
  'javascript': {
    label: 'JavaScript',
    subcategories: ['fundamentals', 'async', 'frameworks', 'testing']
  },
  'frontend': {
    label: 'Frontend',
    subcategories: ['react', 'css', 'performance', 'accessibility']
  },
  'behavioral': {
    label: 'Behavioral',
    subcategories: ['leadership', 'teamwork', 'problem-solving', 'communication']
  }
};

// Modern Mode Button Component (same as Practice Quiz)
interface ModernModeButtonProps {
  mode: 'start';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  gradientColors: string[];
  glowColor: string;
}

const ModernModeButton: React.FC<ModernModeButtonProps> = ({
  mode,
  title,
  subtitle,
  icon,
  onPress,
  gradientColors,
  glowColor,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: false,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animatedGlowStyle = {
    shadowOpacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.15, 0.4],
    }),
    elevation: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [4, 8],
    }),
  };

  return (
    <Animated.View
      style={[
        styles.modernModeButton,
        { transform: [{ scale: scaleAnim }] },
        animatedGlowStyle,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={styles.modernButtonTouchable}
        >
          <View style={styles.modernButtonContent}>
            <View style={[styles.modernIconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
              {icon}
            </View>
            <View style={styles.modernTextContainer}>
              <Text style={[styles.modernModeTitle, { color: '#ffffff' }]}>{title}</Text>
              {subtitle && (
                <Text style={[styles.modernModeSubtitle, { color: 'rgba(255, 255, 255, 0.95)' }]}>
                  {subtitle}
                </Text>
              )}
            </View>
            <View style={[styles.modernArrowContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Text style={styles.modernArrow}>→</Text>
            </View>
          </View>
          <Animated.View
            style={[
              styles.modernButtonGlow,
              {
                backgroundColor: glowColor,
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 0.5],
                }),
              },
            ]}
          />
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

export default function InterviewQuizScreen() {
  const themeColors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState<'learning' | 'timed' | null>(null);

  const categories = Object.keys(categoryHierarchy);

  // Get all interview quizzes
  const allQuizzes = getQuizzesByType('interview');
  const quizMetadata: QuizMetadata[] = allQuizzes.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    category: quiz.category,
    difficulty: quiz.difficulty,
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    description: quiz.description,
    questionCount: quiz.questions.length,
    type: 'interview' as const
  }));

  const getFilteredQuizzes = () => {
    if (selectedSubcategory) {
      // Filter by subcategory - match against quiz categories/titles
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

  const handleQuizPress = (quizId: string) => {
    setCurrentQuiz(quizId);
    setQuizMode('timed'); // Interview quizzes are typically timed
  };

  const handleQuizExit = () => {
    setCurrentQuiz(null);
    setQuizMode(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#059669'; // Less vibrant green
      case 'medium': return '#d97706'; // Less vibrant orange
      case 'hard': return '#dc2626'; // Less vibrant red
      default: return themeColors.textSecondary;
    }
  };

  const getButtonGradientColors = (difficulty: string) => {
    const isDark = themeColors.background === '#121212';

    switch (difficulty) {
      case 'easy':
        return isDark
          ? ['#047857', '#059669', '#10b981'] // Dark mode: medium-dark to lighter green
          : ['#86efac', '#10b981', '#059669']; // Light mode: light to darker green
      case 'medium':
        return isDark
          ? ['#b45309', '#d97706', '#f59e0b'] // Dark mode: medium-dark to lighter orange
          : ['#fde68a', '#fbbf24', '#d97706']; // Light mode: light to darker orange
      case 'hard':
        return isDark
          ? ['#b91c1c', '#dc2626', '#ef4444'] // Dark mode: medium-dark to lighter red
          : ['#fca5a5', '#f87171', '#dc2626']; // Light mode: light to darker red
      default:
        return isDark
          ? ['#4b5563', '#6b7280', '#9ca3af'] // Dark mode: medium-dark to lighter gray
          : ['#cbd5e1', '#94a3b8', '#6b7280']; // Light mode: light to darker gray
    }
  };

  const getButtonGlowColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'rgba(16, 185, 129, 0.3)';
      case 'medium': return 'rgba(245, 158, 11, 0.3)';
      case 'hard': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(107, 114, 128, 0.3)';
    }
  };

  // If a quiz is selected, show the quiz interface
  if (currentQuiz && quizMode) {
    const quiz = getQuizById(currentQuiz, 'interview');
    if (quiz) {
      return (
        <QuizManager
          quiz={quiz}
          onExit={handleQuizExit}
          onComplete={(results) => {
            console.log('Interview quiz completed:', results);
            // You can add additional logic here like saving results
          }}
        />
      );
    }
  }

  const QuizCard = ({ quiz }: { quiz: any }) => (
    <View style={[styles.enhancedQuizCard, { backgroundColor: themeColors.card }]}>
      {/* Header with gradient background */}
      <View style={[styles.cardHeader, { backgroundColor: getDifficultyColor(quiz.difficulty) + '15' }]}>
        <View style={styles.headerTop}>
          <View style={styles.categoryContainer}>
            <Text style={[styles.categoryLabel, { color: themeColors.primary }]}>
              Interview Quiz
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

      {/* Start Button Section */}
      <View style={styles.modeSection}>
        <ModernModeButton
          mode="start"
          title="Start Quiz"
          subtitle=""
          icon={<Briefcase size={16} color="#ffffff" />}
          onPress={() => handleQuizPress(quiz.id)}
          gradientColors={getButtonGradientColors(quiz.difficulty)}
          glowColor={getButtonGlowColor(quiz.difficulty)}
        />
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
            <Text style={[styles.title, { color: themeColors.text }]}>Interview Quiz</Text>
          </View>
        </SafeAreaView>

        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>
            Practice with real interview questions
          </Text>
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
    marginBottom: 12,
  },
  quizCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  quizHeader: {
    gap: 12,
  },
  quizTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
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
  companiesSection: {
    gap: 8,
    marginTop: 8,
  },
  companiesLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  companiesList: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  companyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  companyText: {
    fontSize: 11,
    fontWeight: '500',
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  topicsSection: {
    gap: 8,
  },
  topicsLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  topicsList: {
    gap: 4,
  },
  topicItem: {
    fontSize: 12,
    lineHeight: 16,
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
  // Modern Button Styles (same as Practice Quiz)
  modernModeButton: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 2,
    height: 60,
    maxHeight: 60,
  },
  modernButtonTouchable: {
    width: '100%',
    height: '100%',
  },
  gradientBackground: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  modernButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingVertical: 12,
    gap: 10,
    zIndex: 2,
    height: '100%',
  },
  modernIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modernModeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 1,
    textAlign: 'center',
  },
  modernModeSubtitle: {
    fontSize: 11,
    lineHeight: 14,
  },
  modernArrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernArrow: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modernButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.4,
  },
});
