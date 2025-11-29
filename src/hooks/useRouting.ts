/**
 * useRouting Hook
 * Find optimal swap routes
 */

import { useState, useCallback, useMemo } from 'react';

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
}

export interface RouteHop {
  tokenIn: Token;
  tokenOut: Token;
  poolAddress: string;
  poolFee: number;
  protocol: string;
}

export interface Route {
  id: string;
  hops: RouteHop[];
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  priceImpact: number;
  gasCost: string;
  gasCostUSD: string;
  netOutput: string;
  efficiency: number;
}

export interface UseRoutingOptions {
  maxHops?: number;
  maxSplits?: number;
  protocols?: string[];
  gasPrice?: bigint;
}

export interface UseRoutingReturn {
  routes: Route[];
  bestRoute: Route | null;
  isLoading: boolean;
  error: Error | null;
  findRoutes: (
    tokenIn: Token,
    tokenOut: Token,
    amountIn: string
  ) => Promise<Route[]>;
  selectRoute: (routeId: string) => void;
  selectedRoute: Route | null;
  refresh: () => Promise<void>;
}

export function useRouting(options: UseRoutingOptions = {}): UseRoutingReturn {
  const { maxHops = 3, maxSplits = 4, protocols = [] } = options;

  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastParams, setLastParams] = useState<{
    tokenIn: Token;
    tokenOut: Token;
    amountIn: string;
  } | null>(null);

  const bestRoute = useMemo(() => {
    if (routes.length === 0) return null;
    
    // Sort by net output (accounting for gas)
    return routes.reduce((best, route) => {
      const bestNet = parseFloat(best.netOutput);
      const routeNet = parseFloat(route.netOutput);
      return routeNet > bestNet ? route : best;
    });
  }, [routes]);

  const findRoutes = useCallback(async (
    tokenIn: Token,
    tokenOut: Token,
    amountIn: string
  ): Promise<Route[]> => {
    setIsLoading(true);
    setError(null);
    setLastParams({ tokenIn, tokenOut, amountIn });

    try {
      // Simulate route finding delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const amountInFloat = parseFloat(amountIn);
      if (isNaN(amountInFloat) || amountInFloat <= 0) {
        throw new Error('Invalid input amount');
      }

      // Generate mock routes
      const mockRoutes: Route[] = [];

      // Direct route
      const directOutput = amountInFloat * 0.997; // 0.3% fee
      mockRoutes.push({
        id: 'route_direct',
        hops: [{
          tokenIn,
          tokenOut,
          poolAddress: '0xpool1',
          poolFee: 3000,
          protocol: 'uniswap_v3',
        }],
        inputToken: tokenIn,
        outputToken: tokenOut,
        inputAmount: amountIn,
        outputAmount: directOutput.toFixed(6),
        priceImpact: 0.15,
        gasCost: '150000',
        gasCostUSD: '2.50',
        netOutput: (directOutput - 0.001).toFixed(6),
        efficiency: 99.7,
      });

      // Multi-hop route (if allowed)
      if (maxHops >= 2) {
        const hopOutput = amountInFloat * 0.998; // Better rate
        mockRoutes.push({
          id: 'route_multihop',
          hops: [
            {
              tokenIn,
              tokenOut: { address: '0xweth', symbol: 'WETH', decimals: 18 },
              poolAddress: '0xpool2',
              poolFee: 500,
              protocol: 'uniswap_v3',
            },
            {
              tokenIn: { address: '0xweth', symbol: 'WETH', decimals: 18 },
              tokenOut,
              poolAddress: '0xpool3',
              poolFee: 500,
              protocol: 'uniswap_v3',
            },
          ],
          inputToken: tokenIn,
          outputToken: tokenOut,
          inputAmount: amountIn,
          outputAmount: hopOutput.toFixed(6),
          priceImpact: 0.08,
          gasCost: '250000',
          gasCostUSD: '4.20',
          netOutput: (hopOutput - 0.002).toFixed(6),
          efficiency: 99.8,
        });
      }

      // Split route
      if (maxSplits >= 2) {
        const splitOutput = amountInFloat * 0.9975;
        mockRoutes.push({
          id: 'route_split',
          hops: [{
            tokenIn,
            tokenOut,
            poolAddress: '0xpool_agg',
            poolFee: 2500,
            protocol: 'aggregated',
          }],
          inputToken: tokenIn,
          outputToken: tokenOut,
          inputAmount: amountIn,
          outputAmount: splitOutput.toFixed(6),
          priceImpact: 0.05,
          gasCost: '200000',
          gasCostUSD: '3.35',
          netOutput: (splitOutput - 0.0015).toFixed(6),
          efficiency: 99.75,
        });
      }

      // Sort by net output
      mockRoutes.sort((a, b) => parseFloat(b.netOutput) - parseFloat(a.netOutput));
      
      setRoutes(mockRoutes);
      setSelectedRoute(mockRoutes[0] || null);
      
      return mockRoutes;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to find routes');
      setError(error);
      setRoutes([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [maxHops, maxSplits]);

  const selectRoute = useCallback((routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      setSelectedRoute(route);
    }
  }, [routes]);

  const refresh = useCallback(async () => {
    if (lastParams) {
      await findRoutes(lastParams.tokenIn, lastParams.tokenOut, lastParams.amountIn);
    }
  }, [lastParams, findRoutes]);

  return {
    routes,
    bestRoute,
    isLoading,
    error,
    findRoutes,
    selectRoute,
    selectedRoute,
    refresh,
  };
}

export default useRouting;

