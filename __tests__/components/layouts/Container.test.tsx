/**
 * Container component tests
 */

import { render, screen } from '@testing-library/react';

import { Container } from '@/components/layouts/Container';

describe('Container', () => {
  test('renders children', () => {
    render(
      <Container>
        <div>Test Content</div>
      </Container>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies size classes', () => {
    const { container } = render(
      <Container size="sm">
        <div>Content</div>
      </Container>
    );

    expect(container.firstChild).toHaveClass('max-w-2xl');
  });

  test('applies custom className', () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Content</div>
      </Container>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
