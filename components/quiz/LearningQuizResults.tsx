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
  BookOpen,
  Target,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  Star,
  Award
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { QuizData } from './QuizInterface';
import { LearningQuizResults as LearningQuizResultsType } from './LearningQuizInterface';
import * as Haptics from 'expo-haptics';

interface LearningQuizResultsProps {
  quiz: QuizData;
  results: LearningQuizResultsType;
  onRetry: () => void;
  onHome: () => void;
}

export default function LearningQuizResults({
  quiz,
  results,
  onRetry,
  onHome
}: LearningQuizResultsProps) {
  const themeColors = useThemeColors();
  const insets = useSafeAreaInsets();

  const getPerformanceMessage = () => {
    if (results.score >= 90) return "Excellent learning! 🌟";
    if (results.score >= 80) return "Great progress! 🎉";
    if (results.score >= 70) return "Good understanding! 👍";
    if (results.score >= 60) return "Keep practicing! 📚";
    return "Review and try again! 💪";
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BookOpen size={32} color={themeColors.primary} />
          
          <View style={[styles.scoreCircle, { borderColor: getScoreColor() }]}>
            <Text style={[styles.scoreText, { color: getScoreColor() }]}>
              {results.score}%
            </Text>
            {results.passed && (
              <Award size={24} color={getScoreColor()} style={styles.awardIcon} />
            )}
          </View>
          
          <Text style={[styles.performanceMessage, { color: themeColors.text }]}>
            {getPerformanceMessage()}
          </Text>
          
          <Text style={[styles.quizTitle, { color: themeColors.text }]}>
            {quiz.title} - Learning Mode
          </Text>
          
          {results.passed ? (
            <View style={[styles.passedBadge, { backgroundColor: '#10b981' }]}>
              <CheckCircle size={16} color="#ffffff" />
              <Text style={styles.passedText}>COMPLETED</Text>
            </View>
          ) : (
            <View style={[styles.reviewBadge, { backgroundColor: '#f59e0b' }]}>
              <BookOpen size={16} color="#ffffff" />
              <Text style={styles.reviewText}>REVIEW NEEDED</Text>
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
            <Star size={24} color={themeColors.primary} />
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Learning Goal
            </Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {quiz.passingScore}%
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Learning Progress
          </Text>
          
          <View style={[styles.progressContainer, { backgroundColor: themeColors.card }]}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>
                Understanding Level
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
                Questions Completed
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

        <View style={[styles.learningTipsContainer, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.learningTipsTitle, { color: themeColors.text }]}>
            💡 Learning Tips
          </Text>
          {results.score < 70 ? (
            <>
              <Text style={[styles.learningTip, { color: themeColors.textSecondary }]}>
                • Review the explanations for questions you missed
              </Text>
              <Text style={[styles.learningTip, { color: themeColors.textSecondary }]}>
                • Take your time to understand each concept
              </Text>
              <Text style={[styles.learningTip, { color: themeColors.textSecondary }]}>
                • Practice similar questions to reinforce learning
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.learningTip, { color: themeColors.textSecondary }]}>
                • Great job! You're understanding the concepts well
              </Text>
              <Text style={[styles.learningTip, { color: themeColors.textSecondary }]}>
                • Try more challenging quizzes to advance your skills
              </Text>
              <Text style={[styles.learningTip, { color: themeColors.textSecondary }]}>
                • Consider taking the timed version for interview practice
              </Text>
            </>
          )}
        </View>

        <View style={[
          styles.actionsContainer,
          { paddingBottom: Math.max(insets.bottom + 16, 48) } // Dynamic padding based on safe area
        ]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.retryButton, { backgroundColor: themeColors.primary }]}
            onPress={handleRetry}
          >
            <RotateCcw size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Practice Again</Text>
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
    marginTop: 16,
    position: 'relative',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  awardIcon: {
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
  reviewBadge: {
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
  reviewText: {
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
    marginBottom: 24,
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
  learningTipsContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  learningTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  learningTip: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
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
