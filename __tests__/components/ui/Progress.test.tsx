/**
 * Progress component tests
 */

import { render, screen } from '@testing-library/react';

import { Progress } from '@/components/ui/Progress';

describe('Progress', () => {
  test('renders progress bar', () => {
    const { container } = render(<Progress value={50} />);
    expect(container.querySelector('[style*="width: 50%"]')).toBeInTheDocument();
  });

  test('clamps value between 0 and 100', () => {
    const { container } = render(<Progress value={150} />);
    expect(container.querySelector('[style*="width: 100%"]')).toBeInTheDocument();
  });

  test('shows label when enabled', () => {
    render(<Progress value={75} showLabel />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('applies variant styles', () => {
    const { container } = render(<Progress value={50} variant="success" />);
    expect(container.querySelector('.bg-green-600')).toBeInTheDocument();
  });
});
