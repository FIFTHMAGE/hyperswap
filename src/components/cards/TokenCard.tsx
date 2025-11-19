import React from 'react';

export const TokenCard = ({ symbol, balance }: { symbol: string; balance: string }) => (
  <div className="p-4 border rounded-lg hover:shadow-lg transition">
    <div className="text-lg font-bold">{symbol}</div>
    <div className="text-gray-600">{balance}</div>
  </div>
);
