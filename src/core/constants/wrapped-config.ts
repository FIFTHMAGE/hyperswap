/**
 * Wrapped configuration constants
 */

export const WRAPPED_CONFIG = {
  CURRENT_YEAR: 2024,
  MIN_TRANSACTIONS: 5,
  MAX_CARDS: 25,
  ANIMATION_DURATION: 300,
  AUTO_ADVANCE_DELAY: 5000,
  SUPPORTED_CHAINS: [
    { id: 1, name: 'Ethereum', logo: 'Ξ' },
    { id: 137, name: 'Polygon', logo: '🟣' },
    { id: 42161, name: 'Arbitrum', logo: '🔵' },
    { id: 10, name: 'Optimism', logo: '🔴' },
    { id: 8453, name: 'Base', logo: '🔵' },
  ],
  ACHIEVEMENT_THRESHOLDS: {
    EARLY_ADOPTER: 1,
    ACTIVE_TRADER: 100,
    WHALE: 100000,
    COLLECTOR: 10,
    DEFI_PRO: 50,
  },
  SHARE_TEXT_TEMPLATES: {
    default: 'Check out my crypto year 2024! 🎁 #CryptoWrapped',
    highVolume: 'I traded over $X in 2024! 💰 #CryptoWrapped',
    manyTx: 'Made X transactions in 2024! ⚡ #CryptoWrapped',
  },
};
