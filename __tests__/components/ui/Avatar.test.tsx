/**
 * Avatar component tests
 */

import { render, screen } from '@testing-library/react';

import { Avatar } from '@/components/ui/Avatar';

describe('Avatar', () => {
  test('renders with image', () => {
    render(<Avatar src="/test.jpg" alt="Test User" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/test.jpg');
  });

  test('shows fallback when no src', () => {
    render(<Avatar alt="John Doe" fallback={<span>JD</span>} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('shows first letter when no fallback', () => {
    render(<Avatar alt="Alice" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  test('applies size classes', () => {
    const { container } = render(<Avatar alt="Test" size="lg" />);
    expect(container.firstChild).toHaveClass('w-12', 'h-12');
  });
});
