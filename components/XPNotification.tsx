import React, { useEffect, useRef, memo, useMemo } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';

interface XPNotificationProps {
  visible: boolean;
  xpGained: number;
  onComplete: () => void;
}

const XPNotification = memo(function XPNotification({ visible, xpGained, onComplete }: XPNotificationProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  // Memoize animation configurations for better performance
  const animationConfig = useMemo(() => ({
    fadeIn: {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    },
    slideIn: {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    },
    scaleIn: {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    },
    fadeOut: {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    },
    slideOut: {
      toValue: -50,
      duration: 300,
      useNativeDriver: true,
    }
  }), []);

  // Memoize animated styles to prevent recreation
  const animatedStyle = useMemo(() => ({
    opacity,
    transform: [
      { translateY },
      { scale }
    ]
  }), [opacity, translateY, scale]);

  useEffect(() => {
    if (visible) {
      // Animate in using memoized configurations
      Animated.parallel([
        Animated.timing(opacity, animationConfig.fadeIn),
        Animated.timing(translateY, animationConfig.slideIn),
        Animated.spring(scale, animationConfig.scaleIn),
      ]).start(() => {
        // Hold for a moment, then animate out
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, animationConfig.fadeOut),
            Animated.timing(translateY, animationConfig.slideOut),
          ]).start(() => {
            onComplete();
            // Reset values for next time
            opacity.setValue(0);
            translateY.setValue(50);
            scale.setValue(0.5);
          });
        }, 1500);
      });
    }
  }, [visible, onComplete, animationConfig]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle
      ]}
    >
      <View style={styles.notification}>
        <Star size={24} color="#FFD700" fill="#FFD700" />
        <Text style={styles.xpText}>+{xpGained} XP</Text>
      </View>
    </Animated.View>
  );
});

export default XPNotification;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  notification: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  xpText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
