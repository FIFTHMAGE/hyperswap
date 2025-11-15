/**
 * Card component tests
 */

import { render, screen } from '@testing-library/react';

import { Card } from '@/components/ui/Card';

describe('Card', () => {
  test('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('renders title', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  test('renders subtitle', () => {
    render(
      <Card title="Title" subtitle="Subtitle">
        Content
      </Card>
    );
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  test('renders footer', () => {
    render(<Card footer={<button>Action</button>}>Content</Card>);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  test('applies bordered class', () => {
    const { container } = render(<Card bordered>Content</Card>);
    expect(container.firstChild).toHaveClass('border');
  });

  test('applies hoverable class', () => {
    const { container } = render(<Card hoverable>Content</Card>);
    expect(container.firstChild).toHaveClass('hover:shadow-lg');
  });

  test('applies padding classes', () => {
    const { container, rerender } = render(<Card padding="lg">Content</Card>);
    expect(container.querySelector('.p-6')).toBeInTheDocument();

    rerender(<Card padding="sm">Content</Card>);
    expect(container.querySelector('.p-3')).toBeInTheDocument();
  });
});
