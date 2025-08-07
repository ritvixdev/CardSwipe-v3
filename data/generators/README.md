# Content Generation Scripts

This directory contains scripts for generating learning content from knowledge files with duplicate prevention and validation.

## Quick Start

### Generate All Content (Recommended)
```bash
# Complete workflow with validation
node generateContentWorkflow.js

# Clean start (removes existing content first)
node generateContentWorkflow.js --clean

# Skip validation for faster generation
node generateContentWorkflow.js --skip-validation
```

### Individual Scripts

1. **Generate Base Content**
   ```bash
   node runContentGenerator.js
   ```
   - Converts markdown files to JSON cards, notes, and quizzes
   - Prevents duplicates by checking existing files
   - Organizes content by topic and difficulty

2. **Generate Topic Manifests**
   ```bash
   node generateTopicManifests.js
   ```
   - Creates topic structure and metadata
   - Generates master index for navigation
   - Sets up progressive loading paths

3. **Validate Content**
   ```bash
   node validateAndTest.js
   ```
   - Checks directory structure
   - Validates content consistency
   - Detects duplicates
   - Tests multi-file loading

4. **View Summary**
   ```bash
   node contentSummary.js
   ```
   - Shows generation statistics
   - Provides usage instructions
   - Displays file structure

## Duplicate Prevention

### Automatic Prevention
- ✅ File-level: Skips if output file exists
- ✅ Content-level: Compares content hashes
- ✅ ID-level: Generates unique identifiers
- ✅ Validation: Detects duplicates after generation

### Manual Duplicate Check
```bash
# Check for duplicates only
node generateContentWorkflow.js --check-duplicates
```

## File Structure

### Input (Knowledge Files)
```
knowledge/javascript-in-30-days/
├── day-01-introduction.md
├── day-02-variables.md
├── day-03-data-types.md
└── ...
```

### Output (Generated Content)
```
data/
├── learn/
│   ├── cards/           # Learning cards by topic
│   │   ├── fundamentals/
│   │   ├── data-structures/
│   │   └── ...
│   └── topics/          # Topic manifests
│       ├── index.json   # Master index
│       ├── fundamentals.json
│       └── ...
└── explore/
    ├── javascript-notes/  # Study notes
    └── practice-quiz/     # Practice quizzes
```

## Content Types Generated

### Learning Cards
- **Format**: JSON with metadata, content, code examples
- **Organization**: By topic and difficulty
- **Features**: Progressive learning, prerequisites

### Study Notes
- **Format**: Comprehensive explanations
- **Content**: Key concepts, examples, summaries
- **Usage**: Reference material for topics

### Practice Quizzes
- **Format**: Multiple choice questions
- **Features**: Explanations, difficulty levels
- **Usage**: Knowledge testing and reinforcement

## Usage in App

```javascript
// Import the multi-file loader
import { multiFileLoader } from '../data/processors/multiFileLoader';

// Load complete topic
const cards = await multiFileLoader.loadCompleteTopic('fundamentals', 'cards');

// Progressive loading by day
const day2Cards = await multiFileLoader.loadTopicPart('fundamentals', 2, 'cards');

// Load explore content
const notes = await multiFileLoader.loadCompleteTopic('fundamentals', 'notes');
const quizzes = await multiFileLoader.loadCompleteTopic('fundamentals', 'quizzes');
```

## Troubleshooting

### Common Issues

1. **No markdown files found**
   - Check `knowledge/javascript-in-30-days/` directory
   - Ensure files follow naming convention: `day-XX-topic.md`

2. **Generation fails**
   - Verify Node.js version (14+ required)
   - Check file permissions
   - Review markdown file formatting

3. **Duplicates detected**
   - Run with `--clean` flag to start fresh
   - Check for duplicate day numbers in knowledge files
   - Review content for similar titles

4. **Validation errors**
   - Check generated JSON file structure
   - Verify required fields are present
   - Review content length requirements

### Debug Commands

```bash
# Verbose validation
node validateAndTest.js --verbose

# Check specific content
cat data/learn/cards/fundamentals/fundamentals-001.json

# List generated files
find data -name "*.json" | wc -l
```

## Configuration

### Content Rules
- **Cards**: 100-500 words, require code examples
- **Notes**: 200+ words, include key points
- **Quizzes**: 4+ options, require explanations

### Topic Structure
- **Beginner**: Days 1-12 (Fundamentals)
- **Intermediate**: Days 13-27 (Advanced concepts)
- **Advanced**: Days 28-30 (Projects)

## Scripts Overview

| Script | Purpose | Prevents Duplicates | Validation |
|--------|---------|-------------------|------------|
| `generateContentWorkflow.js` | Complete workflow | ✅ | ✅ |
| `runContentGenerator.js` | Base content generation | ✅ | ❌ |
| `generateTopicManifests.js` | Topic structure | ✅ | ❌ |
| `validateAndTest.js` | Content validation | ❌ | ✅ |
| `contentSummary.js` | Statistics and usage | ❌ | ❌ |

## Best Practices

1. **Before Generation**
   - Review knowledge files for completeness
   - Check markdown formatting consistency
   - Ensure unique day numbering

2. **During Generation**
   - Monitor console output for warnings
   - Check for duplicate detection messages
   - Verify file creation in output directories

3. **After Generation**
   - Run validation script
   - Review content samples
   - Test integration with app

4. **Maintenance**
   - Regular duplicate checks
   - Content quality reviews
   - Performance monitoring

---

**For detailed documentation, see:** `docs/content-generation-guide.md`