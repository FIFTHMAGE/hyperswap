/**
 * Accordion component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Accordion } from '@/components/ui/Accordion';

describe('Accordion', () => {
  const items = [
    { title: 'Item 1', content: <div>Content 1</div> },
    { title: 'Item 2', content: <div>Content 2</div>, defaultOpen: true },
    { title: 'Item 3', content: <div>Content 3</div> },
  ];

  test('renders all items', () => {
    render(<Accordion items={items} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  test('opens default items', () => {
    render(<Accordion items={items} />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  test('toggles item on click', () => {
    render(<Accordion items={items} />);
    fireEvent.click(screen.getByText('Item 1'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  test('allows multiple items when enabled', () => {
    render(<Accordion items={items} allowMultiple />);
    fireEvent.click(screen.getByText('Item 1'));
    fireEvent.click(screen.getByText('Item 3'));

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.getByText('Content 3')).toBeInTheDocument();
  });
});
