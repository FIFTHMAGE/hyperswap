import { covalentClient } from './client';
import { API_ENDPOINTS } from '../constants/api';
import { NFTBalance } from '../types/nft';

interface NFTBalancesResponse {
  address: string;
  chainId: number;
  items: NFTBalance[];
}

export async function fetchNFTBalances(
  chainName: string,
  address: string
): Promise<NFTBalance[]> {
  const endpoint = API_ENDPOINTS.NFT_BALANCES(chainName, address);
  const response = await covalentClient.get<NFTBalancesResponse>(endpoint, {
    'no-spam': true,
  });
  return response.items.filter(nft => parseFloat(nft.balance) > 0);
}

