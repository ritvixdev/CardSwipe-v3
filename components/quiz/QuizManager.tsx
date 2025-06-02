import React, { useState } from 'react';
import { View } from 'react-native';
import QuizInterface, { QuizData, QuizResults } from './QuizInterface';
import QuizResultsComponent from './QuizResults';

interface QuizManagerProps {
  quiz: QuizData;
  onExit: () => void;
  onComplete?: (results: QuizResults) => void;
}

type QuizState = 'quiz' | 'results';

export default function QuizManager({ quiz, onExit, onComplete }: QuizManagerProps) {
  const [currentState, setCurrentState] = useState<QuizState>('quiz');
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setCurrentState('results');
    onComplete?.(results);
  };

  const handleRetry = () => {
    setCurrentState('quiz');
    setQuizResults(null);
  };

  const handleExit = () => {
    onExit();
  };

  if (currentState === 'results' && quizResults) {
    return (
      <QuizResultsComponent
        quiz={quiz}
        results={quizResults}
        onRetry={handleRetry}
        onHome={handleExit}
      />
    );
  }

  return (
    <QuizInterface
      quiz={quiz}
      onComplete={handleQuizComplete}
      onExit={handleExit}
    />
  );
}

// Export types for use in other components
export type { QuizData, QuizResults } from './QuizInterface';
