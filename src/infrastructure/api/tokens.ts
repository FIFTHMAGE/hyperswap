import { API_ENDPOINTS } from '../constants/api';
import { TokenTransfer } from '../types/token';
import { covalentClient } from './client';

interface TokenTransfersResponse {
  address: string;
  chainId: number;
  items: TokenTransfer[];
}

export async function fetchTokenTransfers(
  chainName: string,
  address: string,
  contractAddress?: string
): Promise<TokenTransfer[]> {
  const endpoint = API_ENDPOINTS.TOKEN_TRANSFERS(chainName, address);
  const params: Record<string, unknown> = {};

  if (contractAddress) {
    params['contract-address'] = contractAddress;
  }

  const response = await covalentClient.get<TokenTransfersResponse>(endpoint, params);
  return response.items;
}
