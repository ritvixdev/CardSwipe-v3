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

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children }: any) => children,
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

// Mock timers for animation testing
jest.useFakeTimers();

// Global test timeout
jest.setTimeout(10000);
