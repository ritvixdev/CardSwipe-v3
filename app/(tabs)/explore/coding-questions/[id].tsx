import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Code, Lightbulb, Target, Clock, Brain } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

// Coding questions data (same as in main page)
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
    ],
    detailedExplanation: `String reversal is a fundamental problem that demonstrates several important programming concepts and techniques.

**Problem Analysis:**
The goal is to reverse a string efficiently. While JavaScript provides built-in methods like split().reverse().join(), understanding manual implementation helps grasp core concepts.

**Approach 1: Basic Iteration**
- Time Complexity: O(n)
- Space Complexity: O(n)
- Creates a new string by iterating backwards
- Simple to understand but not memory efficient

**Approach 2: Two Pointers**
- Time Complexity: O(n)
- Space Complexity: O(1) if we modify in-place
- More efficient memory usage
- Demonstrates pointer manipulation

**Key Learning Points:**
1. String immutability in JavaScript
2. Array manipulation techniques
3. In-place vs out-of-place algorithms
4. Time vs space complexity trade-offs

**Real-world Applications:**
- Text processing algorithms
- Palindrome checking
- Data validation
- Cryptographic operations`,
    variations: [
      'Reverse words in a sentence',
      'Reverse only alphabetic characters',
      'Reverse string with special characters',
      'Reverse string recursively'
    ],
    relatedProblems: [
      'Valid Palindrome',
      'Longest Palindromic Substring',
      'Reverse Words in a String',
      'Valid Anagram'
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
    ],
    detailedExplanation: `The Fibonacci sequence is a perfect example for learning dynamic programming and understanding the evolution from naive recursion to optimized solutions.

**Mathematical Definition:**
F(0) = 0, F(1) = 1
F(n) = F(n-1) + F(n-2) for n > 1

**Solution Evolution:**

**1. Naive Recursion:**
- Time: O(2^n) - Exponential
- Space: O(n) - Call stack
- Problems: Redundant calculations

**2. Memoization (Top-down DP):**
- Time: O(n) - Each subproblem solved once
- Space: O(n) - Memoization table + call stack
- Improvement: Caches results

**3. Iterative (Bottom-up DP):**
- Time: O(n) - Single loop
- Space: O(1) - Only track last two values
- Best: Most efficient approach

**Advanced Optimizations:**
- Matrix exponentiation: O(log n)
- Binet's formula: O(1) but floating point precision issues

**Real-world Applications:**
- Financial modeling (compound interest)
- Nature patterns (flower petals, tree branches)
- Algorithm analysis and optimization
- Computer graphics and fractals`,
    variations: [
      'Fibonacci with different starting values',
      'Sum of Fibonacci numbers',
      'Fibonacci modulo operations',
      'Matrix exponentiation approach'
    ],
    relatedProblems: [
      'Climbing Stairs',
      'House Robber',
      'Coin Change',
      'Minimum Path Sum'
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
    ],
    detailedExplanation: `Two Sum is often the first problem encountered in coding interviews and serves as an excellent introduction to hash table optimization techniques.

**Problem Understanding:**
Given an array and target, find two numbers that sum to target and return their indices.

**Approach Evolution:**

**1. Brute Force:**
- Check all possible pairs
- Time: O(n²), Space: O(1)
- Simple but inefficient for large inputs

**2. Hash Map Optimization:**
- Store seen numbers with their indices
- For each number, check if complement exists
- Time: O(n), Space: O(n)
- Classic space-time tradeoff

**Key Insights:**
1. **Complement Thinking**: For target T and current number X, we need (T - X)
2. **Hash Map Power**: O(1) lookup time enables linear solution
3. **Single Pass**: We can solve while building the hash map

**Edge Cases to Consider:**
- No solution exists
- Multiple valid solutions
- Duplicate numbers
- Negative numbers
- Array with less than 2 elements

**Interview Tips:**
- Always clarify assumptions (unique solution, sorted array, etc.)
- Start with brute force, then optimize
- Discuss time/space complexity
- Consider edge cases

**Extensions:**
- Three Sum, Four Sum
- Two Sum in sorted array (two pointers)
- Two Sum with multiple solutions`,
    variations: [
      'Two Sum II - Input array is sorted',
      'Three Sum',
      'Four Sum',
      'Two Sum - Data structure design'
    ],
    relatedProblems: [
      'Three Sum',
      'Four Sum',
      'Valid Anagram',
      'Group Anagrams'
    ]
  }
];

export default function CodingQuestionDetailScreen() {
  const themeColors = useThemeColors();
  const { id } = useLocalSearchParams();
  
  const question = codingQuestionsData.find(q => q.id === id);
  
  if (!question) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.text }]}>
          Question not found
        </Text>
      </View>
    );
  }

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
            <Text style={[styles.title, { color: themeColors.text }]}>{question.title}</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>
            {question.description}
          </Text>
          
          <View style={styles.badges}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(question.category) }]}>
              <Text style={styles.badgeText}>{question.category}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(question.difficulty) }]}>
              <Text style={styles.badgeText}>{question.difficulty}</Text>
            </View>
          </View>

          <View style={styles.complexityInfo}>
            <View style={styles.complexityItem}>
              <Clock size={16} color={themeColors.textSecondary} />
              <Text style={[styles.complexityText, { color: themeColors.textSecondary }]}>
                Time: {question.timeComplexity}
              </Text>
            </View>
            <View style={styles.complexityItem}>
              <Target size={16} color={themeColors.textSecondary} />
              <Text style={[styles.complexityText, { color: themeColors.textSecondary }]}>
                Space: {question.spaceComplexity}
              </Text>
            </View>
          </View>
        </View>

        {/* Problem Statement */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <View style={styles.sectionHeader}>
            <Brain size={20} color={themeColors.primary} />
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Problem Statement
            </Text>
          </View>
          <Text style={[styles.problemText, { color: themeColors.textSecondary }]}>
            {question.question}
          </Text>
        </View>

        {/* Solution Code */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <View style={styles.sectionHeader}>
            <Code size={20} color={themeColors.primary} />
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Solution
            </Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={[styles.codeContainer, { backgroundColor: themeColors.background }]}
          >
            <Text style={[styles.codeText, { color: themeColors.text }]}>
              {question.codeExample}
            </Text>
          </ScrollView>
        </View>

        {/* Detailed Explanation */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <View style={styles.sectionHeader}>
            <Lightbulb size={20} color={themeColors.primary} />
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Detailed Explanation
            </Text>
          </View>
          <Text style={[styles.explanationText, { color: themeColors.textSecondary }]}>
            {question.detailedExplanation}
          </Text>
        </View>

        {/* Hints */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Hints
          </Text>
          {question.hints.map((hint: string, index: number) => (
            <Text key={index} style={[styles.hintText, { color: themeColors.textSecondary }]}>
              {index + 1}. {hint}
            </Text>
          ))}
        </View>

        {/* Variations */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Problem Variations
          </Text>
          {question.variations.map((variation: string, index: number) => (
            <Text key={index} style={[styles.variationText, { color: themeColors.textSecondary }]}>
              • {variation}
            </Text>
          ))}
        </View>

        {/* Related Problems */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Related Problems
          </Text>
          {question.relatedProblems.map((problem: string, index: number) => (
            <Text key={index} style={[styles.relatedText, { color: themeColors.primary }]}>
              • {problem}
            </Text>
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
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  problemText: {
    fontSize: 14,
    lineHeight: 22,
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
  explanationText: {
    fontSize: 14,
    lineHeight: 22,
  },
  hintText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  variationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  relatedText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
