/**
 * useSwap hook - Main swap functionality
 * @module hooks/features
 */

import { useState } from 'react';

import { useSwapStore } from '@/store/swap.store';

export function useSwap() {
  const [isSwapping, setIsSwapping] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { fromToken, toToken, fromAmount, slippage, deadline } = useSwapStore();

  const executeSwap = async () => {
    if (!fromToken || !toToken || !fromAmount) {
      setError(new Error('Missing required fields'));
      return;
    }

    setIsSwapping(true);
    setError(null);
    setTxHash(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockTxHash = `0x${Math.random().toString(16).slice(2)}`;
      setTxHash(mockTxHash);

      return mockTxHash;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Swap failed'));
      throw err;
    } finally {
      setIsSwapping(false);
    }
  };

  return {
    executeSwap,
    isSwapping,
    txHash,
    error,
    fromToken,
    toToken,
    fromAmount,
    slippage,
    deadline,
  };
}
