/**
 * Route constants tests
 */

import { ROUTES, PUBLIC_ROUTES, PROTECTED_ROUTES } from '@/lib/constants/routes';

describe('Route Constants', () => {
  test('ROUTES contains all route paths', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.SWAP).toBe('/swap');
    expect(ROUTES.LIQUIDITY).toBe('/liquidity');
  });

  test('PUBLIC_ROUTES is an array', () => {
    expect(Array.isArray(PUBLIC_ROUTES)).toBe(true);
    expect(PUBLIC_ROUTES).toContain(ROUTES.HOME);
  });

  test('PROTECTED_ROUTES is an array', () => {
    expect(Array.isArray(PROTECTED_ROUTES)).toBe(true);
    expect(PROTECTED_ROUTES).toContain(ROUTES.PROFILE);
  });

  test('API routes are defined', () => {
    expect(ROUTES.API.SWAP).toBe('/api/swap');
    expect(ROUTES.API.TOKENS).toBe('/api/tokens');
  });
});
