/**
 * Covalent API service for blockchain data
 * @module services/api/covalent
 */

import type { ChainId } from '@/types/blockchain';
import type { TokenWithBalance } from '@/types/token';

import { covalentClient, get, withRetry } from './client';

/**
 * Get token balances for an address
 */
export async function getTokenBalances(
  chainId: ChainId,
  address: string
): Promise<TokenWithBalance[]> {
  return withRetry(async () => {
    const response = await get<any>(covalentClient, `/${chainId}/address/${address}/balances_v2/`);

    return response.data.items.map((item: any) => ({
      address: item.contract_address,
      chainId,
      decimals: item.contract_decimals,
      symbol: item.contract_ticker_symbol,
      name: item.contract_name,
      standard: 'ERC20',
      balance: item.balance,
      balanceFormatted: item.balance_formatted,
      balanceUSD: item.quote,
      logoURI: item.logo_url,
    }));
  });
}

/**
 * Get transaction history for an address
 */
export async function getTransactionHistory(
  chainId: ChainId,
  address: string,
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<any> {
  return withRetry(async () => {
    const response = await get<any>(
      covalentClient,
      `/${chainId}/address/${address}/transactions_v2/`,
      {
        params: {
          'page-number': pageNumber,
          'page-size': pageSize,
        },
      }
    );

    return response.data;
  });
}

/**
 * Get token holders for a token
 */
export async function getTokenHolders(
  chainId: ChainId,
  tokenAddress: string,
  pageNumber: number = 0
): Promise<any> {
  return withRetry(async () => {
    const response = await get<any>(
      covalentClient,
      `/${chainId}/tokens/${tokenAddress}/token_holders/`,
      {
        params: {
          'page-number': pageNumber,
        },
      }
    );

    return response.data;
  });
}

/**
 * Get historical token prices
 */
export async function getHistoricalPrices(
  chainId: ChainId,
  tokenAddress: string,
  from: string,
  to: string
): Promise<any> {
  return withRetry(async () => {
    const response = await get<any>(
      covalentClient,
      `/${chainId}/address/${tokenAddress}/historical_by_addresses/`,
      {
        params: {
          from,
          to,
        },
      }
    );

    return response.data;
  });
}

/**
 * Get block information
 */
export async function getBlock(chainId: ChainId, blockHeight: number): Promise<any> {
  return withRetry(async () => {
    const response = await get<any>(covalentClient, `/${chainId}/block/${blockHeight}/`);

    return response.data;
  });
}

/**
 * Get NFTs for an address
 */
export async function getNFTs(chainId: ChainId, address: string): Promise<any> {
  return withRetry(async () => {
    const response = await get<any>(covalentClient, `/${chainId}/address/${address}/balances_v2/`, {
      params: {
        nft: true,
      },
    });

    return response.data;
  });
}
