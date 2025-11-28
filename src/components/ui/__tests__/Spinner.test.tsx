/**
 * Spinner component tests
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from '../Spinner';

describe('Spinner', () => {
  describe('rendering', () => {
    it('should render spinner element', () => {
      render(<Spinner />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have accessible label', () => {
      render(<Spinner />);

      expect(screen.getByRole('status')).toHaveAccessibleName(/loading/i);
    });

    it('should render with custom aria-label', () => {
      render(<Spinner aria-label="Processing transaction" />);

      expect(screen.getByRole('status')).toHaveAccessibleName(
        'Processing transaction'
      );
    });
  });

  describe('sizes', () => {
    it('should render extra small size', () => {
      render(<Spinner size="xs" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render small size', () => {
      render(<Spinner size="sm" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render medium size (default)', () => {
      render(<Spinner size="md" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<Spinner size="lg" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render extra large size', () => {
      render(<Spinner size="xl" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('colors', () => {
    it('should render primary color', () => {
      render(<Spinner color="primary" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render secondary color', () => {
      render(<Spinner color="secondary" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render white color', () => {
      render(<Spinner color="white" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render inherit color', () => {
      render(<Spinner color="inherit" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should render border variant (default)', () => {
      render(<Spinner variant="border" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render dots variant', () => {
      render(<Spinner variant="dots" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render pulse variant', () => {
      render(<Spinner variant="pulse" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render ring variant', () => {
      render(<Spinner variant="ring" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('speed', () => {
    it('should render slow speed', () => {
      render(<Spinner speed="slow" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render normal speed (default)', () => {
      render(<Spinner speed="normal" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render fast speed', () => {
      render(<Spinner speed="fast" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('with label', () => {
    it('should render with label text', () => {
      render(<Spinner label="Loading..." />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render label below spinner by default', () => {
      render(<Spinner label="Loading..." labelPlacement="bottom" />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render label above spinner', () => {
      render(<Spinner label="Loading..." labelPlacement="top" />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render label to the right', () => {
      render(<Spinner label="Loading..." labelPlacement="right" />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render label to the left', () => {
      render(<Spinner label="Loading..." labelPlacement="left" />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('full page', () => {
    it('should render full page spinner', () => {
      render(<Spinner fullPage />);

      expect(screen.getByRole('status').parentElement).toHaveClass('fixed');
    });

    it('should render with overlay', () => {
      render(<Spinner fullPage overlay />);

      expect(screen.getByTestId('spinner-overlay')).toBeInTheDocument();
    });
  });

  describe('centered', () => {
    it('should center spinner in container', () => {
      render(<Spinner centered />);

      expect(screen.getByRole('status').parentElement).toHaveClass(
        'justify-center'
      );
    });
  });

  describe('custom className', () => {
    it('should apply custom className', () => {
      render(<Spinner className="custom-spinner" />);

      expect(screen.getByRole('status')).toHaveClass('custom-spinner');
    });
  });

  describe('accessibility', () => {
    it('should have role="status"', () => {
      render(<Spinner />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-live="polite"', () => {
      render(<Spinner />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('should have visually hidden text for screen readers', () => {
      render(<Spinner />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('with thickness', () => {
    it('should render thin spinner', () => {
      render(<Spinner thickness="thin" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render thick spinner', () => {
      render(<Spinner thickness="thick" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('determinate', () => {
    it('should render determinate spinner with progress', () => {
      render(<Spinner determinate value={50} />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '50'
      );
    });

    it('should show progress percentage', () => {
      render(<Spinner determinate value={75} showProgress />);

      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });
});

describe('Spinner.Overlay', () => {
  it('should render spinner overlay', () => {
    render(<Spinner.Overlay>Overlay Content</Spinner.Overlay>);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Overlay Content')).toBeInTheDocument();
  });

  it('should blur background content', () => {
    render(
      <Spinner.Overlay blur>
        <div>Content to blur</div>
      </Spinner.Overlay>
    );

    expect(screen.getByText('Content to blur')).toBeInTheDocument();
  });
});

describe('Loading State Component', () => {
  it('should show spinner when loading', () => {
    render(
      <Spinner.Container loading>
        <div>Content</div>
      </Spinner.Container>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show children when not loading', () => {
    render(
      <Spinner.Container loading={false}>
        <div>Content</div>
      </Spinner.Container>
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should show both when overlay mode', () => {
    render(
      <Spinner.Container loading overlayMode>
        <div>Content</div>
      </Spinner.Container>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

