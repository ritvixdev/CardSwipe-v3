# Learn Cards - Modular Structure

This directory contains the JavaScript learning cards organized in a modular structure for easy maintenance and expansion.

## Structure

```
data/learn/
├── config.json              # Configuration (categories, difficulties, topics)
├── cards/                   # Modular card files
│   ├── fundamentals.json    # Basic JavaScript concepts
│   ├── data-structures.json # Variables, arrays, objects
│   ├── control-flow.json    # Conditionals, loops, logic
│   ├── web-development.json # DOM, events, browser APIs
│   ├── asynchronous.json    # Promises, async/await, fetch
│   └── advanced-concepts.json # Closures, classes, OOP
├── topics/                  # Legacy topic-specific files
└── README.md               # This file
```

## Adding New Cards

### 1. Create a New Card File

Create a new JSON file in the `cards/` directory:

```json
{
  "cards": [
    {
      "id": "unique-card-id",
      "title": "Card Title",
      "day": 1,
      "category": "Category Name",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedTime": "X min",
      "description": "Brief description",
      "content": "Detailed explanation...",
      "codeExample": "// Code example here",
      "keyPoints": [
        "Key point 1",
        "Key point 2"
      ],
      "quiz": {
        "question": "Quiz question?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 0,
        "explanation": "Explanation of correct answer"
      },
      "tags": ["tag1", "tag2"],
      "isCompleted": false,
      "isBookmarked": false
    }
  ]
}
```

### 2. Update the DataLoader

Add your new card file to `data/processors/dataLoader.ts`:

```typescript
// Import your new card file
import yourNewCards from '../learn/cards/your-new-cards.json';

// Add to allCardFiles array
const allCardFiles = [
  fundamentalsCards,
  dataStructuresCards,
  // ... other files
  yourNewCards  // Add here
];

// Add to getCardsByCategory function if needed
export function getCardsByCategory(category: string): LearnCard[] {
  const categoryMap: { [key: string]: any } = {
    'Your Category': yourNewCards,
    // ... other categories
  };
  
  return categoryMap[category]?.cards || [];
}
```

### 3. Update Configuration (if needed)

If you're adding a new category, update `config.json`:

```json
{
  "categories": [
    "Fundamentals",
    "Data Structures",
    "Your New Category"
  ]
}
```

## Current Categories

- **Fundamentals**: Basic JavaScript concepts, history, and core features
- **Data Structures**: Variables, data types, arrays, objects
- **Control Flow**: Conditionals, loops, boolean logic
- **Web Development**: DOM manipulation, events, browser APIs
- **Asynchronous**: Promises, async/await, fetch API
- **Advanced Concepts**: Closures, classes, OOP patterns

## Card Structure Guidelines

### Required Fields
- `id`: Unique identifier (kebab-case)
- `title`: Descriptive title
- `day`: Learning day (1-30)
- `category`: Must match a category in config.json
- `difficulty`: beginner, intermediate, or advanced
- `estimatedTime`: Reading time (e.g., "5 min")
- `description`: Brief summary
- `content`: Main educational content
- `keyPoints`: Array of key takeaways
- `quiz`: Interactive quiz object
- `tags`: Array of searchable tags
- `isCompleted`: Boolean (default: false)
- `isBookmarked`: Boolean (default: false)

### Optional Fields
- `codeExample`: Code snippet with syntax highlighting

### Best Practices

1. **Keep cards focused**: Each card should cover one main concept
2. **Progressive difficulty**: Start simple, build complexity
3. **Practical examples**: Include real-world code examples
4. **Interactive quizzes**: Test understanding with meaningful questions
5. **Consistent formatting**: Follow the established structure
6. **Searchable tags**: Use relevant, searchable tags

## Testing

After adding new cards, run the test suite to ensure everything works:

```bash
npm test
```

The tests will validate:
- JSON structure integrity
- Data loading functionality
- Component integration
- Topic filtering

## File Size Guidelines

Keep individual card files under 300 lines for maintainability. If a category grows too large, consider splitting it into subcategories.

Example split:
- `web-development.json` → `dom-manipulation.json` + `events.json` + `apis.json`
