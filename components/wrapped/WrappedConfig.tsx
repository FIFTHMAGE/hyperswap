'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: {
    enableMusic: boolean;
    enableAnimations: boolean;
    autoAdvance: boolean;
    theme: string;
  };
  onChange: (config: any) => void;
}

export function WrappedConfig({ isOpen, onClose, config, onChange }: Props) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-3xl font-extrabold text-white mb-8">
            ⚙️ Settings
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-white text-lg">Music</span>
              <button
                onClick={() => onChange({ ...config, enableMusic: !config.enableMusic })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  config.enableMusic ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    config.enableMusic ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white text-lg">Animations</span>
              <button
                onClick={() => onChange({ ...config, enableAnimations: !config.enableAnimations })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  config.enableAnimations ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    config.enableAnimations ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white text-lg">Auto-Advance</span>
              <button
                onClick={() => onChange({ ...config, autoAdvance: !config.autoAdvance })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  config.autoAdvance ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    config.autoAdvance ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-8 py-4 bg-white text-purple-900 rounded-xl font-bold text-lg hover:bg-gray-100"
          >
            Done
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

