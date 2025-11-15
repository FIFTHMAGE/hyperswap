'use client';

import { motion } from 'framer-motion';

interface Props {
  stats: {
    uniqueInteractions: number;
    sentTo: number;
    receivedFrom: number;
    topInteraction: { address: string; count: number };
  };
}

export function SocialStats({ stats }: Props) {
  const formatAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-4">
          Your On-Chain Network
        </h1>
        <p className="text-2xl text-white/70 text-center mb-12">
          The wallets you interacted with
        </p>

        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
          >
            <p className="text-6xl font-extrabold text-white mb-2">
              {stats.uniqueInteractions}
            </p>
            <p className="text-xl text-white/80">Unique Wallets</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
          >
            <p className="text-6xl font-extrabold text-white mb-2">{stats.sentTo}</p>
            <p className="text-xl text-white/80">Sent Transactions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
          >
            <p className="text-6xl font-extrabold text-white mb-2">
              {stats.receivedFrom}
            </p>
            <p className="text-xl text-white/80">Received From</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
          >
            <p className="text-3xl font-extrabold text-white mb-2 font-mono">
              {formatAddr(stats.topInteraction.address)}
            </p>
            <p className="text-xl text-white/80">Most Interactions</p>
            <p className="text-sm text-white/60 mt-2">
              {stats.topInteraction.count} times
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

