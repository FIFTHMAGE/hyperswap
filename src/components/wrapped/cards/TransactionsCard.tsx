/**
 * Transactions summary card
 * @module components/wrapped/cards/TransactionsCard
 */

'use client';

import { motion } from 'framer-motion';
import { styled } from 'nativewind';
import { formatNumber } from '@/utils/format/number';

interface TransactionsCardProps {
  totalTransactions: number;
  successRate: number;
  mostActiveMonth: string;
}

const TransactionsCard: React.FC<TransactionsCardProps> = ({
  totalTransactions,
  successRate,
  mostActiveMonth,
}) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="mb-6"
      >
        <div className="text-8xl font-bold">
          {formatNumber(totalTransactions)}
        </div>
        <p className="text-2xl mt-2 opacity-90">Transactions</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex justify-center items-center gap-3">
          <div className="text-4xl">✅</div>
          <div className="text-3xl font-semibold">
            {successRate.toFixed(1)}% Success Rate
          </div>
        </div>

        <div className="text-xl opacity-80">
          Most active in <span className="font-bold">{mostActiveMonth}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default styled(TransactionsCard);

