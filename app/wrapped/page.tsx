'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { WalletWrappedStats } from '@/lib/types/wrapped';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StoryNavigator } from '@/components/wrapped/StoryNavigator';
import {
  WelcomeCard,
  TransactionsCard,
  GasSpentCard,
  MostActiveChainCard,
  TopTokensCard,
  NFTCard,
  SummaryCard,
  ShareCard,
} from '@/components/wrapped/cards';

export default function WrappedPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [stats, setStats] = useState<WalletWrappedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    async function fetchData() {
      if (!address) return;

      try {
        const response = await fetch(`/api/wrapped?address=${address}`);
        const data = await response.json();
        setStats(data.data);
      } catch (error) {
        console.error('Error fetching wrapped data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [address, isConnected, router]);

  const handleNext = () => {
    setCurrentCard((prev) => Math.min(prev + 1, 7));
  };

  const handlePrevious = () => {
    setCurrentCard((prev) => Math.max(prev - 1, 0));
  };

  const handleShare = () => {
    // Share functionality to be implemented
    console.log('Share clicked');
  };

  const handleDownload = () => {
    // Download functionality to be implemented
    console.log('Download clicked');
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const cards = [
    <WelcomeCard key="welcome" address={stats.address} year={stats.year} />,
    <TransactionsCard key="transactions" totalTransactions={stats.totalTransactions} />,
    <GasSpentCard key="gas" gasSpent={stats.totalGasSpent} />,
    <MostActiveChainCard
      key="chain"
      chainName={stats.mostActiveChain.chainName}
      transactionCount={stats.mostActiveChain.transactionCount}
      totalTransactions={stats.totalTransactions}
    />,
    <TopTokensCard key="tokens" tokens={stats.topTokens} />,
    <NFTCard key="nfts" totalNFTs={stats.totalNFTsHeld} uniqueCollections={stats.nftCollections.length} />,
    <SummaryCard key="summary" stats={stats} />,
    <ShareCard key="share" onShare={handleShare} onDownload={handleDownload} />,
  ];

  return (
    <div className="relative">
      <StoryNavigator
        currentIndex={currentCard}
        total={cards.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
      <AnimatePresence mode="wait">
        {cards[currentCard]}
      </AnimatePresence>
    </div>
  );
}

