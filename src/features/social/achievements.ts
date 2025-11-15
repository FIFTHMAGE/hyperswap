export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: any) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const achievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Made your first transaction',
    icon: '👶',
    condition: (stats) => stats.totalTransactions >= 1,
    rarity: 'common',
  },
  {
    id: 'chain-hopper',
    title: 'Chain Hopper',
    description: 'Used 3+ different blockchains',
    icon: '🔗',
    condition: (stats) => stats.uniqueChains >= 3,
    rarity: 'common',
  },
  {
    id: 'defi-explorer',
    title: 'DeFi Explorer',
    description: 'Interacted with 5+ DeFi protocols',
    icon: '🚀',
    condition: (stats) => stats.defiProtocols >= 5,
    rarity: 'rare',
  },
  {
    id: 'whale-watcher',
    title: 'Whale Watcher',
    description: 'Portfolio value exceeded $100k',
    icon: '🐋',
    condition: (stats) => stats.portfolioValue >= 100000,
    rarity: 'epic',
  },
  {
    id: 'gas-guzzler',
    title: 'Gas Guzzler',
    description: 'Spent over $1000 in gas fees',
    icon: '⛽',
    condition: (stats) => stats.totalGasSpent >= 1000,
    rarity: 'rare',
  },
  {
    id: 'early-adopter',
    title: 'Early Adopter',
    description: 'Active for over 2 years',
    icon: '🎖️',
    condition: (stats) => stats.daysActive >= 730,
    rarity: 'legendary',
  },
];

export function checkAchievements(stats: any): Achievement[] {
  return achievements.filter(achievement => achievement.condition(stats));
}

