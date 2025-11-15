/**
 * Wallet store tests
 */

import { useWalletStore } from '@/store/wallet.store';

describe('Wallet Store', () => {
  beforeEach(() => {
    useWalletStore.getState().disconnect();
  });

  test('sets address', () => {
    useWalletStore.getState().setAddress('0x123');
    expect(useWalletStore.getState().address).toBe('0x123');
  });

  test('sets chain ID', () => {
    useWalletStore.getState().setChainId(1);
    expect(useWalletStore.getState().chainId).toBe(1);
  });

  test('sets balance', () => {
    useWalletStore.getState().setBalance('1.5');
    expect(useWalletStore.getState().balance).toBe('1.5');
  });

  test('sets connection status', () => {
    useWalletStore.getState().setIsConnected(true);
    expect(useWalletStore.getState().isConnected).toBe(true);
  });

  test('disconnects wallet', () => {
    useWalletStore.getState().setAddress('0x123');
    useWalletStore.getState().setChainId(1);
    useWalletStore.getState().setIsConnected(true);

    useWalletStore.getState().disconnect();

    expect(useWalletStore.getState().address).toBeNull();
    expect(useWalletStore.getState().chainId).toBeNull();
    expect(useWalletStore.getState().isConnected).toBe(false);
  });
});
