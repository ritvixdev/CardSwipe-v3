import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronRight, 
  ChevronLeft, 
  Smartphone, 
  Zap, 
  Target, 
  Star,
  Code,
  TrendingUp
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { analyticsService } from '@/services/AnalyticsService';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  animation?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to SwipeLearn JS',
    subtitle: 'Your JavaScript Journey Starts Here',
    description: 'Master JavaScript in 30 days with our revolutionary Tinder-style learning experience. Swipe, learn, and grow!',
    icon: Code,
    color: '#2563eb',
  },
  {
    id: 'swipe',
    title: 'Swipe to Learn',
    subtitle: 'Intuitive Gesture-Based Learning',
    description: 'Swipe left to complete lessons, right to bookmark, up for next, and down for previous. Learning has never been this natural!',
    icon: Smartphone,
    color: '#059669',
  },
  {
    id: 'gamification',
    title: 'Earn XP & Build Streaks',
    subtitle: 'Gamified Learning Experience',
    description: 'Earn experience points, maintain learning streaks, and unlock achievements. Stay motivated with our reward system!',
    icon: Star,
    color: '#dc2626',
  },
  {
    id: 'progress',
    title: 'Track Your Progress',
    subtitle: 'See Your Growth',
    description: 'Monitor your learning journey with detailed analytics, progress tracking, and personalized insights.',
    icon: TrendingUp,
    color: '#7c3aed',
  },
  {
    id: 'ready',
    title: 'Ready to Start?',
    subtitle: 'Let\'s Begin Your Journey',
    description: 'You\'re all set! Start with Day 1 and begin your transformation into a JavaScript master.',
    icon: Zap,
    color: '#ea580c',
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const themeColors = useThemeColors();
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Track onboarding start
    analyticsService.track('onboarding_started');
    
    // Start icon rotation animation
    const rotationLoop = Animated.loop(
      Animated.timing(iconRotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    );
    rotationLoop.start();

    return () => rotationLoop.stop();
  }, []);

  useEffect(() => {
    // Track step viewed
    analyticsService.track('onboarding_step_viewed', {
      step: currentStep,
      step_id: onboardingSteps[currentStep].id,
    });

    // Animate step transition
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      animateTransition(() => setCurrentStep(currentStep + 1));
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      animateTransition(() => setCurrentStep(currentStep - 1));
    }
  };

  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleComplete = () => {
    analyticsService.track('onboarding_completed', {
      total_steps: onboardingSteps.length,
      completion_rate: 1,
    });
    onComplete();
  };

  const handleSkip = () => {
    analyticsService.track('onboarding_skipped', {
      step: currentStep,
      completion_rate: currentStep / onboardingSteps.length,
    });
    onSkip();
  };

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;

  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: themeColors.textSecondary }]}>
          Skip
        </Text>
      </TouchableOpacity>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor: index <= currentStep 
                  ? step.color 
                  : themeColors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: step.color },
            { transform: [{ rotate: iconRotation }] },
          ]}
        >
          <IconComponent size={64} color="#ffffff" />
        </Animated.View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {step.title}
          </Text>
          
          <Text style={[styles.subtitle, { color: step.color }]}>
            {step.subtitle}
          </Text>
          
          <Text style={[styles.description, { color: themeColors.textSecondary }]}>
            {step.description}
          </Text>
        </View>
      </Animated.View>

      {/* Navigation */}
      <View style={styles.navigation}>
        {/* Previous Button */}
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.prevButton,
            { 
              backgroundColor: currentStep > 0 ? themeColors.card : 'transparent',
              opacity: currentStep > 0 ? 1 : 0.3,
            },
          ]}
          onPress={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={24} color={themeColors.text} />
        </TouchableOpacity>

        {/* Step Indicator */}
        <Text style={[styles.stepIndicator, { color: themeColors.textSecondary }]}>
          {currentStep + 1} of {onboardingSteps.length}
        </Text>

        {/* Next/Complete Button */}
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            { backgroundColor: step.color },
          ]}
          onPress={nextStep}
        >
          {currentStep === onboardingSteps.length - 1 ? (
            <Text style={styles.completeText}>Start</Text>
          ) : (
            <ChevronRight size={24} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Gesture Instructions */}
      {currentStep === 1 && (
        <View style={styles.gestureHints}>
          <View style={styles.gestureHint}>
            <Text style={[styles.gestureText, { color: themeColors.textSecondary }]}>
              👈 Complete
            </Text>
          </View>
          <View style={styles.gestureHint}>
            <Text style={[styles.gestureText, { color: themeColors.textSecondary }]}>
              👉 Bookmark
            </Text>
          </View>
          <View style={styles.gestureHint}>
            <Text style={[styles.gestureText, { color: themeColors.textSecondary }]}>
              👆 Next
            </Text>
          </View>
          <View style={styles.gestureHint}>
            <Text style={[styles.gestureText, { color: themeColors.textSecondary }]}>
              👇 Previous
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 48,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 32,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  prevButton: {
    // Styles handled dynamically
  },
  nextButton: {
    // Styles handled dynamically
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: '600',
  },
  completeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gestureHints: {
    position: 'absolute',
    bottom: 120,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gestureHint: {
    alignItems: 'center',
  },
  gestureText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
