'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PDFExporter } from '@/lib/utils/pdf-export';

interface Props {
  data: any;
}

export function DownloadButton({ data }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await PDFExporter.exportToPDF(data);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={handleDownload}
      disabled={downloading}
      className="fixed top-8 right-8 px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-semibold hover:bg-white/30 transition-colors disabled:opacity-50 z-50"
    >
      {downloading ? '⏳ Downloading...' : '📥 Download PDF'}
    </motion.button>
  );
}

