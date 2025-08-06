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
      return null;
    }
    
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: { date: trigger },
      });
      
      console.log(`Scheduled notification: ${title} - ${body} at ${trigger}`);
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  }

  async scheduleDailyReminder(hour: number = 19, minute: number = 0): Promise<string | null> {
    if (!this.notificationsEnabled) {
      return null;
    }
    
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📚 Daily Learning Reminder',
          body: 'Time for your daily lesson! Keep your streak alive.',
          sound: true,
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        },
      });
      
      console.log(`Scheduled daily reminder at ${hour}:${minute}`);
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule daily reminder:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`Cancelled notification: ${notificationId}`);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cancelled all notifications');
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
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

  async getScheduledNotifications(): Promise<any[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Failed to get badge count:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
      console.log(`Set badge count to: ${count}`);
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }

  async clearBadge(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
      console.log('Badge cleared');
    } catch (error) {
      console.error('Failed to clear badge:', error);
    }
  }

  // Performance optimization: Setup notification listeners
  private setupNotificationListeners(): void {
    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    // Handle notification response (user tapped notification)
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  // Handle notification responses for better UX
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const { notification } = response;
    const data = notification.request.content.data;
    
    // Handle navigation based on notification data
    if (data?.screen) {
      console.log('Navigate to screen:', data.screen);
      // Implement navigation logic here
    }
  }

  // Performance optimization: Throttled notification sending
  async sendThrottledNotification(title: string, body: string, data?: any): Promise<string | null> {
    if (!this.notificationsEnabled) {
      return null;
    }

    const now = Date.now();
    if (now - this.lastNotificationTime < this.minNotificationInterval) {
      // Add to queue instead of sending immediately
      this.addToQueue({ title, body, data });
      return null;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: null, // Send immediately
      });

      this.lastNotificationTime = now;
      return notificationId;
    } catch (error) {
      console.error('Failed to send throttled notification:', error);
      return null;
    }
  }

  // Queue management for performance
  private addToQueue(notification: any): void {
    if (this.notificationQueue.length >= this.maxQueueSize) {
      this.notificationQueue.shift(); // Remove oldest
    }
    this.notificationQueue.push(notification);
    
    // Process queue after minimum interval
    setTimeout(() => {
      this.processQueue();
    }, this.minNotificationInterval);
  }

  private async processQueue(): Promise<void> {
    if (this.notificationQueue.length === 0) return;

    const notification = this.notificationQueue.shift();
    if (notification) {
      await this.sendThrottledNotification(
        notification.title,
        notification.body,
        notification.data
      );
    }
  }

  // Get performance statistics
  getStats(): {
    queueSize: number;
    lastNotificationTime: number;
    isInitialized: boolean;
    notificationsEnabled: boolean;
  } {
    return {
      queueSize: this.notificationQueue.length,
      lastNotificationTime: this.lastNotificationTime,
      isInitialized: this.isInitialized,
      notificationsEnabled: this.notificationsEnabled,
    };
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
