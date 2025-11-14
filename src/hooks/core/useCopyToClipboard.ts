/**
 * Copy to clipboard hook
 * @module hooks/core/useCopyToClipboard
 */

import { useState } from 'react';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  };

  return { copied, copy };
}

