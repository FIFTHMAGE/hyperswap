/**
 * Search input with debouncing
 * @module components/ui/Input/SearchInput
 */

'use client';

import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { styled } from 'nativewind';
import { useDebounce } from '@/hooks/core/useDebounce';
import Input from './Input';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onSearch?: (value: string) => void;
  debounceMs?: number;
  label?: string;
  fullWidth?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, debounceMs = 300, ...props }, ref) => {
    const [value, setValue] = useState('');
    const debouncedValue = useDebounce(value, debounceMs);

    // Call onSearch when debounced value changes
    React.useEffect(() => {
      onSearch?.(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...props}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default styled(SearchInput);

