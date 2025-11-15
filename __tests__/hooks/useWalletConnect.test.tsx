/**
 * useWalletConnect hook tests
 */

import { renderHook, waitFor } from '@testing-library/react';

import { useWalletConnect } from '@/hooks/features/useWalletConnect';

describe('useWalletConnect', () => {
  test('connects wallet', async () => {
    const { result } = renderHook(() => useWalletConnect());

    expect(result.current.isConnected).toBe(false);

    await result.current.connect();

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
      expect(result.current.address).toBeDefined();
    });
  });

  test('disconnects wallet', async () => {
    const { result } = renderHook(() => useWalletConnect());

    await result.current.connect();

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    result.current.disconnect();

    expect(result.current.isConnected).toBe(false);
    expect(result.current.address).toBeNull();
  });

  test('switches chain', async () => {
    const { result } = renderHook(() => useWalletConnect());

    await result.current.connect();

    await waitFor(() => {
      expect(result.current.chainId).toBe(1);
    });

    await result.current.switchChain(137);

    expect(result.current.chainId).toBe(137);
  });
});
