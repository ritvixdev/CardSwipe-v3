import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, BookOpen, Code, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { notes, getNotesByCategory, noteCategories } from '@/data/processors/dataLoader';
import CodeBlock from '@/components/CodeBlock';

// Hierarchical category structure
const categoryHierarchy = {
  'all': { label: 'All', subcategories: [] },
  'fundamentals': {
    label: 'Fundamentals',
    subcategories: ['variables', 'data-types', 'operators', 'functions']
  },
  'core-concepts': {
    label: 'Core Concepts',
    subcategories: ['scope', 'closures', 'hoisting', 'this-keyword']
  },
  'data-structures': {
    label: 'Data Structures',
    subcategories: ['arrays', 'objects', 'maps', 'sets']
  },
  'async': {
    label: 'Async Programming',
    subcategories: ['callbacks', 'promises', 'async-await', 'event-loop']
  },
  'advanced': {
    label: 'Advanced',
    subcategories: ['prototypes', 'classes', 'modules', 'decorators']
  }
};

export default function JavaScriptNotesScreen() {
  const themeColors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const categories = Object.keys(categoryHierarchy);

  const getFilteredNotes = () => {
    if (selectedSubcategory) {
      // Filter by subcategory - match against note topics/tags
      return notes.filter(note => {
        const noteTopics = note.topic?.toLowerCase() || '';
        const subcategoryMatch = selectedSubcategory.toLowerCase().replace('-', ' ');
        return noteTopics.includes(subcategoryMatch) ||
               noteTopics.includes(selectedSubcategory.replace('-', ''));
      });
    } else if (selectedCategory === 'all') {
      return notes;
    } else {
      // Filter by main category - match against note categories
      const categoryData = categoryHierarchy[selectedCategory];
      if (categoryData && categoryData.subcategories.length > 0) {
        // If category has subcategories, show all notes that match any subcategory
        return notes.filter(note => {
          const noteCategory = note.category?.toLowerCase() || '';
          const noteTopics = note.topic?.toLowerCase() || '';

          // Check if note category matches
          if (noteCategory.includes(selectedCategory)) return true;

          // Check if note topics match any subcategory
          return categoryData.subcategories.some(sub =>
            noteTopics.includes(sub.replace('-', ' ')) ||
            noteTopics.includes(sub.replace('-', ''))
          );
        });
      } else {
        // Simple category match
        return notes.filter(note => {
          const noteCategory = note.category?.toLowerCase() || '';
          return noteCategory.includes(selectedCategory);
        });
      }
    }
  };

  const filteredNotes = getFilteredNotes();

  const handleCategoryPress = (category: string) => {
    const hasSubcategories = categoryHierarchy[category]?.subcategories.length > 0;

    // Always set the selected category to filter cards
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Clear subcategory selection

    if (hasSubcategories) {
      // If category has subcategories, expand/collapse the subcategory pills
      if (expandedCategory === category) {
        setExpandedCategory(null);
      } else {
        setExpandedCategory(category);
      }
    } else {
      // If no subcategories, close any expanded category
      setExpandedCategory(null);
    }
  };

  const handleSubcategoryPress = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const handleNotePress = (noteId: string) => {
    router.push(`/(tabs)/explore/javascript-notes/${noteId}` as any);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return themeColors.textSecondary;
    }
  };

  const NoteCard = ({ note }: { note: any }) => (
    <TouchableOpacity
      style={[styles.noteCard, { backgroundColor: themeColors.card }]}
      onPress={() => handleNotePress(note.id)}
    >
      <View style={styles.noteHeader}>
        <View style={styles.noteTopRow}>
          <Text style={[styles.noteCategory, { color: themeColors.primary }]}>
            {note.category}
          </Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(note.difficulty) }]}>
            <Text style={styles.difficultyText}>{note.difficulty}</Text>
          </View>
        </View>
        
        <Text style={[styles.noteTitle, { color: themeColors.text }]}>
          {note.title}
        </Text>
        
        <Text style={[styles.noteDescription, { color: themeColors.textSecondary }]}>
          {note.content.substring(0, 120)}...
        </Text>
      </View>

      {note.codeExample && (
        <View style={styles.codePreview}>
          <View style={styles.codeHeader}>
            <Code size={14} color={themeColors.textSecondary} />
            <Text style={[styles.codeLabel, { color: themeColors.textSecondary }]}>
              Code Example
            </Text>
          </View>
          <CodeBlock
            code={note.codeExample.substring(0, 150) + (note.codeExample.length > 150 ? '...' : '')}
            language="javascript"
            showLineNumbers={false}
            size="small"
          />
        </View>
      )}

      <View style={styles.noteFooter}>
        <View style={styles.noteStats}>
          <BookOpen size={12} color={themeColors.textSecondary} />
          <Text style={[styles.readTime, { color: themeColors.textSecondary }]}>
            {note.readTime} min read
          </Text>
        </View>
        
        <View style={styles.keyPoints}>
          <Lightbulb size={12} color={themeColors.primary} />
          <Text style={[styles.pointsText, { color: themeColors.textSecondary }]}>
            {note.keyPoints?.length || 0} key points
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back button and title in scrollable content */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <ArrowLeft size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: themeColors.text }]}>JavaScript Notes</Text>
          </View>
        </SafeAreaView>
        
        <View style={styles.pageHeader}>
          <Text style={[styles.summary, { color: themeColors.textSecondary }]}>Essential concepts with examples</Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map((category) => {
              const categoryData = categoryHierarchy[category];
              const hasSubcategories = categoryData.subcategories.length > 0;
              const isSelected = selectedCategory === category;
              const isExpanded = expandedCategory === category;

              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: isSelected ? themeColors.primary : themeColors.card,
                    }
                  ]}
                  onPress={() => handleCategoryPress(category)}
                >
                  <View style={styles.categoryButtonContent}>
                    <Text
                      style={[
                        styles.categoryButtonText,
                        {
                          color: isSelected ? '#ffffff' : themeColors.text,
                        }
                      ]}
                    >
                      {categoryData.label}
                    </Text>
                    {hasSubcategories && (
                      <View style={styles.expandIcon}>
                        {isExpanded ? (
                          <ChevronDown size={14} color={isSelected ? '#ffffff' : themeColors.text} />
                        ) : (
                          <ChevronRight size={14} color={isSelected ? '#ffffff' : themeColors.text} />
                        )}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Subcategory Pills */}
          {expandedCategory && categoryHierarchy[expandedCategory].subcategories.length > 0 && (
            <View style={styles.subcategoryContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subcategoryContent}
              >
                {categoryHierarchy[expandedCategory].subcategories.map((subcategory) => (
                  <TouchableOpacity
                    key={subcategory}
                    style={[
                      styles.subcategoryButton,
                      {
                        backgroundColor: selectedSubcategory === subcategory ? themeColors.primary : themeColors.background,
                        borderColor: themeColors.primary,
                      }
                    ]}
                    onPress={() => handleSubcategoryPress(subcategory)}
                  >
                    <Text
                      style={[
                        styles.subcategoryButtonText,
                        {
                          color: selectedSubcategory === subcategory ? '#ffffff' : themeColors.primary,
                        }
                      ]}
                    >
                      {subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Notes List */}
        <View style={styles.notesContainer}>
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 20,
    marginLeft: -4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  pageHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
  },
  categoryFilter: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryContent: {
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  categoryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  expandIcon: {
    marginLeft: 2,
  },
  subcategoryContainer: {
    marginTop: 12,
    paddingLeft: 16,
  },
  subcategoryContent: {
    paddingRight: 20,
  },
  subcategoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  subcategoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  notesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  noteCard: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  noteHeader: {
    gap: 8,
  },
  noteTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteCategory: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  codePreview: {
    gap: 8,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeSnippet: {
    padding: 12,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTime: {
    fontSize: 12,
  },
  keyPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 12,
  },
});
