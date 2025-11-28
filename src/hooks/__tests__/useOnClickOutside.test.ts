/**
 * useOnClickOutside hook tests
 */

import { fireEvent, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useOnClickOutside } from '../core/useOnClickOutside';

describe('useOnClickOutside', () => {
  let container: HTMLDivElement;
  let elementRef: { current: HTMLDivElement | null };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    const element = document.createElement('div');
    element.setAttribute('data-testid', 'inside');
    container.appendChild(element);

    elementRef = { current: element };
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  describe('click detection', () => {
    it('should call handler when clicking outside', () => {
      const handler = vi.fn();

      renderHook(() => useOnClickOutside(elementRef, handler));

      fireEvent.mouseDown(document.body);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not call handler when clicking inside', () => {
      const handler = vi.fn();

      renderHook(() => useOnClickOutside(elementRef, handler));

      fireEvent.mouseDown(elementRef.current!);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should not call handler when clicking on element children', () => {
      const handler = vi.fn();
      const child = document.createElement('span');
      elementRef.current!.appendChild(child);

      renderHook(() => useOnClickOutside(elementRef, handler));

      fireEvent.mouseDown(child);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('touch detection', () => {
    it('should call handler on touch outside', () => {
      const handler = vi.fn();

      renderHook(() => useOnClickOutside(elementRef, handler));

      fireEvent.touchStart(document.body);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not call handler on touch inside', () => {
      const handler = vi.fn();

      renderHook(() => useOnClickOutside(elementRef, handler));

      fireEvent.touchStart(elementRef.current!);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('handler updates', () => {
    it('should use latest handler', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const { rerender } = renderHook(
        ({ handler }) => useOnClickOutside(elementRef, handler),
        { initialProps: { handler: handler1 } }
      );

      rerender({ handler: handler2 });

      fireEvent.mouseDown(document.body);

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledTimes(1);
    });
  });

  describe('ref changes', () => {
    it('should handle ref changes', () => {
      const handler = vi.fn();
      const newElement = document.createElement('div');
      container.appendChild(newElement);

      const { rerender } = renderHook(
        ({ ref }) => useOnClickOutside(ref, handler),
        { initialProps: { ref: elementRef } }
      );

      const newRef = { current: newElement };
      rerender({ ref: newRef });

      // Click on old element (now outside)
      fireEvent.mouseDown(elementRef.current!);

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('null ref', () => {
    it('should handle null ref gracefully', () => {
      const handler = vi.fn();
      const nullRef = { current: null };

      renderHook(() => useOnClickOutside(nullRef, handler));

      fireEvent.mouseDown(document.body);

      // Should not throw and should still call handler
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const handler = vi.fn();
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useOnClickOutside(elementRef, handler)
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });

    it('should not call handler after unmount', () => {
      const handler = vi.fn();

      const { unmount } = renderHook(() =>
        useOnClickOutside(elementRef, handler)
      );

      unmount();

      fireEvent.mouseDown(document.body);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('multiple refs', () => {
    it('should work with multiple elements', () => {
      const handler = vi.fn();
      const element2 = document.createElement('div');
      container.appendChild(element2);
      const ref2 = { current: element2 };

      renderHook(() => useOnClickOutside([elementRef, ref2], handler));

      // Click inside first element
      fireEvent.mouseDown(elementRef.current!);
      expect(handler).not.toHaveBeenCalled();

      // Click inside second element
      fireEvent.mouseDown(ref2.current!);
      expect(handler).not.toHaveBeenCalled();

      // Click outside both
      fireEvent.mouseDown(document.body);
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('event object', () => {
    it('should pass event to handler', () => {
      const handler = vi.fn();

      renderHook(() => useOnClickOutside(elementRef, handler));

      fireEvent.mouseDown(document.body);

      expect(handler).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});

