/**
 * Mobile Utilities
 * Miscellaneous mobile helper functions
 */

/**
 * Prevent body scroll
 */
export function preventBodyScroll(prevent: boolean): void {
  if (prevent) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  } else {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}

/**
 * Share content (Web Share API)
 */
export async function shareContent(data: ShareData): Promise<boolean> {
  if (!navigator.share) return false;
  
  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Share failed:', error);
    }
    return false;
  }
}

/**
 * Add to home screen prompt
 */
export function canInstallPWA(): boolean {
  return !window.matchMedia('(display-mode: standalone)').matches &&
         !(window.navigator as any).standalone;
}

/**
 * Scroll to top smoothly
 */
export function scrollToTop(smooth: boolean = true): void {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

/**
 * Format number for mobile display
 */
export function formatMobileNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(0);
}

/**
 * Get viewport height accounting for mobile browsers
 */
export function getViewportHeight(): number {
  return window.visualViewport?.height || window.innerHeight;
}

/**
 * Check if keyboard is visible (approximation)
 */
export function isKeyboardVisible(): boolean {
  if (!window.visualViewport) return false;
  return window.visualViewport.height < window.innerHeight * 0.75;
}

/**
 * Detect safe area insets
 */
export function getSafeAreaInsets() {
  const getInset = (side: string) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--safe-area-inset-${side}`);
    return parseInt(value) || 0;
  };

  return {
    top: getInset('top'),
    right: getInset('right'),
    bottom: getInset('bottom'),
    left: getInset('left'),
  };
}

