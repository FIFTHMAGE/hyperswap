/**
 * Transaction service
 * @module services/blockchain
 */

import type { Transaction, TransactionReceipt } from '@/types/blockchain.types';

class TransactionService {
  /**
   * Get transaction by hash
   */
  async getTransaction(txHash: string, chainId: number): Promise<Transaction | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      hash: txHash,
      from: `0x${Math.random().toString(16).slice(2, 42)}`,
      to: `0x${Math.random().toString(16).slice(2, 42)}`,
      value: '0',
      data: '0x',
      nonce: 0,
      gasLimit: '21000',
      gasPrice: '30000000000',
      chainId,
    };
  }

  /**
   * Get transaction receipt
   */
  async getReceipt(txHash: string, _chainId: number): Promise<TransactionReceipt | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      transactionHash: txHash,
      blockNumber: Math.floor(Math.random() * 1000000),
      blockHash: `0x${Math.random().toString(16).slice(2)}`,
      from: `0x${Math.random().toString(16).slice(2, 42)}`,
      to: `0x${Math.random().toString(16).slice(2, 42)}`,
      gasUsed: '21000',
      status: 1,
      logs: [],
    };
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForConfirmation(
    txHash: string,
    chainId: number,
    confirmations = 1
  ): Promise<TransactionReceipt> {
    await new Promise((resolve) => setTimeout(resolve, confirmations * 3000));

    const receipt = await this.getReceipt(txHash, chainId);
    if (!receipt) {
      throw new Error('Transaction not found');
    }

    return receipt;
  }

  /**
   * Estimate gas for transaction
   */
  async estimateGas(_tx: Partial<Transaction>): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return '150000';
  }
}

export const transactionService = new TransactionService();
