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
import { ArrowLeft, Code, CheckCircle, XCircle, Lightbulb } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

// Design patterns data (same as in main page)
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
    explanation: 'The Singleton pattern restricts instantiation of a class to one object. This is useful when exactly one object is needed to coordinate actions across the system.',
    detailedExplanation: `The Singleton pattern is one of the most commonly used design patterns in software development. It ensures that a class has only one instance throughout the application lifecycle and provides a global point of access to that instance.

**Key Characteristics:**
- Only one instance of the class can exist
- Global access point to the instance
- Lazy initialization (instance created when first needed)
- Thread-safe implementation considerations

**When to Use:**
- Database connection pools
- Logging services
- Configuration settings
- Cache implementations
- Thread pools

**Implementation Considerations:**
- Thread safety in multi-threaded environments
- Lazy vs eager initialization
- Serialization and deserialization
- Reflection attacks prevention

**Real-world Examples:**
- Database drivers often use Singleton for connection management
- Logger instances in most logging frameworks
- Application configuration managers
- Device drivers and hardware interfaces`,
    alternatives: [
      'Dependency Injection - Better for testing and flexibility',
      'Factory Pattern - When you need multiple instances with different configurations',
      'Service Locator - For managing multiple singleton-like services'
    ]
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
    explanation: 'The Observer pattern allows objects to be notified of changes in other objects without being tightly coupled. Perfect for implementing event systems.',
    detailedExplanation: `The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

**Key Components:**
- Subject (Observable) - Maintains list of observers and notifies them
- Observer - Interface for objects that should be notified
- Concrete Subject - Stores state and sends notifications
- Concrete Observer - Implements update interface

**Benefits:**
- Loose coupling between subject and observers
- Dynamic relationships can be established at runtime
- Support for broadcast communication
- Open/closed principle compliance

**Common Use Cases:**
- Model-View architectures (MVC, MVP, MVVM)
- Event handling systems
- Reactive programming (RxJS, Redux)
- Real-time data updates
- User interface updates

**Implementation Variants:**
- Push model - Subject sends detailed data
- Pull model - Observers request data when notified
- Event-driven systems
- Publish-Subscribe pattern

**Modern JavaScript Examples:**
- DOM event listeners
- Node.js EventEmitter
- React state management
- Vue.js reactivity system`,
    alternatives: [
      'Publish-Subscribe - More decoupled with message broker',
      'Event Bus - Centralized event management',
      'Reactive Streams - For handling asynchronous data flows'
    ]
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
    explanation: 'The Factory pattern provides an interface for creating objects without specifying their exact classes. It encapsulates object creation logic.',
    detailedExplanation: `The Factory pattern is a creational design pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.

**Types of Factory Patterns:**
1. Simple Factory - Not a true pattern, but a programming idiom
2. Factory Method - Creates objects through inheritance
3. Abstract Factory - Creates families of related objects

**Key Benefits:**
- Encapsulates object creation logic
- Reduces coupling between client and concrete classes
- Makes code more flexible and extensible
- Centralizes object creation for easier maintenance

**When to Use:**
- When you don't know beforehand the exact types of objects
- When you want to provide a library of products
- When you want to extend the library with new products
- When you need to delegate object creation to subclasses

**Real-world Applications:**
- UI component libraries (React, Vue components)
- Database drivers (MySQL, PostgreSQL, MongoDB)
- File format parsers (JSON, XML, CSV)
- Plugin architectures
- Game object creation systems

**JavaScript Examples:**
- Document.createElement() in DOM
- Array.from() method
- Promise.resolve() and Promise.reject()
- React.createElement()`,
    alternatives: [
      'Builder Pattern - For complex object construction',
      'Prototype Pattern - For cloning existing objects',
      'Dependency Injection - For managing object dependencies'
    ]
  }
];

export default function DesignPatternDetailScreen() {
  const themeColors = useThemeColors();
  const { id } = useLocalSearchParams();
  
  const pattern = designPatternsData.find(p => p.id === id);
  
  if (!pattern) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.text }]}>
          Pattern not found
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
      case 'Creational': return '#8b5cf6';
      case 'Structural': return '#06b6d4';
      case 'Behavioral': return '#f59e0b';
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
            <Text style={[styles.title, { color: themeColors.text }]}>{pattern.title}</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>
            {pattern.description}
          </Text>
          
          <View style={styles.badges}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(pattern.category) }]}>
              <Text style={styles.badgeText}>{pattern.category}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(pattern.difficulty) }]}>
              <Text style={styles.badgeText}>{pattern.difficulty}</Text>
            </View>
          </View>
        </View>

        {/* Detailed Explanation */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <View style={styles.sectionHeader}>
            <Lightbulb size={20} color={themeColors.primary} />
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Detailed Explanation
            </Text>
          </View>
          <Text style={[styles.detailedText, { color: themeColors.textSecondary }]}>
            {pattern.detailedExplanation}
          </Text>
        </View>

        {/* Code Example */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <View style={styles.sectionHeader}>
            <Code size={20} color={themeColors.primary} />
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Implementation Example
            </Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={[styles.codeContainer, { backgroundColor: themeColors.background }]}
          >
            <Text style={[styles.codeText, { color: themeColors.text }]}>
              {pattern.codeExample}
            </Text>
          </ScrollView>
        </View>

        {/* Pros and Cons */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Pros and Cons
          </Text>
          
          <View style={styles.prosConsContainer}>
            <View style={styles.prosContainer}>
              <Text style={[styles.prosConsTitle, { color: '#10b981' }]}>Pros</Text>
              {pattern.pros.map((pro: string, index: number) => (
                <View key={index} style={styles.prosConsItem}>
                  <CheckCircle size={16} color="#10b981" />
                  <Text style={[styles.prosConsText, { color: themeColors.text }]}>
                    {pro}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.consContainer}>
              <Text style={[styles.prosConsTitle, { color: '#ef4444' }]}>Cons</Text>
              {pattern.cons.map((con: string, index: number) => (
                <View key={index} style={styles.prosConsItem}>
                  <XCircle size={16} color="#ef4444" />
                  <Text style={[styles.prosConsText, { color: themeColors.text }]}>
                    {con}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Alternatives */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Alternative Patterns
          </Text>
          {pattern.alternatives.map((alternative: string, index: number) => (
            <Text key={index} style={[styles.alternativeText, { color: themeColors.textSecondary }]}>
              • {alternative}
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
  detailedText: {
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
  prosConsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  prosContainer: {
    flex: 1,
  },
  consContainer: {
    flex: 1,
  },
  prosConsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  prosConsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  prosConsText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  alternativeText: {
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
