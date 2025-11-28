/**
 * Flex component tests
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Flex } from '../Flex';

describe('Flex', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(
        <Flex>
          <div>Item 1</div>
          <div>Item 2</div>
        </Flex>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should apply flex display', () => {
      render(<Flex data-testid="flex">Content</Flex>);

      expect(screen.getByTestId('flex')).toHaveClass('flex');
    });

    it('should apply inline flex when inline is true', () => {
      render(
        <Flex inline data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('inline-flex');
    });

    it('should apply custom className', () => {
      render(<Flex className="custom-class" data-testid="flex">Content</Flex>);

      expect(screen.getByTestId('flex')).toHaveClass('custom-class');
    });

    it('should render as custom element', () => {
      render(
        <Flex as="nav" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex').tagName).toBe('NAV');
    });
  });

  describe('direction', () => {
    it('should apply row direction by default', () => {
      render(<Flex data-testid="flex">Content</Flex>);

      expect(screen.getByTestId('flex')).toHaveClass('flex-row');
    });

    it('should apply column direction', () => {
      render(
        <Flex direction="column" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('flex-col');
    });

    it('should apply row reverse direction', () => {
      render(
        <Flex direction="row-reverse" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('flex-row-reverse');
    });

    it('should apply column reverse direction', () => {
      render(
        <Flex direction="column-reverse" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('flex-col-reverse');
    });
  });

  describe('wrap', () => {
    it('should not wrap by default', () => {
      render(<Flex data-testid="flex">Content</Flex>);

      expect(screen.getByTestId('flex')).toHaveClass('flex-nowrap');
    });

    it('should wrap when wrap is true', () => {
      render(
        <Flex wrap data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('flex-wrap');
    });

    it('should wrap reverse', () => {
      render(
        <Flex wrap="reverse" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('flex-wrap-reverse');
    });
  });

  describe('justify', () => {
    it('should justify start', () => {
      render(
        <Flex justify="start" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('justify-start');
    });

    it('should justify center', () => {
      render(
        <Flex justify="center" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('justify-center');
    });

    it('should justify end', () => {
      render(
        <Flex justify="end" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('justify-end');
    });

    it('should justify space-between', () => {
      render(
        <Flex justify="between" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('justify-between');
    });

    it('should justify space-around', () => {
      render(
        <Flex justify="around" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('justify-around');
    });

    it('should justify space-evenly', () => {
      render(
        <Flex justify="evenly" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('justify-evenly');
    });
  });

  describe('align', () => {
    it('should align stretch by default', () => {
      render(<Flex data-testid="flex">Content</Flex>);

      expect(screen.getByTestId('flex')).toHaveClass('items-stretch');
    });

    it('should align start', () => {
      render(
        <Flex align="start" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('items-start');
    });

    it('should align center', () => {
      render(
        <Flex align="center" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('items-center');
    });

    it('should align end', () => {
      render(
        <Flex align="end" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('items-end');
    });

    it('should align baseline', () => {
      render(
        <Flex align="baseline" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('items-baseline');
    });
  });

  describe('gap', () => {
    it('should apply gap', () => {
      render(
        <Flex gap={4} data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('gap-4');
    });

    it('should apply small gap', () => {
      render(
        <Flex gap="sm" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('gap-2');
    });

    it('should apply medium gap', () => {
      render(
        <Flex gap="md" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('gap-4');
    });

    it('should apply large gap', () => {
      render(
        <Flex gap="lg" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('gap-6');
    });

    it('should apply different row and column gaps', () => {
      render(
        <Flex gapX={2} gapY={4} data-testid="flex">
          Content
        </Flex>
      );

      const flex = screen.getByTestId('flex');
      expect(flex).toHaveClass('gap-x-2');
      expect(flex).toHaveClass('gap-y-4');
    });
  });

  describe('grow and shrink', () => {
    it('should apply flex grow', () => {
      render(
        <Flex grow data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('flex-grow');
    });

    it('should prevent flex grow', () => {
      render(
        <Flex grow={false} data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('flex-grow-0');
    });

    it('should apply flex shrink', () => {
      render(
        <Flex shrink data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('flex-shrink');
    });

    it('should prevent flex shrink', () => {
      render(
        <Flex shrink={false} data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('flex-shrink-0');
    });
  });

  describe('basis', () => {
    it('should apply auto basis', () => {
      render(
        <Flex basis="auto" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('basis-auto');
    });

    it('should apply full basis', () => {
      render(
        <Flex basis="full" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('basis-full');
    });

    it('should apply numeric basis', () => {
      render(
        <Flex basis="1/2" data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('basis-1/2');
    });
  });

  describe('center helper', () => {
    it('should center children both ways when center is true', () => {
      render(
        <Flex center data-testid="flex">
          Content
        </Flex>
      );

      const flex = screen.getByTestId('flex');
      expect(flex).toHaveClass('justify-center');
      expect(flex).toHaveClass('items-center');
    });
  });

  describe('full dimensions', () => {
    it('should apply full width', () => {
      render(
        <Flex fullWidth data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('w-full');
    });

    it('should apply full height', () => {
      render(
        <Flex fullHeight data-testid="flex">
          Content
        </Flex>
      );

      expect(screen.getByTestId('flex')).toHaveClass('h-full');
    });
  });

  describe('responsive', () => {
    it('should apply responsive direction', () => {
      render(
        <Flex direction={{ base: 'column', md: 'row' }} data-testid="flex">
          Content
        </Flex>
      );

      const flex = screen.getByTestId('flex');
      expect(flex).toHaveClass('flex-col');
      expect(flex).toHaveClass('md:flex-row');
    });

    it('should apply responsive gap', () => {
      render(
        <Flex gap={{ base: 2, md: 4, lg: 6 }} data-testid="flex">
          Content
        </Flex>
      );

      const flex = screen.getByTestId('flex');
      expect(flex).toHaveClass('gap-2');
      expect(flex).toHaveClass('md:gap-4');
      expect(flex).toHaveClass('lg:gap-6');
    });
  });
});

