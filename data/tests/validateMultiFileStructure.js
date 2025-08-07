#!/usr/bin/env node

// ============================================================================
// MULTI-FILE STRUCTURE VALIDATION AND TESTING
// ============================================================================
// This script validates the multi-file structure and tests integration

const fs = require('fs').promises;
const path = require('path');

class MultiFileValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log('🧪 Running Multi-File Structure Validation Tests...\n');
    
    // Test 1: Directory Structure
    await this.testDirectoryStructure();
    
    // Test 2: File Format Validation
    await this.testFileFormats();
    
    // Test 3: Topic Manifest Validation
    await this.testTopicManifests();
    
    // Test 4: Content Consistency
    await this.testContentConsistency();
    
    // Test 5: Card Structure Validation
    await this.testCardStructures();
    
    // Test 6: Explore Content Validation
    await this.testExploreContent();
    
    // Test 7: File Size and Performance
    await this.testPerformanceMetrics();
    
    this.printSummary();
    return this.results;
  }

  async testDirectoryStructure() {
    console.log('📂 Testing directory structure...');
    
    const requiredDirs = [
      'data/learn/cards',
      'data/learn/topics',
      'data/learn/cards/fundamentals',
      'data/learn/cards/data-structures',
      'data/explore/javascript-notes',
      'data/explore/practice-quiz'
    ];

    let allDirsExist = true;
    
    for (const dir of requiredDirs) {
      try {
        await fs.access(dir);
        this.pass(`Directory exists: ${dir}`);
      } catch (error) {
        this.fail(`Missing directory: ${dir}`);
        allDirsExist = false;
      }
    }

    if (allDirsExist) {
      console.log('   ✅ All required directories exist\n');
    } else {
      console.log('   ❌ Some directories are missing\n');
    }
  }

  async testFileFormats() {
    console.log('📄 Testing file formats and JSON validity...');
    
    const testFiles = [
      'data/learn/cards/fundamentals/fundamentals-001.json',
      'data/learn/topics/fundamentals.json',
      'data/explore/javascript-notes/fundamentals-notes-001.json',
      'data/explore/practice-quiz/fundamentals-quiz-001.json'
    ];

    let allFilesValid = true;

    for (const file of testFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const parsed = JSON.parse(content);
        
        // Basic structure checks
        if (file.includes('/cards/')) {
          if (parsed.metadata && parsed.cards) {
            this.pass(`Valid card file format: ${path.basename(file)}`);
          } else {
            this.fail(`Invalid card file structure: ${path.basename(file)}`);
            allFilesValid = false;
          }
        } else if (file.includes('/topics/')) {
          if (parsed.topicId && parsed.files && Array.isArray(parsed.files)) {
            this.pass(`Valid topic manifest: ${path.basename(file)}`);
          } else {
            this.fail(`Invalid topic manifest: ${path.basename(file)}`);
            allFilesValid = false;
          }
        } else if (file.includes('/javascript-notes/')) {
          if (parsed.metadata && parsed.notes) {
            this.pass(`Valid notes file: ${path.basename(file)}`);
          } else {
            this.fail(`Invalid notes structure: ${path.basename(file)}`);
            allFilesValid = false;
          }
        } else if (file.includes('/practice-quiz/')) {
          if (parsed.metadata && parsed.quizzes) {
            this.pass(`Valid quiz file: ${path.basename(file)}`);
          } else {
            this.fail(`Invalid quiz structure: ${path.basename(file)}`);
            allFilesValid = false;
          }
        }
        
      } catch (error) {
        this.fail(`File error ${path.basename(file)}: ${error.message}`);
        allFilesValid = false;
      }
    }

    if (allFilesValid) {
      console.log('   ✅ All JSON files are valid and well-formatted\n');
    } else {
      console.log('   ❌ Some files have issues\n');
    }
  }

  async testTopicManifests() {
    console.log('📋 Testing topic manifests...');
    
    try {
      const fundamentalsManifest = await fs.readFile('data/learn/topics/fundamentals.json', 'utf-8');
      const manifest = JSON.parse(fundamentalsManifest);
      
      // Test required fields
      const requiredFields = ['topicId', 'name', 'description', 'totalFiles', 'files'];
      let manifestValid = true;
      
      for (const field of requiredFields) {
        if (!manifest[field]) {
          this.fail(`Missing field in manifest: ${field}`);
          manifestValid = false;
        }
      }
      
      // Test files array structure
      if (manifest.files && Array.isArray(manifest.files)) {
        for (const file of manifest.files) {
          if (!file.fileId || !file.path || !file.subtopic) {
            this.fail(`Invalid file entry in manifest: missing required fields`);
            manifestValid = false;
          } else {
            this.pass(`Valid file entry: ${file.fileId}`);
          }
        }
      }
      
      if (manifestValid) {
        this.pass('Topic manifest structure is valid');
        console.log('   ✅ Topic manifests are properly structured\n');
      } else {
        console.log('   ❌ Topic manifest has structural issues\n');
      }
      
    } catch (error) {
      this.fail(`Failed to validate topic manifest: ${error.message}`);
      console.log('   ❌ Could not validate topic manifests\n');
    }
  }

  async testContentConsistency() {
    console.log('🔗 Testing content consistency...');
    
    try {
      // Load and test fundamentals cards
      const cardsContent = await fs.readFile('data/learn/cards/fundamentals/fundamentals-001.json', 'utf-8');
      const cardsData = JSON.parse(cardsContent);
      
      let consistencyValid = true;
      
      // Test metadata consistency
      if (cardsData.metadata.cardCount !== cardsData.cards.length) {
        this.fail(`Card count mismatch: metadata says ${cardsData.metadata.cardCount}, actual ${cardsData.cards.length}`);
        consistencyValid = false;
      } else {
        this.pass(`Card count consistent: ${cardsData.cards.length}`);
      }
      
      // Test card structure consistency
      for (let i = 0; i < cardsData.cards.length; i++) {
        const card = cardsData.cards[i];
        const cardNum = i + 1;
        
        // Required fields
        const requiredCardFields = ['id', 'title', 'category', 'difficulty', 'content', 'quiz'];
        for (const field of requiredCardFields) {
          if (!card[field]) {
            this.fail(`Card ${cardNum} missing field: ${field}`);
            consistencyValid = false;
          }
        }
        
        // Category consistency with metadata
        if (card.category !== cardsData.metadata.topic) {
          this.fail(`Card ${cardNum} category mismatch: ${card.category} vs ${cardsData.metadata.topic}`);
          consistencyValid = false;
        }
      }
      
      if (consistencyValid) {
        this.pass('Content consistency validation passed');
        console.log('   ✅ Content is consistent and properly structured\n');
      } else {
        console.log('   ❌ Content consistency issues found\n');
      }
      
    } catch (error) {
      this.fail(`Content consistency test failed: ${error.message}`);
      console.log('   ❌ Could not validate content consistency\n');
    }
  }

  async testCardStructures() {
    console.log('🃏 Testing individual card structures...');
    
    try {
      const cardsContent = await fs.readFile('data/learn/cards/fundamentals/fundamentals-001.json', 'utf-8');
      const cardsData = JSON.parse(cardsContent);
      
      let allCardsValid = true;
      
      for (let i = 0; i < Math.min(cardsData.cards.length, 3); i++) {
        const card = cardsData.cards[i];
        const cardNum = i + 1;
        
        // Test card structure
        if (card.quiz) {
          if (!card.quiz.question || !card.quiz.options || !Array.isArray(card.quiz.options)) {
            this.fail(`Card ${cardNum} has invalid quiz structure`);
            allCardsValid = false;
          } else if (card.quiz.options.length < 2) {
            this.fail(`Card ${cardNum} quiz needs at least 2 options`);
            allCardsValid = false;
          } else {
            this.pass(`Card ${cardNum} quiz structure valid`);
          }
        }
        
        // Test tags
        if (card.tags && Array.isArray(card.tags)) {
          this.pass(`Card ${cardNum} has valid tags array`);
        } else {
          this.warn(`Card ${cardNum} missing or invalid tags`);
        }
        
        // Test key points
        if (card.keyPoints && Array.isArray(card.keyPoints) && card.keyPoints.length > 0) {
          this.pass(`Card ${cardNum} has key points`);
        } else {
          this.warn(`Card ${cardNum} missing key points`);
        }
      }
      
      if (allCardsValid) {
        console.log('   ✅ All tested cards have valid structures\n');
      } else {
        console.log('   ❌ Some cards have structural issues\n');
      }
      
    } catch (error) {
      this.fail(`Card structure test failed: ${error.message}`);
      console.log('   ❌ Could not validate card structures\n');
    }
  }

  async testExploreContent() {
    console.log('🔍 Testing explore section content...');
    
    try {
      // Test notes
      const notesContent = await fs.readFile('data/explore/javascript-notes/fundamentals-notes-001.json', 'utf-8');
      const notesData = JSON.parse(notesContent);
      
      let exploreValid = true;
      
      if (notesData.notes && Array.isArray(notesData.notes)) {
        for (const note of notesData.notes) {
          if (!note.title || !note.content) {
            this.fail('Note missing required fields');
            exploreValid = false;
          } else {
            this.pass(`Valid note: ${note.title.substring(0, 30)}...`);
          }
        }
      }
      
      // Test quizzes
      const quizContent = await fs.readFile('data/explore/practice-quiz/fundamentals-quiz-001.json', 'utf-8');
      const quizData = JSON.parse(quizContent);
      
      if (quizData.quizzes && Array.isArray(quizData.quizzes)) {
        for (const quiz of quizData.quizzes) {
          if (!quiz.title || !quiz.questions || !Array.isArray(quiz.questions)) {
            this.fail('Quiz missing required structure');
            exploreValid = false;
          } else {
            this.pass(`Valid quiz: ${quiz.title}`);
          }
        }
      }
      
      if (exploreValid) {
        console.log('   ✅ Explore content is properly structured\n');
      } else {
        console.log('   ❌ Explore content has issues\n');
      }
      
    } catch (error) {
      this.fail(`Explore content test failed: ${error.message}`);
      console.log('   ❌ Could not validate explore content\n');
    }
  }

  async testPerformanceMetrics() {
    console.log('⚡ Testing performance metrics...');
    
    try {
      const cardsFile = 'data/learn/cards/fundamentals/fundamentals-001.json';
      const stats = await fs.stat(cardsFile);
      const fileSizeKB = Math.round(stats.size / 1024);
      
      if (fileSizeKB < 100) {
        this.pass(`Good file size: ${fileSizeKB}KB (under 100KB)`);
      } else if (fileSizeKB < 200) {
        this.warn(`Moderate file size: ${fileSizeKB}KB (100-200KB)`);
      } else {
        this.fail(`Large file size: ${fileSizeKB}KB (over 200KB)`);
      }
      
      // Test JSON parsing performance
      const startTime = Date.now();
      const content = await fs.readFile(cardsFile, 'utf-8');
      const parsed = JSON.parse(content);
      const parseTime = Date.now() - startTime;
      
      if (parseTime < 10) {
        this.pass(`Fast parsing: ${parseTime}ms`);
      } else {
        this.warn(`Slow parsing: ${parseTime}ms`);
      }
      
      console.log('   ✅ Performance metrics are acceptable\n');
      
    } catch (error) {
      this.fail(`Performance test failed: ${error.message}`);
      console.log('   ❌ Could not test performance metrics\n');
    }
  }

  pass(message) {
    this.results.passed++;
    this.results.tests.push({ type: 'PASS', message });
  }

  fail(message) {
    this.results.failed++;
    this.results.tests.push({ type: 'FAIL', message });
  }

  warn(message) {
    this.results.warnings++;
    this.results.tests.push({ type: 'WARN', message });
  }

  printSummary() {
    console.log('📊 VALIDATION SUMMARY');
    console.log('=====================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📝 Total Tests: ${this.results.tests.length}\n`);
    
    if (this.results.failed > 0) {
      console.log('❌ FAILED TESTS:');
      this.results.tests
        .filter(test => test.type === 'FAIL')
        .forEach(test => console.log(`   • ${test.message}`));
      console.log('');
    }
    
    if (this.results.warnings > 0) {
      console.log('⚠️  WARNINGS:');
      this.results.tests
        .filter(test => test.type === 'WARN')
        .forEach(test => console.log(`   • ${test.message}`));
      console.log('');
    }
    
    const successRate = Math.round((this.results.passed / this.results.tests.length) * 100);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All critical tests passed! Multi-file structure is ready.');
    } else {
      console.log('\n🔧 Please fix the failed tests before proceeding.');
    }
  }
}

// Integration test with component loading simulation
async function testComponentIntegration() {
  console.log('\n🧩 Testing Component Integration Simulation...\n');
  
  try {
    // Simulate loading fundamentals cards (as the app would do)
    console.log('🔄 Simulating app loading fundamentals...');
    
    const cardsContent = await fs.readFile('data/learn/cards/fundamentals/fundamentals-001.json', 'utf-8');
    const cardsData = JSON.parse(cardsContent);
    
    console.log(`✅ Loaded ${cardsData.cards.length} cards from fundamentals-001.json`);
    console.log(`📊 Metadata: Topic=${cardsData.metadata.topic}, Difficulty=${cardsData.metadata.difficulty}`);
    
    // Simulate topic manifest loading
    const manifestContent = await fs.readFile('data/learn/topics/fundamentals.json', 'utf-8');
    const manifest = JSON.parse(manifestContent);
    
    console.log(`✅ Loaded topic manifest: ${manifest.name}`);
    console.log(`📈 Total estimated: ${manifest.totalCards} cards across ${manifest.totalFiles} files`);
    
    // Simulate explore content loading
    const notesContent = await fs.readFile('data/explore/javascript-notes/fundamentals-notes-001.json', 'utf-8');
    const notesData = JSON.parse(notesContent);
    
    console.log(`✅ Loaded ${notesData.notes.length} notes for explore section`);
    
    console.log('\n🎯 Component integration simulation successful!');
    return true;
    
  } catch (error) {
    console.log(`\n❌ Component integration simulation failed: ${error.message}`);
    return false;
  }
}

// Run all tests
async function main() {
  const validator = new MultiFileValidator();
  const results = await validator.runAllTests();
  
  const integrationSuccess = await testComponentIntegration();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 FINAL VALIDATION REPORT');
  console.log('='.repeat(50));
  
  if (results.failed === 0 && integrationSuccess) {
    console.log('🎉 SUCCESS: Multi-file structure is fully validated and ready!');
    console.log('\n📋 Next Steps:');
    console.log('   1. ✅ Directory structure created');
    console.log('   2. ✅ Sample content generated'); 
    console.log('   3. ✅ File formats validated');
    console.log('   4. ✅ Integration tested');
    console.log('   5. 🔄 Ready to generate full content from knowledge base');
    console.log('   6. 🔄 Update components to use enhanced data loader');
    process.exit(0);
  } else {
    console.log('❌ ISSUES FOUND: Please resolve the above issues before proceeding');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Validation script failed:', error);
    process.exit(1);
  });
}