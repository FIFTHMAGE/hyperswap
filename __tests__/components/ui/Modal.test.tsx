/**
 * Modal component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Modal } from '@/components/ui/Modal';

describe('Modal', () => {
  test('renders nothing when closed', () => {
    const onClose = jest.fn();
    const { container } = render(
      <Modal isOpen={false} onClose={onClose}>
        <div>Modal content</div>
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });

  test('renders when open', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test('renders title', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Modal Title">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  test('renders footer', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} footer={<button>Action</button>}>
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} showCloseButton>
        <div>Modal content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  test('hides close button when showCloseButton is false', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} showCloseButton={false}>
        <div>Modal content</div>
      </Modal>
    );

    const closeButton = screen.queryByRole('button', { name: /close modal/i });
    expect(closeButton).not.toBeInTheDocument();
  });
});
