'use client';

import { motion } from 'framer-motion';
import { NFTAnalytics } from '@/lib/types/wrapped';

interface Props {
  analytics: NFTAnalytics;
}

export function NFTCollectionCard({ analytics }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl w-full"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="text-7xl font-extrabold text-white text-center mb-12"
        >
          Your NFT Journey
        </motion.h1>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20"
        >
          <div className="text-center mb-8">
            <p className="text-8xl font-extrabold text-white">{analytics.totalNFTs}</p>
            <p className="text-3xl text-white/80 mt-2">NFTs Collected</p>
          </div>

          <div className="space-y-4">
            {analytics.collections.slice(0, 5).map((collection, index) => (
              <motion.div
                key={collection.name}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-white/10 rounded-xl"
              >
                <div>
                  <p className="text-xl font-bold text-white">{collection.name}</p>
                  <p className="text-white/70">{collection.count} items</p>
                </div>
                <p className="text-2xl font-bold text-white">
                  Ξ{collection.floorPrice.toFixed(2)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

