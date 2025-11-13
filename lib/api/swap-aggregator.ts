/**
 * Swap aggregator API client for fetching quotes from multiple DEX aggregators
 */

import { SwapQuote, Token } from '../types/swap';

export class SwapAggregator {
  private apiKeys: {
    oneInch?: string;
    jupiter?: string;
  };

  constructor(apiKeys?: { oneInch?: string; jupiter?: string }) {
    this.apiKeys = apiKeys || {};
  }

  /**
   * Fetch the best swap quote from multiple aggregators
   */
  async getBestQuote(
    inputToken: Token,
    outputToken: Token,
    amount: string,
    slippage: number = 0.5
  ): Promise<SwapQuote | null> {
    try {
      const quotes = await Promise.allSettled([
        this.getOneInchQuote(inputToken, outputToken, amount, slippage),
        this.getJupiterQuote(inputToken, outputToken, amount, slippage),
      ]);

      const validQuotes = quotes
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<SwapQuote>).value)
        .filter((quote) => quote !== null);

      if (validQuotes.length === 0) {
        return null;
      }

      // Return the quote with the highest output amount
      return validQuotes.reduce((best, current) => {
        const bestOutput = parseFloat(best.outputAmount);
        const currentOutput = parseFloat(current.outputAmount);
        return currentOutput > bestOutput ? current : best;
      });
    } catch (error) {
      console.error('Error fetching swap quotes:', error);
      return null;
    }
  }

  /**
   * Get quote from 1inch
   */
  private async getOneInchQuote(
    inputToken: Token,
    outputToken: Token,
    amount: string,
    slippage: number
  ): Promise<SwapQuote> {
    const chainId = inputToken.chainId;
    const url = `https://api.1inch.dev/swap/v6.0/${chainId}/quote`;

    const params = new URLSearchParams({
      src: inputToken.address,
      dst: outputToken.address,
      amount: amount,
      includeGas: 'true',
    });

    const response = await fetch(`${url}?${params}`, {
      headers: this.apiKeys.oneInch
        ? { Authorization: `Bearer ${this.apiKeys.oneInch}` }
        : {},
    });

    if (!response.ok) {
      throw new Error('1inch API error');
    }

    const data = await response.json();

    return {
      inputToken,
      outputToken,
      inputAmount: amount,
      outputAmount: data.toAmount,
      priceImpact: parseFloat(data.estimatedGas) / 100,
      minimumReceived: (
        parseFloat(data.toAmount) *
        (1 - slippage / 100)
      ).toString(),
      estimatedGas: data.estimatedGas,
      route: this.parseOneInchRoute(data.protocols),
      provider: '1inch',
    };
  }

  /**
   * Get quote from Jupiter (Solana)
   */
  private async getJupiterQuote(
    inputToken: Token,
    outputToken: Token,
    amount: string,
    slippage: number
  ): Promise<SwapQuote> {
    const url = 'https://quote-api.jup.ag/v6/quote';

    const params = new URLSearchParams({
      inputMint: inputToken.address,
      outputMint: outputToken.address,
      amount: amount,
      slippageBps: (slippage * 100).toString(),
    });

    const response = await fetch(`${url}?${params}`);

    if (!response.ok) {
      throw new Error('Jupiter API error');
    }

    const data = await response.json();

    return {
      inputToken,
      outputToken,
      inputAmount: amount,
      outputAmount: data.outAmount,
      priceImpact: data.priceImpactPct,
      minimumReceived: data.otherAmountThreshold,
      estimatedGas: '0',
      route: this.parseJupiterRoute(data.routePlan),
      provider: 'jupiter',
    };
  }

  /**
   * Parse 1inch route data
   */
  private parseOneInchRoute(protocols: any[]): any[] {
    if (!protocols || protocols.length === 0) return [];

    return protocols[0].map((step: any) => ({
      protocol: step.name,
      tokenIn: step.fromTokenAddress,
      tokenOut: step.toTokenAddress,
      percentage: 100 / protocols[0].length,
    }));
  }

  /**
   * Parse Jupiter route data
   */
  private parseJupiterRoute(routePlan: any[]): any[] {
    if (!routePlan || routePlan.length === 0) return [];

    return routePlan.map((step: any) => ({
      protocol: step.swapInfo?.label || 'Unknown',
      tokenIn: step.swapInfo?.inputMint,
      tokenOut: step.swapInfo?.outputMint,
      percentage: 100 / routePlan.length,
    }));
  }

  /**
   * Execute a swap transaction
   */
  async executeSwap(
    quote: SwapQuote,
    userAddress: string,
    signTransaction: (tx: any) => Promise<string>
  ): Promise<string> {
    // This would be implemented based on the specific provider
    // For now, this is a placeholder
    throw new Error('executeSwap not implemented');
  }
}

export const swapAggregator = new SwapAggregator();

