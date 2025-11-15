/**
 * Touch Gesture Detection
 * Advanced touch gesture recognition for mobile interactions
 */

export type GestureType = 'tap' | 'doubletap' | 'press' | 'swipe' | 'pinch' | 'rotate';
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface GestureEvent {
  type: GestureType;
  startPoint: TouchPoint;
  endPoint: TouchPoint;
  distance?: number;
  direction?: SwipeDirection;
  scale?: number;
  rotation?: number;
  duration: number;
}

export interface GestureConfig {
  swipeThreshold: number; // Minimum distance for swipe (px)
  swipeVelocity: number; // Minimum velocity for swipe (px/ms)
  pressDelay: number; // Delay for press detection (ms)
  doubleTapDelay: number; // Max delay between taps (ms)
  tapMaxDistance: number; // Max movement for tap (px)
  pinchThreshold: number; // Minimum scale change for pinch
}

const DEFAULT_CONFIG: GestureConfig = {
  swipeThreshold: 50,
  swipeVelocity: 0.3,
  pressDelay: 500,
  doubleTapDelay: 300,
  tapMaxDistance: 10,
  pinchThreshold: 0.1,
};

export class TouchGestureDetector {
  private element: HTMLElement;
  private config: GestureConfig;
  private startPoint: TouchPoint | null = null;
  private endPoint: TouchPoint | null = null;
  private lastTapTime = 0;
  private pressTimer: NodeJS.Timeout | null = null;
  private initialDistance = 0;
  private initialAngle = 0;
  
  private listeners: {
    [K in GestureType]?: ((event: GestureEvent) => void)[];
  } = {};

  constructor(element: HTMLElement, config: Partial<GestureConfig> = {}) {
    this.element = element;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.attachListeners();
  }

  /**
   * Attach touch event listeners
   */
  private attachListeners(): void {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this));
  }

  /**
   * Handle touch start
   */
  private handleTouchStart(e: TouchEvent): void {
    const touch = e.touches[0];
    this.startPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    // Handle multi-touch (pinch/rotate)
    if (e.touches.length === 2) {
      this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
      this.initialAngle = this.getAngle(e.touches[0], e.touches[1]);
    }

    // Start press timer
    this.pressTimer = setTimeout(() => {
      if (this.startPoint) {
        this.emit('press', {
          type: 'press',
          startPoint: this.startPoint,
          endPoint: this.startPoint,
          duration: Date.now() - this.startPoint.timestamp,
        });
      }
    }, this.config.pressDelay);
  }

  /**
   * Handle touch move
   */
  private handleTouchMove(e: TouchEvent): void {
    if (!this.startPoint) return;

    // Cancel press on movement
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }

    const touch = e.touches[0];
    this.endPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    // Handle pinch gesture
    if (e.touches.length === 2) {
      const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
      const currentAngle = this.getAngle(e.touches[0], e.touches[1]);
      
      const scale = currentDistance / this.initialDistance;
      const rotation = currentAngle - this.initialAngle;

      // Detect pinch
      if (Math.abs(1 - scale) > this.config.pinchThreshold) {
        this.emit('pinch', {
          type: 'pinch',
          startPoint: this.startPoint,
          endPoint: this.endPoint,
          scale,
          rotation,
          duration: Date.now() - this.startPoint.timestamp,
        });
      }

      // Detect rotation
      if (Math.abs(rotation) > 15) {
        this.emit('rotate', {
          type: 'rotate',
          startPoint: this.startPoint,
          endPoint: this.endPoint,
          rotation,
          duration: Date.now() - this.startPoint.timestamp,
        });
      }
    }
  }

  /**
   * Handle touch end
   */
  private handleTouchEnd(e: TouchEvent): void {
    if (!this.startPoint) return;

    // Clear press timer
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }

    const touch = e.changedTouches[0];
    this.endPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    const distance = this.getPointDistance(this.startPoint, this.endPoint);
    const duration = this.endPoint.timestamp - this.startPoint.timestamp;

    // Detect tap or double tap
    if (distance < this.config.tapMaxDistance) {
      const timeSinceLastTap = Date.now() - this.lastTapTime;
      
      if (timeSinceLastTap < this.config.doubleTapDelay) {
        this.emit('doubletap', {
          type: 'doubletap',
          startPoint: this.startPoint,
          endPoint: this.endPoint,
          duration,
        });
        this.lastTapTime = 0; // Reset to prevent triple tap
      } else {
        this.emit('tap', {
          type: 'tap',
          startPoint: this.startPoint,
          endPoint: this.endPoint,
          duration,
        });
        this.lastTapTime = Date.now();
      }
    } 
    // Detect swipe
    else if (distance >= this.config.swipeThreshold) {
      const velocity = distance / duration;
      
      if (velocity >= this.config.swipeVelocity) {
        const direction = this.getSwipeDirection(this.startPoint, this.endPoint);
        this.emit('swipe', {
          type: 'swipe',
          startPoint: this.startPoint,
          endPoint: this.endPoint,
          distance,
          direction,
          duration,
        });
      }
    }

    this.startPoint = null;
    this.endPoint = null;
  }

  /**
   * Handle touch cancel
   */
  private handleTouchCancel(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
    this.startPoint = null;
    this.endPoint = null;
  }

  /**
   * Get distance between two touch points
   */
  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get angle between two touch points
   */
  private getAngle(touch1: Touch, touch2: Touch): number {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }

  /**
   * Get distance between two points
   */
  private getPointDistance(p1: TouchPoint, p2: TouchPoint): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Determine swipe direction
   */
  private getSwipeDirection(start: TouchPoint, end: TouchPoint): SwipeDirection {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  }

  /**
   * Register gesture listener
   */
  on(gesture: GestureType, callback: (event: GestureEvent) => void): () => void {
    if (!this.listeners[gesture]) {
      this.listeners[gesture] = [];
    }
    this.listeners[gesture]!.push(callback);

    // Return unsubscribe function
  return () => {
      this.off(gesture, callback);
    };
  }

  /**
   * Remove gesture listener
   */
  off(gesture: GestureType, callback: (event: GestureEvent) => void): void {
    if (this.listeners[gesture]) {
      this.listeners[gesture] = this.listeners[gesture]!.filter(cb => cb !== callback);
    }
  }

  /**
   * Emit gesture event
   */
  private emit(gesture: GestureType, event: GestureEvent): void {
    if (this.listeners[gesture]) {
      this.listeners[gesture]!.forEach(callback => callback(event));
    }
  }

  /**
   * Cleanup and remove listeners
   */
  destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));
    
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }

    this.listeners = {};
  }
}

/**
 * React hook for touch gestures
 */
export function useTouchGestures(
  elementRef: React.RefObject<HTMLElement>,
  handlers: Partial<Record<GestureType, (event: GestureEvent) => void>>,
  config?: Partial<GestureConfig>
) {
  if (typeof window === 'undefined' || !elementRef.current) return;

  const detector = new TouchGestureDetector(elementRef.current, config);

  Object.entries(handlers).forEach(([gesture, handler]) => {
    if (handler) {
      detector.on(gesture as GestureType, handler);
    }
  });

  return () => detector.destroy();
}
