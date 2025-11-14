/**
 * Token list with search and favorites
 * @module components/swap/TokenList
 */

'use client';

import { styled } from 'nativewind';
import { Spinner } from '../ui';
import { useFavoriteTokens } from '@/hooks/domain/useFavoriteTokens';
import type { ERC20Token } from '@/types/token';

interface TokenListProps {
  tokens: ERC20Token[];
  onSelect: (tokenAddress: string) => void;
  loading?: boolean;
}

const TokenList: React.FC<TokenListProps> = ({
  tokens,
  onSelect,
  loading = false,
}) => {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoriteTokens();

  const toggleFavorite = (token: ERC20Token) => {
    if (isFavorite(token.chainId, token.address)) {
      removeFavorite(token.chainId, token.address);
    } else {
      addFavorite({
        chainId: token.chainId,
        address: token.address,
        symbol: token.symbol,
        name: token.name,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-1">
      {tokens.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tokens found
        </div>
      ) : (
        tokens.map((token) => (
          <button
            key={`${token.chainId}-${token.address}`}
            onClick={() => onSelect(token.address)}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              {token.logoURI && (
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="text-left">
                <div className="font-medium">{token.symbol}</div>
                <div className="text-sm text-gray-600">{token.name}</div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(token);
              }}
              className="text-xl"
            >
              {isFavorite(token.chainId, token.address) ? '⭐' : '☆'}
            </button>
          </button>
        ))
      )}
    </div>
  );
};

export default styled(TokenList);

