/**
 * Token input component for swap
 * @module components/swap/TokenInput
 */

'use client';

import { styled } from 'nativewind';
import { NumberInput } from '../ui';

interface TokenInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  token?: string;
  onTokenSelect: (token: string) => void;
  balance: string;
  readOnly?: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({
  label,
  value,
  onChange,
  token,
  onTokenSelect,
  balance,
  readOnly = false,
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm text-gray-600">Balance: {balance}</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onTokenSelect(token || '')}
          className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
        >
          {token ? (
            <>
              <span className="font-medium">{token}</span>
              <span className="text-gray-400">▼</span>
            </>
          ) : (
            <span className="text-gray-500">Select token</span>
          )}
        </button>

        <NumberInput
          value={value}
          onChange={onChange}
          placeholder="0.0"
          className="flex-1 text-right text-2xl font-medium"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default styled(TokenInput);

