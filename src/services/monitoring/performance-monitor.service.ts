/**
 * Performance monitoring service
 * @module services/monitoring
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

class PerformanceMonitorService {
  private metrics: PerformanceMetric[] = [];
  private marks = new Map<string, number>();

  /**
   * Start measuring performance
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * End measurement and record metric
   */
  measure(name: string, metadata?: Record<string, unknown>): number {
    const startTime = this.marks.get(name);

    if (!startTime) {
      console.warn(`No mark found for: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;

    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    });

    this.marks.delete(name);
    return duration;
  }

  /**
   * Get metrics by name
   */
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name);
    }
    return [...this.metrics];
  }

  /**
   * Get average duration for metric
   */
  getAverage(name: string): number {
    const filtered = this.metrics.filter((m) => m.name === name);
    if (filtered.length === 0) return 0;

    const sum = filtered.reduce((acc, m) => acc + m.duration, 0);
    return sum / filtered.length;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.marks.clear();
  }
}

export const performanceMonitor = new PerformanceMonitorService();
