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
import { ArrowLeft, Brain, Clock, Target, Trophy } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { quizzes, getQuizzesByCategory, quizCategories } from '@/data/processors/dataLoader';

export default function PracticeQuizScreen() {
  const themeColors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...quizCategories];
  
  const filteredQuizzes = selectedCategory === 'all' 
    ? quizzes 
    : getQuizzesByCategory(selectedCategory);

  const handleQuizPress = (quizId: string) => {
    router.push(`/(tabs)/explore/practice-quiz/${quizId}` as any);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return themeColors.textSecondary;
    }
  };

  const QuizCard = ({ quiz }: { quiz: any }) => (
    <TouchableOpacity
      style={[styles.quizCard, { backgroundColor: themeColors.card }]}
      onPress={() => handleQuizPress(quiz.id)}
    >
      <View style={styles.quizHeader}>
        <View style={styles.quizTopRow}>
          <Text style={[styles.quizCategory, { color: themeColors.primary }]}>
            {quiz.category}
          </Text>
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
            {quiz.questions.length} Questions
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
            <Text style={[styles.title, { color: themeColors.text }]}>Practice Quiz</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>Test your JavaScript knowledge</Text>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: selectedCategory === category ? themeColors.primary : themeColors.card,
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  {
                    color: selectedCategory === category ? '#ffffff' : themeColors.text,
                  }
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  quizzesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
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
});
