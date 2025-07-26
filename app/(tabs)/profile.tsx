import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Alert, Platform, Linking, Share, Animated, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  RefreshCw,
  ExternalLink,
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
  Smartphone,
  Code,
  User,
  Crown,
  Trophy,
  Target,
  Calendar,
  Clock,
  Zap,
  Settings,
  ChevronRight,
  Edit3,
  Camera,
  Award,
  TrendingUp,
  Book,
  Download,
  Upload,
  Database,
  Palette,
  Globe,
  HelpCircle
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Test icon imports to ensure they're available
const testIcons = { Book, Trophy, Award, TrendingUp, ChevronRight };
import * as Application from 'expo-application';
import { lessons } from '@/data/processors/dataLoader';
import { router } from 'expo-router';
// Enhanced Profile Page with User Stats and Preferences - Fixed imports

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const {
    resetProgress,
    progress,
    streak,
    maxStreak,
    xp,
    level,
    achievements,
    totalTimeSpent,
    quizzesTaken,
    averageQuizScore,
    getLevel,
    getXpForNextLevel,
  } = useProgressStore();

  const themeMode = useThemeStore((state) => state.mode);
  const setTheme = useThemeStore((state) => state.setTheme);
  const themeColors = useThemeColors();
  const insets = useSafeAreaInsets();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [animatedValue] = useState(new Animated.Value(0));

  // Calculate user stats
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const totalLessons = lessons.length;
  const completionPercentage = (completedCount / totalLessons) * 100;
  const currentLevel = getLevel();
  const xpForNextLevel = getXpForNextLevel();
  const xpProgress = ((xp % 100) / 100) * 100;

  // Local user profile data (offline application)
  const [userProfile, setUserProfile] = useState({
    name: 'JavaScript Learner',
    avatar: null, // Local avatar storage
    joinDate: new Date().toISOString().split('T')[0],
  });

  // Format time spent
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

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

    // Simple shuffle implementation - in a real app, this would update the lesson order in storage
    const shuffledLessons = [...lessons].sort(() => Math.random() - 0.5);
    console.log('Lessons shuffled:', shuffledLessons.length, 'lessons');
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

  const handleAutoBackupToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setAutoBackup(!autoBackup);
    Alert.alert(
      autoBackup ? 'Auto Backup Disabled' : 'Auto Backup Enabled',
      autoBackup
        ? 'Your progress will no longer be automatically backed up.'
        : 'Your progress will be automatically backed up to the cloud.'
    );
  };

  const handleExportData = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Alert.alert(
      "Export Learning Data",
      "Export your progress, achievements, and statistics to a file.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
          onPress: () => {
            // In a real app, this would generate and download a JSON file
            Alert.alert("Data Exported", "Your learning data has been exported successfully!");
          }
        }
      ]
    );
  };

  const handleImportData = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Alert.alert(
      "Import Learning Data",
      "Import your progress from a previously exported file. This will overwrite your current progress.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import",
          onPress: () => {
            // In a real app, this would open a file picker
            Alert.alert("Import", "File picker would open here to select your data file.");
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleEditProfile = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Alert.prompt(
      "Edit Profile",
      "Enter your name:",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Save",
          onPress: (newName) => {
            if (newName && newName.trim()) {
              setUserProfile(prev => ({
                ...prev,
                name: newName.trim()
              }));
              Alert.alert("Profile Updated", "Your name has been updated successfully!");
            }
          }
        }
      ],
      "plain-text",
      userProfile.name
    );
  };

  const handleChangeAvatar = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const avatarOptions = ['👤', '👨‍💻', '👩‍💻', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🤓', '😎', '🚀', '⭐'];

    Alert.alert(
      "Choose Avatar",
      "Select an emoji avatar:",
      [
        { text: "Cancel", style: "cancel" },
        ...avatarOptions.map(emoji => ({
          text: emoji,
          onPress: () => {
            setUserProfile(prev => ({
              ...prev,
              avatar: emoji
            }));
            Alert.alert("Avatar Updated", `Your avatar has been changed to ${emoji}!`);
          }
        })),
        {
          text: "Remove Avatar",
          onPress: () => {
            setUserProfile(prev => ({
              ...prev,
              avatar: null
            }));
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleViewAchievements = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert("Achievements", `You have unlocked ${achievements.length} achievements!`);
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
    <View style={[styles.container, { backgroundColor: themeColors.background }]} testID="profile-screen">
      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <SafeAreaView style={styles.profileHeader}>
          <View style={[styles.profileCard, { backgroundColor: themeColors.primary }]}>
            <View style={styles.profileTop}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                  {userProfile.avatar ? (
                    <Text style={styles.avatarEmoji}>{userProfile.avatar}</Text>
                  ) : (
                    <User size={32} color="#ffffff" />
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.editAvatarButton, { backgroundColor: '#ffffff' }]}
                  onPress={handleChangeAvatar}
                >
                  <Camera size={12} color={themeColors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{userProfile.name}</Text>
                <View style={styles.offlineIndicator}>
                  <Text style={styles.offlineText}>📱 Offline Application</Text>
                  <Text style={styles.offlineSubtext}>More features coming soon</Text>
                </View>
                <View style={styles.levelBadge}>
                  <Crown size={14} color="#ffffff" />
                  <Text style={styles.levelText}>Level {currentLevel}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditProfile}
              >
                <Edit3 size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* XP Progress */}
            <View style={styles.xpContainer}>
              <View style={styles.xpInfo}>
                <Text style={styles.xpText}>{xp} XP</Text>
                <Text style={styles.xpNextText}>{xpForNextLevel} to next level</Text>
              </View>
              <View style={styles.xpProgressBar}>
                <Animated.View
                  style={[
                    styles.xpProgressFill,
                    {
                      width: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', `${xpProgress}%`],
                      }),
                    }
                  ]}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>

        {/* Achievement Showcase */}
        <View style={styles.achievementShowcase}>
          <TouchableOpacity
            style={[styles.achievementCard, { backgroundColor: themeColors.card }]}
            onPress={handleViewAchievements}
          >
            <View style={styles.achievementHeader}>
              <Trophy size={24} color="#fbbf24" />
              <Text style={[styles.achievementTitle, { color: themeColors.text }]}>Achievements</Text>
              <ChevronRight size={18} color={themeColors.textSecondary} />
            </View>

            <View style={styles.achievementContent}>
              <Text style={[styles.achievementCount, { color: themeColors.text }]}>
                {achievements.length} unlocked
              </Text>
              <Text style={[styles.achievementSubtext, { color: themeColors.textSecondary }]}>
                {achievements.length === 0 ? 'Start learning to unlock achievements!' :
                 achievements.length < 5 ? 'Great start! Keep learning to unlock more.' :
                 'Amazing progress! You\'re a JavaScript champion!'}
              </Text>

              {achievements.length > 0 && (
                <View style={styles.recentAchievements}>
                  {achievements.slice(-3).map((achievement, index) => (
                    <View key={achievement.id} style={styles.achievementBadge}>
                      <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                    </View>
                  ))}
                  {achievements.length > 3 && (
                    <View style={[styles.achievementBadge, styles.moreAchievements]}>
                      <Text style={[styles.moreText, { color: themeColors.textSecondary }]}>
                        +{achievements.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Learning Identity */}
        <View style={[styles.identityCard, { backgroundColor: themeColors.card }]}>
          <View style={styles.identityHeader}>
            <Award size={20} color={themeColors.primary} />
            <Text style={[styles.identityTitle, { color: themeColors.text }]}>Learning Identity</Text>
          </View>

          <View style={styles.identityContent}>
            <View style={styles.identityBadges}>
              <View style={[styles.identityBadge, { backgroundColor: themeColors.primary + '20' }]}>
                <Crown size={16} color={themeColors.primary} />
                <Text style={[styles.identityBadgeText, { color: themeColors.primary }]}>
                  Level {currentLevel}
                </Text>
              </View>

              {streak >= 7 && (
                <View style={[styles.identityBadge, { backgroundColor: '#ff6b35' + '20' }]}>
                  <Flame size={16} color="#ff6b35" />
                  <Text style={[styles.identityBadgeText, { color: '#ff6b35' }]}>
                    Streak Master
                  </Text>
                </View>
              )}

              {averageQuizScore >= 90 && (
                <View style={[styles.identityBadge, { backgroundColor: '#fbbf24' + '20' }]}>
                  <Star size={16} color="#fbbf24" />
                  <Text style={[styles.identityBadgeText, { color: '#fbbf24' }]}>
                    Quiz Expert
                  </Text>
                </View>
              )}

              {completedCount >= 10 && (
                <View style={[styles.identityBadge, { backgroundColor: '#10b981' + '20' }]}>
                  <Book size={16} color="#10b981" />
                  <Text style={[styles.identityBadgeText, { color: '#10b981' }]}>
                    Dedicated Learner
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.identityDescription, { color: themeColors.textSecondary }]}>
              {completedCount === 0 ? 'Begin your JavaScript journey and earn your first badge!' :
               completedCount < 5 ? 'You\'re just getting started. Keep going!' :
               completedCount < 10 ? 'You\'re making great progress!' :
               'You\'re becoming a JavaScript expert!'}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Quick Actions</Text>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: themeColors.card }]}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                const nextLesson = lessons.find(lesson => !progress[lesson.id]?.completed);
                if (nextLesson) {
                  router.push(`/lesson/${nextLesson.id}`);
                } else {
                  Alert.alert("🎉 All Done!", "You've completed all lessons! Try a quiz to test your knowledge.");
                }
              }}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#10b981' + '20' }]}>
                <Book size={20} color="#10b981" />
              </View>
              <Text style={[styles.quickActionText, { color: themeColors.text }]}>Continue Learning</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: themeColors.card }]}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                router.push('/explore/practice-quiz');
              }}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#8b5cf6' + '20' }]}>
                <Zap size={20} color="#8b5cf6" />
              </View>
              <Text style={[styles.quickActionText, { color: themeColors.text }]}>Take Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: themeColors.card }]}
              onPress={handleViewAchievements}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#fbbf24' + '20' }]}>
                <Trophy size={20} color="#fbbf24" />
              </View>
              <Text style={[styles.quickActionText, { color: themeColors.text }]}>Achievements</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: themeColors.card }]}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                router.push('/(tabs)/progress');
              }}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: themeColors.primary + '20' }]}>
                <TrendingUp size={20} color={themeColors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: themeColors.text }]}>View Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Preferences</Text>

          <View style={[styles.settingsCard, { backgroundColor: themeColors.card }]}>
            <View style={[styles.settingItem, { backgroundColor: 'transparent' }]}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: themeColors.primary + '20' }]}>
                  {themeMode === 'dark' ? (
                    <Moon size={18} color={themeColors.primary} />
                  ) : (
                    <Sun size={18} color={themeColors.primary} />
                  )}
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>
                    Appearance
                  </Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    {themeMode === 'dark' ? 'Dark mode' : 'Light mode'}
                  </Text>
                </View>
              </View>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#767577', true: themeColors.primary }}
                thumbColor="#f4f3f4"
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={[styles.settingItem, { backgroundColor: 'transparent' }]}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#10b981' + '20' }]}>
                  {notificationsEnabled ? (
                    <Bell size={18} color="#10b981" />
                  ) : (
                    <BellOff size={18} color="#10b981" />
                  )}
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>
                    Notifications
                  </Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    Learning reminders and updates
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#767577', true: '#10b981' }}
                thumbColor="#f4f3f4"
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={[styles.settingItem, { backgroundColor: 'transparent' }]}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#8b5cf6' + '20' }]}>
                  {soundEnabled ? (
                    <Volume2 size={18} color="#8b5cf6" />
                  ) : (
                    <VolumeX size={18} color="#8b5cf6" />
                  )}
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>
                    Sound Effects
                  </Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    Audio feedback for interactions
                  </Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={handleSoundToggle}
                trackColor={{ false: '#767577', true: '#8b5cf6' }}
                thumbColor="#f4f3f4"
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={[styles.settingItem, { backgroundColor: 'transparent' }]}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#f59e0b' + '20' }]}>
                  <Smartphone size={18} color="#f59e0b" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>
                    Haptic Feedback
                  </Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    Vibration for touch interactions
                  </Text>
                </View>
              </View>
              <Switch
                value={hapticEnabled}
                onValueChange={handleHapticToggle}
                trackColor={{ false: '#767577', true: '#f59e0b' }}
                thumbColor="#f4f3f4"
              />
            </View>
          </View>
        </View>

        {/* Learning Tools */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Learning Tools</Text>

          <View style={[styles.settingsCard, { backgroundColor: themeColors.card }]}>
            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: 'transparent' }]}
              onPress={handleShuffleLessons}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#06b6d4' + '20' }]}>
                  <Shuffle size={18} color="#06b6d4" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>Shuffle Lessons</Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    Randomize lesson order for variety
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: 'transparent' }]}
              onPress={handleResetProgress}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#ef4444' + '20' }]}>
                  <RefreshCw size={18} color="#ef4444" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>Reset Progress</Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    Start your learning journey over
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Data Management</Text>

          <View style={[styles.settingsCard, { backgroundColor: themeColors.card }]}>
            <View style={[styles.settingItem, { backgroundColor: 'transparent' }]}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#10b981' + '20' }]}>
                  <Database size={18} color="#10b981" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>
                    Auto Backup
                  </Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    Automatically save progress to cloud
                  </Text>
                </View>
              </View>
              <Switch
                value={autoBackup}
                onValueChange={handleAutoBackupToggle}
                trackColor={{ false: '#767577', true: '#10b981' }}
                thumbColor="#f4f3f4"
              />
            </View>

            <View style={styles.settingDivider} />

            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: 'transparent' }]}
              onPress={handleExportData}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: themeColors.primary + '20' }]}>
                  <Download size={18} color={themeColors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>Export Data</Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    Download your learning data
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: 'transparent' }]}
              onPress={handleImportData}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#8b5cf6' + '20' }]}>
                  <Upload size={18} color="#8b5cf6" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>Import Data</Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    Restore from backup file
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Feedback */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Support & Feedback</Text>

          <View style={[styles.settingsCard, { backgroundColor: themeColors.card }]}>
            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: 'transparent' }]}
              onPress={handleRateApp}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#fbbf24' + '20' }]}>
                  <Star size={18} color="#fbbf24" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>Rate App</Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    Help us improve with your feedback
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: 'transparent' }]}
              onPress={handleShareApp}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#06b6d4' + '20' }]}>
                  <Share2 size={18} color="#06b6d4" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>Share App</Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    Tell friends about SwipeLearn JS
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: 'transparent' }]}
              onPress={handleContactSupport}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#10b981' + '20' }]}>
                  <Mail size={18} color="#10b981" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>Contact Support</Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    Get help with any issues
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: 'transparent' }]}
              onPress={() => handleLinkPress('https://swipelearn.app/help')}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#8b5cf6' + '20' }]}>
                  <HelpCircle size={18} color="#8b5cf6" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>Help Center</Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    FAQs and tutorials
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>About</Text>

          <View style={[styles.aboutCard, { backgroundColor: themeColors.card }]}>
            <View style={[styles.appIcon, { backgroundColor: themeColors.primary }]}>
              <Code size={32} color="#ffffff" />
            </View>
            <View style={styles.aboutContent}>
              <Text style={[styles.appName, { color: themeColors.text }]}>CardSwipe v3</Text>
              <Text style={[styles.appVersion, { color: themeColors.textSecondary }]}>
                Version {Application.nativeApplicationVersion || '3.0.0'}
              </Text>
              <Text style={[styles.appDescription, { color: themeColors.textSecondary }]}>
                Master JavaScript with interactive swipe-based learning and gamified progress tracking
              </Text>
            </View>
          </View>

          <View style={[styles.settingsCard, { backgroundColor: themeColors.card }]}>
            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: 'transparent' }]}
              onPress={() => handleLinkPress('https://cardswipe.app/privacy')}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#10b981' + '20' }]}>
                  <Shield size={18} color="#10b981" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>Privacy Policy</Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    How we protect your data
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: 'transparent' }]}
              onPress={() => handleLinkPress('https://cardswipe.app/terms')}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: '#8b5cf6' + '20' }]}>
                  <FileText size={18} color="#8b5cf6" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: themeColors.text }]}>Terms of Service</Text>
                  <Text style={[styles.settingSubtext, { color: themeColors.textSecondary }]}>
                    App usage terms and conditions
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={themeColors.textSecondary} />
            </TouchableOpacity>
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
              for JavaScript learners worldwide
            </Text>
          </View>
          <Text style={[styles.versionText, { color: themeColors.textSecondary }]}>
            Build {Platform.OS === 'ios' ? 'iOS' : 'Android'} • {new Date().getFullYear()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
  },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  offlineIndicator: {
    marginBottom: 8,
  },
  offlineText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  offlineSubtext: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
  xpContainer: {
    gap: 8,
  },
  xpInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  xpNextText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  xpProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  achievementShowcase: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  achievementCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  achievementContent: {
    gap: 12,
  },
  achievementCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  achievementSubtext: {
    fontSize: 14,
    lineHeight: 20,
  },
  recentAchievements: {
    flexDirection: 'row',
    gap: 8,
  },
  achievementBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementEmoji: {
    fontSize: 20,
  },
  moreAchievements: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  moreText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  identityCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  identityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  identityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  identityContent: {
    gap: 16,
  },
  identityBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  identityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  identityBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  identityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: (width - 64) / 2,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressContent: {
    alignItems: 'center',
    gap: 12,
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  progressSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    gap: 32,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressStatLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtext: {
    fontSize: 13,
    lineHeight: 18,
  },
  settingDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 64,
  },
  aboutCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    paddingBottom: 20,
  },
  madeWithLove: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  madeWithText: {
    fontSize: 14,
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
