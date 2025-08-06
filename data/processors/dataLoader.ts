// Data loader utilities with STRICT lazy loading for memory optimization
// ONLY load config data - NO lesson data at startup

// Lazy import config only when needed
let configData: any = null;
async function getConfigData() {
  if (!configData) {
    configData = await import('../learn/config.json');
  }
  return configData;
}

// Lazy loading imports - data loaded on demand
let cachedModules: { [key: string]: any } = {};
let loadingPromises: { [key: string]: Promise<any> } = {};

// Lazy load functions for card files
async function loadCardModule(category: string): Promise<any> {
  const moduleKey = `cards-${category}`;
  
  if (cachedModules[moduleKey]) {
    return cachedModules[moduleKey];
  }
  
  if (loadingPromises[moduleKey]) {
    return await loadingPromises[moduleKey];
  }
  
  const loadPromise = (async () => {
    switch (category.toLowerCase()) {
      case 'fundamentals':
        return await import('../learn/cards/fundamentals.json');
      case 'data-structures':
        return await import('../learn/cards/data-structures.json');
      case 'control-flow':
        return await import('../learn/cards/control-flow.json');
      case 'web-development':
        return await import('../learn/cards/web-development.json');
      case 'asynchronous':
        return await import('../learn/cards/asynchronous.json');
      case 'advanced-concepts':
        return await import('../learn/cards/advanced-concepts.json');
      default:
        console.warn(`Unknown category: ${category}, loading fundamentals as fallback`);
        return await import('../learn/cards/fundamentals.json');
    }
  })();
  
  loadingPromises[moduleKey] = loadPromise;
  
  try {
    const module = await loadPromise;
    cachedModules[moduleKey] = module;
    delete loadingPromises[moduleKey];
    return module;
  } catch (error) {
    delete loadingPromises[moduleKey];
    console.error(`Failed to load card module: ${category}`, error);
    throw error;
  }
}

// Lazy load functions for explore data
async function loadExploreModule(type: string): Promise<any> {
  const moduleKey = `explore-${type}`;
  
  if (cachedModules[moduleKey]) {
    return cachedModules[moduleKey];
  }
  
  if (loadingPromises[moduleKey]) {
    return await loadingPromises[moduleKey];
  }
  
  const loadPromise = (async () => {
    switch (type) {
      case 'javascript-notes':
        return await import('../explore/javascript-notes.json');
      case 'practice-quiz':
        return await import('../explore/practice-quiz.json');
      case 'interview-prep':
        return await import('../explore/interview-prep.json');
      case 'interview-quiz':
        return await import('../explore/interview-quiz.json');
      case 'learning-roadmap':
        return await import('../explore/learning-roadmap.json');
      case 'design-patterns':
        return await import('../explore/design-patterns.json');
      case 'coding-questions':
        return await import('../explore/coding-questions.json');
      default:
        throw new Error(`Unknown explore type: ${type}`);
    }
  })();
  
  loadingPromises[moduleKey] = loadPromise;
  
  try {
    const module = await loadPromise;
    cachedModules[moduleKey] = module;
    delete loadingPromises[moduleKey];
    return module;
  } catch (error) {
    delete loadingPromises[moduleKey];
    console.error(`Failed to load explore module: ${type}`, error);
    throw error;
  }
}

// Lazy load functions for topic data
async function loadTopicModule(topicId: string): Promise<any> {
  const moduleKey = `topic-${topicId}`;
  
  if (cachedModules[moduleKey]) {
    return cachedModules[moduleKey];
  }
  
  if (loadingPromises[moduleKey]) {
    return await loadingPromises[moduleKey];
  }
  
  const loadPromise = (async () => {
    switch (topicId) {
      case 'easy':
        return await import('../learn/topics/easy.json');
      case 'medium':
        return await import('../learn/topics/medium.json');
      case 'hard':
        return await import('../learn/topics/hard.json');
      case 'interview':
        return await import('../learn/topics/interview.json');
      case 'fundamentals':
        return await import('../learn/topics/fundamentals.json');
      default:
        // For topics without dedicated JSON files, return null to trigger category-based fallback
        console.log(`No dedicated topic file for: ${topicId}, will use category-based loading`);
        return null;
    }
  })();
  
  loadingPromises[moduleKey] = loadPromise;
  
  try {
    const module = await loadPromise;
    cachedModules[moduleKey] = module;
    delete loadingPromises[moduleKey];
    return module;
  } catch (error) {
    delete loadingPromises[moduleKey];
    console.error(`Failed to load topic module: ${topicId}`, error);
    throw error;
  }
}

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
  contentDetails?: string; // New field for structured markdown content
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

// Helper function to get cards by category (now async with lazy loading)
export async function getCardsByCategory(category: string): Promise<LearnCard[]> {
  try {
    const module = await loadCardModule(category);
    return module.cards || [];
  } catch (error) {
    console.error(`Failed to load cards for category: ${category}`, error);
    return [];
  }
}

// Helper function to get all available categories (lazy)
export async function getAllCategories(): Promise<string[]> {
  const config = await getConfigData();
  return config.categories || [];
}

// Async function to get all lessons (loads all card files)
export async function getAllLessons(): Promise<LearnCard[]> {
  const categories = ['fundamentals', 'data-structures', 'control-flow', 'web-development', 'asynchronous', 'advanced-concepts'];
  const allLessons: LearnCard[] = [];
  
  for (const category of categories) {
    try {
      const lessons = await getCardsByCategory(category);
      allLessons.push(...lessons);
    } catch (error) {
      console.error(`Failed to load lessons for category: ${category}`, error);
    }
  }
  
  return allLessons;
}

// Get lesson by ID
export async function getLessonById(id: string): Promise<LearnCard | undefined> {
  try {
    const allLessons = await getAllLessons();
    return allLessons.find(lesson => lesson.id === id);
  } catch (error) {
    console.error(`Failed to load lesson by id: ${id}`, error);
    return undefined;
  }
}

// Export config data (loaded lazily)
export async function getLessonCategories(): Promise<string[]> {
  const config = await getConfigData();
  return config.categories || [];
}

export async function getLessonDifficulties(): Promise<string[]> {
  const config = await getConfigData();
  return config.difficulties || [];
}

// Topics loaded lazily but cached
let topicsCache: any[] | null = null;
export const topics = new Proxy([], {
  get: function(target, prop) {
    if (prop === 'find' || prop === 'filter' || prop === 'map') {
      // Return async-compatible methods
      return function(...args: any[]) {
        if (!topicsCache) {
          console.warn('Topics not loaded yet, using empty array');
          return [];
        }
        return Array.prototype[prop as any].apply(topicsCache, args);
      };
    }
    return topicsCache?.[prop as any];
  }
});

// Initialize topics lazily
export async function initializeTopics(): Promise<any[]> {
  if (!topicsCache) {
    const config = await getConfigData();
    topicsCache = config.topics || [];
    console.log(`⚡ Loaded ${topicsCache.length} topics lazily`);
  }
  return topicsCache;
}

// Memory optimization: Clear unused modules
export function clearUnusedModules(keepModules: string[] = []): void {
  const moduleKeys = Object.keys(cachedModules);
  let clearedCount = 0;
  
  moduleKeys.forEach(key => {
    if (!keepModules.includes(key)) {
      delete cachedModules[key];
      clearedCount++;
    }
  });
  
  console.log(`🧹 Memory optimization: Cleared ${clearedCount} unused modules`);
}

// Get memory usage statistics
export function getMemoryStats(): { loadedModules: number; moduleKeys: string[]; estimatedSize: string } {
  const moduleKeys = Object.keys(cachedModules);
  let estimatedSize = 0;
  
  // Rough estimation of memory usage
  Object.values(cachedModules).forEach((module) => {
    estimatedSize += JSON.stringify(module).length;
  });
  
  return {
    loadedModules: moduleKeys.length,
    moduleKeys,
    estimatedSize: `${(estimatedSize / 1024).toFixed(2)} KB`
  };
}

// JavaScript Notes (lazy loaded)
export async function getNotes(): Promise<JavaScriptNote[]> {
  try {
    const module = await loadExploreModule('javascript-notes');
    return module.notes || [];
  } catch (error) {
    console.error('Failed to load JavaScript notes', error);
    return [];
  }
}

export async function getNoteCategories(): Promise<string[]> {
  try {
    const module = await loadExploreModule('javascript-notes');
    return module.categories || [];
  } catch (error) {
    console.error('Failed to load note categories', error);
    return [];
  }
}

export async function getNotesByCategory(category: string): Promise<JavaScriptNote[]> {
  try {
    const notes = await getNotes();
    return notes.filter(note => note.category === category);
  } catch (error) {
    console.error(`Failed to load notes for category: ${category}`, error);
    return [];
  }
}

// Learn Cards utility functions (now async with lazy loading)
export async function getLessonsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<LearnCard[]> {
  try {
    const allLessons = await getAllLessons();
    return allLessons.filter(lesson => lesson.difficulty === difficulty);
  } catch (error) {
    console.error(`Failed to load lessons by difficulty: ${difficulty}`, error);
    return [];
  }
}

export async function getCompletedLessons(): Promise<LearnCard[]> {
  try {
    const allLessons = await getAllLessons();
    return allLessons.filter(lesson => lesson.isCompleted);
  } catch (error) {
    console.error('Failed to load completed lessons', error);
    return [];
  }
}

export async function getBookmarkedLessons(): Promise<LearnCard[]> {
  try {
    const allLessons = await getAllLessons();
    return allLessons.filter(lesson => lesson.isBookmarked);
  } catch (error) {
    console.error('Failed to load bookmarked lessons', error);
    return [];
  }
}

export async function searchLessons(query: string): Promise<LearnCard[]> {
  try {
    const allLessons = await getAllLessons();
    const lowercaseQuery = query.toLowerCase();
    return allLessons.filter(lesson =>
      lesson.title.toLowerCase().includes(lowercaseQuery) ||
      lesson.content.toLowerCase().includes(lowercaseQuery) ||
      lesson.description.toLowerCase().includes(lowercaseQuery) ||
      lesson.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error(`Failed to search lessons with query: ${query}`, error);
    return [];
  }
}

export async function getLessonsByTopic(topicId: string): Promise<LearnCard[]> {
  // If it's the default "all" topic or no topic, return fundamentals as default
  if (!topicId || topicId === 'all') {
    return await getCardsByCategory('fundamentals');
  }

  // Try to load topic-specific data first
  try {
    const topicModule = await loadTopicModule(topicId);
    if (topicModule && topicModule.cards) {
      return topicModule.cards as LearnCard[];
    }
    // If topicModule is null, fall through to category-based loading
  } catch (error) {
    console.warn(`No specific topic data for: ${topicId}, using category-based filtering`);
  }

  // Fallback to category-based loading with topic filtering
  const topic = topics.find((t: any) => t.id === topicId);
  if (!topic || !topic.filter) {
    return await getCardsByCategory('fundamentals');
  }

  const { filter } = topic;
  
  // Load lessons from the first category in the filter
  if (filter.category && filter.category.length > 0) {
    const categoryLessons = await getCardsByCategory(filter.category[0]);
    
    // Apply additional filtering if needed
    return categoryLessons.filter(lesson => {
      // Check difficulty filter
      if (filter.difficulty && !filter.difficulty.includes(lesson.difficulty)) {
        return false;
      }

      // Check tags filter
      if (filter.tags && !filter.tags.some((tag: string) => lesson.tags.includes(tag))) {
        return false;
      }

      return true;
    });
  }

  // Final fallback
  return await getCardsByCategory('fundamentals');
}

export async function getTopicInfo(topicId: string): Promise<any> {
  try {
    const module = await loadTopicModule(topicId);
    return module.topicInfo || topics.find((t: any) => t.id === topicId) || null;
  } catch (error) {
    console.error(`Failed to load topic info for: ${topicId}`, error);
    return topics.find((t: any) => t.id === topicId) || null;
  }
}

export async function getNotesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<JavaScriptNote[]> {
  try {
    const notes = await getNotes();
    return notes.filter(note => note.difficulty === difficulty);
  } catch (error) {
    console.error(`Failed to load notes by difficulty: ${difficulty}`, error);
    return [];
  }
}

export async function getNoteById(id: string): Promise<JavaScriptNote | undefined> {
  try {
    const notes = await getNotes();
    return notes.find(note => note.id === id);
  } catch (error) {
    console.error(`Failed to load note by id: ${id}`, error);
    return undefined;
  }
}

export async function searchNotes(query: string): Promise<JavaScriptNote[]> {
  try {
    const notes = await getNotes();
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error(`Failed to search notes with query: ${query}`, error);
    return [];
  }
}

// Practice Quizzes (lazy loaded)
export async function getQuizzes(): Promise<Quiz[]> {
  try {
    const module = await loadExploreModule('practice-quiz');
    return module.quizzes || [];
  } catch (error) {
    console.error('Failed to load quizzes', error);
    return [];
  }
}

export async function getQuizCategories(): Promise<string[]> {
  try {
    const module = await loadExploreModule('practice-quiz');
    return module.categories || [];
  } catch (error) {
    console.error('Failed to load quiz categories', error);
    return [];
  }
}

export async function getQuizzesByCategory(category: string): Promise<Quiz[]> {
  try {
    const quizzes = await getQuizzes();
    return quizzes.filter(quiz => quiz.category === category);
  } catch (error) {
    console.error(`Failed to load quizzes by category: ${category}`, error);
    return [];
  }
}

export async function getQuizzesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<Quiz[]> {
  try {
    const quizzes = await getQuizzes();
    return quizzes.filter(quiz => quiz.difficulty === difficulty);
  } catch (error) {
    console.error(`Failed to load quizzes by difficulty: ${difficulty}`, error);
    return [];
  }
}

export async function getQuizById(id: string): Promise<Quiz | undefined> {
  try {
    const quizzes = await getQuizzes();
    return quizzes.find(quiz => quiz.id === id);
  } catch (error) {
    console.error(`Failed to load quiz by id: ${id}`, error);
    return undefined;
  }
}

// Interview Prep (lazy loaded)
export async function getInterviewQuestions(): Promise<InterviewQuestion[]> {
  try {
    const module = await loadExploreModule('interview-prep');
    return module.interviewQuestions || [];
  } catch (error) {
    console.error('Failed to load interview questions', error);
    return [];
  }
}

export async function getInterviewCategories(): Promise<string[]> {
  try {
    const module = await loadExploreModule('interview-prep');
    return module.categories || [];
  } catch (error) {
    console.error('Failed to load interview categories', error);
    return [];
  }
}

export async function getInterviewQuestionsByCategory(category: string): Promise<InterviewQuestion[]> {
  try {
    const questions = await getInterviewQuestions();
    return questions.filter(question => question.category === category);
  } catch (error) {
    console.error(`Failed to load interview questions by category: ${category}`, error);
    return [];
  }
}

export async function getInterviewQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<InterviewQuestion[]> {
  try {
    const questions = await getInterviewQuestions();
    return questions.filter(question => question.difficulty === difficulty);
  } catch (error) {
    console.error(`Failed to load interview questions by difficulty: ${difficulty}`, error);
    return [];
  }
}

export async function getInterviewQuestionById(id: string): Promise<InterviewQuestion | undefined> {
  try {
    const questions = await getInterviewQuestions();
    return questions.find(question => question.id === id);
  } catch (error) {
    console.error(`Failed to load interview question by id: ${id}`, error);
    return undefined;
  }
}

export async function searchInterviewQuestions(query: string): Promise<InterviewQuestion[]> {
  try {
    const questions = await getInterviewQuestions();
    const lowercaseQuery = query.toLowerCase();
    return questions.filter(question =>
      question.question.toLowerCase().includes(lowercaseQuery) ||
      question.answer.toLowerCase().includes(lowercaseQuery) ||
      question.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error(`Failed to search interview questions with query: ${query}`, error);
    return [];
  }
}

// Interview Quizzes (lazy loaded)
export async function getInterviewQuizzes(): Promise<Quiz[]> {
  try {
    const module = await loadExploreModule('interview-quiz');
    return module.interviewQuizzes || [];
  } catch (error) {
    console.error('Failed to load interview quizzes', error);
    return [];
  }
}

export async function getInterviewQuizCategories(): Promise<string[]> {
  try {
    const module = await loadExploreModule('interview-quiz');
    return module.categories || [];
  } catch (error) {
    console.error('Failed to load interview quiz categories', error);
    return [];
  }
}

export async function getInterviewQuizzesByCategory(category: string): Promise<Quiz[]> {
  try {
    const quizzes = await getInterviewQuizzes();
    return quizzes.filter(quiz => quiz.category === category);
  } catch (error) {
    console.error(`Failed to load interview quizzes by category: ${category}`, error);
    return [];
  }
}

export async function getInterviewQuizById(id: string): Promise<Quiz | undefined> {
  try {
    const quizzes = await getInterviewQuizzes();
    return quizzes.find(quiz => quiz.id === id);
  } catch (error) {
    console.error(`Failed to load interview quiz by id: ${id}`, error);
    return undefined;
  }
}

// Learning Roadmap (lazy loaded)
export async function getLearningRoadmap(): Promise<LearningRoadmap> {
  try {
    const module = await loadExploreModule('learning-roadmap');
    return module.roadmap || { title: '', description: '', totalNodes: 0, estimatedTime: '', nodes: [], connections: [] };
  } catch (error) {
    console.error('Failed to load learning roadmap', error);
    return { title: '', description: '', totalNodes: 0, estimatedTime: '', nodes: [], connections: [] };
  }
}

export async function getRoadmapNodeById(id: string): Promise<RoadmapNode | undefined> {
  try {
    const roadmap = await getLearningRoadmap();
    return roadmap.nodes.find(node => node.id === id);
  } catch (error) {
    console.error(`Failed to load roadmap node by id: ${id}`, error);
    return undefined;
  }
}

export async function getNodesByLevel(level: number): Promise<RoadmapNode[]> {
  try {
    const roadmap = await getLearningRoadmap();
    return roadmap.nodes.filter(node => node.level === level);
  } catch (error) {
    console.error(`Failed to load nodes by level: ${level}`, error);
    return [];
  }
}

export async function getNodesByStatus(status: 'completed' | 'current' | 'locked'): Promise<RoadmapNode[]> {
  try {
    const roadmap = await getLearningRoadmap();
    return roadmap.nodes.filter(node => node.status === status);
  } catch (error) {
    console.error(`Failed to load nodes by status: ${status}`, error);
    return [];
  }
}

export async function getPrerequisites(nodeId: string): Promise<RoadmapNode[]> {
  try {
    const node = await getRoadmapNodeById(nodeId);
    if (!node) return [];
    
    const roadmap = await getLearningRoadmap();
    return node.prerequisites.map(prereqId => roadmap.nodes.find(n => n.id === prereqId)).filter(Boolean) as RoadmapNode[];
  } catch (error) {
    console.error(`Failed to load prerequisites for node: ${nodeId}`, error);
    return [];
  }
}

export async function getNextNodes(nodeId: string): Promise<RoadmapNode[]> {
  try {
    const roadmap = await getLearningRoadmap();
    return roadmap.nodes.filter(node => node.prerequisites.includes(nodeId));
  } catch (error) {
    console.error(`Failed to load next nodes for: ${nodeId}`, error);
    return [];
  }
}

// Design Patterns (lazy loaded)
export async function getDesignPatterns(): Promise<DesignPattern[]> {
  try {
    const module = await loadExploreModule('design-patterns');
    return module.designPatterns || [];
  } catch (error) {
    console.error('Failed to load design patterns', error);
    return [];
  }
}

export async function getDesignPatternCategories(): Promise<string[]> {
  try {
    const module = await loadExploreModule('design-patterns');
    return module.categories || [];
  } catch (error) {
    console.error('Failed to load design pattern categories', error);
    return [];
  }
}

export async function getDesignPatternsByCategory(category: string): Promise<DesignPattern[]> {
  try {
    const patterns = await getDesignPatterns();
    return patterns.filter(pattern => pattern.category === category);
  } catch (error) {
    console.error(`Failed to load design patterns by category: ${category}`, error);
    return [];
  }
}

export async function getDesignPatternsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<DesignPattern[]> {
  try {
    const patterns = await getDesignPatterns();
    return patterns.filter(pattern => pattern.difficulty === difficulty);
  } catch (error) {
    console.error(`Failed to load design patterns by difficulty: ${difficulty}`, error);
    return [];
  }
}

export async function getDesignPatternById(id: string): Promise<DesignPattern | undefined> {
  try {
    const patterns = await getDesignPatterns();
    return patterns.find(pattern => pattern.id === id);
  } catch (error) {
    console.error(`Failed to load design pattern by id: ${id}`, error);
    return undefined;
  }
}

export async function searchDesignPatterns(query: string): Promise<DesignPattern[]> {
  try {
    const patterns = await getDesignPatterns();
    const lowercaseQuery = query.toLowerCase();
    return patterns.filter(pattern =>
      pattern.name.toLowerCase().includes(lowercaseQuery) ||
      pattern.description.toLowerCase().includes(lowercaseQuery) ||
      pattern.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error(`Failed to search design patterns with query: ${query}`, error);
    return [];
  }
}

// Coding Questions (lazy loaded)
export async function getCodingQuestions(): Promise<CodingQuestion[]> {
  try {
    const module = await loadExploreModule('coding-questions');
    return module.codingQuestions || [];
  } catch (error) {
    console.error('Failed to load coding questions', error);
    return [];
  }
}

export async function getCodingQuestionCategories(): Promise<string[]> {
  try {
    const module = await loadExploreModule('coding-questions');
    return module.categories || [];
  } catch (error) {
    console.error('Failed to load coding question categories', error);
    return [];
  }
}

export async function getCodingQuestionDifficulties(): Promise<string[]> {
  try {
    const module = await loadExploreModule('coding-questions');
    return module.difficulties || [];
  } catch (error) {
    console.error('Failed to load coding question difficulties', error);
    return [];
  }
}

export async function getCodingQuestionsByCategory(category: string): Promise<CodingQuestion[]> {
  try {
    const questions = await getCodingQuestions();
    return questions.filter(question => question.category === category);
  } catch (error) {
    console.error(`Failed to load coding questions by category: ${category}`, error);
    return [];
  }
}

export async function getCodingQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<CodingQuestion[]> {
  try {
    const questions = await getCodingQuestions();
    return questions.filter(question => question.difficulty === difficulty);
  } catch (error) {
    console.error(`Failed to load coding questions by difficulty: ${difficulty}`, error);
    return [];
  }
}

export async function getCodingQuestionById(id: string): Promise<CodingQuestion | undefined> {
  try {
    const questions = await getCodingQuestions();
    return questions.find(question => question.id === id);
  } catch (error) {
    console.error(`Failed to load coding question by id: ${id}`, error);
    return undefined;
  }
}

export async function searchCodingQuestions(query: string): Promise<CodingQuestion[]> {
  try {
    const questions = await getCodingQuestions();
    const lowercaseQuery = query.toLowerCase();
    return questions.filter(question =>
      question.title.toLowerCase().includes(lowercaseQuery) ||
      question.description.toLowerCase().includes(lowercaseQuery) ||
      question.category.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error(`Failed to search coding questions with query: ${query}`, error);
    return [];
  }
}

// Utility functions
export function getRandomItems<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function getItemsByTag(tag: string): Promise<(JavaScriptNote | InterviewQuestion)[]> {
  try {
    const [notes, questions] = await Promise.all([
      getNotes(),
      getInterviewQuestions()
    ]);
    const notesWithTag = notes.filter(note => note.tags.includes(tag));
    const questionsWithTag = questions.filter(question => question.tags.includes(tag));
    return [...notesWithTag, ...questionsWithTag];
  } catch (error) {
    console.error(`Failed to load items by tag: ${tag}`, error);
    return [];
  }
}

// Statistics (lazy loaded)
export async function getStats() {
  try {
    const [
      notes,
      quizzes,
      interviewQuestions,
      interviewQuizzes,
      designPatterns,
      codingQuestions,
      roadmap,
      categories,
      completedNodes,
      currentNodes,
      lockedNodes
    ] = await Promise.all([
      getNotes(),
      getQuizzes(),
      getInterviewQuestions(),
      getInterviewQuizzes(),
      getDesignPatterns(),
      getCodingQuestions(),
      getLearningRoadmap(),
      getAllCategories(),
      getNodesByStatus('completed'),
      getNodesByStatus('current'),
      getNodesByStatus('locked')
    ]);
    
    return {
      totalNotes: notes.length,
      totalQuizzes: quizzes.length,
      totalInterviewQuestions: interviewQuestions.length,
      totalInterviewQuizzes: interviewQuizzes.length,
      totalDesignPatterns: designPatterns.length,
      totalCodingQuestions: codingQuestions.length,
      totalRoadmapNodes: roadmap.nodes.length,
      categoriesCount: categories.length,
      completedNodes: completedNodes.length,
      currentNodes: currentNodes.length,
      lockedNodes: lockedNodes.length
    };
  } catch (error) {
    console.error('Failed to load stats', error);
    return {
      totalNotes: 0,
      totalQuizzes: 0,
      totalInterviewQuestions: 0,
      totalInterviewQuizzes: 0,
      totalDesignPatterns: 0,
      totalCodingQuestions: 0,
      totalRoadmapNodes: 0,
      categoriesCount: 0,
      completedNodes: 0,
      currentNodes: 0,
      lockedNodes: 0
    };
  }
}

// Synchronous exports for immediate use (initially empty, populated by async functions)
export let designPatterns: DesignPattern[] = [];
export let codingQuestions: CodingQuestion[] = [];

// Initialize data on module load
(async () => {
  try {
    designPatterns = await getDesignPatterns();
    codingQuestions = await getCodingQuestions();
  } catch (error) {
    console.error('Failed to initialize synchronous exports:', error);
  }
})();
