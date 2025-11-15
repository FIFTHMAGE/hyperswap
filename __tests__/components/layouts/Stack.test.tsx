/**
 * Stack component tests
 */

import { render, screen } from '@testing-library/react';

import { Stack } from '@/components/layouts/Stack';

describe('Stack', () => {
  test('renders children', () => {
    render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('applies horizontal direction', () => {
    const { container } = render(
      <Stack direction="horizontal">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );

    expect(container.firstChild).toHaveClass('flex-row');
  });

  test('applies vertical direction', () => {
    const { container } = render(
      <Stack direction="vertical">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );

    expect(container.firstChild).toHaveClass('flex-col');
  });
});
