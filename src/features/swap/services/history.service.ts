/**
 * Swap history tracking service
 * @module services/swap/history
 */

import { getItem, setItem } from '@/utils/browser/storage';

const HISTORY_KEY = 'swap_history';
const MAX_HISTORY = 100;

export interface SwapHistoryItem {
  hash: string;
  timestamp: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  chainId: number;
  status: 'pending' | 'success' | 'failed';
}

/**
 * Get swap history
 */
export function getSwapHistory(): SwapHistoryItem[] {
  return getItem<SwapHistoryItem[]>(HISTORY_KEY) || [];
}

/**
 * Add swap to history
 */
export function addToHistory(swap: SwapHistoryItem): void {
  const history = getSwapHistory();
  history.unshift(swap);

  // Keep only last MAX_HISTORY items
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY);
  }

  setItem(HISTORY_KEY, history);
}

/**
 * Update swap status
 */
export function updateSwapStatus(hash: string, status: SwapHistoryItem['status']): void {
  const history = getSwapHistory();
  const swap = history.find((s) => s.hash === hash);

  if (swap) {
    swap.status = status;
    setItem(HISTORY_KEY, history);
  }
}

/**
 * Clear history
 */
export function clearHistory(): void {
  setItem(HISTORY_KEY, []);
}

/**
 * Get history by chain
 */
export function getHistoryByChain(chainId: number): SwapHistoryItem[] {
  return getSwapHistory().filter((s) => s.chainId === chainId);
}
