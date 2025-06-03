// Data loader utilities for JSON files
import learnCardsData from '../learn/cards.json';
import javascriptNotesData from '../explore/javascript-notes.json';
import practiceQuizData from '../explore/practice-quiz.json';
import interviewPrepData from '../explore/interview-prep.json';
import interviewQuizData from '../explore/interview-quiz.json';
import learningRoadmapData from '../explore/learning-roadmap.json';
import designPatternsData from '../explore/design-patterns.json';
import codingQuestionsData from '../explore/coding-questions.json';

// Topic-specific cards
import easyTopicData from '../learn/topics/easy.json';
import mediumTopicData from '../learn/topics/medium.json';
import hardTopicData from '../learn/topics/hard.json';
import interviewTopicData from '../learn/topics/interview.json';
import fundamentalsTopicData from '../learn/topics/fundamentals.json';

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

export interface DesignPattern {
  id: string;
  name: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  codeExample: string;
  realWorldExample: string;
  pros: string[];
  cons: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  relatedPatterns: string[];
}

export interface CodingQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeComplexity: string;
  spaceComplexity: string;
  question: string;
  codeExample: string;
  explanation: string;
  variations: string[];
  relatedProblems: string[];
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
export const topics = learnCardsData.topics;

// Topic data map for static imports
const topicDataMap: { [key: string]: any } = {
  easy: easyTopicData,
  medium: mediumTopicData,
  hard: hardTopicData,
  interview: interviewTopicData,
  fundamentals: fundamentalsTopicData,
};

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

export function getLessonsByTopic(topicId: string): LearnCard[] {
  // If it's the default "all" topic or no topic, return main lessons
  if (!topicId || topicId === 'all') {
    return lessons;
  }

  // Check if we have topic-specific cards
  const topicData = topicDataMap[topicId];
  if (topicData && topicData.cards) {
    return topicData.cards as LearnCard[];
  }

  // Fallback to filtering main lessons
  const topic = topics.find((t: any) => t.id === topicId);
  if (!topic) return lessons;

  const { filter } = topic;
  return lessons.filter(lesson => {
    // Check difficulty filter
    if (filter.difficulty && !filter.difficulty.includes(lesson.difficulty)) {
      return false;
    }

    // Check category filter
    if (filter.category && !filter.category.includes(lesson.category)) {
      return false;
    }

    // Check tags filter
    if (filter.tags && !filter.tags.some((tag: string) => lesson.tags.includes(tag))) {
      return false;
    }

    return true;
  });
}

export function getTopicInfo(topicId: string) {
  // Check if we have topic-specific data
  const topicData = topicDataMap[topicId];
  if (topicData && topicData.topicInfo) {
    return topicData.topicInfo;
  }

  // Fallback to main topics array
  return topics.find((t: any) => t.id === topicId);
}

export function getNotesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): JavaScriptNote[] {
  return notes.filter(note => note.difficulty === difficulty);
}

export function getNoteById(id: string): JavaScriptNote | undefined {
  return notes.find(note => note.id === id);
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

export function getInterviewQuestionById(id: string): InterviewQuestion | undefined {
  return interviewQuestions.find(question => question.id === id);
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

// Design Patterns
export const designPatterns: DesignPattern[] = designPatternsData.designPatterns as DesignPattern[];
export const designPatternCategories: string[] = designPatternsData.categories;

export function getDesignPatternsByCategory(category: string): DesignPattern[] {
  return designPatterns.filter(pattern => pattern.category === category);
}

export function getDesignPatternsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): DesignPattern[] {
  return designPatterns.filter(pattern => pattern.difficulty === difficulty);
}

export function getDesignPatternById(id: string): DesignPattern | undefined {
  return designPatterns.find(pattern => pattern.id === id);
}

export function searchDesignPatterns(query: string): DesignPattern[] {
  const lowercaseQuery = query.toLowerCase();
  return designPatterns.filter(pattern =>
    pattern.name.toLowerCase().includes(lowercaseQuery) ||
    pattern.description.toLowerCase().includes(lowercaseQuery) ||
    pattern.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Coding Questions
export const codingQuestions: CodingQuestion[] = codingQuestionsData.codingQuestions as CodingQuestion[];
export const codingQuestionCategories: string[] = codingQuestionsData.categories;
export const codingQuestionDifficulties: string[] = codingQuestionsData.difficulties;

export function getCodingQuestionsByCategory(category: string): CodingQuestion[] {
  return codingQuestions.filter(question => question.category === category);
}

export function getCodingQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): CodingQuestion[] {
  return codingQuestions.filter(question => question.difficulty === difficulty);
}

export function getCodingQuestionById(id: string): CodingQuestion | undefined {
  return codingQuestions.find(question => question.id === id);
}

export function searchCodingQuestions(query: string): CodingQuestion[] {
  const lowercaseQuery = query.toLowerCase();
  return codingQuestions.filter(question =>
    question.title.toLowerCase().includes(lowercaseQuery) ||
    question.description.toLowerCase().includes(lowercaseQuery) ||
    question.category.toLowerCase().includes(lowercaseQuery)
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
    totalDesignPatterns: designPatterns.length,
    totalCodingQuestions: codingQuestions.length,
    totalRoadmapNodes: learningRoadmap.nodes.length,
    categoriesCount: getAllCategories().length,
    completedNodes: getNodesByStatus('completed').length,
    currentNodes: getNodesByStatus('current').length,
    lockedNodes: getNodesByStatus('locked').length
  };
}
