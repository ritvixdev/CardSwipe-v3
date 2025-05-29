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
import { ArrowLeft, Briefcase, Code, MessageCircle, Star } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { interviewQuestions, getInterviewQuestionsByCategory, interviewCategories } from '@/data/processors/dataLoader';

export default function InterviewPrepScreen() {
  const themeColors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...interviewCategories];

  const filteredNotes = selectedCategory === 'all'
    ? interviewQuestions
    : getInterviewQuestionsByCategory(selectedCategory);

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
  categoryButtonText: {
    fontSize: 14,
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
