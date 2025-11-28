/**
 * Grid component tests
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Grid } from '../Grid';

describe('Grid', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(
        <Grid>
          <div>Item 1</div>
          <div>Item 2</div>
        </Grid>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Grid className="custom-grid" data-testid="grid">Content</Grid>);

      expect(screen.getByTestId('grid')).toHaveClass('custom-grid');
    });

    it('should render as custom element', () => {
      render(
        <Grid as="ul" data-testid="grid">
          <li>Item</li>
        </Grid>
      );

      expect(screen.getByTestId('grid').tagName).toBe('UL');
    });
  });

  describe('columns', () => {
    it('should apply default columns', () => {
      render(<Grid data-testid="grid">Content</Grid>);

      expect(screen.getByTestId('grid')).toHaveClass('grid-cols-1');
    });

    it('should apply 2 columns', () => {
      render(
        <Grid cols={2} data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('grid-cols-2');
    });

    it('should apply 3 columns', () => {
      render(
        <Grid cols={3} data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('grid-cols-3');
    });

    it('should apply 4 columns', () => {
      render(
        <Grid cols={4} data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('grid-cols-4');
    });

    it('should apply 12 columns', () => {
      render(
        <Grid cols={12} data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('grid-cols-12');
    });
  });

  describe('responsive columns', () => {
    it('should apply responsive column classes', () => {
      render(
        <Grid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} data-testid="grid">
          Content
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('sm:grid-cols-2');
      expect(grid).toHaveClass('md:grid-cols-3');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });
  });

  describe('rows', () => {
    it('should apply row count', () => {
      render(
        <Grid rows={3} data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('grid-rows-3');
    });
  });

  describe('gap', () => {
    it('should apply default gap', () => {
      render(<Grid data-testid="grid">Content</Grid>);

      expect(screen.getByTestId('grid')).toHaveClass('gap-4');
    });

    it('should apply no gap', () => {
      render(
        <Grid gap={0} data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('gap-0');
    });

    it('should apply small gap', () => {
      render(
        <Grid gap="sm" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('gap-2');
    });

    it('should apply large gap', () => {
      render(
        <Grid gap="lg" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('gap-6');
    });

    it('should apply different row and column gaps', () => {
      render(
        <Grid gapX={4} gapY={8} data-testid="grid">
          Content
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('gap-x-4');
      expect(grid).toHaveClass('gap-y-8');
    });
  });

  describe('flow', () => {
    it('should flow by row by default', () => {
      render(<Grid data-testid="grid">Content</Grid>);

      expect(screen.getByTestId('grid')).toHaveClass('grid-flow-row');
    });

    it('should flow by column', () => {
      render(
        <Grid flow="col" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('grid-flow-col');
    });

    it('should flow by row dense', () => {
      render(
        <Grid flow="row-dense" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('grid-flow-row-dense');
    });

    it('should flow by column dense', () => {
      render(
        <Grid flow="col-dense" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('grid-flow-col-dense');
    });
  });

  describe('alignment', () => {
    it('should align items to start', () => {
      render(
        <Grid alignItems="start" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('items-start');
    });

    it('should align items to center', () => {
      render(
        <Grid alignItems="center" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('items-center');
    });

    it('should align items to end', () => {
      render(
        <Grid alignItems="end" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('items-end');
    });
  });

  describe('justify', () => {
    it('should justify items to start', () => {
      render(
        <Grid justifyItems="start" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('justify-items-start');
    });

    it('should justify items to center', () => {
      render(
        <Grid justifyItems="center" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('justify-items-center');
    });

    it('should justify items to end', () => {
      render(
        <Grid justifyItems="end" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('justify-items-end');
    });
  });

  describe('place', () => {
    it('should place items center', () => {
      render(
        <Grid placeItems="center" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('place-items-center');
    });
  });

  describe('auto columns', () => {
    it('should apply auto columns', () => {
      render(
        <Grid autoCols="min" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('auto-cols-min');
    });

    it('should apply auto rows', () => {
      render(
        <Grid autoRows="max" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('auto-rows-max');
    });
  });

  describe('template', () => {
    it('should apply custom template', () => {
      render(
        <Grid template="repeat(3, 1fr)" data-testid="grid">
          Content
        </Grid>
      );

      expect(screen.getByTestId('grid')).toHaveStyle({
        gridTemplateColumns: 'repeat(3, 1fr)',
      });
    });
  });
});

describe('Grid.Item', () => {
  describe('rendering', () => {
    it('should render grid item', () => {
      render(
        <Grid>
          <Grid.Item>Item content</Grid.Item>
        </Grid>
      );

      expect(screen.getByText('Item content')).toBeInTheDocument();
    });
  });

  describe('span', () => {
    it('should span columns', () => {
      render(
        <Grid>
          <Grid.Item colSpan={2} data-testid="item">
            Content
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByTestId('item')).toHaveClass('col-span-2');
    });

    it('should span rows', () => {
      render(
        <Grid>
          <Grid.Item rowSpan={3} data-testid="item">
            Content
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByTestId('item')).toHaveClass('row-span-3');
    });

    it('should span full width', () => {
      render(
        <Grid>
          <Grid.Item colSpan="full" data-testid="item">
            Content
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByTestId('item')).toHaveClass('col-span-full');
    });
  });

  describe('start/end', () => {
    it('should set column start', () => {
      render(
        <Grid>
          <Grid.Item colStart={2} data-testid="item">
            Content
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByTestId('item')).toHaveClass('col-start-2');
    });

    it('should set column end', () => {
      render(
        <Grid>
          <Grid.Item colEnd={4} data-testid="item">
            Content
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByTestId('item')).toHaveClass('col-end-4');
    });

    it('should set row start', () => {
      render(
        <Grid>
          <Grid.Item rowStart={1} data-testid="item">
            Content
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByTestId('item')).toHaveClass('row-start-1');
    });

    it('should set row end', () => {
      render(
        <Grid>
          <Grid.Item rowEnd={3} data-testid="item">
            Content
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByTestId('item')).toHaveClass('row-end-3');
    });
  });

  describe('self alignment', () => {
    it('should align self', () => {
      render(
        <Grid>
          <Grid.Item alignSelf="center" data-testid="item">
            Content
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByTestId('item')).toHaveClass('self-center');
    });

    it('should justify self', () => {
      render(
        <Grid>
          <Grid.Item justifySelf="end" data-testid="item">
            Content
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByTestId('item')).toHaveClass('justify-self-end');
    });

    it('should place self', () => {
      render(
        <Grid>
          <Grid.Item placeSelf="center" data-testid="item">
            Content
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByTestId('item')).toHaveClass('place-self-center');
    });
  });
});

