import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import lessons from '@/data/lessons';
import LessonList from '@/components/LessonList';
import { Bookmark } from 'lucide-react-native';

export default function BookmarksScreen() {
  const themeColors = useThemeColors();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Bookmarked Lessons</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Your saved JavaScript lessons</Text>
      </View>
      
      <LessonList lessons={lessons} showBookmarkedOnly={true} />
      
      <View style={styles.emptyStateContainer}>
        <Bookmark size={64} color={themeColors.border} />
        <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
          Swipe right on a lesson card to bookmark it for later
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  emptyStateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 24,
    opacity: 0.5,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});