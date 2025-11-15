'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-gray-900 z-50 lg:hidden"
            >
              <div className="p-6 pt-20">
                <div className="space-y-4">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="block text-white hover:text-purple-400 transition-colors text-lg"
                  >
                    Home
                  </Link>
                  <Link
                    href="/wrapped"
                    onClick={() => setIsOpen(false)}
                    className="block text-white hover:text-purple-400 transition-colors text-lg"
                  >
                    My Wrapped
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block text-white hover:text-purple-400 transition-colors text-lg"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

