import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react-native';
import * as Application from 'expo-application';
import { useThemeColors } from '@/hooks/useThemeColors';
import { analyticsService } from '@/services/AnalyticsService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to analytics
    this.logError(error, errorInfo);
  }

  private async logError(error: Error, errorInfo: ErrorInfo) {
    try {
      await analyticsService.track('app_error', {
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack,
        app_version: Application.nativeApplicationVersion,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to log error to analytics:', e);
    }

    // Log to console for development
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReportError = () => {
    const { error, errorInfo } = this.state;
    const errorReport = `
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
App Version: ${Application.nativeApplicationVersion}
Timestamp: ${new Date().toISOString()}
    `.trim();

    // In production, you might want to send this to a crash reporting service
    console.log('Error Report:', errorReport);
    
    // For now, we'll just log it
    analyticsService.track('error_reported', {
      error_message: error?.message,
      manual_report: true,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback 
        error={this.state.error} 
        onRetry={this.handleRetry}
        onReport={this.handleReportError}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
  onReport: () => void;
}

function ErrorFallback({ error, onRetry, onReport }: ErrorFallbackProps) {
  const themeColors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <AlertTriangle size={64} color={themeColors.error} />
        </View>

        <Text style={[styles.title, { color: themeColors.text }]}>
          Oops! Something went wrong
        </Text>

        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          We're sorry for the inconvenience. The app encountered an unexpected error.
        </Text>

        {__DEV__ && error && (
          <View style={[styles.errorDetails, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <Text style={[styles.errorTitle, { color: themeColors.error }]}>
              Error Details (Development Mode):
            </Text>
            <Text style={[styles.errorMessage, { color: themeColors.textSecondary }]}>
              {error.message}
            </Text>
            {error.stack && (
              <ScrollView style={styles.stackTrace} nestedScrollEnabled>
                <Text style={[styles.stackText, { color: themeColors.inactive }]}>
                  {error.stack}
                </Text>
              </ScrollView>
            )}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, { backgroundColor: themeColors.primary }]}
            onPress={onRetry}
          >
            <RefreshCw size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: themeColors.border }]}
            onPress={onReport}
          >
            <Mail size={20} color={themeColors.text} />
            <Text style={[styles.secondaryButtonText, { color: themeColors.text }]}>
              Report Issue
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.inactive }]}>
            If the problem persists, please restart the app or contact support.
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  errorDetails: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 32,
    maxHeight: 200,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    marginBottom: 12,
  },
  stackTrace: {
    maxHeight: 100,
  },
  stackText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  secondaryButton: {
    borderWidth: 1,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

// Export the wrapped component
export function ErrorBoundary({ children, fallback }: Props) {
  return (
    <ErrorBoundaryClass fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  );
}

export default ErrorBoundary;
