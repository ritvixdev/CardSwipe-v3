#!/usr/bin/env node

// ============================================================================
// CONTENT GENERATION WORKFLOW
// ============================================================================
// Complete workflow script for generating cards and quizzes from knowledge files
// with duplicate prevention and validation

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class ContentGenerationWorkflow {
  constructor() {
    this.baseDir = path.join(__dirname, '../..');
    this.knowledgeDir = path.join(this.baseDir, 'knowledge', 'javascript-in-30-days');
    this.dataDir = path.join(this.baseDir, 'data');
    this.generatorsDir = path.join(this.dataDir, 'generators');
  }

  async runCompleteWorkflow(options = {}) {
    const {
      cleanStart = false,
      skipValidation = false,
      verbose = true
    } = options;

    console.log('🚀 CONTENT GENERATION WORKFLOW');
    console.log('=' .repeat(50));
    
    try {
      // Step 1: Pre-generation checks
      await this.preGenerationChecks();
      
      // Step 2: Clean existing content (if requested)
      if (cleanStart) {
        await this.cleanExistingContent();
      }
      
      // Step 3: Generate base content
      await this.generateBaseContent();
      
      // Step 4: Generate topic manifests
      await this.generateTopicManifests();
      
      // Step 5: Validate content (if not skipped)
      if (!skipValidation) {
        await this.validateContent();
      }
      
      // Step 6: Generate summary
      await this.generateSummary();
      
      // Step 7: Post-generation report
      await this.postGenerationReport();
      
      console.log('\n🎉 WORKFLOW COMPLETED SUCCESSFULLY!');
      
    } catch (error) {
      console.error('\n❌ WORKFLOW FAILED:', error.message);
      process.exit(1);
    }
  }

  async preGenerationChecks() {
    console.log('\n🔍 Step 1: Pre-generation checks...');
    
    // Check if knowledge directory exists
    try {
      await fs.access(this.knowledgeDir);
      const files = await fs.readdir(this.knowledgeDir);
      const markdownFiles = files.filter(f => f.endsWith('.md'));
      
      console.log(`   ✅ Knowledge directory found: ${markdownFiles.length} markdown files`);
      
      if (markdownFiles.length === 0) {
        throw new Error('No markdown files found in knowledge directory');
      }
      
    } catch (error) {
      throw new Error(`Knowledge directory not accessible: ${error.message}`);
    }
    
    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`   ✅ Node.js version: ${nodeVersion}`);
    
    // Check if generators exist
    const requiredGenerators = [
      'runContentGenerator.js',
      'generateTopicManifests.js',
      'validateAndTest.js',
      'contentSummary.js'
    ];
    
    for (const generator of requiredGenerators) {
      const generatorPath = path.join(this.generatorsDir, generator);
      try {
        await fs.access(generatorPath);
        console.log(`   ✅ Generator found: ${generator}`);
      } catch (error) {
        throw new Error(`Required generator not found: ${generator}`);
      }
    }
  }

  async cleanExistingContent() {
    console.log('\n🧹 Step 2: Cleaning existing content...');
    
    const dirsToClean = [
      path.join(this.dataDir, 'learn', 'cards'),
      path.join(this.dataDir, 'learn', 'topics'),
      path.join(this.dataDir, 'explore', 'javascript-notes'),
      path.join(this.dataDir, 'explore', 'practice-quiz')
    ];
    
    for (const dir of dirsToClean) {
      try {
        const items = await fs.readdir(dir, { withFileTypes: true });
        
        for (const item of items) {
          const itemPath = path.join(dir, item.name);
          
          if (item.isDirectory()) {
            // Remove directory and its contents
            await fs.rm(itemPath, { recursive: true, force: true });
            console.log(`   🗑️ Removed directory: ${item.name}`);
          } else if (item.name.endsWith('.json')) {
            // Remove JSON files
            await fs.unlink(itemPath);
            console.log(`   🗑️ Removed file: ${item.name}`);
          }
        }
        
      } catch (error) {
        console.log(`   ⚠️ Could not clean ${dir}: ${error.message}`);
      }
    }
  }

  async generateBaseContent() {
    console.log('\n📝 Step 3: Generating base content...');
    
    const generatorPath = path.join(this.generatorsDir, 'runContentGenerator.js');
    
    try {
      const output = execSync(`node "${generatorPath}"`, {
        cwd: this.baseDir,
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      console.log('   ✅ Base content generation completed');
      
      // Extract statistics from output
      const lines = output.split('\n');
      const statsLine = lines.find(line => line.includes('Generated'));
      if (statsLine) {
        console.log(`   📊 ${statsLine.trim()}`);
      }
      
    } catch (error) {
      throw new Error(`Base content generation failed: ${error.message}`);
    }
  }

  async generateTopicManifests() {
    console.log('\n📋 Step 4: Generating topic manifests...');
    
    const generatorPath = path.join(this.generatorsDir, 'generateTopicManifests.js');
    
    try {
      const output = execSync(`node "${generatorPath}"`, {
        cwd: this.baseDir,
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      console.log('   ✅ Topic manifests generation completed');
      
      // Count generated manifests
      const topicsDir = path.join(this.dataDir, 'learn', 'topics');
      const files = await fs.readdir(topicsDir);
      const manifestFiles = files.filter(f => f.endsWith('.json'));
      
      console.log(`   📊 Generated ${manifestFiles.length} manifest files`);
      
    } catch (error) {
      throw new Error(`Topic manifests generation failed: ${error.message}`);
    }
  }

  async validateContent() {
    console.log('\n🔍 Step 5: Validating content...');
    
    const validatorPath = path.join(this.generatorsDir, 'validateAndTest.js');
    
    try {
      const output = execSync(`node "${validatorPath}"`, {
        cwd: this.baseDir,
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      console.log('   ✅ Content validation completed');
      
      // Check if validation passed
      if (output.includes('VALIDATION PASSED')) {
        console.log('   ✅ All validation checks passed');
      } else {
        console.log('   ⚠️ Some validation warnings detected');
      }
      
      // Extract statistics
      const lines = output.split('\n');
      const statsSection = lines.slice(
        lines.findIndex(line => line.includes('Statistics:')),
        lines.findIndex(line => line.includes('VALIDATION'))
      );
      
      statsSection.forEach(line => {
        if (line.trim() && !line.includes('Statistics:')) {
          console.log(`   📊 ${line.trim()}`);
        }
      });
      
    } catch (error) {
      throw new Error(`Content validation failed: ${error.message}`);
    }
  }

  async generateSummary() {
    console.log('\n📊 Step 6: Generating summary...');
    
    const summaryPath = path.join(this.generatorsDir, 'contentSummary.js');
    
    try {
      const output = execSync(`node "${summaryPath}"`, {
        cwd: this.baseDir,
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      console.log('   ✅ Summary generation completed');
      
    } catch (error) {
      console.log(`   ⚠️ Summary generation failed: ${error.message}`);
    }
  }

  async postGenerationReport() {
    console.log('\n📋 Step 7: Post-generation report...');
    
    try {
      // Count generated files
      const stats = await this.getGenerationStats();
      
      console.log('\n📊 GENERATION STATISTICS');
      console.log('-'.repeat(30));
      console.log(`📚 Total Topics: ${stats.topics}`);
      console.log(`🃏 Learning Cards: ${stats.cards}`);
      console.log(`📝 Study Notes: ${stats.notes}`);
      console.log(`🧩 Practice Quizzes: ${stats.quizzes}`);
      console.log(`📁 Total Files: ${stats.totalFiles}`);
      
      console.log('\n🎯 NEXT STEPS');
      console.log('-'.repeat(20));
      console.log('1. 🔄 Update your app to use the new multi-file loader');
      console.log('2. 🧪 Test the progressive loading features');
      console.log('3. 📱 Run your app and verify content loads correctly');
      console.log('4. 🚀 Deploy the updated content to production');
      
      console.log('\n💻 INTEGRATION CODE');
      console.log('-'.repeat(25));
      console.log('// Load complete topic');
      console.log('const cards = await multiFileLoader.loadCompleteTopic("fundamentals", "cards");');
      console.log('');
      console.log('// Progressive loading');
      console.log('const day2Cards = await multiFileLoader.loadTopicPart("fundamentals", 2, "cards");');
      
    } catch (error) {
      console.log(`   ⚠️ Could not generate report: ${error.message}`);
    }
  }

  async getGenerationStats() {
    const stats = {
      topics: 0,
      cards: 0,
      notes: 0,
      quizzes: 0,
      totalFiles: 0
    };
    
    try {
      // Count topics
      const topicsDir = path.join(this.dataDir, 'learn', 'topics');
      const topicFiles = await fs.readdir(topicsDir);
      stats.topics = topicFiles.filter(f => f.endsWith('.json') && f !== 'index.json').length;
      
      // Count cards
      const cardsDir = path.join(this.dataDir, 'learn', 'cards');
      const cardTopics = await fs.readdir(cardsDir, { withFileTypes: true });
      
      for (const topic of cardTopics) {
        if (topic.isDirectory()) {
          const topicPath = path.join(cardsDir, topic.name);
          const files = await fs.readdir(topicPath);
          stats.cards += files.filter(f => f.endsWith('.json')).length;
        }
      }
      
      // Count notes
      const notesDir = path.join(this.dataDir, 'explore', 'javascript-notes');
      try {
        const noteFiles = await fs.readdir(notesDir);
        stats.notes = noteFiles.filter(f => f.endsWith('.json')).length;
      } catch (error) {
        // Directory might not exist
      }
      
      // Count quizzes
      const quizzesDir = path.join(this.dataDir, 'explore', 'practice-quiz');
      try {
        const quizFiles = await fs.readdir(quizzesDir);
        stats.quizzes = quizFiles.filter(f => f.endsWith('.json')).length;
      } catch (error) {
        // Directory might not exist
      }
      
      stats.totalFiles = stats.topics + stats.cards + stats.notes + stats.quizzes + 1; // +1 for index.json
      
    } catch (error) {
      console.log(`Warning: Could not calculate stats: ${error.message}`);
    }
    
    return stats;
  }

  // Utility methods for specific operations
  async checkForDuplicates() {
    console.log('\n🔍 Checking for duplicates...');
    
    const duplicates = [];
    const seen = new Set();
    
    // Check cards for duplicates
    const cardsDir = path.join(this.dataDir, 'learn', 'cards');
    const topics = await fs.readdir(cardsDir, { withFileTypes: true });
    
    for (const topic of topics) {
      if (topic.isDirectory()) {
        const topicPath = path.join(cardsDir, topic.name);
        const files = await fs.readdir(topicPath);
        
        for (const file of files) {
          if (file.endsWith('.json')) {
            const filePath = path.join(topicPath, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(content);
            
            const signature = `${data.title}-${data.topic}-${data.day}`;
            
            if (seen.has(signature)) {
              duplicates.push({ file, signature, path: filePath });
            } else {
              seen.add(signature);
            }
          }
        }
      }
    }
    
    if (duplicates.length > 0) {
      console.log(`   ⚠️ Found ${duplicates.length} potential duplicates:`);
      duplicates.forEach(dup => {
        console.log(`     - ${dup.file} (${dup.signature})`);
      });
    } else {
      console.log('   ✅ No duplicates found');
    }
    
    return duplicates;
  }

  async regenerateSpecificTopic(topicId) {
    console.log(`\n🔄 Regenerating content for topic: ${topicId}`);
    
    // Remove existing topic content
    const topicCardDir = path.join(this.dataDir, 'learn', 'cards', topicId);
    try {
      await fs.rm(topicCardDir, { recursive: true, force: true });
      console.log(`   🗑️ Removed existing cards for ${topicId}`);
    } catch (error) {
      console.log(`   ⚠️ Could not remove existing cards: ${error.message}`);
    }
    
    // Regenerate content
    await this.generateBaseContent();
    await this.generateTopicManifests();
    
    console.log(`   ✅ Regenerated content for ${topicId}`);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const workflow = new ContentGenerationWorkflow();
  
  const options = {
    cleanStart: args.includes('--clean'),
    skipValidation: args.includes('--skip-validation'),
    verbose: !args.includes('--quiet')
  };
  
  if (args.includes('--help')) {
    console.log('Content Generation Workflow');
    console.log('Usage: node generateContentWorkflow.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --clean              Clean existing content before generation');
    console.log('  --skip-validation    Skip content validation step');
    console.log('  --quiet              Reduce output verbosity');
    console.log('  --check-duplicates   Only check for duplicates');
    console.log('  --help               Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  node generateContentWorkflow.js --clean');
    console.log('  node generateContentWorkflow.js --skip-validation');
    console.log('  node generateContentWorkflow.js --check-duplicates');
    process.exit(0);
  }
  
  if (args.includes('--check-duplicates')) {
    workflow.checkForDuplicates()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Error checking duplicates:', error);
        process.exit(1);
      });
  } else {
    workflow.runCompleteWorkflow(options)
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Workflow failed:', error);
        process.exit(1);
      });
  }
}

module.exports = { ContentGenerationWorkflow };