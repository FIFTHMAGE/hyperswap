'use client';

import { motion } from 'framer-motion';

interface WalletStats {
  address: string;
  transactions: number;
  volume: number;
  gasSpent: number;
}

interface Props {
  wallets: WalletStats[];
}

export function MultiWalletComparison({ wallets }: Props) {
  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <motion.div className="max-w-6xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-12">
          Wallet Comparison
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/10 backdrop-blur-lg">
                <th className="p-4 text-left text-white font-bold">Wallet</th>
                <th className="p-4 text-right text-white font-bold">Transactions</th>
                <th className="p-4 text-right text-white font-bold">Volume</th>
                <th className="p-4 text-right text-white font-bold">Gas Spent</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet, index) => (
                <motion.tr
                  key={wallet.address}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-white/10"
                >
                  <td className="p-4 text-white font-mono">
                    {formatAddress(wallet.address)}
                  </td>
                  <td className="p-4 text-right text-white text-xl font-bold">
                    {wallet.transactions}
                  </td>
                  <td className="p-4 text-right text-white text-xl font-bold">
                    ${wallet.volume.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-white text-xl font-bold">
                    ${wallet.gasSpent.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

