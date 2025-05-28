module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/setup.ts'
  ],
  testMatch: [
    '**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.expo/',
    '<rootDir>/dist/',
    '<rootDir>/__tests__/setup.ts',
    '<rootDir>/__tests__/utils/'
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'store/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.expo/**',
    '!**/coverage/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo|@expo|@unimodules|unimodules|sentry-expo|native-base|react-clone-referenced-element|@react-native-community|react-native-gesture-handler|@react-native-async-storage|zustand)'
  ],
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
