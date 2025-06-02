import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Code, BookOpen, Lightbulb, Clock } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import CodeBlock from '@/components/CodeBlock';
import { getNoteById } from '@/data/processors/dataLoader';
import ScrollableContentPage from '@/components/common/ScrollableContentPage';
import ContentSection from '@/components/common/ContentSection';
import Badge from '@/components/common/Badge';

export default function JavaScriptNoteDetailScreen() {
  const themeColors = useThemeColors();
  const { id } = useLocalSearchParams();

  const note = getNoteById(id as string);
  
  if (!note) {
    return (
      <ScrollableContentPage
        title="Note not found"
        backRoute="/(tabs)/explore/javascript-notes"
      >
        <Text style={[styles.errorText, { color: themeColors.text }]}>
          Note not found
        </Text>
      </ScrollableContentPage>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return themeColors.textSecondary;
    }
  };

  const headerContent = (
    <>
      <View style={styles.badges}>
        <Badge text={note.category} color={themeColors.primary} />
        <Badge text={note.difficulty} color={getDifficultyColor(note.difficulty)} />
      </View>

      <View style={styles.metaInfo}>
        <View style={styles.metaItem}>
          <Clock size={16} color={themeColors.textSecondary} />
          <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
            {note.readTime} min read
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Lightbulb size={16} color={themeColors.primary} />
          <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
            {note.keyPoints?.length || 0} key points
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <ScrollableContentPage
      title={note.title}
      backRoute="/(tabs)/explore/javascript-notes"
      headerContent={headerContent}
    >

      {/* Main Content */}
      <ContentSection
        title="Explanation"
        icon={<BookOpen size={20} color={themeColors.primary} />}
      >
        <Text style={[styles.contentText, { color: themeColors.text }]}>
          {note.content}
        </Text>
      </ContentSection>

      {/* Code Example */}
      {note.codeExample && (
        <ContentSection
          title="Code Example"
          icon={<Code size={20} color={themeColors.primary} />}
        >
          <CodeBlock
            code={note.codeExample}
            language="javascript"
            size="medium"
          />
        </ContentSection>
      )}

      {/* Key Points */}
      {note.keyPoints && note.keyPoints.length > 0 && (
        <ContentSection
          title="Key Points"
          icon={<Lightbulb size={20} color={themeColors.primary} />}
        >
          {note.keyPoints.map((point: string, index: number) => (
            <View key={index} style={styles.keyPointItem}>
              <Text style={[styles.bulletPoint, { color: themeColors.primary }]}>•</Text>
              <Text style={[styles.keyPointText, { color: themeColors.text }]}>
                {point}
              </Text>
            </View>
          ))}
        </ContentSection>
      )}

      {/* Additional Examples */}
      {note.examples && note.examples.length > 0 && (
        <ContentSection title="Additional Examples">
          {note.examples.map((example: any, index: number) => (
            <View key={index} style={styles.exampleContainer}>
              <Text style={[styles.exampleTitle, { color: themeColors.textSecondary }]}>
                {example.title}
              </Text>
              <CodeBlock
                code={example.code}
                language="javascript"
                size="small"
              />
              {example.explanation && (
                <Text style={[styles.exampleExplanation, { color: themeColors.textSecondary }]}>
                  {example.explanation}
                </Text>
              )}
            </View>
          ))}
        </ContentSection>
      )}
    </ScrollableContentPage>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contentText: {
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
  exampleContainer: {
    marginBottom: 16,
    gap: 8,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  exampleExplanation: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
