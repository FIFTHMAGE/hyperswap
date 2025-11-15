import { Transaction } from '@/lib/types/transaction';

export type TransactionCategory = 
  | 'transfer'
  | 'swap'
  | 'liquidity'
  | 'nft'
  | 'contract'
  | 'bridge'
  | 'other';

export interface CategorizedTransaction extends Transaction {
  category: TransactionCategory;
}

export function categorizeTransaction(tx: Transaction): TransactionCategory {
  const { log_events } = tx;
  
  if (!log_events || log_events.length === 0) {
    return 'transfer';
  }

  const eventNames = log_events.map(e => e.decoded?.name?.toLowerCase() || '');
  
  if (eventNames.some(n => n.includes('swap'))) {
    return 'swap';
  }
  
  if (eventNames.some(n => n.includes('liquidity') || n.includes('mint') || n.includes('burn'))) {
    return 'liquidity';
  }
  
  if (eventNames.some(n => n.includes('transfer') && n.includes('erc721'))) {
    return 'nft';
  }
  
  if (eventNames.some(n => n.includes('bridge'))) {
    return 'bridge';
  }

  if (tx.to_address && log_events.length > 1) {
    return 'contract';
  }

  return 'transfer';
}

export function categorizeTransactions(transactions: Transaction[]): CategorizedTransaction[] {
  return transactions.map(tx => ({
    ...tx,
    category: categorizeTransaction(tx),
  }));
}

