// Data loader utilities for JSON files
import learnCardsData from '../learn/cards.json';
import javascriptNotesData from '../explore/javascriptNotes/notes.json';
import practiceQuizData from '../explore/practiceQuiz/quizzes.json';
import interviewPrepData from '../explore/interviewPrep/questions.json';
import interviewQuizData from '../json/interview-quiz.json';
import learningRoadmapData from '../json/learning-roadmap.json';

// Type definitions
export interface LearnCard {
  id: string;
  title: string;
  day: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  description: string;
  content: string;
  codeExample?: string;
  keyPoints: string[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  tags: string[];
  isCompleted: boolean;
  isBookmarked: boolean;
}

export interface JavaScriptNote {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  content: string;
  codeExample?: string;
  keyPoints: string[];
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  codeSnippet?: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  passingScore: number;
  description: string;
  questions: QuizQuestion[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answer: string;
  codeExample?: string;
  keyPoints: string[];
  tags: string[];
}

export interface RoadmapNode {
  id: string;
  title: string;
  level: number;
  position: { x: number; y: number };
  status: 'completed' | 'current' | 'locked';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  topics: string[];
  prerequisites: string[];
  description: string;
  resources: string[];
}

export interface RoadmapConnection {
  from: string;
  to: string;
}

export interface LearningRoadmap {
  title: string;
  description: string;
  totalNodes: number;
  estimatedTime: string;
  nodes: RoadmapNode[];
  connections: RoadmapConnection[];
}

// Learn Cards
export const lessons: LearnCard[] = learnCardsData.lessons as LearnCard[];
export const lessonCategories: string[] = learnCardsData.categories;
export const lessonDifficulties: string[] = learnCardsData.difficulties;

// JavaScript Notes
export const notes: JavaScriptNote[] = javascriptNotesData.notes as JavaScriptNote[];
export const noteCategories: string[] = javascriptNotesData.categories;

export function getNotesByCategory(category: string): JavaScriptNote[] {
  return notes.filter(note => note.category === category);
}

// Learn Cards utility functions
export function getLessonsByCategory(category: string): LearnCard[] {
  return lessons.filter(lesson => lesson.category === category);
}

export function getLessonsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): LearnCard[] {
  return lessons.filter(lesson => lesson.difficulty === difficulty);
}

export function getLessonById(id: string): LearnCard | undefined {
  return lessons.find(lesson => lesson.id === id);
}

export function getCompletedLessons(): LearnCard[] {
  return lessons.filter(lesson => lesson.isCompleted);
}

export function getBookmarkedLessons(): LearnCard[] {
  return lessons.filter(lesson => lesson.isBookmarked);
}

export function searchLessons(query: string): LearnCard[] {
  const lowercaseQuery = query.toLowerCase();
  return lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(lowercaseQuery) ||
    lesson.content.toLowerCase().includes(lowercaseQuery) ||
    lesson.description.toLowerCase().includes(lowercaseQuery) ||
    lesson.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getNotesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): JavaScriptNote[] {
  return notes.filter(note => note.difficulty === difficulty);
}

export function searchNotes(query: string): JavaScriptNote[] {
  const lowercaseQuery = query.toLowerCase();
  return notes.filter(note => 
    note.title.toLowerCase().includes(lowercaseQuery) ||
    note.content.toLowerCase().includes(lowercaseQuery) ||
    note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Practice Quizzes
export const quizzes: Quiz[] = practiceQuizData.quizzes as Quiz[];
export const quizCategories: string[] = practiceQuizData.categories;

export function getQuizzesByCategory(category: string): Quiz[] {
  return quizzes.filter(quiz => quiz.category === category);
}

export function getQuizzesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Quiz[] {
  return quizzes.filter(quiz => quiz.difficulty === difficulty);
}

export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find(quiz => quiz.id === id);
}

// Interview Prep
export const interviewQuestions: InterviewQuestion[] = interviewPrepData.interviewQuestions as InterviewQuestion[];
export const interviewCategories: string[] = interviewPrepData.categories;

export function getInterviewQuestionsByCategory(category: string): InterviewQuestion[] {
  return interviewQuestions.filter(question => question.category === category);
}

export function getInterviewQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): InterviewQuestion[] {
  return interviewQuestions.filter(question => question.difficulty === difficulty);
}

export function searchInterviewQuestions(query: string): InterviewQuestion[] {
  const lowercaseQuery = query.toLowerCase();
  return interviewQuestions.filter(question => 
    question.question.toLowerCase().includes(lowercaseQuery) ||
    question.answer.toLowerCase().includes(lowercaseQuery) ||
    question.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Interview Quizzes
export const interviewQuizzes: Quiz[] = interviewQuizData.interviewQuizzes as Quiz[];
export const interviewQuizCategories: string[] = interviewQuizData.categories;

export function getInterviewQuizzesByCategory(category: string): Quiz[] {
  return interviewQuizzes.filter(quiz => quiz.category === category);
}

export function getInterviewQuizById(id: string): Quiz | undefined {
  return interviewQuizzes.find(quiz => quiz.id === id);
}

// Learning Roadmap
export const learningRoadmap: LearningRoadmap = learningRoadmapData.roadmap as LearningRoadmap;

export function getRoadmapNodeById(id: string): RoadmapNode | undefined {
  return learningRoadmap.nodes.find(node => node.id === id);
}

export function getNodesByLevel(level: number): RoadmapNode[] {
  return learningRoadmap.nodes.filter(node => node.level === level);
}

export function getNodesByStatus(status: 'completed' | 'current' | 'locked'): RoadmapNode[] {
  return learningRoadmap.nodes.filter(node => node.status === status);
}

export function getPrerequisites(nodeId: string): RoadmapNode[] {
  const node = getRoadmapNodeById(nodeId);
  if (!node) return [];
  
  return node.prerequisites.map(prereqId => getRoadmapNodeById(prereqId)).filter(Boolean) as RoadmapNode[];
}

export function getNextNodes(nodeId: string): RoadmapNode[] {
  return learningRoadmap.nodes.filter(node => 
    node.prerequisites.includes(nodeId)
  );
}

// Utility functions
export function getAllCategories(): string[] {
  const allCategories = [
    ...noteCategories,
    ...quizCategories,
    ...interviewCategories,
    ...interviewQuizCategories
  ];
  return [...new Set(allCategories)].sort();
}

export function getRandomItems<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getItemsByTag(tag: string): (JavaScriptNote | InterviewQuestion)[] {
  const notesWithTag = notes.filter(note => note.tags.includes(tag));
  const questionsWithTag = interviewQuestions.filter(question => question.tags.includes(tag));
  return [...notesWithTag, ...questionsWithTag];
}

// Statistics
export function getStats() {
  return {
    totalNotes: notes.length,
    totalQuizzes: quizzes.length,
    totalInterviewQuestions: interviewQuestions.length,
    totalInterviewQuizzes: interviewQuizzes.length,
    totalRoadmapNodes: learningRoadmap.nodes.length,
    categoriesCount: getAllCategories().length,
    completedNodes: getNodesByStatus('completed').length,
    currentNodes: getNodesByStatus('current').length,
    lockedNodes: getNodesByStatus('locked').length
  };
}
