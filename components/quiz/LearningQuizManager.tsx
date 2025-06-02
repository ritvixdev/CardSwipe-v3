import React, { useState } from 'react';
import { View } from 'react-native';
import LearningQuizInterface, { LearningQuizResults } from './LearningQuizInterface';
import LearningQuizResultsComponent from './LearningQuizResults';
import { QuizData } from './QuizInterface';

interface LearningQuizManagerProps {
  quiz: QuizData;
  onExit: () => void;
  onComplete?: (results: LearningQuizResults) => void;
}

type QuizState = 'quiz' | 'results';

export default function LearningQuizManager({ quiz, onExit, onComplete }: LearningQuizManagerProps) {
  const [currentState, setCurrentState] = useState<QuizState>('quiz');
  const [quizResults, setQuizResults] = useState<LearningQuizResults | null>(null);

  const handleQuizComplete = (results: LearningQuizResults) => {
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
      <LearningQuizResultsComponent
        quiz={quiz}
        results={quizResults}
        onRetry={handleRetry}
        onHome={handleExit}
      />
    );
  }

  return (
    <LearningQuizInterface
      quiz={quiz}
      onComplete={handleQuizComplete}
      onExit={handleExit}
    />
  );
}

// Export types for use in other components
export type { LearningQuizResults } from './LearningQuizInterface';
