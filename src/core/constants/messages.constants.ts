/**
 * User-facing messages constants
 */

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction.',
  INVALID_ADDRESS: 'Invalid wallet address.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  APPROVAL_REQUIRED: 'Token approval required.',
  SLIPPAGE_EXCEEDED: 'Price impact too high. Adjust slippage settings.',
} as const;

export const SUCCESS_MESSAGES = {
  TRANSACTION_SUBMITTED: 'Transaction submitted successfully!',
  APPROVAL_GRANTED: 'Token approval granted.',
  SWAP_COMPLETED: 'Swap completed successfully!',
  SETTINGS_SAVED: 'Settings saved.',
} as const;

export const LOADING_MESSAGES = {
  FETCHING_QUOTE: 'Fetching best quote...',
  EXECUTING_SWAP: 'Executing swap...',
  LOADING_PORTFOLIO: 'Loading portfolio...',
  CONNECTING_WALLET: 'Connecting wallet...',
} as const;
