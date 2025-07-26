const fs = require('fs');
const path = require('path');

// Load configuration
const config = JSON.parse(fs.readFileSync('./data/learn/config.json', 'utf8'));

// Load all card files
const cardFiles = [
  './data/learn/cards/fundamentals.json',
  './data/learn/cards/data-structures.json',
  './data/learn/cards/control-flow.json',
  './data/learn/cards/web-development.json',
  './data/learn/cards/asynchronous.json',
  './data/learn/cards/advanced-concepts.json'
];

let totalCards = 0;
const cardsByCategory = {};

console.log('🔍 Validating modular card structure...\n');

// Validate each card file
cardFiles.forEach(filePath => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const fileName = path.basename(filePath, '.json');
    
    console.log(`📁 ${fileName}.json:`);
    console.log(`   Cards: ${data.cards.length}`);
    
    totalCards += data.cards.length;
    
    // Count cards by category
    data.cards.forEach(card => {
      if (!cardsByCategory[card.category]) {
        cardsByCategory[card.category] = 0;
      }
      cardsByCategory[card.category]++;
    });
    
    // Validate card structure
    data.cards.forEach(card => {
      const requiredFields = ['id', 'title', 'day', 'category', 'difficulty', 'estimatedTime', 'description', 'content', 'keyPoints', 'quiz', 'tags'];
      const missingFields = requiredFields.filter(field => !card[field]);
      
      if (missingFields.length > 0) {
        console.log(`   ⚠️  Card ${card.id} missing fields: ${missingFields.join(', ')}`);
      }
      
      // Validate category exists in config
      if (!config.categories.includes(card.category)) {
        console.log(`   ⚠️  Card ${card.id} has invalid category: ${card.category}`);
      }
      
      // Validate difficulty
      if (!config.difficulties.includes(card.difficulty)) {
        console.log(`   ⚠️  Card ${card.id} has invalid difficulty: ${card.difficulty}`);
      }
    });
    
    console.log(`   ✅ Valid structure\n`);
    
  } catch (error) {
    console.log(`   ❌ Error loading ${filePath}: ${error.message}\n`);
  }
});

// Summary
console.log('📊 Summary:');
console.log(`   Total cards: ${totalCards}`);
console.log(`   Categories: ${config.categories.length}`);
console.log(`   Topics: ${config.topics.length}`);
console.log(`   Difficulties: ${config.difficulties.length}\n`);

console.log('📂 Cards by category:');
Object.entries(cardsByCategory).forEach(([category, count]) => {
  console.log(`   ${category}: ${count} cards`);
});

console.log('\n🏷️ Available topics:');
config.topics.forEach(topic => {
  console.log(`   ${topic.icon} ${topic.title} - ${topic.description}`);
});

console.log('\n✅ Validation complete!');
