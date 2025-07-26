#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Template for a new card
const cardTemplate = {
  "id": "new-card-id",
  "title": "New Card Title",
  "day": 1,
  "category": "Fundamentals",
  "difficulty": "beginner",
  "estimatedTime": "3 min",
  "description": "Brief description of what this card teaches.",
  "content": "Detailed explanation of the concept. This should be educational and engaging, providing clear explanations with practical examples.",
  "codeExample": "// Add your code example here\nconsole.log('Hello, World!');",
  "keyPoints": [
    "Key learning point 1",
    "Key learning point 2",
    "Key learning point 3"
  ],
  "quiz": {
    "question": "What does this concept demonstrate?",
    "options": [
      "Option 1",
      "Option 2", 
      "Option 3",
      "Option 4"
    ],
    "correctAnswer": 0,
    "explanation": "Explanation of why the correct answer is right and what it teaches."
  },
  "tags": ["tag1", "tag2", "concept"],
  "isCompleted": false,
  "isBookmarked": false
};

function showUsage() {
  console.log(`
📚 Card Template Generator

Usage: node scripts/add-card-template.js [category]

Available categories:
  - fundamentals
  - data-structures  
  - control-flow
  - web-development
  - asynchronous
  - advanced-concepts

Example:
  node scripts/add-card-template.js fundamentals

This will:
1. Show you the card template
2. Guide you through adding it to the correct file
3. Validate the structure
`);
}

function getCardFilePath(category) {
  const categoryMap = {
    'fundamentals': './data/learn/cards/fundamentals.json',
    'data-structures': './data/learn/cards/data-structures.json',
    'control-flow': './data/learn/cards/control-flow.json',
    'web-development': './data/learn/cards/web-development.json',
    'asynchronous': './data/learn/cards/asynchronous.json',
    'advanced-concepts': './data/learn/cards/advanced-concepts.json'
  };
  
  return categoryMap[category];
}

function addCardToFile(filePath, newCard) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.cards.push(newCard);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Card added to ${filePath}`);
    console.log(`📊 File now has ${data.cards.length} cards`);
    
  } catch (error) {
    console.error(`❌ Error adding card: ${error.message}`);
  }
}

// Main execution
const category = process.argv[2];

if (!category) {
  showUsage();
  process.exit(1);
}

const filePath = getCardFilePath(category);

if (!filePath) {
  console.error(`❌ Invalid category: ${category}`);
  showUsage();
  process.exit(1);
}

console.log(`📝 Card Template for category: ${category}\n`);
console.log('Copy this template and customize it:\n');
console.log(JSON.stringify(cardTemplate, null, 2));

console.log(`\n📁 Add your customized card to: ${filePath}`);
console.log(`\n🔧 Steps to add a new card:`);
console.log(`1. Copy the template above`);
console.log(`2. Customize all fields (especially id, title, content)`);
console.log(`3. Add it to the "cards" array in ${filePath}`);
console.log(`4. Run: npm test (to validate)`);
console.log(`5. Run: node scripts/validate-cards.js (to check structure)`);

console.log(`\n💡 Tips:`);
console.log(`- Use kebab-case for the id (e.g., "array-methods-map")`);
console.log(`- Keep estimatedTime realistic (2-8 minutes)`);
console.log(`- Include practical code examples`);
console.log(`- Write clear, engaging content`);
console.log(`- Test your quiz questions`);
console.log(`- Use relevant, searchable tags`);
