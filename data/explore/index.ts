export interface ExploreCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  category: 'permanent' | 'resource';
  itemCount?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export const exploreCards: ExploreCard[] = [
  // Permanent cards (always at top)
  {
    id: 'completed',
    title: 'Completed Lessons',
    description: 'Review your completed JavaScript lessons and track your progress',
    icon: '✅',
    color: '#10b981', // green
    route: '/(tabs)/explore/completed',
    category: 'permanent',
    itemCount: 0 // Will be calculated dynamically
  },
  {
    id: 'bookmarks',
    title: 'Bookmarked Lessons',
    description: 'Quick access to your saved lessons for later review',
    icon: '🔖',
    color: '#3b82f6', // blue
    route: '/(tabs)/explore/bookmarks',
    category: 'permanent',
    itemCount: 0 // Will be calculated dynamically
  },
  
  // Resource cards
  {
    id: 'notes',
    title: 'JavaScript Notes',
    description: 'Essential concepts, tips, and explanations for JavaScript developers',
    icon: '📝',
    color: '#8b5cf6', // purple
    route: '/explore/notes',
    category: 'resource',
    itemCount: 5,
    difficulty: 'intermediate',
    estimatedTime: '20 min read',
    isPopular: true
  },
  {
    id: 'interview-notes',
    title: 'Interview Prep',
    description: 'Common JavaScript interview questions with detailed answers',
    icon: '💼',
    color: '#f59e0b', // amber
    route: '/explore/interview-notes',
    category: 'resource',
    itemCount: 5,
    difficulty: 'intermediate',
    estimatedTime: '30 min read',
    isPopular: true
  },
  {
    id: 'quizzes',
    title: 'Practice Quizzes',
    description: 'Test your JavaScript knowledge with interactive quizzes',
    icon: '🧠',
    color: '#ef4444', // red
    route: '/explore/quizzes',
    category: 'resource',
    itemCount: 3,
    difficulty: 'beginner',
    estimatedTime: '15 min each',
    isNew: true
  },
  {
    id: 'interview-quiz',
    title: 'Interview Quiz',
    description: 'Technical interview questions to prepare for job interviews',
    icon: '🎯',
    color: '#06b6d4', // cyan
    route: '/explore/interview-quiz',
    category: 'resource',
    itemCount: 2,
    difficulty: 'advanced',
    estimatedTime: '25 min each'
  },
  {
    id: 'roadmap',
    title: 'Learning Roadmap',
    description: 'Structured learning paths for frontend, backend, and full-stack development',
    icon: '🗺️',
    color: '#84cc16', // lime
    route: '/explore/roadmap',
    category: 'resource',
    itemCount: 3,
    difficulty: 'beginner',
    estimatedTime: '6-18 months',
    isPopular: true
  },
  {
    id: 'design-patterns',
    title: 'Design Patterns',
    description: 'Learn essential JavaScript design patterns with practical examples',
    icon: '🏗️',
    color: '#f97316', // orange
    route: '/explore/design-patterns',
    category: 'resource',
    itemCount: 5,
    difficulty: 'advanced',
    estimatedTime: '45 min read'
  }
];

export const exploreCategories = [
  {
    id: 'fundamentals',
    name: 'Fundamentals',
    description: 'Core JavaScript concepts and basics',
    cards: ['notes', 'quizzes']
  },
  {
    id: 'interview-prep',
    name: 'Interview Preparation',
    description: 'Get ready for technical interviews',
    cards: ['interview-notes', 'interview-quiz']
  },
  {
    id: 'advanced',
    name: 'Advanced Topics',
    description: 'Deep dive into complex JavaScript concepts',
    cards: ['design-patterns', 'roadmap']
  },
  {
    id: 'practice',
    name: 'Practice & Review',
    description: 'Reinforce your learning with practice',
    cards: ['completed', 'bookmarks', 'quizzes']
  }
];

export function getExploreCardsByCategory(category: 'permanent' | 'resource'): ExploreCard[] {
  return exploreCards.filter(card => card.category === category);
}

export function getExploreCardsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ExploreCard[] {
  return exploreCards.filter(card => card.difficulty === difficulty);
}

export function searchExploreCards(query: string): ExploreCard[] {
  const lowercaseQuery = query.toLowerCase();
  return exploreCards.filter(card => 
    card.title.toLowerCase().includes(lowercaseQuery) ||
    card.description.toLowerCase().includes(lowercaseQuery)
  );
}

export function getPopularCards(): ExploreCard[] {
  return exploreCards.filter(card => card.isPopular);
}

export function getNewCards(): ExploreCard[] {
  return exploreCards.filter(card => card.isNew);
}

export function updateCardItemCount(cardId: string, count: number): void {
  const card = exploreCards.find(c => c.id === cardId);
  if (card) {
    card.itemCount = count;
  }
}

// Export all data types for easy importing
export * from './notes';
export * from './interview-notes';
export * from './quizzes';
export * from './roadmap';
export * from './design-patterns';
