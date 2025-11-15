/**
 * useForm hook tests
 */

import { renderHook, act } from '@testing-library/react';

import { useForm } from '@/hooks/form/useForm';

describe('useForm', () => {
  test('manages form state', () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '', password: '' },
        onSubmit,
      })
    );

    expect(result.current.values).toEqual({ email: '', password: '' });
  });

  test('handles field changes', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: jest.fn(),
      })
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  test('validates on submit', async () => {
    const onSubmit = jest.fn();
    const validate = jest.fn().mockReturnValue({ email: 'Required' });

    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit,
        validate,
      })
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(validate).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.email).toBe('Required');
  });

  test('resets form', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: jest.fn(),
      })
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.values.email).toBe('');
  });
});
