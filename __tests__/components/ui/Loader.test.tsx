/**
 * Loader component tests
 */

import { render } from '@testing-library/react';

import { Loader } from '@/components/ui/Loader';

describe('Loader', () => {
  test('renders loader', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('applies size classes', () => {
    const { container } = render(<Loader size="lg" />);
    expect(container.firstChild).toHaveClass('w-12', 'h-12');
  });

  test('applies color classes', () => {
    const { container } = render(<Loader color="white" />);
    expect(container.firstChild).toHaveClass('border-white');
  });

  test('applies custom className', () => {
    const { container } = render(<Loader className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('has animation class', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass('animate-spin');
  });
});
