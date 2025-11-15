/**
 * Swap store tests
 */

import type { Token } from '@/types/blockchain.types';

import { useSwapStore } from '@/store/swap.store';

const mockToken: Token = {
  chainId: 1,
  address: '0x123',
  name: 'Test Token',
  symbol: 'TEST',
  decimals: 18,
};

describe('Swap Store', () => {
  beforeEach(() => {
    useSwapStore.getState().reset();
  });

  test('sets from token', () => {
    useSwapStore.getState().setFromToken(mockToken);
    expect(useSwapStore.getState().fromToken).toEqual(mockToken);
  });

  test('sets to token', () => {
    useSwapStore.getState().setToToken(mockToken);
    expect(useSwapStore.getState().toToken).toEqual(mockToken);
  });

  test('sets from amount', () => {
    useSwapStore.getState().setFromAmount('100');
    expect(useSwapStore.getState().fromAmount).toBe('100');
  });

  test('swaps tokens', () => {
    const token1: Token = { ...mockToken, symbol: 'TKN1' };
    const token2: Token = { ...mockToken, symbol: 'TKN2' };

    useSwapStore.getState().setFromToken(token1);
    useSwapStore.getState().setToToken(token2);
    useSwapStore.getState().setFromAmount('100');
    useSwapStore.getState().setToAmount('200');

    useSwapStore.getState().swapTokens();

    expect(useSwapStore.getState().fromToken).toEqual(token2);
    expect(useSwapStore.getState().toToken).toEqual(token1);
    expect(useSwapStore.getState().fromAmount).toBe('200');
    expect(useSwapStore.getState().toAmount).toBe('100');
  });

  test('resets state', () => {
    useSwapStore.getState().setFromToken(mockToken);
    useSwapStore.getState().setFromAmount('100');
    useSwapStore.getState().reset();

    expect(useSwapStore.getState().fromToken).toBeNull();
    expect(useSwapStore.getState().fromAmount).toBe('');
  });
});
