/**
 * Select component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Select, SelectOption } from '@/components/ui/Select';

describe('Select', () => {
  test('renders select with options', () => {
    const handleChange = jest.fn();

    render(
      <Select value="" onChange={handleChange} label="Select Option">
        <SelectOption value="option1">Option 1</SelectOption>
        <SelectOption value="option2">Option 2</SelectOption>
      </Select>
    );

    expect(screen.getByLabelText('Select Option')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('calls onChange handler', () => {
    const handleChange = jest.fn();

    render(
      <Select value="" onChange={handleChange}>
        <SelectOption value="option1">Option 1</SelectOption>
        <SelectOption value="option2">Option 2</SelectOption>
      </Select>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option1' } });

    expect(handleChange).toHaveBeenCalled();
  });

  test('renders error message', () => {
    const handleChange = jest.fn();

    render(
      <Select value="" onChange={handleChange} error="Please select an option">
        <SelectOption value="option1">Option 1</SelectOption>
      </Select>
    );

    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  test('disables select when disabled prop is true', () => {
    const handleChange = jest.fn();

    render(
      <Select value="" onChange={handleChange} disabled>
        <SelectOption value="option1">Option 1</SelectOption>
      </Select>
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  test('renders placeholder', () => {
    const handleChange = jest.fn();

    render(
      <Select value="" onChange={handleChange} placeholder="Choose an option">
        <SelectOption value="option1">Option 1</SelectOption>
      </Select>
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });
});
