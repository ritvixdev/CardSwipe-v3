import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class NotificationService {
  private static instance: NotificationService;
  private isInitialized: boolean = false;
  private notificationsEnabled: boolean = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Load notification preferences
      const enabled = await AsyncStorage.getItem('notifications_enabled');
      this.notificationsEnabled = enabled === 'true';
      
      this.isInitialized = true;
      console.log('Notification service initialized (simplified)');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      // In a real implementation, this would request actual permissions
      // For now, we'll just return true and store the preference
      await AsyncStorage.setItem('notifications_enabled', 'true');
      this.notificationsEnabled = true;
      return true;
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  async isNotificationsEnabled(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.notificationsEnabled;
  }

  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem('notifications_enabled', enabled.toString());
      this.notificationsEnabled = enabled;
      console.log(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Failed to set notification preference:', error);
    }
  }

  async scheduleReminder(title: string, body: string, trigger: Date): Promise<string | null> {
    if (!this.notificationsEnabled) {
      console.log('Notifications disabled, skipping reminder');
      return null;
    }

    // In a real implementation, this would schedule an actual notification
    console.log(`Reminder scheduled: ${title} - ${body} at ${trigger.toISOString()}`);
    
    // Return a mock notification ID
    return `notification_${Date.now()}`;
  }

  async scheduleDailyReminder(hour: number = 19, minute: number = 0): Promise<string | null> {
    if (!this.notificationsEnabled) {
      return null;
    }

    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hour, minute, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    return this.scheduleReminder(
      'Time to Learn JavaScript! 🚀',
      'Continue your JavaScript journey with SwipeLearn JS',
      reminderTime
    );
  }

  async cancelNotification(notificationId: string): Promise<void> {
    // In a real implementation, this would cancel the actual notification
    console.log(`Notification cancelled: ${notificationId}`);
  }

  async cancelAllNotifications(): Promise<void> {
    // In a real implementation, this would cancel all notifications
    console.log('All notifications cancelled');
  }

  async scheduleStreakReminder(): Promise<void> {
    if (!this.notificationsEnabled) {
      return;
    }

    // Schedule a reminder for tomorrow if user hasn't learned today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0); // 10 AM

    await this.scheduleReminder(
      'Keep your streak alive! 🔥',
      'Don\'t break your learning streak - complete a lesson today!',
      tomorrow
    );
  }

  async scheduleCompletionCelebration(lessonTitle: string): Promise<void> {
    if (!this.notificationsEnabled) {
      return;
    }

    // Show immediate celebration (in a real app, this might be a local notification)
    console.log(`🎉 Lesson completed: ${lessonTitle}`);
  }

  // Mock methods for compatibility
  async getScheduledNotifications(): Promise<any[]> {
    return [];
  }

  async getBadgeCount(): Promise<number> {
    return 0;
  }

  async setBadgeCount(count: number): Promise<void> {
    console.log(`Badge count set to: ${count}`);
  }

  async clearBadge(): Promise<void> {
    console.log('Badge cleared');
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
