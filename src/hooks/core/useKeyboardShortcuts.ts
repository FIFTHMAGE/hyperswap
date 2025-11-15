'use client';

import { useEffect } from 'react';

interface ShortcutHandlers {
  onNext?: () => void;
  onPrevious?: () => void;
  onEscape?: () => void;
  onShare?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
          handlers.onNext?.();
          break;
        case 'ArrowLeft':
          handlers.onPrevious?.();
          break;
        case 'Escape':
          handlers.onEscape?.();
          break;
        case 's':
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            handlers.onShare?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

