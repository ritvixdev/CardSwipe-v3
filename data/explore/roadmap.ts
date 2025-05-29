export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  prerequisites: string[];
  skills: string[];
  resources: {
    type: 'lesson' | 'practice' | 'project' | 'reading';
    title: string;
    url?: string;
    completed?: boolean;
  }[];
  order: number;
}

export interface RoadmapPath {
  id: string;
  title: string;
  description: string;
  totalTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  items: RoadmapItem[];
}

export const roadmapPaths: RoadmapPath[] = [
  {
    id: 'frontend-path',
    title: 'Frontend Developer Roadmap',
    description: 'Complete path to becoming a proficient frontend developer with JavaScript, React, and modern tools.',
    totalTime: '6-12 months',
    difficulty: 'beginner',
    items: [
      {
        id: 'html-css',
        title: 'HTML & CSS Fundamentals',
        description: 'Master the building blocks of web development',
        category: 'Foundation',
        level: 'beginner',
        estimatedTime: '2-4 weeks',
        prerequisites: [],
        skills: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'Grid'],
        resources: [
          { type: 'lesson', title: 'HTML Basics', completed: false },
          { type: 'lesson', title: 'CSS Fundamentals', completed: false },
          { type: 'practice', title: 'Build a Landing Page', completed: false },
          { type: 'project', title: 'Portfolio Website', completed: false }
        ],
        order: 1
      },
      {
        id: 'js-fundamentals',
        title: 'JavaScript Fundamentals',
        description: 'Learn core JavaScript concepts and programming principles',
        category: 'Programming',
        level: 'beginner',
        estimatedTime: '4-6 weeks',
        prerequisites: ['html-css'],
        skills: ['Variables', 'Functions', 'Objects', 'Arrays', 'DOM Manipulation'],
        resources: [
          { type: 'lesson', title: 'JavaScript Basics', completed: false },
          { type: 'lesson', title: 'Functions and Scope', completed: false },
          { type: 'practice', title: 'Interactive Web Page', completed: false },
          { type: 'project', title: 'Calculator App', completed: false }
        ],
        order: 2
      },
      {
        id: 'js-advanced',
        title: 'Advanced JavaScript',
        description: 'Master advanced concepts like closures, prototypes, and async programming',
        category: 'Programming',
        level: 'intermediate',
        estimatedTime: '3-4 weeks',
        prerequisites: ['js-fundamentals'],
        skills: ['Closures', 'Prototypes', 'Async/Await', 'ES6+', 'Modules'],
        resources: [
          { type: 'lesson', title: 'Closures and Scope', completed: false },
          { type: 'lesson', title: 'Promises and Async/Await', completed: false },
          { type: 'practice', title: 'API Integration', completed: false },
          { type: 'project', title: 'Weather App', completed: false }
        ],
        order: 3
      },
      {
        id: 'react-basics',
        title: 'React Fundamentals',
        description: 'Learn the most popular JavaScript library for building user interfaces',
        category: 'Framework',
        level: 'intermediate',
        estimatedTime: '4-6 weeks',
        prerequisites: ['js-advanced'],
        skills: ['Components', 'JSX', 'Props', 'State', 'Event Handling'],
        resources: [
          { type: 'lesson', title: 'React Components', completed: false },
          { type: 'lesson', title: 'State Management', completed: false },
          { type: 'practice', title: 'Todo App', completed: false },
          { type: 'project', title: 'E-commerce Site', completed: false }
        ],
        order: 4
      },
      {
        id: 'react-advanced',
        title: 'Advanced React',
        description: 'Master hooks, context, and advanced React patterns',
        category: 'Framework',
        level: 'advanced',
        estimatedTime: '3-4 weeks',
        prerequisites: ['react-basics'],
        skills: ['Hooks', 'Context API', 'Performance', 'Testing', 'Patterns'],
        resources: [
          { type: 'lesson', title: 'React Hooks', completed: false },
          { type: 'lesson', title: 'Context and State Management', completed: false },
          { type: 'practice', title: 'Complex State App', completed: false },
          { type: 'project', title: 'Social Media Dashboard', completed: false }
        ],
        order: 5
      },
      {
        id: 'tools-deployment',
        title: 'Tools & Deployment',
        description: 'Learn modern development tools and deployment strategies',
        category: 'DevOps',
        level: 'intermediate',
        estimatedTime: '2-3 weeks',
        prerequisites: ['react-advanced'],
        skills: ['Git', 'Webpack', 'NPM', 'Deployment', 'CI/CD'],
        resources: [
          { type: 'lesson', title: 'Git and Version Control', completed: false },
          { type: 'lesson', title: 'Build Tools', completed: false },
          { type: 'practice', title: 'Deploy to Netlify', completed: false },
          { type: 'project', title: 'Full Stack Application', completed: false }
        ],
        order: 6
      }
    ]
  },
  {
    id: 'backend-path',
    title: 'Backend Developer Roadmap',
    description: 'Learn server-side development with Node.js, databases, and APIs.',
    totalTime: '8-12 months',
    difficulty: 'intermediate',
    items: [
      {
        id: 'node-basics',
        title: 'Node.js Fundamentals',
        description: 'Learn server-side JavaScript with Node.js',
        category: 'Backend',
        level: 'intermediate',
        estimatedTime: '3-4 weeks',
        prerequisites: ['js-advanced'],
        skills: ['Node.js', 'NPM', 'File System', 'HTTP', 'Modules'],
        resources: [
          { type: 'lesson', title: 'Node.js Basics', completed: false },
          { type: 'lesson', title: 'Working with Files', completed: false },
          { type: 'practice', title: 'CLI Tool', completed: false },
          { type: 'project', title: 'File Server', completed: false }
        ],
        order: 1
      },
      {
        id: 'express-apis',
        title: 'Express.js & APIs',
        description: 'Build RESTful APIs with Express.js framework',
        category: 'Backend',
        level: 'intermediate',
        estimatedTime: '4-5 weeks',
        prerequisites: ['node-basics'],
        skills: ['Express.js', 'REST APIs', 'Middleware', 'Routing', 'Authentication'],
        resources: [
          { type: 'lesson', title: 'Express.js Fundamentals', completed: false },
          { type: 'lesson', title: 'Building REST APIs', completed: false },
          { type: 'practice', title: 'Blog API', completed: false },
          { type: 'project', title: 'E-commerce API', completed: false }
        ],
        order: 2
      },
      {
        id: 'databases',
        title: 'Databases & Data Modeling',
        description: 'Learn to work with databases and design data models',
        category: 'Database',
        level: 'intermediate',
        estimatedTime: '4-6 weeks',
        prerequisites: ['express-apis'],
        skills: ['MongoDB', 'SQL', 'Data Modeling', 'Queries', 'Relationships'],
        resources: [
          { type: 'lesson', title: 'Database Fundamentals', completed: false },
          { type: 'lesson', title: 'MongoDB with Node.js', completed: false },
          { type: 'practice', title: 'User Management System', completed: false },
          { type: 'project', title: 'Full Stack App with DB', completed: false }
        ],
        order: 3
      }
    ]
  },
  {
    id: 'fullstack-path',
    title: 'Full Stack Developer Roadmap',
    description: 'Complete path covering both frontend and backend development.',
    totalTime: '12-18 months',
    difficulty: 'advanced',
    items: [
      {
        id: 'fullstack-foundation',
        title: 'Full Stack Foundation',
        description: 'Master both frontend and backend fundamentals',
        category: 'Full Stack',
        level: 'intermediate',
        estimatedTime: '8-10 weeks',
        prerequisites: [],
        skills: ['HTML/CSS', 'JavaScript', 'Node.js', 'React', 'Databases'],
        resources: [
          { type: 'lesson', title: 'Frontend Basics', completed: false },
          { type: 'lesson', title: 'Backend Basics', completed: false },
          { type: 'practice', title: 'CRUD Application', completed: false },
          { type: 'project', title: 'Task Management App', completed: false }
        ],
        order: 1
      },
      {
        id: 'advanced-fullstack',
        title: 'Advanced Full Stack',
        description: 'Learn advanced patterns, testing, and deployment',
        category: 'Full Stack',
        level: 'advanced',
        estimatedTime: '6-8 weeks',
        prerequisites: ['fullstack-foundation'],
        skills: ['Testing', 'Security', 'Performance', 'DevOps', 'Architecture'],
        resources: [
          { type: 'lesson', title: 'Testing Strategies', completed: false },
          { type: 'lesson', title: 'Security Best Practices', completed: false },
          { type: 'practice', title: 'Scalable Architecture', completed: false },
          { type: 'project', title: 'Production-Ready App', completed: false }
        ],
        order: 2
      }
    ]
  }
];

export const skillCategories = [
  'Foundation',
  'Programming',
  'Framework',
  'Backend',
  'Database',
  'DevOps',
  'Full Stack',
  'Specialized'
];

export function getRoadmapByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): RoadmapPath[] {
  return roadmapPaths.filter(path => path.difficulty === difficulty);
}

export function getNextRoadmapItem(pathId: string, currentItemId?: string): RoadmapItem | null {
  const path = roadmapPaths.find(p => p.id === pathId);
  if (!path) return null;

  if (!currentItemId) {
    return path.items.find(item => item.order === 1) || null;
  }

  const currentItem = path.items.find(item => item.id === currentItemId);
  if (!currentItem) return null;

  return path.items.find(item => item.order === currentItem.order + 1) || null;
}

export function calculateProgress(pathId: string): number {
  const path = roadmapPaths.find(p => p.id === pathId);
  if (!path) return 0;

  const totalResources = path.items.reduce((total, item) => total + item.resources.length, 0);
  const completedResources = path.items.reduce(
    (total, item) => total + item.resources.filter(r => r.completed).length,
    0
  );

  return totalResources > 0 ? (completedResources / totalResources) * 100 : 0;
}

export function getPrerequisites(itemId: string): RoadmapItem[] {
  const allItems = roadmapPaths.flatMap(path => path.items);
  const item = allItems.find(i => i.id === itemId);
  
  if (!item) return [];
  
  return item.prerequisites
    .map(prereqId => allItems.find(i => i.id === prereqId))
    .filter(Boolean) as RoadmapItem[];
}
