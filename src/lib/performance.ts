/**
 * Performance monitoring utilities
 * @module lib/performance
 */

/**
 * Measure Web Vitals
 */
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Send to your analytics service
    // Example: gtag('event', metric.name, { ... })
  }
}

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string, callback: () => void) {
  const start = performance.now();
  callback();
  const end = performance.now();
  const duration = end - start;

  if (duration > 16) { // More than one frame (60fps)
    console.warn(`${componentName} render took ${duration.toFixed(2)}ms`);
  }
}

/**
 * Mark performance checkpoint
 */
export function markPerformance(name: string) {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(name);
  }
}

/**
 * Measure between two performance marks
 */
export function measurePerformance(name: string, startMark: string, endMark: string) {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      return measure.duration;
    } catch (error) {
      console.error('Performance measurement error:', error);
      return null;
    }
  }
  return null;
}

/**
 * Get page load metrics
 */
export function getPageLoadMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) return null;

  return {
    // Time to first byte
    ttfb: navigation.responseStart - navigation.requestStart,
    
    // DOM content loaded
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    
    // Full page load
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    
    // Total page load time
    totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
  };
}

/**
 * Monitor long tasks
 */
export function monitorLongTasks(threshold = 50) {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > threshold) {
        console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`, entry);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    console.error('Long task monitoring not supported:', error);
  }

  return observer;
}

/**
 * Track resource loading times
 */
export function getResourceTimings() {
  if (typeof window === 'undefined' || !window.performance) {
    return [];
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  return resources.map(resource => ({
    name: resource.name,
    duration: resource.duration,
    size: resource.transferSize,
    type: resource.initiatorType,
  }));
}

/**
 * Clear performance marks and measures
 */
export function clearPerformanceMarks() {
  if (typeof window !== 'undefined' && window.performance) {
    performance.clearMarks();
    performance.clearMeasures();
  }
}

