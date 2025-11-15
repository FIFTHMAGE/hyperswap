/**
 * Tooltip component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Tooltip } from '@/components/ui/Tooltip';

describe('Tooltip', () => {
  test('renders children', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  test('shows tooltip on hover', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
  });

  test('hides tooltip on mouse leave', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);

    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  test('applies position classes', () => {
    const { container } = render(
      <Tooltip content="Tooltip content" position="bottom">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = container.querySelector('button')!;
    fireEvent.mouseEnter(button);

    const tooltip = screen.getByText('Tooltip content');
    expect(tooltip).toHaveClass('top-full');
  });
});
