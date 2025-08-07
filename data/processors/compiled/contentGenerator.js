"use strict";
// ============================================================================
// CONTENT GENERATOR - CONVERTS KNOWLEDGE BASE TO STRUCTURED JSON
// ============================================================================
// This tool parses markdown files from the knowledge folder and generates
// cards, quizzes, and notes in the new multi-file structure
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentGenerator = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// ============================================================================
// CONTENT GENERATOR CLASS
// ============================================================================
class ContentGenerator {
    constructor() {
        this.config = {
            cardsPerFile: 25,
            outputDir: 'E:/DevelopmentPrograms/CardSwipe-v3/data',
            knowledgeDir: 'E:/DevelopmentPrograms/CardSwipe-v3/knowledge/javascript-in-30-days',
            topics: {
                'fundamentals': {
                    name: 'JavaScript Fundamentals',
                    days: [2, 3], // Data types, booleans operators
                    difficulty: 'beginner',
                    subtopics: ['variables', 'datatypes', 'operators', 'booleans']
                },
                'data-structures': {
                    name: 'Data Structures',
                    days: [5, 8, 10], // Arrays, Objects, Sets and Maps
                    difficulty: 'beginner',
                    subtopics: ['arrays', 'objects', 'sets', 'maps']
                },
                'control-flow': {
                    name: 'Control Flow',
                    days: [4, 6], // Conditionals, Loops
                    difficulty: 'beginner',
                    subtopics: ['conditionals', 'loops', 'iteration']
                },
                'functions': {
                    name: 'Functions',
                    days: [7, 9], // Functions, Higher Order Functions
                    difficulty: 'intermediate',
                    subtopics: ['basic-functions', 'arrow-functions', 'higher-order']
                },
                'advanced': {
                    name: 'Advanced Concepts',
                    days: [12, 15, 18, 19], // Regex, Classes, Promises, Closures
                    difficulty: 'advanced',
                    subtopics: ['regex', 'classes', 'promises', 'closures']
                },
                'dom': {
                    name: 'DOM Manipulation',
                    days: [21, 22, 23], // DOM, Manipulating DOM, Event Listeners
                    difficulty: 'intermediate',
                    subtopics: ['dom-basics', 'manipulation', 'events']
                },
                'projects': {
                    name: 'Projects',
                    days: [24, 25, 26, 27, 28, 29, 30], // All project days
                    difficulty: 'advanced',
                    subtopics: ['mini-projects', 'data-visualization', 'portfolio']
                }
            }
        };
    }
    // ============================================================================
    // MAIN GENERATION METHODS
    // ============================================================================
    async generateAllContent() {
        console.log('🚀 Starting content generation from knowledge base...');
        try {
            // Ensure output directories exist
            await this.createDirectories();
            // Generate content for each topic
            for (const [topicId, topicConfig] of Object.entries(this.config.topics)) {
                console.log(`📚 Generating content for: ${topicConfig.name}`);
                await this.generateTopicContent(topicId, topicConfig);
            }
            console.log('✅ Content generation completed successfully!');
        }
        catch (error) {
            console.error('❌ Content generation failed:', error);
            throw error;
        }
    }
    async generateTopicContent(topicId, topicConfig) {
        const allCards = [];
        const allNotes = [];
        const allQuizzes = [];
        // Process each day for this topic
        for (const day of topicConfig.days) {
            try {
                const filePath = path.join(this.config.knowledgeDir, `${day.toString().padStart(2, '0')}_day*.md`);
                const matchingFiles = await this.findMarkdownFiles(day);
                if (matchingFiles.length > 0) {
                    const mdPath = matchingFiles[0];
                    console.log(`  📖 Processing day ${day}: ${path.basename(mdPath)}`);
                    const parsedContent = await this.parseMarkdownFile(mdPath);
                    // Generate cards from parsed content
                    const cards = await this.generateCards(parsedContent, topicId, day);
                    allCards.push(...cards);
                    // Generate notes
                    const notes = await this.generateNotes(parsedContent, topicId);
                    allNotes.push(...notes);
                    // Generate quizzes
                    const quizzes = await this.generateQuizzes(parsedContent, topicId);
                    allQuizzes.push(...quizzes);
                }
            }
            catch (error) {
                console.warn(`  ⚠️ Failed to process day ${day}:`, error);
            }
        }
        // Split content into multiple files and save
        await this.saveContentFiles(topicId, allCards, allNotes, allQuizzes, topicConfig);
    }
    // ============================================================================
    // MARKDOWN PARSING
    // ============================================================================
    async findMarkdownFiles(day) {
        try {
            const files = await fs.readdir(this.config.knowledgeDir);
            const dayPrefix = day.toString().padStart(2, '0') + '_day';
            return files
                .filter(file => file.startsWith(dayPrefix) && file.endsWith('.md'))
                .map(file => path.join(this.config.knowledgeDir, file));
        }
        catch (error) {
            console.warn(`Could not read directory ${this.config.knowledgeDir}:`, error);
            return [];
        }
    }
    async parseMarkdownFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            // Extract day number from filename
            const filename = path.basename(filePath);
            const dayMatch = filename.match(/(\d+)_day/);
            const day = dayMatch ? parseInt(dayMatch[1]) : 1;
            // Extract title
            const titleMatch = content.match(/# 📔 Day \d+[\s\S]*?## (.+)/);
            const title = titleMatch ? titleMatch[1].trim() : filename.replace('.md', '');
            // Parse sections
            const sections = this.parseMarkdownSections(content);
            // Extract code examples
            const codeExamples = this.extractCodeBlocks(content);
            // Extract key points (list items under headings)
            const keyPoints = this.extractKeyPoints(content);
            // Extract exercises section
            const exercises = this.extractExercises(content);
            // Determine main topics from sections
            const mainTopics = sections.map(s => s.title.toLowerCase().replace(/[^a-z0-9]/g, '-'));
            return {
                title,
                day,
                sections,
                exercises,
                mainTopics,
                codeExamples,
                keyPoints
            };
        }
        catch (error) {
            console.error(`Failed to parse markdown file ${filePath}:`, error);
            throw error;
        }
    }
    parseMarkdownSections(content) {
        const sections = [];
        const lines = content.split('\n');
        let currentSection = null;
        let currentContent = [];
        for (const line of lines) {
            const headerMatch = line.match(/^(#{2,4})\s+(.+)/);
            if (headerMatch) {
                // Save previous section
                if (currentSection) {
                    currentSection.content = currentContent.join('\n').trim();
                    sections.push(currentSection);
                }
                // Start new section
                const level = headerMatch[1].length;
                const title = headerMatch[2].trim();
                currentSection = {
                    title,
                    level,
                    content: '',
                    codeBlocks: [],
                    examples: []
                };
                currentContent = [];
            }
            else if (currentSection) {
                currentContent.push(line);
                // Collect code blocks in this section
                if (line.trim().startsWith('```')) {
                    const codeBlock = this.extractCodeBlockFromLine(lines, lines.indexOf(line));
                    if (codeBlock) {
                        currentSection.codeBlocks.push(codeBlock);
                    }
                }
            }
        }
        // Save last section
        if (currentSection && currentContent.length > 0) {
            currentSection.content = currentContent.join('\n').trim();
            sections.push(currentSection);
        }
        return sections;
    }
    extractCodeBlocks(content) {
        const codeBlockRegex = /```(?:js|javascript)?\n([\s\S]*?)\n```/g;
        const codeBlocks = [];
        let match;
        while ((match = codeBlockRegex.exec(content)) !== null) {
            const code = match[1].trim();
            if (code && code.length > 10) { // Only meaningful code blocks
                codeBlocks.push(code);
            }
        }
        return codeBlocks;
    }
    extractCodeBlockFromLine(lines, startIndex) {
        let endIndex = -1;
        for (let i = startIndex + 1; i < lines.length; i++) {
            if (lines[i].trim().startsWith('```')) {
                endIndex = i;
                break;
            }
        }
        if (endIndex > startIndex) {
            return lines.slice(startIndex + 1, endIndex).join('\n').trim();
        }
        return null;
    }
    extractKeyPoints(content) {
        const keyPoints = [];
        const lines = content.split('\n');
        for (const line of lines) {
            // Look for numbered lists and bullet points
            const listMatch = line.match(/^\s*(?:\d+\.|\*|-|\+)\s+(.+)/);
            if (listMatch) {
                const point = listMatch[1].trim();
                if (point.length > 10 && !point.includes('http')) { // Filter out links
                    keyPoints.push(point);
                }
            }
        }
        // Remove duplicates and limit to most relevant points
        return [...new Set(keyPoints)].slice(0, 8);
    }
    extractExercises(content) {
        const exerciseSection = content.match(/## 💻.*?Exercises.*?\n([\s\S]*?)(?=\n##|$)/i);
        if (exerciseSection) {
            const exerciseText = exerciseSection[1];
            return exerciseText.split('\n')
                .filter(line => line.trim().match(/^\d+\./) || line.trim().match(/^[-*+]/))
                .map(line => line.trim().replace(/^\d+\.\s*/, '').replace(/^[-*+]\s*/, ''))
                .filter(line => line.length > 10);
        }
        return [];
    }
    // ============================================================================
    // CONTENT GENERATION
    // ============================================================================
    async generateCards(parsed, topicId, day) {
        const cards = [];
        // Generate cards from major sections
        for (let i = 0; i < parsed.sections.length; i++) {
            const section = parsed.sections[i];
            // Skip very small sections
            if (section.content.length < 50)
                continue;
            // Generate main concept card
            const cardId = `${topicId}-day${day}-${i + 1}`;
            const card = {
                id: cardId,
                title: section.title,
                day: day,
                category: topicId,
                difficulty: this.determineDifficulty(section.content, day),
                estimatedTime: this.estimateReadingTime(section.content),
                description: this.generateDescription(section.content),
                content: this.cleanMarkdownContent(section.content),
                codeExample: section.codeBlocks[0] || parsed.codeExamples[i] || undefined,
                keyPoints: this.extractSectionKeyPoints(section.content),
                quiz: this.generateQuiz(section),
                tags: this.generateTags(section.title, topicId),
                isCompleted: false,
                isBookmarked: false
            };
            cards.push(card);
            // Generate additional cards for code examples
            if (section.codeBlocks.length > 1) {
                for (let j = 1; j < Math.min(section.codeBlocks.length, 3); j++) {
                    const exampleCard = {
                        id: `${cardId}-example-${j}`,
                        title: `${section.title} - Example ${j}`,
                        day: day,
                        category: topicId,
                        difficulty: card.difficulty,
                        estimatedTime: '1 min',
                        description: `Practical example of ${section.title.toLowerCase()}`,
                        content: `Here's another example of ${section.title.toLowerCase()}:\n\n${section.codeBlocks[j]}`,
                        codeExample: section.codeBlocks[j],
                        keyPoints: [`Example of ${section.title.toLowerCase()}`, 'Practical implementation', 'Code demonstration'],
                        quiz: {
                            question: `What does this code example demonstrate?`,
                            options: [
                                section.title,
                                'Variable declaration',
                                'Function syntax',
                                'Loop structure'
                            ],
                            correctAnswer: 0,
                            explanation: `This example demonstrates ${section.title.toLowerCase()}.`
                        },
                        tags: [...card.tags, 'example', 'code'],
                        isCompleted: false,
                        isBookmarked: false
                    };
                    cards.push(exampleCard);
                }
            }
        }
        return cards.slice(0, 20); // Limit per day
    }
    async generateNotes(parsed, topicId) {
        const notes = [];
        // Create comprehensive notes from major sections
        for (let i = 0; i < parsed.sections.length; i++) {
            const section = parsed.sections[i];
            if (section.content.length < 100)
                continue;
            const note = {
                id: `${topicId}-note-${parsed.day}-${i + 1}`,
                title: `${parsed.title}: ${section.title}`,
                category: topicId,
                difficulty: this.determineDifficulty(section.content, parsed.day),
                readTime: Math.ceil(section.content.length / 200), // ~200 words per minute
                content: this.cleanMarkdownContent(section.content),
                codeExample: section.codeBlocks[0],
                keyPoints: this.extractSectionKeyPoints(section.content),
                tags: this.generateTags(section.title, topicId)
            };
            notes.push(note);
        }
        return notes;
    }
    async generateQuizzes(parsed, topicId) {
        const quizzes = [];
        // Create quiz from exercises and main concepts
        const questions = [];
        // Generate questions from key sections
        for (const section of parsed.sections.slice(0, 5)) {
            if (section.content.length < 50)
                continue;
            const question = {
                id: `q-${topicId}-${parsed.day}-${questions.length + 1}`,
                question: `What is the main concept of ${section.title.toLowerCase()}?`,
                options: [
                    section.title,
                    'Variable declaration',
                    'Function definition',
                    'Loop structure'
                ],
                correctAnswer: 0,
                explanation: `${section.title} is the main concept being discussed.`,
                codeSnippet: section.codeBlocks[0]
            };
            questions.push(question);
        }
        if (questions.length > 0) {
            const quiz = {
                id: `quiz-${topicId}-day-${parsed.day}`,
                title: `${parsed.title} - Knowledge Check`,
                category: topicId,
                difficulty: this.determineDifficulty(parsed.sections[0]?.content || '', parsed.day),
                timeLimit: Math.max(5, questions.length * 2),
                passingScore: 70,
                description: `Test your understanding of ${parsed.title.toLowerCase()}`,
                questions: questions.slice(0, 5) // Limit questions per quiz
            };
            quizzes.push(quiz);
        }
        return quizzes;
    }
    // ============================================================================
    // UTILITY METHODS
    // ============================================================================
    determineDifficulty(content, day) {
        if (day <= 10)
            return 'beginner';
        if (day <= 20)
            return 'intermediate';
        return 'advanced';
    }
    estimateReadingTime(content) {
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / 200); // 200 words per minute
        return `${Math.max(1, minutes)} min`;
    }
    generateDescription(content) {
        // Take first meaningful sentence
        const sentences = content.match(/[^\.!?]+[\.!?]+/g);
        if (sentences && sentences[0]) {
            return sentences[0].trim().substring(0, 150) + '...';
        }
        return content.substring(0, 150) + '...';
    }
    cleanMarkdownContent(content) {
        return content
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
            .replace(/\[.*?\]\(.*?\)/g, '$1') // Convert links to text
            .replace(/#+ /g, '') // Remove headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .trim();
    }
    extractSectionKeyPoints(content) {
        const points = content.match(/^\s*[-*+]\s+(.+)/gm);
        if (points) {
            return points
                .map(point => point.replace(/^\s*[-*+]\s+/, '').trim())
                .filter(point => point.length > 5 && point.length < 100)
                .slice(0, 5);
        }
        // Fallback: Extract first few sentences
        const sentences = content.match(/[^\.!?]+[\.!?]+/g);
        return sentences ? sentences.slice(0, 3).map(s => s.trim()) : ['Key concept covered'];
    }
    generateTags(title, topicId) {
        const tags = [topicId];
        // Add tags based on title keywords
        const titleLower = title.toLowerCase();
        const keywords = ['array', 'object', 'function', 'loop', 'variable', 'string', 'number', 'boolean', 'promise', 'async'];
        keywords.forEach(keyword => {
            if (titleLower.includes(keyword)) {
                tags.push(keyword);
            }
        });
        return [...new Set(tags)];
    }
    generateQuiz(section) {
        const options = [
            section.title,
            'Variable declaration',
            'Function syntax',
            'Loop structure'
        ];
        return {
            question: `What is the main topic of this section?`,
            options,
            correctAnswer: 0,
            explanation: `This section covers ${section.title.toLowerCase()}.`
        };
    }
    // ============================================================================
    // FILE OPERATIONS
    // ============================================================================
    async createDirectories() {
        const directories = [
            `${this.config.outputDir}/learn/cards`,
            `${this.config.outputDir}/learn/topics`,
            `${this.config.outputDir}/explore/javascript-notes`,
            `${this.config.outputDir}/explore/practice-quiz`
        ];
        for (const dir of directories) {
            await fs.mkdir(dir, { recursive: true });
        }
        // Create topic subdirectories
        for (const topicId of Object.keys(this.config.topics)) {
            await fs.mkdir(`${this.config.outputDir}/learn/cards/${topicId}`, { recursive: true });
        }
    }
    async saveContentFiles(topicId, cards, notes, quizzes, topicConfig) {
        // Split cards into multiple files
        const cardChunks = this.chunkArray(cards, this.config.cardsPerFile);
        for (let i = 0; i < cardChunks.length; i++) {
            const chunk = cardChunks[i];
            const partNumber = i + 1;
            const fileId = `${topicId}-${partNumber.toString().padStart(3, '0')}`;
            const cardFileData = {
                metadata: {
                    fileId,
                    topic: topicId,
                    subtopic: topicConfig.subtopics[0] || 'general',
                    partNumber,
                    totalParts: cardChunks.length,
                    cardCount: chunk.length,
                    difficulty: topicConfig.difficulty,
                    estimatedTime: `${chunk.length * 2} min`,
                    prerequisites: [],
                    tags: [topicId, ...topicConfig.subtopics],
                    version: '1.0.0',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                cards: chunk
            };
            const cardFilePath = `${this.config.outputDir}/learn/cards/${topicId}/${fileId}.json`;
            await fs.writeFile(cardFilePath, JSON.stringify(cardFileData, null, 2));
            console.log(`  ✅ Created: ${fileId}.json (${chunk.length} cards)`);
        }
        // Save notes and quizzes
        if (notes.length > 0) {
            const notesFileData = {
                metadata: {
                    fileId: `${topicId}-notes-001`,
                    topic: topicId,
                    subtopic: 'notes',
                    partNumber: 1,
                    totalParts: 1,
                    noteCount: notes.length,
                    difficulty: topicConfig.difficulty,
                    prerequisites: [],
                    tags: [topicId, 'notes'],
                    version: '1.0.0',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                notes
            };
            await fs.writeFile(`${this.config.outputDir}/explore/javascript-notes/${topicId}-notes-001.json`, JSON.stringify(notesFileData, null, 2));
        }
        if (quizzes.length > 0) {
            const quizFileData = {
                metadata: {
                    fileId: `${topicId}-quiz-001`,
                    topic: topicId,
                    subtopic: 'quiz',
                    partNumber: 1,
                    totalParts: 1,
                    difficulty: topicConfig.difficulty,
                    prerequisites: [],
                    tags: [topicId, 'quiz'],
                    version: '1.0.0',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                quizzes
            };
            await fs.writeFile(`${this.config.outputDir}/explore/practice-quiz/${topicId}-quiz-001.json`, JSON.stringify(quizFileData, null, 2));
        }
        // Create topic manifest
        await this.createTopicManifest(topicId, topicConfig, cardChunks.length);
    }
    async createTopicManifest(topicId, topicConfig, totalFiles) {
        const manifest = {
            topicId,
            name: topicConfig.name,
            description: `Learn ${topicConfig.name.toLowerCase()} concepts`,
            totalFiles,
            totalCards: totalFiles * this.config.cardsPerFile,
            difficulty: topicConfig.difficulty,
            estimatedHours: Math.ceil((totalFiles * this.config.cardsPerFile * 2) / 60),
            files: Array.from({ length: totalFiles }, (_, i) => ({
                fileId: `${topicId}-${(i + 1).toString().padStart(3, '0')}`,
                path: `/data/learn/cards/${topicId}/${topicId}-${(i + 1).toString().padStart(3, '0')}.json`,
                subtopic: topicConfig.subtopics[i] || 'general',
                cardCount: this.config.cardsPerFile,
                difficulty: topicConfig.difficulty
            })),
            prerequisites: [],
            tags: [topicId, ...topicConfig.subtopics],
            version: '1.0.0',
            updatedAt: new Date().toISOString()
        };
        await fs.writeFile(`${this.config.outputDir}/learn/topics/${topicId}.json`, JSON.stringify(manifest, null, 2));
    }
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
}
// ============================================================================
// EXPORT AND USAGE
// ============================================================================
exports.contentGenerator = new ContentGenerator();
// CLI Usage
if (require.main === module) {
    exports.contentGenerator.generateAllContent()
        .then(() => {
        console.log('🎉 Content generation completed successfully!');
        process.exit(0);
    })
        .catch(error => {
        console.error('❌ Content generation failed:', error);
        process.exit(1);
    });
}
exports.default = exports.contentGenerator;
