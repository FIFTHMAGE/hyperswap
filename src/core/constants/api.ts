export const COVALENT_API_BASE_URL = 'https://api.covalenthq.com/v1';

export const API_ENDPOINTS = {
  TRANSACTIONS: (chain: string, address: string) => `/${chain}/address/${address}/transactions_v3/`,
  BALANCES: (chain: string, address: string) => `/${chain}/address/${address}/balances_v2/`,
  TOKEN_TRANSFERS: (chain: string, address: string) => `/${chain}/address/${address}/transfers_v2/`,
  NFT_BALANCES: (chain: string, address: string) => `/${chain}/address/${address}/balances_nft/`,
  PORTFOLIO: (chain: string, address: string) => `/${chain}/address/${address}/portfolio_v2/`,
} as const;
