import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Quiz } from '@/types/lesson';
import { useProgressStore } from '@/store/useProgressStore';
import * as Haptics from 'expo-haptics';

interface QuizCardProps {
  quiz: Quiz;
  lessonId: number;
}

export default function QuizCard({ quiz, lessonId }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const addXp = useProgressStore((state) => state.addXp);
  const themeColors = useThemeColors();
  
  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    // Award XP if correct
    if (option === quiz.answer) {
      addXp(10);
    }
  };
  
  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      return [styles.option, { backgroundColor: themeColors.card, borderColor: themeColors.border }];
    }
    
    if (option === quiz.answer) {
      return [
        styles.option, 
        { 
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: themeColors.success 
        }
      ];
    }
    
    if (option === selectedOption) {
      return [
        styles.option, 
        { 
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: themeColors.error 
        }
      ];
    }
    
    return [styles.option, { backgroundColor: themeColors.card, borderColor: themeColors.border }];
  };
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.card, borderColor: themeColors.border }]} testID="quiz-card">
      <Text style={[styles.title, { color: themeColors.text }]}>Quiz</Text>
      <Text style={[styles.question, { color: themeColors.textSecondary }]} accessibilityLabel="Quiz question">{quiz.question}</Text>
      
      <View style={styles.optionsContainer}>
        {quiz.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(option)}
            onPress={() => handleOptionSelect(option)}
            activeOpacity={0.8}
            disabled={isAnswered}
            accessibilityLabel={`Option ${index + 1}: ${option}`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedOption === option }}
          >
            <Text style={[styles.optionText, { color: themeColors.text }]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {isAnswered && (
        <View style={[styles.resultContainer, { backgroundColor: themeColors.background }]}>
          {selectedOption === quiz.answer ? (
            <Text style={[styles.correctText, { color: themeColors.success }]}>Correct! +10 XP</Text>
          ) : (
            <View>
              <Text style={[styles.incorrectText, { color: themeColors.error }]}>Incorrect</Text>
              <Text style={[styles.correctAnswerText, { color: themeColors.textSecondary }]}>
                The correct answer is: {quiz.answer}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 15,
  },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  correctText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  incorrectText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  correctAnswerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});