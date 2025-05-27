import { Lesson } from '@/types/lesson';

export const lessons: Lesson[] = [
  {
    id: 1,
    day: 1,
    title: "Introduction to JavaScript",
    summary: "Learn the basics of JavaScript, its history, and why it's essential for web development.",
    details: "JavaScript is a lightweight, interpreted programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js, Apache CouchDB and Adobe Acrobat. JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative styles.",
    codeExample: "// Your first JavaScript code\nconsole.log('Hello, World!');\n\n// Variables\nlet name = 'JavaScript';\nconst age = 25;\nvar isAwesome = true;\n\n// Basic operations\nlet sum = 10 + 20;\nconsole.log('Sum:', sum);",
    quiz: {
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Float", "Number"],
      answer: "Float"
    }
  },
  {
    id: 2,
    day: 2,
    title: "Variables & Data Types",
    summary: "Explore JavaScript variables, data types, and how to use them effectively.",
    details: "JavaScript has three kinds of variable declarations: var, let, and const. Variables can hold different data types including strings, numbers, booleans, objects, arrays, and more. Understanding data types is crucial for effective JavaScript programming.",
    codeExample: "// Variable declarations\nlet name = 'John';\nconst age = 30;\nvar isStudent = true;\n\n// Data types\nconst string = 'Hello';\nconst number = 42;\nconst boolean = true;\nconst array = [1, 2, 3];\nconst object = { key: 'value' };\nconst nullValue = null;\nlet undefinedValue;\n\n// Type checking\nconsole.log(typeof string); // 'string'\nconsole.log(typeof number); // 'number'",
    quiz: {
      question: "What will console.log(typeof []) output?",
      options: ["array", "object", "list", "undefined"],
      answer: "object"
    }
  },
  {
    id: 3,
    day: 3,
    title: "Operators & Expressions",
    summary: "Master JavaScript operators for arithmetic, comparison, logical operations, and more.",
    details: "JavaScript has various operators for performing operations on values. These include arithmetic operators (+, -, *, /), comparison operators (==, ===, !=, !==, >, <, >=, <=), logical operators (&&, ||, !), assignment operators (=, +=, -=, *=, /=), and more.",
    codeExample: "// Arithmetic operators\nlet sum = 5 + 10;\nlet difference = 20 - 5;\nlet product = 4 * 3;\nlet quotient = 10 / 2;\nlet remainder = 10 % 3;\n\n// Comparison operators\nconsole.log(5 == '5');   // true (loose equality)\nconsole.log(5 === '5');  // false (strict equality)\nconsole.log(10 > 5);     // true\n\n// Logical operators\nconst a = true, b = false;\nconsole.log(a && b);  // false\nconsole.log(a || b);  // true\nconsole.log(!a);      // false",
    quiz: {
      question: "What is the result of 10 % 3?",
      options: ["1", "3", "0.333", "3.333"],
      answer: "1"
    }
  },
  {
    id: 4,
    day: 4,
    title: "Conditional Statements",
    summary: "Learn how to control program flow with if, else, switch statements and the ternary operator.",
    details: "Conditional statements are used to perform different actions based on different conditions. JavaScript supports if, else if, else statements, switch statements, and the ternary operator for conditional logic.",
    codeExample: "// if, else if, else statements\nconst hour = 14;\n\nif (hour < 12) {\n  console.log('Good morning');\n} else if (hour < 18) {\n  console.log('Good afternoon');\n} else {\n  console.log('Good evening');\n}\n\n// Switch statement\nconst day = 'Monday';\n\nswitch (day) {\n  case 'Monday':\n    console.log('Start of work week');\n    break;\n  case 'Friday':\n    console.log('End of work week');\n    break;\n  default:\n    console.log('Another day');\n}\n\n// Ternary operator\nconst age = 20;\nconst canVote = age >= 18 ? 'Yes' : 'No';\nconsole.log(canVote);  // 'Yes'",
    quiz: {
      question: "What will the following code output? let x = 5; let result = x > 10 ? 'Greater' : 'Less'; console.log(result);",
      options: ["Greater", "Less", "undefined", "Error"],
      answer: "Less"
    }
  },
  {
    id: 5,
    day: 5,
    title: "Loops & Iterations",
    summary: "Discover different ways to create loops and iterate through data in JavaScript.",
    details: "Loops are used to execute a block of code repeatedly. JavaScript provides several looping mechanisms including for, while, do-while loops, and array iteration methods like forEach, map, filter, and reduce.",
    codeExample: "// for loop\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n\n// while loop\nlet count = 0;\nwhile (count < 3) {\n  console.log('Count:', count);\n  count++;\n}\n\n// do-while loop\nlet num = 1;\ndo {\n  console.log('Number:', num);\n  num++;\n} while (num <= 3);\n\n// Array iteration\nconst fruits = ['apple', 'banana', 'orange'];\n\n// forEach\nfruits.forEach(fruit => console.log(fruit));\n\n// map\nconst upperFruits = fruits.map(fruit => fruit.toUpperCase());\nconsole.log(upperFruits);  // ['APPLE', 'BANANA', 'ORANGE']",
    quiz: {
      question: "Which loop will always execute at least once?",
      options: ["for loop", "while loop", "do-while loop", "forEach loop"],
      answer: "do-while loop"
    }
  },
  {
    id: 6,
    day: 6,
    title: "Functions in JavaScript",
    summary: "Learn to create and use functions, the building blocks of JavaScript applications.",
    details: "Functions are reusable blocks of code designed to perform specific tasks. JavaScript supports various ways to define functions including function declarations, function expressions, arrow functions, and more. Functions can accept parameters and return values.",
    codeExample: "// Function declaration\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Function expression\nconst add = function(a, b) {\n  return a + b;\n};\n\n// Arrow function\nconst multiply = (a, b) => a * b;\n\n// Default parameters\nfunction welcome(name = 'Guest') {\n  console.log(`Welcome, ${name}!`);\n}\n\n// Rest parameters\nfunction sum(...numbers) {\n  return numbers.reduce((total, num) => total + num, 0);\n}\n\nconsole.log(greet('John'));       // 'Hello, John!'\nconsole.log(add(5, 3));           // 8\nconsole.log(multiply(4, 2));      // 8\nwelcome();                         // 'Welcome, Guest!'\nconsole.log(sum(1, 2, 3, 4, 5));  // 15",
    quiz: {
      question: "What's the main difference between function declarations and arrow functions regarding 'this' binding?",
      options: [
        "Arrow functions don't have their own 'this'",
        "Function declarations don't have 'this'",
        "They handle 'this' the same way",
        "Arrow functions can't access 'this'"
      ],
      answer: "Arrow functions don't have their own 'this'"
    }
  },
  {
    id: 7,
    day: 7,
    title: "Arrays & Array Methods",
    summary: "Master JavaScript arrays and the powerful methods for manipulating them.",
    details: "Arrays are ordered collections of values. JavaScript provides numerous methods to work with arrays, including methods for adding/removing elements, finding elements, transforming arrays, and more.",
    codeExample: "// Creating arrays\nconst fruits = ['apple', 'banana', 'orange'];\nconst numbers = new Array(1, 2, 3, 4, 5);\n\n// Accessing elements\nconsole.log(fruits[0]);  // 'apple'\n\n// Adding/removing elements\nfruits.push('grape');     // Add to end\nfruits.unshift('mango');  // Add to beginning\nfruits.pop();             // Remove from end\nfruits.shift();           // Remove from beginning\n\n// Finding elements\nconst hasApple = fruits.includes('apple');  // true\nconst index = fruits.indexOf('banana');     // 1\n\n// Transforming arrays\nconst doubled = numbers.map(num => num * 2);\nconst evenNumbers = numbers.filter(num => num % 2 === 0);\nconst sum = numbers.reduce((total, num) => total + num, 0);\n\n// Iterating\nfruits.forEach(fruit => console.log(fruit));\n\n// Sorting\nnumbers.sort((a, b) => a - b);  // Numeric sort",
    quiz: {
      question: "Which array method doesn't change the original array?",
      options: ["push()", "sort()", "map()", "splice()"],
      answer: "map()"
    }
  },
  {
    id: 8,
    day: 8,
    title: "Objects & Object Methods",
    summary: "Explore JavaScript objects, properties, methods, and object manipulation techniques.",
    details: "Objects are collections of key-value pairs. They are fundamental to JavaScript and allow you to store related data and functionality together. Objects can contain properties and methods, and JavaScript provides various ways to create and manipulate objects.",
    codeExample: "// Creating objects\nconst person = {\n  name: 'John',\n  age: 30,\n  isEmployed: true,\n  greet: function() {\n    return `Hello, my name is ${this.name}`;\n  }\n};\n\n// Accessing properties\nconsole.log(person.name);       // 'John'\nconsole.log(person['age']);     // 30\n\n// Adding/modifying properties\nperson.location = 'New York';\nperson.age = 31;\n\n// Deleting properties\ndelete person.isEmployed;\n\n// Object methods\nconsole.log(person.greet());  // 'Hello, my name is John'\n\n// Object.keys(), Object.values(), Object.entries()\nconsole.log(Object.keys(person));    // ['name', 'age', 'location', 'greet']\nconsole.log(Object.values(person));  // ['John', 31, 'New York', ƒ]\n\n// Spread operator with objects\nconst personCopy = { ...person };\n\n// Object destructuring\nconst { name, age } = person;\nconsole.log(name, age);  // 'John' 31",
    quiz: {
      question: "What will Object.keys({ a: 1, b: 2, c: 3 }) return?",
      options: ["[1, 2, 3]", "['a', 'b', 'c']", "[{a: 1}, {b: 2}, {c: 3}]", "3"],
      answer: "['a', 'b', 'c']"
    }
  },
  {
    id: 9,
    day: 9,
    title: "Higher Order Functions",
    summary: "Understand higher-order functions and functional programming concepts in JavaScript.",
    details: "Higher-order functions are functions that operate on other functions, either by taking them as arguments or by returning them. They are a key concept in functional programming and are widely used in JavaScript for tasks like array manipulation, event handling, and more.",
    codeExample: "// Functions as arguments\nfunction calculate(operation, a, b) {\n  return operation(a, b);\n}\n\nconst add = (x, y) => x + y;\nconst subtract = (x, y) => x - y;\n\nconsole.log(calculate(add, 10, 5));      // 15\nconsole.log(calculate(subtract, 10, 5));  // 5\n\n// Functions returning functions\nfunction multiplier(factor) {\n  return function(number) {\n    return number * factor;\n  };\n}\n\nconst double = multiplier(2);\nconst triple = multiplier(3);\n\nconsole.log(double(5));  // 10\nconsole.log(triple(5));  // 15\n\n// Array higher-order functions\nconst numbers = [1, 2, 3, 4, 5];\n\n// map\nconst squared = numbers.map(num => num * num);\n\n// filter\nconst evenNumbers = numbers.filter(num => num % 2 === 0);\n\n// reduce\nconst sum = numbers.reduce((total, num) => total + num, 0);\n\nconsole.log(squared);      // [1, 4, 9, 16, 25]\nconsole.log(evenNumbers);  // [2, 4]\nconsole.log(sum);          // 15",
    quiz: {
      question: "Which of the following is NOT a higher-order function in JavaScript?",
      options: ["map()", "filter()", "reduce()", "push()"],
      answer: "push()"
    }
  },
  {
    id: 10,
    day: 10,
    title: "Error Handling",
    summary: "Learn to handle errors gracefully using try-catch blocks and error objects.",
    details: "Error handling is an important aspect of writing robust JavaScript code. JavaScript provides mechanisms like try-catch-finally blocks, throw statements, and Error objects to handle and manage errors that might occur during program execution.",
    codeExample: "// Basic try-catch\ntry {\n  // Code that might throw an error\n  const result = 10 / 0;\n  console.log(result);  // Infinity (not an error in JavaScript)\n  \n  // This will throw an error\n  nonExistentFunction();\n} catch (error) {\n  console.error('An error occurred:', error.message);\n} finally {\n  console.log('This always executes');\n}\n\n// Throwing custom errors\nfunction divide(a, b) {\n  if (b === 0) {\n    throw new Error('Division by zero is not allowed');\n  }\n  return a / b;\n}\n\ntry {\n  console.log(divide(10, 2));  // 5\n  console.log(divide(10, 0));  // Throws error\n} catch (error) {\n  console.error(error.message);  // 'Division by zero is not allowed'\n}\n\n// Different error types\ntry {\n  // TypeError\n  null.toString();\n} catch (error) {\n  if (error instanceof TypeError) {\n    console.error('Type error:', error.message);\n  } else {\n    console.error('Other error:', error.message);\n  }\n}",
    quiz: {
      question: "What is the purpose of the 'finally' block in a try-catch statement?",
      options: [
        "It only executes if no errors occur",
        "It only executes if an error occurs",
        "It always executes, regardless of whether an error occurs",
        "It replaces the catch block"
      ],
      answer: "It always executes, regardless of whether an error occurs"
    }
  },
  {
    id: 11,
    day: 11,
    title: "Destructuring & Spread Operator",
    summary: "Master modern JavaScript syntax for working with arrays and objects efficiently.",
    details: "Destructuring and the spread operator are powerful features introduced in ES6 that make working with arrays and objects more concise and readable. Destructuring allows you to extract values from arrays or properties from objects into distinct variables, while the spread operator allows you to expand arrays or objects.",
    codeExample: "// Array destructuring\nconst colors = ['red', 'green', 'blue'];\nconst [first, second, third] = colors;\n\nconsole.log(first);   // 'red'\nconsole.log(second);  // 'green'\n\n// Skipping elements\nconst [primary, , tertiary] = colors;\nconsole.log(tertiary);  // 'blue'\n\n// Default values\nconst [main = 'black', ...rest] = ['yellow'];\nconsole.log(main);  // 'yellow'\nconsole.log(rest);  // []\n\n// Object destructuring\nconst person = {\n  name: 'Alice',\n  age: 28,\n  location: 'New York'\n};\n\nconst { name, age } = person;\nconsole.log(name, age);  // 'Alice' 28\n\n// Renaming variables\nconst { name: fullName, location: city } = person;\nconsole.log(fullName, city);  // 'Alice' 'New York'\n\n// Default values\nconst { country = 'USA' } = person;\nconsole.log(country);  // 'USA'\n\n// Spread operator with arrays\nconst arr1 = [1, 2, 3];\nconst arr2 = [4, 5, 6];\nconst combined = [...arr1, ...arr2];\nconsole.log(combined);  // [1, 2, 3, 4, 5, 6]\n\n// Spread operator with objects\nconst defaults = { theme: 'dark', fontSize: 16 };\nconst userSettings = { fontSize: 18 };\nconst settings = { ...defaults, ...userSettings };\nconsole.log(settings);  // { theme: 'dark', fontSize: 18 }",
    quiz: {
      question: "What will be the value of 'rest' in the following code? const [a, ...rest] = [1, 2, 3, 4];",
      options: ["1", "[1]", "[2, 3, 4]", "4"],
      answer: "[2, 3, 4]"
    }
  },
  {
    id: 12,
    day: 12,
    title: "Classes & OOP in JavaScript",
    summary: "Explore object-oriented programming using JavaScript classes and inheritance.",
    details: "JavaScript classes, introduced in ES6, provide a cleaner and more intuitive syntax for creating objects and dealing with inheritance. They are syntactical sugar over JavaScript's existing prototype-based inheritance, but make the code more readable and easier to work with when implementing object-oriented programming (OOP) concepts.",
    codeExample: "// Class declaration\nclass Person {\n  constructor(name, age) {\n    this.name = name;\n    this.age = age;\n  }\n  \n  // Method\n  greet() {\n    return `Hello, my name is ${this.name}`;\n  }\n  \n  // Static method\n  static isAdult(age) {\n    return age >= 18;\n  }\n  \n  // Getter\n  get info() {\n    return `${this.name}, ${this.age} years old`;\n  }\n  \n  // Setter\n  set info(value) {\n    [this.name, this.age] = value.split(',');\n    this.age = parseInt(this.age);\n  }\n}\n\n// Creating instances\nconst john = new Person('John', 30);\nconsole.log(john.greet());  // 'Hello, my name is John'\nconsole.log(Person.isAdult(30));  // true\n\n// Using getter and setter\nconsole.log(john.info);  // 'John, 30 years old'\njohn.info = 'Jane,25';\nconsole.log(john.name);  // 'Jane'\n\n// Inheritance\nclass Employee extends Person {\n  constructor(name, age, position) {\n    super(name, age);  // Call parent constructor\n    this.position = position;\n  }\n  \n  // Override method\n  greet() {\n    return `${super.greet()}. I work as a ${this.position}`;\n  }\n  \n  // New method\n  work() {\n    return `${this.name} is working`;\n  }\n}\n\nconst alice = new Employee('Alice', 28, 'Developer');\nconsole.log(alice.greet());  // 'Hello, my name is Alice. I work as a Developer'\nconsole.log(alice.work());   // 'Alice is working'",
    quiz: {
      question: "What keyword is used to call the parent class constructor in a child class?",
      options: ["this", "parent", "super", "extend"],
      answer: "super"
    }
  },
  {
    id: 13,
    day: 13,
    title: "Promises & Async/Await",
    summary: "Master asynchronous JavaScript with Promises and the async/await syntax.",
    details: "Promises and async/await are features that make working with asynchronous operations in JavaScript more manageable. Promises represent the eventual completion or failure of an asynchronous operation and allow you to chain operations, while async/await provides a more synchronous-looking syntax for working with Promises.",
    codeExample: "// Creating a Promise\nconst fetchData = () => {\n  return new Promise((resolve, reject) => {\n    // Simulating an API call\n    setTimeout(() => {\n      const success = true;\n      if (success) {\n        resolve({ id: 1, name: 'John' });\n      } else {\n        reject(new Error('Failed to fetch data'));\n      }\n    }, 1000);\n  });\n};\n\n// Using Promises with then/catch\nfetchData()\n  .then(data => {\n    console.log('Data:', data);\n    return data.id;\n  })\n  .then(id => {\n    console.log('ID:', id);\n  })\n  .catch(error => {\n    console.error('Error:', error.message);\n  })\n  .finally(() => {\n    console.log('Operation completed');\n  });\n\n// Promise.all\nconst promise1 = Promise.resolve(3);\nconst promise2 = new Promise(resolve => setTimeout(() => resolve('foo'), 100));\n\nPromise.all([promise1, promise2])\n  .then(values => {\n    console.log(values);  // [3, 'foo']\n  });\n\n// Async/await\nasync function fetchUserData() {\n  try {\n    const data = await fetchData();\n    console.log('User:', data);\n    \n    // You can use multiple await statements\n    const id = data.id;\n    const details = await fetchUserDetails(id);\n    \n    return details;\n  } catch (error) {\n    console.error('Error:', error.message);\n  }\n}\n\n// Helper function for the example\nfunction fetchUserDetails(id) {\n  return Promise.resolve({ id, email: 'john@example.com' });\n}\n\n// Calling the async function\nfetchUserData().then(details => {\n  console.log('Details:', details);\n});",
    quiz: {
      question: "What is the state of a Promise that has neither resolved nor rejected yet?",
      options: ["fulfilled", "rejected", "pending", "settled"],
      answer: "pending"
    }
  },
  {
    id: 14,
    day: 14,
    title: "DOM Manipulation",
    summary: "Learn to interact with HTML documents using JavaScript's DOM API.",
    details: "The Document Object Model (DOM) is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content. JavaScript can be used to access and manipulate the DOM, allowing you to create dynamic web pages.",
    codeExample: "// Selecting elements\nconst heading = document.getElementById('main-heading');\nconst paragraphs = document.getElementsByTagName('p');\nconst buttons = document.getElementsByClassName('btn');\nconst firstButton = document.querySelector('.btn');\nconst allLinks = document.querySelectorAll('a');\n\n// Modifying content\nheading.textContent = 'New Heading';\nheading.innerHTML = 'New <span>Heading</span>';\n\n// Changing styles\nheading.style.color = 'blue';\nheading.style.fontSize = '24px';\n\n// Adding/removing classes\nheading.classList.add('highlight');\nheading.classList.remove('old-class');\nheading.classList.toggle('visible');\n\n// Creating elements\nconst newParagraph = document.createElement('p');\nnewParagraph.textContent = 'This is a new paragraph.';\ndocument.body.appendChild(newParagraph);\n\n// Removing elements\nconst oldElement = document.getElementById('old-element');\nif (oldElement) {\n  oldElement.parentNode.removeChild(oldElement);\n  // Or using newer method\n  // oldElement.remove();\n}\n\n// Event handling\nconst button = document.querySelector('button');\nbutton.addEventListener('click', function(event) {\n  console.log('Button clicked!');\n  console.log('Event:', event);\n});\n\n// Event delegation\ndocument.getElementById('list').addEventListener('click', function(event) {\n  if (event.target.tagName === 'LI') {\n    console.log('List item clicked:', event.target.textContent);\n  }\n});",
    quiz: {
      question: "Which method is used to select all elements that match a CSS selector?",
      options: ["getElementById()", "querySelector()", "querySelectorAll()", "getElementsByTagName()"],
      answer: "querySelectorAll()"
    }
  },
  {
    id: 15,
    day: 15,
    title: "Event Handling",
    summary: "Master JavaScript events and learn to create interactive web applications.",
    details: "Events are actions or occurrences that happen in the browser, such as a user clicking a button or a page finishing loading. JavaScript can be used to detect these events and execute code in response, allowing you to create interactive web applications.",
    codeExample: "// Basic event handling\nconst button = document.getElementById('myButton');\n\nbutton.addEventListener('click', function() {\n  console.log('Button clicked!');\n});\n\n// Event object\nbutton.addEventListener('click', function(event) {\n  console.log('Event type:', event.type);\n  console.log('Target element:', event.target);\n  \n  // Prevent default behavior\n  event.preventDefault();\n  \n  // Stop propagation\n  event.stopPropagation();\n});\n\n// Multiple events\nfunction handleMouseEvents(event) {\n  console.log(`Mouse ${event.type} at coordinates: ${event.clientX}, ${event.clientY}`);\n}\n\ndocument.addEventListener('mousemove', handleMouseEvents);\ndocument.addEventListener('mousedown', handleMouseEvents);\ndocument.addEventListener('mouseup', handleMouseEvents);\n\n// Removing event listeners\ndocument.removeEventListener('mousemove', handleMouseEvents);\n\n// Event delegation\ndocument.getElementById('parent').addEventListener('click', function(event) {\n  if (event.target.classList.contains('child')) {\n    console.log('Child element clicked:', event.target);\n  }\n});\n\n// Common events\ndocument.addEventListener('DOMContentLoaded', function() {\n  console.log('DOM fully loaded');\n});\n\nwindow.addEventListener('load', function() {\n  console.log('Page fully loaded');\n});\n\nwindow.addEventListener('resize', function() {\n  console.log('Window resized');\n});\n\nconst form = document.getElementById('myForm');\nform.addEventListener('submit', function(event) {\n  event.preventDefault();\n  console.log('Form submitted');\n});",
    quiz: {
      question: "Which event fires when the DOM content has been fully loaded, but before all resources like images are loaded?",
      options: ["load", "DOMContentLoaded", "ready", "onload"],
      answer: "DOMContentLoaded"
    }
  },
  {
    id: 16,
    day: 16,
    title: "Fetch API & AJAX",
    summary: "Learn to make HTTP requests and handle responses using JavaScript.",
    details: "The Fetch API and AJAX (Asynchronous JavaScript and XML) are technologies that allow you to make HTTP requests from JavaScript without reloading the page. They are essential for building modern web applications that need to communicate with servers and APIs.",
    codeExample: "// Basic fetch request\nfetch('https://api.example.com/data')\n  .then(response => {\n    if (!response.ok) {\n      throw new Error(`HTTP error! Status: ${response.status}`);\n    }\n    return response.json();\n  })\n  .then(data => {\n    console.log('Data:', data);\n  })\n  .catch(error => {\n    console.error('Error:', error);\n  });\n\n// Fetch with options\nfetch('https://api.example.com/users', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer token123'\n  },\n  body: JSON.stringify({\n    name: 'John',\n    email: 'john@example.com'\n  })\n})\n.then(response => response.json())\n.then(data => console.log('User created:', data))\n.catch(error => console.error('Error:', error));\n\n// Using async/await with fetch\nasync function fetchUsers() {\n  try {\n    const response = await fetch('https://api.example.com/users');\n    \n    if (!response.ok) {\n      throw new Error(`HTTP error! Status: ${response.status}`);\n    }\n    \n    const users = await response.json();\n    console.log('Users:', users);\n    return users;\n  } catch (error) {\n    console.error('Error fetching users:', error);\n  }\n}\n\n// XMLHttpRequest (older AJAX approach)\nconst xhr = new XMLHttpRequest();\nxhr.open('GET', 'https://api.example.com/data');\n\nxhr.onload = function() {\n  if (xhr.status === 200) {\n    const data = JSON.parse(xhr.responseText);\n    console.log('Data:', data);\n  } else {\n    console.error('Request failed. Status:', xhr.status);\n  }\n};\n\nxhr.onerror = function() {\n  console.error('Network error');\n};\n\nxhr.send();",
    quiz: {
      question: "What is the main advantage of using the Fetch API over XMLHttpRequest?",
      options: [
        "It's faster",
        "It uses Promises, making it easier to work with",
        "It works in all browsers including IE6",
        "It automatically parses JSON"
      ],
      answer: "It uses Promises, making it easier to work with"
    }
  },
  {
    id: 17,
    day: 17,
    title: "ES6+ Features",
    summary: "Explore modern JavaScript features that make your code more concise and powerful.",
    details: "ECMAScript 6 (ES6) and later versions introduced many new features to JavaScript that make the language more powerful and developer-friendly. These features include arrow functions, template literals, destructuring, spread/rest operators, and more.",
    codeExample: "// Arrow functions\nconst add = (a, b) => a + b;\nconst greet = name => `Hello, ${name}`;\nconst createObject = () => ({ key: 'value' });\n\n// Template literals\nconst name = 'John';\nconst greeting = `Hello, ${name}! Today is ${new Date().toDateString()}`;\n\n// Destructuring\nconst person = { name: 'Alice', age: 28, city: 'New York' };\nconst { name: fullName, age } = person;\n\nconst colors = ['red', 'green', 'blue'];\nconst [primary, secondary] = colors;\n\n// Spread/rest operators\nconst numbers = [1, 2, 3];\nconst moreNumbers = [...numbers, 4, 5];\n\nconst sum = (...args) => args.reduce((total, num) => total + num, 0);\n\n// Default parameters\nfunction createUser(name, age = 25, country = 'USA') {\n  return { name, age, country };\n}\n\n// Object property shorthand\nconst x = 10, y = 20;\nconst point = { x, y };\n\n// Computed property names\nconst propName = 'dynamicKey';\nconst obj = {\n  [propName]: 'value',\n  [`computed_${propName}`]: 'another value'\n};\n\n// Class syntax\nclass Person {\n  constructor(name) {\n    this.name = name;\n  }\n  \n  greet() {\n    return `Hello, I'm ${this.name}`;\n  }\n}\n\n// Modules (import/export)\n// In a separate file:\n// export const PI = 3.14159;\n// export function square(x) { return x * x; }\n// export default class Calculator { ... }\n\n// Importing:\n// import Calculator, { PI, square } from './math.js';",
    quiz: {
      question: "Which ES6+ feature allows you to unpack values from arrays or properties from objects?",
      options: ["Spread operator", "Rest parameters", "Destructuring", "Template literals"],
      answer: "Destructuring"
    }
  },
  {
    id: 18,
    day: 18,
    title: "JavaScript Modules",
    summary: "Learn to organize your code using JavaScript modules and import/export syntax.",
    details: "JavaScript modules allow you to break up your code into separate files, making it more maintainable and reusable. The ES6 module system provides a standardized way to share code between files using import and export statements.",
    codeExample: "// math.js - Exporting\n// Named exports\nexport const PI = 3.14159;\nexport function square(x) {\n  return x * x;\n}\n\nexport function cube(x) {\n  return x * x * x;\n}\n\n// Default export (only one per module)\nexport default class Calculator {\n  add(a, b) {\n    return a + b;\n  }\n  \n  subtract(a, b) {\n    return a - b;\n  }\n}\n\n// utils.js - Another module\nexport function formatDate(date) {\n  return date.toLocaleDateString();\n}\n\nexport const API_URL = 'https://api.example.com';\n\n// main.js - Importing\n// Import default export\nimport Calculator from './math.js';\n\n// Import named exports\nimport { PI, square } from './math.js';\n\n// Import with alias\nimport { cube as calculateCube } from './math.js';\n\n// Import all exports as a namespace\nimport * as utils from './utils.js';\n\n// Using the imports\nconst calc = new Calculator();\nconsole.log(calc.add(5, 3));  // 8\n\nconsole.log(PI);  // 3.14159\nconsole.log(square(4));  // 16\nconsole.log(calculateCube(3));  // 27\n\nconsole.log(utils.formatDate(new Date()));  // e.g., '5/12/2023'\nconsole.log(utils.API_URL);  // 'https://api.example.com'\n\n// Dynamic imports (lazy loading)\nbutton.addEventListener('click', async () => {\n  const module = await import('./feature.js');\n  module.initFeature();\n});",
    quiz: {
      question: "How many default exports can a single JavaScript module have?",
      options: ["None", "One", "Two", "Unlimited"],
      answer: "One"
    }
  },
  {
    id: 19,
    day: 19,
    title: "Regular Expressions",
    summary: "Master pattern matching in JavaScript using regular expressions.",
    details: "Regular expressions (regex) are patterns used to match character combinations in strings. JavaScript has built-in support for regular expressions, which are powerful tools for text processing, validation, and search/replace operations.",
    codeExample: "// Creating regular expressions\nconst pattern1 = /hello/;\nconst pattern2 = new RegExp('hello');\n\n// Basic matching\nconst text = 'hello world';\nconsole.log(pattern1.test(text));  // true\n\n// Matching with flags\nconst caseInsensitive = /hello/i;  // 'i' flag for case-insensitive\nconsole.log(caseInsensitive.test('Hello World'));  // true\n\n// Common flags\n// g - global match (find all matches)\n// i - case-insensitive\n// m - multiline mode\n// s - dot matches newlines\n// u - unicode\n// y - sticky mode\n\n// Character classes\nconst digits = /\\d+/;  // One or more digits\nconst word = /\\w+/;    // One or more word characters (alphanumeric + underscore)\nconst whitespace = /\\s+/;  // One or more whitespace characters\n\n// Negated character classes\nconst nonDigits = /\\D+/;  // One or more non-digits\nconst nonWord = /\\W+/;    // One or more non-word characters\nconst nonWhitespace = /\\S+/;  // One or more non-whitespace characters\n\n// Quantifiers\nconst zeroOrOne = /colou?r/;  // 'u' is optional (matches 'color' or 'colour')\nconst zeroOrMore = /go*d/;     // 'o' can appear 0 or more times\nconst oneOrMore = /go+d/;      // 'o' must appear 1 or more times\nconst exactCount = /\\d{3}/;    // Exactly 3 digits\nconst rangeCount = /\\d{2,4}/;  // Between 2 and 4 digits\n\n// Anchors\nconst startsWith = /^Hello/;    // String starts with 'Hello'\nconst endsWith = /world$/;      // String ends with 'world'\n\n// Groups and alternation\nconst group = /(\\d{3})-(\\d{4})/;  // Groups of digits\nconst either = /cat|dog/;         // Matches 'cat' or 'dog'\n\n// exec() method - returns array with match details or null\nconst match = /\\d{3}-\\d{4}/.exec('Call 555-1234 for help');\nconsole.log(match);  // ['555-1234', index: 5, input: 'Call 555-1234 for help', groups: undefined]\n\n// match() method on strings\nconst text2 = 'My phone numbers are 555-1234 and 555-5678';\nconst matches = text2.match(/\\d{3}-\\d{4}/g);\nconsole.log(matches);  // ['555-1234', '555-5678']\n\n// replace() with regex\nconst censored = 'Bad words: damn, hell'.replace(/damn|hell/gi, '****');\nconsole.log(censored);  // 'Bad words: ****, ****'\n\n// Using captured groups in replacement\nconst formatted = 'John Doe'.replace(/(\\w+)\\s(\\w+)/, '$2, $1');\nconsole.log(formatted);  // 'Doe, John'",
    quiz: {
      question: "Which regex pattern would match a valid email address format?",
      options: [
        "/\\w+@\\w+\\.\\w+/",
        "/[a-zA-Z]+/",
        "/\\d{3}-\\d{3}-\\d{4}/",
        "/^https?:\\/\\//",
      ],
      answer: "/\\w+@\\w+\\.\\w+/"
    }
  },
  {
    id: 20,
    day: 20,
    title: "JavaScript Design Patterns",
    summary: "Explore common design patterns and architectural approaches in JavaScript.",
    details: "Design patterns are reusable solutions to common problems in software design. They represent best practices evolved over time by experienced developers. Understanding design patterns helps you write more maintainable, flexible, and scalable JavaScript code.",
    codeExample: "// Singleton Pattern\nconst Singleton = (function() {\n  let instance;\n  \n  function createInstance() {\n    return {\n      name: 'Singleton Instance',\n      method() {\n        console.log('Method called');\n      }\n    };\n  }\n  \n  return {\n    getInstance() {\n      if (!instance) {\n        instance = createInstance();\n      }\n      return instance;\n    }\n  };\n})();\n\nconst instance1 = Singleton.getInstance();\nconst instance2 = Singleton.getInstance();\nconsole.log(instance1 === instance2);  // true\n\n// Factory Pattern\nclass Car {\n  constructor(make, model) {\n    this.make = make;\n    this.model = model;\n    this.type = 'Car';\n  }\n}\n\nclass Truck {\n  constructor(make, model) {\n    this.make = make;\n    this.model = model;\n    this.type = 'Truck';\n  }\n}\n\nclass VehicleFactory {\n  createVehicle(type, make, model) {\n    switch (type) {\n      case 'car':\n        return new Car(make, model);\n      case 'truck':\n        return new Truck(make, model);\n      default:\n        throw new Error(`Vehicle type ${type} not supported`);\n    }\n  }\n}\n\nconst factory = new VehicleFactory();\nconst myCar = factory.createVehicle('car', 'Toyota', 'Corolla');\nconst myTruck = factory.createVehicle('truck', 'Ford', 'F150');\n\n// Observer Pattern\nclass Subject {\n  constructor() {\n    this.observers = [];\n  }\n  \n  subscribe(observer) {\n    this.observers.push(observer);\n  }\n  \n  unsubscribe(observer) {\n    this.observers = this.observers.filter(obs => obs !== observer);\n  }\n  \n  notify(data) {\n    this.observers.forEach(observer => observer.update(data));\n  }\n}\n\nclass Observer {\n  constructor(name) {\n    this.name = name;\n  }\n  \n  update(data) {\n    console.log(`${this.name} received: ${data}`);\n  }\n}\n\nconst subject = new Subject();\nconst observer1 = new Observer('Observer 1');\nconst observer2 = new Observer('Observer 2');\n\nsubject.subscribe(observer1);\nsubject.subscribe(observer2);\nsubject.notify('Hello observers!');  // Both observers receive the notification\n\n// Module Pattern\nconst Calculator = (function() {\n  // Private variables and functions\n  let result = 0;\n  \n  function validateNumber(num) {\n    return typeof num === 'number' && !isNaN(num);\n  }\n  \n  // Public API\n  return {\n    add(num) {\n      if (validateNumber(num)) {\n        result += num;\n      }\n      return this;\n    },\n    \n    subtract(num) {\n      if (validateNumber(num)) {\n        result -= num;\n      }\n      return this;\n    },\n    \n    getResult() {\n      return result;\n    },\n    \n    reset() {\n      result = 0;\n      return this;\n    }\n  };\n})();\n\nconsole.log(Calculator.add(5).add(10).subtract(3).getResult());  // 12",
    quiz: {
      question: "Which design pattern ensures a class has only one instance and provides a global point of access to it?",
      options: ["Factory", "Observer", "Singleton", "Module"],
      answer: "Singleton"
    }
  },
  {
    id: 21,
    day: 21,
    title: "JavaScript Performance",
    summary: "Learn techniques to optimize your JavaScript code for better performance.",
    details: "JavaScript performance optimization is crucial for creating responsive and efficient web applications. Understanding how JavaScript engines work and applying best practices can significantly improve the speed and resource usage of your code.",
    codeExample: "// 1. Avoid global variables\n// Bad\nvar globalVar = 'I am global';\n\n// Better - use local scope\nfunction example() {\n  const localVar = 'I am local';\n  // Use localVar...\n}\n\n// 2. Use object/array literals instead of constructors\n// Slower\nconst arr1 = new Array();\narr1.push(1, 2, 3);\n\n// Faster\nconst arr2 = [1, 2, 3];\n\n// 3. Optimize loops\n// Less efficient\nconst items = ['a', 'b', 'c', 'd'];\nfor (let i = 0; i < items.length; i++) {\n  console.log(items[i]);\n}\n\n// More efficient - cache the length\nconst len = items.length;\nfor (let i = 0; i < len; i++) {\n  console.log(items[i]);\n}\n\n// Even better for arrays\nitems.forEach(item => console.log(item));\n\n// 4. Use appropriate methods for array operations\n// Inefficient way to find an element\nlet found = null;\nfor (let i = 0; i < items.length; i++) {\n  if (items[i] === 'c') {\n    found = items[i];\n    break;\n  }\n}\n\n// Better - use built-in methods\nfound = items.find(item => item === 'c');\n\n// 5. Debounce expensive operations\nfunction debounce(func, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => func.apply(this, args), wait);\n  };\n}\n\n// Usage\nconst expensiveOperation = () => {\n  console.log('Expensive operation executed');\n  // Complex calculations...\n};\n\nconst debouncedOperation = debounce(expensiveOperation, 300);\n\n// This will only execute once after 300ms of inactivity\ndebouncedOperation();\ndebouncedOperation();\ndebouncedOperation();\n\n// 6. Use Web Workers for CPU-intensive tasks\n// main.js\nif (window.Worker) {\n  const worker = new Worker('worker.js');\n  \n  worker.postMessage({ data: 'Start calculation' });\n  \n  worker.onmessage = function(e) {\n    console.log('Result from worker:', e.data);\n  };\n}\n\n// worker.js (separate file)\n// self.onmessage = function(e) {\n//   // Perform CPU-intensive calculation\n//   const result = performHeavyCalculation(e.data);\n//   self.postMessage(result);\n// };\n\n// 7. Use requestAnimationFrame for animations\nfunction animate() {\n  // Update animation\n  element.style.left = `${position++}px`;\n  \n  // Request next frame\n  if (position < 300) {\n    requestAnimationFrame(animate);\n  }\n}\n\n// Start animation\nrequestAnimationFrame(animate);",
    quiz: {
      question: "Which of the following is NOT a good practice for JavaScript performance optimization?",
      options: [
        "Caching array length before loops",
        "Using global variables for frequently accessed data",
        "Using requestAnimationFrame for animations",
        "Using Web Workers for CPU-intensive tasks"
      ],
      answer: "Using global variables for frequently accessed data"
    }
  },
  {
    id: 22,
    day: 22,
    title: "Browser Storage",
    summary: "Explore different ways to store data in the browser using JavaScript.",
    details: "Browser storage mechanisms allow web applications to store data on the client-side, providing persistence between page reloads and even browser sessions. JavaScript provides several APIs for browser storage, each with different characteristics and use cases.",
    codeExample: "// 1. localStorage - persistent storage (no expiration)\n// Storing data\nlocalStorage.setItem('username', 'john_doe');\nlocalStorage.setItem('preferences', JSON.stringify({\n  theme: 'dark',\n  fontSize: 16\n}));\n\n// Retrieving data\nconst username = localStorage.getItem('username');\nconst preferences = JSON.parse(localStorage.getItem('preferences'));\n\n// Removing data\nlocalStorage.removeItem('username');\n\n// Clearing all data\n// localStorage.clear();\n\n// 2. sessionStorage - session-only storage (cleared when page session ends)\n// Storing data\nsessionStorage.setItem('tempData', 'This will be lost when session ends');\n\n// Retrieving data\nconst tempData = sessionStorage.getItem('tempData');\n\n// 3. Cookies - small text files (can set expiration)\n// Setting a cookie that expires in 7 days\nfunction setCookie(name, value, days) {\n  const expires = new Date();\n  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);\n  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;\n}\n\n// Getting a cookie value\nfunction getCookie(name) {\n  const nameEQ = name + '=';\n  const cookies = document.cookie.split(';');\n  \n  for (let i = 0; i < cookies.length; i++) {\n    let cookie = cookies[i].trim();\n    if (cookie.indexOf(nameEQ) === 0) {\n      return cookie.substring(nameEQ.length, cookie.length);\n    }\n  }\n  return null;\n}\n\n// Deleting a cookie\nfunction deleteCookie(name) {\n  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;\n}\n\n// Usage\nsetCookie('user_id', '12345', 7);\nconst userId = getCookie('user_id');\n\n// 4. IndexedDB - full database in the browser\n// Opening a database\nconst request = indexedDB.open('MyDatabase', 1);\n\nrequest.onerror = function(event) {\n  console.error('Database error:', event.target.error);\n};\n\nrequest.onupgradeneeded = function(event) {\n  const db = event.target.result;\n  \n  // Create an object store (table)\n  const store = db.createObjectStore('users', { keyPath: 'id' });\n  \n  // Create indexes\n  store.createIndex('name', 'name', { unique: false });\n  store.createIndex('email', 'email', { unique: true });\n};\n\nrequest.onsuccess = function(event) {\n  const db = event.target.result;\n  \n  // Adding data\n  function addUser(user) {\n    const transaction = db.transaction(['users'], 'readwrite');\n    const store = transaction.objectStore('users');\n    store.add(user);\n    \n    transaction.oncomplete = function() {\n      console.log('User added successfully');\n    };\n    \n    transaction.onerror = function(event) {\n      console.error('Transaction error:', event.target.error);\n    };\n  }\n  \n  // Getting data\n  function getUser(id) {\n    const transaction = db.transaction(['users']);\n    const store = transaction.objectStore('users');\n    const request = store.get(id);\n    \n    request.onsuccess = function(event) {\n      const user = event.target.result;\n      console.log('User:', user);\n    };\n  }\n  \n  // Example usage\n  addUser({ id: 1, name: 'John Doe', email: 'john@example.com' });\n  getUser(1);\n};\n\n// 5. Cache API (part of Service Workers)\n// This is typically used with Service Workers for offline capabilities\n// Opening a cache\ncaches.open('my-cache-v1').then(cache => {\n  // Adding resources to the cache\n  cache.addAll([\n    '/',\n    '/styles.css',\n    '/script.js',\n    '/images/logo.png'\n  ]);\n  \n  // Or add individual resources\n  cache.put('/api/data', new Response(JSON.stringify({ key: 'value' })));\n});\n\n// Retrieving from cache\ncaches.match('/api/data').then(response => {\n  if (response) {\n    return response.json();\n  }\n});",
    quiz: {
      question: "Which browser storage mechanism is automatically cleared when the browser session ends?",
      options: ["localStorage", "sessionStorage", "IndexedDB", "Cache API"],
      answer: "sessionStorage"
    }
  },
  {
    id: 23,
    day: 23,
    title: "JavaScript Testing",
    summary: "Learn to write tests for your JavaScript code to ensure reliability and quality.",
    details: "Testing is a crucial part of software development that helps ensure your code works as expected and remains maintainable. JavaScript has a rich ecosystem of testing tools and frameworks that make it easier to write and run tests for your code.",
    codeExample: "// Function to test\nfunction sum(a, b) {\n  return a + b;\n}\n\nfunction fetchUser(id) {\n  return fetch(`https://api.example.com/users/${id}`)\n    .then(response => {\n      if (!response.ok) {\n        throw new Error('User not found');\n      }\n      return response.json();\n    });\n}\n\n// 1. Jest - Popular testing framework\n// In a test file (sum.test.js)\n\n// Test suite\ndescribe('Math functions', () => {\n  // Test case\n  test('sum adds two numbers correctly', () => {\n    // Assertion\n    expect(sum(2, 3)).toBe(5);\n    expect(sum(-1, 1)).toBe(0);\n    expect(sum(0, 0)).toBe(0);\n  });\n});\n\n// Testing asynchronous code\ndescribe('User API', () => {\n  // Using promises\n  test('fetchUser returns user data', () => {\n    // Mock the fetch function\n    global.fetch = jest.fn(() =>\n      Promise.resolve({\n        ok: true,\n        json: () => Promise.resolve({ id: 1, name: 'John' })\n      })\n    );\n    \n    return fetchUser(1).then(user => {\n      expect(user.id).toBe(1);\n      expect(user.name).toBe('John');\n    });\n  });\n  \n  // Using async/await\n  test('fetchUser throws error for invalid user', async () => {\n    // Mock the fetch function to return an error\n    global.fetch = jest.fn(() =>\n      Promise.resolve({\n        ok: false\n      })\n    );\n    \n    // Assert that the function throws\n    await expect(fetchUser(999)).rejects.toThrow('User not found');\n  });\n});\n\n// 2. Mocha with Chai - Another popular combination\n// In a test file (sum.test.js)\n\n// const { expect } = require('chai');\n// const { sum, fetchUser } = require('./functions');\n\n// describe('Math functions', function() {\n//   it('should add two numbers correctly', function() {\n//     expect(sum(2, 3)).to.equal(5);\n//     expect(sum(-1, 1)).to.equal(0);\n//     expect(sum(0, 0)).to.equal(0);\n//   });\n// });\n\n// 3. Testing DOM manipulation\ndescribe('DOM manipulation', () => {\n  beforeEach(() => {\n    // Set up the DOM\n    document.body.innerHTML = `\n      <div>\n        <button id=\"myButton\">Click me</button>\n        <p id=\"output\"></p>\n      </div>\n    `;\n    \n    // Add event listener\n    document.getElementById('myButton').addEventListener('click', () => {\n      document.getElementById('output').textContent = 'Button clicked!';\n    });\n  });\n  \n  test('clicking the button updates the output', () => {\n    // Simulate a click\n    document.getElementById('myButton').click();\n    \n    // Check if the output was updated\n    expect(document.getElementById('output').textContent).toBe('Button clicked!');\n  });\n});\n\n// 4. Snapshot testing\ndescribe('Component rendering', () => {\n  test('renders correctly', () => {\n    const element = document.createElement('div');\n    element.innerHTML = `\n      <h1>Hello, World!</h1>\n      <p>This is a test component.</p>\n    `;\n    \n    // Compare with a stored snapshot\n    expect(element.innerHTML).toMatchSnapshot();\n  });\n});\n\n// 5. Code coverage\n// Jest can generate code coverage reports with:\n// jest --coverage\n// This shows which parts of your code are covered by tests",
    quiz: {
      question: "What is the purpose of snapshot testing in JavaScript?",
      options: [
        "To measure code performance",
        "To capture and compare the output of a component over time",
        "To test database interactions",
        "To simulate user interactions"
      ],
      answer: "To capture and compare the output of a component over time"
    }
  },
  {
    id: 24,
    day: 24,
    title: "Web APIs",
    summary: "Explore powerful browser APIs that extend JavaScript's capabilities.",
    details: "Web APIs (Application Programming Interfaces) are interfaces provided by browsers that allow JavaScript to interact with various aspects of the browser and device. These APIs extend JavaScript's capabilities beyond core language features, enabling developers to create more interactive and feature-rich web applications.",
    codeExample: "// 1. Geolocation API\nif ('geolocation' in navigator) {\n  navigator.geolocation.getCurrentPosition(\n    // Success callback\n    position => {\n      const latitude = position.coords.latitude;\n      const longitude = position.coords.longitude;\n      console.log(`Location: ${latitude}, ${longitude}`);\n    },\n    // Error callback\n    error => {\n      console.error('Error getting location:', error.message);\n    },\n    // Options\n    {\n      enableHighAccuracy: true,\n      timeout: 5000,\n      maximumAge: 0\n    }\n  );\n}\n\n// 2. Web Storage API (localStorage and sessionStorage)\n// Covered in Day 22\n\n// 3. Fetch API\n// Covered in Day 16\n\n// 4. Canvas API\nconst canvas = document.getElementById('myCanvas');\nconst ctx = canvas.getContext('2d');\n\n// Drawing a rectangle\nctx.fillStyle = 'blue';\nctx.fillRect(10, 10, 100, 50);\n\n// Drawing a circle\nctx.beginPath();\nctx.arc(200, 50, 40, 0, 2 * Math.PI);\nctx.fillStyle = 'red';\nctx.fill();\nctx.stroke();\n\n// Drawing text\nctx.font = '24px Arial';\nctx.fillStyle = 'black';\nctx.fillText('Hello Canvas', 150, 150);\n\n// 5. Web Audio API\nconst audioContext = new (window.AudioContext || window.webkitAudioContext)();\n\n// Create an oscillator (sound source)\nconst oscillator = audioContext.createOscillator();\noscillator.type = 'sine'; // sine, square, sawtooth, triangle\noscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note\n\n// Create a gain node (volume control)\nconst gainNode = audioContext.createGain();\ngainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // 50% volume\n\n// Connect nodes: oscillator -> gain -> output\noscillator.connect(gainNode);\ngainNode.connect(audioContext.destination);\n\n// Play sound for 1 second\noscillator.start();\noscillator.stop(audioContext.currentTime + 1);\n\n// 6. Intersection Observer API\nconst observer = new IntersectionObserver(entries => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      console.log('Element is visible in the viewport');\n      entry.target.classList.add('visible');\n    } else {\n      console.log('Element is not visible in the viewport');\n      entry.target.classList.remove('visible');\n    }\n  });\n}, {\n  root: null, // viewport\n  rootMargin: '0px',\n  threshold: 0.5 // 50% of the element must be visible\n});\n\n// Observe an element\nconst element = document.getElementById('myElement');\nobserver.observe(element);\n\n// 7. Web Speech API\nconst speechSynthesis = window.speechSynthesis;\n\n// Text-to-speech\nfunction speak(text) {\n  const utterance = new SpeechSynthesisUtterance(text);\n  utterance.lang = 'en-US';\n  utterance.volume = 1; // 0 to 1\n  utterance.rate = 1; // 0.1 to 10\n  utterance.pitch = 1; // 0 to 2\n  speechSynthesis.speak(utterance);\n}\n\nspeak('Hello, this is the Web Speech API');\n\n// Speech recognition\nif ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {\n  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;\n  const recognition = new SpeechRecognition();\n  \n  recognition.lang = 'en-US';\n  recognition.continuous = false;\n  \n  recognition.onresult = event => {\n    const transcript = event.results[0][0].transcript;\n    console.log('You said:', transcript);\n  };\n  \n  recognition.onerror = event => {\n    console.error('Speech recognition error:', event.error);\n  };\n  \n  // Start listening\n  // recognition.start();\n}\n\n// 8. Notification API\nif ('Notification' in window) {\n  Notification.requestPermission().then(permission => {\n    if (permission === 'granted') {\n      const notification = new Notification('Hello!', {\n        body: 'This is a browser notification',\n        icon: 'icon.png'\n      });\n      \n      notification.onclick = () => {\n        console.log('Notification clicked');\n        window.focus();\n      };\n    }\n  });\n}",
    quiz: {
      question: "Which Web API would you use to detect when an element becomes visible in the viewport?",
      options: [
        "Geolocation API",
        "Intersection Observer API",
        "Web Audio API",
        "Notification API"
      ],
      answer: "Intersection Observer API"
    }
  },
  {
    id: 25,
    day: 25,
    title: "JavaScript Security",
    summary: "Learn about common security vulnerabilities and how to protect your JavaScript applications.",
    details: "JavaScript security is crucial for protecting web applications from various attacks. Understanding common vulnerabilities and implementing security best practices helps you build more secure applications that protect user data and prevent malicious activities.",
    codeExample: "// 1. Cross-Site Scripting (XSS) Prevention\n// Bad - vulnerable to XSS\nfunction displayUserInput(input) {\n  document.getElementById('output').innerHTML = input;\n}\n\n// Good - escape HTML to prevent XSS\nfunction escapeHTML(str) {\n  return str\n    .replace(/&/g, '&amp;')\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;')\n    .replace(/\"/g, '&quot;')\n    .replace(/'/g, '&#039;');\n}\n\nfunction displayUserInputSafely(input) {\n  document.getElementById('output').textContent = input; // Safer than innerHTML\n  // Or\n  document.getElementById('output').innerHTML = escapeHTML(input);\n}\n\n// 2. Content Security Policy (CSP)\n// Set in HTTP header or meta tag\n// <meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'; script-src 'self' https://trusted-cdn.com\">\n\n// 3. Cross-Site Request Forgery (CSRF) Protection\n// Include CSRF token in forms\nfunction addCSRFToken(form) {\n  const token = getCsrfToken(); // Get from server or cookie\n  const tokenInput = document.createElement('input');\n  tokenInput.type = 'hidden';\n  tokenInput.name = 'csrf_token';\n  tokenInput.value = token;\n  form.appendChild(tokenInput);\n}\n\n// Verify token on form submission\ndocument.getElementById('myForm').addEventListener('submit', function(event) {\n  const tokenInput = this.querySelector('input[name=\"csrf_token\"]');\n  if (!tokenInput || !validateCSRFToken(tokenInput.value)) {\n    event.preventDefault();\n    alert('Security validation failed');\n  }\n});\n\n// 4. Secure Cookies\n// Set in HTTP response header\n// Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict\n\n// 5. Input Validation\nfunction validateEmail(email) {\n  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return regex.test(email);\n}\n\nfunction validateForm() {\n  const email = document.getElementById('email').value;\n  const password = document.getElementById('password').value;\n  \n  if (!validateEmail(email)) {\n    showError('Please enter a valid email address');\n    return false;\n  }\n  \n  if (password.length < 8) {\n    showError('Password must be at least 8 characters long');\n    return false;\n  }\n  \n  return true;\n}\n\n// 6. Avoid eval() and new Function()\n// Bad - security risk\nfunction calculateBad(expression) {\n  return eval(expression); // Can execute arbitrary code\n}\n\n// Better - use a safer alternative\nfunction calculateGood(expression) {\n  // Use a math library or a safer evaluation method\n  return Function('return ' + expression)();\n}\n\n// Even better - use a dedicated math parser library\n\n// 7. Sanitize URLs\nfunction sanitizeURL(url) {\n  // Only allow http and https protocols\n  if (!/^https?:\\/\\//i.test(url)) {\n    return '#'; // Invalid URL\n  }\n  \n  // Prevent javascript: URLs\n  if (/^javascript:/i.test(url)) {\n    return '#';\n  }\n  \n  return url;\n}\n\nfunction setLinkSafely(link, url) {\n  link.href = sanitizeURL(url);\n}\n\n// 8. Use HTTPS\n// Redirect HTTP to HTTPS\nif (location.protocol === 'http:' && location.hostname !== 'localhost') {\n  location.href = location.href.replace('http:', 'https:');\n}\n\n// 9. Secure localStorage/sessionStorage\n// Encrypt sensitive data before storing\nfunction secureStore(key, data) {\n  const encryptedData = encrypt(JSON.stringify(data)); // Use a encryption library\n  localStorage.setItem(key, encryptedData);\n}\n\nfunction secureRetrieve(key) {\n  const encryptedData = localStorage.getItem(key);\n  if (!encryptedData) return null;\n  \n  try {\n    const decryptedData = decrypt(encryptedData); // Use a decryption library\n    return JSON.parse(decryptedData);\n  } catch (error) {\n    console.error('Error retrieving data:', error);\n    return null;\n  }\n}",
    quiz: {
      question: "Which of the following is the best way to prevent Cross-Site Scripting (XSS) attacks?",
      options: [
        "Using eval() to validate user input",
        "Using innerHTML with unsanitized user input",
        "Using textContent instead of innerHTML for user-generated content",
        "Storing sensitive data in localStorage"
      ],
      answer: "Using textContent instead of innerHTML for user-generated content"
    }
  },
  {
    id: 26,
    day: 26,
    title: "JavaScript Frameworks",
    summary: "Get an overview of popular JavaScript frameworks and their use cases.",
    details: "JavaScript frameworks are pre-written JavaScript libraries that provide a structure and foundation for building web applications. They offer tools, components, and patterns that make development faster and more organized. Different frameworks have different philosophies and are suited for different types of projects.",
    codeExample: "// 1. React - Component-based UI library\n// Component example\nclass Welcome extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { count: 0 };\n  }\n  \n  incrementCount = () => {\n    this.setState({ count: this.state.count + 1 });\n  }\n  \n  render() {\n    return (\n      <div>\n        <h1>Hello, {this.props.name}</h1>\n        <p>Count: {this.state.count}</p>\n        <button onClick={this.incrementCount}>Increment</button>\n      </div>\n    );\n  }\n}\n\n// Functional component with hooks\nfunction Counter() {\n  const [count, setCount] = React.useState(0);\n  \n  React.useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}\n\n// 2. Vue.js - Progressive JavaScript framework\n// Vue component\n/*\nnew Vue({\n  el: '#app',\n  data: {\n    message: 'Hello Vue!',\n    count: 0\n  },\n  methods: {\n    incrementCount() {\n      this.count++;\n    }\n  },\n  computed: {\n    doubleCount() {\n      return this.count * 2;\n    }\n  }\n});\n*/\n\n// Vue 3 Composition API\n/*\nconst { createApp, ref, computed, onMounted } = Vue;\n\nconst app = createApp({\n  setup() {\n    const count = ref(0);\n    const doubleCount = computed(() => count.value * 2);\n    \n    function increment() {\n      count.value++;\n    }\n    \n    onMounted(() => {\n      console.log('Component mounted');\n    });\n    \n    return {\n      count,\n      doubleCount,\n      increment\n    };\n  }\n});\n\napp.mount('#app');\n*/\n\n// 3. Angular - Full-featured framework\n// Angular component\n/*\n@Component({\n  selector: 'app-counter',\n  template: `\n    <div>\n      <h2>{{ title }}</h2>\n      <p>Count: {{ count }}</p>\n      <button (click)=\"increment()\">Increment</button>\n    </div>\n  `\n})\nexport class CounterComponent implements OnInit {\n  title = 'Counter App';\n  count = 0;\n  \n  constructor(private service: CounterService) {}\n  \n  ngOnInit() {\n    console.log('Component initialized');\n  }\n  \n  increment() {\n    this.count++;\n    this.service.logCount(this.count);\n  }\n}\n*/\n\n// 4. Svelte - Compiler-based framework\n// Svelte component\n/*\n<script>\n  let count = 0;\n  \n  function increment() {\n    count += 1;\n  }\n  \n  $: doubleCount = count * 2;\n</script>\n\n<h1>Counter</h1>\n<p>Count: {count}</p>\n<p>Double: {doubleCount}</p>\n<button on:click={increment}>Increment</button>\n*/\n\n// 5. Express.js - Node.js web application framework\n// Server setup\n/*\nconst express = require('express');\nconst app = express();\nconst port = 3000;\n\napp.use(express.json());\n\n// Middleware\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next();\n});\n\n// Routes\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.get('/api/users', (req, res) => {\n  res.json([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]);\n});\n\napp.post('/api/users', (req, res) => {\n  const { name } = req.body;\n  // Create user logic\n  res.status(201).json({ id: 3, name });\n});\n\napp.listen(port, () => {\n  console.log(`Server running at http://localhost:${port}`);\n});\n*/",
    quiz: {
      question: "Which JavaScript framework uses a virtual DOM to optimize rendering performance?",
      options: ["Angular", "Express.js", "React", "jQuery"],
      answer: "React"
    }
  },
  {
    id: 27,
    day: 27,
    title: "JavaScript Build Tools",
    summary: "Explore tools for bundling, transpiling, and optimizing JavaScript code.",
    details: "JavaScript build tools help automate tasks like bundling modules, transpiling modern JavaScript to older versions, optimizing code, and more. These tools are essential for modern JavaScript development, making it easier to create efficient, cross-browser compatible applications.",
    codeExample: "// 1. Webpack - Module bundler\n// webpack.config.js\n/*\nconst path = require('path');\nconst HtmlWebpackPlugin = require('html-webpack-plugin');\n\nmodule.exports = {\n  entry: './src/index.js',\n  output: {\n    path: path.resolve(__dirname, 'dist'),\n    filename: 'bundle.[contenthash].js'\n  },\n  module: {\n    rules: [\n      {\n        test: /\\.js$/,\n        exclude: /node_modules/,\n        use: {\n          loader: 'babel-loader',\n          options: {\n            presets: ['@babel/preset-env']\n          }\n        }\n      },\n      {\n        test: /\\.css$/,\n        use: ['style-loader', 'css-loader']\n      },\n      {\n        test: /\\.(png|svg|jpg|gif)$/,\n        use: ['file-loader']\n      }\n    ]\n  },\n  plugins: [\n    new HtmlWebpackPlugin({\n      template: './src/index.html'\n    })\n  ],\n  devServer: {\n    contentBase: './dist',\n    port: 3000\n  }\n};\n*/\n\n// 2. Babel - JavaScript compiler\n// babel.config.js\n/*\nmodule.exports = {\n  presets: [\n    ['@babel/preset-env', {\n      targets: {\n        browsers: ['> 1%', 'last 2 versions', 'not dead']\n      },\n      useBuiltIns: 'usage',\n      corejs: 3\n    }],\n    '@babel/preset-react'\n  ],\n  plugins: [\n    '@babel/plugin-proposal-class-properties',\n    '@babel/plugin-transform-runtime'\n  ]\n};\n*/\n\n// Example of code that needs transpiling\nconst arrowFunction = () => {\n  const [a, b, ...rest] = [1, 2, 3, 4, 5];\n  return { a, b, rest };\n};\n\nclass Example {\n  #privateField = 42;\n  \n  static staticMethod() {\n    return 'Static method';\n  }\n  \n  async fetchData() {\n    const response = await fetch('https://api.example.com/data');\n    return response.json();\n  }\n}\n\n// 3. ESLint - Linting utility\n// .eslintrc.js\n/*\nmodule.exports = {\n  env: {\n    browser: true,\n    es2021: true,\n    node: true\n  },\n  extends: [\n    'eslint:recommended',\n    'plugin:react/recommended'\n  ],\n  parserOptions: {\n    ecmaFeatures: {\n      jsx: true\n    },\n    ecmaVersion: 12,\n    sourceType: 'module'\n  },\n  plugins: [\n    'react'\n  ],\n  rules: {\n    'indent': ['error', 2],\n    'linebreak-style': ['error', 'unix'],\n    'quotes': ['error', 'single'],\n    'semi': ['error', 'always'],\n    'no-unused-vars': 'warn',\n    'react/prop-types': 'off'\n  }\n};\n*/\n\n// 4. Prettier - Code formatter\n// .prettierrc\n/*\n{\n  \"printWidth\": 80,\n  \"tabWidth\": 2,\n  \"useTabs\": false,\n  \"semi\": true,\n  \"singleQuote\": true,\n  \"trailingComma\": \"es5\",\n  \"bracketSpacing\": true,\n  \"jsxBracketSameLine\": false,\n  \"arrowParens\": \"avoid\"\n}\n*/\n\n// 5. npm scripts - Task runner\n// package.json\n/*\n{\n  \"name\": \"my-app\",\n  \"version\": \"1.0.0\",\n  \"scripts\": {\n    \"start\": \"webpack serve --mode development\",\n    \"build\": \"webpack --mode production\",\n    \"test\": \"jest\",\n    \"lint\": \"eslint src/**/*.js\",\n    \"format\": \"prettier --write 'src/**/*.{js,jsx,css,html}'\"\n  },\n  \"dependencies\": { ... },\n  \"devDependencies\": { ... }\n}\n*/\n\n// 6. Rollup - Module bundler (alternative to Webpack)\n// rollup.config.js\n/*\nimport resolve from '@rollup/plugin-node-resolve';\nimport commonjs from '@rollup/plugin-commonjs';\nimport babel from '@rollup/plugin-babel';\nimport { terser } from 'rollup-plugin-terser';\n\nexport default {\n  input: 'src/main.js',\n  output: {\n    file: 'dist/bundle.js',\n    format: 'iife',\n    sourcemap: true\n  },\n  plugins: [\n    resolve(),\n    commonjs(),\n    babel({\n      babelHelpers: 'bundled',\n      exclude: 'node_modules/**'\n    }),\n    terser()\n  ]\n};\n*/\n\n// 7. Parcel - Zero configuration bundler\n// Just point Parcel to your entry file:\n// npx parcel index.html\n\n// 8. Vite - Next generation frontend tooling\n// vite.config.js\n/*\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 3000\n  },\n  build: {\n    outDir: 'dist',\n    minify: 'terser'\n  }\n});\n*/",
    quiz: {
      question: "Which tool is primarily used to transpile modern JavaScript features to older versions for better browser compatibility?",
      options: ["Webpack", "Babel", "ESLint", "Prettier"],
      answer: "Babel"
    }
  },
  {
    id: 28,
    day: 28,
    title: "JavaScript Best Practices",
    summary: "Learn coding standards and best practices for writing clean, maintainable JavaScript.",
    details: "JavaScript best practices are guidelines and patterns that help you write clean, efficient, and maintainable code. Following these practices can help you avoid common pitfalls, improve code quality, and make your codebase more understandable for yourself and other developers.",
    codeExample: "// 1. Use strict mode\n'use strict';\n\n// 2. Use meaningful variable and function names\n// Bad\nconst x = 5;\nfunction fn(a, b) {\n  return a + b;\n}\n\n// Good\nconst userAge = 5;\nfunction calculateTotal(price, quantity) {\n  return price * quantity;\n}\n\n// 3. Use const and let, avoid var\n// Bad\nvar count = 1;\nvar message = 'Hello';\n\n// Good\nconst PI = 3.14159; // For values that won't change\nlet score = 0;      // For values that will change\n\n// 4. Use template literals for string concatenation\n// Bad\nconst greeting = 'Hello, ' + name + '! You are ' + age + ' years old.';\n\n// Good\nconst betterGreeting = `Hello, ${name}! You are ${age} years old.`;\n\n// 5. Use arrow functions for short callbacks\n// Bad\n[1, 2, 3].map(function(number) {\n  return number * 2;\n});\n\n// Good\n[1, 2, 3].map(number => number * 2);\n\n// 6. Use destructuring\n// Bad\nconst user = { name: 'John', age: 30 };\nconst userName = user.name;\nconst userAge = user.age;\n\n// Good\nconst { name, age } = user;\n\n// 7. Use parameter defaults\n// Bad\nfunction greet(name) {\n  name = name || 'Guest';\n  return `Hello, ${name}`;\n}\n\n// Good\nfunction betterGreet(name = 'Guest') {\n  return `Hello, ${name}`;\n}\n\n// 8. Use spread operator for array/object manipulation\n// Bad\nconst arr1 = [1, 2, 3];\nconst arr2 = [4, 5, 6];\nconst combined = arr1.concat(arr2);\n\n// Good\nconst betterCombined = [...arr1, ...arr2];\n\n// 9. Use early returns\n// Bad\nfunction processUser(user) {\n  if (user) {\n    if (user.isActive) {\n      // Process user\n      return true;\n    } else {\n      return false;\n    }\n  } else {\n    return false;\n  }\n}\n\n// Good\nfunction betterProcessUser(user) {\n  if (!user || !user.isActive) {\n    return false;\n  }\n  \n  // Process user\n  return true;\n}\n\n// 10. Use object method shorthand\n// Bad\nconst calculator = {\n  add: function(a, b) {\n    return a + b;\n  },\n  subtract: function(a, b) {\n    return a - b;\n  }\n};\n\n// Good\nconst betterCalculator = {\n  add(a, b) {\n    return a + b;\n  },\n  subtract(a, b) {\n    return a - b;\n  }\n};\n\n// 11. Use modules to organize code\n// math.js\n// export function add(a, b) {\n//   return a + b;\n// }\n\n// export function subtract(a, b) {\n//   return a - b;\n// }\n\n// main.js\n// import { add, subtract } from './math.js';\n\n// 12. Use async/await for asynchronous code\n// Bad\nfunction fetchData() {\n  return fetch('https://api.example.com/data')\n    .then(response => response.json())\n    .then(data => {\n      console.log(data);\n      return data;\n    })\n    .catch(error => {\n      console.error('Error:', error);\n    });\n}\n\n// Good\nasync function betterFetchData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    console.log(data);\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n\n// 13. Use === instead of ==\n// Bad\nif (x == '5') {\n  // This will be true for x = 5 or x = '5'\n}\n\n// Good\nif (x === '5') {\n  // This will only be true for x = '5'\n}\n\n// 14. Use meaningful comments, but prefer self-documenting code\n// Bad - unnecessary comment\n// Increment count by 1\ncount += 1;\n\n// Good - explains why, not what\n// Increment retry count to handle potential race condition\nretryCount += 1;\n\n// 15. Use consistent formatting (with tools like Prettier)\n// Bad - inconsistent formatting\nfunction   badFormat( x,y ){\n  return x+y\n}\n\n// Good - consistent formatting\nfunction goodFormat(x, y) {\n  return x + y;\n}\n\n// 16. Avoid global variables\n// Bad\nlet globalCounter = 0;\n\nfunction incrementCounter() {\n  globalCounter++;\n}\n\n// Good\nfunction createCounter() {\n  let count = 0;\n  \n  return {\n    increment() {\n      count++;\n    },\n    getCount() {\n      return count;\n    }\n  };\n}\n\nconst counter = createCounter();\n\n// 17. Handle errors properly\n// Bad\nfetch('https://api.example.com/data')\n  .then(response => response.json())\n  .then(data => console.log(data));\n\n// Good\nfetch('https://api.example.com/data')\n  .then(response => {\n    if (!response.ok) {\n      throw new Error(`HTTP error! Status: ${response.status}`);\n    }\n    return response.json();\n  })\n  .then(data => console.log(data))\n  .catch(error => console.error('Error fetching data:', error));",
    quiz: {
      question: "Which of the following is considered a JavaScript best practice?",
      options: [
        "Using var for all variable declarations",
        "Using == instead of === for comparisons",
        "Using meaningful variable names",
        "Avoiding comments in code"
      ],
      answer: "Using meaningful variable names"
    }
  },
  {
    id: 29,
    day: 29,
    title: "JavaScript Debugging",
    summary: "Master techniques for finding and fixing bugs in your JavaScript code.",
    details: "Debugging is the process of finding and fixing bugs in your code. JavaScript provides various tools and techniques for debugging, from simple console logging to advanced browser developer tools. Effective debugging skills are essential for every JavaScript developer.",
    codeExample: "// 1. Console methods\n// Basic logging\nconsole.log('Hello, world!');\n\n// Different log levels\nconsole.info('Informational message');\nconsole.warn('Warning message');\nconsole.error('Error message');\n\n// Logging objects\nconst user = { name: 'John', age: 30 };\nconsole.log(user);\n\n// Pretty-printing objects\nconsole.log(JSON.stringify(user, null, 2));\n\n// Logging with styling\nconsole.log('%cStyled text', 'color: blue; font-size: 20px');\n\n// Grouping logs\nconsole.group('User Details');\nconsole.log('Name:', user.name);\nconsole.log('Age:', user.age);\nconsole.groupEnd();\n\n// Counting\nfor (let i = 0; i < 3; i++) {\n  console.count('Loop iteration');\n}\n\n// Timing\nconsole.time('Operation');\n// Some operation\nfor (let i = 0; i < 1000000; i++) {\n  // Simulate work\n}\nconsole.timeEnd('Operation');\n\n// Table format\nconst users = [\n  { name: 'John', age: 30 },\n  { name: 'Jane', age: 25 }\n];\nconsole.table(users);\n\n// 2. Debugger statement\nfunction complexFunction(a, b) {\n  let result = a * b;\n  debugger; // Execution will pause here when DevTools is open\n  result = result + a;\n  return result;\n}\n\n// 3. Try-catch for runtime errors\ntry {\n  // Code that might throw an error\n  const result = riskyFunction();\n  console.log(result);\n} catch (error) {\n  console.error('An error occurred:', error.message);\n  console.error('Stack trace:', error.stack);\n}\n\n// 4. Error handling in async code\nasync function fetchData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    if (!response.ok) {\n      throw new Error(`HTTP error! Status: ${response.status}`);\n    }\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Fetch error:', error);\n    // Handle error appropriately\n    throw error; // Re-throw if needed\n  }\n}\n\n// 5. Custom error types\nclass ValidationError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = 'ValidationError';\n  }\n}\n\nfunction validateUser(user) {\n  if (!user.name) {\n    throw new ValidationError('Name is required');\n  }\n  if (user.age < 18) {\n    throw new ValidationError('User must be at least 18 years old');\n  }\n}\n\ntry {\n  validateUser({ name: 'John', age: 16 });\n} catch (error) {\n  if (error instanceof ValidationError) {\n    console.error('Validation failed:', error.message);\n  } else {\n    console.error('Unknown error:', error);\n  }\n}\n\n// 6. Source maps for debugging minified code\n// In webpack.config.js or similar:\n// devtool: 'source-map'\n\n// 7. Browser DevTools features\n// - Setting breakpoints\n// - Step through code (over, into, out)\n// - Watch expressions\n// - Call stack inspection\n// - Network request monitoring\n// - Performance profiling\n\n// 8. Performance debugging\n// Measure performance\nperformance.mark('start');\n// Code to measure\nfor (let i = 0; i < 1000; i++) {\n  // Some operation\n}\nperformance.mark('end');\nperformance.measure('Operation', 'start', 'end');\nconsole.log(performance.getEntriesByName('Operation'));\n\n// 9. Memory leak debugging\n// Common causes of memory leaks:\n// - Forgotten event listeners\n// - Closures holding references\n// - Global variables\n\n// Example of fixing an event listener leak\nconst button = document.getElementById('myButton');\nconst handler = () => console.log('Clicked');\n\n// Adding listener\nbutton.addEventListener('click', handler);\n\n// Later, when no longer needed:\nbutton.removeEventListener('click', handler);\n\n// 10. Debugging tools and extensions\n// - React DevTools\n// - Redux DevTools\n// - Vue DevTools\n// - Chrome Lighthouse\n// - Chrome Debugger for VS Code",
    quiz: {
      question: "What does the 'debugger' statement do in JavaScript?",
      options: [
        "It automatically fixes bugs in your code",
        "It logs all variables to the console",
        "It pauses execution at that line when developer tools are open",
        "It prevents errors from occurring"
      ],
      answer: "It pauses execution at that line when developer tools are open"
    }
  },
  {
    id: 30,
    day: 30,
    title: "JavaScript Ecosystem & Future",
    summary: "Explore the JavaScript ecosystem and upcoming features in the language.",
    details: "The JavaScript ecosystem is vast and constantly evolving, with new tools, libraries, frameworks, and language features being developed regularly. Understanding the ecosystem and staying informed about upcoming features helps you make better decisions and prepare for the future of JavaScript development.",
    codeExample: "// 1. Current JavaScript Ecosystem\n\n// Frontend frameworks\n// - React\n// - Vue.js\n// - Angular\n// - Svelte\n\n// State management\n// - Redux\n// - Vuex\n// - MobX\n// - Recoil\n// - Zustand\n\n// Backend JavaScript\n// - Node.js\n// - Express\n// - Nest.js\n// - Fastify\n\n// Build tools\n// - Webpack\n// - Rollup\n// - Parcel\n// - Vite\n// - esbuild\n\n// Testing\n// - Jest\n// - Mocha\n// - Cypress\n// - Playwright\n// - Testing Library\n\n// TypeScript - Typed JavaScript\n// interface User {\n//   id: number;\n//   name: string;\n//   email: string;\n// }\n\n// function getUser(id: number): Promise<User> {\n//   return fetch(`/api/users/${id}`).then(res => res.json());\n// }\n\n// 2. Recent JavaScript Features (ES2022)\n\n// Top-level await\n// Previously only allowed inside async functions\n// Now allowed at the module level\n\n// const response = await fetch('https://api.example.com/data');\n// const data = await response.json();\n// export { data };\n\n// Class fields\nclass Counter {\n  // Public field\n  count = 0;\n  \n  // Private field\n  #privateValue = 42;\n  \n  // Static field\n  static instances = 0;\n  \n  constructor() {\n    Counter.instances++;\n  }\n  \n  increment() {\n    this.count++;\n    return this.count;\n  }\n  \n  getPrivateValue() {\n    return this.#privateValue;\n  }\n}\n\n// Error cause\ntry {\n  // Some operation\n} catch (error) {\n  throw new Error('Data processing failed', { cause: error });\n}\n\n// 3. Upcoming JavaScript Features\n\n// Pipeline operator (proposal)\n// Instead of:\nconst result = g(f(x));\n\n// You could write:\n// const result = x |> f |> g;\n\n// Pattern matching (proposal)\n// switch (value) {\n//   case { type: 'A', value: 42 }:\n//     console.log('Matched A with 42');\n//     break;\n//   case { type: 'B', value }:\n//     console.log('Matched B with value:', value);\n//     break;\n//   default:\n//     console.log('No match');\n// }\n\n// Decorators (proposal)\n// @logged\n// class Example {\n//   @nonenumerable\n//   @readonly\n//   method() {\n//     // ...\n//   }\n// }\n\n// Record and Tuple (proposal)\n// Immutable data structures\n// const point = #{ x: 1, y: 2 }; // Record\n// const coordinates = #[1, 2, 3]; // Tuple\n\n// 4. Web Platform Features\n\n// Web Components\nclass MyComponent extends HTMLElement {\n  constructor() {\n    super();\n    const shadow = this.attachShadow({ mode: 'open' });\n    \n    const wrapper = document.createElement('div');\n    wrapper.textContent = 'Hello from Web Component';\n    \n    shadow.appendChild(wrapper);\n  }\n}\n\n// customElements.define('my-component', MyComponent);\n\n// Progressive Web Apps (PWA)\n// Service Worker example\n// self.addEventListener('install', event => {\n//   event.waitUntil(\n//     caches.open('v1').then(cache => {\n//       return cache.addAll([\n//         '/',\n//         '/index.html',\n//         '/styles.css',\n//         '/script.js'\n//       ]);\n//     })\n//   );\n// });\n\n// self.addEventListener('fetch', event => {\n//   event.respondWith(\n//     caches.match(event.request).then(response => {\n//       return response || fetch(event.request);\n//     })\n//   );\n// });\n\n// WebAssembly (Wasm)\n// Allows running code written in languages like C, C++, Rust at near-native speed\n// Example of loading and using a Wasm module:\n\n// WebAssembly.instantiateStreaming(fetch('module.wasm'))\n//   .then(obj => {\n//     const result = obj.instance.exports.add(5, 3);\n//     console.log(result); // 8\n//   });\n\n// 5. JavaScript Development Trends\n\n// JAMstack (JavaScript, APIs, Markup)\n// - Static site generators (Next.js, Gatsby, Nuxt.js)\n// - Headless CMS\n// - Serverless functions\n\n// Micro-frontends\n// Breaking down large applications into smaller, more manageable pieces\n\n// Server Components\n// React Server Components, Astro, etc.\n\n// Edge Computing\n// Running JavaScript closer to users with services like Cloudflare Workers\n\n// AI-assisted development\n// GitHub Copilot, TabNine, etc.",
    quiz: {
      question: "Which of the following is a recent addition to JavaScript class syntax?",
      options: [
        "Automatic garbage collection",
        "Private fields (using # prefix)",
        "Multiple inheritance",
        "Operator overloading"
      ],
      answer: "Private fields (using # prefix)"
    }
  }
];

// Function to shuffle array (for randomized lessons)
export function shuffleLessons() {
  const shuffled = [...lessons];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default lessons;