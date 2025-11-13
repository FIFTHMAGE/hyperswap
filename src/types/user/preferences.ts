/**
 * User preferences types
 * @module types/user/preferences
 */

import type { ChainId } from '../blockchain';

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Language code
 */
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'zh';

/**
 * Currency for display
 */
export type DisplayCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';

/**
 * User preferences
 */
export interface UserPreferences {
  theme: ThemeMode;
  language: LanguageCode;
  currency: DisplayCurrency;
  defaultChain: ChainId;
  slippageTolerance: number;
  gasPreference: 'slow' | 'standard' | 'fast' | 'instant';
  expertMode: boolean;
  showTestnets: boolean;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  enabled: boolean;
  email: boolean;
  push: boolean;
  transactionAlerts: boolean;
  priceAlerts: boolean;
  newsUpdates: boolean;
}

/**
 * Privacy preferences
 */
export interface PrivacyPreferences {
  analytics: boolean;
  crashReports: boolean;
  personalizedAds: boolean;
}

