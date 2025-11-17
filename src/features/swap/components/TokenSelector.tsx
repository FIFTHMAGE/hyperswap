/**
 * Token selector modal
 * @module components/swap/TokenSelector
 */

'use client';

import { styled } from 'nativewind';
import { useState } from 'react';

import { useChain } from '@/hooks/core/useChainId';
import { useTokenSearch } from '@/hooks/domain/useTokenSearch';

import { Modal, ModalHeader, ModalBody, SearchInput } from '../ui';

import TokenList from './TokenList';

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tokenAddress: string) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  const { chainId } = useChain();
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading } = useTokenSearch(chainId, searchQuery);

  const handleSelect = (tokenAddress: string) => {
    onSelect(tokenAddress);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader onClose={onClose}>Select Token</ModalHeader>
      <ModalBody>
        <SearchInput
          placeholder="Search by name or address..."
          onSearch={setSearchQuery}
          fullWidth
        />

        <TokenList tokens={results} onSelect={handleSelect} loading={loading} />
      </ModalBody>
    </Modal>
  );
};

export default styled(TokenSelector);
