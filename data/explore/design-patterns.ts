export interface DesignPattern {
  id: string;
  name: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  codeExample: string;
  realWorldExample: string;
  pros: string[];
  cons: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  relatedPatterns: string[];
}

export const designPatterns: DesignPattern[] = [
  {
    id: 'singleton',
    name: 'Singleton Pattern',
    category: 'Creational',
    description: 'Ensures a class has only one instance and provides global access to that instance.',
    problem: 'You need to ensure that a class has only one instance (like a database connection, logger, or configuration object) and provide a global point of access to it.',
    solution: 'Create a class that controls its own instantiation and ensures only one instance exists.',
    codeExample: `// Basic Singleton
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    
    this.data = [];
    Singleton.instance = this;
    return this;
  }
  
  addData(item) {
    this.data.push(item);
  }
  
  getData() {
    return this.data;
  }
}

// Usage
const instance1 = new Singleton();
const instance2 = new Singleton();

console.log(instance1 === instance2); // true

// Modern ES6 approach with closures
const DatabaseConnection = (() => {
  let instance;
  
  function createInstance() {
    return {
      connect() {
        console.log('Connected to database');
      },
      
      query(sql) {
        console.log(\`Executing: \${sql}\`);
      }
    };
  }
  
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// Usage
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true`,
    realWorldExample: 'Application configuration, database connections, logging services, caching mechanisms.',
    pros: [
      'Controlled access to sole instance',
      'Reduced memory footprint',
      'Global access point',
      'Lazy initialization possible'
    ],
    cons: [
      'Difficult to test',
      'Violates Single Responsibility Principle',
      'Can create tight coupling',
      'Concurrency issues in multi-threaded environments'
    ],
    difficulty: 'beginner',
    tags: ['creational', 'instance', 'global', 'memory'],
    relatedPatterns: ['factory', 'builder']
  },
  {
    id: 'observer',
    name: 'Observer Pattern',
    category: 'Behavioral',
    description: 'Defines a one-to-many dependency between objects so that when one object changes state, all dependents are notified.',
    problem: 'You need to notify multiple objects about changes in another object without creating tight coupling between them.',
    solution: 'Create a subject that maintains a list of observers and notifies them of any state changes.',
    codeExample: `// Observer Pattern Implementation
class Subject {
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
const newsletter = new Subject();

const subscriber1 = new Observer('John');
const subscriber2 = new Observer('Jane');

newsletter.subscribe(subscriber1);
newsletter.subscribe(subscriber2);

newsletter.notify('New article published!');
// Output:
// John received: New article published!
// Jane received: New article published!

// Real-world example: Event system
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

// Usage
const emitter = new EventEmitter();

emitter.on('user-login', (user) => {
  console.log(\`Welcome \${user.name}!\`);
});

emitter.on('user-login', (user) => {
  console.log(\`Logging activity for \${user.name}\`);
});

emitter.emit('user-login', { name: 'Alice' });`,
    realWorldExample: 'Event systems, Model-View architectures, DOM events, React state management, pub/sub systems.',
    pros: [
      'Loose coupling between subject and observers',
      'Dynamic relationships',
      'Broadcast communication',
      'Open/Closed Principle support'
    ],
    cons: [
      'Memory leaks if observers not properly removed',
      'Unexpected updates',
      'Complex update sequences',
      'Performance issues with many observers'
    ],
    difficulty: 'intermediate',
    tags: ['behavioral', 'events', 'notification', 'decoupling'],
    relatedPatterns: ['mediator', 'command']
  },
  {
    id: 'factory',
    name: 'Factory Pattern',
    category: 'Creational',
    description: 'Creates objects without specifying the exact class of object that will be created.',
    problem: 'You need to create objects but the exact type of object depends on runtime conditions or configuration.',
    solution: 'Create a factory function or class that encapsulates object creation logic.',
    codeExample: `// Simple Factory
class Car {
  constructor(type, color) {
    this.type = type;
    this.color = color;
  }
  
  start() {
    console.log(\`Starting \${this.color} \${this.type}\`);
  }
}

class CarFactory {
  static createCar(type, color) {
    switch (type) {
      case 'sedan':
        return new Car('Sedan', color);
      case 'suv':
        return new Car('SUV', color);
      case 'hatchback':
        return new Car('Hatchback', color);
      default:
        throw new Error('Unknown car type');
    }
  }
}

// Usage
const sedan = CarFactory.createCar('sedan', 'blue');
const suv = CarFactory.createCar('suv', 'red');

sedan.start(); // Starting blue Sedan
suv.start();   // Starting red SUV

// Factory Method Pattern
class VehicleFactory {
  createVehicle() {
    throw new Error('createVehicle method must be implemented');
  }
}

class CarFactory extends VehicleFactory {
  createVehicle(model) {
    return {
      type: 'Car',
      model,
      wheels: 4,
      start() {
        console.log(\`Car \${model} started\`);
      }
    };
  }
}

class BikeFactory extends VehicleFactory {
  createVehicle(model) {
    return {
      type: 'Bike',
      model,
      wheels: 2,
      start() {
        console.log(\`Bike \${model} started\`);
      }
    };
  }
}

// Abstract Factory Pattern
class UIFactory {
  createButton() {
    throw new Error('createButton must be implemented');
  }
  
  createInput() {
    throw new Error('createInput must be implemented');
  }
}

class WebUIFactory extends UIFactory {
  createButton() {
    return {
      type: 'web-button',
      render() {
        return '<button>Click me</button>';
      }
    };
  }
  
  createInput() {
    return {
      type: 'web-input',
      render() {
        return '<input type="text" />';
      }
    };
  }
}

class MobileUIFactory extends UIFactory {
  createButton() {
    return {
      type: 'mobile-button',
      render() {
        return 'Native Mobile Button';
      }
    };
  }
  
  createInput() {
    return {
      type: 'mobile-input',
      render() {
        return 'Native Mobile Input';
      }
    };
  }
}`,
    realWorldExample: 'React.createElement(), jQuery element creation, database connection factories, UI component libraries.',
    pros: [
      'Encapsulates object creation',
      'Reduces code duplication',
      'Easy to extend with new types',
      'Follows Open/Closed Principle'
    ],
    cons: [
      'Can become complex with many product types',
      'May introduce unnecessary abstraction',
      'Requires modification for new products (Simple Factory)'
    ],
    difficulty: 'beginner',
    tags: ['creational', 'instantiation', 'abstraction', 'polymorphism'],
    relatedPatterns: ['singleton', 'builder', 'prototype']
  },
  {
    id: 'module',
    name: 'Module Pattern',
    category: 'Structural',
    description: 'Provides a way to encapsulate private and public methods and variables, preventing pollution of the global scope.',
    problem: 'You need to create private scope and expose only specific functionality while avoiding global namespace pollution.',
    solution: 'Use closures to create private scope and return an object with public methods.',
    codeExample: `// Basic Module Pattern
const Calculator = (() => {
  // Private variables and methods
  let result = 0;
  
  function log(operation, value) {
    console.log(\`\${operation}: \${value}, Result: \${result}\`);
  }
  
  // Public API
  return {
    add(value) {
      result += value;
      log('Add', value);
      return this;
    },
    
    subtract(value) {
      result -= value;
      log('Subtract', value);
      return this;
    },
    
    multiply(value) {
      result *= value;
      log('Multiply', value);
      return this;
    },
    
    getResult() {
      return result;
    },
    
    reset() {
      result = 0;
      console.log('Calculator reset');
      return this;
    }
  };
})();

// Usage
Calculator
  .add(10)
  .multiply(2)
  .subtract(5);

console.log(Calculator.getResult()); // 15

// Revealing Module Pattern
const UserManager = (() => {
  let users = [];
  let currentUser = null;
  
  function validateUser(user) {
    return user && user.name && user.email;
  }
  
  function findUserById(id) {
    return users.find(user => user.id === id);
  }
  
  function addUser(user) {
    if (validateUser(user)) {
      user.id = Date.now();
      users.push(user);
      return user;
    }
    throw new Error('Invalid user data');
  }
  
  function removeUser(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
    return null;
  }
  
  function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      currentUser = user;
      return true;
    }
    return false;
  }
  
  function logout() {
    currentUser = null;
  }
  
  function getCurrentUser() {
    return currentUser;
  }
  
  // Reveal public methods
  return {
    addUser,
    removeUser,
    login,
    logout,
    getCurrentUser,
    getUserById: findUserById
  };
})();

// ES6 Module Pattern
class APIClient {
  #baseURL;
  #apiKey;
  
  constructor(baseURL, apiKey) {
    this.#baseURL = baseURL;
    this.#apiKey = apiKey;
  }
  
  async #makeRequest(endpoint, options = {}) {
    const url = \`\${this.#baseURL}\${endpoint}\`;
    const config = {
      ...options,
      headers: {
        'Authorization': \`Bearer \${this.#apiKey}\`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
    
    const response = await fetch(url, config);
    return response.json();
  }
  
  async get(endpoint) {
    return this.#makeRequest(endpoint);
  }
  
  async post(endpoint, data) {
    return this.#makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}`,
    realWorldExample: 'JavaScript libraries (jQuery, Lodash), Node.js modules, React components with hooks, API clients.',
    pros: [
      'Encapsulation and privacy',
      'Namespace management',
      'Clean global scope',
      'Organized code structure'
    ],
    cons: [
      'Difficult to test private methods',
      'Memory usage (closures)',
      'Cannot extend private methods',
      'Debugging complexity'
    ],
    difficulty: 'intermediate',
    tags: ['structural', 'encapsulation', 'privacy', 'namespace'],
    relatedPatterns: ['singleton', 'facade', 'namespace']
  },
  {
    id: 'strategy',
    name: 'Strategy Pattern',
    category: 'Behavioral',
    description: 'Defines a family of algorithms, encapsulates each one, and makes them interchangeable.',
    problem: 'You have multiple ways to perform a task and want to choose the algorithm at runtime.',
    solution: 'Define a family of algorithms, encapsulate each one, and make them interchangeable through a common interface.',
    codeExample: `// Strategy Pattern Implementation
class PaymentStrategy {
  pay(amount) {
    throw new Error('pay method must be implemented');
  }
}

class CreditCardPayment extends PaymentStrategy {
  constructor(cardNumber, cvv) {
    super();
    this.cardNumber = cardNumber;
    this.cvv = cvv;
  }
  
  pay(amount) {
    console.log(\`Paid $\${amount} using Credit Card ending in \${this.cardNumber.slice(-4)}\`);
    return { success: true, transactionId: 'CC' + Date.now() };
  }
}

class PayPalPayment extends PaymentStrategy {
  constructor(email) {
    super();
    this.email = email;
  }
  
  pay(amount) {
    console.log(\`Paid $\${amount} using PayPal account \${this.email}\`);
    return { success: true, transactionId: 'PP' + Date.now() };
  }
}

class CryptoPayment extends PaymentStrategy {
  constructor(walletAddress) {
    super();
    this.walletAddress = walletAddress;
  }
  
  pay(amount) {
    console.log(\`Paid $\${amount} using Crypto wallet \${this.walletAddress.slice(0, 8)}...\`);
    return { success: true, transactionId: 'CR' + Date.now() };
  }
}

class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  processPayment(amount) {
    return this.strategy.pay(amount);
  }
}

// Usage
const processor = new PaymentProcessor(
  new CreditCardPayment('1234567890123456', '123')
);

processor.processPayment(100);

// Switch strategy at runtime
processor.setStrategy(new PayPalPayment('user@example.com'));
processor.processPayment(50);

// Functional approach
const sortingStrategies = {
  bubble: (arr) => {
    // Bubble sort implementation
    const sorted = [...arr];
    for (let i = 0; i < sorted.length; i++) {
      for (let j = 0; j < sorted.length - i - 1; j++) {
        if (sorted[j] > sorted[j + 1]) {
          [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
        }
      }
    }
    return sorted;
  },
  
  quick: (arr) => {
    // Quick sort implementation
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);
    return [...sortingStrategies.quick(left), ...middle, ...sortingStrategies.quick(right)];
  },
  
  merge: (arr) => {
    // Merge sort implementation
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = sortingStrategies.merge(arr.slice(0, mid));
    const right = sortingStrategies.merge(arr.slice(mid));
    
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
};

class Sorter {
  constructor(strategy = 'quick') {
    this.strategy = strategy;
  }
  
  sort(array) {
    return sortingStrategies[this.strategy](array);
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
}

// Usage
const sorter = new Sorter('bubble');
console.log(sorter.sort([64, 34, 25, 12, 22, 11, 90]));

sorter.setStrategy('quick');
console.log(sorter.sort([64, 34, 25, 12, 22, 11, 90]));`,
    realWorldExample: 'Sorting algorithms, payment processing, authentication methods, compression algorithms, routing strategies.',
    pros: [
      'Runtime algorithm selection',
      'Easy to add new strategies',
      'Eliminates conditional statements',
      'Follows Open/Closed Principle'
    ],
    cons: [
      'Increased number of classes',
      'Client must know about strategies',
      'Communication overhead',
      'May be overkill for simple cases'
    ],
    difficulty: 'intermediate',
    tags: ['behavioral', 'algorithms', 'interchangeable', 'runtime'],
    relatedPatterns: ['state', 'command', 'template-method']
  }
];

export const patternCategories = [
  'Creational',
  'Structural', 
  'Behavioral'
];

export function getPatternsByCategory(category: string): DesignPattern[] {
  return designPatterns.filter(pattern => pattern.category === category);
}

export function getPatternsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): DesignPattern[] {
  return designPatterns.filter(pattern => pattern.difficulty === difficulty);
}

export function searchPatterns(query: string): DesignPattern[] {
  const lowercaseQuery = query.toLowerCase();
  return designPatterns.filter(pattern => 
    pattern.name.toLowerCase().includes(lowercaseQuery) ||
    pattern.description.toLowerCase().includes(lowercaseQuery) ||
    pattern.problem.toLowerCase().includes(lowercaseQuery) ||
    pattern.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getRelatedPatterns(patternId: string): DesignPattern[] {
  const pattern = designPatterns.find(p => p.id === patternId);
  if (!pattern) return [];
  
  return pattern.relatedPatterns
    .map(relatedId => designPatterns.find(p => p.id === relatedId))
    .filter(Boolean) as DesignPattern[];
}
