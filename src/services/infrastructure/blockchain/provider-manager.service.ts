/**
 * Provider manager with multi-provider support and failover
 * @module services/blockchain
 */

type Provider = {
  url: string;
  priority: number;
  healthy: boolean;
  lastCheck: number;
};

class ProviderManagerService {
  private providers = new Map<number, Provider[]>();
  private healthCheckInterval = 60000; // 1 minute

  /**
   * Add provider for chain
   */
  addProvider(chainId: number, url: string, priority: number = 0): void {
    const providers = this.providers.get(chainId) || [];
    providers.push({ url, priority, healthy: true, lastCheck: Date.now() });
    providers.sort((a, b) => b.priority - a.priority);
    this.providers.set(chainId, providers);
  }

  /**
   * Get best available provider
   */
  getProvider(chainId: number): string | null {
    const providers = this.providers.get(chainId);
    if (!providers || providers.length === 0) return null;

    // Find first healthy provider
    for (const provider of providers) {
      if (provider.healthy) {
        return provider.url;
      }
    }

    // If no healthy providers, return first one (will trigger health check)
    return providers[0].url;
  }

  /**
   * Mark provider as unhealthy
   */
  markUnhealthy(chainId: number, url: string): void {
    const providers = this.providers.get(chainId);
    if (!providers) return;

    const provider = providers.find((p) => p.url === url);
    if (provider) {
      provider.healthy = false;
      provider.lastCheck = Date.now();
    }
  }

  /**
   * Health check for all providers
   */
  async healthCheck(): Promise<void> {
    for (const [_chainId, providers] of this.providers.entries()) {
      for (const provider of providers) {
        if (Date.now() - provider.lastCheck < this.healthCheckInterval) {
          continue;
        }

        try {
          const response = await fetch(provider.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_blockNumber',
              params: [],
              id: 1,
            }),
          });

          provider.healthy = response.ok;
          provider.lastCheck = Date.now();
        } catch {
          provider.healthy = false;
          provider.lastCheck = Date.now();
        }
      }
    }
  }
}

export const providerManager = new ProviderManagerService();
