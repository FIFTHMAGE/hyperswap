/**
 * PWA Install Prompt
 * Prompts users to install the app as a PWA
 */

'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallPromptProps {
  delay?: number; // Delay before showing prompt (ms)
  persistent?: boolean; // Show again if dismissed
}

export function PWAInstallPrompt({ delay = 3000, persistent = false }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after delay
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed || persistent) {
          setShowPrompt(true);
        }
      }, delay);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [delay, persistent]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
        if (!persistent) {
          localStorage.setItem('pwa-install-dismissed', 'true');
        }
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (!persistent) {
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  // iOS-specific instructions
  if (isIOS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 shadow-2xl z-50 animate-slide-up">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📱</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Install HyperSwap</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the full app experience with offline access and faster loading.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-2xl">1️⃣</span>
                  <span>Tap the share button 
                    <span className="inline-block mx-1 p-1 bg-blue-100 rounded">
                      <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                      </svg>
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-2xl">2️⃣</span>
                  <span>Select "Add to Home Screen"</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-2xl">3️⃣</span>
                  <span>Tap "Add" to confirm</span>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium active:scale-98 transition-transform"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Android/Desktop prompt
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-2xl z-50 animate-slide-up">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🚀</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Install HyperSwap</h3>
            <p className="text-sm text-blue-100 mb-4">
              Get instant access with offline support and push notifications.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleInstallClick}
                className="flex-1 py-3 bg-white text-blue-600 rounded-lg font-bold active:scale-95 transition-transform"
              >
                Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-6 py-3 bg-white/20 backdrop-blur rounded-lg font-medium active:scale-95 transition-transform"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

