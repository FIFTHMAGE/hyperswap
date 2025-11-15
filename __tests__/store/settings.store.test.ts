/**
 * Settings store tests
 */

import { useSettingsStore } from '@/store/settings.store';

describe('Settings Store', () => {
  beforeEach(() => {
    useSettingsStore.getState().reset();
  });

  test('sets theme', () => {
    useSettingsStore.getState().setTheme('dark');
    expect(useSettingsStore.getState().theme).toBe('dark');
  });

  test('sets currency', () => {
    useSettingsStore.getState().setCurrency('EUR');
    expect(useSettingsStore.getState().currency).toBe('EUR');
  });

  test('sets slippage', () => {
    useSettingsStore.getState().setSlippage(1.5);
    expect(useSettingsStore.getState().slippage).toBe(1.5);
  });

  test('toggles expert mode', () => {
    const initialValue = useSettingsStore.getState().expertMode;
    useSettingsStore.getState().toggleExpertMode();
    expect(useSettingsStore.getState().expertMode).toBe(!initialValue);
  });

  test('toggles sound', () => {
    const initialValue = useSettingsStore.getState().soundEnabled;
    useSettingsStore.getState().toggleSound();
    expect(useSettingsStore.getState().soundEnabled).toBe(!initialValue);
  });

  test('resets settings', () => {
    useSettingsStore.getState().setTheme('dark');
    useSettingsStore.getState().setCurrency('EUR');
    useSettingsStore.getState().reset();

    expect(useSettingsStore.getState().theme).toBe('system');
    expect(useSettingsStore.getState().currency).toBe('USD');
  });
});
