import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/hooks/useThemeColors';

interface LearnHeaderProps {
  topics: any[];
  selectedTopic: string;
  onTopicSelect: (topicId: string) => void;
}

export default function LearnHeader({
  topics,
  selectedTopic,
  onTopicSelect,
}: LearnHeaderProps) {
  const themeColors = useThemeColors();

  const renderTopicPill = (topic: any, index: number) => {
    const isSelected = selectedTopic === topic.id;

    return (
      <TouchableOpacity
        key={topic.id}
        onPress={() => onTopicSelect(topic.id)}
        style={styles.topicPill}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={isSelected ?
            [themeColors.primary, themeColors.primary] :
            [themeColors.card, themeColors.card]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.pillGradient,
            isSelected && styles.selectedPillGradient
          ]}
        >
          <View style={[
            styles.pillContent,
            isSelected && styles.selectedPillContent
          ]}>
            <Text style={[
              styles.topicTitle,
              {
                color: isSelected ? '#ffffff' : themeColors.text,
                fontWeight: isSelected ? '700' : '600'
              }
            ]}>
              {topic.title}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Title Row with Inline Pill Selector */}
      <View style={styles.titleRow}>
        {/* Static Title Section */}
        <Text style={[styles.mainTitle, { color: themeColors.text }]} numberOfLines={1}>
          JS Learning
        </Text>

        {/* Pill Selector Container - Takes Remaining Space */}
        <View style={styles.pillSelectorContainer}>
          {/* Left Fade Effect */}
          <LinearGradient
            colors={[themeColors.background, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.leftFade}
            pointerEvents="none"
          />

          {/* Scrollable Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsContent}
            style={styles.pillsScrollView}
            decelerationRate={0.85}
            snapToInterval={70} // Adjusted for dynamic pill widths
            snapToAlignment="center"
            bounces={false}
            scrollEventThrottle={16}
          >
            {topics.map((topic, index) => renderTopicPill(topic, index))}
          </ScrollView>

          {/* Right Fade Effect */}
          <LinearGradient
            colors={['transparent', themeColors.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rightFade}
            pointerEvents="none"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    flexShrink: 0, // Prevents title from shrinking
  },
  pillSelectorContainer: {
    position: 'relative',
    height: 35,
    flex: 1, // Takes remaining space
    minWidth: 180, // Minimum width for pills
    alignSelf: 'center',
  },
  leftFade: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 40,
    zIndex: 2,
  },
  rightFade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
    zIndex: 2,
  },
  pillsScrollView: {
    flex: 1,
  },
  pillsContent: {
    alignItems: 'center',
    paddingHorizontal: 45,
  },
  topicPill: {
    height: 28,
    marginRight: 8,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pillGradient: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  selectedPillGradient: {
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  pillContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 50,
  },
  selectedPillContent: {
    transform: [{ scale: 1.02 }],
  },
  topicTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
