import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Check, Bookmark, ChevronUp, ChevronDown, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useThemeStore } from '@/store/useThemeStore';
import { useProgressStore } from '@/store/useProgressStore';
import { LearnCard } from '@/data/processors/dataLoader';
import { rewardSystem } from '@/services/RewardSystem';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80; // Reduced for more responsive swiping
const ROTATION_FACTOR = 6; // Reduced for smoother rotation
const SCALE_FACTOR = 0.03; // Reduced for subtler scaling



interface LessonCardProps {
  lesson: LearnCard;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  index: number;
  isTopCard: boolean;
  onXPAwarded?: (xp: number, description: string) => void;
}

function LessonCard({ 
  lesson, 
  onSwipeLeft, 
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  index,
  isTopCard,
  onXPAwarded
}: LessonCardProps) {
  const themeColors = useThemeColors();
  const themeMode = useThemeStore((state) => state.mode);
  const router = useRouter();
  const progress = useProgressStore((state) => state.progress);
  const lessonProgress = progress[lesson.id] || { completed: false, bookmarked: false, liked: false };
  const insets = useSafeAreaInsets();

  // Performance monitoring
  // Simple content truncation function
  const truncateContent = (content: string, maxLength: number): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  // React Compiler handles optimization automatically
  const optimizedContent = (() => {
    // Only truncate if content is lengthy to save processing
    if (lesson.content && lesson.content.length > 650) {
      return truncateContent(lesson.content, 650);
    }
    return lesson.content || lesson.description || '';
  })();
  
  // Calculate available height: screen height - status bar - tab bar - safe areas - extra padding
  const TAB_BAR_HEIGHT = 70;
  const EXTRA_PADDING = 40; // Increased padding to ensure card bottom curve is visible above tab bar
  const availableHeight = height - insets.top - insets.bottom - TAB_BAR_HEIGHT - EXTRA_PADDING;
  
  // React Compiler handles memoization automatically
  const dynamicStyles = StyleSheet.create({
    container: {
      width: width,
      height: availableHeight,
      alignSelf: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
  });

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

      // Android-optimized animation to top position
      const topCardConfig = Platform.OS === 'android'
        ? {
            damping: 20, // Lower damping for smoother animation
            stiffness: 300, // Reduced stiffness for less jarring motion
            mass: 0.6, // Lower mass for quicker response
            overshootClamping: false,
          }
        : {
            damping: 25,
            stiffness: 400,
            mass: 0.8,
            overshootClamping: false,
          };

      stackPromotion.value = withSpring(1, topCardConfig);
    } else {
      // Background cards - move up one position in the stack
      stackPromotion.value = 0; // Start at current position

      // Android-optimized animation to new stack position
      const stackConfig = Platform.OS === 'android'
        ? {
            damping: 25, // Smoother stack transitions
            stiffness: 400, // Reduced stiffness
            mass: 0.5, // Lower mass
          }
        : {
            damping: 30,
            stiffness: 500,
            mass: 0.6,
          };

      stackPromotion.value = withSpring(1, stackConfig);
    }
  }, [lesson.id, index]);

  // Handle card tap navigation
  const handleCardPress = async () => {
    if (!isTopCard) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Award XP for opening the card
    await rewardSystem.awardXP(
      lesson.id,
      'card_opened',
      lesson,
      (xp, description, bonuses) => {
        if (xp > 0 && onXPAwarded) {
          onXPAwarded(xp, description + (bonuses.length > 0 ? ` (${bonuses.join(', ')})` : ''));
        }
      }
    );

    const lessonPath = '/(tabs)/lesson/' + lesson.id;
    router.push(lessonPath as any);
  };

  // Enhanced swipe animation with Android-specific optimizations  
  // React Compiler handles memoization automatically
  const animateSwipe = (direction: 'left' | 'right' | 'up' | 'down', callback: () => void) => {
    const targetX = direction === 'left' ? -width * 1.3 : direction === 'right' ? width * 1.3 : 0;
    const targetY = direction === 'up' ? -height * 1.3 : direction === 'down' ? height * 1.3 : 0;

    // Enhanced haptic feedback for swipe completion
    if (Platform.OS !== 'web') {
      runOnJS(() => {
        if (direction === 'left' || direction === 'right') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      })();
    }

    // Android-optimized spring configuration for smoother animations
    const springConfig = Platform.OS === 'android' 
      ? {
          damping: 20, // Lower damping for more fluid motion on Android
          stiffness: 600, // Reduced stiffness for smoother feel
          mass: 0.3, // Lower mass for quicker response
          overshootClamping: true,
        }
      : {
          damping: 25,
          stiffness: 900,
          mass: 0.4,
          overshootClamping: true,
        };

    pan.value = withSpring(
      { x: targetX, y: targetY },
      springConfig,
      (finished) => {
        if (finished) {
          runOnJS(callback)();
        }
      }
    );

    // Android-optimized opacity animation
    const opacityConfig = Platform.OS === 'android'
      ? { damping: 15, stiffness: 500 }
      : { damping: 20, stiffness: 700 };

    opacity.value = withSpring(0, opacityConfig);
  };

  // Enhanced reset position with Android-optimized spring physics
  // React Compiler handles memoization automatically  
  const resetPosition = () => {
    const resetConfig = Platform.OS === 'android'
      ? {
          damping: 15, // Lower damping for smoother bounce on Android
          stiffness: 500, // Reduced stiffness for more natural feel
          mass: 0.4, // Lower mass for quicker response
          overshootClamping: false,
        }
      : {
          damping: 18,
          stiffness: 700,
          mass: 0.5,
          overshootClamping: false,
        };

    pan.value = withSpring({ x: 0, y: 0 }, resetConfig);
  };

  // Enhanced worklet-based gesture handler for maximum performance
  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      // Worklet optimization: avoid console.log in production
      if (__DEV__) {
        console.log('Gesture started on card index:', index, 'isTopCard:', isTopCard);
      }
    })
    .onUpdate((event) => {
      'worklet';
      // Worklet optimization: use efficient math operations
      const dampingFactor = 0.8; // Slight resistance for better feel
      pan.value = { 
        x: event.translationX * dampingFactor,
        y: event.translationY
      };
    })
    .onEnd((event) => {
      'worklet';
      const { translationX, translationY, velocityX, velocityY } = event;
      
      // Worklet optimization: efficient threshold calculations
      const threshold = 50;
      const velocityThreshold = 300;
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);
      const absVelX = Math.abs(velocityX);
      const absVelY = Math.abs(velocityY);
      
      // Worklet optimization: minimize branching
      if (absX > absY) {
        // Horizontal swipe - prioritize velocity for responsiveness
        const shouldSwipeRight = translationX > threshold || velocityX > velocityThreshold;
        const shouldSwipeLeft = translationX < -threshold || velocityX < -velocityThreshold;
        
        if (shouldSwipeRight) {
          runOnJS(animateSwipe)('right', onSwipeRight);
        } else if (shouldSwipeLeft) {
          runOnJS(animateSwipe)('left', onSwipeLeft);
        } else {
          runOnJS(resetPosition)();
        }
      } else {
        // Vertical swipe - prioritize velocity for responsiveness
        const shouldSwipeDown = translationY > threshold || velocityY > velocityThreshold;
        const shouldSwipeUp = translationY < -threshold || velocityY < -velocityThreshold;
        
        if (shouldSwipeDown) {
          runOnJS(animateSwipe)('down', onSwipeDown);
        } else if (shouldSwipeUp) {
          runOnJS(animateSwipe)('up', onSwipeUp);
        } else {
          runOnJS(resetPosition)();
        }
      }
    })
    .enabled(index === 0); // Only enable gesture for top card

  // Card stack promotion animated styles with Android optimizations
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    // Worklet optimization: pre-calculate frequently used values
    const panX = pan.value.x;
    const panY = pan.value.y;
    const rotateValue = panX / ROTATION_FACTOR;
    const rotateString = `${rotateValue}deg`;

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
          { translateX: panX },
          { translateY: panY + currentY },
          { rotate: rotateString },
          { scale: currentScale },
        ],
        opacity: opacity.value,
        zIndex: 10,
      };
    } else {
      // Background cards - move up one position in stack with promotion animation
      // Worklet optimization: use pre-calculated values
      const moveDistance = Math.sqrt(panX * panX + panY * panY);
      const maxDistance = 180; // Reduced for more responsive scaling
      const swipeProgress = Math.min(moveDistance / maxDistance, 1);

      // Calculate stack positions with improved scaling
      const stackOffset = 0.04; // Slightly reduced for subtler effect
      const startScale = 1 - ((index + 1) * stackOffset); // Start at next position down
      const endScale = 1 - (index * stackOffset); // End at current position
      const currentScale = startScale + (stackPromotion.value * (endScale - startScale));

      // Add swipe response for enhanced Tinder effect
      const finalScale = currentScale + (swipeProgress * SCALE_FACTOR);

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

  // Enhanced indicator animations with Android optimizations
  const leftIndicatorOpacity = useAnimatedStyle(() => {
    'worklet';
    if (index !== 0) return { opacity: 0, transform: [{ scale: 0 }] };
    const opacity = Math.max(0, Math.min(1, (-pan.value.x - 20) / 60)); // More responsive threshold
    const scale = 0.85 + opacity * 0.15; // Enhanced scale range
    return {
      opacity: opacity * 0.95, // Slightly more transparent for better aesthetics
      transform: [{ scale }, { translateX: opacity * -5 }], // Add subtle movement
    };
  });

  const rightIndicatorOpacity = useAnimatedStyle(() => {
    'worklet';
    if (index !== 0) return { opacity: 0, transform: [{ scale: 0 }] };
    const opacity = Math.max(0, Math.min(1, (pan.value.x - 20) / 60)); // More responsive threshold
    const scale = 0.85 + opacity * 0.15; // Enhanced scale range
    return {
      opacity: opacity * 0.95, // Slightly more transparent for better aesthetics
      transform: [{ scale }, { translateX: opacity * 5 }], // Add subtle movement
    };
  });

  const upIndicatorOpacity = useAnimatedStyle(() => {
    'worklet';
    if (index !== 0) return { opacity: 0, transform: [{ scale: 0 }] };
    const opacity = Math.max(0, Math.min(1, (-pan.value.y - 15) / 50)); // More responsive threshold
    const scale = 0.85 + opacity * 0.15; // Enhanced scale range
    return {
      opacity: opacity * 0.95,
      transform: [{ scale }, { translateY: opacity * -3 }], // Add subtle movement
    };
  });

  const downIndicatorOpacity = useAnimatedStyle(() => {
    'worklet';
    if (index !== 0) return { opacity: 0, transform: [{ scale: 0 }] };
    const opacity = Math.max(0, Math.min(1, (pan.value.y - 15) / 50)); // More responsive threshold
    const scale = 0.85 + opacity * 0.15; // Enhanced scale range
    return {
      opacity: opacity * 0.95,
      transform: [{ scale }, { translateY: opacity * 3 }], // Add subtle movement
    };
  });

  const gradientColors = themeMode === 'dark'
    ? ['rgba(30, 30, 30, 1.0)', 'rgba(40, 40, 40, 1.0)']
    : ['rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 1.0)'];

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[dynamicStyles.container, animatedStyle]}>
        <LinearGradient
          colors={gradientColors}
          style={[styles.card, { borderColor: themeColors.border }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity
            style={styles.cardContent}
            activeOpacity={Platform.OS === 'android' ? 0.98 : 0.9}
            onPress={handleCardPress}
            disabled={!isTopCard}
            delayPressIn={Platform.OS === 'android' ? 50 : 0}
            delayPressOut={Platform.OS === 'android' ? 50 : 0}
            testID="lesson-card"
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
                {lessonProgress.liked && (
                  <View style={styles.statusIcon}>
                    <Heart size={16} color="#ef4444" fill="#ef4444" />
                  </View>
                )}
              </View>
            </View>

            <Text style={[styles.title, { color: themeColors.text }]}>{lesson.title}</Text>

            <View style={styles.contentContainer}>
              <Markdown
                style={{
                  body: {
                    fontSize: 16,
                    lineHeight: 24,
                    color: themeColors.textSecondary
                  },
                  heading1: { fontSize: 18, fontWeight: 'bold', color: themeColors.text, marginBottom: 8 },
                  heading2: { fontSize: 16, fontWeight: 'bold', color: themeColors.text, marginBottom: 6 },
                  heading3: { fontSize: 14, fontWeight: 'bold', color: themeColors.text, marginBottom: 4 },
                  strong: { fontWeight: 'bold', color: themeColors.text },
                  bullet_list: { marginBottom: 8 },
                  list_item: { marginBottom: 2, color: themeColors.textSecondary },
                  code_inline: {
                    backgroundColor: themeMode === 'dark' ? '#2d2d30' : '#f0f0f0',
                    color: themeMode === 'dark' ? '#d4d4d4' : '#333333',
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: 4,
                    fontSize: 13,
                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
                  },
                  code_block: { display: 'none' },
                  fence: { display: 'none' },
                }}
              >
                {optimizedContent}
              </Markdown>
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
              <Heart size={40} color="#ef4444" fill="none" strokeWidth={2} />
            </View>
            <Text style={styles.indicatorText}>LIKED</Text>
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
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: 20, // Add padding to prevent overflow
  },
  contentContainer: {
    flex: 1,
    marginTop: 8,
    overflow: 'hidden', // Prevent content overflow
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dayText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
    marginBottom: 40, // Small readable gap between title and description
  },
  summary: {
    fontSize: 16,
    marginBottom: 16, // Reduced from 24 to 16
    lineHeight: 24,
    flex: 1, // Allow summary to take available space
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

export default LessonCard;
