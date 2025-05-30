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
import { ArrowLeft, Code, Eye, Layers, Zap, ArrowRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

// Design patterns data
const designPatternsData = [
  {
    id: 'singleton',
    title: 'Singleton Pattern',
    description: 'Ensures a class has only one instance and provides global access',
    category: 'Creational',
    difficulty: 'easy',
    icon: 'layers',
    useCase: 'Database connections, logging, caching',
    pros: ['Global access', 'Memory efficient', 'Lazy initialization'],
    cons: ['Hard to test', 'Violates single responsibility', 'Global state'],
    codeExample: `class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
    return this;
  }
  
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

// Usage
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true`,
    explanation: 'The Singleton pattern restricts instantiation of a class to one object. This is useful when exactly one object is needed to coordinate actions across the system.'
  },
  {
    id: 'observer',
    title: 'Observer Pattern',
    description: 'Defines a one-to-many dependency between objects',
    category: 'Behavioral',
    difficulty: 'medium',
    icon: 'eye',
    useCase: 'Event handling, MVC architecture, reactive programming',
    pros: ['Loose coupling', 'Dynamic relationships', 'Broadcast communication'],
    cons: ['Memory leaks', 'Unexpected updates', 'Complex debugging'],
    codeExample: `class Subject {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }
  
  update(data) {
    console.log(\`\${this.name} received: \${data}\`);
  }
}

// Usage
const subject = new Subject();
const observer1 = new Observer('Observer 1');
subject.subscribe(observer1);
subject.notify('Hello World!');`,
    explanation: 'The Observer pattern allows objects to be notified of changes in other objects without being tightly coupled. Perfect for implementing event systems.'
  },
  {
    id: 'factory',
    title: 'Factory Pattern',
    description: 'Creates objects without specifying their exact classes',
    category: 'Creational',
    difficulty: 'easy',
    icon: 'zap',
    useCase: 'Object creation, plugin systems, UI components',
    pros: ['Flexible object creation', 'Encapsulates creation logic', 'Easy to extend'],
    cons: ['Can become complex', 'Extra abstraction layer'],
    codeExample: `class CarFactory {
  static createCar(type) {
    switch(type) {
      case 'sedan':
        return new Sedan();
      case 'suv':
        return new SUV();
      case 'hatchback':
        return new Hatchback();
      default:
        throw new Error('Unknown car type');
    }
  }
}

class Sedan {
  constructor() {
    this.type = 'Sedan';
    this.doors = 4;
  }
}

class SUV {
  constructor() {
    this.type = 'SUV';
    this.doors = 5;
  }
}

// Usage
const myCar = CarFactory.createCar('sedan');
console.log(myCar.type); // 'Sedan'`,
    explanation: 'The Factory pattern provides an interface for creating objects without specifying their exact classes. It encapsulates object creation logic.'
  }
];

export default function DesignPatternsScreen() {
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
      case 'Creational': return '#8b5cf6';
      case 'Structural': return '#06b6d4';
      case 'Behavioral': return '#f59e0b';
      default: return themeColors.primary;
    }
  };

  const getPatternIcon = (iconType: string) => {
    switch (iconType) {
      case 'layers': return Layers;
      case 'eye': return Eye;
      case 'zap': return Zap;
      default: return Code;
    }
  };

  const PatternCard = ({ pattern }: { pattern: any }) => {
    const PatternIcon = getPatternIcon(pattern.icon);

    return (
      <View style={styles.patternContainer}>
        <TouchableOpacity
          style={[styles.patternCard, { backgroundColor: themeColors.card }]}
          onPress={() => router.push(`/(tabs)/explore/design-patterns/${pattern.id}` as any)}
        >
          <View style={styles.patternHeader}>
            <View style={[styles.patternIconContainer, { backgroundColor: getCategoryColor(pattern.category) }]}>
              <PatternIcon size={24} color="#ffffff" />
            </View>
            
            <View style={styles.patternMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(pattern.category) }]}>
                <Text style={styles.categoryText}>{pattern.category}</Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(pattern.difficulty) }]}>
                <Text style={styles.difficultyText}>{pattern.difficulty}</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.patternTitle, { color: themeColors.text }]}>
            {pattern.title}
          </Text>

          <Text style={[styles.patternDescription, { color: themeColors.textSecondary }]}>
            {pattern.description}
          </Text>

          <View style={styles.patternFooter}>
            <Text style={[styles.useCase, { color: themeColors.textSecondary }]}>
              Use case: {pattern.useCase}
            </Text>
            <ArrowRight size={16} color={themeColors.primary} />
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
            <Text style={[styles.title, { color: themeColors.text }]}>Design Patterns</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>
            Common software design patterns with examples
          </Text>
        </View>

        {/* Patterns List */}
        <View style={styles.patternsContainer}>
          {designPatternsData.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
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
  patternsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  patternContainer: {
    gap: 12,
  },
  patternCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patternIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternMeta: {
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
  patternTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  patternDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  patternFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  useCase: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  patternDetails: {
    padding: 20,
    borderRadius: 12,
    gap: 20,
  },
  prosConsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  prosContainer: {
    flex: 1,
    gap: 8,
  },
  consContainer: {
    flex: 1,
    gap: 8,
  },
  prosConsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  prosConsItem: {
    fontSize: 12,
    lineHeight: 18,
  },
  codeSection: {
    gap: 12,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
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
    gap: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
