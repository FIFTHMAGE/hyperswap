/**
 * Tabs component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Tabs } from '@/components/ui/Tabs';

describe('Tabs', () => {
  const items = [
    { label: 'Tab 1', content: <div>Content 1</div> },
    { label: 'Tab 2', content: <div>Content 2</div> },
    { label: 'Tab 3', content: <div>Content 3</div>, disabled: true },
  ];

  test('renders all tabs', () => {
    render(<Tabs items={items} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  test('shows default tab content', () => {
    render(<Tabs items={items} defaultIndex={0} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  test('switches tabs on click', () => {
    render(<Tabs items={items} />);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  test('disables disabled tabs', () => {
    render(<Tabs items={items} />);
    const tab3 = screen.getByText('Tab 3');
    expect(tab3).toHaveAttribute('disabled');
  });

  test('calls onChange callback', () => {
    const onChange = jest.fn();
    render(<Tabs items={items} onChange={onChange} />);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
