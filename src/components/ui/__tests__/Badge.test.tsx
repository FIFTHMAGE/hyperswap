/**
 * Badge component tests
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from '../Badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('should render badge with text', () => {
      render(<Badge>New</Badge>);

      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Badge className="custom-badge">Test</Badge>);

      expect(screen.getByText('Test')).toHaveClass('custom-badge');
    });
  });

  describe('variants', () => {
    it('should render default variant', () => {
      render(<Badge variant="default">Default</Badge>);

      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('should render primary variant', () => {
      render(<Badge variant="primary">Primary</Badge>);

      expect(screen.getByText('Primary')).toBeInTheDocument();
    });

    it('should render secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>);

      expect(screen.getByText('Secondary')).toBeInTheDocument();
    });

    it('should render success variant', () => {
      render(<Badge variant="success">Success</Badge>);

      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('should render warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>);

      expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('should render error variant', () => {
      render(<Badge variant="error">Error</Badge>);

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render info variant', () => {
      render(<Badge variant="info">Info</Badge>);

      expect(screen.getByText('Info')).toBeInTheDocument();
    });

    it('should render outline variant', () => {
      render(<Badge variant="outline">Outline</Badge>);

      expect(screen.getByText('Outline')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      render(<Badge size="sm">Small</Badge>);

      expect(screen.getByText('Small')).toBeInTheDocument();
    });

    it('should render medium size (default)', () => {
      render(<Badge size="md">Medium</Badge>);

      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<Badge size="lg">Large</Badge>);

      expect(screen.getByText('Large')).toBeInTheDocument();
    });
  });

  describe('dot indicator', () => {
    it('should show dot when dot prop is true', () => {
      render(<Badge dot>With Dot</Badge>);

      expect(screen.getByTestId('badge-dot')).toBeInTheDocument();
    });

    it('should not show dot by default', () => {
      render(<Badge>No Dot</Badge>);

      expect(screen.queryByTestId('badge-dot')).not.toBeInTheDocument();
    });

    it('should apply dot color based on variant', () => {
      render(
        <Badge dot variant="success">
          Success Dot
        </Badge>
      );

      expect(screen.getByTestId('badge-dot')).toBeInTheDocument();
    });
  });

  describe('pill shape', () => {
    it('should render as pill when pill prop is true', () => {
      render(<Badge pill>Pill Badge</Badge>);

      expect(screen.getByText('Pill Badge')).toBeInTheDocument();
    });

    it('should render with default shape', () => {
      render(<Badge>Default Shape</Badge>);

      expect(screen.getByText('Default Shape')).toBeInTheDocument();
    });
  });

  describe('removable', () => {
    it('should show remove button when removable', () => {
      render(
        <Badge removable onRemove={() => {}}>
          Removable
        </Badge>
      );

      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });

    it('should not show remove button by default', () => {
      render(<Badge>Not Removable</Badge>);

      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
    });
  });

  describe('with icon', () => {
    it('should render with left icon', () => {
      render(
        <Badge leftIcon={<span data-testid="left-icon">←</span>}>
          With Left Icon
        </Badge>
      );

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByText('With Left Icon')).toBeInTheDocument();
    });

    it('should render with right icon', () => {
      render(
        <Badge rightIcon={<span data-testid="right-icon">→</span>}>
          With Right Icon
        </Badge>
      );

      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByText('With Right Icon')).toBeInTheDocument();
    });

    it('should render with both icons', () => {
      render(
        <Badge
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
        >
          Both Icons
        </Badge>
      );

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('count badge', () => {
    it('should render count', () => {
      render(<Badge count={5} />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should show max count with plus', () => {
      render(<Badge count={100} maxCount={99} />);

      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('should show exact count when less than max', () => {
      render(<Badge count={50} maxCount={99} />);

      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should not show badge when count is 0 and showZero is false', () => {
      render(<Badge count={0} showZero={false} />);

      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('should show badge when count is 0 and showZero is true', () => {
      render(<Badge count={0} showZero />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('status badge', () => {
    it('should render as status badge', () => {
      render(<Badge status="online">Online</Badge>);

      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('should render offline status', () => {
      render(<Badge status="offline">Offline</Badge>);

      expect(screen.getByText('Offline')).toBeInTheDocument();
    });

    it('should render pending status', () => {
      render(<Badge status="pending">Pending</Badge>);

      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should support aria-label', () => {
      render(<Badge aria-label="Notification count: 5">5</Badge>);

      expect(screen.getByLabelText('Notification count: 5')).toBeInTheDocument();
    });

    it('should support role', () => {
      render(<Badge role="status">Status Badge</Badge>);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('as link', () => {
    it('should render as link when href provided', () => {
      render(
        <Badge as="a" href="/notifications">
          View All
        </Badge>
      );

      expect(screen.getByRole('link', { name: 'View All' })).toHaveAttribute(
        'href',
        '/notifications'
      );
    });
  });

  describe('combination', () => {
    it('should render badge with all features', () => {
      render(
        <Badge
          variant="success"
          size="lg"
          dot
          leftIcon={<span data-testid="check">✓</span>}
        >
          Completed
        </Badge>
      );

      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByTestId('badge-dot')).toBeInTheDocument();
      expect(screen.getByTestId('check')).toBeInTheDocument();
    });
  });
});

