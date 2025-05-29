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
import { ArrowLeft, BookOpen, Code, Lightbulb } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { notes, getNotesByCategory, noteCategories } from '@/data/processors/dataLoader';

export default function JavaScriptNotesScreen() {
  const themeColors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...noteCategories];
  
  const filteredNotes = selectedCategory === 'all' 
    ? notes 
    : getNotesByCategory(selectedCategory);

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

      <View style={styles.codePreview}>
        <View style={styles.codeHeader}>
          <Code size={14} color={themeColors.textSecondary} />
          <Text style={[styles.codeLabel, { color: themeColors.textSecondary }]}>
            Code Example
          </Text>
        </View>
        <View style={[styles.codeSnippet, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.codeText, { color: themeColors.text }]}>
            {note.codeExample ? note.codeExample.substring(0, 80) + '...' : 'No code example'}
          </Text>
        </View>
      </View>

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
              onPress={() => router.back()}
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: selectedCategory === category ? themeColors.primary : themeColors.card,
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  {
                    color: selectedCategory === category ? '#ffffff' : themeColors.text,
                  }
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
  categoryButtonText: {
    fontSize: 14,
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
