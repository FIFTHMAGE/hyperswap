/**
 * Swap history hook
 * @module hooks/domain/useSwapHistory
 */

import { useState, useEffect } from 'react';

import { getSwapHistory } from '@/services/swap/history.service';
import type { SwapHistoryItem } from '@/services/swap/history.service';

export function useSwapHistory() {
  const [history, setHistory] = useState<SwapHistoryItem[]>([]);

  useEffect(() => {
    // Load history on mount
    const loadHistory = () => {
      setHistory(getSwapHistory());
    };
    loadHistory();
  }, []);

  const refresh = () => {
    setHistory(getSwapHistory());
  };

  return { history, refresh };
}
