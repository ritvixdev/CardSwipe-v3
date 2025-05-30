import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Code, Lightbulb, Target, Clock } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

// Coding questions data
const codingQuestionsData = [
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    description: 'Write a function that reverses a string',
    difficulty: 'easy',
    category: 'Strings',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    question: 'Given a string, write a function to reverse it without using built-in reverse methods.',
    codeExample: `function reverseString(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

// Alternative approach using two pointers
function reverseStringOptimal(str) {
  const arr = str.split('');
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    // Swap characters
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  
  return arr.join('');
}

// Usage
console.log(reverseString("hello")); // "olleh"
console.log(reverseStringOptimal("world")); // "dlrow"`,
    explanation: `This problem can be solved in multiple ways:

1. **Basic Approach**: Loop through the string backwards and build a new string. Simple but creates a new string.

2. **Two Pointers Approach**: Convert to array, use two pointers (left and right) and swap characters while moving towards center. More memory efficient.

3. **Key Concepts**:
   - String immutability in JavaScript
   - Array manipulation
   - Two-pointer technique
   - In-place vs out-of-place algorithms

The two-pointer approach is more efficient as it modifies the array in-place rather than creating a completely new string.`,
    hints: [
      'Think about iterating backwards through the string',
      'Consider using two pointers from start and end',
      'Remember that strings are immutable in JavaScript'
    ]
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Generate the nth Fibonacci number',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    question: 'Write a function that returns the nth number in the Fibonacci sequence. The sequence starts with 0, 1, 1, 2, 3, 5, 8...',
    codeExample: `// Recursive approach (inefficient)
function fibonacciRecursive(n) {
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// Iterative approach (efficient)
function fibonacci(n) {
  if (n <= 1) return n;
  
  let prev = 0;
  let curr = 1;
  
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}

// Memoization approach
function fibonacciMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}

// Usage
console.log(fibonacci(10)); // 55
console.log(fibonacciMemo(10)); // 55`,
    explanation: `The Fibonacci sequence is a classic example for understanding different algorithmic approaches:

1. **Recursive Approach**: Simple to understand but exponential time complexity O(2^n). Each call branches into two more calls.

2. **Iterative Approach**: Much more efficient with O(n) time and O(1) space. Uses bottom-up approach.

3. **Memoization**: Combines recursion with caching to avoid redundant calculations. O(n) time and space.

4. **Key Concepts**:
   - Recursion vs iteration
   - Dynamic programming
   - Memoization technique
   - Time/space complexity trade-offs

The iterative approach is usually preferred for its efficiency and simplicity.`,
    hints: [
      'Start with the base cases: F(0) = 0, F(1) = 1',
      'Think about building up from smaller subproblems',
      'Consider using variables to track previous values'
    ]
  },
  {
    id: 'two-sum',
    title: 'Two Sum Problem',
    description: 'Find two numbers that add up to a target',
    difficulty: 'easy',
    category: 'Arrays',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    question: 'Given an array of integers and a target sum, return the indices of two numbers that add up to the target.',
    codeExample: `// Brute force approach O(n²)
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

// Hash map approach O(n)
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}

// Usage
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target)); // [0, 1]`,
    explanation: `The Two Sum problem demonstrates the power of hash maps for optimization:

1. **Brute Force**: Check every pair of numbers. Simple but O(n²) time complexity.

2. **Hash Map Approach**: Use a hash map to store numbers we've seen and their indices. For each number, check if its complement exists.

3. **Key Concepts**:
   - Hash map/object for O(1) lookups
   - Complement calculation (target - current)
   - Trading space for time efficiency
   - Single-pass algorithm

4. **Algorithm Steps**:
   - For each number, calculate what we need (complement)
   - Check if we've seen the complement before
   - If yes, return indices; if no, store current number

This pattern of using hash maps for lookups is very common in coding interviews.`,
    hints: [
      'Think about what you need to find for each number',
      'Consider using a hash map to store previously seen numbers',
      'You only need to make one pass through the array'
    ]
  }
];

export default function CodingQuestionsScreen() {
  const themeColors = useThemeColors();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return themeColors.textSecondary;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Arrays': return '#8b5cf6';
      case 'Strings': return '#06b6d4';
      case 'Dynamic Programming': return '#f59e0b';
      case 'Trees': return '#10b981';
      default: return themeColors.primary;
    }
  };

  const QuestionCard = ({ question }: { question: any }) => {
    return (
      <View style={styles.questionContainer}>
        <TouchableOpacity
          style={[styles.questionCard, { backgroundColor: themeColors.card }]}
          onPress={() => router.push(`/(tabs)/explore/coding-questions/${question.id}` as any)}
        >
          <View style={styles.questionHeader}>
            <View style={styles.questionMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(question.category) }]}>
                <Text style={styles.categoryText}>{question.category}</Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(question.difficulty) }]}>
                <Text style={styles.difficultyText}>{question.difficulty}</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.questionTitle, { color: themeColors.text }]}>
            {question.title}
          </Text>

          <Text style={[styles.questionDescription, { color: themeColors.textSecondary }]}>
            {question.description}
          </Text>

          <View style={styles.complexityInfo}>
            <View style={styles.complexityItem}>
              <Clock size={14} color={themeColors.textSecondary} />
              <Text style={[styles.complexityText, { color: themeColors.textSecondary }]}>
                Time: {question.timeComplexity}
              </Text>
            </View>
            <View style={styles.complexityItem}>
              <Target size={14} color={themeColors.textSecondary} />
              <Text style={[styles.complexityText, { color: themeColors.textSecondary }]}>
                Space: {question.spaceComplexity}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back button and title in scrollable content */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: themeColors.text }]}>Coding Questions</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>
            Practice coding problems with detailed explanations
          </Text>
        </View>

        {/* Questions List */}
        <View style={styles.questionsContainer}>
          {codingQuestionsData.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 20,
    marginLeft: -4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  pageHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
  },
  questionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  questionContainer: {
    gap: 12,
  },
  questionCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  questionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  complexityInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  complexityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  complexityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  questionDetails: {
    padding: 20,
    borderRadius: 12,
    gap: 20,
  },
  problemSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  problemText: {
    fontSize: 14,
    lineHeight: 20,
  },
  codeSection: {
    gap: 12,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeContainer: {
    padding: 16,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  explanationSection: {
    gap: 12,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  hintsSection: {
    gap: 8,
  },
  hintText: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },
});
