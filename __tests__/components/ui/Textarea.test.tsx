/**
 * Textarea component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Textarea } from '@/components/ui/Textarea';

describe('Textarea', () => {
  test('renders textarea', () => {
    const handleChange = jest.fn();
    render(<Textarea value="" onChange={handleChange} label="Description" />);

    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  test('calls onChange handler', () => {
    const handleChange = jest.fn();
    render(<Textarea value="" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test' } });

    expect(handleChange).toHaveBeenCalled();
  });

  test('renders error message', () => {
    const handleChange = jest.fn();
    render(<Textarea value="" onChange={handleChange} error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('disables textarea when disabled prop is true', () => {
    const handleChange = jest.fn();
    render(<Textarea value="" onChange={handleChange} disabled />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  test('shows character count with maxLength', () => {
    const handleChange = jest.fn();
    render(<Textarea value="Test" onChange={handleChange} maxLength={100} />);

    expect(screen.getByText('4/100')).toBeInTheDocument();
  });
});
