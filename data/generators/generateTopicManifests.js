#!/usr/bin/env node

// ============================================================================
// TOPIC MANIFEST GENERATOR
// ============================================================================
// This script generates topic manifest files for the multi-file structure

const fs = require('fs').promises;
const path = require('path');

class TopicManifestGenerator {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.topics = {
      fundamentals: {
        name: 'JavaScript Fundamentals',
        description: 'Core JavaScript concepts including variables, data types, and basic operations',
        difficulty: 'beginner',
        estimatedHours: 8,
        prerequisites: [],
        days: [2, 4, 5]
      },
      'data-structures': {
        name: 'Data Structures',
        description: 'Arrays, objects, sets, maps and other data structures in JavaScript',
        difficulty: 'beginner',
        estimatedHours: 10,
        prerequisites: ['fundamentals'],
        days: [6, 7, 8, 9, 10]
      },
      'control-flow': {
        name: 'Control Flow',
        description: 'Conditionals, loops, and program flow control',
        difficulty: 'intermediate',
        estimatedHours: 8,
        prerequisites: ['fundamentals'],
        days: [11, 12, 13, 14, 15]
      },
      functions: {
        name: 'Functions & Scope',
        description: 'Function declarations, expressions, arrow functions, and scope',
        difficulty: 'intermediate',
        estimatedHours: 10,
        prerequisites: ['fundamentals', 'control-flow'],
        days: [16, 17, 18, 19, 20]
      },
      objects: {
        name: 'Objects & Classes',
        description: 'Object-oriented programming, classes, and advanced object concepts',
        difficulty: 'intermediate',
        estimatedHours: 12,
        prerequisites: ['functions'],
        days: [21, 22, 23, 24, 25]
      },
      dom: {
        name: 'DOM Manipulation',
        description: 'Document Object Model manipulation and web interactions',
        difficulty: 'advanced',
        estimatedHours: 6,
        prerequisites: ['objects'],
        days: [26, 27]
      },
      projects: {
        name: 'Projects & Applications',
        description: 'Real-world projects and practical applications',
        difficulty: 'advanced',
        estimatedHours: 15,
        prerequisites: ['dom'],
        days: [28, 29, 30]
      }
    };
  }

  async generateAllManifests() {
    console.log('🚀 Generating topic manifests...');
    
    try {
      for (const [topicId, topicConfig] of Object.entries(this.topics)) {
        await this.generateTopicManifest(topicId, topicConfig);
      }
      
      // Generate master topics index
      await this.generateMasterIndex();
      
      console.log('✅ All topic manifests generated successfully!');
      
    } catch (error) {
      console.error('❌ Manifest generation failed:', error);
      throw error;
    }
  }

  async generateTopicManifest(topicId, config) {
    console.log(`  📋 Generating manifest for: ${config.name}`);
    
    // Get all card files for this topic
    const cardFiles = await this.getTopicFiles(topicId, 'cards');
    const noteFiles = await this.getTopicFiles(topicId, 'notes');
    const quizFiles = await this.getTopicFiles(topicId, 'quizzes');
    
    const manifest = {
      metadata: {
        topicId: topicId,
        name: config.name,
        description: config.description,
        difficulty: config.difficulty,
        estimatedHours: config.estimatedHours,
        prerequisites: config.prerequisites,
        tags: [topicId, config.difficulty],
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      structure: {
        totalFiles: cardFiles.length + noteFiles.length + quizFiles.length,
        cardFiles: cardFiles.length,
        noteFiles: noteFiles.length,
        quizFiles: quizFiles.length,
        days: config.days
      },
      files: {
        cards: cardFiles.map(file => ({
          fileId: path.basename(file, '.json'),
          path: `learn/cards/${topicId}/${path.basename(file)}`,
          day: this.extractDayFromFilename(file),
          estimatedCards: 2 // Average cards per file
        })),
        notes: noteFiles.map(file => ({
          fileId: path.basename(file, '.json'),
          path: `explore/javascript-notes/${path.basename(file)}`,
          day: this.extractDayFromFilename(file)
        })),
        quizzes: quizFiles.map(file => ({
          fileId: path.basename(file, '.json'),
          path: `explore/practice-quiz/${path.basename(file)}`,
          day: this.extractDayFromFilename(file)
        }))
      },
      progression: {
        unlockCriteria: {
          type: 'sequential',
          requiresPrevious: config.prerequisites.length > 0
        },
        rewards: {
          completionXP: config.estimatedHours * 50,
          masteryBadge: `${topicId}-master`,
          nextUnlock: this.getNextTopic(topicId)
        }
      },
      analytics: {
        averageCompletionTime: `${config.estimatedHours} hours`,
        difficultyRating: this.getDifficultyRating(config.difficulty),
        popularityScore: 85 // Default score
      }
    };
    
    const manifestPath = path.join(this.dataDir, 'learn', 'topics', `${topicId}.json`);
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }

  async generateMasterIndex() {
    console.log('  📚 Generating master topics index...');
    
    const masterIndex = {
      metadata: {
        title: 'JavaScript Learning Path',
        description: 'Complete 30-day JavaScript learning journey',
        totalTopics: Object.keys(this.topics).length,
        totalDays: 30,
        estimatedHours: Object.values(this.topics).reduce((sum, topic) => sum + topic.estimatedHours, 0),
        version: '1.0.0',
        createdAt: new Date().toISOString()
      },
      learningPath: Object.entries(this.topics).map(([topicId, config], index) => ({
        order: index + 1,
        topicId: topicId,
        name: config.name,
        description: config.description,
        difficulty: config.difficulty,
        estimatedHours: config.estimatedHours,
        prerequisites: config.prerequisites,
        days: config.days,
        manifestPath: `learn/topics/${topicId}.json`
      })),
      statistics: {
        beginnerTopics: Object.values(this.topics).filter(t => t.difficulty === 'beginner').length,
        intermediateTopics: Object.values(this.topics).filter(t => t.difficulty === 'intermediate').length,
        advancedTopics: Object.values(this.topics).filter(t => t.difficulty === 'advanced').length,
        totalFiles: await this.countTotalFiles()
      }
    };
    
    const indexPath = path.join(this.dataDir, 'learn', 'topics', 'index.json');
    await fs.writeFile(indexPath, JSON.stringify(masterIndex, null, 2));
  }

  async getTopicFiles(topicId, type) {
    const typeMap = {
      cards: path.join(this.dataDir, 'learn', 'cards', topicId),
      notes: path.join(this.dataDir, 'explore', 'javascript-notes'),
      quizzes: path.join(this.dataDir, 'explore', 'practice-quiz')
    };
    
    const dir = typeMap[type];
    
    try {
      const files = await fs.readdir(dir);
      return files
        .filter(file => {
          if (type === 'cards') {
            return file.endsWith('.json') && file.startsWith(topicId);
          } else {
            return file.endsWith('.json') && file.includes(topicId);
          }
        })
        .sort();
    } catch (error) {
      console.warn(`Could not read ${type} directory for ${topicId}:`, error.message);
      return [];
    }
  }

  extractDayFromFilename(filename) {
    const match = filename.match(/(\d+)/g);
    return match ? parseInt(match[match.length - 1]) : 1;
  }

  getNextTopic(currentTopicId) {
    const topicIds = Object.keys(this.topics);
    const currentIndex = topicIds.indexOf(currentTopicId);
    return currentIndex < topicIds.length - 1 ? topicIds[currentIndex + 1] : null;
  }

  getDifficultyRating(difficulty) {
    const ratings = {
      beginner: 2,
      intermediate: 4,
      advanced: 5
    };
    return ratings[difficulty] || 3;
  }

  async countTotalFiles() {
    let total = 0;
    
    try {
      // Count card files
      const cardDirs = ['fundamentals', 'data-structures', 'control-flow', 'functions', 'objects', 'dom', 'projects'];
      for (const dir of cardDirs) {
        try {
          const files = await fs.readdir(path.join(this.dataDir, 'learn', 'cards', dir));
          total += files.filter(f => f.endsWith('.json')).length;
        } catch (e) { /* ignore */ }
      }
      
      // Count note files
      try {
        const noteFiles = await fs.readdir(path.join(this.dataDir, 'explore', 'javascript-notes'));
        total += noteFiles.filter(f => f.endsWith('.json')).length;
      } catch (e) { /* ignore */ }
      
      // Count quiz files
      try {
        const quizFiles = await fs.readdir(path.join(this.dataDir, 'explore', 'practice-quiz'));
        total += quizFiles.filter(f => f.endsWith('.json')).length;
      } catch (e) { /* ignore */ }
      
    } catch (error) {
      console.warn('Could not count total files:', error.message);
    }
    
    return total;
  }
}

// Run the manifest generator
if (require.main === module) {
  const generator = new TopicManifestGenerator();
  generator.generateAllManifests()
    .then(() => {
      console.log('\n🎉 Topic manifests generated successfully!');
      console.log('\n📋 Generated files:');
      console.log('   - /data/learn/topics/fundamentals.json');
      console.log('   - /data/learn/topics/data-structures.json');
      console.log('   - /data/learn/topics/control-flow.json');
      console.log('   - /data/learn/topics/functions.json');
      console.log('   - /data/learn/topics/objects.json');
      console.log('   - /data/learn/topics/dom.json');
      console.log('   - /data/learn/topics/projects.json');
      console.log('   - /data/learn/topics/index.json (master index)');
      console.log('\n📊 Your app can now use the multi-file structure!');
    })
    .catch(error => {
      console.error('\n❌ Generation failed:', error);
      process.exit(1);
    });
}

module.exports = { TopicManifestGenerator };