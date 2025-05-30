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
import { ArrowLeft, Briefcase, Code, MessageCircle, Star, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { interviewQuestions, getInterviewQuestionsByCategory, interviewCategories } from '@/data/processors/dataLoader';

// Hierarchical category structure for interview questions
const categoryHierarchy = {
  'all': { label: 'All', subcategories: [] },
  'technical': {
    label: 'Technical',
    subcategories: ['algorithms', 'data-structures', 'system-design', 'coding-challenges']
  },
  'behavioral': {
    label: 'Behavioral',
    subcategories: ['leadership', 'teamwork', 'problem-solving', 'communication']
  },
  'javascript': {
    label: 'JavaScript',
    subcategories: ['fundamentals', 'async', 'frameworks', 'testing']
  },
  'frontend': {
    label: 'Frontend',
    subcategories: ['html-css', 'react', 'performance', 'accessibility']
  },
  'backend': {
    label: 'Backend',
    subcategories: ['apis', 'databases', 'security', 'scalability']
  }
};

export default function InterviewPrepScreen() {
  const themeColors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const categories = Object.keys(categoryHierarchy);

  const getFilteredQuestions = () => {
    if (selectedSubcategory) {
      // Filter by subcategory - match against question topics/tags
      return interviewQuestions.filter(question => {
        const questionTopics = question.topic?.toLowerCase() || '';
        const questionCategory = question.category?.toLowerCase() || '';
        const subcategoryMatch = selectedSubcategory.toLowerCase().replace('-', ' ');
        return questionTopics.includes(subcategoryMatch) ||
               questionTopics.includes(selectedSubcategory.replace('-', '')) ||
               questionCategory.includes(selectedSubcategory);
      });
    } else if (selectedCategory === 'all') {
      return interviewQuestions;
    } else {
      // Filter by main category - match against question categories
      const categoryData = categoryHierarchy[selectedCategory];
      if (categoryData && categoryData.subcategories.length > 0) {
        // If category has subcategories, show all questions that match any subcategory
        return interviewQuestions.filter(question => {
          const questionCategory = question.category?.toLowerCase() || '';
          const questionTopics = question.topic?.toLowerCase() || '';

          // Check if question category matches
          if (questionCategory.includes(selectedCategory)) return true;

          // Check if question topics match any subcategory
          return categoryData.subcategories.some(sub =>
            questionTopics.includes(sub.replace('-', ' ')) ||
            questionTopics.includes(sub.replace('-', '')) ||
            questionCategory.includes(sub)
          );
        });
      } else {
        // Simple category match
        return interviewQuestions.filter(question => {
          const questionCategory = question.category?.toLowerCase() || '';
          return questionCategory.includes(selectedCategory);
        });
      }
    }
  };

  const filteredNotes = getFilteredQuestions();

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

  const handleNotePress = (noteId: string) => {
    router.push(`/(tabs)/explore/interview-prep/${noteId}` as any);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return themeColors.textSecondary;
    }
  };

  const InterviewCard = ({ note }: { note: any }) => (
    <TouchableOpacity
      style={[styles.interviewCard, { backgroundColor: themeColors.card }]}
      onPress={() => handleNotePress(note.id)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.topRow}>
          <Text style={[styles.category, { color: themeColors.primary }]}>
            {note.category}
          </Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(note.difficulty) }]}>
            <Text style={styles.difficultyText}>{note.difficulty}</Text>
          </View>
        </View>
        
        <View style={styles.questionSection}>
          <MessageCircle size={16} color={themeColors.primary} />
          <Text style={[styles.questionLabel, { color: themeColors.textSecondary }]}>
            Interview Question
          </Text>
        </View>
        
        <Text style={[styles.question, { color: themeColors.text }]}>
          {note.question}
        </Text>
      </View>

      <View style={styles.answerPreview}>
        <Text style={[styles.answerLabel, { color: themeColors.textSecondary }]}>
          Answer Preview:
        </Text>
        <Text style={[styles.answerText, { color: themeColors.text }]}>
          {note.answer.substring(0, 120)}...
        </Text>
      </View>

      {note.codeExample && (
        <View style={styles.codePreview}>
          <View style={styles.codeHeader}>
            <Code size={14} color={themeColors.textSecondary} />
            <Text style={[styles.codeLabel, { color: themeColors.textSecondary }]}>
              Code Example
            </Text>
          </View>
          <View style={[styles.codeSnippet, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.codeText, { color: themeColors.text }]}>
              {note.codeExample.substring(0, 80)}...
            </Text>
          </View>
        </View>
      )}

      <View style={styles.cardFooter}>
        <View style={styles.tagsContainer}>
          {note.tags?.slice(0, 3).map((tag: string, index: number) => (
            <View key={index} style={[styles.tag, { backgroundColor: themeColors.background }]}>
              <Text style={[styles.tagText, { color: themeColors.textSecondary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.readMore}>
          <Star size={12} color={themeColors.primary} />
          <Text style={[styles.readMoreText, { color: themeColors.primary }]}>
            Read Full Answer
          </Text>
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
            <Text style={[styles.title, { color: themeColors.text }]}>Interview Prep</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>Common questions with detailed answers</Text>
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

        {/* Interview Questions List */}
        <View style={styles.notesContainer}>
          {filteredNotes.map((note) => (
            <InterviewCard key={note.id} note={note} />
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
  notesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  interviewCard: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  cardHeader: {
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
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
  questionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  answerPreview: {
    gap: 4,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  codePreview: {
    gap: 8,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeSnippet: {
    padding: 12,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
