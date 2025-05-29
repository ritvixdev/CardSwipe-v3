export interface Note {
  id: string;
  title: string;
  category: string;
  content: string;
  codeExample?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number; // in minutes
}

export const notes: Note[] = [
  {
    id: 'note-1',
    title: 'JavaScript Hoisting Explained',
    category: 'Core Concepts',
    content: `Hoisting is JavaScript's default behavior of moving declarations to the top of their scope.

**Variable Hoisting:**
- var declarations are hoisted and initialized with undefined
- let and const are hoisted but not initialized (temporal dead zone)

**Function Hoisting:**
- Function declarations are fully hoisted
- Function expressions are not hoisted

**Best Practices:**
- Always declare variables at the top of their scope
- Use let and const instead of var
- Declare functions before using them`,
    codeExample: `// Variable hoisting
console.log(x); // undefined (not error)
var x = 5;

// Function hoisting
sayHello(); // Works!
function sayHello() {
  console.log("Hello!");
}

// Function expression - not hoisted
sayBye(); // Error!
var sayBye = function() {
  console.log("Bye!");
};`,
    tags: ['hoisting', 'variables', 'functions', 'scope'],
    difficulty: 'intermediate',
    readTime: 3
  },
  {
    id: 'note-2',
    title: 'Understanding Closures',
    category: 'Advanced Concepts',
    content: `A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.

**Key Points:**
- Inner functions have access to outer function variables
- Variables are "closed over" and remain accessible
- Closures are created every time a function is created

**Common Use Cases:**
- Data privacy and encapsulation
- Function factories
- Callbacks and event handlers
- Module patterns`,
    codeExample: `function outerFunction(x) {
  // Outer function variable
  
  function innerFunction(y) {
    // Inner function has access to x
    console.log(x + y);
  }
  
  return innerFunction;
}

const addFive = outerFunction(5);
addFive(3); // 8

// Data privacy example
function createCounter() {
  let count = 0;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.getCount()); // 0
counter.increment();
console.log(counter.getCount()); // 1`,
    tags: ['closures', 'scope', 'functions', 'privacy'],
    difficulty: 'advanced',
    readTime: 5
  },
  {
    id: 'note-3',
    title: 'Async/Await vs Promises',
    category: 'Asynchronous JavaScript',
    content: `Async/await is syntactic sugar over Promises, making asynchronous code look and behave more like synchronous code.

**Promises:**
- Use .then() and .catch() for handling results
- Can lead to callback hell with complex chains
- Good for simple async operations

**Async/Await:**
- Makes async code look synchronous
- Better error handling with try/catch
- Easier to read and debug
- Must be used inside async functions`,
    codeExample: `// Promise approach
function fetchUserData(id) {
  return fetch(\`/api/users/\${id}\`)
    .then(response => response.json())
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Async/await approach
async function fetchUserDataAsync(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Multiple async operations
async function fetchMultipleUsers() {
  try {
    const [user1, user2, user3] = await Promise.all([
      fetchUserDataAsync(1),
      fetchUserDataAsync(2),
      fetchUserDataAsync(3)
    ]);
    
    return [user1, user2, user3];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}`,
    tags: ['async', 'await', 'promises', 'asynchronous'],
    difficulty: 'intermediate',
    readTime: 4
  },
  {
    id: 'note-4',
    title: 'Array Methods Cheat Sheet',
    category: 'Data Structures',
    content: `JavaScript arrays come with powerful built-in methods for manipulation and transformation.

**Mutating Methods (change original array):**
- push(), pop(), shift(), unshift()
- splice(), sort(), reverse()

**Non-mutating Methods (return new array):**
- map(), filter(), reduce()
- slice(), concat(), join()

**Search Methods:**
- find(), findIndex(), includes()
- indexOf(), lastIndexOf()

**Iteration Methods:**
- forEach(), every(), some()`,
    codeExample: `const numbers = [1, 2, 3, 4, 5];

// Transform data
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// Filter data
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

// Reduce to single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15

// Chain methods
const result = numbers
  .filter(n => n > 2)
  .map(n => n * 2)
  .reduce((acc, n) => acc + n, 0);
// 24

// Find elements
const found = numbers.find(n => n > 3);
// 4

const foundIndex = numbers.findIndex(n => n > 3);
// 3`,
    tags: ['arrays', 'methods', 'functional', 'data'],
    difficulty: 'beginner',
    readTime: 3
  },
  {
    id: 'note-5',
    title: 'ES6+ Features You Should Know',
    category: 'Modern JavaScript',
    content: `ES6 and later versions introduced many powerful features that make JavaScript more expressive and easier to work with.

**Destructuring:**
- Extract values from arrays and objects
- Default values and renaming
- Rest patterns

**Template Literals:**
- String interpolation with \${expression}
- Multi-line strings
- Tagged templates

**Arrow Functions:**
- Shorter syntax for functions
- Lexical this binding
- Implicit returns

**Modules:**
- import/export statements
- Named and default exports
- Dynamic imports`,
    codeExample: `// Destructuring
const user = { name: 'John', age: 30, city: 'NYC' };
const { name, age, city = 'Unknown' } = user;

const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Template literals
const greeting = \`Hello \${name}, you are \${age} years old!\`;

const multiLine = \`
  This is a
  multi-line
  string
\`;

// Arrow functions
const add = (a, b) => a + b;
const square = x => x * x;
const numbers = [1, 2, 3].map(n => n * 2);

// Modules
// math.js
export const PI = 3.14159;
export default function add(a, b) {
  return a + b;
}

// main.js
import add, { PI } from './math.js';

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }`,
    tags: ['es6', 'destructuring', 'templates', 'arrows', 'modules'],
    difficulty: 'intermediate',
    readTime: 6
  }
];

export const noteCategories = [
  'Core Concepts',
  'Advanced Concepts',
  'Asynchronous JavaScript',
  'Data Structures',
  'Modern JavaScript',
  'Performance',
  'Best Practices'
];

export function getNotesByCategory(category: string): Note[] {
  return notes.filter(note => note.category === category);
}

export function getNotesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Note[] {
  return notes.filter(note => note.difficulty === difficulty);
}

export function searchNotes(query: string): Note[] {
  const lowercaseQuery = query.toLowerCase();
  return notes.filter(note => 
    note.title.toLowerCase().includes(lowercaseQuery) ||
    note.content.toLowerCase().includes(lowercaseQuery) ||
    note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
