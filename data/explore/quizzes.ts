export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  codeExample?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
}

export const quizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of basic JavaScript concepts including variables, functions, and data types.',
    category: 'Fundamentals',
    difficulty: 'easy',
    timeLimit: 15,
    passingScore: 70,
    questions: [
      {
        id: 'q1-1',
        question: 'Which of the following is the correct way to declare a variable in JavaScript?',
        options: [
          'variable myVar = 5;',
          'let myVar = 5;',
          'declare myVar = 5;',
          'var myVar := 5;'
        ],
        correctAnswer: 1,
        explanation: 'The correct syntax for declaring a variable is "let myVar = 5;" or "var myVar = 5;" or "const myVar = 5;". The "let" keyword is preferred in modern JavaScript.',
        difficulty: 'easy',
        tags: ['variables', 'syntax', 'declaration']
      },
      {
        id: 'q1-2',
        question: 'What will be the output of the following code?\n\nconsole.log(typeof null);',
        options: [
          '"null"',
          '"undefined"',
          '"object"',
          '"boolean"'
        ],
        correctAnswer: 2,
        explanation: 'This is a well-known quirk in JavaScript. typeof null returns "object", which is considered a bug in the language but is kept for backward compatibility.',
        codeExample: `console.log(typeof null);        // "object"
console.log(typeof undefined);  // "undefined"
console.log(typeof 42);         // "number"
console.log(typeof "hello");    // "string"
console.log(typeof true);       // "boolean"`,
        difficulty: 'medium',
        tags: ['typeof', 'null', 'data-types']
      },
      {
        id: 'q1-3',
        question: 'Which method is used to add an element to the end of an array?',
        options: [
          'append()',
          'add()',
          'push()',
          'insert()'
        ],
        correctAnswer: 2,
        explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.',
        codeExample: `const fruits = ['apple', 'banana'];
fruits.push('orange');
console.log(fruits); // ['apple', 'banana', 'orange']

// You can also push multiple elements
fruits.push('grape', 'kiwi');
console.log(fruits); // ['apple', 'banana', 'orange', 'grape', 'kiwi']`,
        difficulty: 'easy',
        tags: ['arrays', 'methods', 'push']
      },
      {
        id: 'q1-4',
        question: 'What is the difference between == and === in JavaScript?',
        options: [
          'There is no difference',
          '== compares values, === compares references',
          '== performs type coercion, === does not',
          '=== is faster than =='
        ],
        correctAnswer: 2,
        explanation: '== performs type coercion (converts types before comparison), while === compares both value and type without any conversion.',
        codeExample: `console.log(5 == '5');   // true (type coercion)
console.log(5 === '5');  // false (no type coercion)

console.log(true == 1);  // true
console.log(true === 1); // false

console.log(null == undefined);  // true
console.log(null === undefined); // false`,
        difficulty: 'medium',
        tags: ['equality', 'comparison', 'operators']
      },
      {
        id: 'q1-5',
        question: 'Which of the following will create a function in JavaScript?',
        options: [
          'function myFunc() {}',
          'const myFunc = function() {}',
          'const myFunc = () => {}',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'All three are valid ways to create functions in JavaScript: function declaration, function expression, and arrow function.',
        codeExample: `// Function declaration
function myFunc1() {
  return 'Hello';
}

// Function expression
const myFunc2 = function() {
  return 'Hello';
};

// Arrow function
const myFunc3 = () => {
  return 'Hello';
};

// Arrow function with implicit return
const myFunc4 = () => 'Hello';`,
        difficulty: 'easy',
        tags: ['functions', 'syntax', 'arrow-functions']
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Asynchronous JavaScript',
    description: 'Master promises, async/await, and the event loop with this comprehensive quiz.',
    category: 'Asynchronous',
    difficulty: 'medium',
    timeLimit: 20,
    passingScore: 75,
    questions: [
      {
        id: 'q2-1',
        question: 'What will be the output order of the following code?',
        options: [
          '1, 2, 3, 4',
          '1, 4, 3, 2',
          '1, 3, 4, 2',
          '1, 4, 2, 3'
        ],
        correctAnswer: 1,
        explanation: 'Synchronous code (1, 4) executes first, then microtasks (Promise - 3), then macrotasks (setTimeout - 2).',
        codeExample: `console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2`,
        difficulty: 'medium',
        tags: ['event-loop', 'promises', 'setTimeout']
      },
      {
        id: 'q2-2',
        question: 'How do you handle errors in async/await?',
        options: [
          'Using .catch() method',
          'Using try/catch blocks',
          'Using error callbacks',
          'Errors cannot be handled in async/await'
        ],
        correctAnswer: 1,
        explanation: 'In async/await, errors are handled using try/catch blocks, which makes error handling more readable and similar to synchronous code.',
        codeExample: `async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw if needed
  }
}

// Alternative with .catch()
async function fetchDataAlt() {
  return fetch('/api/data')
    .then(response => response.json())
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}`,
        difficulty: 'medium',
        tags: ['async-await', 'error-handling', 'try-catch']
      },
      {
        id: 'q2-3',
        question: 'What does Promise.all() do?',
        options: [
          'Executes promises sequentially',
          'Executes promises in parallel and waits for all to complete',
          'Executes only the first promise',
          'Cancels all promises'
        ],
        correctAnswer: 1,
        explanation: 'Promise.all() executes all promises in parallel and resolves when all promises resolve, or rejects immediately when any promise rejects.',
        codeExample: `const promise1 = fetch('/api/data1');
const promise2 = fetch('/api/data2');
const promise3 = fetch('/api/data3');

// All promises execute in parallel
Promise.all([promise1, promise2, promise3])
  .then(responses => {
    // All responses are available here
    console.log('All requests completed');
    return Promise.all(responses.map(r => r.json()));
  })
  .then(data => {
    console.log('All data:', data);
  })
  .catch(error => {
    // If any promise rejects, this catch will run
    console.error('One or more requests failed:', error);
  });`,
        difficulty: 'medium',
        tags: ['promises', 'promise-all', 'parallel']
      }
    ]
  },
  {
    id: 'quiz-3',
    title: 'ES6+ Features',
    description: 'Test your knowledge of modern JavaScript features including destructuring, arrow functions, and modules.',
    category: 'Modern JavaScript',
    difficulty: 'medium',
    timeLimit: 18,
    passingScore: 80,
    questions: [
      {
        id: 'q3-1',
        question: 'What will be the values of a and b after destructuring?',
        options: [
          'a = 1, b = 2',
          'a = 2, b = 1',
          'a = [1, 2], b = undefined',
          'SyntaxError'
        ],
        correctAnswer: 1,
        explanation: 'Array destructuring with swapping: [a, b] = [b, a] swaps the values of a and b.',
        codeExample: `let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a); // 2
console.log(b); // 1

// This is equivalent to:
// let temp = a;
// a = b;
// b = temp;`,
        difficulty: 'medium',
        tags: ['destructuring', 'arrays', 'swapping']
      },
      {
        id: 'q3-2',
        question: 'What is the difference between arrow functions and regular functions regarding "this"?',
        options: [
          'No difference',
          'Arrow functions have their own "this"',
          'Arrow functions inherit "this" from enclosing scope',
          'Arrow functions cannot use "this"'
        ],
        correctAnswer: 2,
        explanation: 'Arrow functions do not have their own "this" binding. They inherit "this" from the enclosing lexical scope.',
        codeExample: `const obj = {
  name: 'John',
  
  regularFunction: function() {
    console.log(this.name); // 'John' - this refers to obj
    
    setTimeout(function() {
      console.log(this.name); // undefined - this refers to global/window
    }, 1000);
  },
  
  arrowFunction: function() {
    console.log(this.name); // 'John' - this refers to obj
    
    setTimeout(() => {
      console.log(this.name); // 'John' - inherits this from enclosing scope
    }, 1000);
  }
};`,
        difficulty: 'medium',
        tags: ['arrow-functions', 'this', 'scope']
      }
    ]
  }
];

export const quizCategories = [
  'Fundamentals',
  'Asynchronous',
  'Modern JavaScript',
  'DOM Manipulation',
  'Object-Oriented',
  'Functional Programming',
  'Performance',
  'Testing'
];

export function getQuizzesByCategory(category: string): Quiz[] {
  return quizzes.filter(quiz => quiz.category === category);
}

export function getQuizzesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Quiz[] {
  return quizzes.filter(quiz => quiz.difficulty === difficulty);
}

export function searchQuizzes(query: string): Quiz[] {
  const lowercaseQuery = query.toLowerCase();
  return quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(lowercaseQuery) ||
    quiz.description.toLowerCase().includes(lowercaseQuery) ||
    quiz.questions.some(q => 
      q.question.toLowerCase().includes(lowercaseQuery) ||
      q.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  );
}
