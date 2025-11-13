'use client';

import { LivePriceFeed } from './LivePriceFeed';
import { LiveOrderBook } from './LiveOrderBook';
import { RecentTrades } from './RecentTrades';
import { LiveActivityFeed } from './LiveActivityFeed';
import { ConnectionStatus } from './ConnectionStatus';

export function RealtimeDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <ConnectionStatus />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
          Real-Time Market Data
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <LivePriceFeed />
          </div>

          <div className="lg:col-span-1">
            <LiveOrderBook />
          </div>

          <div className="lg:col-span-1">
            <RecentTrades />
          </div>

          <div className="lg:col-span-3">
            <LiveActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}

