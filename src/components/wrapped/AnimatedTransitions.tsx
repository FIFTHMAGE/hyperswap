'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Props {
  cards: React.ReactNode[];
}

export function AnimatedTransitions({ cards }: Props) {
  const [currentCard, setCurrentCard] = useState(0);

  const nextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          {cards[currentCard]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50">
        <button
          onClick={prevCard}
          disabled={currentCard === 0}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-semibold disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-semibold">
          {currentCard + 1} / {cards.length}
        </span>
        <button
          onClick={nextCard}
          disabled={currentCard === cards.length - 1}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-semibold disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

