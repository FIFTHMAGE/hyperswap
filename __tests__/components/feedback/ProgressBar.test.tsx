/**
 * ProgressBar component tests
 */

import { render, screen } from '@testing-library/react';

import { ProgressBar } from '@/components/feedback/ProgressBar';

describe('ProgressBar', () => {
  test('renders progress bar', () => {
    const { container } = render(<ProgressBar progress={50} />);
    expect(container.querySelector('[style*="width: 50%"]')).toBeInTheDocument();
  });

  test('clamps progress to 0-100', () => {
    const { container } = render(<ProgressBar progress={150} />);
    const bar = container.querySelector('[style*="width"]');
    expect(bar).toHaveStyle({ width: '100%' });
  });

  test('shows label when enabled', () => {
    render(<ProgressBar progress={75} showLabel animated={false} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('applies color classes', () => {
    const { container } = render(<ProgressBar progress={50} color="green" />);
    expect(container.querySelector('.bg-green-600')).toBeInTheDocument();
  });
});
