/**
 * Container component tests
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Container } from '../Container';

describe('Container', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(<Container>Content</Container>);

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render as div by default', () => {
      render(<Container>Content</Container>);

      expect(screen.getByText('Content').tagName).toBe('DIV');
    });

    it('should render as custom element', () => {
      render(<Container as="section">Content</Container>);

      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Container className="custom-container">Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('custom-container');
    });
  });

  describe('max width', () => {
    it('should apply default max width', () => {
      render(<Container>Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('max-w-7xl');
    });

    it('should apply small max width', () => {
      render(<Container size="sm">Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('max-w-3xl');
    });

    it('should apply medium max width', () => {
      render(<Container size="md">Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('max-w-5xl');
    });

    it('should apply large max width', () => {
      render(<Container size="lg">Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('max-w-7xl');
    });

    it('should apply extra large max width', () => {
      render(<Container size="xl">Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('max-w-screen-xl');
    });

    it('should apply full width', () => {
      render(<Container size="full">Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('max-w-full');
    });
  });

  describe('centering', () => {
    it('should center by default', () => {
      render(<Container>Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('mx-auto');
    });

    it('should not center when centered is false', () => {
      render(<Container centered={false}>Content</Container>);

      expect(screen.getByText('Content')).not.toHaveClass('mx-auto');
    });
  });

  describe('padding', () => {
    it('should apply default padding', () => {
      render(<Container>Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('px-4');
    });

    it('should apply no padding', () => {
      render(<Container padding="none">Content</Container>);

      expect(screen.getByText('Content')).not.toHaveClass('px-4');
    });

    it('should apply small padding', () => {
      render(<Container padding="sm">Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('px-2');
    });

    it('should apply large padding', () => {
      render(<Container padding="lg">Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('px-6');
    });

    it('should apply responsive padding', () => {
      render(<Container responsive>Content</Container>);

      expect(screen.getByText('Content')).toHaveClass('sm:px-6');
      expect(screen.getByText('Content')).toHaveClass('lg:px-8');
    });
  });

  describe('accessibility', () => {
    it('should pass through aria attributes', () => {
      render(
        <Container aria-label="Main content" role="main">
          Content
        </Container>
      );

      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Main content');
    });
  });
});

