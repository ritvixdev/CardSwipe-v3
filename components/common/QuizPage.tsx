import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

const { height: screenHeight } = Dimensions.get('window');

interface QuizPageProps {
  title: string;
  backRoute: string;
  children: React.ReactNode;
  currentQuestion: number;
  totalQuestions: number;
  onPrevious?: () => void;
  onNext?: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
  headerContent?: React.ReactNode;
}

export default function QuizPage({
  title,
  backRoute,
  children,
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  showPrevious = true,
  showNext = true,
  headerContent,
}: QuizPageProps) {
  const themeColors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Fixed Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push(backRoute as any)}
          >
            <ArrowLeft size={24} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: themeColors.textSecondary }]}>
            Question {currentQuestion} of {totalQuestions}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: themeColors.card }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: themeColors.primary,
                  width: `${(currentQuestion / totalQuestions) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Optional header content */}
        {headerContent && (
          <View style={styles.pageHeader}>
            {headerContent}
          </View>
        )}
      </SafeAreaView>

      {/* Fixed height content area */}
      <View style={styles.contentContainer}>
        {children}
      </View>

      {/* Fixed Navigation Footer */}
      <View style={[styles.navigationFooter, { backgroundColor: themeColors.card }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor: showPrevious && onPrevious ? themeColors.primary : themeColors.inactive,
              opacity: showPrevious && onPrevious ? 1 : 0.5,
            },
          ]}
          onPress={onPrevious}
          disabled={!showPrevious || !onPrevious}
        >
          <ChevronLeft size={20} color="#ffffff" />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor: showNext && onNext ? themeColors.primary : themeColors.inactive,
              opacity: showNext && onNext ? 1 : 0.5,
            },
          ]}
          onPress={onNext}
          disabled={!showNext || !onNext}
        >
          <Text style={styles.navButtonText}>Next</Text>
          <ChevronRight size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
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
    marginBottom: 16,
  },
  backButton: {
    marginRight: 20,
    marginLeft: -4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  pageHeader: {
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    maxHeight: screenHeight - 280, // Reserve space for header and footer
  },
  navigationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 100, // Space for bottom tabs
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
