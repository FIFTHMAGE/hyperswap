/**
 * Portfolio balance service for multi-chain balances
 * @module services/portfolio/balance
 */

import { getTokenBalances } from '../api/covalent.service';
import type { PortfolioBalance } from '@/types/portfolio/balance';
import type { ChainId } from '@/types/blockchain';

/**
 * Get portfolio balances across all chains
 */
export async function getMultiChainBalances(
  address: string,
  chainIds: ChainId[]
): Promise<PortfolioBalance> {
  const balancePromises = chainIds.map(chainId =>
    getTokenBalances(chainId, address).catch(() => [])
  );
  
  const results = await Promise.all(balancePromises);
  
  const totalValue = results.flat().reduce((sum, token) => {
    return sum + (token.balanceUSD || 0);
  }, 0);
  
  return {
    address,
    totalValueUSD: totalValue,
    chains: chainIds.map((chainId, idx) => ({
      chainId,
      tokens: results[idx],
      totalValueUSD: results[idx].reduce((sum, t) => sum + (t.balanceUSD || 0), 0),
    })),
    lastUpdated: Date.now(),
  };
}

/**
 * Get balances for single chain
 */
export async function getChainBalances(
  chainId: ChainId,
  address: string
) {
  return getTokenBalances(chainId, address);
}

/**
 * Calculate portfolio allocation
 */
export function calculateAllocation(portfolio: PortfolioBalance) {
  return portfolio.chains.map(chain => ({
    chainId: chain.chainId,
    percentage: (chain.totalValueUSD / portfolio.totalValueUSD) * 100,
    value: chain.totalValueUSD,
  }));
}

/**
 * Get top tokens by value
 */
export function getTopTokens(
  portfolio: PortfolioBalance,
  limit: number = 10
) {
  const allTokens = portfolio.chains.flatMap(chain => chain.tokens);
  return allTokens
    .sort((a, b) => (b.balanceUSD || 0) - (a.balanceUSD || 0))
    .slice(0, limit);
}

