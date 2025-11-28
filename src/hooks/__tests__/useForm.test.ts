/**
 * useForm hook tests
 */

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useForm } from '../form/useForm';

describe('useForm', () => {
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '' },
        })
      );

      expect(result.current.values).toEqual({ name: '', email: '' });
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });

    it('should initialize with provided values', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John', email: 'john@example.com' },
        })
      );

      expect(result.current.values).toEqual({
        name: 'John',
        email: 'john@example.com',
      });
    });
  });

  describe('handleChange', () => {
    it('should update field value', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '' },
        })
      );

      act(() => {
        result.current.handleChange('name', 'Jane');
      });

      expect(result.current.values.name).toBe('Jane');
    });

    it('should mark field as touched', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '' },
        })
      );

      act(() => {
        result.current.handleChange('name', 'Jane');
      });

      expect(result.current.touched.name).toBe(true);
    });

    it('should handle event object', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
        })
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'Test' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.values.name).toBe('Test');
    });
  });

  describe('handleBlur', () => {
    it('should mark field as touched on blur', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '' },
        })
      );

      act(() => {
        result.current.handleBlur('email');
      });

      expect(result.current.touched.email).toBe(true);
    });

    it('should validate field on blur', () => {
      const validate = vi.fn((values: { email: string }) => {
        const errors: Record<string, string> = {};
        if (!values.email) errors.email = 'Required';
        return errors;
      });

      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          validate,
        })
      );

      act(() => {
        result.current.handleBlur('email');
      });

      expect(validate).toHaveBeenCalled();
      expect(result.current.errors.email).toBe('Required');
    });
  });

  describe('validation', () => {
    it('should validate all fields', () => {
      const validate = (values: { name: string; email: string }) => {
        const errors: Record<string, string> = {};
        if (!values.name) errors.name = 'Name required';
        if (!values.email) errors.email = 'Email required';
        return errors;
      };

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '' },
          validate,
        })
      );

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors).toEqual({
        name: 'Name required',
        email: 'Email required',
      });
    });

    it('should clear errors when validation passes', () => {
      const validate = (values: { name: string }) => {
        const errors: Record<string, string> = {};
        if (!values.name) errors.name = 'Required';
        return errors;
      };

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          validate,
        })
      );

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.name).toBe('Required');

      act(() => {
        result.current.handleChange('name', 'Valid');
        result.current.validateForm();
      });

      expect(result.current.errors.name).toBeUndefined();
    });

    it('should validate single field', () => {
      const validate = (values: { name: string }) => {
        const errors: Record<string, string> = {};
        if (values.name.length < 3) errors.name = 'Min 3 chars';
        return errors;
      };

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'ab' },
          validate,
        })
      );

      act(() => {
        result.current.validateField('name');
      });

      expect(result.current.errors.name).toBe('Min 3 chars');
    });
  });

  describe('handleSubmit', () => {
    it('should call onSubmit with values', async () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          onSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
      });

      expect(onSubmit).toHaveBeenCalledWith(
        { name: 'John' },
        expect.any(Object)
      );
    });

    it('should not submit if validation fails', async () => {
      const onSubmit = vi.fn();
      const validate = (values: { name: string }) => {
        const errors: Record<string, string> = {};
        if (!values.name) errors.name = 'Required';
        return errors;
      };

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          validate,
          onSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
      });

      expect(onSubmit).not.toHaveBeenCalled();
      expect(result.current.errors.name).toBe('Required');
    });

    it('should set isSubmitting during submission', async () => {
      let resolveSubmit: () => void;
      const onSubmit = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve;
          })
      );

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          onSubmit,
        })
      );

      const submitPromise = act(async () => {
        result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
      });

      expect(result.current.isSubmitting).toBe(true);

      await act(async () => {
        resolveSubmit!();
        await submitPromise;
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset to initial values', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'Initial' },
        })
      );

      act(() => {
        result.current.handleChange('name', 'Changed');
      });

      expect(result.current.values.name).toBe('Changed');

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values.name).toBe('Initial');
    });

    it('should clear errors and touched state', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          validate: (values) => (values.name ? {} : { name: 'Required' }),
        })
      );

      act(() => {
        result.current.handleBlur('name');
        result.current.validateForm();
      });

      expect(result.current.errors.name).toBe('Required');
      expect(result.current.touched.name).toBe(true);

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });
  });

  describe('setFieldValue', () => {
    it('should set specific field value', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '' },
        })
      );

      act(() => {
        result.current.setFieldValue('email', 'test@test.com');
      });

      expect(result.current.values.email).toBe('test@test.com');
      expect(result.current.values.name).toBe('');
    });
  });

  describe('setFieldError', () => {
    it('should set specific field error', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
        })
      );

      act(() => {
        result.current.setFieldError('name', 'Custom error');
      });

      expect(result.current.errors.name).toBe('Custom error');
    });
  });

  describe('isDirty', () => {
    it('should be false initially', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
        })
      );

      expect(result.current.isDirty).toBe(false);
    });

    it('should be true after change', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
        })
      );

      act(() => {
        result.current.handleChange('name', 'Jane');
      });

      expect(result.current.isDirty).toBe(true);
    });

    it('should be false after reset', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
        })
      );

      act(() => {
        result.current.handleChange('name', 'Jane');
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.isDirty).toBe(false);
    });
  });

  describe('isValid', () => {
    it('should be true when no errors', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          validate: () => ({}),
        })
      );

      expect(result.current.isValid).toBe(true);
    });

    it('should be false when has errors', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          validate: (values) => (values.name ? {} : { name: 'Required' }),
        })
      );

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.isValid).toBe(false);
    });
  });
});

