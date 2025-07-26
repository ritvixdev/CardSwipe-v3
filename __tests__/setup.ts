// Mock React for compatibility
import 'react-native-gesture-handler/jestSetup';

// Fix React testing library compatibility - disable shallow renderer
jest.mock('react-test-renderer/shallow', () => ({}), { virtual: true });
jest.mock('react-shallow-renderer', () => ({}), { virtual: true });

global.React = require('react');

// Detect infinite loops and excessive re-renders
let renderCount = 0;
let lastRenderTime = Date.now();

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Enhanced error logging to catch React issues
console.error = (...args) => {
  const message = args.join(' ');

  // Catch infinite loop errors
  if (message.includes('Maximum update depth exceeded')) {
    originalConsoleError('🚨 INFINITE LOOP DETECTED:', ...args);
    throw new Error('Test failed due to infinite loop: ' + message);
  }

  // Catch other React warnings that might indicate issues
  if (message.includes('Cannot read properties') ||
      message.includes('Cannot access before initialization') ||
      message.includes('Maximum call stack size exceeded')) {
    originalConsoleError('🚨 CRITICAL ERROR:', ...args);
    throw new Error('Test failed due to critical error: ' + message);
  }

  originalConsoleError(...args);
};

console.warn = (...args) => {
  const message = args.join(' ');

  // Track excessive re-renders
  if (message.includes('render') || message.includes('update')) {
    renderCount++;
    const now = Date.now();

    if (renderCount > 50 && (now - lastRenderTime) < 1000) {
      originalConsoleWarn('⚠️ EXCESSIVE RENDERS DETECTED:', renderCount, 'renders in', now - lastRenderTime, 'ms');
    }

    lastRenderTime = now;
  }

  originalConsoleWarn(...args);
};

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    PanGestureHandler: View,
    State: {},
    Directions: {},
  };
});

// Mock Animated API
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = () => ({
    start: jest.fn(),
  });
  RN.Animated.spring = () => ({
    start: jest.fn(),
  });
  return RN;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      name: 'CardSwipe-v3',
      slug: 'cardswipe-v3',
    },
  },
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', props, children);
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: any) => React.createElement('View', {}, children),
    SafeAreaView: ({ children }: any) => React.createElement('View', {}, children),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Check: 'Check',
  Bookmark: 'Bookmark',
  Star: 'Star',
  ChevronLeft: 'ChevronLeft',
  ChevronRight: 'ChevronRight',
  Play: 'Play',
  Code: 'Code',
  Clock: 'Clock',
  Target: 'Target',
  BookOpen: 'BookOpen',
  Award: 'Award',
  TrendingUp: 'TrendingUp',
  Calendar: 'Calendar',
  Settings: 'Settings',
  Moon: 'Moon',
  Sun: 'Sun',
  Volume2: 'Volume2',
  VolumeX: 'VolumeX',
  Bell: 'Bell',
  BellOff: 'BellOff',
  Trash2: 'Trash2',
  RotateCcw: 'RotateCcw',
}));

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 390, height: 844 })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Suppress console warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('Error:'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Mock stores
jest.mock('@/hooks/useThemeColors', () => ({
  useThemeColors: () => ({
    background: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#007AFF',
    card: '#f8f9fa',
    border: '#e0e0e0',
    success: '#4CAF50',
    error: '#F44336',
    inactive: '#999999',
  }),
}));

// Mock data loader
jest.mock('@/data/processors/dataLoader', () => ({
  lessons: [
    { id: 'lesson-001', title: 'Introduction to JavaScript', description: 'Learn the basics', day: 1, codeExample: 'console.log("Hello World");' },
    { id: 'lesson-002', title: 'Variables', description: 'Understanding variables', day: 2, codeExample: 'let x = 5;' },
    { id: 'lesson-003', title: 'Functions', description: 'Creating functions', day: 3, codeExample: 'function test() {}' },
  ]
}));

// Mock timers for animation testing
jest.useFakeTimers();

// Global test timeout
jest.setTimeout(10000);
