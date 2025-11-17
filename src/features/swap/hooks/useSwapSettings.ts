/**
 * Custom hook for managing swap settings
 */

import { useState } from 'react';

import { SwapSettings, DEFAULT_SWAP_SETTINGS } from '@/lib/types/swap';

const SETTINGS_KEY = 'hyperswap_settings';

export function useSwapSettings() {
  const [settings, setSettings] = useState<SwapSettings>(() => {
    // Initialize from localStorage on mount
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SWAP_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return DEFAULT_SWAP_SETTINGS;
  });

  const saveSettings = (newSettings: Partial<SwapSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      setSettings(updated);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSlippage = (slippage: number) => {
    saveSettings({ slippage });
  };

  const updateDeadline = (deadline: number) => {
    saveSettings({ deadline });
  };

  const toggleAutoRouting = () => {
    saveSettings({ autoRouting: !settings.autoRouting });
  };

  const toggleExpertMode = () => {
    saveSettings({ expertMode: !settings.expertMode });
  };

  const toggleMultihops = () => {
    saveSettings({ disableMultihops: !settings.disableMultihops });
  };

  const updateGasPrice = (gasPrice: string | undefined) => {
    saveSettings({ gasPrice });
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SWAP_SETTINGS);
    localStorage.removeItem(SETTINGS_KEY);
  };

  return {
    settings,
    updateSlippage,
    updateDeadline,
    toggleAutoRouting,
    toggleExpertMode,
    toggleMultihops,
    updateGasPrice,
    resetToDefaults,
  };
}
