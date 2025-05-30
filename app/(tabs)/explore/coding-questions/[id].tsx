import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Code, Lightbulb, Target, Clock, Brain } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import CodeBlock from '@/components/CodeBlock';
import { getCodingQuestionById, CodingQuestion } from '@/data/processors/dataLoader';

export default function CodingQuestionDetailScreen() {
  const themeColors = useThemeColors();
  const { id } = useLocalSearchParams();

  const question = getCodingQuestionById(id as string);
  
  if (!question) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.text }]}>
          Question not found
        </Text>
      </View>
    );
  }

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
            <Text style={[styles.title, { color: themeColors.text }]}>{question.title}</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>
            {question.description}
          </Text>
          
          <View style={styles.badges}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(question.category) }]}>
              <Text style={styles.badgeText}>{question.category}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(question.difficulty) }]}>
              <Text style={styles.badgeText}>{question.difficulty}</Text>
            </View>
          </View>

          <View style={styles.complexityInfo}>
            <View style={styles.complexityItem}>
              <Clock size={16} color={themeColors.textSecondary} />
              <Text style={[styles.complexityText, { color: themeColors.textSecondary }]}>
                Time: {question.timeComplexity}
              </Text>
            </View>
            <View style={styles.complexityItem}>
              <Target size={16} color={themeColors.textSecondary} />
              <Text style={[styles.complexityText, { color: themeColors.textSecondary }]}>
                Space: {question.spaceComplexity}
              </Text>
            </View>
          </View>
        </View>

        {/* Problem Statement */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <View style={styles.sectionHeader}>
            <Brain size={20} color={themeColors.primary} />
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Problem Statement
            </Text>
          </View>
          <Text style={[styles.problemText, { color: themeColors.textSecondary }]}>
            {question.question}
          </Text>
        </View>

        {/* Solution Code */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <View style={styles.sectionHeader}>
            <Code size={20} color={themeColors.primary} />
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Solution
            </Text>
          </View>

          <CodeBlock
            code={question.codeExample}
            language="javascript"
            size="medium"
          />
        </View>

        {/* Explanation */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <View style={styles.sectionHeader}>
            <Lightbulb size={20} color={themeColors.primary} />
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Explanation
            </Text>
          </View>
          <Text style={[styles.explanationText, { color: themeColors.textSecondary }]}>
            {question.explanation}
          </Text>
        </View>

        {/* Variations */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Problem Variations
          </Text>
          {question.variations.map((variation: string, index: number) => (
            <Text key={index} style={[styles.variationText, { color: themeColors.textSecondary }]}>
              • {variation}
            </Text>
          ))}
        </View>

        {/* Related Problems */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Related Problems
          </Text>
          {question.relatedProblems.map((problem: string, index: number) => (
            <Text key={index} style={[styles.relatedText, { color: themeColors.primary }]}>
              • {problem}
            </Text>
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
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  problemText: {
    fontSize: 14,
    lineHeight: 22,
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
  explanationText: {
    fontSize: 14,
    lineHeight: 22,
  },
  hintText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  variationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  relatedText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
