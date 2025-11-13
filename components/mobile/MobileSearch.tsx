/**
 * Mobile Search Component
 * Touch-optimized search with filters and recent searches
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  category?: string;
}

interface MobileSearchProps {
  placeholder?: string;
  onSearch: (query: string) => Promise<SearchResult[]>;
  onSelect: (result: SearchResult) => void;
  showRecent?: boolean;
  categories?: string[];
}

export function MobileSearch({
  placeholder = 'Search tokens...',
  onSearch,
  onSelect,
  showRecent = true,
  categories = [],
}: MobileSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent-searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Perform search
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsSearching(true);
      onSearch(debouncedQuery)
        .then(setResults)
        .finally(() => setIsSearching(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery, onSearch]);

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 10);
    
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  const handleSelect = (result: SearchResult) => {
    saveRecentSearch(query);
    onSelect(result);
    setQuery('');
    setResults([]);
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  const filteredResults = selectedCategory
    ? results.filter(r => r.category === selectedCategory)
    : results;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 safe-area-top">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 active:scale-95 transition-transform"
          >
            ←
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 pl-12 pr-4 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              🔍
            </span>
            
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 active:scale-95"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Searching...</p>
          </div>
        ) : query && filteredResults.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500">No results found for "{query}"</p>
          </div>
        ) : query && filteredResults.length > 0 ? (
          <div>
            <div className="p-4 text-sm text-gray-500">
              {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
            </div>
            <div className="divide-y divide-gray-100">
              {filteredResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full px-4 py-4 flex items-center gap-3 active:bg-gray-50 transition-colors"
                >
                  {result.icon && (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                      {result.icon}
                    </div>
                  )}
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium truncate">{result.title}</div>
                    {result.subtitle && (
                      <div className="text-sm text-gray-500 truncate">{result.subtitle}</div>
                    )}
                  </div>
                  {result.category && (
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      {result.category}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : showRecent && recentSearches.length > 0 ? (
          <div>
            <div className="p-4 flex items-center justify-between">
              <h3 className="font-medium">Recent Searches</h3>
              <button
                onClick={clearRecent}
                className="text-sm text-blue-600 active:scale-95"
              >
                Clear
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentClick(search)}
                  className="w-full px-4 py-3 flex items-center gap-3 active:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-400">🕐</span>
                  <span className="flex-1 text-left">{search}</span>
                  <span className="text-gray-400">→</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <p>Start typing to search</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact Search Bar
 */
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
}

export function SearchBar({ value, onChange, placeholder, onFocus }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder || 'Search...'}
        className="w-full px-4 py-3 pl-12 pr-10 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
        🔍
      </span>
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 active:scale-95"
        >
          ✕
        </button>
      )}
    </div>
  );
}

