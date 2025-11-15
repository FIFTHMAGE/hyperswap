/**
 * Dialog component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Dialog } from '@/components/ui/Dialog';

describe('Dialog', () => {
  test('renders when open', () => {
    render(
      <Dialog isOpen={true} onClose={() => {}} title="Test Dialog">
        <div>Dialog content</div>
      </Dialog>
    );

    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      <Dialog isOpen={false} onClose={() => {}} title="Test Dialog">
        <div>Dialog content</div>
      </Dialog>
    );

    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });

  test('calls onClose when clicking backdrop', () => {
    const onClose = jest.fn();
    render(
      <Dialog isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Dialog>
    );

    const backdrop = screen.getByRole('dialog').previousSibling as HTMLElement;
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalled();
  });

  test('calls onClose when clicking close button', () => {
    const onClose = jest.fn();
    render(
      <Dialog isOpen={true} onClose={onClose} title="Test">
        <div>Content</div>
      </Dialog>
    );

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
});
