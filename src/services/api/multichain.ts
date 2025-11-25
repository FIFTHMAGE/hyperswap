import { NFTBalance } from '../types/nft';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { TokenBalance } from '../types/token';
import { Transaction } from '../types/transaction';
import { fetchNFTBalances } from './nfts';
import { fetchTokenBalances } from './balances';
import { fetchTransactions } from './transactions';

export async function fetchMultiChainTransactions(
  address: string
): Promise<Record<number, Transaction[]>> {
  const results: Record<number, Transaction[]> = {};
  
  await Promise.all(
    Object.values(SUPPORTED_CHAINS).map(async (chain) => {
      try {
        const response = await fetchTransactions(chain.covalentName, address, 0, 100);
        results[chain.id] = response.items;
      } catch (error) {
        console.error(`Error fetching transactions for chain ${chain.id}:`, error);
        results[chain.id] = [];
      }
    })
  );
  
  return results;
}

export async function fetchMultiChainBalances(
  address: string
): Promise<Record<number, TokenBalance[]>> {
  const results: Record<number, TokenBalance[]> = {};
  
  await Promise.all(
    Object.values(SUPPORTED_CHAINS).map(async (chain) => {
      try {
        results[chain.id] = await fetchTokenBalances(chain.covalentName, address);
      } catch (error) {
        console.error(`Error fetching balances for chain ${chain.id}:`, error);
        results[chain.id] = [];
      }
    })
  );
  
  return results;
}

export async function fetchMultiChainNFTs(
  address: string
): Promise<Record<number, NFTBalance[]>> {
  const results: Record<number, NFTBalance[]> = {};
  
  await Promise.all(
    Object.values(SUPPORTED_CHAINS).map(async (chain) => {
      try {
        results[chain.id] = await fetchNFTBalances(chain.covalentName, address);
      } catch (error) {
        console.error(`Error fetching NFTs for chain ${chain.id}:`, error);
        results[chain.id] = [];
      }
    })
  );
  
  return results;
}

