/**
 * useOnClickOutside hook tests
 */

import { renderHook } from '@testing-library/react';

import { useOnClickOutside } from '@/hooks/core/useOnClickOutside';

describe('useOnClickOutside', () => {
  test('calls handler when clicking outside', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useOnClickOutside(ref, handler));

    const event = new MouseEvent('mousedown', { bubbles: true });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalled();
  });

  test('does not call handler when clicking inside', () => {
    const handler = jest.fn();
    const element = document.createElement('div');
    const ref = { current: element };

    renderHook(() => useOnClickOutside(ref, handler));

    const event = new MouseEvent('mousedown', { bubbles: true });
    element.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });
});
