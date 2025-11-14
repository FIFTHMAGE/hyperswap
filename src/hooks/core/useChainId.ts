/**
 * Chain ID hook
 * @module hooks/core/useChainId
 */

import { useChainId as useWagmiChainId } from 'wagmi';
import type { ChainId } from '@/types/blockchain';

export function useChain() {
  const chainId = useWagmiChainId();

  return {
    chainId: chainId as ChainId,
    isMainnet: chainId === 1,
    isPolygon: chainId === 137,
    isArbitrum: chainId === 42161,
    isOptimism: chainId === 10,
    isBase: chainId === 8453,
  };
}

