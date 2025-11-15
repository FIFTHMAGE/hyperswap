/**
 * Pagination component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Pagination } from '@/components/ui/Pagination';

describe('Pagination', () => {
  const onPageChange = jest.fn();

  beforeEach(() => {
    onPageChange.mockClear();
  });

  test('renders page numbers', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('disables previous on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  test('disables next on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  test('calls onPageChange when clicking page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('shows ellipsis for large page counts', () => {
    render(<Pagination currentPage={5} totalPages={20} onPageChange={onPageChange} />);
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
  });
});
