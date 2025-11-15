/**
 * Alert component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Alert } from '@/components/ui/Alert';

describe('Alert', () => {
  test('renders alert with children', () => {
    render(<Alert>Test alert message</Alert>);
    expect(screen.getByText('Test alert message')).toBeInTheDocument();
  });

  test('renders with title', () => {
    render(<Alert title="Warning">Alert content</Alert>);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  test('applies variant styles', () => {
    const { container } = render(<Alert variant="error">Error message</Alert>);
    expect(container.firstChild).toHaveClass('bg-red-50');
  });

  test('shows close button when onClose provided', () => {
    const onClose = jest.fn();
    render(<Alert onClose={onClose}>Dismissible alert</Alert>);

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  test('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<Alert onClose={onClose}>Dismissible alert</Alert>);

    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });
});
