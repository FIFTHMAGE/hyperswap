'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Theme {
  id: string;
  name: string;
  gradient: string;
  preview: string;
}

const themes: Theme[] = [
  { id: 'purple', name: 'Purple Rain', gradient: 'from-purple-900 to-pink-900', preview: '🟣' },
  { id: 'blue', name: 'Ocean Blue', gradient: 'from-blue-900 to-cyan-900', preview: '🔵' },
  { id: 'green', name: 'Forest Green', gradient: 'from-green-900 to-teal-900', preview: '🟢' },
  { id: 'red', name: 'Fire Red', gradient: 'from-red-900 to-orange-900', preview: '🔴' },
];

export function ThemeSelector() {
  const [selected, setSelected] = useState('purple');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-12">
          Choose Your Theme
        </h1>

        <div className="grid grid-cols-2 gap-6">
          {themes.map((theme, index) => (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelected(theme.id)}
              className={`bg-gradient-to-br ${theme.gradient} rounded-2xl p-12 text-center border-4 transition-all ${
                selected === theme.id ? 'border-white scale-105' : 'border-transparent'
              }`}
            >
              <div className="text-6xl mb-4">{theme.preview}</div>
              <h3 className="text-3xl font-bold text-white">{theme.name}</h3>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

