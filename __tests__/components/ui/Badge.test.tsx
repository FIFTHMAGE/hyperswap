/**
 * Badge component tests
 */

import { render, screen } from '@testing-library/react';

import { Badge } from '@/components/ui/Badge';

describe('Badge', () => {
  test('renders badge with text', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  test('applies variant classes', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(container.firstChild).toHaveClass('bg-green-100');
  });

  test('applies size classes', () => {
    const { container } = render(<Badge size="lg">Large</Badge>);
    expect(container.firstChild).toHaveClass('text-base');
  });

  test('applies rounded class', () => {
    const { container } = render(<Badge rounded>Rounded</Badge>);
    expect(container.firstChild).toHaveClass('rounded-full');
  });
});
