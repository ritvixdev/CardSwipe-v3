import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Alert, Platform, Linking, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  Info, 
  Heart,
  Shuffle,
  Moon,
  Sun,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Shield,
  FileText,
  Star,
  Share2,
  Mail,
  Download,
  Smartphone,
  Code
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Application from 'expo-application';
import { shuffleLessons } from '@/data/lessons';

export default function ProfileScreen() {
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const themeMode = useThemeStore((state) => state.mode);
  const setTheme = useThemeStore((state) => state.setTheme);
  const themeColors = useThemeColors();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const handleResetProgress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your learning progress? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          onPress: () => {
            resetProgress();
            Alert.alert("Progress Reset", "Your learning progress has been reset.");
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleShuffleLessons = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    shuffleLessons();
    Alert.alert("Lessons Shuffled", "The lesson order has been randomized for a fresh learning experience!");
  };

  const handleThemeToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const handleNotificationToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleSoundToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSoundEnabled(!soundEnabled);
  };

  const handleHapticToggle = () => {
    const newHapticEnabled = !hapticEnabled;
    setHapticEnabled(newHapticEnabled);
    
    if (newHapticEnabled && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleShareApp = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      await Share.share({
        message: 'Check out SwipeLearn JS - Master JavaScript in 30 days with Tinder-style learning! 🚀',
        title: 'SwipeLearn JS - Learn JavaScript',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const handleRateApp = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const storeUrl = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/swipelearn-js/id123456789'
      : 'https://play.google.com/store/apps/details?id=com.swipelearn.js';
    
    try {
      await Linking.openURL(storeUrl);
    } catch (error) {
      Alert.alert('Error', 'Could not open app store');
    }
  };

  const handleContactSupport = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const subject = 'SwipeLearn JS Support';
    const body = `Hi SwipeLearn team,\n\nI need help with:\n\nDevice: ${Platform.OS}\nApp Version: ${Application.nativeApplicationVersion}\n\nDescription:\n`;
    
    try {
      await Linking.openURL(`mailto:support@swipelearn.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    } catch (error) {
      Alert.alert('Error', 'Could not open email client');
    }
  };

  const handleLinkPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open link');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Sticky Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: themeColors.text }]}>Profile</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>App Preferences</Text>
          
          <View style={[styles.settingItem, { backgroundColor: themeColors.card }]}>
            <View style={styles.settingContent}>
              {themeMode === 'dark' ? (
                <Moon size={22} color={themeColors.text} />
              ) : (
                <Sun size={22} color={themeColors.text} />
              )}
              <Text style={[styles.settingText, { color: themeColors.text }]}>
                {themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#767577', true: themeColors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: themeColors.card }]}>
            <View style={styles.settingContent}>
              {notificationsEnabled ? (
                <Bell size={22} color={themeColors.text} />
              ) : (
                <BellOff size={22} color={themeColors.text} />
              )}
              <Text style={[styles.settingText, { color: themeColors.text }]}>
                Learning Reminders
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#767577', true: themeColors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: themeColors.card }]}>
            <View style={styles.settingContent}>
              {soundEnabled ? (
                <Volume2 size={22} color={themeColors.text} />
              ) : (
                <VolumeX size={22} color={themeColors.text} />
              )}
              <Text style={[styles.settingText, { color: themeColors.text }]}>
                Sound Effects
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: '#767577', true: themeColors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: themeColors.card }]}>
            <View style={styles.settingContent}>
              <Smartphone size={22} color={themeColors.text} />
              <Text style={[styles.settingText, { color: themeColors.text }]}>
                Haptic Feedback
              </Text>
            </View>
            <Switch
              value={hapticEnabled}
              onValueChange={handleHapticToggle}
              trackColor={{ false: '#767577', true: themeColors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>

        {/* Learning */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Learning</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: themeColors.card }]} 
            onPress={handleShuffleLessons}
          >
            <View style={styles.settingContent}>
              <Shuffle size={22} color={themeColors.text} />
              <Text style={[styles.settingText, { color: themeColors.text }]}>Shuffle Lessons</Text>
            </View>
            <ExternalLink size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: themeColors.card }]} 
            onPress={handleResetProgress}
          >
            <View style={styles.settingContent}>
              <RefreshCw size={22} color={themeColors.text} />
              <Text style={[styles.settingText, { color: themeColors.text }]}>Reset Progress</Text>
            </View>
            <ExternalLink size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Support & Feedback */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Support & Feedback</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: themeColors.card }]} 
            onPress={handleRateApp}
          >
            <View style={styles.settingContent}>
              <Star size={22} color={themeColors.text} />
              <Text style={[styles.settingText, { color: themeColors.text }]}>Rate SwipeLearn JS</Text>
            </View>
            <ExternalLink size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: themeColors.card }]} 
            onPress={handleShareApp}
          >
            <View style={styles.settingContent}>
              <Share2 size={22} color={themeColors.text} />
              <Text style={[styles.settingText, { color: themeColors.text }]}>Share with Friends</Text>
            </View>
            <ExternalLink size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: themeColors.card }]} 
            onPress={handleContactSupport}
          >
            <View style={styles.settingContent}>
              <Mail size={22} color={themeColors.text} />
              <Text style={[styles.settingText, { color: themeColors.text }]}>Contact Support</Text>
            </View>
            <ExternalLink size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>About</Text>
          
          <View style={[styles.aboutCard, { backgroundColor: themeColors.card }]}>
            <View style={[styles.appIcon, { backgroundColor: themeColors.primary }]}>
              <Code size={32} color="#ffffff" />
            </View>
            <View style={styles.aboutContent}>
              <Text style={[styles.appName, { color: themeColors.text }]}>SwipeLearn JS</Text>
              <Text style={[styles.appVersion, { color: themeColors.textSecondary }]}>
                Version {Application.nativeApplicationVersion || '1.0.0'}
              </Text>
              <Text style={[styles.appDescription, { color: themeColors.textSecondary }]}>
                Master JavaScript in 30 days with Tinder-style swipe learning
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: themeColors.card }]} 
            onPress={() => handleLinkPress('https://swipelearn.app/privacy')}
          >
            <View style={styles.settingContent}>
              <Shield size={22} color={themeColors.text} />
              <Text style={[styles.settingText, { color: themeColors.text }]}>Privacy Policy</Text>
            </View>
            <ExternalLink size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: themeColors.card }]} 
            onPress={() => handleLinkPress('https://swipelearn.app/terms')}
          >
            <View style={styles.settingContent}>
              <FileText size={22} color={themeColors.text} />
              <Text style={[styles.settingText, { color: themeColors.text }]}>Terms of Service</Text>
            </View>
            <ExternalLink size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Made with Love */}
        <View style={styles.footer}>
          <View style={styles.madeWithLove}>
            <Text style={[styles.madeWithText, { color: themeColors.textSecondary }]}>
              Made with
            </Text>
            <Heart size={16} color="#ef4444" fill="#ef4444" />
            <Text style={[styles.madeWithText, { color: themeColors.textSecondary }]}>
              for JavaScript learners
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  aboutCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  aboutContent: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  madeWithLove: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  madeWithText: {
    fontSize: 14,
  },
});
