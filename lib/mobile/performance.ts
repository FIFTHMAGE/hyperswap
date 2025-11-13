/**
 * Mobile Performance Utilities
 * Optimizations for mobile devices
 */

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages(selector: string = 'img[data-src]'): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return () => {};
  }

  const images = document.querySelectorAll(selector);
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px', // Start loading 50px before visible
  });

  images.forEach((img) => imageObserver.observe(img));

  return () => imageObserver.disconnect();
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, delay - (now - lastCall));
    }
  };
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Request Animation Frame throttle
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return (...args: Parameters<T>) => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

/**
 * Measure performance
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number[]> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string): number {
    const start = this.marks.get(startMark);
    if (!start) {
      console.warn(`Start mark "${startMark}" not found`);
      return 0;
    }

    const duration = performance.now() - start;
    
    if (!this.measures.has(name)) {
      this.measures.set(name, []);
    }
    this.measures.get(name)!.push(duration);

    return duration;
  }

  getStats(name: string) {
    const measurements = this.measures.get(name) || [];
    if (measurements.length === 0) {
      return null;
    }

    const sum = measurements.reduce((a, b) => a + b, 0);
    const avg = sum / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return {
      count: measurements.length,
      average: avg,
      min,
      max,
      total: sum,
    };
  }

  clear(name?: string): void {
    if (name) {
      this.marks.delete(name);
      this.measures.delete(name);
    } else {
      this.marks.clear();
      this.measures.clear();
    }
  }
}

/**
 * Memory usage monitoring
 */
export function getMemoryUsage(): {
  used: number;
  limit: number;
  percentage: number;
} | null {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    used: memory.usedJSHeapSize,
    limit: memory.jsHeapSizeLimit,
    percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };
}

/**
 * FPS monitoring
 */
export class FPSMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private rafId: number | null = null;
  private listeners: Set<(fps: number) => void> = new Set();

  start(): void {
    if (this.rafId) return;

    const tick = () => {
      this.frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - this.lastTime;

      if (delta >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / delta);
        this.frameCount = 0;
        this.lastTime = currentTime;
        this.notifyListeners();
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  getFPS(): number {
    return this.fps;
  }

  subscribe(listener: (fps: number) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.fps));
  }
}

/**
 * Reduce motion for accessibility
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Battery status
 */
export async function getBatteryStatus(): Promise<{
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
} | null> {
  if (typeof navigator === 'undefined' || !('getBattery' in navigator)) {
    return null;
  }

  try {
    const battery = await (navigator as any).getBattery();
    return {
      level: battery.level,
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
    };
  } catch {
    return null;
  }
}

/**
 * Optimize images for mobile
 */
export function getOptimizedImageUrl(
  url: string,
  width: number,
  quality: number = 80
): string {
  // If using a CDN that supports URL parameters
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString(),
    auto: 'format', // Auto format (webp, avif)
  });

  // Check if URL already has query params
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Prefetch next page resources
 */
export function prefetchPage(url: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Check if low-end device
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;

  const memory = (navigator as any).deviceMemory;
  const cores = navigator.hardwareConcurrency;

  // Consider low-end if:
  // - Less than 4GB RAM
  // - Less than 4 CPU cores
  return (memory && memory < 4) || (cores && cores < 4);
}

/**
 * Adaptive loading based on connection
 */
export function shouldLoadHighQuality(): boolean {
  if (typeof navigator === 'undefined') return true;

  const connection = (navigator as any).connection ||
                     (navigator as any).mozConnection ||
                     (navigator as any).webkitConnection;

  if (!connection) return true;

  // Don't load high quality on slow connections or save-data mode
  if (connection.saveData) return false;
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
    return false;
  }

  return true;
}

/**
 * Virtual scrolling helper
 */
export function calculateVisibleItems(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + overscan * 2);

  return { start, end };
}

/**
 * Compress data before storing
 */
export async function compressData(data: string): Promise<Blob> {
  const stream = new Blob([data]).stream();
  const compressedStream = stream.pipeThrough(
    new CompressionStream('gzip')
  );
  
  return new Response(compressedStream).blob();
}

/**
 * Decompress stored data
 */
export async function decompressData(blob: Blob): Promise<string> {
  const stream = blob.stream();
  const decompressedStream = stream.pipeThrough(
    new DecompressionStream('gzip')
  );
  
  return new Response(decompressedStream).text();
}

