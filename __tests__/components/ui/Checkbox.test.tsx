/**
 * Checkbox component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Checkbox } from '@/components/ui/Checkbox';

describe('Checkbox', () => {
  test('renders with label', () => {
    render(<Checkbox checked={false} onChange={() => {}} label="Accept terms" />);

    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  test('calls onChange when clicked', () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Checkbox checked={false} onChange={() => {}} disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  test('reflects checked state', () => {
    const { rerender } = render(<Checkbox checked={false} onChange={() => {}} />);

    let checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    rerender(<Checkbox checked={true} onChange={() => {}} />);

    checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});
