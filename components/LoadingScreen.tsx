import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Code, Zap, Star } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
  message?: string;
  progress?: number;
}

export default function LoadingScreen({ 
  message = "Loading your learning journey...", 
  progress = 0 
}: LoadingScreenProps) {
  const themeColors = useThemeColors();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Start continuous rotation
    const rotationLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    rotationLoop.start();

    // Start pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => {
      rotationLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Logo and Icon */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.iconContainer,
              { backgroundColor: themeColors.primary },
              { transform: [{ rotate: spin }, { scale: pulseAnim }] }
            ]}
          >
            <Code size={48} color="#ffffff" />
          </Animated.View>
          
          <Text style={[styles.appName, { color: themeColors.text }]}>
            SwipeLearn JS
          </Text>
          
          <Text style={[styles.tagline, { color: themeColors.textSecondary }]}>
            Master JavaScript in 30 Days
          </Text>
        </View>

        {/* Feature Icons */}
        <View style={styles.featuresContainer}>
          <Animated.View 
            style={[
              styles.featureIcon,
              { backgroundColor: themeColors.card },
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Zap size={24} color={themeColors.primary} />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.featureIcon,
              { backgroundColor: themeColors.card },
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Star size={24} color={themeColors.primary} />
          </Animated.View>
        </View>

        {/* Loading Message */}
        <Text style={[styles.message, { color: themeColors.textSecondary }]}>
          {message}
        </Text>

        {/* Progress Bar */}
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: themeColors.border }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { backgroundColor: themeColors.primary },
                  { width: progressWidth }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: themeColors.textSecondary }]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        )}

        {/* Loading Dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: themeColors.primary },
                {
                  transform: [{
                    scale: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [0.8, 1.2],
                    })
                  }]
                }
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  featureIcon: {
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
