import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';

interface XPNotificationProps {
  visible: boolean;
  xpGained: number;
  onComplete: () => void;
}

export default function XPNotification({ visible, xpGained, onComplete }: XPNotificationProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hold for a moment, then animate out
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -50,
              duration: 300,
              useNativeDriver: true,
            }),
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
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <View style={styles.notification}>
        <Star size={24} color="#FFD700" fill="#FFD700" />
        <Text style={styles.xpText}>+{xpGained} XP</Text>
      </View>
    </Animated.View>
  );
}

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
