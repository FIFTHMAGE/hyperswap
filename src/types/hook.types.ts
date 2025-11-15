/**
 * Custom hooks return type definitions
 * @module hook.types
 */

import type { RefObject } from 'react';

import type { AppError } from './error.types';
import type { AsyncState } from './state.types';

// ============================================================================
// ASYNC HOOKS
// ============================================================================

/**
 * useAsync hook return type
 */
export interface UseAsyncReturn<T, E = AppError> extends AsyncState<T, E> {
  execute: (...args: unknown[]) => Promise<T>;
  reset: () => void;
  setData: (data: T) => void;
  setError: (error: E) => void;
}

/**
 * useFetch hook return type
 */
export interface UseFetchReturn<T, E = AppError> extends UseAsyncReturn<T, E> {
  refetch: () => Promise<T>;
  cancel: () => void;
}

/**
 * useQuery hook options
 */
export interface UseQueryOptions<T> {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  staleTime?: number;
  cacheTime?: number;
  retry?: number | boolean;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
}

/**
 * useQuery hook return type
 */
export interface UseQueryReturn<T, E = AppError> extends AsyncState<T, E> {
  refetch: () => Promise<void>;
  isStale: boolean;
  isFetching: boolean;
  dataUpdatedAt: number;
}

// ============================================================================
// STATE HOOKS
// ============================================================================

/**
 * useLocalStorage hook return type
 */
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  remove: () => void;
}

/**
 * useDebounce hook options
 */
export interface UseDebounceOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

/**
 * useDebounce hook return type
 */
export interface UseDebounceReturn<T> {
  debouncedValue: T;
  isPending: boolean;
  flush: () => void;
  cancel: () => void;
}

/**
 * useToggle hook return type
 */
export interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

/**
 * usePrevious hook return type
 */
export type UsePreviousReturn<T> = T | undefined;

/**
 * useCounter hook return type
 */
export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
}

// ============================================================================
// UI HOOKS
// ============================================================================

/**
 * useDisclosure hook return type
 */
export interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * useModal hook return type
 */
export interface UseModalReturn<T = unknown> extends UseDisclosureReturn {
  data: T | null;
  setData: (data: T) => void;
}

/**
 * useMediaQuery hook return type
 */
export interface UseMediaQueryReturn {
  matches: boolean;
  media: string;
}

/**
 * useBreakpoint hook return type
 */
export interface UseBreakpointReturn {
  breakpoint: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isXl: boolean;
}

/**
 * useClipboard hook return type
 */
export interface UseClipboardReturn {
  value: string | null;
  copy: (text: string) => Promise<void>;
  copied: boolean;
  isSupported: boolean;
}

/**
 * useToast hook return type
 */
export interface UseToastReturn {
  show: (options: ToastOptions) => string;
  hide: (id: string) => void;
  hideAll: () => void;
  update: (id: string, options: Partial<ToastOptions>) => void;
}

/**
 * Toast options
 */
export interface ToastOptions {
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// ============================================================================
// FORM HOOKS
// ============================================================================

/**
 * useForm hook return type
 */
export interface UseFormReturn<T extends Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  handleChange: (field: keyof T, value: unknown) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e?: React.FormEvent) => void;
  reset: () => void;
  setFieldValue: (field: keyof T, value: unknown) => void;
  setFieldError: (field: keyof T, error: string) => void;
  validateField: (field: keyof T) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
}

/**
 * useInput hook return type
 */
export interface UseInputReturn {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
  touched: boolean;
  setValue: (value: string) => void;
  reset: () => void;
}

// ============================================================================
// BLOCKCHAIN HOOKS
// ============================================================================

/**
 * useWallet hook return type
 */
export interface UseWalletReturn {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
  balance: string | null;
}

/**
 * useBalance hook return type
 */
export interface UseBalanceReturn {
  balance: string | null;
  formatted: string;
  loading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
}

/**
 * useTransaction hook return type
 */
export interface UseTransactionReturn {
  send: (tx: unknown) => Promise<string>;
  status: 'idle' | 'pending' | 'success' | 'error';
  hash: string | null;
  error: AppError | null;
  reset: () => void;
  wait: () => Promise<unknown>;
}

/**
 * useGasPrice hook return type
 */
export interface UseGasPriceReturn {
  gasPrice: string | null;
  maxFeePerGas: string | null;
  maxPriorityFeePerGas: string | null;
  loading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// SWAP HOOKS
// ============================================================================

/**
 * useSwapQuote hook return type
 */
export interface UseSwapQuoteReturn<T> {
  quote: T | null;
  loading: boolean;
  error: AppError | null;
  getQuote: (params: unknown) => Promise<void>;
  refresh: () => Promise<void>;
  isExpired: boolean;
}

/**
 * useTokenPrice hook return type
 */
export interface UseTokenPriceReturn {
  price: number | null;
  priceChange24h: number | null;
  loading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
}

/**
 * useTokenBalance hook return type
 */
export interface UseTokenBalanceReturn {
  balance: string | null;
  formatted: string;
  decimals: number;
  symbol: string;
  loading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// EFFECT HOOKS
// ============================================================================

/**
 * useInterval hook options
 */
export interface UseIntervalOptions {
  immediate?: boolean;
  enabled?: boolean;
}

/**
 * useInterval hook return type
 */
export interface UseIntervalReturn {
  start: () => void;
  stop: () => void;
  isRunning: boolean;
}

/**
 * useTimeout hook return type
 */
export interface UseTimeoutReturn {
  start: () => void;
  cancel: () => void;
  isRunning: boolean;
}

/**
 * useEventListener hook options
 */
export interface UseEventListenerOptions {
  enabled?: boolean;
  capture?: boolean;
  passive?: boolean;
}

// ============================================================================
// REF HOOKS
// ============================================================================

/**
 * useIntersectionObserver hook options
 */
export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * useIntersectionObserver hook return type
 */
export interface UseIntersectionObserverReturn {
  ref: RefObject<Element>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * useOnClickOutside hook return type
 */
export interface UseOnClickOutsideReturn {
  ref: RefObject<HTMLElement>;
}

/**
 * useHover hook return type
 */
export interface UseHoverReturn {
  ref: RefObject<HTMLElement>;
  isHovered: boolean;
}

/**
 * useFocus hook return type
 */
export interface UseFocusReturn {
  ref: RefObject<HTMLElement>;
  isFocused: boolean;
}

// ============================================================================
// WEBSOCKET HOOKS
// ============================================================================

/**
 * useWebSocket hook options
 */
export interface UseWebSocketOptions {
  reconnect?: boolean;
  reconnectDelay?: number;
  reconnectAttempts?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (data: unknown) => void;
}

/**
 * useWebSocket hook return type
 */
export interface UseWebSocketReturn<T = unknown> {
  data: T | null;
  send: (data: unknown) => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: Event | null;
  reconnect: () => void;
}

// ============================================================================
// PAGINATION HOOKS
// ============================================================================

/**
 * usePagination hook return type
 */
export interface UsePaginationReturn {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
}

/**
 * useInfiniteScroll hook return type
 */
export interface UseInfiniteScrollReturn<T> {
  data: T[];
  loading: boolean;
  hasMore: boolean;
  error: AppError | null;
  loadMore: () => Promise<void>;
  reset: () => void;
}

// ============================================================================
// VALIDATION HOOKS
// ============================================================================

/**
 * useValidation hook return type
 */
export interface UseValidationReturn<T> {
  validate: (value: T) => boolean;
  errors: string[];
  isValid: boolean;
  reset: () => void;
}

// ============================================================================
// THEME HOOKS
// ============================================================================

/**
 * useTheme hook return type
 */
export interface UseThemeReturn {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
}
