'use client';

import { motion } from 'framer-motion';

interface Protocol {
  name: string;
  logo: string;
  interactions: number;
}

interface Props {
  protocols: Protocol[];
}

export function ProtocolInteractions({ protocols }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-4">
          Protocols You Loved
        </h1>
        <p className="text-2xl text-white/70 text-center mb-12">
          Your DeFi favorites
        </p>

        <div className="grid grid-cols-3 gap-6">
          {protocols.slice(0, 9).map((protocol, index) => (
            <motion.div
              key={protocol.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
            >
              <div className="text-5xl mb-4">{protocol.logo}</div>
              <h3 className="text-xl font-bold text-white mb-2">{protocol.name}</h3>
              <p className="text-3xl font-extrabold text-white">{protocol.interactions}</p>
              <p className="text-white/60 text-sm">interactions</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

