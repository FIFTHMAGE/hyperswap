/**
 * Theme variants for UI components
 * NativeWind-compatible utility classes
 */

import { ComponentVariant, ComponentSize } from '../shared/prop-types';

export const buttonVariants: Record<ComponentVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 active:bg-gray-400',
  success: 'bg-green-600 hover:bg-green-700 text-white active:bg-green-800',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white active:bg-yellow-700',
  error: 'bg-red-600 hover:bg-red-700 text-white active:bg-red-800',
  info: 'bg-cyan-600 hover:bg-cyan-700 text-white active:bg-cyan-800',
};

export const buttonSizes: Record<ComponentSize, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

export const cardVariants: Record<ComponentVariant, string> = {
  primary: 'bg-white dark:bg-gray-800 border-blue-200',
  secondary: 'bg-gray-50 dark:bg-gray-700 border-gray-200',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200',
  info: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200',
};

export const inputVariants = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
};

export const textColors: Record<ComponentVariant, string> = {
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-gray-600 dark:text-gray-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-cyan-600 dark:text-cyan-400',
};

export const borderColors: Record<ComponentVariant, string> = {
  primary: 'border-blue-500',
  secondary: 'border-gray-500',
  success: 'border-green-500',
  warning: 'border-yellow-500',
  error: 'border-red-500',
  info: 'border-cyan-500',
};
