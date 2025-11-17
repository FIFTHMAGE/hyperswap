/**
 * Swap calculation hooks
 * @module features/swap/hooks
 */

export function useSwapCalculations() {
  const calculatePriceImpact = (amountIn: string, amountOut: string, marketRate: number) => {
    const actualRate = parseFloat(amountOut) / parseFloat(amountIn);
    const impact = ((marketRate - actualRate) / marketRate) * 100;
    return Math.abs(impact);
  };

  const calculateMinimumReceived = (amountOut: string, slippage: number) => {
    const amount = parseFloat(amountOut);
    return (amount * (1 - slippage / 100)).toFixed(6);
  };

  const calculateGasCost = (gasPrice: string, gasLimit: number) => {
    return (parseFloat(gasPrice) * gasLimit) / 1e18;
  };

  return {
    calculatePriceImpact,
    calculateMinimumReceived,
    calculateGasCost,
  };
}
