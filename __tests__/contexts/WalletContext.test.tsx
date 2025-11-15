/**
 * WalletContext tests
 */

import { render, screen, waitFor } from '@testing-library/react';

import { WalletProvider, useWallet } from '@/contexts/WalletContext';

function TestComponent() {
  const { address, isConnected, connect, disconnect } = useWallet();
  return (
    <div>
      <div data-testid="connected">{isConnected ? 'Connected' : 'Disconnected'}</div>
      <div data-testid="address">{address || 'No address'}</div>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}

describe('WalletContext', () => {
  test('provides wallet context', () => {
    render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    );

    expect(screen.getByTestId('connected')).toHaveTextContent('Disconnected');
    expect(screen.getByTestId('address')).toHaveTextContent('No address');
  });

  test('connects wallet', async () => {
    render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    );

    screen.getByText('Connect').click();

    await waitFor(() => {
      expect(screen.getByTestId('connected')).toHaveTextContent('Connected');
    });
  });

  test('disconnects wallet', async () => {
    render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    );

    screen.getByText('Connect').click();

    await waitFor(() => {
      expect(screen.getByTestId('connected')).toHaveTextContent('Connected');
    });

    screen.getByText('Disconnect').click();

    expect(screen.getByTestId('connected')).toHaveTextContent('Disconnected');
  });
});
