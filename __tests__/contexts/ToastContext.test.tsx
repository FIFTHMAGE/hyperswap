/**
 * ToastContext tests
 */

import { render, screen, waitFor } from '@testing-library/react';

import { ToastProvider, useToast } from '@/contexts/ToastContext';

function TestComponent() {
  const { toasts, addToast, removeToast } = useToast();
  return (
    <div>
      <div data-testid="toast-count">{toasts.length}</div>
      <button onClick={() => addToast('Test message', 'info', 0)}>Add Toast</button>
      {toasts.map((toast) => (
        <div key={toast.id} data-testid="toast">
          {toast.message}
          <button onClick={() => removeToast(toast.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

describe('ToastContext', () => {
  test('provides toast context', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  test('adds toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    screen.getByText('Add Toast').click();

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('removes toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    screen.getByText('Add Toast').click();
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    screen.getByText('Remove').click();
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  test('auto-removes toast after duration', async () => {
    function AutoRemoveComponent() {
      const { toasts, addToast } = useToast();
      return (
        <div>
          <div data-testid="toast-count">{toasts.length}</div>
          <button onClick={() => addToast('Auto remove', 'info', 100)}>Add Auto Remove</button>
        </div>
      );
    }

    render(
      <ToastProvider>
        <AutoRemoveComponent />
      </ToastProvider>
    );

    screen.getByText('Add Auto Remove').click();
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    await waitFor(
      () => {
        expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
      },
      { timeout: 200 }
    );
  });
});
