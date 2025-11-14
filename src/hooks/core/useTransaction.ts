/**
 * Transaction management hook
 * @module hooks/core/useTransaction
 */

import { useState } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import type { TransactionStatus } from '@/services/blockchain/transaction.service';

export function useTransaction(hash?: `0x${string}`) {
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(hash);

  const { data: receipt, isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const getStatus = (): TransactionStatus['status'] => {
    if (isLoading) return 'pending';
    if (isSuccess && receipt?.status === 'success') return 'confirmed';
    if (isError || receipt?.status === 'reverted') return 'failed';
    return 'pending';
  };

  return {
    txHash,
    setTxHash,
    receipt,
    status: getStatus(),
    isLoading,
    isSuccess,
    isError,
    confirmations: receipt?.blockNumber ? 1 : 0,
  };
}

