import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Code, MessageCircle, Lightbulb, Star, Tag } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import CodeBlock from '@/components/CodeBlock';
import { getInterviewQuestionById } from '@/data/processors/dataLoader';
import ScrollableContentPage from '@/components/common/ScrollableContentPage';
import ContentSection from '@/components/common/ContentSection';
import Badge from '@/components/common/Badge';

export default function InterviewPrepDetailScreen() {
  const themeColors = useThemeColors();
  const { id } = useLocalSearchParams();
  const [question, setQuestion] = useState<any>(null);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const data = await getInterviewQuestionById(id as string);
        setQuestion(data || null);
      } catch (error) {
        console.error('Failed to load interview question:', error);
        setQuestion(null);
      }
    };
    loadQuestion();
  }, [id]);

  if (!question) {
    return (
      <ScrollableContentPage
        title="Question not found"
        backRoute="/(tabs)/explore/interview-prep"
      >
        <Text style={[styles.errorText, { color: themeColors.text }]}>Question not found</Text>
      </ScrollableContentPage>
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

  const headerContent = (
    <View style={styles.badges}>
      <Badge text={question.category} color={themeColors.primary} />
      <Badge text={question.difficulty} color={getDifficultyColor(question.difficulty)} />
    </View>
  );

  return (
    <ScrollableContentPage
      title="Interview Question"
      backRoute="/(tabs)/explore/interview-prep"
      headerContent={headerContent}
    >

      {/* Question */}
      <ContentSection
        title="Question"
        icon={<MessageCircle size={20} color={themeColors.primary} />}
      >
        <Text style={[styles.questionText, { color: themeColors.text }]}>
          {question.question}
        </Text>
      </ContentSection>

      {/* Answer */}
      <ContentSection
        title="Detailed Answer"
        icon={<Lightbulb size={20} color={themeColors.primary} />}
      >
        <Text style={[styles.answerText, { color: themeColors.text }]}>
          {question.answer}
        </Text>
      </ContentSection>

      {/* Code Example */}
      {question.codeExample && (
        <ContentSection
          title="Code Example"
          icon={<Code size={20} color={themeColors.primary} />}
        >
          <CodeBlock
            code={question.codeExample}
            language="javascript"
            size="medium"
          />
        </ContentSection>
      )}

      {/* Key Points */}
      {question.keyPoints && question.keyPoints.length > 0 && (
        <ContentSection
          title="Key Points to Remember"
          icon={<Star size={20} color={themeColors.primary} />}
        >
          {question.keyPoints.map((point: string, index: number) => (
            <View key={index} style={styles.keyPointItem}>
              <Text style={[styles.bulletPoint, { color: themeColors.primary }]}>•</Text>
              <Text style={[styles.keyPointText, { color: themeColors.text }]}>
                {point}
              </Text>
            </View>
          ))}
        </ContentSection>
      )}

      {/* Follow-up Questions */}
      {question.followUpQuestions && question.followUpQuestions.length > 0 && (
        <ContentSection title="Follow-up Questions">
          {question.followUpQuestions.map((followUp: string, index: number) => (
            <View key={index} style={styles.followUpItem}>
              <Text style={[styles.followUpNumber, { color: themeColors.primary }]}>
                {index + 1}.
              </Text>
              <Text style={[styles.followUpText, { color: themeColors.textSecondary }]}>
                {followUp}
              </Text>
            </View>
          ))}
        </ContentSection>
      )}

      {/* Tips */}
      {question.tips && question.tips.length > 0 && (
        <ContentSection title="Interview Tips">
          {question.tips.map((tip: string, index: number) => (
            <View key={index} style={styles.tipItem}>
              <Text style={[styles.tipIcon, { color: themeColors.primary }]}>💡</Text>
              <Text style={[styles.tipText, { color: themeColors.textSecondary }]}>
                {tip}
              </Text>
            </View>
          ))}
        </ContentSection>
      )}

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <ContentSection
          title="Related Topics"
          icon={<Tag size={20} color={themeColors.primary} />}
        >
          <View style={styles.tagsContainer}>
            {question.tags.map((tag: string, index: number) => (
              <View key={index} style={[styles.tag, { backgroundColor: themeColors.background }]}>
                <Text style={[styles.tagText, { color: themeColors.textSecondary }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </ContentSection>
      )}
    </ScrollableContentPage>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  keyPointText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  followUpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  followUpNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  followUpText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
