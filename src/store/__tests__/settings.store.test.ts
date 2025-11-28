/**
 * Settings store tests
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSettingsStore } from '../settings.store';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useSettingsStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    const { result } = renderHook(() => useSettingsStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.theme).toBe('system');
      expect(result.current.currency).toBe('USD');
      expect(result.current.language).toBe('en');
      expect(result.current.slippage).toBe(0.5);
      expect(result.current.deadline).toBe(20);
      expect(result.current.expertMode).toBe(false);
      expect(result.current.soundEnabled).toBe(true);
    });
  });

  describe('setTheme', () => {
    it('should set theme to light', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
    });

    it('should set theme to dark', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should set theme to system', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('dark');
      });

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
    });
  });

  describe('setCurrency', () => {
    it('should set currency', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setCurrency('EUR');
      });

      expect(result.current.currency).toBe('EUR');
    });

    it('should set currency to different values', () => {
      const { result } = renderHook(() => useSettingsStore());

      const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];
      currencies.forEach((currency) => {
        act(() => {
          result.current.setCurrency(currency);
        });
        expect(result.current.currency).toBe(currency);
      });
    });
  });

  describe('setLanguage', () => {
    it('should set language', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setLanguage('es');
      });

      expect(result.current.language).toBe('es');
    });

    it('should set language to different values', () => {
      const { result } = renderHook(() => useSettingsStore());

      const languages = ['en', 'es', 'fr', 'de', 'zh'];
      languages.forEach((language) => {
        act(() => {
          result.current.setLanguage(language);
        });
        expect(result.current.language).toBe(language);
      });
    });
  });

  describe('setSlippage', () => {
    it('should set slippage', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setSlippage(1.0);
      });

      expect(result.current.slippage).toBe(1.0);
    });

    it('should set custom slippage values', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setSlippage(0.1);
      });
      expect(result.current.slippage).toBe(0.1);

      act(() => {
        result.current.setSlippage(5.0);
      });
      expect(result.current.slippage).toBe(5.0);
    });
  });

  describe('setDeadline', () => {
    it('should set deadline', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setDeadline(30);
      });

      expect(result.current.deadline).toBe(30);
    });

    it('should set different deadline values', () => {
      const { result } = renderHook(() => useSettingsStore());

      const deadlines = [10, 20, 30, 60];
      deadlines.forEach((deadline) => {
        act(() => {
          result.current.setDeadline(deadline);
        });
        expect(result.current.deadline).toBe(deadline);
      });
    });
  });

  describe('toggleExpertMode', () => {
    it('should toggle expert mode on', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.expertMode).toBe(false);

      act(() => {
        result.current.toggleExpertMode();
      });

      expect(result.current.expertMode).toBe(true);
    });

    it('should toggle expert mode off', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.toggleExpertMode();
      });

      expect(result.current.expertMode).toBe(true);

      act(() => {
        result.current.toggleExpertMode();
      });

      expect(result.current.expertMode).toBe(false);
    });

    it('should toggle expert mode multiple times', () => {
      const { result } = renderHook(() => useSettingsStore());

      for (let i = 0; i < 5; i++) {
        const expectedValue = i % 2 === 0;

        act(() => {
          result.current.toggleExpertMode();
        });

        expect(result.current.expertMode).toBe(!expectedValue);
      }
    });
  });

  describe('toggleSound', () => {
    it('should toggle sound off', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.soundEnabled).toBe(true);

      act(() => {
        result.current.toggleSound();
      });

      expect(result.current.soundEnabled).toBe(false);
    });

    it('should toggle sound on', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.toggleSound();
      });

      expect(result.current.soundEnabled).toBe(false);

      act(() => {
        result.current.toggleSound();
      });

      expect(result.current.soundEnabled).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset all settings to defaults', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('dark');
        result.current.setCurrency('EUR');
        result.current.setLanguage('es');
        result.current.setSlippage(2.0);
        result.current.setDeadline(30);
        result.current.toggleExpertMode();
        result.current.toggleSound();
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.theme).toBe('system');
      expect(result.current.currency).toBe('USD');
      expect(result.current.language).toBe('en');
      expect(result.current.slippage).toBe(0.5);
      expect(result.current.deadline).toBe(20);
      expect(result.current.expertMode).toBe(false);
      expect(result.current.soundEnabled).toBe(true);
    });
  });

  describe('persistence', () => {
    it('should persist settings to localStorage', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
});

