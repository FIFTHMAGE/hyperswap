import React from 'react';

export interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  token?: { symbol: string; decimals: number };
  balance?: string;
  error?: string;
  onMax?: () => void;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChange,
  token,
  balance,
  error,
  onMax,
}) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.0"
          className="w-full px-4 py-3 text-2xl rounded-lg border"
        />
        {token && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-lg font-medium">
            {token.symbol}
          </div>
        )}
      </div>
      <div className="flex justify-between">
        {balance && <div className="text-sm text-gray-500">Balance: {balance}</div>}
        {onMax && balance && (
          <button onClick={onMax} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            MAX
          </button>
        )}
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
};
