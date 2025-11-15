/**
 * Radio component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Radio } from '@/components/ui/Radio';

describe('Radio', () => {
  test('renders radio button', () => {
    render(<Radio name="test" value="option1" label="Option 1" />);
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
  });

  test('handles checked state', () => {
    render(<Radio name="test" value="option1" checked label="Option 1" />);
    const radio = screen.getByRole('radio') as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });

  test('calls onChange handler', () => {
    const handleChange = jest.fn();
    render(<Radio name="test" value="option1" onChange={handleChange} label="Option 1" />);

    const radio = screen.getByRole('radio');
    fireEvent.click(radio);

    expect(handleChange).toHaveBeenCalled();
  });

  test('disables radio when disabled prop is true', () => {
    render(<Radio name="test" value="option1" disabled label="Option 1" />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
  });

  test('renders without label', () => {
    const { container } = render(<Radio name="test" value="option1" />);
    expect(container.querySelector('input[type="radio"]')).toBeInTheDocument();
  });
});
