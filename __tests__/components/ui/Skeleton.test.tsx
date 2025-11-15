/**
 * Skeleton component tests
 */

import { render } from '@testing-library/react';

import { Skeleton } from '@/components/ui/Skeleton';

describe('Skeleton', () => {
  test('renders skeleton element', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  test('applies variant classes', () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  test('applies width and height', () => {
    const { container } = render(<Skeleton width={200} height={100} />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.width).toBe('200px');
    expect(element.style.height).toBe('100px');
  });

  test('accepts string dimensions', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.width).toBe('50%');
    expect(element.style.height).toBe('2rem');
  });
});
