export interface InterviewNote {
  id: string;
  question: string;
  answer: string;
  codeExample?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  followUpQuestions?: string[];
}

export const interviewNotes: InterviewNote[] = [
  {
    id: 'int-1',
    question: 'What is the difference between let, const, and var?',
    answer: `**var:**
- Function-scoped or globally-scoped
- Can be redeclared and updated
- Hoisted and initialized with undefined
- Can lead to unexpected behavior

**let:**
- Block-scoped
- Can be updated but not redeclared in same scope
- Hoisted but not initialized (temporal dead zone)
- Preferred for variables that change

**const:**
- Block-scoped
- Cannot be updated or redeclared
- Must be initialized at declaration
- Hoisted but not initialized
- Preferred for constants and objects/arrays that won't be reassigned`,
    codeExample: `// var example
function varExample() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 (accessible outside block)
}

// let example
function letExample() {
  if (true) {
    let y = 1;
  }
  console.log(y); // ReferenceError: y is not defined
}

// const example
const arr = [1, 2, 3];
arr.push(4); // OK - modifying contents
// arr = [5, 6, 7]; // Error - cannot reassign

const obj = { name: 'John' };
obj.age = 30; // OK - modifying properties
// obj = {}; // Error - cannot reassign`,
    category: 'Variables & Scope',
    difficulty: 'easy',
    tags: ['variables', 'scope', 'hoisting', 'es6'],
    followUpQuestions: [
      'What is the temporal dead zone?',
      'Can you explain hoisting with examples?',
      'When would you use each declaration type?'
    ]
  },
  {
    id: 'int-2',
    question: 'Explain event delegation and why it\'s useful.',
    answer: `Event delegation is a technique where you attach a single event listener to a parent element to handle events for multiple child elements, instead of attaching individual listeners to each child.

**How it works:**
- Events bubble up from child to parent elements
- Parent listener checks event.target to determine which child triggered the event
- Uses a single listener instead of multiple listeners

**Benefits:**
- Better performance (fewer event listeners)
- Automatically handles dynamically added elements
- Reduces memory usage
- Easier to manage and maintain

**Use cases:**
- Lists with many items
- Dynamically generated content
- Tables with many rows
- Navigation menus`,
    codeExample: `// Without event delegation (inefficient)
document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', handleClick);
});

// With event delegation (efficient)
document.getElementById('container').addEventListener('click', function(e) {
  if (e.target.classList.contains('button')) {
    handleClick(e);
  }
});

// Real-world example
const todoList = document.getElementById('todo-list');

todoList.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-btn')) {
    // Handle delete
    e.target.closest('li').remove();
  } else if (e.target.classList.contains('edit-btn')) {
    // Handle edit
    editTodo(e.target.closest('li'));
  } else if (e.target.classList.contains('complete-btn')) {
    // Handle complete
    toggleComplete(e.target.closest('li'));
  }
});

// Adding new items dynamically - no need to add new listeners!
function addTodoItem(text) {
  const li = document.createElement('li');
  li.innerHTML = \`
    <span>\${text}</span>
    <button class="complete-btn">✓</button>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  \`;
  todoList.appendChild(li);
}`,
    category: 'DOM & Events',
    difficulty: 'medium',
    tags: ['events', 'dom', 'performance', 'bubbling'],
    followUpQuestions: [
      'What is event bubbling and capturing?',
      'How do you stop event propagation?',
      'What are the performance implications of many event listeners?'
    ]
  },
  {
    id: 'int-3',
    question: 'What is a closure and provide a practical example?',
    answer: `A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. The inner function "closes over" the variables from the outer scope.

**Key characteristics:**
- Inner function has access to outer function's variables
- Variables remain accessible even after outer function returns
- Creates a private scope for variables
- Commonly used for data privacy and function factories

**Practical applications:**
- Module patterns for data privacy
- Function factories
- Callbacks that need to remember state
- Event handlers that need access to local variables`,
    codeExample: `// Basic closure example
function createCounter() {
  let count = 0; // Private variable
  
  return function() {
    count++; // Access to outer variable
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (separate closure)

// Practical example: Module pattern
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable
  
  return {
    deposit: function(amount) {
      if (amount > 0) {
        balance += amount;
        return balance;
      }
    },
    
    withdraw: function(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return balance;
      }
      return 'Insufficient funds';
    },
    
    getBalance: function() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log(account.getBalance()); // 100
account.deposit(50);
console.log(account.getBalance()); // 150
// balance is not directly accessible from outside

// Function factory example
function createMultiplier(multiplier) {
  return function(x) {
    return x * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15`,
    category: 'Functions & Scope',
    difficulty: 'medium',
    tags: ['closures', 'scope', 'privacy', 'functions'],
    followUpQuestions: [
      'What are the memory implications of closures?',
      'How do closures relate to the module pattern?',
      'Can you explain lexical scoping?'
    ]
  },
  {
    id: 'int-4',
    question: 'Explain the difference between == and === in JavaScript.',
    answer: `The main difference is that == performs type coercion while === does not.

**== (Loose Equality):**
- Compares values after converting them to the same type
- Performs automatic type coercion
- Can lead to unexpected results
- Generally not recommended

**=== (Strict Equality):**
- Compares both value and type
- No type coercion
- More predictable behavior
- Recommended best practice

**Type coercion rules for ==:**
- Numbers and strings: string converted to number
- Boolean values: converted to numbers (true=1, false=0)
- Objects: converted to primitives using valueOf() or toString()
- null and undefined are equal to each other but not to anything else`,
    codeExample: `// Loose equality (==) examples
console.log(5 == '5');        // true (string converted to number)
console.log(true == 1);       // true (boolean converted to number)
console.log(false == 0);      // true
console.log(null == undefined); // true
console.log(0 == false);      // true
console.log('' == false);     // true
console.log('0' == false);    // true

// Strict equality (===) examples
console.log(5 === '5');       // false (different types)
console.log(true === 1);      // false
console.log(false === 0);     // false
console.log(null === undefined); // false
console.log(0 === false);     // false

// Unexpected behavior with ==
console.log([] == false);     // true (array converted to empty string)
console.log([] == 0);         // true
console.log([''] == false);   // true
console.log([0] == false);    // true

// Best practice: always use ===
function isEqual(a, b) {
  return a === b;
}

// For null/undefined checks
function isNullOrUndefined(value) {
  return value === null || value === undefined;
  // Or use: return value == null; (only case where == is acceptable)
}

// Object comparison (both == and === compare references)
const obj1 = { name: 'John' };
const obj2 = { name: 'John' };
const obj3 = obj1;

console.log(obj1 == obj2);    // false (different objects)
console.log(obj1 === obj2);   // false (different objects)
console.log(obj1 === obj3);   // true (same reference)`,
    category: 'Operators & Comparison',
    difficulty: 'easy',
    tags: ['equality', 'comparison', 'coercion', 'operators'],
    followUpQuestions: [
      'What is type coercion and when does it happen?',
      'How do you compare objects for equality?',
      'What is the difference between null and undefined?'
    ]
  },
  {
    id: 'int-5',
    question: 'What is the event loop and how does it work?',
    answer: `The event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It handles the execution of code, collecting and processing events, and executing queued sub-tasks.

**Key components:**
- **Call Stack**: Where function calls are stored
- **Web APIs**: Browser-provided APIs (setTimeout, DOM events, etc.)
- **Callback Queue**: Where callbacks wait to be executed
- **Event Loop**: Monitors call stack and callback queue

**How it works:**
1. JavaScript executes code synchronously on the call stack
2. Asynchronous operations are handled by Web APIs
3. When async operations complete, callbacks go to the callback queue
4. Event loop checks if call stack is empty
5. If empty, it moves callbacks from queue to call stack

**Microtasks vs Macrotasks:**
- Microtasks (Promises, queueMicrotask) have higher priority
- Macrotasks (setTimeout, setInterval, I/O) are processed after microtasks`,
    codeExample: `// Example demonstrating event loop
console.log('1'); // Synchronous

setTimeout(() => {
  console.log('2'); // Macrotask
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // Microtask
});

console.log('4'); // Synchronous

// Output: 1, 4, 3, 2

// More complex example
console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);

Promise.resolve()
  .then(() => console.log('Promise 1'))
  .then(() => console.log('Promise 2'));

setTimeout(() => console.log('Timeout 2'), 0);

console.log('End');

// Output: Start, End, Promise 1, Promise 2, Timeout 1, Timeout 2

// Blocking vs non-blocking
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Blocks for 3 seconds
  }
  console.log('Blocking operation done');
}

function nonBlockingOperation() {
  setTimeout(() => {
    console.log('Non-blocking operation done');
  }, 3000);
}

console.log('Before operations');
// blockingOperation(); // This would block everything
nonBlockingOperation(); // This doesn't block
console.log('After operations');`,
    category: 'Asynchronous JavaScript',
    difficulty: 'hard',
    tags: ['event-loop', 'asynchronous', 'callbacks', 'promises'],
    followUpQuestions: [
      'What happens if you have a long-running synchronous operation?',
      'How do microtasks and macrotasks differ in priority?',
      'What is the difference between setTimeout and setImmediate?'
    ]
  }
];

export const interviewCategories = [
  'Variables & Scope',
  'Functions & Scope',
  'Objects & Prototypes',
  'Asynchronous JavaScript',
  'DOM & Events',
  'Operators & Comparison',
  'Arrays & Objects',
  'ES6+ Features',
  'Performance',
  'Best Practices'
];

export function getInterviewNotesByCategory(category: string): InterviewNote[] {
  return interviewNotes.filter(note => note.category === category);
}

export function getInterviewNotesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): InterviewNote[] {
  return interviewNotes.filter(note => note.difficulty === difficulty);
}

export function searchInterviewNotes(query: string): InterviewNote[] {
  const lowercaseQuery = query.toLowerCase();
  return interviewNotes.filter(note => 
    note.question.toLowerCase().includes(lowercaseQuery) ||
    note.answer.toLowerCase().includes(lowercaseQuery) ||
    note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
