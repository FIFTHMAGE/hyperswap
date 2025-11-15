/**
 * Switch component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Switch } from '@/components/ui/Switch';

describe('Switch', () => {
  test('renders with label', () => {
    render(<Switch checked={false} onChange={() => {}} label="Toggle me" />);

    expect(screen.getByText('Toggle me')).toBeInTheDocument();
  });

  test('calls onChange when clicked', () => {
    const onChange = jest.fn();
    render(<Switch checked={false} onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Switch checked={false} onChange={() => {}} disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  test('reflects checked state', () => {
    const { rerender } = render(<Switch checked={false} onChange={() => {}} />);

    let checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    rerender(<Switch checked={true} onChange={() => {}} />);

    checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});
