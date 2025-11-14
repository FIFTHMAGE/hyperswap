/**
 * Welcome card for year wrapped
 * @module components/wrapped/cards/WelcomeCard
 */

'use client';

import { motion } from 'framer-motion';
import { styled } from 'nativewind';

interface WelcomeCardProps {
  year: number;
  userName?: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ year, userName }) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="text-8xl mb-8"
      >
        🎉
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-bold mb-4"
      >
        {userName ? `${userName}'s` : 'Your'}
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-6xl font-bold mb-6"
      >
        {year} Wrapped
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-xl opacity-90"
      >
        Let's explore your blockchain journey
      </motion.p>
    </div>
  );
};

export default styled(WelcomeCard);

