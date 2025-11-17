/**
 * Swap utility functions
 * @module features/swap/utils
 */

export function formatSwapAmount(amount: string, decimals: number): string {
  return (parseFloat(amount) / Math.pow(10, decimals)).toFixed(6);
}

export function parseSwapAmount(amount: string, decimals: number): string {
  return (parseFloat(amount) * Math.pow(10, decimals)).toString();
}

export function getPriceImpactColor(impact: number): string {
  if (impact < 1) return 'text-green-500';
  if (impact < 3) return 'text-yellow-500';
  if (impact < 5) return 'text-orange-500';
  return 'text-red-500';
}

export function getSlippageWarning(slippage: number): string | null {
  if (slippage < 0.1) return 'Transaction may fail';
  if (slippage > 5) return 'High slippage - you may lose funds';
  return null;
}

export function isValidSwapRoute(route: unknown): boolean {
  // Type guard for swap route validation
  return typeof route === 'object' && route !== null;
}
