import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, withSpring, runOnJS } from 'react-native-reanimated';
import { Check, Bookmark, ChevronUp, ChevronDown, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useThemeStore } from '@/store/useThemeStore';
import { useProgressStore } from '@/store/useProgressStore';
import { LearnCard } from '@/data/processors/dataLoader';

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
  const lessonProgress = progress[lesson.id] || { completed: false, bookmarked: false, liked: false };
  const insets = useSafeAreaInsets();
  
  // Calculate available height: screen height - status bar - tab bar - safe areas - extra padding
  const TAB_BAR_HEIGHT = 70;
  const EXTRA_PADDING = 40; // Increased padding to ensure card bottom curve is visible above tab bar
  const availableHeight = height - insets.top - insets.bottom - TAB_BAR_HEIGHT - EXTRA_PADDING;
  
  // Create dynamic styles with calculated height
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

  // Enhanced swipe animation with improved responsiveness
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

    pan.value = withSpring(
      { x: targetX, y: targetY },
      {
        damping: 25, // Slightly reduced for smoother exit
        stiffness: 900, // Increased for snappier response
        mass: 0.4, // Reduced for lighter feel
        overshootClamping: true,
      },
      (finished) => {
        if (finished) {
          runOnJS(callback)();
        }
      }
    );

    opacity.value = withSpring(0, {
      damping: 20, // Faster fade out
      stiffness: 700,
    });
  };

  // Enhanced reset position with improved spring physics
  const resetPosition = () => {
    pan.value = withSpring(
      { x: 0, y: 0 },
      {
        damping: 18, // Slightly reduced for more natural bounce
        stiffness: 700, // Increased for snappier return
        mass: 0.5, // Reduced for lighter feel
        overshootClamping: false, // Allow slight overshoot for natural feel
      }
    );
  };

  // Gesture handler
  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      // Add subtle haptic feedback on gesture start
      if (Platform.OS !== 'web') {
        runOnJS(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light))();
      }
    },
    onActive: (event) => {
      // Smooth interpolation for better responsiveness
      pan.value = { 
        x: event.translationX * 0.8, // Slightly dampen for smoother feel
        y: event.translationY * 0.8 
      };
    },
    onEnd: (event) => {
      const { translationX, translationY, velocityX, velocityY } = event;
      
      // Enhanced velocity-based detection for more natural swiping
      const velocityThreshold = 800;
      const isQuickSwipe = Math.abs(velocityX) > velocityThreshold || Math.abs(velocityY) > velocityThreshold;
      const adjustedThreshold = isQuickSwipe ? SWIPE_THRESHOLD * 0.6 : SWIPE_THRESHOLD;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Horizontal swipe
        if (translationX > adjustedThreshold || velocityX > velocityThreshold) {
          runOnJS(animateSwipe)('right', onSwipeRight);
        } else if (translationX < -adjustedThreshold || velocityX < -velocityThreshold) {
          runOnJS(animateSwipe)('left', onSwipeLeft);
        } else {
          runOnJS(resetPosition)();
        }
      } else {
        // Vertical swipe
        if (translationY > adjustedThreshold || velocityY > velocityThreshold) {
          runOnJS(animateSwipe)('down', onSwipeDown);
        } else if (translationY < -adjustedThreshold * 0.7 || velocityY < -velocityThreshold * 0.7) {
          runOnJS(animateSwipe)('up', onSwipeUp);
        } else {
          runOnJS(resetPosition)();
        }
      }
    },
  });

  // Card stack promotion animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const rotateValue = pan.value.x / ROTATION_FACTOR; // Use constant for consistent rotation
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

  // Enhanced indicator animations with improved responsiveness
  const leftIndicatorOpacity = useAnimatedStyle(() => {
    if (index !== 0) return { opacity: 0, transform: [{ scale: 0 }] };
    const opacity = Math.max(0, Math.min(1, (-pan.value.x - 20) / 60)); // More responsive threshold
    const scale = 0.85 + opacity * 0.15; // Enhanced scale range
    return {
      opacity: opacity * 0.95, // Slightly more transparent for better aesthetics
      transform: [{ scale }, { translateX: opacity * -5 }], // Add subtle movement
    };
  });

  const rightIndicatorOpacity = useAnimatedStyle(() => {
    if (index !== 0) return { opacity: 0, transform: [{ scale: 0 }] };
    const opacity = Math.max(0, Math.min(1, (pan.value.x - 20) / 60)); // More responsive threshold
    const scale = 0.85 + opacity * 0.15; // Enhanced scale range
    return {
      opacity: opacity * 0.95, // Slightly more transparent for better aesthetics
      transform: [{ scale }, { translateX: opacity * 5 }], // Add subtle movement
    };
  });

  const upIndicatorOpacity = useAnimatedStyle(() => {
    if (index !== 0) return { opacity: 0, transform: [{ scale: 0 }] };
    const opacity = Math.max(0, Math.min(1, (-pan.value.y - 15) / 50)); // More responsive threshold
    const scale = 0.85 + opacity * 0.15; // Enhanced scale range
    return {
      opacity: opacity * 0.95,
      transform: [{ scale }, { translateY: opacity * -3 }], // Add subtle movement
    };
  });

  const downIndicatorOpacity = useAnimatedStyle(() => {
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
    <PanGestureHandler onGestureEvent={index === 0 ? gestureHandler : undefined} enabled={index === 0}>
      <Animated.View style={[dynamicStyles.container, animatedStyle]}>
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
                  code_block: { display: 'none' }, // Hide code blocks in card view
                  fence: { display: 'none' }, // Hide fenced code blocks
                }}
              >
                {(() => {
                  const content = lesson.content || lesson.description || '';
                  const maxLength = 650; // Optimal length based on analysis
                  if (content.length <= maxLength) {
                    return content;
                  }
                  // Find a good breaking point (end of sentence or paragraph)
                  const truncated = content.substring(0, maxLength);
                  const lastSentence = truncated.lastIndexOf('.');
                  const lastParagraph = truncated.lastIndexOf('\n\n');
                  const breakPoint = Math.max(lastSentence, lastParagraph);

                  if (breakPoint > maxLength * 0.8) {
                    return content.substring(0, breakPoint + 1) + '\n\n*Tap to read more...*';
                  }
                  return truncated + '...\n\n*Tap to read more...*';
                })()}
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
    </PanGestureHandler>
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
