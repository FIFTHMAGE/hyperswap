/**
 * Browser and device detection utilities
 * @module utils/browser/detection
 */

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if running on mobile device
 */
export function isMobile(): boolean {
  if (!isBrowser()) return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  if (!isBrowser()) return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  if (!isBrowser()) return false;
  
  return /Android/.test(navigator.userAgent);
}

/**
 * Check if running in standalone PWA mode
 */
export function isPWA(): boolean {
  if (!isBrowser()) return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * Check if running in dark mode
 */
export function isDarkMode(): boolean {
  if (!isBrowser()) return false;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get browser name
 */
export function getBrowserName(): string {
  if (!isBrowser()) return 'unknown';
  
  const ua = navigator.userAgent;
  
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  
  return 'unknown';
}

/**
 * Get device type
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (!isBrowser()) return 'desktop';
  
  const ua = navigator.userAgent;
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  
  if (isMobile()) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Check if touch device
 */
export function isTouchDevice(): boolean {
  if (!isBrowser()) return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * Get viewport size
 */
export function getViewportSize(): { width: number; height: number } {
  if (!isBrowser()) {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

