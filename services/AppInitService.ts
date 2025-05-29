import { Platform, AppState, AppStateStatus } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { analyticsService } from './AnalyticsService';
import { notificationService } from './NotificationService';
import { performanceService } from './PerformanceService';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeStore } from '@/store/useThemeStore';

export class AppInitService {
  private static instance: AppInitService;
  private isInitialized: boolean = false;
  private initStartTime: number = 0;

  static getInstance(): AppInitService {
    if (!AppInitService.instance) {
      AppInitService.instance = new AppInitService();
    }
    return AppInitService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    this.initStartTime = Date.now();

    try {
      // Keep splash screen visible during initialization
      await SplashScreen.preventAutoHideAsync();

      // Initialize core services in parallel
      await Promise.all([
        this.initializeAnalytics(),
        this.initializePerformanceMonitoring(),
        this.loadFonts(),
        this.initializeStores(),
      ]);

      // Initialize services that depend on user permissions
      await this.initializeNotifications();

      // Setup app state listeners
      this.setupAppStateListeners();

      // Setup error handlers
      this.setupErrorHandlers();

      // Mark as initialized
      this.isInitialized = true;

      // Track initialization completion
      const initDuration = Date.now() - this.initStartTime;
      await analyticsService.track('app_initialization_complete', {
        duration_ms: initDuration,
        platform: Platform.OS,
      });

      console.log(`App initialized in ${initDuration}ms`);

    } catch (error) {
      console.error('App initialization failed:', error);
      await analyticsService.track('app_initialization_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        platform: Platform.OS,
      });
      throw error;
    } finally {
      // Hide splash screen
      await SplashScreen.hideAsync();
    }
  }

  private async initializeAnalytics(): Promise<void> {
    try {
      await analyticsService.initialize();
      console.log('Analytics initialized');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  private async initializePerformanceMonitoring(): Promise<void> {
    try {
      performanceService.initialize();
      console.log('Performance monitoring initialized');
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
    }
  }

  private async initializeNotifications(): Promise<void> {
    try {
      await notificationService.initialize();
      notificationService.setupNotificationListeners();
      console.log('Notifications initialized');
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private async loadFonts(): Promise<void> {
    try {
      // Load custom fonts if any
      await Font.loadAsync({
        // Add your custom fonts here
        // 'CustomFont-Regular': require('../assets/fonts/CustomFont-Regular.ttf'),
        // 'CustomFont-Bold': require('../assets/fonts/CustomFont-Bold.ttf'),
      });
      console.log('Fonts loaded');
    } catch (error) {
      console.error('Failed to load fonts:', error);
      // Don't throw - fonts are not critical
    }
  }

  private async initializeStores(): Promise<void> {
    try {
      // Initialize Zustand stores
      // The stores will automatically load persisted data
      const progressStore = useProgressStore.getState();
      const themeStore = useThemeStore.getState();

      // Validate and migrate data if needed
      await this.validateAndMigrateData();

      console.log('Stores initialized');
    } catch (error) {
      console.error('Failed to initialize stores:', error);
      // Don't throw - we can continue with default state
    }
  }

  private async validateAndMigrateData(): Promise<void> {
    try {
      // Check if data migration is needed
      const currentVersion = '1.0.0';
      const storedVersion = await analyticsService.getUserProperty('app_version', '0.0.0');

      if (storedVersion !== currentVersion) {
        await this.migrateData(storedVersion, currentVersion);
        await analyticsService.setUserProperty('app_version', currentVersion);
      }
    } catch (error) {
      console.error('Data migration failed:', error);
    }
  }

  private async migrateData(fromVersion: string, toVersion: string): Promise<void> {
    console.log(`Migrating data from ${fromVersion} to ${toVersion}`);
    
    // Add migration logic here as your app evolves
    // For example:
    // if (fromVersion < '1.1.0') {
    //   // Migrate progress data format
    // }

    await analyticsService.track('data_migration', {
      from_version: fromVersion,
      to_version: toVersion,
    });
  }

  private setupAppStateListeners(): void {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  private handleAppStateChange = async (nextAppState: AppStateStatus): Promise<void> => {
    try {
      if (nextAppState === 'background') {
        await analyticsService.trackAppBackgrounded();
        await this.handleAppBackground();
      } else if (nextAppState === 'active') {
        await analyticsService.trackAppForegrounded();
        await this.handleAppForeground();
      }
    } catch (error) {
      console.error('Error handling app state change:', error);
    }
  };

  private async handleAppBackground(): Promise<void> {
    // Save any pending data
    // Schedule background tasks if needed
    console.log('App backgrounded');
  }

  private async handleAppForeground(): Promise<void> {
    // Refresh data if needed
    // Check for updates
    console.log('App foregrounded');
  }

  private setupErrorHandlers(): void {
    // Global error handler for unhandled promise rejections
    if (typeof global !== 'undefined') {
      global.addEventListener?.('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        analyticsService.track('unhandled_promise_rejection', {
          error: event.reason?.toString() || 'Unknown error',
          platform: Platform.OS,
        });
      });

      // Global error handler for uncaught exceptions
      global.addEventListener?.('error', (event) => {
        console.error('Uncaught error:', event.error);
        analyticsService.track('uncaught_error', {
          error: event.error?.toString() || 'Unknown error',
          platform: Platform.OS,
        });
      });
    }

    // React Native specific error handler
    if (Platform.OS !== 'web') {
      const originalHandler = global.ErrorUtils?.getGlobalHandler();
      
      global.ErrorUtils?.setGlobalHandler((error, isFatal) => {
        console.error('Global error:', error, 'Fatal:', isFatal);
        analyticsService.track('global_error', {
          error: error?.toString() || 'Unknown error',
          is_fatal: isFatal,
          platform: Platform.OS,
        });

        // Call original handler
        originalHandler?.(error, isFatal);
      });
    }
  }

  // Health check method
  async performHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
    timestamp: number;
  }> {
    const checks = {
      analytics: false,
      notifications: false,
      storage: false,
      performance: false,
    };

    try {
      // Check analytics
      checks.analytics = analyticsService !== null;

      // Check notifications
      checks.notifications = await notificationService.isNotificationsEnabled();

      // Check storage
      try {
        await analyticsService.getUserProperty('test', null);
        checks.storage = true;
      } catch {
        checks.storage = false;
      }

      // Check performance monitoring
      checks.performance = performanceService !== null;

      const healthyChecks = Object.values(checks).filter(Boolean).length;
      const totalChecks = Object.keys(checks).length;
      
      let status: 'healthy' | 'degraded' | 'unhealthy';
      if (healthyChecks === totalChecks) {
        status = 'healthy';
      } else if (healthyChecks >= totalChecks * 0.5) {
        status = 'degraded';
      } else {
        status = 'unhealthy';
      }

      return {
        status,
        checks,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        checks,
        timestamp: Date.now(),
      };
    }
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    try {
      AppState.removeEventListener('change', this.handleAppStateChange);
      performanceService.disable();
      console.log('App cleanup completed');
    } catch (error) {
      console.error('App cleanup failed:', error);
    }
  }

  // Getters
  get initialized(): boolean {
    return this.isInitialized;
  }

  get initializationTime(): number {
    return this.initStartTime;
  }
}

// Export singleton instance
export const appInitService = AppInitService.getInstance();
