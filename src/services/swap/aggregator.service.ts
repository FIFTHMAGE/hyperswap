/**
 * DEX aggregator service for finding best swap routes
 * @module services/swap/aggregator
 */

import { UNISWAP_V2_ROUTER, UNISWAP_V3_ROUTER } from '@/constants/dex';
import type { ChainId } from '@/types/blockchain';
import type { SwapQuote, SwapRoute } from '@/types/swap';

interface DEXQuote {
  dex: string;
  amountOut: string;
  route: string[];
  gasEstimate: number;
}

/**
 * Aggregate quotes from multiple DEXes
 */
export async function aggregateQuotes(
  chainId: ChainId,
  tokenIn: string,
  tokenOut: string,
  amountIn: string
): Promise<DEXQuote[]> {
  const quotes: DEXQuote[] = [];

  // Get Uniswap V2 quote
  if (UNISWAP_V2_ROUTER[chainId]) {
    try {
      const v2Quote = await getUniswapV2Quote(chainId, tokenIn, tokenOut, amountIn);
      if (v2Quote) {
        quotes.push({
          dex: 'uniswap-v2',
          ...v2Quote,
        });
      }
    } catch (error) {
      console.warn('Uniswap V2 quote failed:', error);
    }
  }

  // Get Uniswap V3 quote
  if (UNISWAP_V3_ROUTER[chainId]) {
    try {
      const v3Quote = await getUniswapV3Quote(chainId, tokenIn, tokenOut, amountIn);
      if (v3Quote) {
        quotes.push({
          dex: 'uniswap-v3',
          ...v3Quote,
        });
      }
    } catch (error) {
      console.warn('Uniswap V3 quote failed:', error);
    }
  }

  return quotes;
}

/**
 * Get best quote from aggregated results
 */
export function getBestQuote(quotes: DEXQuote[]): DEXQuote | null {
  if (quotes.length === 0) {
    return null;
  }

  return quotes.reduce((best, current) => {
    const bestOut = BigInt(best.amountOut);
    const currentOut = BigInt(current.amountOut);
    return currentOut > bestOut ? current : best;
  });
}

/**
 * Calculate price impact
 */
export function calculatePriceImpact(
  amountIn: string,
  amountOut: string,
  price: number
): number {
  const input = parseFloat(amountIn);
  const output = parseFloat(amountOut);
  const expectedOutput = input * price;

  if (expectedOutput === 0) return 0;

  return ((expectedOutput - output) / expectedOutput) * 100;
}

/**
 * Get Uniswap V2 quote (placeholder)
 */
async function getUniswapV2Quote(
  chainId: ChainId,
  tokenIn: string,
  tokenOut: string,
  amountIn: string
): Promise<Omit<DEXQuote, 'dex'> | null> {
  // TODO: Implement actual V2 quote fetching
  return {
    amountOut: '0',
    route: [tokenIn, tokenOut],
    gasEstimate: 150000,
  };
}

/**
 * Get Uniswap V3 quote (placeholder)
 */
async function getUniswapV3Quote(
  chainId: ChainId,
  tokenIn: string,
  tokenOut: string,
  amountIn: string
): Promise<Omit<DEXQuote, 'dex'> | null> {
  // TODO: Implement actual V3 quote fetching
  return {
    amountOut: '0',
    route: [tokenIn, tokenOut],
    gasEstimate: 180000,
  };
}

/**
 * Find optimal swap route
 */
export async function findOptimalRoute(
  chainId: ChainId,
  tokenIn: string,
  tokenOut: string,
  amountIn: string
): Promise<SwapRoute | null> {
  const quotes = await aggregateQuotes(chainId, tokenIn, tokenOut, amountIn);
  const best = getBestQuote(quotes);

  if (!best) {
    return null;
  }

  return {
    path: best.route,
    pools: [],
    expectedOutput: best.amountOut,
    priceImpact: 0,
    minOutput: best.amountOut,
    gasEstimate: best.gasEstimate,
  };
}

