import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, XCircle, Target, BookOpen } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useProgressStore } from '@/store/useProgressStore';
import { QuizData, QuizQuestion } from './QuizInterface';
import * as Haptics from 'expo-haptics';

interface LearningQuizInterfaceProps {
  quiz: QuizData;
  onComplete: (results: LearningQuizResults) => void;
  onExit: () => void;
}

export interface LearningQuizResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
}

export default function LearningQuizInterface({ quiz, onComplete, onExit }: LearningQuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: string]: boolean }>({});
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  const themeColors = useThemeColors();
  const addXp = useProgressStore((state) => state.addXp);
  const insets = useSafeAreaInsets();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasAnsweredCurrent = selectedAnswers[currentQuestion?.id] !== undefined;
  const isShowingExplanation = showExplanation[currentQuestion?.id] || false;

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnsweredCurrent) return; // Prevent changing answer after selection
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));

    // Show explanation immediately after selection
    setShowExplanation(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));

    // Award XP if correct
    if (answerIndex === currentQuestion.correctAnswer) {
      addXp(5); // Smaller XP for learning mode
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuizComplete = () => {
    const answers = quiz.questions.map(question => {
      const selectedAnswer = selectedAnswers[question.id] ?? -1;
      const correct = selectedAnswer === question.correctAnswer;
      return {
        questionId: question.id,
        selectedAnswer,
        correct
      };
    });

    const correctAnswers = answers.filter(a => a.correct).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const results: LearningQuizResults = {
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      passed,
      answers
    };

    // Award bonus XP for completion
    if (passed) {
      addXp(20);
    }

    onComplete(results);
  };

  const getOptionStyle = (optionIndex: number) => {
    if (!hasAnsweredCurrent) {
      return styles.optionButton;
    }

    const selectedAnswer = selectedAnswers[currentQuestion.id];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    const isSelected = optionIndex === selectedAnswer;

    if (isCorrect) {
      return [styles.optionButton, styles.correctOption];
    } else if (isSelected && !isCorrect) {
      return [styles.optionButton, styles.incorrectOption];
    } else {
      return [styles.optionButton, styles.disabledOption];
    }
  };

  const getOptionTextStyle = (optionIndex: number) => {
    if (!hasAnsweredCurrent) {
      return { color: themeColors.text };
    }

    const selectedAnswer = selectedAnswers[currentQuestion.id];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    const isSelected = optionIndex === selectedAnswer;

    if (isCorrect || (isSelected && !isCorrect)) {
      return { color: '#ffffff' };
    } else {
      return { color: themeColors.textSecondary };
    }
  };

  if (!isQuizStarted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onExit} style={styles.backButton}>
            <ArrowLeft size={24} color={themeColors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.quizIntro}>
            <BookOpen size={48} color={themeColors.primary} />
            <Text style={[styles.quizTitle, { color: themeColors.text }]}>{quiz.title}</Text>
            <Text style={[styles.quizCategory, { color: themeColors.primary }]}>Learning Mode</Text>
            
            <Text style={[styles.quizDescription, { color: themeColors.textSecondary }]}>
              {quiz.description}
            </Text>

            <View style={[styles.learningModeInfo, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.learningModeTitle, { color: themeColors.text }]}>
                📚 Learning Mode Features:
              </Text>
              <Text style={[styles.learningModeText, { color: themeColors.textSecondary }]}>
                • No time pressure - learn at your own pace
              </Text>
              <Text style={[styles.learningModeText, { color: themeColors.textSecondary }]}>
                • Immediate feedback on each answer
              </Text>
              <Text style={[styles.learningModeText, { color: themeColors.textSecondary }]}>
                • Detailed explanations for every question
              </Text>
              <Text style={[styles.learningModeText, { color: themeColors.textSecondary }]}>
                • Visual indicators for correct/incorrect answers
              </Text>
            </View>

            <View style={styles.quizStats}>
              <View style={[styles.statItem, { backgroundColor: themeColors.card }]}>
                <Target size={20} color={themeColors.primary} />
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Questions</Text>
                <Text style={[styles.statValue, { color: themeColors.text }]}>{quiz.questions.length}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: themeColors.primary }]}
              onPress={handleStartQuiz}
            >
              <Text style={styles.startButtonText}>Start Learning</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with title, progress, and learning badge */}
        <View style={[styles.header, { backgroundColor: themeColors.background }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={onExit} style={styles.backButton}>
              <ArrowLeft size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.quizTitle, { color: themeColors.text }]}>{quiz.title}</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.headerBottom}>
            <View style={styles.quizProgress}>
              <Text style={[styles.progressText, { color: themeColors.text }]}>
                {currentQuestionIndex + 1} / {quiz.questions.length}
              </Text>
              <View style={[styles.progressBar, { backgroundColor: themeColors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: themeColors.primary,
                      width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`
                    }
                  ]}
                />
              </View>
            </View>

            <View style={styles.learningBadge}>
              <BookOpen size={16} color={themeColors.primary} />
              <Text style={[styles.learningBadgeText, { color: themeColors.primary }]}>
                Learning
              </Text>
            </View>
          </View>
        </View>

        {/* Content area with proper height calculation */}
        <View style={[styles.contentContainer, { paddingBottom: insets.bottom }]}>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            {currentQuestion && (
              <View style={styles.questionContainer}>
                <Text style={[styles.questionText, { color: themeColors.text }]}>
                  {currentQuestion.question}
                </Text>

                {currentQuestion.codeSnippet && (
                  <View style={[styles.codeContainer, { backgroundColor: themeColors.card }]}>
                    <Text style={[styles.codeText, { color: themeColors.text }]}>
                      {currentQuestion.codeSnippet}
                    </Text>
                  </View>
                )}

                <View style={styles.optionsContainer}>
                  {currentQuestion.options.map((option, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          getOptionStyle(index),
                          {
                            borderColor: themeColors.border,
                          }
                        ]}
                        onPress={() => handleAnswerSelect(index)}
                        disabled={hasAnsweredCurrent}
                      >
                        <View style={styles.optionContent}>
                          <Text style={[styles.optionText, getOptionTextStyle(index)]}>
                            {option}
                          </Text>
                          {hasAnsweredCurrent && index === currentQuestion.correctAnswer && (
                            <CheckCircle size={20} color="#ffffff" />
                          )}
                          {hasAnsweredCurrent &&
                           index === selectedAnswers[currentQuestion.id] &&
                           index !== currentQuestion.correctAnswer && (
                            <XCircle size={20} color="#ffffff" />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {isShowingExplanation && (
                  <View style={[styles.explanationContainer, { backgroundColor: themeColors.card }]}>
                    <Text style={[styles.explanationTitle, { color: themeColors.text }]}>
                      💡 Explanation:
                    </Text>
                    <Text style={[styles.explanationText, { color: themeColors.textSecondary }]}>
                      {currentQuestion.explanation}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Footer with navigation buttons */}
          <View style={[styles.footer, { backgroundColor: themeColors.card }]}>
            <TouchableOpacity
              style={[
                styles.navButton,
                {
                  backgroundColor: currentQuestionIndex > 0 ? themeColors.border : 'transparent',
                  opacity: currentQuestionIndex > 0 ? 1 : 0.5
                }
              ]}
              onPress={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <Text style={[styles.navButtonText, { color: themeColors.text }]}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                styles.nextButton,
                {
                  backgroundColor: hasAnsweredCurrent ? themeColors.primary : themeColors.border,
                  opacity: hasAnsweredCurrent ? 1 : 0.5
                }
              ]}
              onPress={handleNextQuestion}
              disabled={!hasAnsweredCurrent}
            >
              <Text style={[
                styles.navButtonText,
                { color: hasAnsweredCurrent ? '#ffffff' : themeColors.textSecondary }
              ]}>
                {isLastQuestion ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40, // Same width as back button for centering
  },
  quizProgress: {
    flex: 1,
    alignItems: 'center',
    marginRight: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  learningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  learningBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentInner: {
    flexGrow: 1,
  },
  quizIntro: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  quizTitleIntro: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  quizCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  quizDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  learningModeInfo: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
  },
  learningModeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  learningModeText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionContainer: {
    paddingVertical: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 20,
  },
  codeContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  correctOption: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  incorrectOption: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  explanationContainer: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  nextButton: {
    // Additional styles for next button if needed
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
