/**
 * RadioGroup component tests
 */

import { render, screen } from '@testing-library/react';

import { Radio } from '@/components/ui/Radio';
import { RadioGroup } from '@/components/ui/RadioGroup';

describe('RadioGroup', () => {
  test('renders radio group with children', () => {
    render(
      <RadioGroup label="Select Option">
        <Radio name="test" value="option1" label="Option 1" />
        <Radio name="test" value="option2" label="Option 2" />
      </RadioGroup>
    );

    expect(screen.getByText('Select Option')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
  });

  test('renders error message', () => {
    render(
      <RadioGroup label="Select Option" error="Please select an option">
        <Radio name="test" value="option1" label="Option 1" />
      </RadioGroup>
    );

    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  test('renders without label', () => {
    render(
      <RadioGroup>
        <Radio name="test" value="option1" label="Option 1" />
      </RadioGroup>
    );

    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
  });
});
