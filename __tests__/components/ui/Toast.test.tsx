/**
 * Toast component tests
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { Toast } from '@/components/ui/Toast';

describe('Toast', () => {
  jest.useFakeTimers();

  test('renders toast message', () => {
    const handleClose = jest.fn();
    render(<Toast message="Test message" onClose={handleClose} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Toast message="Test message" onClose={handleClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  test('auto-closes after duration', async () => {
    const handleClose = jest.fn();
    render(<Toast message="Test message" onClose={handleClose} duration={1000} />);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });

  test('applies type classes', () => {
    const handleClose = jest.fn();
    const { container } = render(
      <Toast message="Success message" type="success" onClose={handleClose} />
    );

    expect(container.firstChild).toHaveClass('bg-green-500');
  });

  test('does not auto-close when duration is 0', async () => {
    const handleClose = jest.fn();
    render(<Toast message="Test message" onClose={handleClose} duration={0} />);

    jest.advanceTimersByTime(5000);

    expect(handleClose).not.toHaveBeenCalled();
  });
});
