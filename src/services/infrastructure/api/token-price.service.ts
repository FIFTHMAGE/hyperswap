/**
 * Token price service for fetching current and historical prices
 * @module services/api/token-price
 */

import { coingeckoClient, get, withRetry } from './client';
import type { ChainId } from '@/types/blockchain';

interface PriceData {
  [tokenAddress: string]: {
    usd: number;
    usd_24h_change?: number;
    usd_market_cap?: number;
    usd_24h_vol?: number;
  };
}

/**
 * Get current token prices from CoinGecko
 */
export async function getTokenPrices(
  chainId: ChainId,
  tokenAddresses: string[]
): Promise<PriceData> {
  return withRetry(async () => {
    const platform = getPlatformId(chainId);
    
    const response = await get<PriceData>(
      coingeckoClient,
      '/simple/token_price/' + platform,
      {
        params: {
          contract_addresses: tokenAddresses.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true,
        },
      }
    );
    
    return response;
  });
}

/**
 * Get single token price
 */
export async function getTokenPrice(
  chainId: ChainId,
  tokenAddress: string
): Promise<number> {
  const prices = await getTokenPrices(chainId, [tokenAddress]);
  return prices[tokenAddress.toLowerCase()]?.usd || 0;
}

/**
 * Get native token price (ETH, MATIC, etc.)
 */
export async function getNativeTokenPrice(chainId: ChainId): Promise<number> {
  return withRetry(async () => {
    const coinId = getCoinId(chainId);
    
    const response = await get<any>(
      coingeckoClient,
      '/simple/price',
      {
        params: {
          ids: coinId,
          vs_currencies: 'usd',
        },
      }
    );
    
    return response[coinId]?.usd || 0;
  });
}

/**
 * Get historical prices for a token
 */
export async function getHistoricalPrices(
  chainId: ChainId,
  tokenAddress: string,
  days: number = 30
): Promise<Array<[number, number]>> {
  return withRetry(async () => {
    const platform = getPlatformId(chainId);
    
    const response = await get<any>(
      coingeckoClient,
      `/coins/${platform}/contract/${tokenAddress}/market_chart/`,
      {
        params: {
          vs_currency: 'usd',
          days,
        },
      }
    );
    
    return response.prices;
  });
}

/**
 * Get market data for a token
 */
export async function getTokenMarketData(
  chainId: ChainId,
  tokenAddress: string
): Promise<any> {
  return withRetry(async () => {
    const platform = getPlatformId(chainId);
    
    const response = await get<any>(
      coingeckoClient,
      `/coins/${platform}/contract/${tokenAddress}`
    );
    
    return response.market_data;
  });
}

/**
 * Map chain ID to CoinGecko platform ID
 */
function getPlatformId(chainId: ChainId): string {
  const platformMap: Record<ChainId, string> = {
    1: 'ethereum',
    137: 'polygon-pos',
    42161: 'arbitrum-one',
    10: 'optimistic-ethereum',
    8453: 'base',
    43114: 'avalanche',
  };
  
  return platformMap[chainId] || 'ethereum';
}

/**
 * Map chain ID to CoinGecko coin ID
 */
function getCoinId(chainId: ChainId): string {
  const coinMap: Record<ChainId, string> = {
    1: 'ethereum',
    137: 'matic-network',
    42161: 'ethereum',
    10: 'ethereum',
    8453: 'ethereum',
    43114: 'avalanche-2',
  };
  
  return coinMap[chainId] || 'ethereum';
}

