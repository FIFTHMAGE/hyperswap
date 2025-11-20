/**
 * SettingsManager - User settings management
 * @module features/settings
 */

export interface UserSettings {
  slippage: number;
  deadline: number;
  gasPreference: 'low' | 'medium' | 'high';
  theme: 'light' | 'dark' | 'auto';
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  notifications: {
    transactionComplete: boolean;
    priceAlerts: boolean;
    newFeatures: boolean;
  };
  privacy: {
    showBalance: boolean;
    showHistory: boolean;
  };
  advanced: {
    expertMode: boolean;
    multihops: boolean;
    disableConfirmations: boolean;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  slippage: 0.5,
  deadline: 1200,
  gasPreference: 'medium',
  theme: 'auto',
  currency: 'USD',
  notifications: {
    transactionComplete: true,
    priceAlerts: true,
    newFeatures: false,
  },
  privacy: {
    showBalance: true,
    showHistory: true,
  },
  advanced: {
    expertMode: false,
    multihops: true,
    disableConfirmations: false,
  },
};

const STORAGE_KEY = 'hyperswap_settings';

export class SettingsManager {
  private settings: UserSettings;
  private listeners: Set<(settings: UserSettings) => void> = new Set();

  constructor() {
    this.settings = this.loadSettings();
  }

  /**
   * Get current settings
   */
  getSettings(): UserSettings {
    return { ...this.settings };
  }

  /**
   * Get a specific setting value
   */
  get<K extends keyof UserSettings>(key: K): UserSettings[K] {
    return this.settings[key];
  }

  /**
   * Update settings
   */
  updateSettings(updates: Partial<UserSettings>): void {
    this.settings = {
      ...this.settings,
      ...updates,
    };
    this.saveSettings();
    this.notifyListeners();
  }

  /**
   * Update nested setting
   */
  updateNestedSetting<T extends keyof UserSettings>(
    category: T,
    updates: Partial<UserSettings[T]>
  ): void {
    this.settings = {
      ...this.settings,
      [category]: {
        ...this.settings[category],
        ...updates,
      },
    };
    this.saveSettings();
    this.notifyListeners();
  }

  /**
   * Set slippage tolerance
   */
  setSlippage(slippage: number): void {
    if (slippage < 0.1 || slippage > 50) {
      throw new Error('Slippage must be between 0.1% and 50%');
    }
    this.updateSettings({ slippage });
  }

  /**
   * Set deadline
   */
  setDeadline(deadline: number): void {
    if (deadline < 60 || deadline > 3600) {
      throw new Error('Deadline must be between 1 minute and 1 hour');
    }
    this.updateSettings({ deadline });
  }

  /**
   * Set gas preference
   */
  setGasPreference(preference: UserSettings['gasPreference']): void {
    this.updateSettings({ gasPreference: preference });
  }

  /**
   * Set theme
   */
  setTheme(theme: UserSettings['theme']): void {
    this.updateSettings({ theme });
    this.applyTheme();
  }

  /**
   * Set currency
   */
  setCurrency(currency: UserSettings['currency']): void {
    this.updateSettings({ currency });
  }

  /**
   * Toggle notification setting
   */
  toggleNotification(key: keyof UserSettings['notifications']): void {
    this.updateNestedSetting('notifications', {
      [key]: !this.settings.notifications[key],
    } as Partial<UserSettings['notifications']>);
  }

  /**
   * Toggle privacy setting
   */
  togglePrivacy(key: keyof UserSettings['privacy']): void {
    this.updateNestedSetting('privacy', {
      [key]: !this.settings.privacy[key],
    } as Partial<UserSettings['privacy']>);
  }

  /**
   * Toggle advanced setting
   */
  toggleAdvanced(key: keyof UserSettings['advanced']): void {
    this.updateNestedSetting('advanced', {
      [key]: !this.settings.advanced[key],
    } as Partial<UserSettings['advanced']>);
  }

  /**
   * Reset to default settings
   */
  reset(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    this.applyTheme();
    this.notifyListeners();
  }

  /**
   * Reset specific category
   */
  resetCategory<T extends keyof UserSettings>(category: T): void {
    this.settings = {
      ...this.settings,
      [category]: DEFAULT_SETTINGS[category],
    };
    this.saveSettings();
    this.notifyListeners();
  }

  /**
   * Export settings
   */
  export(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  /**
   * Import settings
   */
  import(settingsJson: string): void {
    try {
      const imported = JSON.parse(settingsJson);
      this.validateSettings(imported);
      this.settings = imported;
      this.saveSettings();
      this.applyTheme();
      this.notifyListeners();
    } catch {
      throw new Error('Invalid settings format');
    }
  }

  /**
   * Subscribe to settings changes
   */
  subscribe(listener: (settings: UserSettings) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    const theme = this.settings.theme;

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }

  /**
   * Load settings from storage
   */
  private loadSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.validateSettings(parsed);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {
      console.error('Failed to load settings');
    }
    return { ...DEFAULT_SETTINGS };
  }

  /**
   * Save settings to storage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      console.error('Failed to save settings');
    }
  }

  /**
   * Validate settings object
   */
  private validateSettings(settings: unknown): void {
    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid settings object');
    }

    // Validate slippage
    if (settings.slippage !== undefined) {
      const slippage = Number(settings.slippage);
      if (isNaN(slippage) || slippage < 0.1 || slippage > 50) {
        throw new Error('Invalid slippage value');
      }
    }

    // Validate deadline
    if (settings.deadline !== undefined) {
      const deadline = Number(settings.deadline);
      if (isNaN(deadline) || deadline < 60 || deadline > 3600) {
        throw new Error('Invalid deadline value');
      }
    }

    // Validate gas preference
    if (settings.gasPreference && !['low', 'medium', 'high'].includes(settings.gasPreference)) {
      throw new Error('Invalid gas preference');
    }

    // Validate theme
    if (settings.theme && !['light', 'dark', 'auto'].includes(settings.theme)) {
      throw new Error('Invalid theme');
    }

    // Validate currency
    if (settings.currency && !['USD', 'EUR', 'GBP', 'JPY'].includes(settings.currency)) {
      throw new Error('Invalid currency');
    }
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    const settings = this.getSettings();
    this.listeners.forEach((listener) => listener(settings));
  }

  /**
   * Get recommended slippage for token pair
   */
  getRecommendedSlippage(_token0: string, _token1: string): number {
    // Would analyze volatility and liquidity
    // For now, returning default
    return DEFAULT_SETTINGS.slippage;
  }

  /**
   * Check if expert mode is enabled
   */
  isExpertMode(): boolean {
    return this.settings.advanced.expertMode;
  }

  /**
   * Check if confirmations are disabled
   */
  areConfirmationsDisabled(): boolean {
    return this.settings.advanced.disableConfirmations && this.settings.advanced.expertMode;
  }
}

export const settingsManager = new SettingsManager();

// Auto-apply theme on initialization
if (typeof window !== 'undefined') {
  settingsManager['applyTheme']();

  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (settingsManager.get('theme') === 'auto') {
      settingsManager['applyTheme']();
    }
  });
}
