/**
 * Performance monitoring service
 * @module services/analytics/performance
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceService {
  private metrics: PerformanceMetric[] = [];

  /**
   * Mark performance point
   */
  mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  }

  /**
   * Measure between two marks
   */
  measure(name: string, startMark: string, endMark: string): number {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
        const entries = window.performance.getEntriesByName(name);
        
        if (entries.length > 0) {
          const duration = entries[0].duration;
          
          this.recordMetric({
            name,
            value: duration,
            timestamp: Date.now(),
          });
          
          return duration;
        }
      } catch {
        // Ignore errors
      }
    }
    
    return 0;
  }

  /**
   * Record custom metric
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }

  /**
   * Get Web Vitals
   */
  getWebVitals(): {
    lcp?: number;
    fid?: number;
    cls?: number;
  } {
    if (typeof window === 'undefined' || !window.performance) {
      return {};
    }

    const vitals: any = {};

    // Get LCP (Largest Contentful Paint)
    const lcpEntries = window.performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      vitals.lcp = (lcpEntries[lcpEntries.length - 1] as any).renderTime;
    }

    // Get CLS (Cumulative Layout Shift)
    const clsEntries = window.performance.getEntriesByType('layout-shift');
    if (clsEntries.length > 0) {
      vitals.cls = clsEntries.reduce((sum, entry: any) => {
        if (!entry.hadRecentInput) {
          return sum + entry.value;
        }
        return sum;
      }, 0);
    }

    return vitals;
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get average metric value
   */
  getAverageMetric(name: string): number {
    const filtered = this.metrics.filter(m => m.name === name);
    
    if (filtered.length === 0) {
      return 0;
    }

    const sum = filtered.reduce((acc, m) => acc + m.value, 0);
    return sum / filtered.length;
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceService = new PerformanceService();

