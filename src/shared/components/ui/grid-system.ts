/**
 * Grid system utilities for responsive layouts
 */

export const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
} as const;

export const gridGap = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
} as const;

export const responsiveGrid = {
  '1-2-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '1-2-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  '1-3-6': 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
  '2-4-6': 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
} as const;

export function getGridClass(
  cols: keyof typeof gridCols,
  gap: keyof typeof gridGap = 'md'
): string {
  return `grid ${gridCols[cols]} ${gridGap[gap]}`;
}
