/**
 * Stepper component tests
 */

import { render, screen } from '@testing-library/react';

import { Stepper } from '@/components/ui/Stepper';

describe('Stepper', () => {
  const steps = [
    { label: 'Step 1', description: 'First step' },
    { label: 'Step 2', description: 'Second step' },
    { label: 'Step 3', description: 'Third step' },
  ];

  test('renders all steps', () => {
    render(<Stepper steps={steps} currentStep={0} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  test('shows descriptions', () => {
    render(<Stepper steps={steps} currentStep={0} />);
    expect(screen.getByText('First step')).toBeInTheDocument();
  });

  test('highlights current step', () => {
    const { container } = render(<Stepper steps={steps} currentStep={1} />);
    const stepCircles = container.querySelectorAll('.bg-blue-600');
    expect(stepCircles.length).toBeGreaterThan(0);
  });

  test('shows checkmark for completed steps', () => {
    render(<Stepper steps={steps} currentStep={2} />);
    const checkmarks = screen.getAllByRole('img', { hidden: true });
    expect(checkmarks.length).toBeGreaterThan(0);
  });
});
