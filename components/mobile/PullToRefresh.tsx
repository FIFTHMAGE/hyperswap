'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pullDistance = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && startY.current) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;
      
      if (distance > 0) {
        pullDistance.current = Math.min(distance, 100);
        setPulling(true);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance.current > 60 && !refreshing) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    
    setPulling(false);
    pullDistance.current = 0;
    startY.current = 0;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        initial={false}
        animate={{
          y: pulling ? pullDistance.current * 0.5 : 0,
        }}
        className="relative"
      >
        {(pulling || refreshing) && (
          <div className="absolute top-0 left-0 right-0 flex justify-center py-4">
            <div className={`${refreshing ? 'animate-spin' : ''}`}>
              {refreshing ? '⟳' : '↓'}
            </div>
          </div>
        )}
        {children}
      </motion.div>
    </div>
  );
}

