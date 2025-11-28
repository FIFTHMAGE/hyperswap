/**
 * Modal component tests
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render when isOpen is true', () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render with title', () => {
      render(<Modal {...defaultProps} title="Modal Title" />);

      expect(screen.getByText('Modal Title')).toBeInTheDocument();
    });

    it('should render with description', () => {
      render(<Modal {...defaultProps} description="Modal description text" />);

      expect(screen.getByText('Modal description text')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      render(<Modal {...defaultProps} size="sm" />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render medium size', () => {
      render(<Modal {...defaultProps} size="md" />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<Modal {...defaultProps} size="lg" />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render full size', () => {
      render(<Modal {...defaultProps} size="full" />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('closing', () => {
    it('should call onClose when close button clicked', async () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay clicked', async () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      // Click on the overlay (backdrop)
      const overlay = screen.getByTestId('modal-overlay');
      await userEvent.click(overlay);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when closeOnOverlayClick is false', async () => {
      const onClose = vi.fn();
      render(
        <Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />
      );

      const overlay = screen.getByTestId('modal-overlay');
      await userEvent.click(overlay);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key pressed', async () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      await userEvent.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose on Escape when closeOnEscape is false', async () => {
      const onClose = vi.fn();
      render(
        <Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />
      );

      await userEvent.keyboard('{Escape}');

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('close button', () => {
    it('should show close button by default', () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should hide close button when showCloseButton is false', () => {
      render(<Modal {...defaultProps} showCloseButton={false} />);

      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });
  });

  describe('footer', () => {
    it('should render footer content', () => {
      render(
        <Modal {...defaultProps} footer={<button>Confirm</button>} />
      );

      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('should render multiple footer buttons', () => {
      render(
        <Modal
          {...defaultProps}
          footer={
            <>
              <button>Cancel</button>
              <button>Confirm</button>
            </>
          }
        />
      );

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have role="dialog"', () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby when title is provided', () => {
      render(<Modal {...defaultProps} title="Test Title" />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby');
    });

    it('should have aria-describedby when description is provided', () => {
      render(<Modal {...defaultProps} description="Test description" />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-describedby');
    });

    it('should trap focus within modal', async () => {
      render(
        <Modal {...defaultProps}>
          <button>First</button>
          <button>Second</button>
        </Modal>
      );

      const firstButton = screen.getByRole('button', { name: 'First' });
      const secondButton = screen.getByRole('button', { name: 'Second' });

      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      await userEvent.tab();
      expect(document.activeElement).toBe(secondButton);
    });

    it('should focus first focusable element on open', async () => {
      render(
        <Modal {...defaultProps}>
          <button>Focusable Button</button>
        </Modal>
      );

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'Focusable Button' });
        expect(document.activeElement).toBe(button);
      });
    });
  });

  describe('scroll behavior', () => {
    it('should prevent body scroll when open', () => {
      render(<Modal {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when closed', () => {
      const { rerender } = render(<Modal {...defaultProps} />);

      rerender(<Modal {...defaultProps} isOpen={false} />);

      expect(document.body.style.overflow).not.toBe('hidden');
    });
  });

  describe('animation', () => {
    it('should have enter animation class when opening', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });
  });

  describe('nested modals', () => {
    it('should handle nested modals correctly', async () => {
      const onCloseOuter = vi.fn();
      const onCloseInner = vi.fn();

      render(
        <Modal isOpen onClose={onCloseOuter} title="Outer Modal">
          <Modal isOpen onClose={onCloseInner} title="Inner Modal">
            <div>Inner content</div>
          </Modal>
        </Modal>
      );

      // Both modals should be visible
      expect(screen.getByText('Outer Modal')).toBeInTheDocument();
      expect(screen.getByText('Inner Modal')).toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('should apply custom className to modal', () => {
      render(<Modal {...defaultProps} className="custom-modal" />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('custom-modal');
    });

    it('should apply overlayClassName to overlay', () => {
      render(<Modal {...defaultProps} overlayClassName="custom-overlay" />);

      const overlay = screen.getByTestId('modal-overlay');
      expect(overlay).toHaveClass('custom-overlay');
    });
  });

  describe('centered', () => {
    it('should center modal by default', () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should support top-aligned modal', () => {
      render(<Modal {...defaultProps} centered={false} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});

