import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }

      // Get push token for remote notifications
      if (Device.isDevice) {
        this.expoPushToken = await this.registerForPushNotificationsAsync();
        console.log('Push token:', this.expoPushToken);
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('learning-reminders', {
          name: 'Learning Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2563eb',
          sound: 'notification.wav',
        });
      }

      // Schedule default learning reminders
      await this.scheduleDefaultReminders();
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private async registerForPushNotificationsAsync(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id-here', // Replace with your actual project ID
      });
      return token.data;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  }

  async scheduleDefaultReminders(): Promise<void> {
    try {
      // Cancel existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Check if user has enabled reminders
      const remindersEnabled = await AsyncStorage.getItem('notifications_enabled');
      if (remindersEnabled === 'false') {
        return;
      }

      // Schedule daily learning reminder
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📚 Time to Learn JavaScript!',
          body: 'Continue your learning streak and master new concepts today!',
          sound: 'notification.wav',
          data: { type: 'daily_reminder' },
        },
        trigger: {
          hour: 19, // 7 PM
          minute: 0,
          repeats: true,
        },
      });

      // Schedule streak reminder (if user hasn't opened app in 2 days)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔥 Don\'t Break Your Streak!',
          body: 'You\'re doing great! Come back and continue your JavaScript journey.',
          sound: 'notification.wav',
          data: { type: 'streak_reminder' },
        },
        trigger: {
          seconds: 60 * 60 * 48, // 48 hours
          repeats: false,
        },
      });

      // Schedule weekly progress summary
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📊 Weekly Progress Summary',
          body: 'See how much you\'ve learned this week and plan your next steps!',
          sound: 'notification.wav',
          data: { type: 'weekly_summary' },
        },
        trigger: {
          weekday: 1, // Monday
          hour: 10,
          minute: 0,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Failed to schedule notifications:', error);
    }
  }

  async scheduleCustomReminder(
    title: string,
    body: string,
    triggerDate: Date,
    data?: any
  ): Promise<string | null> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'notification.wav',
          data: data || {},
        },
        trigger: triggerDate,
      });
      return identifier;
    } catch (error) {
      console.error('Failed to schedule custom notification:', error);
      return null;
    }
  }

  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  async enableNotifications(): Promise<void> {
    await AsyncStorage.setItem('notifications_enabled', 'true');
    await this.scheduleDefaultReminders();
  }

  async disableNotifications(): Promise<void> {
    await AsyncStorage.setItem('notifications_enabled', 'false');
    await this.cancelAllNotifications();
  }

  async isNotificationsEnabled(): Promise<boolean> {
    const enabled = await AsyncStorage.getItem('notifications_enabled');
    return enabled !== 'false'; // Default to true
  }

  // Notification response handlers
  setupNotificationListeners(): void {
    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    // Handle notification response (user tapped notification)
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('Notification response:', data);
      
      // Handle different notification types
      switch (data.type) {
        case 'daily_reminder':
          // Navigate to main learning screen
          break;
        case 'streak_reminder':
          // Navigate to progress screen
          break;
        case 'weekly_summary':
          // Navigate to progress/stats screen
          break;
        default:
          // Default navigation
          break;
      }
    });
  }

  // Achievement notifications
  async showAchievementNotification(title: string, body: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🏆 ${title}`,
          body,
          sound: 'notification.wav',
          data: { type: 'achievement' },
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Failed to show achievement notification:', error);
    }
  }

  // Streak notifications
  async showStreakNotification(streakCount: number): Promise<void> {
    const messages = [
      `🔥 ${streakCount} day streak! You're on fire!`,
      `🚀 Amazing! ${streakCount} days of consistent learning!`,
      `⭐ Incredible ${streakCount}-day streak! Keep it up!`,
      `💪 ${streakCount} days strong! You're unstoppable!`,
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    await this.showAchievementNotification('Streak Milestone!', randomMessage);
  }

  // XP milestone notifications
  async showXPMilestoneNotification(xp: number): Promise<void> {
    const milestones = [100, 250, 500, 1000, 2000, 5000];
    
    if (milestones.includes(xp)) {
      await this.showAchievementNotification(
        'XP Milestone Reached!',
        `🎉 You've earned ${xp} XP! Your dedication is paying off!`
      );
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
