/**
 * Overlay component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Overlay } from '@/components/ui/Overlay';

describe('Overlay', () => {
  test('renders nothing when closed', () => {
    const { container } = render(<Overlay isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders when open', () => {
    const { container } = render(<Overlay isOpen={true} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders children', () => {
    render(
      <Overlay isOpen={true}>
        <div>Overlay content</div>
      </Overlay>
    );

    expect(screen.getByText('Overlay content')).toBeInTheDocument();
  });

  test('calls onClose when overlay is clicked', () => {
    const onClose = jest.fn();
    const { container } = render(<Overlay isOpen={true} onClose={onClose} />);

    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalled();
  });

  test('does not call onClose when children are clicked', () => {
    const onClose = jest.fn();
    render(
      <Overlay isOpen={true} onClose={onClose}>
        <button>Click me</button>
      </Overlay>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClose).not.toHaveBeenCalled();
  });

  test('applies blur class', () => {
    const { container } = render(<Overlay isOpen={true} blur />);
    expect(container.firstChild).toHaveClass('backdrop-blur-sm');
  });
});
