/**
 * Tag component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Tag } from '@/components/ui/Tag';

describe('Tag', () => {
  test('renders tag with text', () => {
    render(<Tag>Test Tag</Tag>);
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
  });

  test('renders close button when onClose is provided', () => {
    const handleClose = jest.fn();
    render(<Tag onClose={handleClose}>Closeable</Tag>);

    const closeButton = screen.getByRole('button', { name: /remove tag/i });
    expect(closeButton).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Tag onClose={handleClose}>Closeable</Tag>);

    const closeButton = screen.getByRole('button', { name: /remove tag/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  test('does not render close button without onClose', () => {
    render(<Tag>Not Closeable</Tag>);

    const closeButton = screen.queryByRole('button');
    expect(closeButton).not.toBeInTheDocument();
  });

  test('applies variant classes', () => {
    const { container } = render(<Tag variant="primary">Primary</Tag>);
    expect(container.firstChild).toHaveClass('bg-blue-100');
  });
});
