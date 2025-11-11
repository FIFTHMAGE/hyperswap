'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleGetWrapped = () => {
    router.push('/wrapped');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-white"
        >
          Wallet Wrapped
        </motion.h1>
        <ConnectButton />
      </nav>

      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl space-y-8"
        >
          <h2 className="text-7xl font-extrabold text-white leading-tight">
            Your Year
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              On-Chain
            </span>
          </h2>

          <p className="text-2xl text-white/80 max-w-2xl mx-auto">
            Discover your crypto journey with beautiful, shareable insights
            from 2024
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            {isConnected ? (
              <Button onClick={handleGetWrapped} size="lg">
                Get Your Wrapped
              </Button>
            ) : (
              <div className="text-white/70">
                👆 Connect your wallet to get started
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="pt-12 grid grid-cols-3 gap-8 text-white/60"
          >
            <div>
              <p className="text-3xl font-bold text-white">5+</p>
              <p className="text-sm">Blockchains</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">∞</p>
              <p className="text-sm">Transactions</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">💯</p>
              <p className="text-sm">Insights</p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
