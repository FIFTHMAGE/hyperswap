/**
 * TokenRegistry - Token metadata and registry
 * @module features/tokens
 */

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
  coingeckoId?: string;
}

export interface TokenList {
  name: string;
  version: string;
  tokens: Token[];
}

export class TokenRegistry {
  private tokens: Map<string, Token> = new Map();
  private tokensBySymbol: Map<string, Token[]> = new Map();

  constructor() {
    this.initializeDefaultTokens();
  }

  /**
   * Initialize default tokens
   */
  private initializeDefaultTokens(): void {
    const defaultTokens: Token[] = [
      {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        coingeckoId: 'ethereum',
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        chainId: 1,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
        coingeckoId: 'usd-coin',
      },
      {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        chainId: 1,
        logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
        coingeckoId: 'tether',
      },
      {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png',
        coingeckoId: 'dai',
      },
      {
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        decimals: 8,
        chainId: 1,
        logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
        coingeckoId: 'wrapped-bitcoin',
      },
      {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
        coingeckoId: 'weth',
      },
    ];

    defaultTokens.forEach((token) => this.addToken(token));
  }

  /**
   * Add token to registry
   */
  addToken(token: Token): void {
    const key = this.getTokenKey(token.address, token.chainId);
    this.tokens.set(key, token);

    const symbolTokens = this.tokensBySymbol.get(token.symbol) || [];
    symbolTokens.push(token);
    this.tokensBySymbol.set(token.symbol, symbolTokens);
  }

  /**
   * Get token by address and chain ID
   */
  getToken(address: string, chainId: number): Token | undefined {
    const key = this.getTokenKey(address, chainId);
    return this.tokens.get(key);
  }

  /**
   * Get tokens by symbol
   */
  getTokensBySymbol(symbol: string): Token[] {
    return this.tokensBySymbol.get(symbol) || [];
  }

  /**
   * Search tokens by query
   */
  searchTokens(query: string, chainId?: number): Token[] {
    const lowerQuery = query.toLowerCase();
    const results: Token[] = [];

    this.tokens.forEach((token) => {
      if (chainId && token.chainId !== chainId) {
        return;
      }

      const matchesSymbol = token.symbol.toLowerCase().includes(lowerQuery);
      const matchesName = token.name.toLowerCase().includes(lowerQuery);
      const matchesAddress = token.address.toLowerCase().includes(lowerQuery);

      if (matchesSymbol || matchesName || matchesAddress) {
        results.push(token);
      }
    });

    return results;
  }

  /**
   * Get all tokens for a chain
   */
  getTokensByChain(chainId: number): Token[] {
    const results: Token[] = [];
    this.tokens.forEach((token) => {
      if (token.chainId === chainId) {
        results.push(token);
      }
    });
    return results;
  }

  /**
   * Load token list from URL or object
   */
  async loadTokenList(tokenListOrUrl: TokenList | string): Promise<void> {
    let tokenList: TokenList;

    if (typeof tokenListOrUrl === 'string') {
      const response = await fetch(tokenListOrUrl);
      tokenList = await response.json();
    } else {
      tokenList = tokenListOrUrl;
    }

    tokenList.tokens.forEach((token) => this.addToken(token));
  }

  /**
   * Remove token from registry
   */
  removeToken(address: string, chainId: number): boolean {
    const key = this.getTokenKey(address, chainId);
    const token = this.tokens.get(key);

    if (!token) {
      return false;
    }

    this.tokens.delete(key);

    const symbolTokens = this.tokensBySymbol.get(token.symbol);
    if (symbolTokens) {
      const filtered = symbolTokens.filter(
        (t) => !(t.address === address && t.chainId === chainId)
      );
      this.tokensBySymbol.set(token.symbol, filtered);
    }

    return true;
  }

  /**
   * Clear all tokens
   */
  clear(): void {
    this.tokens.clear();
    this.tokensBySymbol.clear();
  }

  /**
   * Get token key
   */
  private getTokenKey(address: string, chainId: number): string {
    return `${chainId}:${address.toLowerCase()}`;
  }

  /**
   * Get all tokens
   */
  getAllTokens(): Token[] {
    return Array.from(this.tokens.values());
  }

  /**
   * Get token count
   */
  getTokenCount(): number {
    return this.tokens.size;
  }
}

export const tokenRegistry = new TokenRegistry();
