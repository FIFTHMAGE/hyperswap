/**
 * Transaction service for managing blockchain transactions
 * @module services/blockchain/transaction
 */

import { getPublicClient, waitForTransaction } from './provider.service';
import type { ChainId } from '@/types/blockchain';

export interface TransactionStatus {
  hash: `0x${string}`;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: bigint;
  confirmations?: number;
  error?: string;
}

/**
 * Track transaction status
 */
export async function trackTransaction(
  chainId: ChainId,
  hash: `0x${string}`,
  confirmations: number = 1
): Promise<TransactionStatus> {
  try {
    const receipt = await waitForTransaction(chainId, hash, confirmations);
    
    return {
      hash,
      status: receipt.status === 'success' ? 'confirmed' : 'failed',
      blockNumber: receipt.blockNumber,
      confirmations,
    };
  } catch (error) {
    return {
      hash,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get transaction confirmation count
 */
export async function getConfirmationCount(
  chainId: ChainId,
  hash: `0x${string}`
): Promise<number> {
  const client = getPublicClient(chainId);
  
  const [receipt, currentBlock] = await Promise.all([
    client.getTransactionReceipt({ hash }),
    client.getBlockNumber(),
  ]);
  
  if (!receipt || !receipt.blockNumber) {
    return 0;
  }
  
  return Number(currentBlock - receipt.blockNumber) + 1;
}

/**
 * Check if transaction is confirmed
 */
export async function isTransactionConfirmed(
  chainId: ChainId,
  hash: `0x${string}`,
  requiredConfirmations: number = 1
): Promise<boolean> {
  const confirmations = await getConfirmationCount(chainId, hash);
  return confirmations >= requiredConfirmations;
}

/**
 * Wait for multiple transactions
 */
export async function waitForMultipleTransactions(
  chainId: ChainId,
  hashes: `0x${string}`[],
  confirmations: number = 1
): Promise<TransactionStatus[]> {
  return Promise.all(
    hashes.map(hash => trackTransaction(chainId, hash, confirmations))
  );
}

/**
 * Get transaction details
 */
export async function getTransactionDetails(
  chainId: ChainId,
  hash: `0x${string}`
) {
  const client = getPublicClient(chainId);
  
  const [transaction, receipt] = await Promise.all([
    client.getTransaction({ hash }),
    client.getTransactionReceipt({ hash }).catch(() => null),
  ]);
  
  return {
    transaction,
    receipt,
  };
}

/**
 * Estimate total transaction cost
 */
export async function estimateTransactionCost(
  chainId: ChainId,
  transaction: {
    to: `0x${string}`;
    data?: `0x${string}`;
    value?: bigint;
    from?: `0x${string}`;
  }
): Promise<{ gasLimit: bigint; gasPrice: bigint; totalCost: bigint }> {
  const client = getPublicClient(chainId);
  
  const [gasLimit, gasPrice] = await Promise.all([
    client.estimateGas(transaction),
    client.getGasPrice(),
  ]);
  
  const totalCost = gasLimit * gasPrice;
  
  return {
    gasLimit,
    gasPrice,
    totalCost,
  };
}

