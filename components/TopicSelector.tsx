import React from 'react';
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

export default function TopicSelector({ topics, selectedTopic, onTopicSelect }: TopicSelectorProps) {
  const themeColors = useThemeColors();

  const renderTopicPill = (topic: Topic, index: number) => {
    const isSelected = selectedTopic === topic.id;
    const isFirst = index === 0;

    return (
      <TouchableOpacity
        key={topic.id}
        onPress={() => onTopicSelect(topic.id)}
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
          end={{ x: 1, y: 0 }}
          style={[
            styles.pillGradient,
            !isSelected && { backgroundColor: topic.gradient[0] }
          ]}
        >
          <Text style={styles.topicIcon}>{topic.icon}</Text>
          <Text style={[
            styles.topicTitle,
            { color: isSelected ? '#ffffff' : topic.color }
          ]}>
            {topic.title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {topics.map((topic, index) => renderTopicPill(topic, index))}
      </ScrollView>
    </View>
  );
}

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
    height: 36,
    marginRight: 12,
    borderRadius: 18,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  topicIcon: {
    fontSize: 16,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
