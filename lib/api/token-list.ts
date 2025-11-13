/**
 * Token list management and search
 */

import { Token } from '../types/swap';

export interface TokenList {
  name: string;
  logoURI: string;
  keywords: string[];
  timestamp: string;
  tokens: Token[];
  version: {
    major: number;
    minor: number;
    patch: number;
  };
}

export class TokenListService {
  private tokenLists: Map<string, TokenList> = new Map();
  private allTokens: Token[] = [];

  /**
   * Load token list from URL or default lists
   */
  async loadTokenList(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch token list');
      
      const list: TokenList = await response.json();
      this.tokenLists.set(list.name, list);
      this.refreshAllTokens();
    } catch (error) {
      console.error('Error loading token list:', error);
    }
  }

  /**
   * Load default token lists (popular DEX lists)
   */
  async loadDefaultLists(): Promise<void> {
    const defaultLists = [
      'https://tokens.coingecko.com/uniswap/all.json',
      'https://gateway.ipfs.io/ipns/tokens.uniswap.org',
    ];

    await Promise.allSettled(
      defaultLists.map((url) => this.loadTokenList(url))
    );
  }

  /**
   * Refresh the combined list of all tokens
   */
  private refreshAllTokens(): void {
    const tokensMap = new Map<string, Token>();
    
    for (const list of this.tokenLists.values()) {
      for (const token of list.tokens) {
        const key = `${token.chainId}-${token.address.toLowerCase()}`;
        if (!tokensMap.has(key)) {
          tokensMap.set(key, token);
        }
      }
    }
    
    this.allTokens = Array.from(tokensMap.values());
  }

  /**
   * Search tokens by query
   */
  searchTokens(query: string, chainId?: number): Token[] {
    const lowerQuery = query.toLowerCase();
    
    return this.allTokens.filter((token) => {
      if (chainId && token.chainId !== chainId) return false;
      
      return (
        token.symbol.toLowerCase().includes(lowerQuery) ||
        token.name.toLowerCase().includes(lowerQuery) ||
        token.address.toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * Get token by address
   */
  getToken(address: string, chainId: number): Token | undefined {
    return this.allTokens.find(
      (token) =>
        token.address.toLowerCase() === address.toLowerCase() &&
        token.chainId === chainId
    );
  }

  /**
   * Get all tokens for a specific chain
   */
  getTokensByChain(chainId: number): Token[] {
    return this.allTokens.filter((token) => token.chainId === chainId);
  }

  /**
   * Get popular/top tokens
   */
  getPopularTokens(chainId?: number, limit: number = 10): Token[] {
    let tokens = chainId
      ? this.getTokensByChain(chainId)
      : this.allTokens;
    
    // In a real implementation, this would be based on volume or market cap
    return tokens.slice(0, limit);
  }
}

export const tokenListService = new TokenListService();

