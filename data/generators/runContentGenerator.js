#!/usr/bin/env node

// ============================================================================
// CONTENT GENERATOR RUNNER
// ============================================================================
// This script runs the content generator to process knowledge files

const fs = require('fs').promises;
const path = require('path');

// Simple content generator that processes markdown files
class SimpleContentGenerator {
  constructor() {
    this.knowledgeDir = path.join(__dirname, '../../knowledge/javascript-in-30-days');
    this.outputDir = path.join(__dirname, '../../data');
  }

  async generateFromKnowledge() {
    console.log('🚀 Starting content generation from knowledge base...');
    
    try {
      // Ensure output directories exist
      await this.createDirectories();
      
      // Get all markdown files
      const mdFiles = await this.getMarkdownFiles();
      console.log(`📚 Found ${mdFiles.length} knowledge files to process`);
      
      let totalCards = 0;
      let totalNotes = 0;
      let totalQuizzes = 0;
      
      // Process each markdown file
      for (const mdFile of mdFiles) {
        const result = await this.processMarkdownFile(mdFile);
        totalCards += result.cards;
        totalNotes += result.notes;
        totalQuizzes += result.quizzes;
      }
      
      console.log('\n✅ Content generation completed successfully!');
      console.log(`📊 Generated: ${totalCards} cards, ${totalNotes} notes, ${totalQuizzes} quizzes`);
      console.log('\n📂 Generated files in:');
      console.log('   /data/learn/cards/');
      console.log('   /data/explore/javascript-notes/');
      console.log('   /data/explore/practice-quiz/');
      
    } catch (error) {
      console.error('❌ Content generation failed:', error);
      throw error;
    }
  }

  async createDirectories() {
    const dirs = [
      'data/learn/cards/fundamentals',
      'data/learn/cards/data-structures',
      'data/learn/cards/control-flow',
      'data/learn/cards/functions',
      'data/learn/cards/objects',
      'data/learn/cards/advanced',
      'data/learn/cards/dom',
      'data/learn/cards/projects',
      'data/learn/topics',
      'data/explore/javascript-notes',
      'data/explore/practice-quiz',
      'data/explore/interview-prep',
      'data/explore/coding-questions'
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async getMarkdownFiles() {
    try {
      const files = await fs.readdir(this.knowledgeDir);
      return files
        .filter(file => file.endsWith('.md'))
        .sort()
        .map(file => path.join(this.knowledgeDir, file));
    } catch (error) {
      console.warn(`Could not read knowledge directory: ${error.message}`);
      return [];
    }
  }

  async processMarkdownFile(filePath) {
    const filename = path.basename(filePath);
    console.log(`  📖 Processing: ${filename}`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const dayMatch = filename.match(/(\d+)_day/);
      const day = dayMatch ? parseInt(dayMatch[1]) : 1;
      
      // Extract title and topic
      const titleMatch = content.match(/# 📔 Day \d+[\s\S]*?## (.+)/);
      const title = titleMatch ? titleMatch[1].trim() : filename.replace('.md', '');
      const topic = this.getTopicFromDay(day);
      
      // Generate cards
      const cards = await this.generateCards(content, topic, day, title);
      
      // Generate notes
      const notes = await this.generateNotes(content, topic, day, title);
      
      // Generate quizzes
      const quizzes = await this.generateQuizzes(content, topic, day, title);
      
      return { cards: cards.length, notes: notes.length, quizzes: quizzes.length };
      
    } catch (error) {
      console.warn(`  ⚠️ Failed to process ${filename}:`, error.message);
      return { cards: 0, notes: 0, quizzes: 0 };
    }
  }

  getTopicFromDay(day) {
    if (day <= 5) return 'fundamentals';
    if (day <= 10) return 'data-structures';
    if (day <= 15) return 'control-flow';
    if (day <= 20) return 'functions';
    if (day <= 25) return 'objects';
    if (day <= 27) return 'dom';
    return 'projects';
  }

  async generateCards(content, topic, day, title) {
    const cards = [];
    const sections = this.extractSections(content);
    
    // Generate main concept card
    const mainCard = {
      id: `${topic}-${day.toString().padStart(3, '0')}-001`,
      title: title,
      day: day,
      category: topic,
      difficulty: day <= 10 ? 'beginner' : day <= 20 ? 'intermediate' : 'advanced',
      estimatedTime: '3 min',
      description: this.extractDescription(content),
      content: this.cleanContent(sections[0] || content.substring(0, 500)),
      codeExample: this.extractCodeExample(content),
      keyPoints: this.extractKeyPoints(content),
      quiz: this.generateQuiz(content),
      tags: [topic, `day-${day}`]
    };
    
    cards.push(mainCard);
    
    // Generate additional cards for major sections
    sections.slice(1, 3).forEach((section, index) => {
      if (section.length > 100) {
        cards.push({
          id: `${topic}-${day.toString().padStart(3, '0')}-${(index + 2).toString().padStart(3, '0')}`,
          title: `${title} - Part ${index + 2}`,
          day: day,
          category: topic,
          difficulty: day <= 10 ? 'beginner' : day <= 20 ? 'intermediate' : 'advanced',
          estimatedTime: '2 min',
          description: this.extractDescription(section),
          content: this.cleanContent(section),
          codeExample: this.extractCodeExample(section),
          keyPoints: this.extractKeyPoints(section),
          quiz: this.generateQuiz(section),
          tags: [topic, `day-${day}`]
        });
      }
    });
    
    // Save cards file
    const cardsData = {
      metadata: {
        fileId: `${topic}-${day.toString().padStart(3, '0')}`,
        topic: topic,
        subtopic: title.toLowerCase().replace(/\s+/g, '-'),
        partNumber: 1,
        totalParts: 1,
        cardCount: cards.length,
        difficulty: day <= 10 ? 'beginner' : day <= 20 ? 'intermediate' : 'advanced',
        estimatedTime: `${cards.length * 3} min`,
        prerequisites: day > 1 ? [`day-${day - 1}`] : [],
        tags: [topic, `day-${day}`],
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      cards: cards
    };
    
    const cardsPath = path.join(this.outputDir, 'learn', 'cards', topic, `${topic}-${day.toString().padStart(3, '0')}.json`);
    await fs.writeFile(cardsPath, JSON.stringify(cardsData, null, 2));
    
    return cards;
  }

  async generateNotes(content, topic, day, title) {
    const notes = [{
      id: `${topic}-note-${day.toString().padStart(3, '0')}`,
      title: `${title} - Study Notes`,
      category: topic,
      difficulty: day <= 10 ? 'beginner' : day <= 20 ? 'intermediate' : 'advanced',
      readTime: Math.ceil(content.length / 1000),
      content: this.cleanContent(content.substring(0, 1000)),
      summary: this.extractDescription(content),
      keyPoints: this.extractKeyPoints(content),
      tags: [topic, `day-${day}`, 'notes']
    }];
    
    const notesData = {
      metadata: {
        fileId: `${topic}-notes-${day.toString().padStart(3, '0')}`,
        topic: topic,
        category: 'study-notes',
        noteCount: notes.length,
        difficulty: day <= 10 ? 'beginner' : day <= 20 ? 'intermediate' : 'advanced',
        tags: [topic, `day-${day}`, 'notes'],
        version: '1.0.0',
        createdAt: new Date().toISOString()
      },
      notes: notes
    };
    
    const notesPath = path.join(this.outputDir, 'explore', 'javascript-notes', `${topic}-notes-${day.toString().padStart(3, '0')}.json`);
    await fs.writeFile(notesPath, JSON.stringify(notesData, null, 2));
    
    return notes;
  }

  async generateQuizzes(content, topic, day, title) {
    const quizzes = [{
      id: `${topic}-quiz-${day.toString().padStart(3, '0')}`,
      title: `${title} - Practice Quiz`,
      category: topic,
      difficulty: day <= 10 ? 'easy' : day <= 20 ? 'medium' : 'hard',
      timeLimit: 300,
      passingScore: 70,
      questions: this.generateQuizQuestions(content, topic)
    }];
    
    const quizData = {
      metadata: {
        fileId: `${topic}-quiz-${day.toString().padStart(3, '0')}`,
        topic: topic,
        category: 'practice-quiz',
        quizCount: quizzes.length,
        difficulty: day <= 10 ? 'easy' : day <= 20 ? 'medium' : 'hard',
        tags: [topic, `day-${day}`, 'quiz'],
        version: '1.0.0',
        createdAt: new Date().toISOString()
      },
      quizzes: quizzes
    };
    
    const quizPath = path.join(this.outputDir, 'explore', 'practice-quiz', `${topic}-quiz-${day.toString().padStart(3, '0')}.json`);
    await fs.writeFile(quizPath, JSON.stringify(quizData, null, 2));
    
    return quizzes;
  }

  extractSections(content) {
    const sections = content.split(/\n## /).filter(section => section.length > 50);
    return sections.map(section => section.trim());
  }

  extractDescription(content) {
    const sentences = content.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 0) {
      return sentences[0].trim().substring(0, 150) + '...';
    }
    return content.substring(0, 150) + '...';
  }

  cleanContent(content) {
    return content
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .trim();
  }

  extractCodeExample(content) {
    const codeMatch = content.match(/```[\s\S]*?```/);
    if (codeMatch) {
      return codeMatch[0].replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
    }
    return '';
  }

  extractKeyPoints(content) {
    const points = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        points.push(line.trim().substring(2));
        if (points.length >= 4) break;
      }
    }
    
    return points.length > 0 ? points : [
      'Key concept from this lesson',
      'Important implementation detail',
      'Best practice to remember',
      'Common use case'
    ];
  }

  generateQuiz(content) {
    return {
      question: `What is the main concept covered in this lesson?`,
      options: [
        'Option A',
        'Option B', 
        'Option C',
        'Option D'
      ],
      correctAnswer: 0,
      explanation: 'This covers the main concept discussed in the lesson.'
    };
  }

  generateQuizQuestions(content, topic) {
    return [
      {
        id: 'q1',
        question: `What is the main focus of this ${topic} lesson?`,
        options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
        correctAnswer: 0,
        explanation: 'This lesson focuses on the fundamental concepts.',
        difficulty: 'medium',
        points: 10,
        tags: [topic]
      },
      {
        id: 'q2',
        question: `Which best describes the key principle?`,
        options: ['Principle A', 'Principle B', 'Principle C', 'Principle D'],
        correctAnswer: 1,
        explanation: 'The key principle is essential for understanding.',
        difficulty: 'medium',
        points: 15,
        tags: [topic]
      }
    ];
  }
}

// Run the content generator
if (require.main === module) {
  const generator = new SimpleContentGenerator();
  generator.generateFromKnowledge()
    .then(() => {
      console.log('\n🎉 Knowledge base processing completed!');
      console.log('\n📋 Next Steps:');
      console.log('   1. Check the generated files in /data/learn/cards/');
      console.log('   2. Review the explore content in /data/explore/');
      console.log('   3. Test the multi-file loading in your app');
      console.log('   4. Update topic manifests if needed');
    })
    .catch(error => {
      console.error('\n❌ Generation failed:', error);
      process.exit(1);
    });
}

module.exports = { SimpleContentGenerator };