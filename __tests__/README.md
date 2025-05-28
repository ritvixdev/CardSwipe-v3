# 🧪 Comprehensive Test Suite for Tinder-Style Learning App

This test suite ensures the reliability, functionality, and user experience of our Tinder-style JavaScript learning app.

## 📁 Test Structure

```
__tests__/
├── components/           # Component unit tests
│   ├── LessonCard.test.tsx
│   ├── ProgressBar.test.tsx
│   └── XPNotification.test.tsx
├── store/               # State management tests
│   └── useProgressStore.test.ts
├── screens/             # Screen integration tests
│   └── LearnScreen.test.tsx
├── integration/         # End-to-end flow tests
│   └── SwipeFlow.test.tsx
├── utils/              # Test utilities
│   └── testUtils.tsx
├── setup.ts            # Test environment setup
└── README.md           # This file
```

## 🎯 Test Categories

### 1. **Unit Tests** (`components/`, `store/`)
- **Purpose**: Test individual components and functions in isolation
- **Coverage**: 
  - Component rendering
  - Props handling
  - State management
  - Function behavior
  - Edge cases

### 2. **Integration Tests** (`integration/`)
- **Purpose**: Test complete user flows and component interactions
- **Coverage**:
  - Swipe gesture flows
  - Progress tracking
  - XP system
  - Navigation between lessons

### 3. **Screen Tests** (`screens/`)
- **Purpose**: Test complete screen functionality
- **Coverage**:
  - Screen rendering
  - User interactions
  - State updates
  - Error handling

## 🚀 Running Tests

### Quick Start
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run comprehensive test suite
node scripts/test-runner.js
```

### Specific Test Categories
```bash
# Unit tests only
npm test -- --testPathPattern="__tests__/(store|components|utils)"

# Integration tests only
npm test -- --testPathPattern="__tests__/integration"

# Screen tests only
npm test -- --testPathPattern="__tests__/screens"

# Specific component
npm test -- LessonCard.test.tsx
```

### Advanced Options
```bash
# Run with coverage
npm test -- --coverage

# Run specific test pattern
npm test -- --testNamePattern="swipe"

# Run tests for changed files only
npm test -- --onlyChanged

# Debug mode
npm test -- --verbose
```

## 📊 Test Coverage Goals

| Category | Target Coverage |
|----------|----------------|
| **Statements** | 80%+ |
| **Branches** | 80%+ |
| **Functions** | 80%+ |
| **Lines** | 80%+ |

### Critical Components (95%+ Coverage Required)
- `useProgressStore` - Core state management
- `LessonCard` - Main interaction component
- Swipe gesture handlers
- Progress tracking logic

## 🔍 What Each Test File Covers

### `useProgressStore.test.ts`
- ✅ Initial state validation
- ✅ Lesson completion tracking
- ✅ Bookmark functionality
- ✅ XP calculation
- ✅ Day navigation
- ✅ Progress persistence
- ✅ Error handling

### `LessonCard.test.tsx`
- ✅ Content rendering
- ✅ Swipe gesture recognition
- ✅ Visual feedback during swipes
- ✅ Accessibility features
- ✅ Animation behavior
- ✅ Props validation

### `ProgressBar.test.tsx`
- ✅ XP display
- ✅ Progress calculation
- ✅ Streak visualization
- ✅ Day counter
- ✅ Edge cases (zero values)

### `XPNotification.test.tsx`
- ✅ Animation lifecycle
- ✅ Visibility control
- ✅ XP amount display
- ✅ Completion callbacks
- ✅ Accessibility

### `LearnScreen.test.tsx`
- ✅ Screen composition
- ✅ Component integration
- ✅ User interaction flows
- ✅ State management integration
- ✅ Error boundaries

### `SwipeFlow.test.tsx`
- ✅ Complete learning sessions
- ✅ Multi-lesson navigation
- ✅ Progress persistence
- ✅ Performance under load
- ✅ Edge case handling

## 🛠 Test Utilities

### `testUtils.tsx`
Provides helper functions for consistent testing:

```typescript
// Mock data creation
const mockLesson = createMockLesson({ title: 'Test Lesson' });
const mockProgress = createMockProgressState({ xp: 100 });

// Gesture simulation
simulateSwipe(element, 'left');

// Animation testing
flushAnimations();
await waitForAnimation(300);

// Store management
resetStore();

// Performance testing
const renderTime = measureRenderTime(() => render(<Component />));

// Accessibility validation
const issues = checkAccessibility(element);
```

## 🐛 Common Test Patterns

### Testing Swipe Gestures
```typescript
it('should complete lesson on left swipe', async () => {
  const { getByTestId } = render(<LessonCard {...props} />);
  
  simulateSwipe(getByTestId('lesson-card'), 'left');
  
  expect(mockOnSwipeLeft).toHaveBeenCalled();
});
```

### Testing State Updates
```typescript
it('should update XP when lesson completed', () => {
  const { result } = renderHook(() => useProgressStore());
  
  act(() => {
    result.current.markAsCompleted(1);
  });
  
  expect(result.current.xp).toBe(50);
});
```

### Testing Animations
```typescript
it('should animate XP notification', async () => {
  const { getByTestId } = render(<XPNotification visible={true} xpGained={50} />);
  
  flushAnimations();
  
  expect(getByTestId('xp-notification')).toBeTruthy();
});
```

## 🚨 Test Failure Debugging

### Common Issues and Solutions

1. **Gesture Handler Mocks**
   ```typescript
   // Ensure proper mocking in setup.ts
   jest.mock('react-native-gesture-handler/jestSetup');
   ```

2. **Async State Updates**
   ```typescript
   // Use act() for state updates
   await act(async () => {
     result.current.markAsCompleted(1);
   });
   ```

3. **Animation Testing**
   ```typescript
   // Mock timers for animation tests
   jest.useFakeTimers();
   jest.runAllTimers();
   ```

4. **Store Persistence**
   ```typescript
   // Reset store between tests
   beforeEach(() => {
     useProgressStore.getState().resetProgress();
   });
   ```

## 📈 Continuous Integration

### GitHub Actions Integration
```yaml
- name: Run Tests
  run: |
    npm ci
    npm run test:ci
    
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test -- --onlyChanged --passWithNoTests"
    }
  }
}
```

## 🎯 Testing Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the user experiences
   - Test public APIs, not internal state

2. **Use Descriptive Test Names**
   ```typescript
   it('should show XP notification when lesson is completed')
   // Better than: it('should work')
   ```

3. **Arrange, Act, Assert Pattern**
   ```typescript
   // Arrange
   const mockProps = { lesson: mockLesson };
   
   // Act
   const { getByText } = render(<LessonCard {...mockProps} />);
   
   // Assert
   expect(getByText(mockLesson.title)).toBeTruthy();
   ```

4. **Test Edge Cases**
   - Empty states
   - Error conditions
   - Boundary values
   - Network failures

5. **Keep Tests Independent**
   - Each test should be able to run in isolation
   - Use proper setup/teardown

## 🔧 Maintenance

### Regular Tasks
- [ ] Update test snapshots when UI changes
- [ ] Review and update coverage thresholds
- [ ] Add tests for new features
- [ ] Remove tests for deprecated features
- [ ] Performance test optimization

### Monthly Reviews
- [ ] Analyze test execution time
- [ ] Review flaky tests
- [ ] Update testing dependencies
- [ ] Assess test coverage gaps

---

**Remember**: Good tests are an investment in code quality and developer confidence. They catch bugs early, enable safe refactoring, and serve as living documentation of your app's behavior! 🚀
