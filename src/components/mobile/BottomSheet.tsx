'use client';

import { motion, PanInfo } from 'framer-motion';
import { useState } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[];
}

export function BottomSheet({ 
  isOpen, 
  onClose, 
  children,
  snapPoints = [0.3, 0.6, 0.9]
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(1);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (velocity > 500 || offset > 100) {
      onClose();
    } else if (velocity < -500 || offset < -100) {
      setCurrentSnap(Math.min(snapPoints.length - 1, currentSnap + 1));
    }
  };

  const height = `${snapPoints[currentSnap] * 100}vh`;

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-50"
        style={{ height }}
      >
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-3 mb-4" />
        
        <div className="px-4 pb-4 overflow-y-auto h-full">
          {children}
        </div>
      </motion.div>
    </>
  );
}

