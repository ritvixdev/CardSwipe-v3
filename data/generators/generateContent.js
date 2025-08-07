#!/usr/bin/env node

// ============================================================================
// CONTENT GENERATION SCRIPT
// ============================================================================
// This script generates JSON content from the knowledge base

const fs = require('fs').promises;
const path = require('path');

// Import the content generator (would need to compile TypeScript first)
// const { contentGenerator } = require('../processors/contentGenerator');

// Simple content generation demonstration
async function generateSampleContent() {
  console.log('🚀 Generating sample multi-file content structure...');
  
  try {
    // Create directory structure
    await createDirectoryStructure();
    
    // Generate sample files for demonstration
    await generateSampleFundamentals();
    await generateSampleDataStructures();
    await generateSampleTopicManifests();
    await generateSampleExploreContent();
    
    console.log('✅ Sample content generation completed!');
    console.log('\n📂 Generated structure:');
    console.log('   /data/learn/cards/fundamentals/fundamentals-001.json');
    console.log('   /data/learn/cards/data-structures/arrays-001.json');
    console.log('   /data/learn/topics/fundamentals.json');
    console.log('   /data/explore/javascript-notes/fundamentals-notes-001.json');
    console.log('   /data/explore/practice-quiz/fundamentals-quiz-001.json');
    
  } catch (error) {
    console.error('❌ Content generation failed:', error);
    process.exit(1);
  }
}

async function createDirectoryStructure() {
  const dirs = [
    'data/learn/cards/fundamentals',
    'data/learn/cards/data-structures', 
    'data/learn/cards/control-flow',
    'data/learn/cards/functions',
    'data/learn/cards/advanced',
    'data/learn/cards/dom',
    'data/learn/topics',
    'data/explore/javascript-notes',
    'data/explore/practice-quiz',
    'data/explore/interview-prep',
    'data/explore/coding-questions'
  ];

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

async function generateSampleFundamentals() {
  const fundamentalsCards = {
    "metadata": {
      "fileId": "fundamentals-001",
      "topic": "fundamentals",
      "subtopic": "variables-datatypes",
      "partNumber": 1,
      "totalParts": 2,
      "cardCount": 20,
      "difficulty": "beginner",
      "estimatedTime": "40 min",
      "prerequisites": [],
      "nextFile": "fundamentals-002.json",
      "tags": ["variables", "datatypes", "let", "const", "var"],
      "version": "1.0.0",
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    },
    "cards": [
      {
        "id": "fund-var-001",
        "title": "Variable Declaration with let",
        "day": 1,
        "category": "fundamentals",
        "difficulty": "beginner",
        "estimatedTime": "2 min",
        "description": "Learn how to declare variables using the let keyword for block-scoped variables",
        "content": "The `let` keyword allows you to declare block-scoped variables in JavaScript. Unlike `var`, variables declared with `let` are only accessible within the block they are defined in.\n\n**Key Features:**\n- Block-scoped (limited to nearest enclosing block)\n- Can be reassigned but not redeclared in same scope\n- Temporal dead zone until declaration is reached\n- Hoisted but not initialized",
        "codeExample": "let message = 'Hello World';\nconsole.log(message); // Hello World\n\n// Block scope example\nif (true) {\n  let blockScoped = 'I am block scoped';\n  console.log(blockScoped); // Works here\n}\n// console.log(blockScoped); // ReferenceError",
        "keyPoints": [
          "let creates block-scoped variables",
          "Variables can be reassigned but not redeclared",
          "Hoisting behavior differs from var",
          "Temporal dead zone prevents access before declaration"
        ],
        "quiz": {
          "question": "Which keyword creates a block-scoped variable in JavaScript?",
          "options": ["var", "let", "const", "function"],
          "correctAnswer": 1,
          "explanation": "The `let` keyword creates variables that are scoped to the nearest enclosing block, unlike `var` which is function-scoped."
        },
        "tags": ["let", "variables", "scope", "block-scope"],
        "isCompleted": false,
        "isBookmarked": false
      },
      {
        "id": "fund-var-002", 
        "title": "Const Declaration for Constants",
        "day": 1,
        "category": "fundamentals",
        "difficulty": "beginner",
        "estimatedTime": "2 min",
        "description": "Learn about const keyword for declaring constants and immutable bindings",
        "content": "The `const` keyword declares constants - bindings that cannot be reassigned after initialization. The value itself may be mutable (for objects and arrays), but the binding is immutable.\n\n**Key Rules:**\n- Must be initialized at declaration\n- Cannot be reassigned\n- Block-scoped like let\n- Objects and arrays can still be mutated",
        "codeExample": "const PI = 3.14159;\n// PI = 3.14; // TypeError: Assignment to constant variable\n\nconst user = { name: 'John' };\nuser.age = 25; // This works - object is mutable\nuser.name = 'Jane'; // This works too\n\n// user = {}; // TypeError: Assignment to constant variable",
        "keyPoints": [
          "const creates immutable bindings",
          "Must be initialized when declared", 
          "Objects and arrays are still mutable",
          "Cannot be reassigned after declaration"
        ],
        "quiz": {
          "question": "What happens when you try to reassign a const variable?",
          "options": ["It works normally", "TypeError is thrown", "undefined is returned", "SyntaxError occurs"],
          "correctAnswer": 1,
          "explanation": "Attempting to reassign a const variable throws a TypeError because const creates an immutable binding."
        },
        "tags": ["const", "constants", "immutable", "block-scope"],
        "isCompleted": false,
        "isBookmarked": false
      },
      {
        "id": "fund-dt-001",
        "title": "JavaScript Data Types Overview",
        "day": 2,
        "category": "fundamentals", 
        "difficulty": "beginner",
        "estimatedTime": "3 min",
        "description": "Understanding JavaScript's primitive and non-primitive data types",
        "content": "JavaScript has 8 data types: 7 primitive types and 1 non-primitive type (object). Understanding data types is crucial for effective programming.\n\n**Primitive Types:**\n1. Number - Integers and floats\n2. String - Text data\n3. Boolean - true/false values\n4. Undefined - Declared but not assigned\n5. Null - Intentional empty value\n6. BigInt - Large integers\n7. Symbol - Unique identifiers\n\n**Non-Primitive:**\n- Object - Collections of key-value pairs",
        "codeExample": "// Primitive types\nlet num = 42;                    // Number\nlet str = 'Hello';               // String  \nlet bool = true;                 // Boolean\nlet undef;                       // Undefined\nlet empty = null;                // Null\nlet big = 123456789012345678n;   // BigInt\nlet sym = Symbol('id');          // Symbol\n\n// Non-primitive\nlet obj = { name: 'John' };      // Object\nlet arr = [1, 2, 3];            // Array (type of object)",
        "keyPoints": [
          "7 primitive data types in JavaScript",
          "1 non-primitive type: object", 
          "typeof operator helps identify types",
          "Primitive values are immutable"
        ],
        "quiz": {
          "question": "How many primitive data types does JavaScript have?",
          "options": ["6", "7", "8", "5"],
          "correctAnswer": 1,
          "explanation": "JavaScript has 7 primitive data types: number, string, boolean, undefined, null, bigint, and symbol."
        },
        "tags": ["datatypes", "primitives", "typeof", "fundamentals"],
        "isCompleted": false,
        "isBookmarked": false
      }
    ]
  };

  await fs.writeFile(
    'data/learn/cards/fundamentals/fundamentals-001.json',
    JSON.stringify(fundamentalsCards, null, 2)
  );
  
  console.log('📄 Created: fundamentals-001.json (3 sample cards)');
}

async function generateSampleDataStructures() {
  const arraysCards = {
    "metadata": {
      "fileId": "arrays-001",
      "topic": "data-structures",
      "subtopic": "arrays-basics",
      "partNumber": 1,
      "totalParts": 3,
      "cardCount": 15,
      "difficulty": "beginner",
      "estimatedTime": "30 min",
      "prerequisites": ["fundamentals"],
      "nextFile": "arrays-002.json",
      "tags": ["arrays", "data-structures", "indexing", "methods"],
      "version": "1.0.0",
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    },
    "cards": [
      {
        "id": "arr-001",
        "title": "Array Creation and Structure",
        "day": 5,
        "category": "data-structures",
        "difficulty": "beginner", 
        "estimatedTime": "3 min",
        "description": "Learn how to create arrays and understand their structure in JavaScript",
        "content": "Arrays are ordered collections of elements that can hold multiple values of any data type. They are zero-indexed, meaning the first element is at position 0.\n\n**Creating Arrays:**\n- Array literal notation: `[1, 2, 3]`\n- Array constructor: `new Array()`\n- Array.of() method: `Array.of(1, 2, 3)`\n- Array.from() method: `Array.from('hello')`",
        "codeExample": "// Array literal (most common)\nconst fruits = ['apple', 'banana', 'orange'];\n\n// Array constructor\nconst numbers = new Array(1, 2, 3, 4, 5);\n\n// Mixed data types\nconst mixed = [42, 'hello', true, null, { name: 'John' }];\n\n// Empty array\nconst empty = [];\n\nconsole.log(fruits.length); // 3\nconsole.log(mixed[4].name); // 'John'",
        "keyPoints": [
          "Arrays store multiple values in order",
          "Zero-indexed (first element at index 0)",
          "Can contain mixed data types",
          "Dynamic size - can grow and shrink"
        ],
        "quiz": {
          "question": "What is the index of the first element in a JavaScript array?",
          "options": ["1", "0", "-1", "undefined"],
          "correctAnswer": 1,
          "explanation": "JavaScript arrays are zero-indexed, meaning the first element is at index 0."
        },
        "tags": ["arrays", "creation", "indexing", "data-structures"],
        "isCompleted": false,
        "isBookmarked": false
      },
      {
        "id": "arr-002",
        "title": "Array Methods - Push and Pop", 
        "day": 5,
        "category": "data-structures",
        "difficulty": "beginner",
        "estimatedTime": "3 min",
        "description": "Learn about push() and pop() methods for adding and removing elements from arrays",
        "content": "The push() and pop() methods work with the end of arrays. Push adds elements to the end, while pop removes and returns the last element.\n\n**push():**\n- Adds elements to the end of array\n- Returns new length of array\n- Mutates the original array\n\n**pop():**\n- Removes last element from array\n- Returns the removed element\n- Mutates the original array",
        "codeExample": "const fruits = ['apple', 'banana'];\n\n// Using push() - adds to end\nconst newLength = fruits.push('orange', 'grape');\nconsole.log(fruits); // ['apple', 'banana', 'orange', 'grape']\nconsole.log(newLength); // 4\n\n// Using pop() - removes from end  \nconst removed = fruits.pop();\nconsole.log(removed); // 'grape'\nconsole.log(fruits); // ['apple', 'banana', 'orange']",
        "keyPoints": [
          "push() adds elements to end of array",
          "pop() removes and returns last element",
          "Both methods mutate the original array",
          "push() returns new length, pop() returns removed element"
        ],
        "quiz": {
          "question": "What does the push() method return?",
          "options": ["The added element", "The new array length", "The original array", "undefined"],
          "correctAnswer": 1,
          "explanation": "The push() method returns the new length of the array after adding elements."
        },
        "tags": ["arrays", "push", "pop", "methods", "mutation"],
        "isCompleted": false,
        "isBookmarked": false
      }
    ]
  };

  await fs.writeFile(
    'data/learn/cards/data-structures/arrays-001.json',
    JSON.stringify(arraysCards, null, 2)
  );
  
  console.log('📄 Created: data-structures/arrays-001.json (2 sample cards)');
}

async function generateSampleTopicManifests() {
  const fundamentalsManifest = {
    "topicId": "fundamentals",
    "name": "JavaScript Fundamentals",
    "description": "Core JavaScript concepts including variables, data types, operators, and basic syntax",
    "totalFiles": 2,
    "totalCards": 45,
    "difficulty": "beginner",
    "estimatedHours": 3,
    "files": [
      {
        "fileId": "fundamentals-001",
        "path": "/data/learn/cards/fundamentals/fundamentals-001.json",
        "subtopic": "variables-datatypes",
        "cardCount": 20,
        "difficulty": "beginner"
      },
      {
        "fileId": "fundamentals-002", 
        "path": "/data/learn/cards/fundamentals/fundamentals-002.json",
        "subtopic": "operators-booleans",
        "cardCount": 25,
        "difficulty": "beginner"
      }
    ],
    "prerequisites": [],
    "tags": ["fundamentals", "variables", "datatypes", "operators", "booleans"],
    "version": "1.0.0",
    "updatedAt": "2024-01-15T00:00:00Z"
  };

  const dataStructuresManifest = {
    "topicId": "data-structures",
    "name": "Data Structures",
    "description": "JavaScript data structures including arrays, objects, sets, and maps",
    "totalFiles": 4,
    "totalCards": 80,
    "difficulty": "beginner",
    "estimatedHours": 5,
    "files": [
      {
        "fileId": "arrays-001",
        "path": "/data/learn/cards/data-structures/arrays-001.json", 
        "subtopic": "arrays-basics",
        "cardCount": 20,
        "difficulty": "beginner"
      },
      {
        "fileId": "arrays-002",
        "path": "/data/learn/cards/data-structures/arrays-002.json",
        "subtopic": "array-methods",
        "cardCount": 25,
        "difficulty": "intermediate" 
      },
      {
        "fileId": "objects-001",
        "path": "/data/learn/cards/data-structures/objects-001.json",
        "subtopic": "objects-basics",
        "cardCount": 20,
        "difficulty": "beginner"
      },
      {
        "fileId": "sets-maps-001",
        "path": "/data/learn/cards/data-structures/sets-maps-001.json",
        "subtopic": "sets-and-maps",
        "cardCount": 15,
        "difficulty": "intermediate"
      }
    ],
    "prerequisites": ["fundamentals"],
    "tags": ["data-structures", "arrays", "objects", "sets", "maps"],
    "version": "1.0.0", 
    "updatedAt": "2024-01-15T00:00:00Z"
  };

  await fs.writeFile(
    'data/learn/topics/fundamentals.json',
    JSON.stringify(fundamentalsManifest, null, 2)
  );

  await fs.writeFile(
    'data/learn/topics/data-structures.json',
    JSON.stringify(dataStructuresManifest, null, 2)
  );
  
  console.log('📄 Created: Topic manifests for fundamentals and data-structures');
}

async function generateSampleExploreContent() {
  // JavaScript Notes
  const fundamentalsNotes = {
    "metadata": {
      "fileId": "fundamentals-notes-001",
      "type": "notes",
      "topic": "fundamentals",
      "noteCount": 5,
      "difficulty": "beginner",
      "tags": ["fundamentals", "variables", "datatypes"],
      "version": "1.0.0"
    },
    "notes": [
      {
        "id": "note-variables-001",
        "title": "Variable Declarations: let, const, var",
        "category": "fundamentals",
        "difficulty": "beginner",
        "readTime": 5,
        "content": "JavaScript provides three ways to declare variables: var, let, and const. Each has different scoping rules and behaviors.\n\n**var**: Function-scoped, can be redeclared and reassigned, hoisted with undefined initialization.\n\n**let**: Block-scoped, cannot be redeclared in same scope, can be reassigned, hoisted but not initialized (temporal dead zone).\n\n**const**: Block-scoped, cannot be redeclared or reassigned, must be initialized, hoisted but not initialized.",
        "codeExample": "// var - function scoped\nfunction example() {\n  if (true) {\n    var x = 1;\n  }\n  console.log(x); // 1 - accessible\n}\n\n// let - block scoped\nfunction example2() {\n  if (true) {\n    let y = 1;\n  }\n  // console.log(y); // ReferenceError\n}\n\n// const - immutable binding\nconst z = 1;\n// z = 2; // TypeError",
        "keyPoints": [
          "var is function-scoped, let and const are block-scoped",
          "const creates immutable bindings",
          "let and const have temporal dead zone",
          "Prefer const for immutable values, let for mutable"
        ],
        "tags": ["variables", "let", "const", "var", "scope"]
      }
    ]
  };

  // Practice Quiz
  const fundamentalsQuiz = {
    "metadata": {
      "fileId": "fundamentals-quiz-001",
      "type": "quiz",
      "topic": "fundamentals", 
      "difficulty": "beginner",
      "tags": ["fundamentals", "quiz"],
      "version": "1.0.0"
    },
    "quizzes": [
      {
        "id": "quiz-fundamentals-001",
        "title": "JavaScript Fundamentals Quiz",
        "category": "fundamentals",
        "difficulty": "easy",
        "timeLimit": 10,
        "passingScore": 70,
        "description": "Test your knowledge of JavaScript fundamentals including variables and data types",
        "questions": [
          {
            "id": "q1",
            "question": "Which keyword should you use to declare a constant?",
            "options": ["var", "let", "const", "final"],
            "correctAnswer": 2,
            "explanation": "The 'const' keyword is used to declare constants that cannot be reassigned.",
            "difficulty": "easy",
            "points": 10,
            "tags": ["const", "variables"]
          },
          {
            "id": "q2", 
            "question": "What is the result of typeof null in JavaScript?",
            "options": ["'null'", "'undefined'", "'object'", "'boolean'"],
            "correctAnswer": 2,
            "explanation": "This is a famous JavaScript quirk. typeof null returns 'object', which is considered a bug in the language.",
            "difficulty": "medium",
            "points": 15,
            "tags": ["datatypes", "typeof", "null"]
          }
        ]
      }
    ]
  };

  await fs.writeFile(
    'data/explore/javascript-notes/fundamentals-notes-001.json',
    JSON.stringify(fundamentalsNotes, null, 2)
  );

  await fs.writeFile(
    'data/explore/practice-quiz/fundamentals-quiz-001.json',
    JSON.stringify(fundamentalsQuiz, null, 2)
  );
  
  console.log('📄 Created: Explore content (notes and quiz samples)');
}

// Run the generation
if (require.main === module) {
  generateSampleContent()
    .then(() => {
      console.log('\n🎉 Sample content generation completed successfully!');
      console.log('\n📋 Next Steps:');
      console.log('   1. Run the full content generator to create all files from knowledge base');
      console.log('   2. Update your components to use the enhanced data loader functions');
      console.log('   3. Test the multi-file loading in your app');
    })
    .catch(error => {
      console.error('\n❌ Generation failed:', error);
      process.exit(1);
    });
}