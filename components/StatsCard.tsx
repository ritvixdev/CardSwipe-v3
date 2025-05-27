import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Flame, Trophy, BookOpen } from 'lucide-react-native';
import { useProgressStore } from '@/store/useProgressStore';

export default function StatsCard() {
  const { streak, xp } = useProgressStore();
  const progress = useProgressStore((state) => state.progress);
  const themeColors = useThemeColors();
  
  // Calculate completed lessons
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
      <View style={styles.statItem}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
          <Flame size={20} color={themeColors.error} />
        </View>
        <View>
          <Text style={[styles.statValue, { color: themeColors.text }]}>{streak}</Text>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Day Streak</Text>
        </View>
      </View>
      
      <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
      
      <View style={styles.statItem}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
          <BookOpen size={20} color={themeColors.primary} />
        </View>
        <View>
          <Text style={[styles.statValue, { color: themeColors.text }]}>{completedCount}</Text>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Lessons</Text>
        </View>
      </View>
      
      <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
      
      <View style={styles.statItem}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
          <Trophy size={20} color={themeColors.secondary} />
        </View>
        <View>
          <Text style={[styles.statValue, { color: themeColors.text }]}>{xp}</Text>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>XP Points</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: '80%',
    marginHorizontal: 8,
  },
});