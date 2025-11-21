/**
 * Settings Manager
 * Handles user preferences and application settings
 */

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export interface UserSettings {
  slippage: number;
  deadline: number;
  gasPrice: 'slow' | 'medium' | 'fast' | 'custom';
  customGasPrice?: string;
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  notifications: {
    transactions: boolean;
    priceAlerts: boolean;
    news: boolean;
  };
  privacy: {
    analytics: boolean;
    errorReporting: boolean;
  };
  advanced: {
    expertMode: boolean;
    multihops: boolean;
    showTestnets: boolean;
    autoRouter: boolean;
  };
}

export const defaultSettings: UserSettings = {
  slippage: 0.5,
  deadline: 20,
  gasPrice: 'medium',
  theme: 'auto',
  currency: 'USD',
  notifications: {
    transactions: true,
    priceAlerts: true,
    news: false,
  },
  privacy: {
    analytics: true,
    errorReporting: true,
  },
  advanced: {
    expertMode: false,
    multihops: true,
    showTestnets: false,
    autoRouter: true,
  },
};

const SETTINGS_KEY = 'app_settings';

export class SettingsManager {
  private settings: UserSettings;
  private storageManager: StorageManager;
  private listeners: Map<string, Set<(settings: UserSettings) => void>>;

  constructor() {
    this.storageManager = new StorageManager();
    this.listeners = new Map();
    this.settings = this.loadSettings();
  }

  /**
   * Load settings from storage
   */
  private loadSettings(): UserSettings {
    try {
      const stored = this.storageManager.get<UserSettings>(SETTINGS_KEY);
      if (stored) {
        // Merge with defaults to handle new settings
        return { ...defaultSettings, ...stored };
      }
      return { ...defaultSettings };
    } catch (error) {
      logger.error('Error loading settings:', error);
      return { ...defaultSettings };
    }
  }

  /**
   * Save settings to storage
   */
  private saveSettings(): void {
    try {
      this.storageManager.set(SETTINGS_KEY, this.settings);
      this.notifyListeners();
    } catch (error) {
      logger.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  /**
   * Get all settings
   */
  getSettings(): UserSettings {
    return { ...this.settings };
  }

  /**
   * Get a specific setting
   */
  getSetting<K extends keyof UserSettings>(key: K): UserSettings[K] {
    return this.settings[key];
  }

  /**
   * Update settings
   */
  updateSettings(updates: Partial<UserSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
  }

  /**
   * Update a specific setting
   */
  updateSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
    this.settings[key] = value;
    this.saveSettings();
  }

  /**
   * Update slippage tolerance
   */
  setSlippage(slippage: number): void {
    if (slippage < 0 || slippage > 50) {
      throw new Error('Slippage must be between 0 and 50');
    }
    this.settings.slippage = slippage;
    this.saveSettings();
  }

  /**
   * Update transaction deadline
   */
  setDeadline(deadline: number): void {
    if (deadline < 1 || deadline > 60) {
      throw new Error('Deadline must be between 1 and 60 minutes');
    }
    this.settings.deadline = deadline;
    this.saveSettings();
  }

  /**
   * Update gas price setting
   */
  setGasPrice(gasPrice: UserSettings['gasPrice'], customPrice?: string): void {
    this.settings.gasPrice = gasPrice;
    if (gasPrice === 'custom' && customPrice) {
      this.settings.customGasPrice = customPrice;
    }
    this.saveSettings();
  }

  /**
   * Update theme
   */
  setTheme(theme: UserSettings['theme']): void {
    this.settings.theme = theme;
    this.saveSettings();
    this.applyTheme();
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    const theme = this.settings.theme;
    const root = document.documentElement;

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }

  /**
   * Update currency
   */
  setCurrency(currency: string): void {
    this.settings.currency = currency;
    this.saveSettings();
  }

  /**
   * Toggle notification setting
   */
  toggleNotification(type: keyof UserSettings['notifications']): void {
    this.settings.notifications[type] = !this.settings.notifications[type];
    this.saveSettings();
  }

  /**
   * Toggle privacy setting
   */
  togglePrivacy(type: keyof UserSettings['privacy']): void {
    this.settings.privacy[type] = !this.settings.privacy[type];
    this.saveSettings();
  }

  /**
   * Toggle advanced setting
   */
  toggleAdvanced(type: keyof UserSettings['advanced']): void {
    this.settings.advanced[type] = !this.settings.advanced[type];
    this.saveSettings();
  }

  /**
   * Enable expert mode
   */
  enableExpertMode(): void {
    this.settings.advanced.expertMode = true;
    this.saveSettings();
  }

  /**
   * Disable expert mode
   */
  disableExpertMode(): void {
    this.settings.advanced.expertMode = false;
    this.saveSettings();
  }

  /**
   * Check if expert mode is enabled
   */
  isExpertMode(): boolean {
    return this.settings.advanced.expertMode;
  }

  /**
   * Reset settings to defaults
   */
  resetSettings(): void {
    this.settings = { ...defaultSettings };
    this.saveSettings();
  }

  /**
   * Reset specific section to defaults
   */
  resetSection<K extends keyof UserSettings>(section: K): void {
    this.settings[section] = defaultSettings[section];
    this.saveSettings();
  }

  /**
   * Export settings
   */
  exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  /**
   * Import settings
   */
  importSettings(settingsJson: string): void {
    try {
      const imported = JSON.parse(settingsJson) as UserSettings;
      // Validate imported settings
      if (this.validateSettings(imported)) {
        this.settings = { ...defaultSettings, ...imported };
        this.saveSettings();
      } else {
        throw new Error('Invalid settings format');
      }
    } catch (error) {
      logger.error('Error importing settings:', error);
      throw new Error('Failed to import settings');
    }
  }

  /**
   * Validate settings object
   */
  private validateSettings(settings: any): settings is UserSettings {
    return (
      typeof settings === 'object' &&
      typeof settings.slippage === 'number' &&
      typeof settings.deadline === 'number' &&
      typeof settings.theme === 'string' &&
      typeof settings.currency === 'string' &&
      typeof settings.notifications === 'object' &&
      typeof settings.privacy === 'object' &&
      typeof settings.advanced === 'object'
    );
  }

  /**
   * Subscribe to settings changes
   */
  subscribe(callback: (settings: UserSettings) => void): () => void {
    const id = Math.random().toString(36).substring(7);
    if (!this.listeners.has(id)) {
      this.listeners.set(id, new Set());
    }
    this.listeners.get(id)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(id);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(id);
        }
      }
    };
  }

  /**
   * Notify all listeners of settings changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listeners) => {
      listeners.forEach((callback) => {
        try {
          callback(this.getSettings());
        } catch (error) {
          logger.error('Error notifying settings listener:', error);
        }
      });
    });
  }

  /**
   * Get settings summary for display
   */
  getSettingsSummary(): Record<string, any> {
    return {
      trading: {
        slippage: `${this.settings.slippage}%`,
        deadline: `${this.settings.deadline} minutes`,
        gasPrice: this.settings.gasPrice,
      },
      display: {
        theme: this.settings.theme,
        currency: this.settings.currency,
      },
      notifications: this.settings.notifications,
      privacy: this.settings.privacy,
      advanced: this.settings.advanced,
    };
  }
}

// Singleton instance
export const settingsManager = new SettingsManager();
