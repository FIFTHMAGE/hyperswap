/**
 * Offline Indicator
 * Displays connection status and offline mode indicator
 */

'use client';

import { useState, useEffect } from 'react';
import { getOfflineManager } from '@/lib/pwa/offline-manager';

interface OfflineIndicatorProps {
  position?: 'top' | 'bottom';
  showOnlineMessage?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export function OfflineIndicator({ 
  position = 'top',
  showOnlineMessage = true,
  autoHide = true,
  autoHideDelay = 3000 
}: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const manager = getOfflineManager();
    
    const unsubscribe = manager.subscribe((online) => {
      setIsOnline(online);
      setShowMessage(true);

      // Auto-hide online message
      if (online && autoHide) {
        setTimeout(() => {
          setShowMessage(false);
        }, autoHideDelay);
      }
    });

    return unsubscribe;
  }, [autoHide, autoHideDelay]);

  if (!showMessage && isOnline) {
    return null;
  }

  const positionClasses = position === 'top' 
    ? 'top-0 rounded-b-lg' 
    : 'bottom-0 rounded-t-lg';

  if (!isOnline) {
    return (
      <div className={`fixed left-0 right-0 ${positionClasses} z-50 animate-slide-down`}>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
              </div>
              <div>
                <div className="font-bold text-sm">You're Offline</div>
                <div className="text-xs text-orange-100">
                  Some features may be limited. Changes will sync when you're back online.
                </div>
              </div>
            </div>
            
            {pendingCount > 0 && (
              <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
                {pendingCount} pending
              </div>
            )}
          </div>
        </div>
        
        {/* Offline Mode Details */}
        <div className="bg-orange-50 border-t border-orange-200 px-4 py-2">
          <div className="container mx-auto">
            <div className="flex items-center gap-4 text-xs text-orange-800">
              <div className="flex items-center gap-1">
                <span>✓</span>
                <span>View cached data</span>
              </div>
              <div className="flex items-center gap-1">
                <span>✓</span>
                <span>Browse history</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⏳</span>
                <span>Transactions will sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showOnlineMessage) {
    return (
      <div className={`fixed left-0 right-0 ${positionClasses} z-50 animate-slide-down`}>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
              </div>
              <div>
                <div className="font-bold text-sm">You're Back Online!</div>
                <div className="text-xs text-green-100">
                  All features are now available. Syncing pending changes...
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowMessage(false)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Compact Offline Badge
 * Small badge to show offline status
 */
export function OfflineBadge() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const manager = getOfflineManager();
    return manager.subscribe(setIsOnline);
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-orange-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>Offline</span>
      </div>
    </div>
  );
}

/**
 * Connection Quality Indicator
 * Shows connection quality with signal strength
 */
export function ConnectionQuality() {
  const [isOnline, setIsOnline] = useState(true);
  const [quality, setQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent');

  useEffect(() => {
    const manager = getOfflineManager();
    
    const unsubscribe = manager.subscribe(setIsOnline);

    // Monitor connection quality
    const checkQuality = async () => {
      if (!isOnline) {
        setQuality('poor');
        return;
      }

      try {
        const start = Date.now();
        await fetch('/api/ping', { method: 'HEAD' });
        const latency = Date.now() - start;

        if (latency < 100) setQuality('excellent');
        else if (latency < 300) setQuality('good');
        else if (latency < 1000) setQuality('fair');
        else setQuality('poor');
      } catch {
        setQuality('poor');
      }
    };

    checkQuality();
    const interval = setInterval(checkQuality, 10000); // Check every 10s

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [isOnline]);

  const getSignalBars = () => {
    const bars = {
      excellent: 4,
      good: 3,
      fair: 2,
      poor: 1,
    };
    return bars[quality];
  };

  const getColor = () => {
    const colors = {
      excellent: 'bg-green-500',
      good: 'bg-yellow-500',
      fair: 'bg-orange-500',
      poor: 'bg-red-500',
    };
    return colors[quality];
  };

  const bars = getSignalBars();

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={`w-1 ${getColor()} rounded transition-all`}
          style={{
            height: `${bar * 4}px`,
            opacity: bar <= bars ? 1 : 0.2,
          }}
        />
      ))}
    </div>
  );
}

