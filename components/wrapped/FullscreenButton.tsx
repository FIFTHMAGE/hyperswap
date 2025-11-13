'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={toggleFullscreen}
      className="fixed bottom-8 left-8 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-lg rounded-full hover:bg-white/30 transition-colors z-50"
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      <span className="text-white text-xl">
        {isFullscreen ? '⛶' : '⛶'}
      </span>
    </motion.button>
  );
}

