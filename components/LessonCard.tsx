import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, withSpring, runOnJS } from 'react-native-reanimated';
import { Check, Bookmark, ChevronUp, ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useThemeStore } from '@/store/useThemeStore';
import { useProgressStore } from '@/store/useProgressStore';
import { LearnCard } from '@/data/processors/dataLoader';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

interface LessonCardProps {
  lesson: LearnCard;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  index: number;
  isTopCard: boolean;
}

export default function LessonCard({ 
  lesson, 
  onSwipeLeft, 
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  index,
  isTopCard
}: LessonCardProps) {
  const themeColors = useThemeColors();
  const themeMode = useThemeStore((state) => state.mode);
  const router = useRouter();
  const progress = useProgressStore((state) => state.progress);
  const lessonProgress = progress[lesson.id] || { completed: false, bookmarked: false };

  // Animation values
  const pan = useSharedValue({ x: 0, y: 0 });
  const opacity = useSharedValue(1);
  const stackPromotion = useSharedValue(0); // 0 = normal stack, 1 = promoted to top

  // Card stack promotion animation - cards move up from their stack position
  React.useEffect(() => {
    // Reset to stack positions first
    pan.value = { x: 0, y: 0 };
    opacity.value = 1;

    if (index === 0) {
      // Top card - animate from previous stack position (index 1) to top
      stackPromotion.value = 0; // Start as if it was the second card

      // Animate to top position with slight zoom effect
      stackPromotion.value = withSpring(1, {
        damping: 25,
        stiffness: 400,
        mass: 0.8,
        overshootClamping: false,
      });
    } else {
      // Background cards - move up one position in the stack
      stackPromotion.value = 0; // Start at current position

      // Animate to new stack position
      stackPromotion.value = withSpring(1, {
        damping: 30,
        stiffness: 500,
        mass: 0.6,
      });
    }
  }, [lesson.id, index]);

  // Handle card tap navigation
  const handleCardPress = () => {
    if (!isTopCard) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const lessonPath = '/(tabs)/lesson/' + lesson.id;
    router.push(lessonPath as any);
  };

  // Fast and snappy swipe animation
  const animateSwipe = (direction: 'left' | 'right' | 'up' | 'down', callback: () => void) => {
    const targetX = direction === 'left' ? -width * 1.5 : direction === 'right' ? width * 1.5 : 0;
    const targetY = direction === 'up' ? -height * 1.5 : direction === 'down' ? height * 1.5 : 0;

    pan.value = withSpring(
      { x: targetX, y: targetY },
      {
        damping: 30,
        stiffness: 800,
        mass: 0.5,
        overshootClamping: true,
      },
      (finished) => {
        if (finished) {
          runOnJS(callback)();
        }
      }
    );

    opacity.value = withSpring(0, {
      damping: 25,
      stiffness: 600,
    });
  };

  // Fast reset position
  const resetPosition = () => {
    pan.value = withSpring(
      { x: 0, y: 0 },
      {
        damping: 20,
        stiffness: 600,
        mass: 0.6,
        overshootClamping: false,
      }
    );
  };

  // Gesture handler
  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {},
    onActive: (event) => {
      pan.value = { x: event.translationX, y: event.translationY };
    },
    onEnd: (event) => {
      const { translationX, translationY } = event;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Horizontal swipe
        if (translationX > SWIPE_THRESHOLD) {
          runOnJS(animateSwipe)('right', onSwipeRight);
        } else if (translationX < -SWIPE_THRESHOLD) {
          runOnJS(animateSwipe)('left', onSwipeLeft);
        } else {
          runOnJS(resetPosition)();
        }
      } else {
        // Vertical swipe
        if (translationY > SWIPE_THRESHOLD) {
          runOnJS(animateSwipe)('down', onSwipeDown);
        } else if (translationY < -SWIPE_THRESHOLD * 0.6) {
          runOnJS(animateSwipe)('up', onSwipeUp);
        } else {
          runOnJS(resetPosition)();
        }
      }
    },
  });

  // Card stack promotion animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const rotateValue = pan.value.x / 8; // Smoother rotation
    const rotateString = rotateValue + 'deg';

    if (index === 0) {
      // Top card - animate from stack position to top with zoom effect
      const startScale = 1 - 0.05; // Start as if it was the second card (index 1)
      const endScale = 1; // End as the top card
      const currentScale = startScale + (stackPromotion.value * (endScale - startScale));

      const startY = -8; // Start at second card position
      const endY = 0; // End at top position
      const currentY = startY + (stackPromotion.value * (endY - startY));

      return {
        transform: [
          { translateX: pan.value.x },
          { translateY: pan.value.y + currentY },
          { rotate: rotateString },
          { scale: currentScale },
        ],
        opacity: opacity.value,
        zIndex: 10,
      };
    } else {
      // Background cards - move up one position in stack with promotion animation
      const moveDistance = Math.sqrt(pan.value.x * pan.value.x + pan.value.y * pan.value.y);
      const maxDistance = 200;
      const swipeProgress = Math.min(moveDistance / maxDistance, 1);

      // Calculate stack positions
      const startScale = 1 - ((index + 1) * 0.05); // Start at next position down
      const endScale = 1 - (index * 0.05); // End at current position
      const currentScale = startScale + (stackPromotion.value * (endScale - startScale));

      // Add swipe response for Tinder effect
      const finalScale = currentScale + (swipeProgress * 0.03);

      const startY = -(index + 1) * 8; // Start at next position down
      const endY = -index * 8; // End at current position
      const currentY = startY + (stackPromotion.value * (endY - startY));
      const finalY = currentY + (swipeProgress * 4);

      return {
        transform: [
          { translateX: 0 },
          { translateY: finalY },
          { rotate: '0deg' },
          { scale: finalScale },
        ],
        opacity: 1,
        zIndex: 10 - index,
      };
    }
  });

  // Fast and responsive indicator animations (only for top card)
  const leftIndicatorOpacity = useAnimatedStyle(() => {
    if (index !== 0) return { opacity: 0, transform: [{ scale: 0 }] };
    const opacity = Math.max(0, Math.min(1, (-pan.value.x - 30) / 50));
    return {
      opacity,
      transform: [{ scale: 0.9 + opacity * 0.1 }],
    };
  });

  const rightIndicatorOpacity = useAnimatedStyle(() => {
    if (index !== 0) return { opacity: 0, transform: [{ scale: 0 }] };
    const opacity = Math.max(0, Math.min(1, (pan.value.x - 30) / 50));
    return {
      opacity,
      transform: [{ scale: 0.9 + opacity * 0.1 }],
    };
  });

  const upIndicatorOpacity = useAnimatedStyle(() => {
    if (index !== 0) return { opacity: 0, transform: [{ scale: 0 }] };
    const opacity = Math.max(0, Math.min(1, (-pan.value.y - 20) / 40));
    return {
      opacity,
      transform: [{ scale: 0.9 + opacity * 0.1 }],
    };
  });

  const downIndicatorOpacity = useAnimatedStyle(() => {
    if (index !== 0) return { opacity: 0, transform: [{ scale: 0 }] };
    const opacity = Math.max(0, Math.min(1, (pan.value.y - 20) / 40));
    return {
      opacity,
      transform: [{ scale: 0.9 + opacity * 0.1 }],
    };
  });

  const gradientColors = themeMode === 'dark'
    ? ['rgba(30, 30, 30, 1.0)', 'rgba(40, 40, 40, 1.0)']
    : ['rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 1.0)'];

  return (
    <PanGestureHandler onGestureEvent={index === 0 ? gestureHandler : undefined} enabled={index === 0}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <LinearGradient
          colors={gradientColors}
          style={[styles.card, { borderColor: themeColors.border }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity 
            style={styles.cardContent}
            activeOpacity={0.9}
            onPress={handleCardPress}
            disabled={!isTopCard}
          >
            <View style={styles.header}>
              <View style={[styles.dayBadge, { backgroundColor: themeColors.primary }]}>
                <Text style={styles.dayText}>
                  {(lesson as any).topicName ? (lesson as any).topicName.toUpperCase() : `DAY ${lesson.day}`}
                </Text>
              </View>
              <View style={styles.statusIcons}>
                {lesson.quiz && (
                  <View style={[styles.quizPill, { backgroundColor: themeColors.primary }]}>
                    <Text style={styles.quizText}>QUIZ</Text>
                  </View>
                )}
                {lessonProgress.completed && (
                  <View style={styles.statusIcon}>
                    <Check size={16} color={themeColors.success} />
                  </View>
                )}
                {lessonProgress.bookmarked && (
                  <View style={styles.statusIcon}>
                    <Bookmark size={16} color={themeColors.primary} fill={themeColors.primary} />
                  </View>
                )}
              </View>
            </View>

            <Text style={[styles.title, { color: themeColors.text }]}>{lesson.title}</Text>
            <Text style={[styles.summary, { color: themeColors.textSecondary }]}>{lesson.description}</Text>

            <View style={[styles.codePreview, {
              backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#f8f8f8',
              borderColor: themeMode === 'dark' ? '#333' : '#e0e0e0'
            }]}>
              <View style={[styles.codeHeader, {
                backgroundColor: themeMode === 'dark' ? '#2d2d30' : '#f0f0f0',
                borderBottomColor: themeMode === 'dark' ? '#333' : '#e0e0e0'
              }]}>
                <View style={styles.codeControls}>
                  <View style={[styles.codeButton, { backgroundColor: '#ff5f56' }]} />
                  <View style={[styles.codeButton, { backgroundColor: '#ffbd2e' }]} />
                  <View style={[styles.codeButton, { backgroundColor: '#27ca3f' }]} />
                </View>
              </View>
              <View style={styles.codeContent}>
                <View style={styles.lineNumbers}>
                  {(lesson.codeExample || '').split('\n').slice(0, 3).map((_, index) => (
                    <Text key={index} style={[styles.lineNumber, { color: themeMode === 'dark' ? '#858585' : '#999999' }]}>
                      {index + 1}
                    </Text>
                  ))}
                </View>
                <Text style={[styles.codeText, { color: themeMode === 'dark' ? '#d4d4d4' : '#333333' }]}>
                  {(lesson.codeExample || '').split('\n').slice(0, 3).join('\n')}
                  {(lesson.codeExample || '').split('\n').length > 3 ? '\n...' : ''}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Swipe indicators */}
          <Animated.View style={[styles.indicator, styles.leftIndicator, leftIndicatorOpacity]}>
            <View style={styles.iconContainer}>
              <Bookmark size={40} color="#2196F3" fill="none" strokeWidth={2} />
            </View>
            <Text style={styles.indicatorText}>BOOKMARKED</Text>
          </Animated.View>

          <Animated.View style={[styles.indicator, styles.rightIndicator, rightIndicatorOpacity]}>
            <View style={styles.iconContainer}>
              <Check size={40} color="#4CAF50" strokeWidth={2} />
            </View>
            <Text style={styles.indicatorText}>COMPLETED</Text>
          </Animated.View>

          <Animated.View style={[styles.indicator, styles.upIndicator, upIndicatorOpacity]}>
            <ChevronUp size={32} color="#fff" />
            <Text style={styles.indicatorText}>Next Card</Text>
          </Animated.View>

          <Animated.View style={[styles.indicator, styles.downIndicator, downIndicatorOpacity]}>
            <ChevronDown size={32} color="#fff" />
            <Text style={styles.indicatorText}>Previous Card</Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: height * 0.8,
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  quizPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quizText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statusIcon: {
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summary: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  codePreview: {
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  codeControls: {
    flexDirection: 'row',
    gap: 6,
    marginRight: 12,
  },
  codeButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  codeContent: {
    flexDirection: 'row',
    padding: 12,
  },
  lineNumbers: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(128, 128, 128, 0.2)',
    marginRight: 12,
  },
  lineNumber: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'right',
    minWidth: 20,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    padding: 12,
    marginBottom: 8,
  },
  leftIndicator: {
    left: 40,
    top: '50%',
    transform: [{ translateY: -50 }],
  },
  rightIndicator: {
    right: 40,
    top: '50%',
    transform: [{ translateY: -50 }],
  },
  upIndicator: {
    top: 30,
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  downIndicator: {
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  indicatorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
