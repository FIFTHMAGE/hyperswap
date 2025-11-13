'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';
import { DeFiProtocol } from '@/lib/types/defi';

interface DeFiProtocolsShowcaseCardProps {
  protocols: DeFiProtocol[];
}

export function DeFiProtocolsShowcaseCard({ protocols }: DeFiProtocolsShowcaseCardProps) {
  return (
    <StoryCard gradient="from-indigo-900 to-purple-900">
      <div className="space-y-8">
        <h2 className="text-4xl font-bold text-white text-center">
          Your DeFi Journey
        </h2>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <div className="text-6xl font-extrabold text-purple-400">
            {protocols.length}
          </div>
          <p className="text-xl text-white/80">protocols used</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {protocols.slice(0, 6).map((protocol, index) => (
            <motion.div
              key={protocol.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              className="bg-white/10 backdrop-blur rounded-xl p-4 text-center"
            >
              <p className="text-lg font-semibold text-white">{protocol.name}</p>
              <p className="text-sm text-white/60">{protocol.interactionCount} interactions</p>
            </motion.div>
          ))}
        </div>
      </div>
    </StoryCard>
  );
}

