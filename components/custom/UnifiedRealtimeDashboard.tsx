/**
 * Unified Real-time Dashboard
 * Comprehensive dashboard combining all real-time features
 */

'use client';

import { useState } from 'react';
import { PriceTicker } from './PriceTicker';
import { LivePortfolio } from './LivePortfolio';
import { LivePriceFeed } from './LivePriceFeed';
import { LiveOrderBook } from './LiveOrderBook';
import { RecentTrades } from './RecentTrades';
import { RealtimeMetrics } from './RealtimeMetrics';
import { WebSocketMonitor } from './WebSocketMonitor';
import { NotificationCenter } from './NotificationCenter';
import { LiveActivityFeed } from './LiveActivityFeed';

interface UnifiedRealtimeDashboardProps {
  walletAddress?: string;
  defaultToken?: string;
  layout?: 'default' | 'compact' | 'trading' | 'portfolio';
}

export function UnifiedRealtimeDashboard({ 
  walletAddress,
  defaultToken = 'SOL',
  layout = 'default' 
}: UnifiedRealtimeDashboardProps) {
  const [selectedToken, setSelectedToken] = useState(defaultToken);
  const [showMonitor, setShowMonitor] = useState(false);

  if (layout === 'compact') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <PriceTicker compact />
        
        {/* Notification Center */}
        <NotificationCenter position="top-right" compact />

        {/* Main Content */}
        <div className="container mx-auto p-4 space-y-4">
          <RealtimeMetrics compact metrics={['24h Volume', '24h Trades', 'Active Users', 'Gas (Average)']} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {walletAddress && (
              <LivePortfolio walletAddress={walletAddress} compact />
            )}
            <LivePriceFeed tokens={[selectedToken]} compact />
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'trading') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Price Ticker */}
        <PriceTicker />

        {/* Notification Center */}
        <NotificationCenter position="top-right" />

        {/* Trading Layout */}
        <div className="grid grid-cols-12 gap-4 p-4">
          {/* Left: Order Book & Recent Trades */}
          <div className="col-span-3 space-y-4">
            <LiveOrderBook token={selectedToken} maxDepth={15} />
            <RecentTrades token={selectedToken} maxTrades={10} />
          </div>

          {/* Center: Chart & Price Feed */}
          <div className="col-span-6 space-y-4">
            <LivePriceFeed 
              tokens={[selectedToken]} 
              showChart 
              chartHeight={400}
            />
            <RealtimeMetrics 
              metrics={['24h Volume', 'Top Gainer', 'Top Loser', 'Gas (Fast)']}
            />
          </div>

          {/* Right: Portfolio & Activity */}
          <div className="col-span-3 space-y-4">
            {walletAddress && (
              <LivePortfolio walletAddress={walletAddress} showChart={false} />
            )}
            <LiveActivityFeed maxItems={10} />
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'portfolio') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
              <button
                onClick={() => setShowMonitor(!showMonitor)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showMonitor ? 'Hide' : 'Show'} Monitor
              </button>
            </div>
          </div>
        </div>

        {/* Notification Center */}
        <NotificationCenter position="top-right" />

        {/* Content */}
        <div className="container mx-auto p-4 space-y-6">
          {showMonitor && (
            <WebSocketMonitor detailed showChart />
          )}

          <RealtimeMetrics />

          {walletAddress && (
            <LivePortfolio 
              walletAddress={walletAddress} 
              showChart 
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LiveActivityFeed />
            <LivePriceFeed 
              tokens={['SOL', 'BTC', 'ETH', 'USDC']} 
              showChart={false}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Price Ticker */}
      <PriceTicker speed={60} />

      {/* Notification Center */}
      <NotificationCenter position="top-right" maxVisible={5} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Real-time Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMonitor(!showMonitor)}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {showMonitor ? 'Hide' : 'Show'} Monitor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 space-y-6">
        {/* WebSocket Monitor */}
        {showMonitor && (
          <WebSocketMonitor detailed showChart />
        )}

        {/* Metrics */}
        <section>
          <h2 className="text-xl font-bold mb-4">Market Metrics</h2>
          <RealtimeMetrics />
        </section>

        {/* Portfolio Section */}
        {walletAddress && (
          <section>
            <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>
            <LivePortfolio 
              walletAddress={walletAddress} 
              showChart 
            />
          </section>
        )}

        {/* Market Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Price Feed */}
          <section className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Live Prices</h2>
            <LivePriceFeed 
              tokens={['SOL', 'BTC', 'ETH', 'USDC', 'USDT']} 
            />
          </section>

          {/* Order Book */}
          <section>
            <h2 className="text-xl font-bold mb-4">Order Book</h2>
            <LiveOrderBook token={selectedToken} />
          </section>

          {/* Recent Trades */}
          <section>
            <h2 className="text-xl font-bold mb-4">Recent Trades</h2>
            <RecentTrades token={selectedToken} />
          </section>
        </div>

        {/* Activity Feed */}
        <section>
          <h2 className="text-xl font-bold mb-4">Live Activity</h2>
          <LiveActivityFeed maxItems={20} showFilters />
        </section>
      </div>
    </div>
  );
}

