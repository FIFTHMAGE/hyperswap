/**
 * useSwap - Hook for managing swap operations
 * @module hooks
 */

import { useState, useCallback, useMemo } from 'react';

import { swapExecutor, SwapParams, SwapResult } from '../features/swap/services/SwapExecutor';

export interface SwapState {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  slippage: number;
  deadline: number;
  isLoading: boolean;
  error: string | null;
  result: SwapResult | null;
}

export interface SwapActions {
  setFromToken: (token: string) => void;
  setToToken: (token: string) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  setDeadline: (deadline: number) => void;
  switchTokens: () => void;
  execute: () => Promise<void>;
  reset: () => void;
}

const DEFAULT_SLIPPAGE = 0.5; // 0.5%
const DEFAULT_DEADLINE = 1200; // 20 minutes

export function useSwap(userAddress?: string) {
  const [state, setState] = useState<SwapState>({
    fromToken: '',
    toToken: '',
    fromAmount: '',
    toAmount: '',
    slippage: DEFAULT_SLIPPAGE,
    deadline: DEFAULT_DEADLINE,
    isLoading: false,
    error: null,
    result: null,
  });

  /**
   * Set from token
   */
  const setFromToken = useCallback((token: string) => {
    setState((prev) => ({ ...prev, fromToken: token }));
  }, []);

  /**
   * Set to token
   */
  const setToToken = useCallback((token: string) => {
    setState((prev) => ({ ...prev, toToken: token }));
  }, []);

  /**
   * Set from amount
   */
  const setFromAmount = useCallback((amount: string) => {
    setState((prev) => ({ ...prev, fromAmount: amount }));
  }, []);

  /**
   * Set to amount
   */
  const setToAmount = useCallback((amount: string) => {
    setState((prev) => ({ ...prev, toAmount: amount }));
  }, []);

  /**
   * Set slippage tolerance
   */
  const setSlippage = useCallback((slippage: number) => {
    setState((prev) => ({ ...prev, slippage }));
  }, []);

  /**
   * Set deadline
   */
  const setDeadline = useCallback((deadline: number) => {
    setState((prev) => ({ ...prev, deadline }));
  }, []);

  /**
   * Switch from and to tokens
   */
  const switchTokens = useCallback(() => {
    setState((prev) => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
    }));
  }, []);

  /**
   * Execute swap
   */
  const execute = useCallback(async () => {
    if (!userAddress) {
      setState((prev) => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    if (!state.fromToken || !state.toToken || !state.fromAmount) {
      setState((prev) => ({ ...prev, error: 'Missing required fields' }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const params: SwapParams = {
        type: 'exactInput',
        inputToken: state.fromToken,
        outputToken: state.toToken,
        amount: state.fromAmount,
        slippageTolerance: state.slippage,
        recipient: userAddress,
        deadline: state.deadline,
      };

      const result = await swapExecutor.executeSwap(params);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        result,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Swap failed',
      }));
    }
  }, [
    userAddress,
    state.fromToken,
    state.toToken,
    state.fromAmount,
    state.slippage,
    state.deadline,
  ]);

  /**
   * Reset swap state
   */
  const reset = useCallback(() => {
    setState({
      fromToken: '',
      toToken: '',
      fromAmount: '',
      toAmount: '',
      slippage: DEFAULT_SLIPPAGE,
      deadline: DEFAULT_DEADLINE,
      isLoading: false,
      error: null,
      result: null,
    });
  }, []);

  /**
   * Check if swap is ready to execute
   */
  const isReady = useMemo(() => {
    return (
      !!userAddress &&
      !!state.fromToken &&
      !!state.toToken &&
      !!state.fromAmount &&
      parseFloat(state.fromAmount) > 0 &&
      !state.isLoading
    );
  }, [userAddress, state.fromToken, state.toToken, state.fromAmount, state.isLoading]);

  /**
   * Check if tokens are selected
   */
  const hasSelectedTokens = useMemo(() => {
    return !!state.fromToken && !!state.toToken;
  }, [state.fromToken, state.toToken]);

  /**
   * Calculate minimum received amount
   */
  const minimumReceived = useMemo(() => {
    if (!state.toAmount || !state.slippage) return null;

    const amount = parseFloat(state.toAmount);
    const slippageMultiplier = 1 - state.slippage / 100;
    return (amount * slippageMultiplier).toFixed(6);
  }, [state.toAmount, state.slippage]);

  /**
   * Calculate price impact
   */
  const priceImpact = useMemo(() => {
    // This would calculate actual price impact
    // For now, returning a mock value
    if (!state.fromAmount || !state.toAmount) return null;

    return 0.15; // 0.15%
  }, [state.fromAmount, state.toAmount]);

  /**
   * Check if slippage is high
   */
  const isHighSlippage = useMemo(() => {
    return state.slippage > 1; // Greater than 1%
  }, [state.slippage]);

  /**
   * Check if price impact is high
   */
  const isHighPriceImpact = useMemo(() => {
    return priceImpact !== null && priceImpact > 3; // Greater than 3%
  }, [priceImpact]);

  return {
    // State
    ...state,
    isReady,
    hasSelectedTokens,
    minimumReceived,
    priceImpact,
    isHighSlippage,
    isHighPriceImpact,

    // Actions
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    setSlippage,
    setDeadline,
    switchTokens,
    execute,
    reset,
  };
}

/**
 * Hook for swap quote
 */
export function useSwapQuote(
  fromToken?: string,
  toToken?: string,
  amount?: string,
  enabled: boolean = true
) {
  const [quote, setQuote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!enabled || !fromToken || !toToken || !amount) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 500));

      setQuote({
        inputAmount: amount,
        outputAmount: (parseFloat(amount) * 1.05).toFixed(6),
        priceImpact: 0.15,
        route: ['Uniswap V3'],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote');
    } finally {
      setIsLoading(false);
    }
  }, [fromToken, toToken, amount, enabled]);

  const refetch = useCallback(() => {
    fetchQuote();
  }, [fetchQuote]);

  return {
    quote,
    isLoading,
    error,
    refetch,
  };
}
