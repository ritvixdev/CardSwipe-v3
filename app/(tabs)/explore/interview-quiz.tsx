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
import { ArrowLeft, Brain, Clock, Target, Trophy, Briefcase, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import QuizManager from '@/components/quiz/QuizManager';
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

// Interview quiz categories data
const interviewQuizCategories = [
  {
    id: 'js-fundamentals',
    title: 'JavaScript Fundamentals',
    description: 'Core JavaScript concepts asked in interviews',
    difficulty: 'medium',
    questionCount: 15,
    timeLimit: 20,
    passingScore: 70,
    companies: ['Google', 'Microsoft', 'Facebook'],
    topics: ['Variables', 'Functions', 'Scope', 'Closures', 'Hoisting']
  },
  {
    id: 'async-programming',
    title: 'Async Programming',
    description: 'Promises, async/await, and callback questions',
    difficulty: 'hard',
    questionCount: 12,
    timeLimit: 18,
    passingScore: 65,
    companies: ['Netflix', 'Uber', 'Airbnb'],
    topics: ['Promises', 'Async/Await', 'Callbacks', 'Event Loop']
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    description: 'Arrays, objects, and advanced data structures',
    difficulty: 'medium',
    questionCount: 18,
    timeLimit: 25,
    passingScore: 75,
    companies: ['Amazon', 'Apple', 'Tesla'],
    topics: ['Arrays', 'Objects', 'Maps', 'Sets', 'WeakMap']
  },
  {
    id: 'algorithms',
    title: 'Algorithms',
    description: 'Common algorithmic problems from interviews',
    difficulty: 'hard',
    questionCount: 10,
    timeLimit: 30,
    passingScore: 60,
    companies: ['Google', 'Facebook', 'Amazon'],
    topics: ['Sorting', 'Searching', 'Recursion', 'Dynamic Programming']
  },
  {
    id: 'react-concepts',
    title: 'React Concepts',
    description: 'React-specific interview questions',
    difficulty: 'medium',
    questionCount: 14,
    timeLimit: 22,
    passingScore: 70,
    companies: ['Facebook', 'Netflix', 'Spotify'],
    topics: ['Components', 'Hooks', 'State', 'Props', 'Lifecycle']
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Frontend system design questions',
    difficulty: 'hard',
    questionCount: 8,
    timeLimit: 35,
    passingScore: 65,
    companies: ['Google', 'Uber', 'Twitter'],
    topics: ['Scalability', 'Performance', 'Architecture', 'APIs']
  }
];

export default function InterviewQuizScreen() {
  const themeColors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);

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
      // Filter by subcategory - match against quiz topics/titles
      return quizMetadata.filter(quiz => {
        const quizTitle = quiz.title?.toLowerCase() || '';
        const quizCategory = quiz.category?.toLowerCase() || '';
        const subcategoryMatch = selectedSubcategory.toLowerCase().replace('-', ' ');
        return quizTitle.includes(subcategoryMatch) ||
               quizTitle.includes(selectedSubcategory.replace('-', '')) ||
               quizCategory.includes(subcategoryMatch);
      });
    } else if (selectedCategory === 'all') {
      return quizMetadata;
    } else {
      // Filter by main category - match against quiz titles and categories
      const categoryData = categoryHierarchy[selectedCategory];
      if (categoryData && categoryData.subcategories.length > 0) {
        // If category has subcategories, show all quizzes that match the main category
        return quizMetadata.filter(quiz => {
          const quizTitle = quiz.title?.toLowerCase() || '';
          const quizCategory = quiz.category?.toLowerCase() || '';

          // Check if quiz title matches main category
          if (quizTitle.includes(selectedCategory)) return true;

          // Check if quiz title/category match any subcategory
          return categoryData.subcategories.some(sub =>
            quizTitle.includes(sub.replace('-', ' ')) ||
            quizTitle.includes(sub.replace('-', '')) ||
            quizCategory.includes(sub.replace('-', ' '))
          );
        });
      } else {
        // Simple category match
        return quizMetadata.filter(quiz => {
          const quizTitle = quiz.title?.toLowerCase() || '';
          return quizTitle.includes(selectedCategory);
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
  };

  const handleQuizExit = () => {
    setCurrentQuiz(null);
  };

  // If a quiz is selected, show the quiz interface
  if (currentQuiz) {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return themeColors.textSecondary;
    }
  };

  const QuizCard = ({ quiz }: { quiz: QuizMetadata }) => (
    <TouchableOpacity
      style={[styles.quizCard, { backgroundColor: themeColors.card }]}
      onPress={() => handleQuizPress(quiz.id)}
    >
      <View style={styles.quizHeader}>
        <View style={styles.quizTopRow}>
          <View style={styles.quizCategory}>
            <Briefcase size={16} color={themeColors.primary} />
            <Text style={[styles.categoryText, { color: themeColors.primary }]}>
              Interview Quiz
            </Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) }]}>
            <Text style={styles.difficultyText}>{quiz.difficulty}</Text>
          </View>
        </View>

        <Text style={[styles.quizTitle, { color: themeColors.text }]}>
          {quiz.title}
        </Text>

        <Text style={[styles.quizDescription, { color: themeColors.textSecondary }]}>
          {quiz.description}
        </Text>
      </View>

      <View style={styles.quizStats}>
        <View style={styles.statItem}>
          <Brain size={16} color={themeColors.primary} />
          <Text style={[styles.statText, { color: themeColors.text }]}>
            {quiz.questionCount} Questions
          </Text>
        </View>

        <View style={styles.statItem}>
          <Clock size={16} color={themeColors.textSecondary} />
          <Text style={[styles.statText, { color: themeColors.textSecondary }]}>
            {quiz.timeLimit} min
          </Text>
        </View>

        <View style={styles.statItem}>
          <Target size={16} color={themeColors.success || '#10b981'} />
          <Text style={[styles.statText, { color: themeColors.textSecondary }]}>
            {quiz.passingScore}% to pass
          </Text>
        </View>
      </View>

      <View style={styles.quizFooter}>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, { color: themeColors.textSecondary }]}>
            Not started
          </Text>
        </View>

        <View style={[styles.startButton, { backgroundColor: themeColors.primary }]}>
          <Text style={styles.startButtonText}>Start Quiz</Text>
        </View>
      </View>
    </TouchableOpacity>
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
});
