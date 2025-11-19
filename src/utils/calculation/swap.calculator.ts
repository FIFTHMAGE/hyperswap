/**
 * Swap calculation utilities
 * @module utils/calculation/swap
 */

export function calculatePriceImpact(
  inputAmount: number,
  outputAmount: number,
  marketPrice: number
): number {
  const expectedOutput = inputAmount * marketPrice;
  const impact = ((expectedOutput - outputAmount) / expectedOutput) * 100;
  return Math.abs(impact);
}

export function calculateMinimumReceived(amount: number, slippage: number): number {
  return amount * (1 - slippage / 100);
}

export function calculateExchangeRate(inputAmount: number, outputAmount: number): number {
  return outputAmount / inputAmount;
}

export function calculateGasInUSD(gasAmount: string, gasPrice: number, ethPrice: number): number {
  const gasInEth = (Number(gasAmount) * gasPrice) / 1e9;
  return gasInEth * ethPrice;
}
