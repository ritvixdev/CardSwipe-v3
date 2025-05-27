import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { 
  RefreshCw, 
  Trash2, 
  Github, 
  ExternalLink, 
  Info, 
  Heart,
  Shuffle,
  Moon,
  Sun
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { shuffleLessons } from '@/data/lessons';

export default function SettingsScreen() {
  const resetProgress = useProgressStore((state) => state.actions.resetProgress);
  const themeMode = useThemeStore((state) => state.mode);
  const setTheme = useThemeStore((state) => state.actions.setTheme);
  const themeColors = useThemeColors();
  
  const handleResetProgress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Reset", 
          onPress: () => {
            resetProgress();
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
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
    
    Alert.alert(
      "Shuffle Lessons",
      "This will randomize the order of lessons for a fresh learning experience.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Shuffle", 
          onPress: () => {
            shuffleLessons();
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            Alert.alert("Lessons Shuffled", "Restart the app to see the new order.");
          }
        }
      ]
    );
  };
  
  const handleThemeToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Directly set the theme based on current value
    setTheme(themeMode === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Customize your learning experience</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>App Settings</Text>
          
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
          
          <View style={[styles.settingItem, styles.dangerItem]}>
            <View style={styles.settingContent}>
              <Trash2 size={22} color={themeColors.error} />
              <Text style={[styles.settingText, { color: themeColors.error }]}>Clear All Data</Text>
            </View>
            <ExternalLink size={18} color={themeColors.error} />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>About</Text>
          
          <View style={[styles.settingItem, { backgroundColor: themeColors.card }]}>
            <View style={styles.settingContent}>
              <Info size={22} color={themeColors.text} />
              <Text style={[styles.settingText, { color: themeColors.text }]}>Version</Text>
            </View>
            <Text style={[styles.settingValue, { color: themeColors.textSecondary }]}>1.0.0</Text>
          </View>
          
          <TouchableOpacity style={[styles.settingItem, { backgroundColor: themeColors.card }]}>
            <View style={styles.settingContent}>
              <Github size={22} color={themeColors.text} />
              <Text style={[styles.settingText, { color: themeColors.text }]}>Source Code</Text>
            </View>
            <ExternalLink size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, { backgroundColor: themeColors.card }]}>
            <View style={styles.settingContent}>
              <Heart size={22} color={themeColors.text} />
              <Text style={[styles.settingText, { color: themeColors.text }]}>Support Development</Text>
            </View>
            <ExternalLink size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
            JavaScript 30-Day SwipeLearn
          </Text>
          <Text style={[styles.footerSubtext, { color: themeColors.inactive }]}>
            Based on Asabeneh's 30 Days of JavaScript
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dangerItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
  },
  footer: {
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});