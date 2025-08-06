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
import { ArrowLeft, Code, Eye, Layers, Zap, ArrowRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { designPatterns, DesignPattern, getDesignPatternsByCategory, getDesignPatternsByDifficulty } from '@/data/processors/dataLoader';

// Use JSON data instead of hardcoded data
const designPatternsData = designPatterns;

export default function DesignPatternsScreen() {
  const themeColors = useThemeColors();

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

  const getPatternIcon = (iconType: string) => {
    switch (iconType) {
      case 'layers': return Layers;
      case 'eye': return Eye;
      case 'zap': return Zap;
      default: return Code;
    }
  };

  const PatternCard = ({ pattern }: { pattern: DesignPattern }) => {
    const PatternIcon = Code; // Use Code icon for all patterns since JSON doesn't have icon field

    return (
      <View style={styles.patternContainer}>
        <TouchableOpacity
          style={[styles.patternCard, { backgroundColor: themeColors.card }]}
          onPress={() => router.push(`/(tabs)/explore/design-patterns/${pattern.id}` as any)}
        >
          <View style={styles.patternHeader}>
            <View style={[styles.patternIconContainer, { backgroundColor: getCategoryColor(pattern.category) }]}>
              <PatternIcon size={24} color="#ffffff" />
            </View>

            <View style={styles.patternMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(pattern.category) }]}>
                <Text style={styles.categoryText}>{pattern.category}</Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(pattern.difficulty) }]}>
                <Text style={styles.difficultyText}>{pattern.difficulty}</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.patternTitle, { color: themeColors.text }]}>
            {pattern.name}
          </Text>

          <Text style={[styles.patternDescription, { color: themeColors.textSecondary }]}>
            {pattern.description}
          </Text>

          <View style={styles.patternFooter}>
            <Text style={[styles.useCase, { color: themeColors.textSecondary }]}>
              Real world: {pattern.realWorldExample}
            </Text>
            <ArrowRight size={16} color={themeColors.primary} />
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
            <Text style={[styles.title, { color: themeColors.text }]}>Design Patterns</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>
            Common software design patterns with examples
          </Text>
        </View>

        {/* Patterns List */}
        <View style={styles.patternsContainer}>
          {designPatternsData?.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
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
  patternsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  patternContainer: {
    gap: 12,
  },
  patternCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patternIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternMeta: {
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
  patternTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  patternDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  patternFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  useCase: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  patternDetails: {
    padding: 20,
    borderRadius: 12,
    gap: 20,
  },
  prosConsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  prosContainer: {
    flex: 1,
    gap: 8,
  },
  consContainer: {
    flex: 1,
    gap: 8,
  },
  prosConsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  prosConsItem: {
    fontSize: 12,
    lineHeight: 18,
  },
  codeSection: {
    gap: 12,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
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
    gap: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
