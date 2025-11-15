/**
 * Clipboard hook for copy functionality
 */

import { useState, useCallback } from 'react';

export interface UseClipboardReturn {
  value: string | null;
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
  reset: () => void;
}

export function useClipboard(timeout: number = 2000): UseClipboardReturn {
  const [value, setValue] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not available');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setValue(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
      }
    },
    [timeout]
  );

  const reset = useCallback(() => {
    setValue(null);
    setCopied(false);
  }, []);

  return { value, copy, copied, reset };
}

