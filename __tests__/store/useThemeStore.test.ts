import { useThemeStore } from '@/store/useThemeStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Mock Appearance
jest.mock('react-native', () => ({
  Appearance: {
    getColorScheme: jest.fn(() => 'light'),
    addChangeListener: jest.fn(),
    removeChangeListener: jest.fn(),
  },
}));

describe('useThemeStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset store state
    useThemeStore.setState({
      mode: 'light',
      systemTheme: 'light',
      followSystem: false,
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useThemeStore.getState();

      expect(store.mode).toBe('light');
      expect(store.systemTheme).toBe('light');
      expect(store.followSystem).toBe(false);
    });

    it('should have valid theme mode', () => {
      const store = useThemeStore.getState();

      expect(['light', 'dark']).toContain(store.mode);
    });

    it('should have system theme property', () => {
      const store = useThemeStore.getState();

      expect(store.systemTheme).toBeDefined();
      expect(['light', 'dark']).toContain(store.systemTheme);
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle from light to dark', () => {
      const store = useThemeStore.getState();

      store.toggleTheme();

      const updatedStore = useThemeStore.getState();
      expect(updatedStore.mode).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      // Set to dark first
      useThemeStore.setState({ mode: 'dark' });

      const store = useThemeStore.getState();
      store.toggleTheme();

      const updatedStore = useThemeStore.getState();
      expect(updatedStore.mode).toBe('light');
    });

    it('should have toggle functionality', () => {
      const store = useThemeStore.getState();

      expect(typeof store.toggleTheme).toBe('function');
    });
  });

  describe('Basic Functionality', () => {
    it('should have setTheme function', () => {
      const store = useThemeStore.getState();

      expect(typeof store.setTheme).toBe('function');
    });

    it('should handle theme changes without errors', () => {
      const store = useThemeStore.getState();

      expect(() => {
        store.setTheme('dark');
        store.setTheme('light');
        store.toggleTheme();
      }).not.toThrow();
    });

  });
});
