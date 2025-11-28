/**
 * Stack component tests
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Stack } from '../Stack';

describe('Stack', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(
        <Stack>
          <div>Item 1</div>
          <div>Item 2</div>
        </Stack>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should render as div by default', () => {
      render(<Stack data-testid="stack">Content</Stack>);

      expect(screen.getByTestId('stack').tagName).toBe('DIV');
    });

    it('should render as custom element', () => {
      render(
        <Stack as="ul" data-testid="stack">
          <li>Item</li>
        </Stack>
      );

      expect(screen.getByTestId('stack').tagName).toBe('UL');
    });

    it('should apply custom className', () => {
      render(<Stack className="custom-stack">Content</Stack>);

      expect(screen.getByText('Content').parentElement).toHaveClass('custom-stack');
    });
  });

  describe('direction', () => {
    it('should stack vertically by default', () => {
      render(<Stack data-testid="stack">Content</Stack>);

      expect(screen.getByTestId('stack')).toHaveClass('flex-col');
    });

    it('should stack horizontally', () => {
      render(
        <Stack direction="horizontal" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('flex-row');
    });

    it('should reverse vertical direction', () => {
      render(
        <Stack direction="vertical-reverse" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('flex-col-reverse');
    });

    it('should reverse horizontal direction', () => {
      render(
        <Stack direction="horizontal-reverse" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('flex-row-reverse');
    });
  });

  describe('gap', () => {
    it('should apply default gap', () => {
      render(<Stack data-testid="stack">Content</Stack>);

      expect(screen.getByTestId('stack')).toHaveClass('gap-4');
    });

    it('should apply no gap', () => {
      render(
        <Stack gap={0} data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('gap-0');
    });

    it('should apply small gap', () => {
      render(
        <Stack gap="sm" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('gap-2');
    });

    it('should apply medium gap', () => {
      render(
        <Stack gap="md" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('gap-4');
    });

    it('should apply large gap', () => {
      render(
        <Stack gap="lg" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('gap-6');
    });

    it('should apply extra large gap', () => {
      render(
        <Stack gap="xl" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('gap-8');
    });

    it('should apply custom numeric gap', () => {
      render(
        <Stack gap={3} data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('gap-3');
    });
  });

  describe('alignment', () => {
    it('should align items to start', () => {
      render(
        <Stack align="start" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('items-start');
    });

    it('should align items to center', () => {
      render(
        <Stack align="center" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('items-center');
    });

    it('should align items to end', () => {
      render(
        <Stack align="end" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('items-end');
    });

    it('should stretch items', () => {
      render(
        <Stack align="stretch" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('items-stretch');
    });
  });

  describe('justify', () => {
    it('should justify content to start', () => {
      render(
        <Stack justify="start" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('justify-start');
    });

    it('should justify content to center', () => {
      render(
        <Stack justify="center" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('justify-center');
    });

    it('should justify content to end', () => {
      render(
        <Stack justify="end" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('justify-end');
    });

    it('should justify content with space-between', () => {
      render(
        <Stack justify="between" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('justify-between');
    });

    it('should justify content with space-around', () => {
      render(
        <Stack justify="around" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('justify-around');
    });

    it('should justify content with space-evenly', () => {
      render(
        <Stack justify="evenly" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('justify-evenly');
    });
  });

  describe('wrap', () => {
    it('should not wrap by default', () => {
      render(<Stack data-testid="stack">Content</Stack>);

      expect(screen.getByTestId('stack')).not.toHaveClass('flex-wrap');
    });

    it('should wrap when wrap is true', () => {
      render(
        <Stack wrap data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('flex-wrap');
    });

    it('should wrap reverse', () => {
      render(
        <Stack wrap="reverse" data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('flex-wrap-reverse');
    });
  });

  describe('divider', () => {
    it('should render dividers between items', () => {
      render(
        <Stack divider={<hr data-testid="divider" />}>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </Stack>
      );

      expect(screen.getAllByTestId('divider')).toHaveLength(2);
    });
  });

  describe('fullWidth', () => {
    it('should apply full width', () => {
      render(
        <Stack fullWidth data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('w-full');
    });
  });

  describe('fullHeight', () => {
    it('should apply full height', () => {
      render(
        <Stack fullHeight data-testid="stack">
          Content
        </Stack>
      );

      expect(screen.getByTestId('stack')).toHaveClass('h-full');
    });
  });
});

