/**
 * Skeleton loader variants for loading states
 */

export const skeletonBase = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

export const skeletonVariants = {
  text: `${skeletonBase} h-4 w-full`,
  title: `${skeletonBase} h-6 w-3/4`,
  avatar: `${skeletonBase} rounded-full`,
  button: `${skeletonBase} h-10 w-24`,
  card: `${skeletonBase} h-32 w-full`,
  image: `${skeletonBase} aspect-video w-full`,
};

export const skeletonSizes = {
  sm: 'h-20',
  md: 'h-32',
  lg: 'h-48',
  xl: 'h-64',
};

