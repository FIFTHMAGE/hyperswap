/**
 * Portfolio transaction history service
 * @module services/portfolio/transaction-history
 */

import { getTransactionHistory } from '../api/covalent.service';
import type { PortfolioTransaction } from '@/types/portfolio/transaction';
import type { ChainId } from '@/types/blockchain';

/**
 * Get transaction history across chains
 */
export async function getMultiChainHistory(
  address: string,
  chainIds: ChainId[],
  pageSize: number = 10
): Promise<PortfolioTransaction[]> {
  const historyPromises = chainIds.map(chainId =>
    getTransactionHistory(chainId, address, 0, pageSize).catch(() => ({ items: [] }))
  );
  
  const results = await Promise.all(historyPromises);
  const allTransactions = results.flatMap((r, idx) =>
    (r.items || []).map((tx: any) => ({
      ...tx,
      chainId: chainIds[idx],
    }))
  );
  
  // Sort by timestamp descending
  return allTransactions.sort((a: any, b: any) => b.block_signed_at - a.block_signed_at);
}

/**
 * Filter transactions by type
 */
export function filterByType(
  transactions: PortfolioTransaction[],
  type: string
): PortfolioTransaction[] {
  return transactions.filter(tx => tx.type === type);
}

/**
 * Group transactions by date
 */
export function groupByDate(transactions: PortfolioTransaction[]) {
  const grouped = new Map<string, PortfolioTransaction[]>();
  
  transactions.forEach(tx => {
    const date = new Date(tx.timestamp * 1000).toDateString();
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(tx);
  });
  
  return Array.from(grouped.entries()).map(([date, txs]) => ({
    date,
    transactions: txs,
  }));
}

/**
 * Calculate total transaction volume
 */
export function calculateTotalVolume(transactions: PortfolioTransaction[]): number {
  return transactions.reduce((sum, tx) => sum + (tx.valueUSD || 0), 0);
}

