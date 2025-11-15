export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};

  startMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Observe Web Vitals
    this.observeFCP();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.measureTTFB();
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  private observeFCP(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.reportMetric('fcp', entry.startTime);
        }
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  }

  private observeLCP(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.reportMetric('lcp', lastEntry.startTime);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private observeFID(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.fid = (entry as any).processingStart - entry.startTime;
        this.reportMetric('fid', this.metrics.fid);
      }
    });

    observer.observe({ entryTypes: ['first-input'] });
  }

  private observeCLS(): void {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          this.metrics.cls = clsValue;
        }
      }
      this.reportMetric('cls', clsValue);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  private measureTTFB(): void {
    const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navTiming) {
      this.metrics.ttfb = navTiming.responseStart - navTiming.requestStart;
      this.reportMetric('ttfb', this.metrics.ttfb);
    }
  }

  private reportMetric(name: keyof PerformanceMetrics, value: number): void {
    console.log(`[Performance] ${name}:`, value);
    // In production, send to analytics
  }
}

export const performanceMonitor = new PerformanceMonitor();

