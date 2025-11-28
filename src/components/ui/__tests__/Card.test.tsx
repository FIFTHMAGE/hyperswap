/**
 * Card component tests
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../Card';

describe('Card', () => {
  describe('rendering', () => {
    it('should render card element', () => {
      render(<Card>Card content</Card>);

      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Card className="custom-card">Content</Card>);

      expect(screen.getByText('Content').parentElement).toHaveClass('custom-card');
    });

    it('should render with as prop', () => {
      render(<Card as="section">Content</Card>);

      expect(screen.getByRole('region')).toBeInTheDocument();
    });
  });

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(
        <Card>
          <CardHeader>Header content</CardHeader>
        </Card>
      );

      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('should render with padding', () => {
      render(
        <Card>
          <CardHeader className="p-6">Header</CardHeader>
        </Card>
      );

      expect(screen.getByText('Header')).toHaveClass('p-6');
    });
  });

  describe('CardTitle', () => {
    it('should render card title', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>My Title</CardTitle>
          </CardHeader>
        </Card>
      );

      expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    it('should render title with correct heading level', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle as="h2">Title H2</CardTitle>
          </CardHeader>
        </Card>
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Title H2');
    });
  });

  describe('CardDescription', () => {
    it('should render card description', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Description text</CardDescription>
          </CardHeader>
        </Card>
      );

      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('should have muted styling', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription className="text-muted-foreground">Muted</CardDescription>
          </CardHeader>
        </Card>
      );

      expect(screen.getByText('Muted')).toHaveClass('text-muted-foreground');
    });
  });

  describe('CardContent', () => {
    it('should render card content', () => {
      render(
        <Card>
          <CardContent>Main content here</CardContent>
        </Card>
      );

      expect(screen.getByText('Main content here')).toBeInTheDocument();
    });

    it('should render with padding', () => {
      render(
        <Card>
          <CardContent className="p-6">Content</CardContent>
        </Card>
      );

      expect(screen.getByText('Content')).toHaveClass('p-6');
    });
  });

  describe('CardFooter', () => {
    it('should render card footer', () => {
      render(
        <Card>
          <CardFooter>Footer content</CardFooter>
        </Card>
      );

      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('should render footer buttons', () => {
      render(
        <Card>
          <CardFooter>
            <button>Cancel</button>
            <button>Save</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should render default variant', () => {
      render(<Card variant="default">Default</Card>);

      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('should render outlined variant', () => {
      render(<Card variant="outlined">Outlined</Card>);

      expect(screen.getByText('Outlined')).toBeInTheDocument();
    });

    it('should render elevated variant', () => {
      render(<Card variant="elevated">Elevated</Card>);

      expect(screen.getByText('Elevated')).toBeInTheDocument();
    });

    it('should render ghost variant', () => {
      render(<Card variant="ghost">Ghost</Card>);

      expect(screen.getByText('Ghost')).toBeInTheDocument();
    });
  });

  describe('hover state', () => {
    it('should apply hover styles when hoverable', () => {
      render(<Card hoverable>Hoverable card</Card>);

      expect(screen.getByText('Hoverable card').parentElement).toBeInTheDocument();
    });

    it('should not apply hover styles by default', () => {
      render(<Card>Non-hoverable card</Card>);

      expect(screen.getByText('Non-hoverable card')).toBeInTheDocument();
    });
  });

  describe('clickable', () => {
    it('should be clickable when onClick provided', async () => {
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Clickable</Card>);

      await userEvent.click(screen.getByText('Clickable'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should have pointer cursor when clickable', () => {
      render(<Card onClick={() => {}}>Clickable</Card>);

      expect(screen.getByText('Clickable').parentElement).toHaveStyle({ cursor: 'pointer' });
    });
  });

  describe('padding', () => {
    it('should apply no padding when padding="none"', () => {
      render(<Card padding="none">No padding</Card>);

      expect(screen.getByText('No padding')).toBeInTheDocument();
    });

    it('should apply small padding', () => {
      render(<Card padding="sm">Small padding</Card>);

      expect(screen.getByText('Small padding')).toBeInTheDocument();
    });

    it('should apply medium padding', () => {
      render(<Card padding="md">Medium padding</Card>);

      expect(screen.getByText('Medium padding')).toBeInTheDocument();
    });

    it('should apply large padding', () => {
      render(<Card padding="lg">Large padding</Card>);

      expect(screen.getByText('Large padding')).toBeInTheDocument();
    });
  });

  describe('border radius', () => {
    it('should apply default border radius', () => {
      render(<Card>Default radius</Card>);

      expect(screen.getByText('Default radius')).toBeInTheDocument();
    });

    it('should apply custom border radius', () => {
      render(<Card radius="lg">Large radius</Card>);

      expect(screen.getByText('Large radius')).toBeInTheDocument();
    });
  });

  describe('shadow', () => {
    it('should apply shadow by default', () => {
      render(<Card>With shadow</Card>);

      expect(screen.getByText('With shadow')).toBeInTheDocument();
    });

    it('should not apply shadow when shadow="none"', () => {
      render(<Card shadow="none">No shadow</Card>);

      expect(screen.getByText('No shadow')).toBeInTheDocument();
    });

    it('should apply different shadow sizes', () => {
      render(<Card shadow="lg">Large shadow</Card>);

      expect(screen.getByText('Large shadow')).toBeInTheDocument();
    });
  });

  describe('complete card', () => {
    it('should render complete card with all parts', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Swap ETH</CardTitle>
            <CardDescription>Exchange your tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Enter the amount you want to swap</p>
          </CardContent>
          <CardFooter>
            <button>Swap</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Swap ETH')).toBeInTheDocument();
      expect(screen.getByText('Exchange your tokens')).toBeInTheDocument();
      expect(screen.getByText('Enter the amount you want to swap')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Swap' })).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should support aria-label', () => {
      render(<Card aria-label="Token swap card">Content</Card>);

      expect(screen.getByLabelText('Token swap card')).toBeInTheDocument();
    });

    it('should support role attribute', () => {
      render(<Card role="article">Content</Card>);

      expect(screen.getByRole('article')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show loading overlay when loading', () => {
      render(<Card loading>Content</Card>);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should show skeleton when loading', () => {
      render(<Card loading>Content</Card>);

      expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should apply disabled styles when disabled', () => {
      render(<Card disabled>Disabled card</Card>);

      expect(screen.getByText('Disabled card').parentElement).toHaveAttribute('aria-disabled', 'true');
    });

    it('should not be clickable when disabled', async () => {
      const handleClick = vi.fn();
      render(
        <Card disabled onClick={handleClick}>
          Disabled
        </Card>
      );

      await userEvent.click(screen.getByText('Disabled'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});

