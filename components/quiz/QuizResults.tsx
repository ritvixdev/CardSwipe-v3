import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  Star
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { QuizResults as QuizResultsType, QuizData } from './QuizInterface';
import * as Haptics from 'expo-haptics';

interface QuizResultsProps {
  quiz: QuizData;
  results: QuizResultsType;
  onRetry: () => void;
  onHome: () => void;
  onReviewAnswers?: () => void;
}

export default function QuizResults({
  quiz,
  results,
  onRetry,
  onHome,
  onReviewAnswers
}: QuizResultsProps) {
  const themeColors = useThemeColors();
  const insets = useSafeAreaInsets();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = () => {
    if (results.score >= 90) return "Outstanding! 🌟";
    if (results.score >= 80) return "Excellent work! 🎉";
    if (results.score >= 70) return "Good job! 👍";
    if (results.score >= 60) return "Not bad! 📚";
    return "Keep practicing! 💪";
  };

  const getScoreColor = () => {
    if (results.score >= 80) return '#10b981';
    if (results.score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const handleRetry = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onRetry();
  };

  const handleHome = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onHome();
  };

  const handleReviewAnswers = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onReviewAnswers?.();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.scoreCircle, { borderColor: getScoreColor() }]}>
            <Text style={[styles.scoreText, { color: getScoreColor() }]}>
              {results.score}%
            </Text>
            {results.passed && (
              <Trophy size={24} color={getScoreColor()} style={styles.trophyIcon} />
            )}
          </View>
          
          <Text style={[styles.performanceMessage, { color: themeColors.text }]}>
            {getPerformanceMessage()}
          </Text>
          
          <Text style={[styles.quizTitle, { color: themeColors.text }]}>
            {quiz.title}
          </Text>
          
          {results.passed ? (
            <View style={[styles.passedBadge, { backgroundColor: '#10b981' }]}>
              <CheckCircle size={16} color="#ffffff" />
              <Text style={styles.passedText}>PASSED</Text>
            </View>
          ) : (
            <View style={[styles.failedBadge, { backgroundColor: '#ef4444' }]}>
              <XCircle size={16} color="#ffffff" />
              <Text style={styles.failedText}>FAILED</Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: themeColors.card }]}>
            <Target size={24} color={themeColors.primary} />
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Correct Answers
            </Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {results.correctAnswers} / {results.totalQuestions}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: themeColors.card }]}>
            <Clock size={24} color={themeColors.primary} />
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Time Spent
            </Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {formatTime(results.timeSpent)}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: themeColors.card }]}>
            <Star size={24} color={themeColors.primary} />
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Pass Score
            </Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {quiz.passingScore}%
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Performance Breakdown
          </Text>
          
          <View style={[styles.progressContainer, { backgroundColor: themeColors.card }]}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>
                Accuracy
              </Text>
              <Text style={[styles.progressValue, { color: themeColors.text }]}>
                {results.score}%
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: themeColors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: getScoreColor(),
                    width: `${results.score}%`
                  }
                ]} 
              />
            </View>
          </View>

          <View style={[styles.progressContainer, { backgroundColor: themeColors.card }]}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>
                Questions Answered
              </Text>
              <Text style={[styles.progressValue, { color: themeColors.text }]}>
                {results.answers.filter(a => a.selectedAnswer !== -1).length} / {results.totalQuestions}
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: themeColors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: themeColors.primary,
                    width: `${(results.answers.filter(a => a.selectedAnswer !== -1).length / results.totalQuestions) * 100}%`
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        <View style={[
          styles.actionsContainer,
          { paddingBottom: Math.max(insets.bottom + 16, 48) } // Dynamic padding based on safe area
        ]}>
          {onReviewAnswers && (
            <TouchableOpacity
              style={[styles.actionButton, styles.reviewButton, { backgroundColor: themeColors.card, borderColor: themeColors.primary }]}
              onPress={handleReviewAnswers}
            >
              <Text style={[styles.actionButtonText, { color: themeColors.primary }]}>
                Review Answers
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.retryButton, { backgroundColor: themeColors.primary }]}
            onPress={handleRetry}
          >
            <RotateCcw size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.homeButton, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={handleHome}
          >
            <Home size={20} color={themeColors.text} />
            <Text style={[styles.actionButtonText, { color: themeColors.text }]}>
              Back to Quizzes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  trophyIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  performanceMessage: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  passedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  failedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  passedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  failedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  progressContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  reviewButton: {
    borderWidth: 2,
  },
  retryButton: {
    // Primary button styles already applied
  },
  homeButton: {
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
