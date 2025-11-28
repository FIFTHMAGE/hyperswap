/**
 * Button component tests
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';

describe('Button', () => {
  describe('rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('should render with default variant', () => {
      render(<Button>Default</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should render with different variants', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<Button variant="danger">Danger</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<Button size="md">Medium</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} isLoading>
          Loading
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should have disabled attribute when disabled', () => {
      render(<Button disabled>Disabled</Button>);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should have disabled attribute when loading', () => {
      render(<Button isLoading>Loading</Button>);

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('loading state', () => {
    it('should show loading indicator when isLoading', () => {
      render(<Button isLoading>Loading</Button>);

      // Check for spinner or loading indicator
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should show loading text when provided', () => {
      render(
        <Button isLoading loadingText="Please wait...">
          Submit
        </Button>
      );

      expect(screen.getByRole('button')).toHaveTextContent('Please wait...');
    });
  });

  describe('icons', () => {
    it('should render with left icon', () => {
      render(
        <Button leftIcon={<span data-testid="left-icon">←</span>}>
          With Icon
        </Button>
      );

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('should render with right icon', () => {
      render(
        <Button rightIcon={<span data-testid="right-icon">→</span>}>
          With Icon
        </Button>
      );

      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should render icon only button', () => {
      render(
        <Button aria-label="Settings">
          <span data-testid="icon">⚙</span>
        </Button>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('full width', () => {
    it('should render full width when fullWidth prop is true', () => {
      render(<Button fullWidth>Full Width</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('type attribute', () => {
    it('should have type="button" by default', () => {
      render(<Button>Default Type</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('should support type="submit"', () => {
      render(<Button type="submit">Submit</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should support type="reset"', () => {
      render(<Button type="reset">Reset</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });

  describe('accessibility', () => {
    it('should have accessible name from children', () => {
      render(<Button>Accessible Button</Button>);

      expect(screen.getByRole('button', { name: /accessible button/i })).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);

      expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(
        <>
          <span id="desc">This button does something</span>
          <Button aria-describedby="desc">Action</Button>
        </>
      );

      expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'desc');
    });
  });

  describe('custom className', () => {
    it('should merge custom className', () => {
      render(<Button className="custom-class">Custom</Button>);

      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('as link', () => {
    it('should render as anchor when href is provided', () => {
      render(
        <Button as="a" href="https://example.com">
          Link Button
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });
  });
});

