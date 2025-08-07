#!/usr/bin/env node

// ============================================================================
// MULTI-FILE STRUCTURE VALIDATOR AND TESTER
// ============================================================================
// This script validates the generated content and tests the multi-file loading

const fs = require('fs').promises;
const path = require('path');

class MultiFileValidator {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalFiles: 0,
      totalCards: 0,
      totalNotes: 0,
      totalQuizzes: 0,
      topics: 0
    };
  }

  async validateAll() {
    console.log('🔍 Starting comprehensive validation...');
    
    try {
      // Test 1: Validate directory structure
      await this.validateDirectoryStructure();
      
      // Test 2: Validate topic manifests
      await this.validateTopicManifests();
      
      // Test 3: Validate card files
      await this.validateCardFiles();
      
      // Test 4: Validate explore content
      await this.validateExploreContent();
      
      // Test 5: Test multi-file loading simulation
      await this.testMultiFileLoading();
      
      // Test 6: Validate content consistency
      await this.validateContentConsistency();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      throw error;
    }
  }

  async validateDirectoryStructure() {
    console.log('\n📁 Validating directory structure...');
    
    const requiredDirs = [
      'data/learn/cards',
      'data/learn/topics',
      'data/explore/javascript-notes',
      'data/explore/practice-quiz'
    ];
    
    for (const dir of requiredDirs) {
      try {
        await fs.access(dir);
        console.log(`   ✅ ${dir}`);
      } catch (error) {
        this.errors.push(`Missing directory: ${dir}`);
        console.log(`   ❌ ${dir}`);
      }
    }
    
    // Check topic subdirectories
    const topics = ['fundamentals', 'data-structures', 'control-flow', 'functions', 'objects', 'dom', 'projects'];
    for (const topic of topics) {
      try {
        await fs.access(`data/learn/cards/${topic}`);
        console.log(`   ✅ data/learn/cards/${topic}`);
      } catch (error) {
        this.warnings.push(`Missing topic directory: ${topic}`);
        console.log(`   ⚠️ data/learn/cards/${topic}`);
      }
    }
  }

  async validateTopicManifests() {
    console.log('\n📋 Validating topic manifests...');
    
    try {
      // Check master index
      const indexPath = path.join(this.dataDir, 'learn', 'topics', 'index.json');
      const indexContent = await fs.readFile(indexPath, 'utf-8');
      const index = JSON.parse(indexContent);
      
      console.log(`   ✅ Master index: ${index.learningPath.length} topics`);
      this.stats.topics = index.learningPath.length;
      
      // Validate each topic manifest
      for (const topic of index.learningPath) {
        try {
          const manifestPath = path.join(this.dataDir, topic.manifestPath);
          const manifestContent = await fs.readFile(manifestPath, 'utf-8');
          const manifest = JSON.parse(manifestContent);
          
          // Validate required fields
          const requiredFields = ['metadata', 'structure', 'files', 'progression'];
          const missingFields = requiredFields.filter(field => !manifest[field]);
          
          if (missingFields.length === 0) {
            console.log(`   ✅ ${topic.name}: ${manifest.structure.totalFiles} files`);
            this.stats.totalFiles += manifest.structure.totalFiles;
          } else {
            this.errors.push(`${topic.name} manifest missing fields: ${missingFields.join(', ')}`);
            console.log(`   ❌ ${topic.name}: missing fields`);
          }
          
        } catch (error) {
          this.errors.push(`Failed to validate ${topic.name} manifest: ${error.message}`);
          console.log(`   ❌ ${topic.name}: validation failed`);
        }
      }
      
    } catch (error) {
      this.errors.push(`Master index validation failed: ${error.message}`);
      console.log('   ❌ Master index validation failed');
    }
  }

  async validateCardFiles() {
    console.log('\n🃏 Validating card files...');
    
    const topics = ['fundamentals', 'data-structures', 'control-flow', 'functions', 'objects', 'dom', 'projects'];
    
    for (const topic of topics) {
      try {
        const topicDir = path.join(this.dataDir, 'learn', 'cards', topic);
        const files = await fs.readdir(topicDir);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        console.log(`   📚 ${topic}: ${jsonFiles.length} files`);
        
        for (const file of jsonFiles) {
          const filePath = path.join(topicDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content);
          
          // Validate structure
          if (!data.metadata || !data.cards) {
            this.errors.push(`${file}: missing metadata or cards`);
            continue;
          }
          
          // Validate cards
          for (const card of data.cards) {
            const requiredFields = ['id', 'title', 'category', 'difficulty', 'content'];
            const missingFields = requiredFields.filter(field => !card[field]);
            
            if (missingFields.length > 0) {
              this.errors.push(`${file} card ${card.id}: missing ${missingFields.join(', ')}`);
            }
          }
          
          this.stats.totalCards += data.cards.length;
        }
        
      } catch (error) {
        this.warnings.push(`Could not validate ${topic} cards: ${error.message}`);
      }
    }
  }

  async validateExploreContent() {
    console.log('\n🔍 Validating explore content...');
    
    // Validate notes
    try {
      const notesDir = path.join(this.dataDir, 'explore', 'javascript-notes');
      const noteFiles = await fs.readdir(notesDir);
      const jsonFiles = noteFiles.filter(f => f.endsWith('.json'));
      
      console.log(`   📝 Notes: ${jsonFiles.length} files`);
      
      for (const file of jsonFiles) {
        const filePath = path.join(notesDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        
        if (data.notes) {
          this.stats.totalNotes += data.notes.length;
        }
      }
      
    } catch (error) {
      this.warnings.push(`Could not validate notes: ${error.message}`);
    }
    
    // Validate quizzes
    try {
      const quizDir = path.join(this.dataDir, 'explore', 'practice-quiz');
      const quizFiles = await fs.readdir(quizDir);
      const jsonFiles = quizFiles.filter(f => f.endsWith('.json'));
      
      console.log(`   🧩 Quizzes: ${jsonFiles.length} files`);
      
      for (const file of jsonFiles) {
        const filePath = path.join(quizDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        
        if (data.quizzes) {
          this.stats.totalQuizzes += data.quizzes.length;
        }
      }
      
    } catch (error) {
      this.warnings.push(`Could not validate quizzes: ${error.message}`);
    }
  }

  async testMultiFileLoading() {
    console.log('\n🔄 Testing multi-file loading simulation...');
    
    try {
      // Simulate loading a complete topic
      const fundamentalsManifest = path.join(this.dataDir, 'learn', 'topics', 'fundamentals.json');
      const manifestContent = await fs.readFile(fundamentalsManifest, 'utf-8');
      const manifest = JSON.parse(manifestContent);
      
      console.log(`   📚 Loading topic: ${manifest.metadata.name}`);
      
      // Load all card files for this topic
      let loadedCards = 0;
      for (const cardFile of manifest.files.cards) {
        try {
          const cardPath = path.join(this.dataDir, cardFile.path);
          const cardContent = await fs.readFile(cardPath, 'utf-8');
          const cardData = JSON.parse(cardContent);
          loadedCards += cardData.cards.length;
        } catch (error) {
          this.errors.push(`Failed to load card file: ${cardFile.path}`);
        }
      }
      
      console.log(`   ✅ Loaded ${loadedCards} cards from ${manifest.files.cards.length} files`);
      
      // Test progressive loading (load by day)
      const day2Cards = manifest.files.cards.filter(f => f.day === 2);
      if (day2Cards.length > 0) {
        console.log(`   ✅ Progressive loading: Found ${day2Cards.length} files for day 2`);
      }
      
    } catch (error) {
      this.errors.push(`Multi-file loading test failed: ${error.message}`);
      console.log('   ❌ Multi-file loading test failed');
    }
  }

  async validateContentConsistency() {
    console.log('\n🔗 Validating content consistency...');
    
    try {
      // Check that all referenced files exist
      const indexPath = path.join(this.dataDir, 'learn', 'topics', 'index.json');
      const indexContent = await fs.readFile(indexPath, 'utf-8');
      const index = JSON.parse(indexContent);
      
      for (const topic of index.learningPath) {
        const manifestPath = path.join(this.dataDir, topic.manifestPath);
        const manifestContent = await fs.readFile(manifestPath, 'utf-8');
        const manifest = JSON.parse(manifestContent);
        
        // Check all referenced files exist
        for (const cardFile of manifest.files.cards) {
          const filePath = path.join(this.dataDir, cardFile.path);
          try {
            await fs.access(filePath);
          } catch (error) {
            this.errors.push(`Referenced file does not exist: ${cardFile.path}`);
          }
        }
      }
      
      console.log('   ✅ Content consistency validated');
      
    } catch (error) {
      this.errors.push(`Content consistency validation failed: ${error.message}`);
      console.log('   ❌ Content consistency validation failed');
    }
  }

  generateReport() {
    console.log('\n📊 VALIDATION REPORT');
    console.log('=' .repeat(50));
    
    // Statistics
    console.log('\n📈 Statistics:');
    console.log(`   Topics: ${this.stats.topics}`);
    console.log(`   Total Files: ${this.stats.totalFiles}`);
    console.log(`   Cards: ${this.stats.totalCards}`);
    console.log(`   Notes: ${this.stats.totalNotes}`);
    console.log(`   Quizzes: ${this.stats.totalQuizzes}`);
    
    // Errors
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    // Warnings
    if (this.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      this.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    // Overall status
    if (this.errors.length === 0) {
      console.log('\n✅ VALIDATION PASSED');
      console.log('\n🎉 Your multi-file structure is ready!');
      console.log('\n📋 Next Steps:');
      console.log('   1. Update your app to use the new multi-file loader');
      console.log('   2. Test the progressive loading features');
      console.log('   3. Monitor performance improvements');
      console.log('   4. Add more content as needed');
    } else {
      console.log('\n❌ VALIDATION FAILED');
      console.log(`   ${this.errors.length} errors need to be fixed`);
    }
  }
}

// Run the validator
if (require.main === module) {
  const validator = new MultiFileValidator();
  validator.validateAll()
    .then(() => {
      console.log('\n🏁 Validation completed!');
    })
    .catch(error => {
      console.error('\n💥 Validation crashed:', error);
      process.exit(1);
    });
}

module.exports = { MultiFileValidator };