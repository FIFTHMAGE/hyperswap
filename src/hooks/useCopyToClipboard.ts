/**
 * useCopyToClipboard - Copy to clipboard hook
 * @module hooks
 */

import { useState } from 'react';

export function useCopyToClipboard(): [(text: string) => Promise<boolean>, boolean] {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopied(false);
      return false;
    }
  };

  return [copy, copied];
}
