import { Transaction } from '@/lib/types/transaction';

export interface WhaleTransaction {
  hash: string;
  value: number;
  from: string;
  to: string;
  timestamp: string;
  chainId: number;
}

export function detectWhaleTransactions(
  transactions: Transaction[],
  threshold: number = 10000
): WhaleTransaction[] {
  return transactions
    .filter(tx => {
      const value = parseFloat(tx.value || '0');
      return value >= threshold;
    })
    .map(tx => ({
      hash: tx.tx_hash,
      value: parseFloat(tx.value || '0'),
      from: tx.from_address,
      to: tx.to_address || '',
      timestamp: tx.block_signed_at,
      chainId: tx.chain_id,
    }))
    .sort((a, b) => b.value - a.value);
}

export function isWhaleWallet(totalValue: number, transactionCount: number): boolean {
  const avgTxValue = transactionCount > 0 ? totalValue / transactionCount : 0;
  return totalValue > 100000 || avgTxValue > 5000;
}

