'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

interface Props {
  stats: {
    transactions: number;
    volume: number;
    topToken: string;
  };
}

export function SocialShareCard({ stats }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current);
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'wrapped-2024.png';
      link.href = url;
      link.click();
    } catch (error) {
      console.error('Error downloading:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div className="max-w-2xl w-full">
        <h1 className="text-5xl font-extrabold text-white text-center mb-12">
          Share Your Wrapped
        </h1>

        <div
          ref={cardRef}
          className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 mb-8"
        >
          <h2 className="text-4xl font-extrabold text-white mb-8 text-center">
            My Crypto 2024
          </h2>
          <div className="space-y-6 text-white">
            <div className="text-center">
              <p className="text-6xl font-extrabold mb-2">{stats.transactions}</p>
              <p className="text-xl">Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold mb-2">
                ${stats.volume.toLocaleString()}
              </p>
              <p className="text-xl">Total Volume</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold mb-2">{stats.topToken}</p>
              <p className="text-xl">Top Token</p>
            </div>
          </div>
        </div>

        <button
          onClick={downloadImage}
          disabled={downloading}
          className="w-full py-4 bg-white text-purple-900 rounded-xl font-bold text-lg hover:bg-gray-100"
        >
          {downloading ? 'Downloading...' : '📸 Download Image'}
        </button>
      </motion.div>
    </div>
  );
}

