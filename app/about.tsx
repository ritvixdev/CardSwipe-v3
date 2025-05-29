import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Info,
  Heart,
  Code,
  Star,
  Download,
  ExternalLink,
  Github,
  Twitter,
  Mail,
  Globe,
  Smartphone,
  Calendar,
  Package,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Application from 'expo-application';

import { useThemeColors } from '@/hooks/useThemeColors';
import { analyticsService } from '@/services/AnalyticsService';
import { updateService } from '@/services/UpdateService';

export default function AboutScreen() {
  const themeColors = useThemeColors();
  const [appInfo, setAppInfo] = useState({
    version: '1.0.0',
    buildNumber: '1',
    bundleId: 'com.swipelearn.js',
    platform: Platform.OS,
  });

  useEffect(() => {
    loadAppInfo();
    trackScreenView();
  }, []);

  const loadAppInfo = () => {
    const info = updateService.getAppInfo();
    setAppInfo(info);
  };

  const trackScreenView = () => {
    analyticsService.track('about_screen_viewed');
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleLinkPress = async (url: string, label: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      await Linking.openURL(url);
      analyticsService.track('external_link_opened', { url, label });
    } catch (error) {
      Alert.alert('Error', 'Could not open link');
    }
  };

  const handleCheckUpdates = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    await updateService.manualUpdateCheck();
  };

  const handleRateApp = () => {
    const storeUrl = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/swipelearn-js/id123456789'
      : 'https://play.google.com/store/apps/details?id=com.swipelearn.js';
    
    handleLinkPress(storeUrl, 'Rate App');
  };

  const InfoRow = ({ 
    icon: Icon, 
    label, 
    value, 
    onPress 
  }: { 
    icon: React.ComponentType<any>; 
    label: string; 
    value: string; 
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.infoRow,
        { backgroundColor: themeColors.card },
        !onPress && styles.infoRowDisabled,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.infoRowContent}>
        <Icon size={20} color={themeColors.textSecondary} />
        <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
          {label}
        </Text>
      </View>
      <View style={styles.infoValueContainer}>
        <Text style={[styles.infoValue, { color: themeColors.text }]}>
          {value}
        </Text>
        {onPress && <ExternalLink size={16} color={themeColors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  const LinkButton = ({ 
    icon: Icon, 
    label, 
    url, 
    color 
  }: { 
    icon: React.ComponentType<any>; 
    label: string; 
    url: string; 
    color?: string;
  }) => (
    <TouchableOpacity
      style={[styles.linkButton, { backgroundColor: themeColors.card }]}
      onPress={() => handleLinkPress(url, label)}
    >
      <Icon size={24} color={color || themeColors.primary} />
      <Text style={[styles.linkLabel, { color: themeColors.text }]}>
        {label}
      </Text>
      <ExternalLink size={16} color={themeColors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>
          About SwipeLearn JS
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo and Info */}
        <View style={styles.appSection}>
          <View style={[styles.appIcon, { backgroundColor: themeColors.primary }]}>
            <Code size={48} color="#ffffff" />
          </View>
          
          <Text style={[styles.appName, { color: themeColors.text }]}>
            SwipeLearn JS
          </Text>
          
          <Text style={[styles.appTagline, { color: themeColors.textSecondary }]}>
            Master JavaScript in 30 Days
          </Text>
          
          <Text style={[styles.appDescription, { color: themeColors.textSecondary }]}>
            Transform your JavaScript learning journey with our revolutionary Tinder-style 
            swipe interface. Interactive lessons, engaging quizzes, and a gamified experience 
            that keeps you motivated.
          </Text>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            App Information
          </Text>
          
          <InfoRow
            icon={Package}
            label="Version"
            value={appInfo.version}
          />
          
          <InfoRow
            icon={Calendar}
            label="Build"
            value={appInfo.buildNumber}
          />
          
          <InfoRow
            icon={Smartphone}
            label="Platform"
            value={Platform.OS === 'ios' ? 'iOS' : 'Android'}
          />
          
          <InfoRow
            icon={Download}
            label="Check for Updates"
            value="Tap to check"
            onPress={handleCheckUpdates}
          />
        </View>

        {/* Support & Feedback */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Support & Feedback
          </Text>
          
          <LinkButton
            icon={Star}
            label="Rate on App Store"
            url={Platform.OS === 'ios' 
              ? 'https://apps.apple.com/app/swipelearn-js/id123456789'
              : 'https://play.google.com/store/apps/details?id=com.swipelearn.js'
            }
            color="#f59e0b"
          />
          
          <LinkButton
            icon={Mail}
            label="Contact Support"
            url="mailto:support@swipelearn.app?subject=SwipeLearn JS Support"
            color="#3b82f6"
          />
          
          <LinkButton
            icon={Globe}
            label="Visit Website"
            url="https://swipelearn.app"
            color="#059669"
          />
        </View>

        {/* Social & Community */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Community
          </Text>
          
          <LinkButton
            icon={Github}
            label="Source Code"
            url="https://github.com/swipelearn/swipelearn-js"
            color="#24292e"
          />
          
          <LinkButton
            icon={Twitter}
            label="Follow on Twitter"
            url="https://twitter.com/swipelearn"
            color="#1da1f2"
          />
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Legal
          </Text>
          
          <LinkButton
            icon={Info}
            label="Privacy Policy"
            url="https://swipelearn.app/privacy"
          />
          
          <LinkButton
            icon={Info}
            label="Terms of Service"
            url="https://swipelearn.app/terms"
          />
        </View>

        {/* Credits */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Credits & Acknowledgments
          </Text>
          
          <View style={[styles.creditCard, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.creditTitle, { color: themeColors.text }]}>
              Curriculum
            </Text>
            <Text style={[styles.creditDescription, { color: themeColors.textSecondary }]}>
              Based on "30 Days of JavaScript" by Asabeneh Yetayeh. 
              Thank you for creating such an amazing learning resource!
            </Text>
            <TouchableOpacity
              style={styles.creditLink}
              onPress={() => handleLinkPress(
                'https://github.com/Asabeneh/30-Days-Of-JavaScript',
                'Original Curriculum'
              )}
            >
              <Text style={[styles.creditLinkText, { color: themeColors.primary }]}>
                View Original Curriculum
              </Text>
              <ExternalLink size={14} color={themeColors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.creditCard, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.creditTitle, { color: themeColors.text }]}>
              Open Source Libraries
            </Text>
            <Text style={[styles.creditDescription, { color: themeColors.textSecondary }]}>
              Built with React Native, Expo, and many amazing open source libraries. 
              Special thanks to the React Native and Expo communities.
            </Text>
          </View>
        </View>

        {/* Made with Love */}
        <View style={styles.footer}>
          <View style={styles.madeWithLove}>
            <Text style={[styles.madeWithText, { color: themeColors.textSecondary }]}>
              Made with
            </Text>
            <Heart size={16} color="#ef4444" fill="#ef4444" />
            <Text style={[styles.madeWithText, { color: themeColors.textSecondary }]}>
              for JavaScript learners everywhere
            </Text>
          </View>
          
          <Text style={[styles.copyright, { color: themeColors.inactive }]}>
            © 2024 SwipeLearn. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  appSection: {
    alignItems: 'center',
    padding: 32,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 300,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoRowDisabled: {
    opacity: 1,
  },
  infoRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  linkLabel: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  creditCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  creditTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  creditDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  creditLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  creditLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  madeWithLove: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  madeWithText: {
    fontSize: 14,
  },
  copyright: {
    fontSize: 12,
  },
});
