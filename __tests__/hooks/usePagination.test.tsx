/**
 * usePagination hook tests
 */

import { renderHook, act } from '@testing-library/react';

import { usePagination } from '@/hooks/data/usePagination';

describe('usePagination', () => {
  test('calculates pagination correctly', () => {
    const { result } = renderHook(() =>
      usePagination({
        totalItems: 100,
        itemsPerPage: 10,
      })
    );

    expect(result.current.totalPages).toBe(10);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(10);
  });

  test('navigates to next page', () => {
    const { result } = renderHook(() =>
      usePagination({
        totalItems: 100,
        itemsPerPage: 10,
      })
    );

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.startIndex).toBe(10);
  });

  test('navigates to previous page', () => {
    const { result } = renderHook(() =>
      usePagination({
        totalItems: 100,
        itemsPerPage: 10,
        initialPage: 5,
      })
    );

    act(() => {
      result.current.previousPage();
    });

    expect(result.current.currentPage).toBe(4);
  });

  test('respects page boundaries', () => {
    const { result } = renderHook(() =>
      usePagination({
        totalItems: 100,
        itemsPerPage: 10,
      })
    );

    act(() => {
      result.current.goToPage(0);
    });

    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.goToPage(20);
    });

    expect(result.current.currentPage).toBe(10);
  });
});
