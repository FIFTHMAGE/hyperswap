export interface MonitoringConfig {
  apiKey: string;
  environment: 'development' | 'staging' | 'production';
  sampleRate: number;
  enablePerformance: boolean;
  enableErrors: boolean;
}

export const monitoringConfig: MonitoringConfig = {
  apiKey: process.env.NEXT_PUBLIC_MONITORING_API_KEY || '',
  environment: (process.env.NEXT_PUBLIC_ENV || 'development') as any,
  sampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0.1,
  enablePerformance: true,
  enableErrors: true,
};

export function initMonitoring() {
  if (typeof window === 'undefined') return;

  // Performance monitoring
  if (monitoringConfig.enablePerformance && 'performance' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming;
          logMetric('page_load', nav.loadEventEnd - nav.fetchStart);
        } else if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          if (resource.duration > 1000) {
            logMetric('slow_resource', resource.duration, {
              name: resource.name,
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'resource'] });
  }

  // Error monitoring
  if (monitoringConfig.enableErrors) {
    window.addEventListener('error', (event) => {
      logError(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      logError(event.reason, {
        type: 'unhandledRejection',
      });
    });
  }
}

function logMetric(name: string, value: number, metadata?: Record<string, any>) {
  console.log('[Monitoring]', name, value, metadata);
  // In production, send to monitoring service
}

function logError(error: Error, metadata?: Record<string, any>) {
  console.error('[Monitoring]', error, metadata);
  // In production, send to error tracking service
}

