export const chainColors: Record<number, string> = {
  1: '#627EEA', // Ethereum
  10: '#FF0420', // Optimism
  137: '#8247E5', // Polygon
  42161: '#28A0F0', // Arbitrum
  8453: '#0052FF', // Base
  56: '#F3BA2F', // BSC
  43114: '#E84142', // Avalanche
};

export const chainLogos: Record<number, string> = {
  1: '⟠',
  10: '🔴',
  137: '🟣',
  42161: '🔵',
  8453: '🔵',
  56: '🟡',
  43114: '🔺',
};

export function getChainColor(chainId: number): string {
  return chainColors[chainId] || '#6B7280';
}

export function getChainLogo(chainId: number): string {
  return chainLogos[chainId] || '🔗';
}

