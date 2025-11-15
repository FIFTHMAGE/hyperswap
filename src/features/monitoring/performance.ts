interface PerformanceMark {
  name: string;
  startTime: number;
  duration?: number;
}

class PerformanceMonitor {
  private marks: Map<string, PerformanceMark> = new Map();

  start(name: string): void {
    this.marks.set(name, {
      name,
      startTime: performance.now(),
    });
  }

  end(name: string): number | null {
    const mark = this.marks.get(name);
    if (!mark) return null;

    const duration = performance.now() - mark.startTime;
    mark.duration = duration;

    // Log slow operations
    if (duration > 1000) {
      console.warn(`[Performance] Slow operation: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measure(name: string, fn: () => void): number {
    this.start(name);
    fn();
    return this.end(name) || 0;
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    const result = await fn();
    this.end(name);
    return result;
  }

  getMetrics(): PerformanceMark[] {
    return Array.from(this.marks.values());
  }

  clear(): void {
    this.marks.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

