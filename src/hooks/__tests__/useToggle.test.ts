/**
 * useToggle hook tests
 */

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useToggle } from '../core/useToggle';

describe('useToggle', () => {
  describe('initialization', () => {
    it('should default to false', () => {
      const { result } = renderHook(() => useToggle());

      expect(result.current[0]).toBe(false);
    });

    it('should accept initial value of true', () => {
      const { result } = renderHook(() => useToggle(true));

      expect(result.current[0]).toBe(true);
    });

    it('should accept initial value of false', () => {
      const { result } = renderHook(() => useToggle(false));

      expect(result.current[0]).toBe(false);
    });
  });

  describe('toggle function', () => {
    it('should toggle from false to true', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(true);
    });

    it('should toggle from true to false', () => {
      const { result } = renderHook(() => useToggle(true));

      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe(true);
    });
  });

  describe('setTrue function', () => {
    it('should set value to true when false', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe(true);
    });

    it('should keep value true when already true', () => {
      const { result } = renderHook(() => useToggle(true));

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe(true);
    });
  });

  describe('setFalse function', () => {
    it('should set value to false when true', () => {
      const { result } = renderHook(() => useToggle(true));

      act(() => {
        result.current[3]();
      });

      expect(result.current[0]).toBe(false);
    });

    it('should keep value false when already false', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        result.current[3]();
      });

      expect(result.current[0]).toBe(false);
    });
  });

  describe('setValue function', () => {
    it('should set specific value', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        result.current[4](true);
      });

      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[4](false);
      });

      expect(result.current[0]).toBe(false);
    });
  });

  describe('function stability', () => {
    it('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(() => useToggle(false));

      const initialToggle = result.current[1];
      const initialSetTrue = result.current[2];
      const initialSetFalse = result.current[3];
      const initialSetValue = result.current[4];

      rerender();

      expect(result.current[1]).toBe(initialToggle);
      expect(result.current[2]).toBe(initialSetTrue);
      expect(result.current[3]).toBe(initialSetFalse);
      expect(result.current[4]).toBe(initialSetValue);
    });
  });
});

