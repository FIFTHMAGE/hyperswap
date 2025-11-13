/**
 * Haptic Feedback
 * Provides tactile feedback for mobile interactions
 */

export type HapticFeedbackType = 
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

export interface HapticConfig {
  enabled: boolean;
  intensity: number; // 0-1
}

const DEFAULT_CONFIG: HapticConfig = {
  enabled: true,
  intensity: 1.0,
};

class HapticFeedbackManager {
  private config: HapticConfig;
  private vibrationSupport: boolean;
  private tapticSupport: boolean;

  constructor(config: Partial<HapticConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.vibrationSupport = typeof navigator !== 'undefined' && 'vibrate' in navigator;
    this.tapticSupport = typeof window !== 'undefined' && 'Taptic Engine' in (navigator as any);
  }

  /**
   * Check if haptic feedback is supported
   */
  isSupported(): boolean {
    return this.vibrationSupport || this.tapticSupport;
  }

  /**
   * Trigger haptic feedback
   */
  trigger(type: HapticFeedbackType = 'light'): void {
    if (!this.config.enabled || !this.isSupported()) return;

    // Use Taptic Engine for iOS if available
    if (this.tapticSupport) {
      this.triggerTaptic(type);
      return;
    }

    // Fall back to vibration API
    if (this.vibrationSupport) {
      this.triggerVibration(type);
    }
  }

  /**
   * Trigger iOS Taptic Engine feedback
   */
  private triggerTaptic(type: HapticFeedbackType): void {
    try {
      const taptic = (navigator as any).tapticEngine;
      
      switch (type) {
        case 'light':
          taptic?.impactOccurred('light');
          break;
        case 'medium':
          taptic?.impactOccurred('medium');
          break;
        case 'heavy':
          taptic?.impactOccurred('heavy');
          break;
        case 'success':
          taptic?.notificationOccurred('success');
          break;
        case 'warning':
          taptic?.notificationOccurred('warning');
          break;
        case 'error':
          taptic?.notificationOccurred('error');
          break;
        case 'selection':
          taptic?.selectionChanged();
          break;
      }
    } catch (error) {
      console.warn('Taptic Engine error:', error);
    }
  }

  /**
   * Trigger vibration API feedback
   */
  private triggerVibration(type: HapticFeedbackType): void {
    const patterns: Record<HapticFeedbackType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 40,
      success: [10, 50, 10],
      warning: [10, 50, 10, 50, 10],
      error: [20, 100, 20, 100, 20],
      selection: 5,
    };

    const pattern = patterns[type];
    const scaledPattern = Array.isArray(pattern)
      ? pattern.map(v => Math.round(v * this.config.intensity))
      : Math.round(pattern * this.config.intensity);

    try {
      navigator.vibrate(scaledPattern);
    } catch (error) {
      console.warn('Vibration error:', error);
    }
  }

  /**
   * Trigger custom vibration pattern
   */
  custom(pattern: number | number[]): void {
    if (!this.config.enabled || !this.vibrationSupport) return;

    const scaledPattern = Array.isArray(pattern)
      ? pattern.map(v => Math.round(v * this.config.intensity))
      : Math.round(pattern * this.config.intensity);

    try {
      navigator.vibrate(scaledPattern);
    } catch (error) {
      console.warn('Vibration error:', error);
    }
  }

  /**
   * Cancel ongoing vibration
   */
  cancel(): void {
    if (this.vibrationSupport) {
      navigator.vibrate(0);
    }
  }

  /**
   * Enable haptic feedback
   */
  enable(): void {
    this.config.enabled = true;
  }

  /**
   * Disable haptic feedback
   */
  disable(): void {
    this.config.enabled = false;
    this.cancel();
  }

  /**
   * Set intensity
   */
  setIntensity(intensity: number): void {
    this.config.intensity = Math.max(0, Math.min(1, intensity));
  }

  /**
   * Get configuration
   */
  getConfig(): HapticConfig {
    return { ...this.config };
  }
}

// Singleton instance
let hapticManager: HapticFeedbackManager | null = null;

export function getHapticManager(config?: Partial<HapticConfig>): HapticFeedbackManager {
  if (!hapticManager && typeof window !== 'undefined') {
    hapticManager = new HapticFeedbackManager(config);
  }
  return hapticManager!;
}

/**
 * React hook for haptic feedback
 */
export function useHaptic() {
  if (typeof window === 'undefined') {
    return {
      trigger: () => {},
      custom: () => {},
      cancel: () => {},
      enable: () => {},
      disable: () => {},
      setIntensity: () => {},
      isSupported: false,
    };
  }

  const manager = getHapticManager();

  return {
    trigger: (type?: HapticFeedbackType) => manager.trigger(type),
    custom: (pattern: number | number[]) => manager.custom(pattern),
    cancel: () => manager.cancel(),
    enable: () => manager.enable(),
    disable: () => manager.disable(),
    setIntensity: (intensity: number) => manager.setIntensity(intensity),
    isSupported: manager.isSupported(),
  };
}

/**
 * Higher-order component to add haptic feedback to buttons
 */
export function withHaptic<P extends { onClick?: () => void }>(
  Component: React.ComponentType<P>,
  hapticType: HapticFeedbackType = 'light'
) {
  return (props: P) => {
    const { trigger } = useHaptic();

    const handleClick = () => {
      trigger(hapticType);
      props.onClick?.();
    };

    return <Component {...props} onClick={handleClick} />;
  };
}

// Import React for the hook
import * as React from 'react';

