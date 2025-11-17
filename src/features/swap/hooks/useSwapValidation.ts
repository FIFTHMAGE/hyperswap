/**
 * Swap validation hook
 * @module features/swap/hooks
 */

export function useSwapValidation() {
  const validateAmount = (amount: string, balance: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      return { isValid: false, error: 'Invalid amount' };
    }
    if (parseFloat(amount) > parseFloat(balance)) {
      return { isValid: false, error: 'Insufficient balance' };
    }
    return { isValid: true, error: null };
  };

  const validateTokens = (fromToken: string, toToken: string) => {
    if (!fromToken || !toToken) {
      return { isValid: false, error: 'Select both tokens' };
    }
    if (fromToken === toToken) {
      return { isValid: false, error: 'Cannot swap same token' };
    }
    return { isValid: true, error: null };
  };

  return {
    validateAmount,
    validateTokens,
  };
}
