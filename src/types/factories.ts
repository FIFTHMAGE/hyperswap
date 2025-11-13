/**
 * Type factory functions for creating default instances
 * @module types/factories
 */

import type { Token } from './token';
import type { SwapSettings } from './swap';
import type { UserPreferences } from './user/preferences';
import type { ChainId } from './blockchain';

/**
 * Create default swap settings
 */
export function createDefaultSwapSettings(): SwapSettings {
  return {
    slippage: 0.5,
    deadline: 20,
    expertMode: false,
    disableMultihops: false,
    maxHops: 3,
  };
}

/**
 * Create default user preferences
 */
export function createDefaultUserPreferences(): UserPreferences {
  return {
    theme: 'system',
    language: 'en',
    currency: 'USD',
    defaultChain: 1,
    slippageTolerance: 0.5,
    gasPreference: 'standard',
    expertMode: false,
    showTestnets: false,
    notifications: {
      enabled: true,
      email: true,
      push: false,
      transactionAlerts: true,
      priceAlerts: true,
      newsUpdates: false,
    },
    privacy: {
      analytics: true,
      crashReports: true,
      personalizedAds: false,
    },
  };
}

/**
 * Create a mock token for testing
 */
export function createMockToken(overrides?: Partial<Token>): Token {
  return {
    address: '0x0000000000000000000000000000000000000000',
    chainId: 1,
    decimals: 18,
    symbol: 'MOCK',
    name: 'Mock Token',
    standard: 'ERC20',
    ...overrides,
  };
}

/**
 * Create native token representation
 */
export function createNativeToken(chainId: ChainId): Token {
  const natives: Record<ChainId, Partial<Token>> = {
    1: { symbol: 'ETH', name: 'Ethereum' },
    137: { symbol: 'MATIC', name: 'Polygon' },
    42161: { symbol: 'ETH', name: 'Ethereum' },
    10: { symbol: 'ETH', name: 'Ethereum' },
    8453: { symbol: 'ETH', name: 'Ethereum' },
    43114: { symbol: 'AVAX', name: 'Avalanche' },
  };

  const native = natives[chainId] || { symbol: 'ETH', name: 'Ethereum' };

  return {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    chainId,
    decimals: 18,
    standard: 'Native',
    ...native,
  } as Token;
}

