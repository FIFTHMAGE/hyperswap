'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { promptInstall, isStandalone } from '@/lib/pwa/install-prompt';

export function InstallPromptBanner() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      return;
    }

    const handleInstallable = () => {
      // Show prompt after 30 seconds or on second visit
      const visitCount = parseInt(localStorage.getItem('visit-count') || '0');
      localStorage.setItem('visit-count', String(visitCount + 1));

      if (visitCount >= 1) {
        setTimeout(() => setShowPrompt(true), 30000);
      }
    };

    const handleInstalled = () => {
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted || !accepted) {
      setShowPrompt(false);
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">
                  Install Wallet Wrapped
                </h3>
                <p className="text-white/90 text-sm">
                  Access your crypto stats anytime, even offline
                </p>
              </div>
              <button
                onClick={() => setShowPrompt(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleInstall}
                size="sm"
                className="flex-1 bg-white text-purple-600 hover:bg-gray-100"
              >
                Install
              </Button>
              <Button
                onClick={() => setShowPrompt(false)}
                size="sm"
                variant="outline"
                className="flex-1 border-white text-white hover:bg-white/10"
              >
                Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

