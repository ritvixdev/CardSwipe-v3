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
import { ArrowLeft, Code, CheckCircle, XCircle, Lightbulb } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import CodeBlock from '@/components/CodeBlock';
import { getDesignPatternById, DesignPattern } from '@/data/processors/dataLoader';

export default function DesignPatternDetailScreen() {
  const themeColors = useThemeColors();
  const { id } = useLocalSearchParams();

  const pattern = getDesignPatternById(id as string);
  
  if (!pattern) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.text }]}>
          Pattern not found
        </Text>
      </View>
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Creational': return '#8b5cf6';
      case 'Structural': return '#06b6d4';
      case 'Behavioral': return '#f59e0b';
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
              onPress={() => router.push('/(tabs)/explore/design-patterns')}
            >
              <ArrowLeft size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: themeColors.text }]}>{pattern.name}</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>
            {pattern.description}
          </Text>
          
          <View style={styles.badges}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(pattern.category) }]}>
              <Text style={styles.badgeText}>{pattern.category}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(pattern.difficulty) }]}>
              <Text style={styles.badgeText}>{pattern.difficulty}</Text>
            </View>
          </View>
        </View>

        {/* Problem and Solution */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <View style={styles.sectionHeader}>
            <Lightbulb size={20} color={themeColors.primary} />
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Problem & Solution
            </Text>
          </View>
          <Text style={[styles.detailedText, { color: themeColors.textSecondary }]}>
            <Text style={{ fontWeight: 'bold' }}>Problem: </Text>
            {pattern.problem}
            {'\n\n'}
            <Text style={{ fontWeight: 'bold' }}>Solution: </Text>
            {pattern.solution}
          </Text>
        </View>

        {/* Code Example */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <View style={styles.sectionHeader}>
            <Code size={20} color={themeColors.primary} />
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Implementation Example
            </Text>
          </View>

          <CodeBlock
            code={pattern.codeExample}
            language="javascript"
            size="medium"
          />
        </View>

        {/* Pros and Cons */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Pros and Cons
          </Text>
          
          <View style={styles.prosConsContainer}>
            <View style={styles.prosContainer}>
              <Text style={[styles.prosConsTitle, { color: '#10b981' }]}>Pros</Text>
              {pattern.pros.map((pro: string, index: number) => (
                <View key={index} style={styles.prosConsItem}>
                  <CheckCircle size={16} color="#10b981" />
                  <Text style={[styles.prosConsText, { color: themeColors.text }]}>
                    {pro}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.consContainer}>
              <Text style={[styles.prosConsTitle, { color: '#ef4444' }]}>Cons</Text>
              {pattern.cons.map((con: string, index: number) => (
                <View key={index} style={styles.prosConsItem}>
                  <XCircle size={16} color="#ef4444" />
                  <Text style={[styles.prosConsText, { color: themeColors.text }]}>
                    {con}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Related Patterns */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Related Patterns
          </Text>
          {pattern.relatedPatterns.map((related: string, index: number) => (
            <Text key={index} style={[styles.alternativeText, { color: themeColors.textSecondary }]}>
              • {related}
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
  detailedText: {
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
  prosConsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  prosContainer: {
    flex: 1,
  },
  consContainer: {
    flex: 1,
  },
  prosConsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  prosConsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  prosConsText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  alternativeText: {
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
