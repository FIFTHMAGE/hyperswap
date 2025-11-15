'use client';

import { useState } from 'react';
import { SwapInterface } from './SwapInterface';
import { SwapHistory } from './SwapHistory';
import { PortfolioTracker } from './PortfolioTracker';
import { LimitOrderPanel } from './LimitOrderPanel';

export function SwapDashboard() {
  const [activeTab, setActiveTab] = useState<'swap' | 'history' | 'portfolio' | 'limit'>('swap');

  const tabs = [
    { id: 'swap' as const, label: 'Swap', icon: '🔄' },
    { id: 'history' as const, label: 'History', icon: '📜' },
    { id: 'portfolio' as const, label: 'Portfolio', icon: '💼' },
    { id: 'limit' as const, label: 'Limit Orders', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'swap' && <SwapInterface />}
          {activeTab === 'history' && <SwapHistory />}
          {activeTab === 'portfolio' && <PortfolioTracker />}
          {activeTab === 'limit' && <LimitOrderPanel />}
        </div>
      </div>
    </div>
  );
}

