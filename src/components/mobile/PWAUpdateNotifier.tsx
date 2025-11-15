/**
 * PWA Update Notifier
 * Notifies users when a new version is available
 */

'use client';

import { useState, useEffect } from 'react';
import { getServiceWorkerManager } from '@/lib/pwa/service-worker-manager';

export function PWAUpdateNotifier() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const swManager = getServiceWorkerManager();

    const unsubscribe = swManager.on('updateAvailable', () => {
      setUpdateAvailable(true);
    });

    return unsubscribe;
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    const swManager = getServiceWorkerManager();
    swManager.skipWaiting();
    
    // Reload after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎉</div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Update Available!</h3>
            <p className="text-sm text-blue-100">
              A new version of HyperSwap is ready. Update now for the latest features.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setUpdateAvailable(false)}
            className="flex-1 py-2 bg-white/20 backdrop-blur rounded-lg font-medium active:scale-95 transition-transform"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1 py-2 bg-white text-blue-600 rounded-lg font-bold active:scale-95 transition-transform disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

