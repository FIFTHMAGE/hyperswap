'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';

interface NFTCardProps {
  totalNFTs: number;
  uniqueCollections: number;
}

export function NFTCard({ totalNFTs, uniqueCollections }: NFTCardProps) {
  return (
    <StoryCard gradient="from-pink-900 to-rose-900">
      <div className="text-center space-y-8">
        <h2 className="text-4xl font-bold text-white">
          Your NFT Collection
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <div className="text-6xl font-extrabold text-pink-400">
              {totalNFTs}
            </div>
            <p className="text-xl text-white/80">
              NFTs owned
            </p>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <div className="text-6xl font-extrabold text-rose-400">
              {uniqueCollections}
            </div>
            <p className="text-xl text-white/80">
              Collections
            </p>
          </motion.div>
        </div>
      </div>
    </StoryCard>
  );
}

