/**
 * Toast service tests
 */

import { toastService } from '@/services/notification/toast.service';

describe('Toast Service', () => {
  beforeEach(() => {
    toastService.dismissAll();
  });

  test('shows toast', () => {
    const id = toastService.success('Success message');
    expect(id).toBeDefined();
  });

  test('dismisses toast', () => {
    const listener = jest.fn();
    toastService.subscribe(listener);

    const id = toastService.info('Info message');
    toastService.dismiss(id);

    expect(listener).toHaveBeenCalledWith([]);
  });

  test('dismisses all toasts', () => {
    toastService.success('Message 1');
    toastService.error('Message 2');
    toastService.dismissAll();

    const listener = jest.fn();
    toastService.subscribe(listener);

    expect(listener).not.toHaveBeenCalled();
  });

  test('notifies subscribers', () => {
    const listener = jest.fn();
    toastService.subscribe(listener);

    toastService.success('Test');

    expect(listener).toHaveBeenCalled();
  });
});
