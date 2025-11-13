export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function getBreakpoint(): keyof typeof breakpoints | 'xs' {
  if (typeof window === 'undefined') return 'md';
  
  const width = window.innerWidth;
  
  if (width < breakpoints.sm) return 'xs';
  if (width < breakpoints.md) return 'sm';
  if (width < breakpoints.lg) return 'md';
  if (width < breakpoints.xl) return 'lg';
  if (width < breakpoints['2xl']) return 'xl';
  return '2xl';
}

export function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < breakpoints.md;
}

export function isTablet(): boolean {
  return typeof window !== 'undefined' && 
    window.innerWidth >= breakpoints.md && 
    window.innerWidth < breakpoints.lg;
}

export function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.innerWidth >= breakpoints.lg;
}

