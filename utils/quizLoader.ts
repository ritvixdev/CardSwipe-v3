import { QuizData } from '@/components/quiz/QuizInterface';

// Import quiz data
import practiceQuizData from '@/data/explore/practice-quiz.json';
import interviewQuizData from '@/data/explore/interview-quiz.json';

export type QuizType = 'practice' | 'interview';

export interface QuizMetadata {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  passingScore: number;
  description: string;
  questionCount: number;
  type: QuizType;
}

// Convert practice quiz data to our format
const convertPracticeQuizzes = (): QuizData[] => {
  return practiceQuizData.quizzes.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    category: quiz.category,
    difficulty: quiz.difficulty as 'easy' | 'medium' | 'hard',
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    description: quiz.description,
    questions: quiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      codeSnippet: undefined // Practice quizzes don't have code snippets
    }))
  }));
};

// Convert interview quiz data to our format
const convertInterviewQuizzes = (): QuizData[] => {
  return interviewQuizData.interviewQuizzes.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    category: quiz.category,
    difficulty: quiz.difficulty as 'easy' | 'medium' | 'hard',
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    description: quiz.description,
    questions: quiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      codeSnippet: q.codeSnippet
    }))
  }));
};

// Get all quizzes with metadata
export const getAllQuizzes = (): QuizMetadata[] => {
  const practiceQuizzes = convertPracticeQuizzes();
  const interviewQuizzes = convertInterviewQuizzes();

  const practiceMetadata: QuizMetadata[] = practiceQuizzes.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    category: quiz.category,
    difficulty: quiz.difficulty,
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    description: quiz.description,
    questionCount: quiz.questions.length,
    type: 'practice' as QuizType
  }));

  const interviewMetadata: QuizMetadata[] = interviewQuizzes.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    category: quiz.category,
    difficulty: quiz.difficulty,
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    description: quiz.description,
    questionCount: quiz.questions.length,
    type: 'interview' as QuizType
  }));

  return [...practiceMetadata, ...interviewMetadata];
};

// Get quiz by ID and type
export const getQuizById = (id: string, type: QuizType): QuizData | null => {
  if (type === 'practice') {
    const practiceQuizzes = convertPracticeQuizzes();
    return practiceQuizzes.find(quiz => quiz.id === id) || null;
  } else if (type === 'interview') {
    const interviewQuizzes = convertInterviewQuizzes();
    return interviewQuizzes.find(quiz => quiz.id === id) || null;
  }
  return null;
};

// Get quizzes by type
export const getQuizzesByType = (type: QuizType): QuizData[] => {
  if (type === 'practice') {
    return convertPracticeQuizzes();
  } else if (type === 'interview') {
    return convertInterviewQuizzes();
  }
  return [];
};

// Get quizzes by category
export const getQuizzesByCategory = (category: string, type?: QuizType): QuizMetadata[] => {
  const allQuizzes = getAllQuizzes();
  
  let filtered = allQuizzes.filter(quiz => 
    quiz.category.toLowerCase().includes(category.toLowerCase())
  );

  if (type) {
    filtered = filtered.filter(quiz => quiz.type === type);
  }

  return filtered;
};

// Get quizzes by difficulty
export const getQuizzesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard', type?: QuizType): QuizMetadata[] => {
  const allQuizzes = getAllQuizzes();
  
  let filtered = allQuizzes.filter(quiz => quiz.difficulty === difficulty);

  if (type) {
    filtered = filtered.filter(quiz => quiz.type === type);
  }

  return filtered;
};

// Search quizzes
export const searchQuizzes = (query: string, type?: QuizType): QuizMetadata[] => {
  const allQuizzes = getAllQuizzes();
  const lowercaseQuery = query.toLowerCase();
  
  let filtered = allQuizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(lowercaseQuery) ||
    quiz.description.toLowerCase().includes(lowercaseQuery) ||
    quiz.category.toLowerCase().includes(lowercaseQuery)
  );

  if (type) {
    filtered = filtered.filter(quiz => quiz.type === type);
  }

  return filtered;
};

// Get practice quiz categories
export const getPracticeQuizCategories = (): string[] => {
  return practiceQuizData.categories;
};

// Get interview quiz categories
export const getInterviewQuizCategories = (): string[] => {
  return interviewQuizData.categories;
};
