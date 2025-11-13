'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 bg-black/80 backdrop-blur-lg rounded-full p-4 flex items-center gap-4 z-50"
    >
      <audio ref={audioRef} loop>
        <source src="/music/wrapped-theme.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={togglePlay}
        className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
      >
        {playing ? (
          <span className="text-white">⏸</span>
        ) : (
          <span className="text-white">▶</span>
        )}
      </button>

      <div className="flex items-center gap-2">
        <span className="text-white text-sm">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24"
        />
      </div>
    </motion.div>
  );
}

