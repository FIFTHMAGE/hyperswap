import { API_ENDPOINTS } from '../constants/api';
import { TokenBalance } from '../types/token';

import { covalentClient } from './client';

interface BalancesResponse {
  address: string;
  chainId: number;
  items: TokenBalance[];
}

export async function fetchTokenBalances(
  chainName: string,
  address: string
): Promise<TokenBalance[]> {
  const endpoint = API_ENDPOINTS.BALANCES(chainName, address);
  const response = await covalentClient.get<BalancesResponse>(endpoint, {
    'no-spam': true,
  });
  return response.items.filter((token) => parseFloat(token.balance) > 0);
}

export async function fetchPortfolio(chainName: string, address: string): Promise<any> {
  const endpoint = API_ENDPOINTS.PORTFOLIO(chainName, address);
  return covalentClient.get(endpoint);
}
