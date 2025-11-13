/**
 * PWA Features Hook
 * Unified hook for PWA capabilities
 */

import { useState, useEffect } from 'react';
import { getServiceWorkerManager } from '@/lib/pwa/service-worker-manager';
import { getBackgroundSyncManager } from '@/lib/pwa/background-sync';
import { getOfflineManager } from '@/lib/pwa/offline-manager';

export function usePWAFeatures() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [pendingSyncs, setPendingSyncs] = useState(0);

  useEffect(() => {
    // Check if installed
    const checkInstalled = () => {
      setIsInstalled(
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      );
    };
    checkInstalled();

    // Monitor online status
    const offlineManager = getOfflineManager();
    const unsubscribeOnline = offlineManager.subscribe(setIsOnline);

    // Monitor service worker updates
    const swManager = getServiceWorkerManager();
    const unsubscribeUpdate = swManager.on('updateAvailable', () => setUpdateAvailable(true));

    // Monitor background syncs
    const bgSyncManager = getBackgroundSyncManager();
    const updateSyncCount = () => setPendingSyncs(bgSyncManager.getPendingCount());
    updateSyncCount();
    const syncInterval = setInterval(updateSyncCount, 1000);

    return () => {
      unsubscribeOnline();
      unsubscribeUpdate();
      clearInterval(syncInterval);
    };
  }, []);

  return {
    isInstalled,
    isOnline,
    updateAvailable,
    pendingSyncs,
  };
}

