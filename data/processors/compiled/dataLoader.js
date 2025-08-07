"use strict";
// Data loader utilities with STRICT lazy loading for memory optimization
// ONLY load config data - NO lesson data at startup
// Enhanced with multi-file support for better content management
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
exports.codingQuestions = exports.designPatterns = exports.topics = void 0;
exports.getCardsByCategory = getCardsByCategory;
exports.getAllCategories = getAllCategories;
exports.getAllLessons = getAllLessons;
exports.getLessonById = getLessonById;
exports.getLessonCategories = getLessonCategories;
exports.getLessonDifficulties = getLessonDifficulties;
exports.initializeTopics = initializeTopics;
exports.clearUnusedModules = clearUnusedModules;
exports.getMemoryStats = getMemoryStats;
exports.getNotes = getNotes;
exports.getNoteCategories = getNoteCategories;
exports.getNotesByCategory = getNotesByCategory;
exports.getLessonsByDifficulty = getLessonsByDifficulty;
exports.getCompletedLessons = getCompletedLessons;
exports.getBookmarkedLessons = getBookmarkedLessons;
exports.searchLessons = searchLessons;
exports.getLessonsByTopic = getLessonsByTopic;
exports.getTopicInfo = getTopicInfo;
exports.getNotesByDifficulty = getNotesByDifficulty;
exports.getNoteById = getNoteById;
exports.searchNotes = searchNotes;
exports.getQuizzes = getQuizzes;
exports.getQuizCategories = getQuizCategories;
exports.getQuizzesByCategory = getQuizzesByCategory;
exports.getQuizzesByDifficulty = getQuizzesByDifficulty;
exports.getQuizById = getQuizById;
exports.getInterviewQuestions = getInterviewQuestions;
exports.getInterviewCategories = getInterviewCategories;
exports.getInterviewQuestionsByCategory = getInterviewQuestionsByCategory;
exports.getInterviewQuestionsByDifficulty = getInterviewQuestionsByDifficulty;
exports.getInterviewQuestionById = getInterviewQuestionById;
exports.searchInterviewQuestions = searchInterviewQuestions;
exports.getInterviewQuizzes = getInterviewQuizzes;
exports.getInterviewQuizCategories = getInterviewQuizCategories;
exports.getInterviewQuizzesByCategory = getInterviewQuizzesByCategory;
exports.getInterviewQuizById = getInterviewQuizById;
exports.getLearningRoadmap = getLearningRoadmap;
exports.getRoadmapNodeById = getRoadmapNodeById;
exports.getNodesByLevel = getNodesByLevel;
exports.getNodesByStatus = getNodesByStatus;
exports.getPrerequisites = getPrerequisites;
exports.getNextNodes = getNextNodes;
exports.getDesignPatterns = getDesignPatterns;
exports.getDesignPatternCategories = getDesignPatternCategories;
exports.getDesignPatternsByCategory = getDesignPatternsByCategory;
exports.getDesignPatternsByDifficulty = getDesignPatternsByDifficulty;
exports.getDesignPatternById = getDesignPatternById;
exports.searchDesignPatterns = searchDesignPatterns;
exports.getCodingQuestions = getCodingQuestions;
exports.getCodingQuestionCategories = getCodingQuestionCategories;
exports.getCodingQuestionDifficulties = getCodingQuestionDifficulties;
exports.getCodingQuestionsByCategory = getCodingQuestionsByCategory;
exports.getCodingQuestionsByDifficulty = getCodingQuestionsByDifficulty;
exports.getCodingQuestionById = getCodingQuestionById;
exports.searchCodingQuestions = searchCodingQuestions;
exports.getRandomItems = getRandomItems;
exports.getItemsByTag = getItemsByTag;
exports.getStats = getStats;
exports.getCardsByTopicEnhanced = getCardsByTopicEnhanced;
exports.getCardsByCategoryEnhanced = getCardsByCategoryEnhanced;
exports.searchLessonsEnhanced = searchLessonsEnhanced;
exports.getAvailableTopicsEnhanced = getAvailableTopicsEnhanced;
exports.getTopicInfoEnhanced = getTopicInfoEnhanced;
exports.getNotesEnhanced = getNotesEnhanced;
exports.getQuizzesEnhanced = getQuizzesEnhanced;
exports.getMultiFileStats = getMultiFileStats;
exports.clearMultiFileCache = clearMultiFileCache;
// import { multiFileLoader } from './multiFileLoader'; // Temporarily disabled due to bundling issues
// Lazy import config only when needed
let configData = null;
async function getConfigData() {
    if (!configData) {
        configData = await Promise.resolve().then(() => __importStar(require('../learn/config.json')));
    }
    return configData;
}
// Lazy loading imports - data loaded on demand
let cachedModules = {};
let loadingPromises = {};
// Lazy load functions for card files
async function loadCardModule(category) {
    const moduleKey = `cards-${category}`;
    if (cachedModules[moduleKey]) {
        return cachedModules[moduleKey];
    }
    if (loadingPromises[moduleKey]) {
        return await loadingPromises[moduleKey];
    }
    const loadPromise = (async () => {
        switch (category.toLowerCase()) {
            case 'fundamentals':
                return await Promise.resolve().then(() => __importStar(require('../learn/cards/fundamentals.json')));
            case 'data-structures':
                return await Promise.resolve().then(() => __importStar(require('../learn/cards/data-structures.json')));
            case 'control-flow':
                return await Promise.resolve().then(() => __importStar(require('../learn/cards/control-flow.json')));
            case 'web-development':
                return await Promise.resolve().then(() => __importStar(require('../learn/cards/web-development.json')));
            case 'asynchronous':
                return await Promise.resolve().then(() => __importStar(require('../learn/cards/asynchronous.json')));
            case 'advanced-concepts':
                return await Promise.resolve().then(() => __importStar(require('../learn/cards/advanced-concepts.json')));
            default:
                console.warn(`Unknown category: ${category}, loading fundamentals as fallback`);
                return await Promise.resolve().then(() => __importStar(require('../learn/cards/fundamentals.json')));
        }
    })();
    loadingPromises[moduleKey] = loadPromise;
    try {
        const module = await loadPromise;
        cachedModules[moduleKey] = module;
        delete loadingPromises[moduleKey];
        return module;
    }
    catch (error) {
        delete loadingPromises[moduleKey];
        console.error(`Failed to load card module: ${category}`, error);
        throw error;
    }
}
// Lazy load functions for explore data
async function loadExploreModule(type) {
    const moduleKey = `explore-${type}`;
    if (cachedModules[moduleKey]) {
        return cachedModules[moduleKey];
    }
    if (loadingPromises[moduleKey]) {
        return await loadingPromises[moduleKey];
    }
    const loadPromise = (async () => {
        switch (type) {
            case 'javascript-notes':
                return await Promise.resolve().then(() => __importStar(require('../explore/javascript-notes.json')));
            case 'practice-quiz':
                return await Promise.resolve().then(() => __importStar(require('../explore/practice-quiz.json')));
            case 'interview-prep':
                return await Promise.resolve().then(() => __importStar(require('../explore/interview-prep.json')));
            case 'interview-quiz':
                return await Promise.resolve().then(() => __importStar(require('../explore/interview-quiz.json')));
            case 'learning-roadmap':
                return await Promise.resolve().then(() => __importStar(require('../explore/learning-roadmap.json')));
            case 'design-patterns':
                return await Promise.resolve().then(() => __importStar(require('../explore/design-patterns.json')));
            case 'coding-questions':
                return await Promise.resolve().then(() => __importStar(require('../explore/coding-questions.json')));
            default:
                throw new Error(`Unknown explore type: ${type}`);
        }
    })();
    loadingPromises[moduleKey] = loadPromise;
    try {
        const module = await loadPromise;
        cachedModules[moduleKey] = module;
        delete loadingPromises[moduleKey];
        return module;
    }
    catch (error) {
        delete loadingPromises[moduleKey];
        console.error(`Failed to load explore module: ${type}`, error);
        throw error;
    }
}
// Lazy load functions for topic data
async function loadTopicModule(topicId) {
    const moduleKey = `topic-${topicId}`;
    if (cachedModules[moduleKey]) {
        return cachedModules[moduleKey];
    }
    if (loadingPromises[moduleKey]) {
        return await loadingPromises[moduleKey];
    }
    const loadPromise = (async () => {
        switch (topicId) {
            case 'easy':
                return await Promise.resolve().then(() => __importStar(require('../learn/topics/easy.json')));
            case 'medium':
                return await Promise.resolve().then(() => __importStar(require('../learn/topics/medium.json')));
            case 'hard':
                return await Promise.resolve().then(() => __importStar(require('../learn/topics/hard.json')));
            case 'interview':
                return await Promise.resolve().then(() => __importStar(require('../learn/topics/interview.json')));
            case 'fundamentals':
                return await Promise.resolve().then(() => __importStar(require('../learn/topics/fundamentals.json')));
            default:
                // For topics without dedicated JSON files, return null to trigger category-based fallback
                console.log(`No dedicated topic file for: ${topicId}, will use category-based loading`);
                return null;
        }
    })();
    loadingPromises[moduleKey] = loadPromise;
    try {
        const module = await loadPromise;
        cachedModules[moduleKey] = module;
        delete loadingPromises[moduleKey];
        return module;
    }
    catch (error) {
        delete loadingPromises[moduleKey];
        console.error(`Failed to load topic module: ${topicId}`, error);
        throw error;
    }
}
// Helper function to get cards by category (now async with lazy loading)
async function getCardsByCategory(category) {
    try {
        const module = await loadCardModule(category);
        return module.cards || [];
    }
    catch (error) {
        console.error(`Failed to load cards for category: ${category}`, error);
        return [];
    }
}
// Helper function to get all available categories (lazy)
async function getAllCategories() {
    const config = await getConfigData();
    return config.categories || [];
}
// Async function to get all lessons (loads all card files)
async function getAllLessons() {
    const categories = ['fundamentals', 'data-structures', 'control-flow', 'web-development', 'asynchronous', 'advanced-concepts'];
    const allLessons = [];
    for (const category of categories) {
        try {
            const lessons = await getCardsByCategory(category);
            allLessons.push(...lessons);
        }
        catch (error) {
            console.error(`Failed to load lessons for category: ${category}`, error);
        }
    }
    return allLessons;
}
// Get lesson by ID
async function getLessonById(id) {
    try {
        const allLessons = await getAllLessons();
        return allLessons.find(lesson => lesson.id === id);
    }
    catch (error) {
        console.error(`Failed to load lesson by id: ${id}`, error);
        return undefined;
    }
}
// Export config data (loaded lazily)
async function getLessonCategories() {
    const config = await getConfigData();
    return config.categories || [];
}
async function getLessonDifficulties() {
    const config = await getConfigData();
    return config.difficulties || [];
}
// Topics loaded lazily but cached
let topicsCache = null;
exports.topics = new Proxy([], {
    get: function (target, prop) {
        if (prop === 'find' || prop === 'filter' || prop === 'map') {
            // Return async-compatible methods
            return function (...args) {
                if (!topicsCache) {
                    console.warn('Topics not loaded yet, using empty array');
                    return [];
                }
                return Array.prototype[prop].apply(topicsCache, args);
            };
        }
        return topicsCache?.[prop];
    }
});
// Initialize topics lazily
async function initializeTopics() {
    if (!topicsCache) {
        const config = await getConfigData();
        topicsCache = config.topics || [];
        console.log(`⚡ Loaded ${topicsCache.length} topics lazily`);
    }
    return topicsCache;
}
// Memory optimization: Clear unused modules
function clearUnusedModules(keepModules = []) {
    const moduleKeys = Object.keys(cachedModules);
    let clearedCount = 0;
    moduleKeys.forEach(key => {
        if (!keepModules.includes(key)) {
            delete cachedModules[key];
            clearedCount++;
        }
    });
    console.log(`🧹 Memory optimization: Cleared ${clearedCount} unused modules`);
}
// Get memory usage statistics
function getMemoryStats() {
    const moduleKeys = Object.keys(cachedModules);
    let estimatedSize = 0;
    // Rough estimation of memory usage
    Object.values(cachedModules).forEach((module) => {
        estimatedSize += JSON.stringify(module).length;
    });
    return {
        loadedModules: moduleKeys.length,
        moduleKeys,
        estimatedSize: `${(estimatedSize / 1024).toFixed(2)} KB`
    };
}
// JavaScript Notes (lazy loaded)
async function getNotes() {
    try {
        const module = await loadExploreModule('javascript-notes');
        return module.notes || [];
    }
    catch (error) {
        console.error('Failed to load JavaScript notes', error);
        return [];
    }
}
async function getNoteCategories() {
    try {
        const module = await loadExploreModule('javascript-notes');
        return module.categories || [];
    }
    catch (error) {
        console.error('Failed to load note categories', error);
        return [];
    }
}
async function getNotesByCategory(category) {
    try {
        const notes = await getNotes();
        return notes.filter(note => note.category === category);
    }
    catch (error) {
        console.error(`Failed to load notes for category: ${category}`, error);
        return [];
    }
}
// Learn Cards utility functions (now async with lazy loading)
async function getLessonsByDifficulty(difficulty) {
    try {
        const allLessons = await getAllLessons();
        return allLessons.filter(lesson => lesson.difficulty === difficulty);
    }
    catch (error) {
        console.error(`Failed to load lessons by difficulty: ${difficulty}`, error);
        return [];
    }
}
async function getCompletedLessons() {
    try {
        const allLessons = await getAllLessons();
        return allLessons.filter(lesson => lesson.isCompleted);
    }
    catch (error) {
        console.error('Failed to load completed lessons', error);
        return [];
    }
}
async function getBookmarkedLessons() {
    try {
        const allLessons = await getAllLessons();
        return allLessons.filter(lesson => lesson.isBookmarked);
    }
    catch (error) {
        console.error('Failed to load bookmarked lessons', error);
        return [];
    }
}
async function searchLessons(query) {
    try {
        const allLessons = await getAllLessons();
        const lowercaseQuery = query.toLowerCase();
        return allLessons.filter(lesson => lesson.title.toLowerCase().includes(lowercaseQuery) ||
            lesson.content.toLowerCase().includes(lowercaseQuery) ||
            lesson.description.toLowerCase().includes(lowercaseQuery) ||
            lesson.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)));
    }
    catch (error) {
        console.error(`Failed to search lessons with query: ${query}`, error);
        return [];
    }
}
async function getLessonsByTopic(topicId) {
    // If it's the default "all" topic or no topic, return fundamentals as default
    if (!topicId || topicId === 'all') {
        return await getCardsByCategory('fundamentals');
    }
    // Try to load topic-specific data first
    try {
        const topicModule = await loadTopicModule(topicId);
        if (topicModule && topicModule.cards) {
            return topicModule.cards;
        }
        // If topicModule is null, fall through to category-based loading
    }
    catch (error) {
        console.warn(`No specific topic data for: ${topicId}, using category-based filtering`);
    }
    // Fallback to category-based loading with topic filtering
    const topic = exports.topics.find((t) => t.id === topicId);
    if (!topic || !topic.filter) {
        return await getCardsByCategory('fundamentals');
    }
    const { filter } = topic;
    // Load lessons from the first category in the filter
    if (filter.category && filter.category.length > 0) {
        const categoryLessons = await getCardsByCategory(filter.category[0]);
        // Apply additional filtering if needed
        return categoryLessons.filter(lesson => {
            // Check difficulty filter
            if (filter.difficulty && !filter.difficulty.includes(lesson.difficulty)) {
                return false;
            }
            // Check tags filter
            if (filter.tags && !filter.tags.some((tag) => lesson.tags.includes(tag))) {
                return false;
            }
            return true;
        });
    }
    // Final fallback
    return await getCardsByCategory('fundamentals');
}
async function getTopicInfo(topicId) {
    try {
        const module = await loadTopicModule(topicId);
        return module.topicInfo || exports.topics.find((t) => t.id === topicId) || null;
    }
    catch (error) {
        console.error(`Failed to load topic info for: ${topicId}`, error);
        return exports.topics.find((t) => t.id === topicId) || null;
    }
}
async function getNotesByDifficulty(difficulty) {
    try {
        const notes = await getNotes();
        return notes.filter(note => note.difficulty === difficulty);
    }
    catch (error) {
        console.error(`Failed to load notes by difficulty: ${difficulty}`, error);
        return [];
    }
}
async function getNoteById(id) {
    try {
        const notes = await getNotes();
        return notes.find(note => note.id === id);
    }
    catch (error) {
        console.error(`Failed to load note by id: ${id}`, error);
        return undefined;
    }
}
async function searchNotes(query) {
    try {
        const notes = await getNotes();
        const lowercaseQuery = query.toLowerCase();
        return notes.filter(note => note.title.toLowerCase().includes(lowercaseQuery) ||
            note.content.toLowerCase().includes(lowercaseQuery) ||
            note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)));
    }
    catch (error) {
        console.error(`Failed to search notes with query: ${query}`, error);
        return [];
    }
}
// Practice Quizzes (lazy loaded)
async function getQuizzes() {
    try {
        const module = await loadExploreModule('practice-quiz');
        return module.quizzes || [];
    }
    catch (error) {
        console.error('Failed to load quizzes', error);
        return [];
    }
}
async function getQuizCategories() {
    try {
        const module = await loadExploreModule('practice-quiz');
        return module.categories || [];
    }
    catch (error) {
        console.error('Failed to load quiz categories', error);
        return [];
    }
}
async function getQuizzesByCategory(category) {
    try {
        const quizzes = await getQuizzes();
        return quizzes.filter(quiz => quiz.category === category);
    }
    catch (error) {
        console.error(`Failed to load quizzes by category: ${category}`, error);
        return [];
    }
}
async function getQuizzesByDifficulty(difficulty) {
    try {
        const quizzes = await getQuizzes();
        return quizzes.filter(quiz => quiz.difficulty === difficulty);
    }
    catch (error) {
        console.error(`Failed to load quizzes by difficulty: ${difficulty}`, error);
        return [];
    }
}
async function getQuizById(id) {
    try {
        const quizzes = await getQuizzes();
        return quizzes.find(quiz => quiz.id === id);
    }
    catch (error) {
        console.error(`Failed to load quiz by id: ${id}`, error);
        return undefined;
    }
}
// Interview Prep (lazy loaded)
async function getInterviewQuestions() {
    try {
        const module = await loadExploreModule('interview-prep');
        return module.interviewQuestions || [];
    }
    catch (error) {
        console.error('Failed to load interview questions', error);
        return [];
    }
}
async function getInterviewCategories() {
    try {
        const module = await loadExploreModule('interview-prep');
        return module.categories || [];
    }
    catch (error) {
        console.error('Failed to load interview categories', error);
        return [];
    }
}
async function getInterviewQuestionsByCategory(category) {
    try {
        const questions = await getInterviewQuestions();
        return questions.filter(question => question.category === category);
    }
    catch (error) {
        console.error(`Failed to load interview questions by category: ${category}`, error);
        return [];
    }
}
async function getInterviewQuestionsByDifficulty(difficulty) {
    try {
        const questions = await getInterviewQuestions();
        return questions.filter(question => question.difficulty === difficulty);
    }
    catch (error) {
        console.error(`Failed to load interview questions by difficulty: ${difficulty}`, error);
        return [];
    }
}
async function getInterviewQuestionById(id) {
    try {
        const questions = await getInterviewQuestions();
        return questions.find(question => question.id === id);
    }
    catch (error) {
        console.error(`Failed to load interview question by id: ${id}`, error);
        return undefined;
    }
}
async function searchInterviewQuestions(query) {
    try {
        const questions = await getInterviewQuestions();
        const lowercaseQuery = query.toLowerCase();
        return questions.filter(question => question.question.toLowerCase().includes(lowercaseQuery) ||
            question.answer.toLowerCase().includes(lowercaseQuery) ||
            question.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)));
    }
    catch (error) {
        console.error(`Failed to search interview questions with query: ${query}`, error);
        return [];
    }
}
// Interview Quizzes (lazy loaded)
async function getInterviewQuizzes() {
    try {
        const module = await loadExploreModule('interview-quiz');
        return module.interviewQuizzes || [];
    }
    catch (error) {
        console.error('Failed to load interview quizzes', error);
        return [];
    }
}
async function getInterviewQuizCategories() {
    try {
        const module = await loadExploreModule('interview-quiz');
        return module.categories || [];
    }
    catch (error) {
        console.error('Failed to load interview quiz categories', error);
        return [];
    }
}
async function getInterviewQuizzesByCategory(category) {
    try {
        const quizzes = await getInterviewQuizzes();
        return quizzes.filter(quiz => quiz.category === category);
    }
    catch (error) {
        console.error(`Failed to load interview quizzes by category: ${category}`, error);
        return [];
    }
}
async function getInterviewQuizById(id) {
    try {
        const quizzes = await getInterviewQuizzes();
        return quizzes.find(quiz => quiz.id === id);
    }
    catch (error) {
        console.error(`Failed to load interview quiz by id: ${id}`, error);
        return undefined;
    }
}
// Learning Roadmap (lazy loaded)
async function getLearningRoadmap() {
    try {
        const module = await loadExploreModule('learning-roadmap');
        return module.roadmap || { title: '', description: '', totalNodes: 0, estimatedTime: '', nodes: [], connections: [] };
    }
    catch (error) {
        console.error('Failed to load learning roadmap', error);
        return { title: '', description: '', totalNodes: 0, estimatedTime: '', nodes: [], connections: [] };
    }
}
async function getRoadmapNodeById(id) {
    try {
        const roadmap = await getLearningRoadmap();
        return roadmap.nodes.find(node => node.id === id);
    }
    catch (error) {
        console.error(`Failed to load roadmap node by id: ${id}`, error);
        return undefined;
    }
}
async function getNodesByLevel(level) {
    try {
        const roadmap = await getLearningRoadmap();
        return roadmap.nodes.filter(node => node.level === level);
    }
    catch (error) {
        console.error(`Failed to load nodes by level: ${level}`, error);
        return [];
    }
}
async function getNodesByStatus(status) {
    try {
        const roadmap = await getLearningRoadmap();
        return roadmap.nodes.filter(node => node.status === status);
    }
    catch (error) {
        console.error(`Failed to load nodes by status: ${status}`, error);
        return [];
    }
}
async function getPrerequisites(nodeId) {
    try {
        const node = await getRoadmapNodeById(nodeId);
        if (!node)
            return [];
        const roadmap = await getLearningRoadmap();
        return node.prerequisites.map(prereqId => roadmap.nodes.find(n => n.id === prereqId)).filter(Boolean);
    }
    catch (error) {
        console.error(`Failed to load prerequisites for node: ${nodeId}`, error);
        return [];
    }
}
async function getNextNodes(nodeId) {
    try {
        const roadmap = await getLearningRoadmap();
        return roadmap.nodes.filter(node => node.prerequisites.includes(nodeId));
    }
    catch (error) {
        console.error(`Failed to load next nodes for: ${nodeId}`, error);
        return [];
    }
}
// Design Patterns (lazy loaded)
async function getDesignPatterns() {
    try {
        const module = await loadExploreModule('design-patterns');
        return module.designPatterns || [];
    }
    catch (error) {
        console.error('Failed to load design patterns', error);
        return [];
    }
}
async function getDesignPatternCategories() {
    try {
        const module = await loadExploreModule('design-patterns');
        return module.categories || [];
    }
    catch (error) {
        console.error('Failed to load design pattern categories', error);
        return [];
    }
}
async function getDesignPatternsByCategory(category) {
    try {
        const patterns = await getDesignPatterns();
        return patterns.filter(pattern => pattern.category === category);
    }
    catch (error) {
        console.error(`Failed to load design patterns by category: ${category}`, error);
        return [];
    }
}
async function getDesignPatternsByDifficulty(difficulty) {
    try {
        const patterns = await getDesignPatterns();
        return patterns.filter(pattern => pattern.difficulty === difficulty);
    }
    catch (error) {
        console.error(`Failed to load design patterns by difficulty: ${difficulty}`, error);
        return [];
    }
}
async function getDesignPatternById(id) {
    try {
        const patterns = await getDesignPatterns();
        return patterns.find(pattern => pattern.id === id);
    }
    catch (error) {
        console.error(`Failed to load design pattern by id: ${id}`, error);
        return undefined;
    }
}
async function searchDesignPatterns(query) {
    try {
        const patterns = await getDesignPatterns();
        const lowercaseQuery = query.toLowerCase();
        return patterns.filter(pattern => pattern.name.toLowerCase().includes(lowercaseQuery) ||
            pattern.description.toLowerCase().includes(lowercaseQuery) ||
            pattern.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)));
    }
    catch (error) {
        console.error(`Failed to search design patterns with query: ${query}`, error);
        return [];
    }
}
// Coding Questions (lazy loaded)
async function getCodingQuestions() {
    try {
        const module = await loadExploreModule('coding-questions');
        return module.codingQuestions || [];
    }
    catch (error) {
        console.error('Failed to load coding questions', error);
        return [];
    }
}
async function getCodingQuestionCategories() {
    try {
        const module = await loadExploreModule('coding-questions');
        return module.categories || [];
    }
    catch (error) {
        console.error('Failed to load coding question categories', error);
        return [];
    }
}
async function getCodingQuestionDifficulties() {
    try {
        const module = await loadExploreModule('coding-questions');
        return module.difficulties || [];
    }
    catch (error) {
        console.error('Failed to load coding question difficulties', error);
        return [];
    }
}
async function getCodingQuestionsByCategory(category) {
    try {
        const questions = await getCodingQuestions();
        return questions.filter(question => question.category === category);
    }
    catch (error) {
        console.error(`Failed to load coding questions by category: ${category}`, error);
        return [];
    }
}
async function getCodingQuestionsByDifficulty(difficulty) {
    try {
        const questions = await getCodingQuestions();
        return questions.filter(question => question.difficulty === difficulty);
    }
    catch (error) {
        console.error(`Failed to load coding questions by difficulty: ${difficulty}`, error);
        return [];
    }
}
async function getCodingQuestionById(id) {
    try {
        const questions = await getCodingQuestions();
        return questions.find(question => question.id === id);
    }
    catch (error) {
        console.error(`Failed to load coding question by id: ${id}`, error);
        return undefined;
    }
}
async function searchCodingQuestions(query) {
    try {
        const questions = await getCodingQuestions();
        const lowercaseQuery = query.toLowerCase();
        return questions.filter(question => question.title.toLowerCase().includes(lowercaseQuery) ||
            question.description.toLowerCase().includes(lowercaseQuery) ||
            question.category.toLowerCase().includes(lowercaseQuery));
    }
    catch (error) {
        console.error(`Failed to search coding questions with query: ${query}`, error);
        return [];
    }
}
// Utility functions
function getRandomItems(items, count) {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
async function getItemsByTag(tag) {
    try {
        const [notes, questions] = await Promise.all([
            getNotes(),
            getInterviewQuestions()
        ]);
        const notesWithTag = notes.filter(note => note.tags.includes(tag));
        const questionsWithTag = questions.filter(question => question.tags.includes(tag));
        return [...notesWithTag, ...questionsWithTag];
    }
    catch (error) {
        console.error(`Failed to load items by tag: ${tag}`, error);
        return [];
    }
}
// Statistics (lazy loaded)
async function getStats() {
    try {
        const [notes, quizzes, interviewQuestions, interviewQuizzes, designPatterns, codingQuestions, roadmap, categories, completedNodes, currentNodes, lockedNodes] = await Promise.all([
            getNotes(),
            getQuizzes(),
            getInterviewQuestions(),
            getInterviewQuizzes(),
            getDesignPatterns(),
            getCodingQuestions(),
            getLearningRoadmap(),
            getAllCategories(),
            getNodesByStatus('completed'),
            getNodesByStatus('current'),
            getNodesByStatus('locked')
        ]);
        return {
            totalNotes: notes.length,
            totalQuizzes: quizzes.length,
            totalInterviewQuestions: interviewQuestions.length,
            totalInterviewQuizzes: interviewQuizzes.length,
            totalDesignPatterns: designPatterns.length,
            totalCodingQuestions: codingQuestions.length,
            totalRoadmapNodes: roadmap.nodes.length,
            categoriesCount: categories.length,
            completedNodes: completedNodes.length,
            currentNodes: currentNodes.length,
            lockedNodes: lockedNodes.length
        };
    }
    catch (error) {
        console.error('Failed to load stats', error);
        return {
            totalNotes: 0,
            totalQuizzes: 0,
            totalInterviewQuestions: 0,
            totalInterviewQuizzes: 0,
            totalDesignPatterns: 0,
            totalCodingQuestions: 0,
            totalRoadmapNodes: 0,
            categoriesCount: 0,
            completedNodes: 0,
            currentNodes: 0,
            lockedNodes: 0
        };
    }
}
// ============================================================================
// MULTI-FILE ENHANCED FUNCTIONS
// ============================================================================
// Enhanced card loading with multi-file support - TEMPORARILY DISABLED
// export async function getCardsByTopicEnhanced(topicId: string, limit?: number): Promise<LearnCard[]> {
//   try {
//     console.log(`🔄 Attempting multi-file load for topic: ${topicId}`);
//     
//     // Try multi-file loader first
//     const multiFileCards = await multiFileLoader.getCardsByTopic(topicId, limit);
//     
//     if (multiFileCards.length > 0) {
//       console.log(`✅ Multi-file loader returned ${multiFileCards.length} cards for ${topicId}`);
//       return multiFileCards;
//     }
//     
//     // Fallback to legacy topic loading
//     console.log(`⚠️ Multi-file loader empty, falling back to legacy for topic: ${topicId}`);
//     return await getLessonsByTopic(topicId);
//     
//   } catch (error) {
//     console.warn(`Multi-file enhanced loading failed for ${topicId}:`, error);
//     // Final fallback to legacy system
//     return await getLessonsByTopic(topicId);
//   }
// }
// Temporary fallback to legacy function
async function getCardsByTopicEnhanced(topicId, limit) {
    return await getLessonsByTopic(topicId);
}
// Enhanced category loading with multi-file intelligence
async function getCardsByCategoryEnhanced(category) {
    try {
        // Map legacy categories to multi-file topics
        const categoryTopicMap = {
            'fundamentals': 'fundamentals',
            'data-structures': 'data-structures',
            'control-flow': 'control-flow',
            'web-development': 'functions',
            'asynchronous': 'advanced',
            'advanced-concepts': 'advanced'
        };
        const topicId = categoryTopicMap[category];
        if (topicId) {
            console.log(`🔄 Enhanced loading: mapping category '${category}' to topic '${topicId}'`);
            // Try enhanced topic loading
            const topicCards = await getCardsByTopicEnhanced(topicId);
            if (topicCards.length > 0) {
                console.log(`✅ Enhanced category loading successful: ${topicCards.length} cards`);
                return topicCards;
            }
        }
        // Fallback to legacy category loading
        console.log(`⚠️ Falling back to legacy category loading for: ${category}`);
        return await getCardsByCategory(category);
    }
    catch (error) {
        console.warn(`Enhanced category loading failed for ${category}:`, error);
        return await getCardsByCategory(category);
    }
}
// Enhanced search across multiple files - TEMPORARILY DISABLED
async function searchLessonsEnhanced(query) {
    return await searchLessons(query);
}
// Get available topics from multi-file system - TEMPORARILY DISABLED
async function getAvailableTopicsEnhanced() {
    try {
        const legacyTopics = await initializeTopics();
        return legacyTopics.map((t) => t.id);
    }
    catch (error) {
        return ['fundamentals', 'data-structures', 'control-flow', 'functions', 'advanced'];
    }
}
// Get topic information with enhanced metadata
async function getTopicInfoEnhanced(topicId) {
    try {
        console.log(`📋 Getting enhanced topic info for: ${topicId}`);
        // Try multi-file system first
        const topicManifest = await multiFileLoader.getTopicInfo(topicId);
        if (topicManifest) {
            console.log(`✅ Enhanced topic info found for: ${topicId}`);
            return {
                id: topicManifest.topicId,
                name: topicManifest.name,
                description: topicManifest.description,
                totalCards: topicManifest.totalCards,
                difficulty: topicManifest.difficulty,
                estimatedHours: topicManifest.estimatedHours,
                totalFiles: topicManifest.totalFiles,
                files: topicManifest.files,
                tags: topicManifest.tags,
                enhanced: true
            };
        }
        // Fallback to legacy topic info
        console.log(`⚠️ Using legacy topic info for: ${topicId}`);
        return await getTopicInfo(topicId);
    }
    catch (error) {
        console.warn(`Enhanced topic info failed for ${topicId}:`, error);
        return await getTopicInfo(topicId);
    }
}
// Enhanced notes loading - TEMPORARILY DISABLED
async function getNotesEnhanced() {
    // TODO: Re-enable when multiFileLoader bundling issues are resolved
    // try {
    //   console.log(`📚 Loading enhanced notes from multi-file system`);
    //   
    //   // Get available topics and load notes from each
    //   const topics = await getAvailableTopicsEnhanced();
    //   const allNotes: JavaScriptNote[] = [];
    //   
    //   const notePromises = topics.map(async topic => {
    //     try {
    //       return await multiFileLoader.getNotesByTopic(topic);
    //     } catch (error) {
    //       console.warn(`Failed to load notes for topic ${topic}:`, error);
    //       return [];
    //     }
    //   });
    //   
    //   const topicNotesResults = await Promise.all(notePromises);
    //   topicNotesResults.forEach(topicNotes => allNotes.push(...topicNotes));
    //   
    //   if (allNotes.length > 0) {
    //     console.log(`✅ Enhanced notes loading: ${allNotes.length} notes from multi-file system`);
    //     return allNotes;
    //   }
    //   
    //   // Fallback to legacy system
    //   console.log(`⚠️ Multi-file notes empty, using legacy system`);
    //   return await getNotes();
    //   
    // } catch (error) {
    //   console.warn('Enhanced notes loading failed:', error);
    //   return await getNotes();
    // }
    // Direct fallback to legacy system
    return await getNotes();
}
// Enhanced quiz loading - TEMPORARILY DISABLED
async function getQuizzesEnhanced() {
    // TODO: Re-enable when multiFileLoader bundling issues are resolved
    // try {
    //   console.log(`🧪 Loading enhanced quizzes from multi-file system`);
    //   
    //   const topics = await getAvailableTopicsEnhanced();
    //   const allQuizzes: Quiz[] = [];
    //   
    //   const quizPromises = topics.map(async topic => {
    //     try {
    //       return await multiFileLoader.getQuizzesByTopic(topic);
    //     } catch (error) {
    //       console.warn(`Failed to load quizzes for topic ${topic}:`, error);
    //       return [];
    //     }
    //   });
    //   
    //   const topicQuizResults = await Promise.all(quizPromises);
    //   topicQuizResults.forEach(topicQuizzes => allQuizzes.push(...topicQuizzes));
    //   
    //   if (allQuizzes.length > 0) {
    //     console.log(`✅ Enhanced quiz loading: ${allQuizzes.length} quizzes from multi-file system`);
    //     return allQuizzes;
    //   }
    //   
    //   // Fallback to legacy system
    //   console.log(`⚠️ Multi-file quizzes empty, using legacy system`);
    //   return await getQuizzes();
    //   
    // } catch (error) {
    //   console.warn('Enhanced quiz loading failed:', error);
    //   return await getQuizzes();
    // }
    // Direct fallback to legacy system
    return await getQuizzes();
}
// Multi-file system utilities - TEMPORARILY DISABLED
async function getMultiFileStats() {
    // TODO: Re-enable when multiFileLoader bundling issues are resolved
    // try {
    //   const stats = multiFileLoader.getCacheStats();
    //   const topics = await getAvailableTopicsEnhanced();
    //   
    //   return {
    //     multiFileSystem: {
    //       enabled: true,
    //       availableTopics: topics.length,
    //       topicList: topics,
    //       cacheStats: stats
    //     },
    //     legacySystem: getMemoryStats()
    //   };
    //   
    // } catch (error) {
    //   return {
    //     multiFileSystem: { enabled: false, error: error.message },
    //     legacySystem: getMemoryStats()
    //   };
    // }
    return {
        multiFileSystem: { enabled: false, error: "Temporarily disabled due to bundling issues" },
        legacySystem: getMemoryStats()
    };
}
// Clear multi-file caches - TEMPORARILY DISABLED
function clearMultiFileCache() {
    // TODO: Re-enable when multiFileLoader bundling issues are resolved
    // multiFileLoader.clearCache();
    console.log('🧹 Multi-file system cache clearing disabled (bundling issues)');
}
// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// ============================================================================
// Synchronous exports for immediate use (initially empty, populated by async functions)
exports.designPatterns = [];
exports.codingQuestions = [];
// Initialize data on module load
(async () => {
    try {
        exports.designPatterns = await getDesignPatterns();
        exports.codingQuestions = await getCodingQuestions();
    }
    catch (error) {
        console.error('Failed to initialize synchronous exports:', error);
    }
})();
