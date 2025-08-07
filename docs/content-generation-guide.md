# Content Generation Guide

This guide explains how to generate learning cards and quizzes from knowledge files while avoiding duplicates and maintaining data integrity.

## Overview

The content generation system transforms markdown files from the `knowledge/` directory into structured JSON files for cards, notes, and quizzes. The system includes duplicate prevention and validation mechanisms.

## Directory Structure

```
CardSwipe-v3/
├── knowledge/                    # Source markdown files
│   └── javascript-in-30-days/   # Topic-specific knowledge
├── data/
│   ├── generators/               # Generation scripts
│   ├── learn/                   # Generated learning content
│   │   ├── cards/              # Learning cards by topic
│   │   └── topics/             # Topic manifests
│   └── explore/                # Generated explore content
│       ├── javascript-notes/   # Study notes
│       └── practice-quiz/      # Practice quizzes
```

## Step-by-Step Generation Process

### Step 1: Prepare Knowledge Files

1. **Organize Knowledge Files**
   ```
   knowledge/javascript-in-30-days/
   ├── day-01-introduction.md
   ├── day-02-variables.md
   ├── day-03-data-types.md
   └── ...
   ```

2. **Markdown File Format**
   Each file should follow this structure:
   ```markdown
   # Topic Title
   
   ## Introduction
   Brief overview of the topic...
   
   ## Key Concepts
   - Concept 1
   - Concept 2
   
   ## Code Examples
   ```javascript
   // Example code
   ```
   
   ## Summary
   Key takeaways...
   ```

### Step 2: Run Content Generation

1. **Generate Base Content**
   ```bash
   node data/generators/runContentGenerator.js
   ```
   
   This script:
   - Reads all markdown files from `knowledge/javascript-in-30-days/`
   - Extracts content, code examples, and key points
   - Generates JSON files for cards, notes, and quizzes
   - Organizes content by topic and difficulty
   - **Prevents duplicates** by checking existing files

2. **Generate Topic Manifests**
   ```bash
   node data/generators/generateTopicManifests.js
   ```
   
   This creates:
   - Individual topic manifest files
   - Master index with learning path
   - Metadata for progressive loading

3. **Validate Content**
   ```bash
   node data/generators/validateAndTest.js
   ```
   
   This performs:
   - Directory structure validation
   - Content consistency checks
   - Duplicate detection
   - Multi-file loading tests

4. **View Summary**
   ```bash
   node data/generators/contentSummary.js
   ```

## Duplicate Prevention Mechanisms

### 1. File-Level Duplicate Prevention

```javascript
// In runContentGenerator.js
async generateContent() {
  // Check if output file already exists
  const outputPath = path.join(this.outputDir, `${topicId}.json`);
  
  try {
    await fs.access(outputPath);
    console.log(`⚠️ File ${topicId}.json already exists, skipping...`);
    return; // Skip if file exists
  } catch (error) {
    // File doesn't exist, proceed with generation
  }
}
```

### 2. Content-Level Duplicate Detection

```javascript
// Check for duplicate content by comparing titles and content hashes
const existingContent = await this.loadExistingContent(topicId);
const contentHash = this.generateContentHash(newContent);

if (existingContent.some(item => item.contentHash === contentHash)) {
  console.log(`⚠️ Duplicate content detected for ${title}, skipping...`);
  return;
}
```

### 3. ID-Based Duplicate Prevention

```javascript
// Generate unique IDs based on content and timestamp
const generateUniqueId = (title, day, timestamp) => {
  const baseId = title.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${baseId}-${String(day).padStart(3, '0')}-${timestamp}`;
};
```

## Content Generation Configuration

### 1. Topic Configuration

```javascript
// In generateTopicManifests.js
const topics = [
  {
    id: 'fundamentals',
    name: 'JavaScript Fundamentals',
    difficulty: 'beginner',
    days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    estimatedHours: 24,
    prerequisites: []
  },
  // ... more topics
];
```

### 2. Generation Rules

```javascript
// Content generation rules
const generationRules = {
  cards: {
    maxPerFile: 10,
    minContentLength: 100,
    requireCodeExample: true
  },
  notes: {
    maxPerFile: 1,
    minContentLength: 200,
    includeKeyPoints: true
  },
  quizzes: {
    questionsPerFile: 1,
    minOptions: 4,
    requireExplanation: true
  }
};
```

## Managing Updates and Regeneration

### 1. Incremental Updates

```bash
# To update specific topics without duplicating
node data/generators/runContentGenerator.js --topic=fundamentals --force-update
```

### 2. Clean Regeneration

```bash
# Remove existing generated content
rm -rf data/learn/cards/*
rm -rf data/explore/*

# Regenerate all content
node data/generators/runContentGenerator.js
node data/generators/generateTopicManifests.js
```

### 3. Selective Regeneration

```javascript
// In runContentGenerator.js - add selective regeneration
const regenerateSpecificContent = async (contentType, topicId) => {
  const outputPath = path.join(this.outputDir, contentType, `${topicId}.json`);
  
  // Remove existing file
  try {
    await fs.unlink(outputPath);
    console.log(`🗑️ Removed existing ${contentType}/${topicId}.json`);
  } catch (error) {
    // File doesn't exist, continue
  }
  
  // Regenerate content
  await this.generateTopicContent(topicId);
};
```

## Validation and Quality Assurance

### 1. Content Validation Rules

```javascript
// Validation checks performed
const validationChecks = {
  structure: {
    requiredFields: ['id', 'title', 'content', 'metadata'],
    optionalFields: ['codeExample', 'keyPoints', 'quiz']
  },
  content: {
    minLength: 50,
    maxLength: 2000,
    requiresCodeExample: true
  },
  metadata: {
    requiredFields: ['topic', 'difficulty', 'day', 'estimatedTime'],
    validDifficulties: ['beginner', 'intermediate', 'advanced']
  }
};
```

### 2. Duplicate Detection Algorithm

```javascript
const detectDuplicates = (contentArray) => {
  const seen = new Set();
  const duplicates = [];
  
  for (const item of contentArray) {
    const signature = `${item.title}-${item.topic}-${item.day}`;
    
    if (seen.has(signature)) {
      duplicates.push(item);
    } else {
      seen.add(signature);
    }
  }
  
  return duplicates;
};
```

## Best Practices

### 1. Before Generation
- ✅ Review knowledge files for completeness
- ✅ Check for consistent markdown formatting
- ✅ Ensure unique day numbering
- ✅ Validate code examples syntax

### 2. During Generation
- ✅ Monitor console output for warnings
- ✅ Check for duplicate detection messages
- ✅ Verify file creation in output directories
- ✅ Review generated content samples

### 3. After Generation
- ✅ Run validation script
- ✅ Check content summary statistics
- ✅ Test multi-file loading
- ✅ Verify no duplicates in final output

### 4. Content Quality Guidelines
- ✅ Each card should have 100-500 words
- ✅ Include practical code examples
- ✅ Provide clear explanations
- ✅ Add relevant quiz questions
- ✅ Use consistent difficulty progression

## Troubleshooting

### Common Issues

1. **Duplicate Content Generated**
   ```bash
   # Check for duplicates
   node data/generators/validateAndTest.js
   
   # Clean and regenerate
   rm -rf data/learn/cards/* data/explore/*
   node data/generators/runContentGenerator.js
   ```

2. **Missing Knowledge Files**
   ```bash
   # Verify knowledge directory structure
   ls -la knowledge/javascript-in-30-days/
   
   # Check file naming convention
   # Should be: day-XX-topic-name.md
   ```

3. **Generation Errors**
   ```bash
   # Check Node.js version (requires 14+)
   node --version
   
   # Verify file permissions
   chmod +x data/generators/*.js
   ```

4. **Content Validation Failures**
   ```bash
   # Run detailed validation
   node data/generators/validateAndTest.js --verbose
   
   # Check specific content files
   cat data/learn/cards/fundamentals/fundamentals-001.json
   ```

## Integration with App

After generation, integrate with your app:

```javascript
// Load generated content
import { multiFileLoader } from '../data/processors/multiFileLoader';

// Load complete topic
const cards = await multiFileLoader.loadCompleteTopic('fundamentals', 'cards');

// Load progressive content
const day2Cards = await multiFileLoader.loadTopicPart('fundamentals', 2, 'cards');

// Load explore content
const notes = await multiFileLoader.loadCompleteTopic('fundamentals', 'notes');
const quizzes = await multiFileLoader.loadCompleteTopic('fundamentals', 'quizzes');
```

## Summary

This content generation system provides:
- ✅ Automated conversion from markdown to JSON
- ✅ Duplicate prevention at multiple levels
- ✅ Content validation and quality assurance
- ✅ Progressive loading structure
- ✅ Multi-file organization
- ✅ Comprehensive testing and validation

Follow this guide to generate high-quality, duplicate-free content for your CardSwipe learning app.