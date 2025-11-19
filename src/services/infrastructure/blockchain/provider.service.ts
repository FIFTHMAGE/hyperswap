/**
 * Blockchain provider service for RPC interactions
 * @module services/blockchain/provider
 */

import { createPublicClient, http, type PublicClient, type Chain } from 'viem';
import { mainnet, polygon, arbitrum, optimism, base, avalanche } from 'viem/chains';
import { CHAINS, type ChainId } from '@/constants/blockchain';

// Map of chain ID to viem chain
const chainMap: Record<ChainId, Chain> = {
  1: mainnet,
  137: polygon,
  42161: arbitrum,
  10: optimism,
  8453: base,
  43114: avalanche,
};

// Cache for public clients
const clientCache = new Map<ChainId, PublicClient>();

/**
 * Get or create a public client for a chain
 */
export function getPublicClient(chainId: ChainId): PublicClient {
  if (clientCache.has(chainId)) {
    return clientCache.get(chainId)!;
  }

  const chain = chainMap[chainId];
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const chainConfig = CHAINS[chainId];
  const client = createPublicClient({
    chain,
    transport: http(chainConfig.rpcUrls[0]),
  });

  clientCache.set(chainId, client);
  return client;
}

/**
 * Get current block number
 */
export async function getBlockNumber(chainId: ChainId): Promise<bigint> {
  const client = getPublicClient(chainId);
  return await client.getBlockNumber();
}

/**
 * Get block by number
 */
export async function getBlock(chainId: ChainId, blockNumber: bigint) {
  const client = getPublicClient(chainId);
  return await client.getBlock({ blockNumber });
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(chainId: ChainId, hash: `0x${string}`) {
  const client = getPublicClient(chainId);
  return await client.getTransactionReceipt({ hash });
}

/**
 * Get transaction by hash
 */
export async function getTransaction(chainId: ChainId, hash: `0x${string}`) {
  const client = getPublicClient(chainId);
  return await client.getTransaction({ hash });
}

/**
 * Get balance of an address
 */
export async function getBalance(chainId: ChainId, address: `0x${string}`): Promise<bigint> {
  const client = getPublicClient(chainId);
  return await client.getBalance({ address });
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(
  chainId: ChainId,
  transaction: {
    to: `0x${string}`;
    data?: `0x${string}`;
    value?: bigint;
    from?: `0x${string}`;
  }
): Promise<bigint> {
  const client = getPublicClient(chainId);
  return await client.estimateGas(transaction);
}

/**
 * Get current gas price
 */
export async function getGasPrice(chainId: ChainId): Promise<bigint> {
  const client = getPublicClient(chainId);
  return await client.getGasPrice();
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  chainId: ChainId,
  hash: `0x${string}`,
  confirmations: number = 1
) {
  const client = getPublicClient(chainId);
  return await client.waitForTransactionReceipt({
    hash,
    confirmations,
  });
}

/**
 * Call a read-only contract function
 */
export async function readContract(
  chainId: ChainId,
  params: {
    address: `0x${string}`;
    abi: any[];
    functionName: string;
    args?: any[];
  }
) {
  const client = getPublicClient(chainId);
  return await client.readContract(params);
}

/**
 * Simulate a contract call
 */
export async function simulateContract(
  chainId: ChainId,
  params: {
    address: `0x${string}`;
    abi: any[];
    functionName: string;
    args?: any[];
    account?: `0x${string}`;
  }
) {
  const client = getPublicClient(chainId);
  return await client.simulateContract(params);
}

