import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, Target } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useProgressStore } from '@/store/useProgressStore';
import * as Haptics from 'expo-haptics';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  codeSnippet?: string;
}

export interface QuizData {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  passingScore: number;
  description: string;
  questions: QuizQuestion[];
}

interface QuizInterfaceProps {
  quiz: QuizData;
  onComplete: (results: QuizResults) => void;
  onExit: () => void;
}

export interface QuizResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  passed: boolean;
  answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
}

export default function QuizInterface({ quiz, onComplete, onExit }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit * 60); // Convert to seconds
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  const themeColors = useThemeColors();
  const addXp = useProgressStore((state) => state.addXp);
  const insets = useSafeAreaInsets();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasAnsweredCurrent = selectedAnswers[currentQuestion?.id] !== undefined;

  // Timer effect
  useEffect(() => {
    if (!isQuizStarted || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizStarted, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
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
    const timeSpent = (quiz.timeLimit * 60) - timeRemaining;

    const results: QuizResults = {
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent,
      passed,
      answers
    };

    // Award XP based on performance
    if (passed) {
      const xpReward = Math.round(score * 0.5); // 50 XP for perfect score
      addXp(xpReward);
    }

    setQuizResults(results);
    setShowResults(true);
    onComplete(results);
  };

  const handleExit = () => {
    if (isQuizStarted && !showResults) {
      Alert.alert(
        'Exit Quiz',
        'Are you sure you want to exit? Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: onExit }
        ]
      );
    } else {
      onExit();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return themeColors.primary;
    }
  };

  if (!isQuizStarted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleExit} style={styles.backButton}>
            <ArrowLeft size={24} color={themeColors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.enhancedQuizIntro}>
            {/* Hero Section */}
            <View style={[styles.heroSection, { backgroundColor: getDifficultyColor(quiz.difficulty) + '10' }]}>
              <View style={[styles.quizIconContainer, { backgroundColor: getDifficultyColor(quiz.difficulty) }]}>
                <Trophy size={32} color="#ffffff" />
              </View>

              <Text style={[styles.enhancedQuizTitle, { color: themeColors.text }]}>{quiz.title}</Text>
              <Text style={[styles.enhancedQuizCategory, { color: themeColors.primary }]}>{quiz.category}</Text>

              <View style={[styles.enhancedDifficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) }]}>
                <Text style={styles.enhancedDifficultyText}>{quiz.difficulty.toUpperCase()}</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={[styles.enhancedQuizDescription, { color: themeColors.textSecondary }]}>
                {quiz.description}
              </Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.enhancedQuizStats}>
              <View style={[styles.enhancedStatItem, { backgroundColor: themeColors.card }]}>
                <View style={[styles.statIconContainer, { backgroundColor: themeColors.primary + '20' }]}>
                  <Clock size={20} color={themeColors.primary} />
                </View>
                <Text style={[styles.enhancedStatLabel, { color: themeColors.textSecondary }]}>Time Limit</Text>
                <Text style={[styles.enhancedStatValue, { color: themeColors.text }]}>{quiz.timeLimit} min</Text>
              </View>

              <View style={[styles.enhancedStatItem, { backgroundColor: themeColors.card }]}>
                <View style={[styles.statIconContainer, { backgroundColor: themeColors.primary + '20' }]}>
                  <Target size={20} color={themeColors.primary} />
                </View>
                <Text style={[styles.enhancedStatLabel, { color: themeColors.textSecondary }]}>Questions</Text>
                <Text style={[styles.enhancedStatValue, { color: themeColors.text }]}>{quiz.questions.length}</Text>
              </View>

              <View style={[styles.enhancedStatItem, { backgroundColor: themeColors.card }]}>
                <View style={[styles.statIconContainer, { backgroundColor: getDifficultyColor(quiz.difficulty) + '20' }]}>
                  <Trophy size={20} color={getDifficultyColor(quiz.difficulty)} />
                </View>
                <Text style={[styles.enhancedStatLabel, { color: themeColors.textSecondary }]}>Pass Score</Text>
                <Text style={[styles.enhancedStatValue, { color: themeColors.text }]}>{quiz.passingScore}%</Text>
              </View>
            </View>

            {/* Start Button */}
            <TouchableOpacity
              style={[styles.enhancedStartButton, { backgroundColor: getDifficultyColor(quiz.difficulty) }]}
              onPress={handleStartQuiz}
              activeOpacity={0.9}
            >
              <Text style={styles.enhancedStartButtonText}>Start Timed Quiz</Text>
              <Clock size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with title, progress, and timer */}
        <View style={[styles.header, { backgroundColor: themeColors.background }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={handleExit} style={styles.backButton}>
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

            <View style={styles.timer}>
              <Clock size={16} color={timeRemaining < 300 ? '#ef4444' : themeColors.primary} />
              <Text style={[
                styles.timerText,
                { color: timeRemaining < 300 ? '#ef4444' : themeColors.text }
              ]}>
                {formatTime(timeRemaining)}
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
                    const isSelected = selectedAnswers[currentQuestion.id] === index;
                    const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.enhancedOptionButton,
                          {
                            backgroundColor: isSelected ? themeColors.primary : themeColors.card,
                            borderColor: isSelected ? themeColors.primary : themeColors.border,
                            transform: [{ scale: isSelected ? 0.98 : 1 }],
                          }
                        ]}
                        onPress={() => handleAnswerSelect(index)}
                        activeOpacity={0.8}
                      >
                        <View style={[
                          styles.optionLetterContainer,
                          {
                            backgroundColor: isSelected ? '#ffffff' : themeColors.primary,
                          }
                        ]}>
                          <Text style={[
                            styles.optionLetter,
                            { color: isSelected ? themeColors.primary : '#ffffff' }
                          ]}>
                            {optionLetter}
                          </Text>
                        </View>
                        <Text style={[
                          styles.enhancedOptionText,
                          { color: isSelected ? '#ffffff' : themeColors.text }
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
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
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 14,
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
  enhancedQuizIntro: {
    paddingVertical: 20,
  },
  heroSection: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
  },
  quizIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  enhancedQuizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  enhancedQuizCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  enhancedDifficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  enhancedDifficultyText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  enhancedQuizDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  enhancedQuizStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  enhancedStatItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  enhancedStatLabel: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  enhancedStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  enhancedStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  enhancedStartButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizTitleIntro: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  quizCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  quizDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  enhancedOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
    gap: 12,
    minHeight: 60,
  },
  optionLetterContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  enhancedOptionText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
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
