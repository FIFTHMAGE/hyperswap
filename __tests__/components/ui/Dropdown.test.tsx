/**
 * Dropdown component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Dropdown } from '@/components/ui/Dropdown';

describe('Dropdown', () => {
  const items = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3', disabled: true },
  ];

  test('renders placeholder', () => {
    render(<Dropdown items={items} placeholder="Select option" />);
    expect(screen.getByText('Select option')).toBeInTheDocument();
  });

  test('shows selected value', () => {
    render(<Dropdown items={items} value="1" />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  test('opens dropdown on click', () => {
    render(<Dropdown items={items} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('calls onChange on selection', () => {
    const onChange = jest.fn();
    render(<Dropdown items={items} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Option 2'));

    expect(onChange).toHaveBeenCalledWith('2');
  });

  test('disables dropdown when disabled prop is true', () => {
    render(<Dropdown items={items} disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
