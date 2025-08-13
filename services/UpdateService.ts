import * as Application from 'expo-application';
import { Platform, Alert, Linking } from 'react-native';
import { analyticsService } from './AnalyticsService';

interface UpdateInfo {
  isAvailable: boolean;
  version?: string;
  releaseNotes?: string;
  isRequired?: boolean;
  downloadUrl?: string;
  size?: number;
}

interface ReleaseNotes {
  version: string;
  date: string;
  features: string[];
  improvements: string[];
  bugFixes: string[];
  breaking?: string[];
}

export class UpdateService {
  private static instance: UpdateService;
  private checkInterval: NodeJS.Timeout | null = null;
  private lastCheckTime: number = 0;
  private readonly CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): UpdateService {
    if (!UpdateService.instance) {
      UpdateService.instance = new UpdateService();
    }
    return UpdateService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Check for updates on app start
      await this.checkForUpdates(false);
      
      // Set up periodic checks
      this.setupPeriodicChecks();
      
      await analyticsService.track('update_service_initialized');
    } catch (error) {
      console.error('Failed to initialize update service:', error);
    }
  }

  private setupPeriodicChecks(): void {
    this.checkInterval = setInterval(async () => {
      await this.checkForUpdates(false);
    }, this.CHECK_INTERVAL);
  }

  async checkForUpdates(showNoUpdateMessage: boolean = false): Promise<UpdateInfo> {
    try {
      const now = Date.now();
      
      // Avoid checking too frequently
      if (now - this.lastCheckTime < 60 * 60 * 1000) { // 1 hour
        return { isAvailable: false };
      }
      
      this.lastCheckTime = now;
      
      const currentVersion = Application.nativeApplicationVersion || '1.0.0';
      const updateInfo = await this.fetchUpdateInfo(currentVersion);
      
      await analyticsService.track('update_check_performed', {
        current_version: currentVersion,
        update_available: updateInfo.isAvailable,
        latest_version: updateInfo.version,
      });

      if (updateInfo.isAvailable) {
        await this.handleUpdateAvailable(updateInfo);
      } else if (showNoUpdateMessage) {
        Alert.alert(
          'No Updates Available',
          'You\'re using the latest version of SwipeLearn JS!',
          [{ text: 'OK' }]
        );
      }

      return updateInfo;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      await analyticsService.track('update_check_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return { isAvailable: false };
    }
  }

  private async fetchUpdateInfo(currentVersion: string): Promise<UpdateInfo> {
    // In a real app, this would fetch from your backend API
    // For demo purposes, we'll simulate update checking
    
    const mockLatestVersion = '1.1.0';
    const isUpdateAvailable = this.compareVersions(currentVersion, mockLatestVersion) < 0;
    
    if (!isUpdateAvailable) {
      return { isAvailable: false };
    }

    const releaseNotes = this.getMockReleaseNotes(mockLatestVersion);
    
    return {
      isAvailable: true,
      version: mockLatestVersion,
      releaseNotes: this.formatReleaseNotes(releaseNotes),
      isRequired: this.isUpdateRequired(currentVersion, mockLatestVersion),
      downloadUrl: this.getDownloadUrl(),
      size: 25 * 1024 * 1024, // 25MB
    };
  }

  private compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part < v2Part) return -1;
      if (v1Part > v2Part) return 1;
    }
    
    return 0;
  }

  private isUpdateRequired(currentVersion: string, latestVersion: string): boolean {
    // Define minimum supported version
    const minimumVersion = '1.0.0';

    // Force update if current version is below minimum supported version
    if (this.compareVersions(currentVersion, minimumVersion) < 0) {
      return true;
    }

    // Require update when major version increases (possible breaking changes)
    const currentMajor = Number(currentVersion.split('.')[0]);
    const latestMajor = Number(latestVersion.split('.')[0]);
    return currentMajor < latestMajor;
  }

  private getDownloadUrl(): string {
    if (Platform.OS === 'ios') {
      return 'https://apps.apple.com/app/swipelearn-js/id123456789';
    } else {
      return 'https://play.google.com/store/apps/details?id=com.swipelearn.js';
    }
  }

  private getMockReleaseNotes(version: string): ReleaseNotes {
    // In a real app, this would come from your backend
    return {
      version,
      date: new Date().toISOString().split('T')[0],
      features: [
        'New achievement system with 20+ badges to unlock',
        'Advanced progress analytics and insights',
        'Improved swipe gesture recognition',
        'Dark mode enhancements',
      ],
      improvements: [
        'Faster app startup time',
        'Smoother animations and transitions',
        'Better offline support',
        'Enhanced accessibility features',
      ],
      bugFixes: [
        'Fixed issue with lesson progress not saving',
        'Resolved crash when switching themes quickly',
        'Fixed notification scheduling problems',
        'Improved memory usage and performance',
      ],
    };
  }

  private formatReleaseNotes(notes: ReleaseNotes): string {
    let formatted = `What's New in v${notes.version}\n\n`;
    
    if (notes.features.length > 0) {
      formatted += '🎉 New Features:\n';
      notes.features.forEach(feature => {
        formatted += `• ${feature}\n`;
      });
      formatted += '\n';
    }
    
    if (notes.improvements.length > 0) {
      formatted += '⚡ Improvements:\n';
      notes.improvements.forEach(improvement => {
        formatted += `• ${improvement}\n`;
      });
      formatted += '\n';
    }
    
    if (notes.bugFixes.length > 0) {
      formatted += '🐛 Bug Fixes:\n';
      notes.bugFixes.forEach(fix => {
        formatted += `• ${fix}\n`;
      });
      formatted += '\n';
    }
    
    if (notes.breaking && notes.breaking.length > 0) {
      formatted += '⚠️ Breaking Changes:\n';
      notes.breaking.forEach(change => {
        formatted += `• ${change}\n`;
      });
    }
    
    return formatted.trim();
  }

  private async handleUpdateAvailable(updateInfo: UpdateInfo): Promise<void> {
    const title = updateInfo.isRequired 
      ? 'Required Update Available' 
      : 'Update Available';
    
    const message = updateInfo.isRequired
      ? `A required update to v${updateInfo.version} is available. Please update to continue using SwipeLearn JS.`
      : `SwipeLearn JS v${updateInfo.version} is now available with new features and improvements!`;

    const buttons = updateInfo.isRequired
      ? [
          {
            text: 'Update Now',
            onPress: () => this.downloadUpdate(updateInfo),
          },
        ]
      : [
          {
            text: 'Later',
            style: 'cancel' as const,
            onPress: () => this.postponeUpdate(updateInfo),
          },
          {
            text: 'View Details',
            onPress: () => this.showUpdateDetails(updateInfo),
          },
          {
            text: 'Update',
            onPress: () => this.downloadUpdate(updateInfo),
          },
        ];

    Alert.alert(title, message, buttons);
  }

  private async showUpdateDetails(updateInfo: UpdateInfo): Promise<void> {
    const sizeText = updateInfo.size 
      ? `\n\nDownload size: ${(updateInfo.size / (1024 * 1024)).toFixed(1)} MB`
      : '';

    Alert.alert(
      `Update to v${updateInfo.version}`,
      `${updateInfo.releaseNotes}${sizeText}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update Now', 
          onPress: () => this.downloadUpdate(updateInfo) 
        },
      ]
    );

    await analyticsService.track('update_details_viewed', {
      version: updateInfo.version,
    });
  }

  private async downloadUpdate(updateInfo: UpdateInfo): Promise<void> {
    try {
      if (updateInfo.downloadUrl) {
        await Linking.openURL(updateInfo.downloadUrl);
        
        await analyticsService.track('update_download_initiated', {
          version: updateInfo.version,
          is_required: updateInfo.isRequired,
        });
      }
    } catch (error) {
      console.error('Failed to open update URL:', error);
      Alert.alert(
        'Update Error',
        'Unable to open the app store. Please update manually from the app store.',
        [{ text: 'OK' }]
      );
    }
  }

  private async postponeUpdate(updateInfo: UpdateInfo): Promise<void> {
    // Set a reminder to check again in 24 hours
    this.lastCheckTime = Date.now() - this.CHECK_INTERVAL + (24 * 60 * 60 * 1000);
    
    await analyticsService.track('update_postponed', {
      version: updateInfo.version,
    });
  }

  async manualUpdateCheck(): Promise<void> {
    // Reset last check time to force a check
    this.lastCheckTime = 0;
    await this.checkForUpdates(true);
  }

  getAppInfo(): {
    version: string;
    buildNumber: string;
    bundleId: string;
    platform: string;
  } {
    return {
      version: Application.nativeApplicationVersion || '1.0.0',
      buildNumber: Application.nativeBuildVersion || '1',
      bundleId: Application.applicationId || 'com.swipelearn.js',
      platform: Platform.OS,
    };
  }

  async getUpdateHistory(): Promise<ReleaseNotes[]> {
    // In a real app, this would fetch from your backend
    return [
      this.getMockReleaseNotes('1.1.0'),
      {
        version: '1.0.1',
        date: '2024-01-15',
        features: [],
        improvements: [
          'Improved app stability',
          'Better error handling',
        ],
        bugFixes: [
          'Fixed lesson loading issues',
          'Resolved theme switching bugs',
        ],
      },
      {
        version: '1.0.0',
        date: '2024-01-01',
        features: [
          'Initial release',
          'Tinder-style learning interface',
          '30 JavaScript lessons',
          'Progress tracking and XP system',
        ],
        improvements: [],
        bugFixes: [],
      },
    ];
  }

  cleanup(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Export singleton instance
export const updateService = UpdateService.getInstance();
