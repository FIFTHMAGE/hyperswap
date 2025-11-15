/**
 * TabBar component tests
 */

import { render, screen } from '@testing-library/react';

import { TabBar } from '@/components/mobile/TabBar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/swap',
}));

describe('TabBar', () => {
  const items = [
    { href: '/swap', label: 'Swap', icon: <div>Icon1</div> },
    { href: '/portfolio', label: 'Portfolio', icon: <div>Icon2</div> },
    { href: '/settings', label: 'Settings', icon: <div>Icon3</div> },
  ];

  test('renders all tabs', () => {
    render(<TabBar items={items} />);

    expect(screen.getByText('Swap')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('highlights active tab', () => {
    render(<TabBar items={items} />);

    const swapTab = screen.getByText('Swap').closest('a');
    expect(swapTab).toHaveClass('text-blue-600');
  });
});
