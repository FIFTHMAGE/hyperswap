/**
 * State management type definitions
 * @module state.types
 */

import type { AppError } from './error.types';

// ============================================================================
// GENERAL STATE PATTERNS
// ============================================================================

/**
 * Basic async state pattern
 */
export interface AsyncState<T, E = AppError> {
  data: T | null;
  loading: boolean;
  error: E | null;
  timestamp: number | null;
}

/**
 * Extended async state with status
 */
export interface AsyncStateExtended<T, E = AppError> extends AsyncState<T, E> {
  status: AsyncStatus;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Async operation status
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

// ============================================================================
// REQUEST STATE
// ============================================================================

/**
 * Request state with retry capabilities
 */
export interface RequestState<T, E = AppError> extends AsyncStateExtended<T, E> {
  retryCount: number;
  canRetry: boolean;
  lastRequestAt: number | null;
}

/**
 * Paginated request state
 */
export interface PaginatedRequestState<T, E = AppError> extends RequestState<T[], E> {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  isLoadingMore: boolean;
}

/**
 * Infinite scroll state
 */
export interface InfiniteScrollState<T, E = AppError> extends AsyncState<T[], E> {
  hasMore: boolean;
  isFetchingMore: boolean;
  page: number;
  error: E | null;
}

// ============================================================================
// CACHE STATE
// ============================================================================

/**
 * Cached data state
 */
export interface CachedState<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
  stale: boolean;
  revalidating: boolean;
}

/**
 * Cache entry
 */
export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

/**
 * Cache state management
 */
export interface CacheState<T = unknown> {
  entries: Map<string, CacheEntry<T>>;
  size: number;
  maxSize: number;
  hitRate: number;
}

// ============================================================================
// FORM STATE
// ============================================================================

/**
 * Form field state
 */
export interface FieldState<T = string> {
  value: T;
  initialValue: T;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
  valid: boolean;
}

/**
 * Complete form state
 */
export interface FormState<T extends Record<string, unknown>> {
  fields: { [K in keyof T]: FieldState<T[K]> };
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  isValidating: boolean;
  submitCount: number;
  errors: Partial<Record<keyof T, string>>;
}

/**
 * Form submission state
 */
export interface FormSubmissionState<T> {
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
  submitError: AppError | null;
  submitResult: T | null;
}

// ============================================================================
// MODAL STATE
// ============================================================================

/**
 * Modal state manager
 */
export interface ModalState<T = unknown> {
  isOpen: boolean;
  data: T | null;
  previousState: T | null;
  history: T[];
}

/**
 * Multi-modal state
 */
export interface MultiModalState {
  modals: Map<string, ModalState>;
  activeModal: string | null;
  queue: string[];
}

// ============================================================================
// FILTER & SEARCH STATE
// ============================================================================

/**
 * Filter state
 */
export interface FilterState<T = unknown> {
  active: Map<string, T>;
  available: Map<string, T[]>;
  applied: boolean;
}

/**
 * Search state
 */
export interface SearchState {
  query: string;
  history: string[];
  suggestions: string[];
  isSearching: boolean;
  results: unknown[];
}

/**
 * Sort state
 */
export interface SortState<T = string> {
  field: T;
  direction: 'asc' | 'desc';
}

// ============================================================================
// SELECTION STATE
// ============================================================================

/**
 * Single selection state
 */
export interface SelectionState<T> {
  selected: T | null;
  previous: T | null;
}

/**
 * Multiple selection state
 */
export interface MultiSelectState<T> {
  selected: Set<T>;
  lastSelected: T | null;
  selectAll: boolean;
}

// ============================================================================
// UI STATE
// ============================================================================

/**
 * Toggle state
 */
export interface ToggleState {
  enabled: boolean;
  lastToggled: number | null;
}

/**
 * Expansion state (accordions, etc.)
 */
export interface ExpansionState {
  expanded: Set<string>;
  allowMultiple: boolean;
}

/**
 * Visibility state
 */
export interface VisibilityState {
  visible: boolean;
  hiddenAt: number | null;
  shownAt: number | null;
}

/**
 * Focus state
 */
export interface FocusState {
  focused: boolean;
  focusedElement: string | null;
  lastFocused: number | null;
}

// ============================================================================
// WALLET STATE
// ============================================================================

/**
 * Wallet connection state
 */
export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connector: string | null;
  balance: string | null;
}

/**
 * Multi-chain wallet state
 */
export interface MultiChainWalletState {
  wallets: Map<number, WalletState>;
  activeChain: number | null;
}

// ============================================================================
// TRANSACTION STATE
// ============================================================================

/**
 * Transaction state
 */
export interface TransactionState {
  hash: string | null;
  status: 'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed';
  confirmations: number;
  error: AppError | null;
  submittedAt: number | null;
  confirmedAt: number | null;
}

/**
 * Multiple transactions state
 */
export interface TransactionsState {
  pending: Map<string, TransactionState>;
  history: TransactionState[];
  count: {
    pending: number;
    confirmed: number;
    failed: number;
  };
}

// ============================================================================
// SWAP STATE
// ============================================================================

/**
 * Swap form state
 */
export interface SwapFormState {
  fromToken: string | null;
  toToken: string | null;
  fromAmount: string;
  toAmount: string;
  slippage: number;
  deadline: number;
  isReversed: boolean;
}

/**
 * Swap quote state
 */
export interface SwapQuoteState<T> extends AsyncState<T> {
  isRefreshing: boolean;
  expiresAt: number | null;
  isExpired: boolean;
}

// ============================================================================
// PORTFOLIO STATE
// ============================================================================

/**
 * Portfolio state
 */
export interface PortfolioState<T> extends AsyncState<T> {
  lastSynced: number | null;
  isSyncing: boolean;
  syncError: AppError | null;
}

/**
 * Token balance state
 */
export interface TokenBalancesState<T> {
  balances: Map<string, T>;
  total: number;
  loading: Set<string>;
  errors: Map<string, AppError>;
}

// ============================================================================
// NOTIFICATION STATE
// ============================================================================

/**
 * Notification item
 */
export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  persistent: boolean;
}

/**
 * Notifications state
 */
export interface NotificationsState {
  items: NotificationItem[];
  unreadCount: number;
  filter: 'all' | 'unread';
}

// ============================================================================
// PREFERENCES STATE
// ============================================================================

/**
 * User preferences state
 */
export interface PreferencesState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  slippage: number;
  deadline: number;
  expertMode: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

// ============================================================================
// STORE ACTIONS
// ============================================================================

/**
 * Generic store action
 */
export interface StoreAction<T = unknown> {
  type: string;
  payload?: T;
  meta?: Record<string, unknown>;
}

/**
 * Async action state
 */
export interface AsyncAction<T, P = unknown> {
  request: (payload: P) => Promise<T>;
  pending: () => void;
  fulfilled: (data: T) => void;
  rejected: (error: AppError) => void;
}

// ============================================================================
// STORE SELECTORS
// ============================================================================

/**
 * Selector function type
 */
export type Selector<S, R> = (state: S) => R;

/**
 * Memoized selector
 */
export interface MemoizedSelector<S, R> extends Selector<S, R> {
  clearCache: () => void;
  recomputations: () => number;
}

// ============================================================================
// STORE MIDDLEWARE
// ============================================================================

/**
 * Store middleware function
 */
export type Middleware<S> = (
  store: Store<S>
) => (next: Dispatch) => (action: StoreAction) => unknown;

/**
 * Store type
 */
export interface Store<S> {
  getState: () => S;
  setState: (state: Partial<S> | ((state: S) => Partial<S>)) => void;
  subscribe: (listener: (state: S) => void) => () => void;
}

/**
 * Dispatch function
 */
export type Dispatch = (action: StoreAction) => void;

// ============================================================================
// PERSISTENCE
// ============================================================================

/**
 * Persistence configuration
 */
export interface PersistenceConfig {
  key: string;
  storage: 'localStorage' | 'sessionStorage' | 'indexedDB';
  serialize?: (state: unknown) => string;
  deserialize?: (data: string) => unknown;
  whitelist?: string[];
  blacklist?: string[];
}

/**
 * Persisted state
 */
export interface PersistedState<T> {
  state: T;
  version: number;
  timestamp: number;
  hydrated: boolean;
}
