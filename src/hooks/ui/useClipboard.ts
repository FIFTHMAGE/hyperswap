/**
 * useClipboard hook - Clipboard operations
 * @module hooks/ui
 */

import { useState, useCallback } from 'react';

export function useClipboard(timeout = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, timeout);

        return true;
      } catch {
        setIsCopied(false);
        return false;
      }
    },
    [timeout]
  );

  return { isCopied, copy };
}
