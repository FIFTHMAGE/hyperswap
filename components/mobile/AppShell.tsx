/**
 * Mobile App Shell
 * Main layout wrapper for mobile app with navigation and shell components
 */

'use client';

import { ReactNode, useState, useEffect } from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import { OfflineIndicator } from './OfflineIndicator';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface AppShellProps {
  children: ReactNode;
  showNavigation?: boolean;
  showOfflineIndicator?: boolean;
  showPWAPrompt?: boolean;
  header?: ReactNode;
  showHeader?: boolean;
}

export function AppShell({
  children,
  showNavigation = true,
  showOfflineIndicator = true,
  showPWAPrompt = true,
  header,
  showHeader = true,
}: AppShellProps) {
  const { isMobile, isPWA } = useMobileDetection();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Offline Indicator */}
      {showOfflineIndicator && <OfflineIndicator position="top" />}

      {/* Header */}
      {showHeader && (
        <header
          className={`
            sticky top-0 z-40 bg-white transition-shadow duration-200
            ${scrolled ? 'shadow-md' : 'border-b border-gray-200'}
            ${isMobile && isPWA ? 'pt-safe-area-top' : ''}
          `}
        >
          {header || <DefaultHeader />}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-safe-area-bottom">
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNavigation && isMobile && <MobileBottomNav />}

      {/* PWA Install Prompt */}
      {showPWAPrompt && !isPWA && <PWAInstallPrompt />}
    </div>
  );
}

function DefaultHeader() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
            H
          </div>
          <div>
            <h1 className="text-xl font-bold">HyperSwap</h1>
            <p className="text-xs text-gray-500">DeFi Trading</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2.5 rounded-xl bg-gray-100 text-gray-700 active:scale-95 transition-transform"
          >
            🔍
          </button>
          <button className="p-2.5 rounded-xl bg-gray-100 text-gray-700 active:scale-95 transition-transform">
            🔔
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="mt-4 animate-slide-down">
          <input
            type="search"
            placeholder="Search tokens..."
            className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}

/**
 * Pull to Refresh Component
 */
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80 
}: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && startY > 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY);
      
      if (distance > 0) {
        setPulling(true);
        setPullDistance(Math.min(distance, threshold * 1.5));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !refreshing) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    
    setPulling(false);
    setPullDistance(0);
    setStartY(0);
  };

  const rotation = Math.min((pullDistance / threshold) * 360, 360);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {(pulling || refreshing) && (
        <div
          className="fixed top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-50"
          style={{
            height: `${Math.min(pullDistance, threshold)}px`,
            opacity: Math.min(pullDistance / threshold, 1),
          }}
        >
          <div
            className={`
              text-2xl
              ${refreshing ? 'animate-spin' : ''}
            `}
            style={{
              transform: refreshing ? undefined : `rotate(${rotation}deg)`,
            }}
          >
            {refreshing ? '⏳' : '↻'}
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

/**
 * Safe Area Spacer
 * Adds spacing for notches and home indicators
 */
export function SafeAreaSpacer({ position }: { position: 'top' | 'bottom' }) {
  return (
    <div className={position === 'top' ? 'pt-safe-area-top' : 'pb-safe-area-bottom'} />
  );
}

