import { InteractionManager, Platform } from 'react-native';
import { analyticsService } from './AnalyticsService';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface MemoryInfo {
  jsHeapSizeLimit?: number;
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
}

export class PerformanceService {
  private static instance: PerformanceService;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private isMonitoring: boolean = false;

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  initialize(): void {
    this.isMonitoring = true;
    this.startAppLaunchMetrics();
    this.setupMemoryMonitoring();
  }

  private startAppLaunchMetrics(): void {
    // Track app launch time
    this.startMetric('app_launch');
    
    // Track time to interactive
    InteractionManager.runAfterInteractions(() => {
      this.endMetric('app_launch');
      this.startMetric('time_to_interactive');
      
      // End time to interactive after a short delay to ensure UI is ready
      setTimeout(() => {
        this.endMetric('time_to_interactive');
      }, 100);
    });
  }

  private setupMemoryMonitoring(): void {
    if (Platform.OS === 'web' && 'memory' in performance) {
      // Monitor memory usage every 30 seconds
      setInterval(() => {
        this.trackMemoryUsage();
      }, 30000);
    }
  }

  startMetric(name: string, metadata?: Record<string, any>): void {
    if (!this.isMonitoring) return;

    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
    };

    this.metrics.set(name, metric);
  }

  endMetric(name: string, additionalMetadata?: Record<string, any>): number | null {
    if (!this.isMonitoring) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric '${name}' was not started`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    // Merge additional metadata
    if (additionalMetadata) {
      metric.metadata = { ...metric.metadata, ...additionalMetadata };
    }

    // Log the metric
    this.logMetric(metric);

    // Remove from active metrics
    this.metrics.delete(name);

    return duration;
  }

  private async logMetric(metric: PerformanceMetric): Promise<void> {
    try {
      await analyticsService.track('performance_metric', {
        metric_name: metric.name,
        duration_ms: metric.duration,
        start_time: metric.startTime,
        end_time: metric.endTime,
        platform: Platform.OS,
        ...metric.metadata,
      });

      // Log slow operations
      if (metric.duration && metric.duration > 1000) {
        await analyticsService.track('slow_operation', {
          operation: metric.name,
          duration_ms: metric.duration,
          platform: Platform.OS,
        });
      }
    } catch (error) {
      console.error('Failed to log performance metric:', error);
    }
  }

  // Specific performance tracking methods
  async trackScreenLoad(screenName: string): Promise<() => void> {
    const metricName = `screen_load_${screenName}`;
    this.startMetric(metricName, { screen_name: screenName });

    return () => {
      this.endMetric(metricName);
    };
  }

  async trackLessonLoad(lessonId: number): Promise<() => void> {
    const metricName = `lesson_load_${lessonId}`;
    this.startMetric(metricName, { lesson_id: lessonId });

    return () => {
      this.endMetric(metricName);
    };
  }

  async trackSwipeGesture(direction: string): Promise<() => void> {
    const metricName = `swipe_${direction}`;
    this.startMetric(metricName, { direction });

    return () => {
      this.endMetric(metricName);
    };
  }

  async trackQuizLoad(): Promise<() => void> {
    const metricName = 'quiz_load';
    this.startMetric(metricName);

    return () => {
      this.endMetric(metricName);
    };
  }

  async trackDataLoad(operation: string): Promise<() => void> {
    const metricName = `data_load_${operation}`;
    this.startMetric(metricName, { operation });

    return () => {
      this.endMetric(metricName);
    };
  }

  private async trackMemoryUsage(): Promise<void> {
    if (Platform.OS === 'web' && 'memory' in performance) {
      const memory = (performance as any).memory as MemoryInfo;
      
      await analyticsService.track('memory_usage', {
        js_heap_size_limit: memory.jsHeapSizeLimit,
        total_js_heap_size: memory.totalJSHeapSize,
        used_js_heap_size: memory.usedJSHeapSize,
        memory_usage_percentage: memory.usedJSHeapSize && memory.jsHeapSizeLimit 
          ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 
          : 0,
        platform: Platform.OS,
      });

      // Alert if memory usage is high
      if (memory.usedJSHeapSize && memory.jsHeapSizeLimit) {
        const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        if (usagePercentage > 80) {
          await analyticsService.track('high_memory_usage', {
            usage_percentage: usagePercentage,
            used_heap_size: memory.usedJSHeapSize,
            heap_size_limit: memory.jsHeapSizeLimit,
          });
        }
      }
    }
  }

  // Frame rate monitoring (for React Native)
  startFrameRateMonitoring(): void {
    if (Platform.OS !== 'web') {
      // This would require a native module for accurate frame rate monitoring
      // For now, we'll track interaction delays
      this.trackInteractionDelays();
    }
  }

  private trackInteractionDelays(): void {
    let interactionStart = 0;

    const trackInteraction = () => {
      interactionStart = performance.now();
    };

    const trackInteractionEnd = () => {
      if (interactionStart > 0) {
        const delay = performance.now() - interactionStart;
        if (delay > 16.67) { // More than one frame at 60fps
          analyticsService.track('interaction_delay', {
            delay_ms: delay,
            platform: Platform.OS,
          });
        }
        interactionStart = 0;
      }
    };

    // This is a simplified version - in production you'd hook into touch events
    global.addEventListener?.('touchstart', trackInteraction);
    global.addEventListener?.('touchend', trackInteractionEnd);
  }

  // Bundle size and asset loading metrics
  async trackAssetLoad(assetType: string, assetName: string, size?: number): Promise<() => void> {
    const metricName = `asset_load_${assetType}_${assetName}`;
    this.startMetric(metricName, { 
      asset_type: assetType, 
      asset_name: assetName,
      asset_size: size,
    });

    return () => {
      this.endMetric(metricName);
    };
  }

  // Network request tracking
  async trackNetworkRequest(url: string, method: string = 'GET'): Promise<(status: number, size?: number) => void> {
    const metricName = `network_${method}_${url.replace(/[^a-zA-Z0-9]/g, '_')}`;
    this.startMetric(metricName, { url, method });

    return (status: number, size?: number) => {
      this.endMetric(metricName, { 
        status_code: status,
        response_size: size,
        success: status >= 200 && status < 300,
      });
    };
  }

  // Get performance summary
  getPerformanceSummary(): Record<string, any> {
    const activeMetrics = Array.from(this.metrics.values());
    
    return {
      active_metrics_count: activeMetrics.length,
      active_metrics: activeMetrics.map(m => ({
        name: m.name,
        running_time: performance.now() - m.startTime,
      })),
      monitoring_enabled: this.isMonitoring,
      platform: Platform.OS,
    };
  }

  // Disable monitoring (for performance)
  disable(): void {
    this.isMonitoring = false;
    this.metrics.clear();
  }

  // Enable monitoring
  enable(): void {
    this.isMonitoring = true;
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Export singleton instance
export const performanceService = PerformanceService.getInstance();

// Utility function for measuring component render time
export function withPerformanceTracking<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName: string
): React.ComponentType<T> {
  return function PerformanceTrackedComponent(props: T) {
    React.useEffect(() => {
      const endTracking = performanceService.trackScreenLoad(componentName);
      return endTracking;
    }, []);

    return React.createElement(Component, props);
  };
}
