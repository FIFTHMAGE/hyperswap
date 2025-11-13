'use client';

import { useState, useEffect } from 'react';
import { AnimatedTransitions } from './AnimatedTransitions';
import { QuarterlyBreakdown } from './QuarterlyBreakdown';
import { NFTCollectionCard } from './NFTCollectionCard';
import { DeFiTimeline } from './DeFiTimeline';
import { WhaleWatching } from './WhaleWatching';
import { HoldingDuration } from './HoldingDuration';
import { AchievementsBadges } from './AchievementsBadges';
import { GainLossCalculator } from './GainLossCalculator';
import { SocialShareCard } from './SocialShareCard';

interface Props {
  address: string;
}

export function WrappedStoryFlow({ address }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadWrappedData();
  }, [address]);

  const loadWrappedData = async () => {
    // Mock data loading
    setData({
      quarters: [
        { quarter: 'Q1', transactions: 120, volume: 50000, gasSpent: 250, topActivity: 'DEX Trading' },
        { quarter: 'Q2', transactions: 150, volume: 65000, gasSpent: 300, topActivity: 'NFT Minting' },
      ],
      nfts: { totalNFTs: 42, collections: [], totalValue: 250000, mostValuableNFT: null },
      defi: [],
      whales: [],
      holdings: [],
      achievements: [],
      stats: { transactions: 650, volume: 290000, topToken: 'ETH' },
      gainLoss: { totalGain: 50000, totalLoss: 10000, winRate: 80 },
    });
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-4xl font-bold">Loading your wrapped...</div>
      </div>
    );
  }

  const cards = [
    <QuarterlyBreakdown key="quarters" data={data.quarters} />,
    <NFTCollectionCard key="nfts" analytics={data.nfts} />,
    <DeFiTimeline key="defi" activities={data.defi} />,
    <WhaleWatching key="whales" transactions={data.whales} />,
    <HoldingDuration key="holdings" holdings={data.holdings} />,
    <AchievementsBadges key="achievements" achievements={data.achievements} />,
    <GainLossCalculator key="gainloss" {...data.gainLoss} />,
    <SocialShareCard key="share" stats={data.stats} />,
  ];

  return <AnimatedTransitions cards={cards} />;
}

