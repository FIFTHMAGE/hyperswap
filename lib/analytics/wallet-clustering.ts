export type WalletCluster = 'whale' | 'trader' | 'holder' | 'defi-user' | 'nft-collector' | 'casual';

export interface ClusterResult {
  cluster: WalletCluster;
  confidence: number;
  characteristics: string[];
}

export function clusterWallet(
  totalValue: number,
  transactionCount: number,
  avgDaysBetweenTx: number,
  defiInteractions: number,
  nftCount: number
): ClusterResult {
  const characteristics: string[] = [];
  let cluster: WalletCluster = 'casual';
  let confidence = 0.5;

  // Whale detection
  if (totalValue > 1000000) {
    cluster = 'whale';
    confidence = 0.9;
    characteristics.push('High portfolio value');
    characteristics.push('Significant market presence');
  }
  // Active trader
  else if (transactionCount > 500 && avgDaysBetweenTx < 2) {
    cluster = 'trader';
    confidence = 0.85;
    characteristics.push('High transaction frequency');
    characteristics.push('Active trading pattern');
  }
  // DeFi user
  else if (defiInteractions > 50) {
    cluster = 'defi-user';
    confidence = 0.8;
    characteristics.push('Heavy DeFi participation');
    characteristics.push('Protocol interactions');
  }
  // NFT collector
  else if (nftCount > 20) {
    cluster = 'nft-collector';
    confidence = 0.75;
    characteristics.push('NFT collection focus');
    characteristics.push('Multiple collectibles');
  }
  // Long-term holder
  else if (transactionCount < 50 && avgDaysBetweenTx > 30) {
    cluster = 'holder';
    confidence = 0.7;
    characteristics.push('Low transaction frequency');
    characteristics.push('Long-term strategy');
  }

  return {
    cluster,
    confidence,
    characteristics,
  };
}

