import React, { memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/hooks/useThemeColors';

const { width: screenWidth } = Dimensions.get('window');

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string[];
  filter: any;
}

interface TopicSelectorProps {
  topics: Topic[];
  selectedTopic: string;
  onTopicSelect: (topicId: string) => void;
}

const TopicSelector = memo(function TopicSelector({ topics, selectedTopic, onTopicSelect }: TopicSelectorProps) {
  const themeColors = useThemeColors();

  // Memoize the topic selection handler to prevent unnecessary re-renders
  const handleTopicSelect = useCallback((topicId: string) => {
    onTopicSelect(topicId);
  }, [onTopicSelect]);

  // Memoize the rendered topic pills to prevent recreation on every render
  const topicPills = useMemo(() => {
    return topics.map((topic, index) => {
      const isSelected = selectedTopic === topic.id;
      const isFirst = index === 0;

      return (
        <TouchableOpacity
          key={topic.id}
          onPress={() => handleTopicSelect(topic.id)}
          style={[
            styles.topicPill,
            isFirst && styles.firstPill,
            isSelected && styles.selectedPill,
          ]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isSelected ? [topic.color, topic.gradient[2]] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pillGradient}
          >
            <Text style={[
              styles.topicIcon,
              { color: isSelected ? '#ffffff' : themeColors.textSecondary }
            ]}>
              {topic.icon}
            </Text>
            <Text style={[
              styles.topicTitle,
              { color: isSelected ? '#ffffff' : themeColors.textSecondary }
            ]}>
              {topic.title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    });
  }, [topics, selectedTopic, themeColors, handleTopicSelect]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={screenWidth * 0.8}
        snapToAlignment="start"
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
      >
        {topicPills}
      </ScrollView>
    </View>
  );
});

export default TopicSelector;

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginBottom: 16,
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },
  topicPill: {
    height: 28, // Reduced to match QUIZ pill height
    marginRight: 12,
    borderRadius: 12, // Reduced to match QUIZ pill radius
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  firstPill: {
    marginLeft: 0,
  },
  selectedPill: {
    elevation: 4,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  pillGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8, // Reduced to match QUIZ pill padding
    paddingVertical: 4,   // Reduced to match QUIZ pill padding
    gap: 4,               // Reduced gap
  },
  topicIcon: {
    fontSize: 12,         // Reduced to match QUIZ pill text size
  },
  topicTitle: {
    fontSize: 10,         // Reduced to match QUIZ pill text size
    fontWeight: 'bold',   // Changed to bold to match QUIZ pill
    textAlign: 'center',
    letterSpacing: 0.5,   // Added letter spacing to match QUIZ pill
  },
});
