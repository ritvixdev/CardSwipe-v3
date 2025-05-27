export interface Quiz {
  question: string;
  options: string[];
  answer: string;
}

export interface Lesson {
  id: number;
  day: number;
  title: string;
  summary: string;
  details: string;
  codeExample: string;
  quiz?: Quiz;
}

export interface LessonProgress {
  completed: boolean;
  bookmarked: boolean;
  lastViewed?: string;
}

export type LessonProgressMap = Record<number, LessonProgress>;