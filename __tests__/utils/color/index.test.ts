/**
 * Color utilities tests
 */

import { hexToRgb, rgbToHex, lightenColor, darkenColor, getContrastColor } from '@/utils/color';

describe('Color Utilities', () => {
  describe('hexToRgb', () => {
    test('converts hex to RGB', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    });

    test('handles hex without #', () => {
      expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    test('returns null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    test('converts RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });
  });

  describe('lightenColor', () => {
    test('lightens color', () => {
      const lightened = lightenColor('#808080', 50);
      const rgb = hexToRgb(lightened);
      expect(rgb?.r).toBeGreaterThan(128);
    });
  });

  describe('darkenColor', () => {
    test('darkens color', () => {
      const darkened = darkenColor('#808080', 50);
      const rgb = hexToRgb(darkened);
      expect(rgb?.r).toBeLessThan(128);
    });
  });

  describe('getContrastColor', () => {
    test('returns black for light colors', () => {
      expect(getContrastColor('#ffffff')).toBe('#000000');
    });

    test('returns white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('#ffffff');
    });
  });
});
