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
import { ArrowLeft, Code, Lightbulb, Target, Clock, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { codingQuestions, CodingQuestion, getCodingQuestionsByCategory, getCodingQuestionsByDifficulty } from '@/data/processors/dataLoader';

// Hierarchical category structure for coding questions
const categoryHierarchy = {
  'all': { label: 'All', subcategories: [] },
  'arrays': {
    label: 'Arrays',
    subcategories: ['sorting', 'searching', 'two-pointers', 'sliding-window']
  },
  'strings': {
    label: 'Strings',
    subcategories: ['manipulation', 'pattern-matching', 'palindromes', 'anagrams']
  },
  'dynamic-programming': {
    label: 'Dynamic Programming',
    subcategories: ['memoization', 'tabulation', 'optimization', 'sequences']
  },
  'trees': {
    label: 'Trees',
    subcategories: ['binary-trees', 'bst', 'traversal', 'balanced-trees']
  },
  'graphs': {
    label: 'Graphs',
    subcategories: ['dfs', 'bfs', 'shortest-path', 'topological-sort']
  }
};

// Use JSON data instead of hardcoded data
const codingQuestionsData = codingQuestions;

export default function CodingQuestionsScreen() {
  const themeColors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const categories = Object.keys(categoryHierarchy);

  const getFilteredQuestions = () => {
    if (selectedSubcategory) {
      // Filter by subcategory - match against question topics/categories
      return codingQuestionsData.filter(question => {
        const questionCategory = question.category?.toLowerCase() || '';
        const subcategoryMatch = selectedSubcategory.toLowerCase().replace('-', ' ');
        return questionCategory.includes(subcategoryMatch) ||
               questionCategory.includes(selectedSubcategory.replace('-', ''));
      });
    } else if (selectedCategory === 'all') {
      return codingQuestionsData;
    } else {
      // Filter by main category - match against question categories
      const categoryData = categoryHierarchy[selectedCategory];
      if (categoryData && categoryData.subcategories.length > 0) {
        // If category has subcategories, show all questions that match the main category
        return codingQuestionsData.filter(question => {
          const questionCategory = question.category?.toLowerCase() || '';

          // Check if question category matches main category
          if (questionCategory.includes(selectedCategory)) return true;

          // Check if question category matches any subcategory
          return categoryData.subcategories.some(sub =>
            questionCategory.includes(sub.replace('-', ' ')) ||
            questionCategory.includes(sub.replace('-', ''))
          );
        });
      } else {
        // Simple category match
        return codingQuestionsData.filter(question => {
          const questionCategory = question.category?.toLowerCase() || '';
          return questionCategory.includes(selectedCategory);
        });
      }
    }
  };

  const filteredQuestions = getFilteredQuestions();

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return themeColors.textSecondary;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Arrays': return '#8b5cf6';
      case 'Strings': return '#06b6d4';
      case 'Dynamic Programming': return '#f59e0b';
      case 'Trees': return '#10b981';
      default: return themeColors.primary;
    }
  };

  const QuestionCard = ({ question }: { question: CodingQuestion }) => {
    return (
      <View style={styles.questionContainer}>
        <TouchableOpacity
          style={[styles.questionCard, { backgroundColor: themeColors.card }]}
          onPress={() => router.push(`/(tabs)/explore/coding-questions/${question.id}` as any)}
        >
          <View style={styles.questionHeader}>
            <View style={styles.questionMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(question.category) }]}>
                <Text style={styles.categoryText}>{question.category}</Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(question.difficulty) }]}>
                <Text style={styles.difficultyText}>{question.difficulty}</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.questionTitle, { color: themeColors.text }]}>
            {question.title}
          </Text>

          <Text style={[styles.questionDescription, { color: themeColors.textSecondary }]}>
            {question.description}
          </Text>

          <View style={styles.complexityInfo}>
            <View style={styles.complexityItem}>
              <Clock size={14} color={themeColors.textSecondary} />
              <Text style={[styles.complexityText, { color: themeColors.textSecondary }]}>
                Time: {question.timeComplexity}
              </Text>
            </View>
            <View style={styles.complexityItem}>
              <Target size={14} color={themeColors.textSecondary} />
              <Text style={[styles.complexityText, { color: themeColors.textSecondary }]}>
                Space: {question.spaceComplexity}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back button and title in scrollable content */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <ArrowLeft size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: themeColors.text }]}>Coding Questions</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>
            Practice coding problems with detailed explanations
          </Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContent}
          >
            {categories?.map((category) => {
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
                {categoryHierarchy[expandedCategory]?.subcategories?.map((subcategory) => (
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

        {/* Questions List */}
        <View style={styles.questionsContainer}>
          {filteredQuestions?.map((question) => (
            <QuestionCard key={question.id} question={question} />
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
  questionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  questionContainer: {
    gap: 12,
  },
  questionCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
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
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  questionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  complexityInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  complexityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  complexityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  questionDetails: {
    padding: 20,
    borderRadius: 12,
    gap: 20,
  },
  problemSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  problemText: {
    fontSize: 14,
    lineHeight: 20,
  },
  codeSection: {
    gap: 12,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeContainer: {
    padding: 16,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  explanationSection: {
    gap: 12,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  hintsSection: {
    gap: 8,
  },
  hintText: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },
});
