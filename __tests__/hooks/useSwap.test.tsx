/**
 * useSwap hook tests
 */

import { renderHook, waitFor } from '@testing-library/react';

import { useSwap } from '@/hooks/features/useSwap';

describe('useSwap', () => {
  test('executes swap', async () => {
    const { result } = renderHook(() => useSwap());

    expect(result.current.isSwapping).toBe(false);

    const promise = result.current.executeSwap();

    await waitFor(() => {
      expect(result.current.isSwapping).toBe(false);
    });

    const txHash = await promise;
    expect(txHash).toBeDefined();
    expect(result.current.txHash).toBe(txHash);
  });

  test('handles swap error', async () => {
    const { result } = renderHook(() => useSwap());

    try {
      await result.current.executeSwap();
    } catch {
      // Expected to fail due to missing fields
    }

    expect(result.current.error).toBeDefined();
  });
});
