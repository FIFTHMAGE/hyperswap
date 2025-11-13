'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wrappedExportService } from '@/lib/api/wrapped-export';

interface Props {
  data: any;
}

export function ExportMenu({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const exportFormats = [
    { id: 'json', label: 'JSON', icon: '📄' },
    { id: 'csv', label: 'CSV', icon: '📊' },
    { id: 'html', label: 'HTML', icon: '🌐' },
  ];

  const handleExport = async (format: string) => {
    try {
      switch (format) {
        case 'json':
          await wrappedExportService.exportAsJSON(data);
          break;
        case 'csv':
          await wrappedExportService.exportAsCSV(data);
          break;
        case 'html':
          await wrappedExportService.exportAsHTML(data);
          break;
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="fixed top-8 left-8 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-semibold hover:bg-white/30 transition-colors"
      >
        📤 Export
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 bg-white/20 backdrop-blur-lg rounded-xl p-2 min-w-[150px]"
          >
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => handleExport(format.id)}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors flex items-center gap-3"
              >
                <span>{format.icon}</span>
                <span>{format.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

