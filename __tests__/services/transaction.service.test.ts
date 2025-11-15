/**
 * Transaction service tests
 */

import { transactionService } from '@/services/blockchain/transaction.service';

describe('Transaction Service', () => {
  const mockTxHash = '0x123456';

  test('gets transaction', async () => {
    const tx = await transactionService.getTransaction(mockTxHash, 1);

    expect(tx).toBeDefined();
    expect(tx?.hash).toBe(mockTxHash);
  });

  test('gets receipt', async () => {
    const receipt = await transactionService.getReceipt(mockTxHash, 1);

    expect(receipt).toBeDefined();
    expect(receipt?.transactionHash).toBe(mockTxHash);
  });

  test('waits for confirmation', async () => {
    const receipt = await transactionService.waitForConfirmation(mockTxHash, 1, 1);

    expect(receipt).toBeDefined();
    expect(receipt.status).toBe(1);
  });

  test('estimates gas', async () => {
    const gas = await transactionService.estimateGas({
      from: '0x123',
      to: '0x456',
      value: '0',
    });

    expect(gas).toBeDefined();
    expect(parseInt(gas)).toBeGreaterThan(0);
  });
});
