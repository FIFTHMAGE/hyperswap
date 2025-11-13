export interface LeaderboardEntry {
  address: string;
  displayName: string;
  score: number;
  rank: number;
  stats: {
    transactions: number;
    chains: number;
    gasSpent: number;
  };
}

export interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  scoreCalculator: (stats: any) => number;
}

export const leaderboardCategories: LeaderboardCategory[] = [
  {
    id: 'transactions',
    name: 'Most Active',
    description: 'Based on total transactions',
    scoreCalculator: (stats) => stats.totalTransactions,
  },
  {
    id: 'chains',
    name: 'Multi-Chain Master',
    description: 'Based on unique chains used',
    scoreCalculator: (stats) => stats.uniqueChains * 100,
  },
  {
    id: 'gas-spent',
    name: 'Gas Champion',
    description: 'Based on total gas spent',
    scoreCalculator: (stats) => stats.totalGasSpent,
  },
  {
    id: 'defi',
    name: 'DeFi Pioneer',
    description: 'Based on DeFi protocol usage',
    scoreCalculator: (stats) => stats.defiProtocols * 50,
  },
];

export function calculateRank(score: number, allScores: number[]): number {
  const sorted = [...allScores].sort((a, b) => b - a);
  return sorted.indexOf(score) + 1;
}

