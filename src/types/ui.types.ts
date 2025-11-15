/**
 * UI-specific type definitions for components and interfaces
 * @module ui.types
 */

import type { ReactNode, ComponentType, CSSProperties, RefObject } from 'react';

// ============================================================================
// THEME & STYLING
// ============================================================================

/** Theme modes */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Color schemes */
export type ColorScheme = 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'pink';

/** Theme configuration */
export interface Theme {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  fontSize: FontSize;
  borderRadius: BorderRadius;
  spacing: SpacingScale;
  animations: AnimationPreference;
}

/** Font size options */
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

/** Border radius options */
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/** Spacing scale */
export type SpacingScale = 'compact' | 'normal' | 'comfortable';

/** Animation preferences */
export type AnimationPreference = 'none' | 'reduced' | 'full';

// ============================================================================
// COMPONENT BASE PROPS
// ============================================================================

/** Base props for all components */
export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  testId?: string;
  'data-testid'?: string;
}

/** Props for components with children */
export interface ComponentWithChildren extends BaseComponentProps {
  children: ReactNode;
}

/** Props for clickable components */
export interface ClickableProps extends BaseComponentProps {
  onClick?: () => void;
  onDoubleClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// ============================================================================
// BUTTON VARIANTS
// ============================================================================

/** Button variants */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';

/** Button sizes */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Button props interface */
export interface ButtonProps extends ClickableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

// ============================================================================
// INPUT & FORM COMPONENTS
// ============================================================================

/** Input variants */
export type InputVariant = 'default' | 'filled' | 'flushed' | 'unstyled';

/** Input sizes */
export type InputSize = 'sm' | 'md' | 'lg';

/** Base input props */
export interface InputProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  variant?: InputVariant;
  size?: InputSize;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

/** Form field state */
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
}

/** Form state */
export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

/** Form validation rule */
export interface FormValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | Promise<boolean>;
  message: string;
}

/** Select option */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: ReactNode;
  description?: string;
}

// ============================================================================
// MODAL & DIALOG
// ============================================================================

/** Modal sizes */
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/** Modal state */
export interface ModalState {
  isOpen: boolean;
  content?: ReactNode;
  title?: string;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  preventScroll?: boolean;
}

/** Modal props */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
}

// ============================================================================
// TOAST & NOTIFICATIONS
// ============================================================================

/** Toast types */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

/** Toast position */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/** Toast configuration */
export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: ToastAction;
  dismissible?: boolean;
  icon?: ReactNode;
}

/** Toast action button */
export interface ToastAction {
  label: string;
  onClick: () => void;
}

// ============================================================================
// NAVIGATION
// ============================================================================

/** Navigation item */
export interface NavigationItem {
  label: string;
  path: string;
  icon?: ComponentType<{ className?: string }>;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  children?: NavigationItem[];
  onClick?: () => void;
}

/** Breadcrumb item */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: ComponentType;
}

// ============================================================================
// TABLE & DATA DISPLAY
// ============================================================================

/** Table column definition */
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T, index: number) => ReactNode;
  headerRender?: () => ReactNode;
}

/** Table sort configuration */
export interface TableSort {
  key: string;
  direction: 'asc' | 'desc';
}

/** Table pagination */
export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
}

/** Table props */
export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  sortable?: boolean;
  sortConfig?: TableSort;
  onSort?: (sort: TableSort) => void;
  pagination?: TablePagination;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  emptyState?: ReactNode;
  className?: string;
}

// ============================================================================
// LOADING & ASYNC STATES
// ============================================================================

/** Loading state */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/** Async data state */
export interface AsyncState<T, E = Error> {
  data: T | null;
  error: E | null;
  loading: boolean;
  status: LoadingState;
}

/** Skeleton loader variant */
export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

// ============================================================================
// FILTER & SEARCH
// ============================================================================

/** Filter option */
export interface FilterOption<T = string> {
  label: string;
  value: T;
  count?: number;
  disabled?: boolean;
  icon?: ReactNode;
}

/** Active filter */
export interface ActiveFilter<T = string> {
  key: string;
  value: T;
  label: string;
  operator?: FilterOperator;
}

/** Filter operators */
export type FilterOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'lt'
  | 'between';

/** Search configuration */
export interface SearchConfig {
  placeholder?: string;
  debounce?: number;
  minCharacters?: number;
  showHistory?: boolean;
  maxHistory?: number;
}

// ============================================================================
// TOOLTIP & POPOVER
// ============================================================================

/** Tooltip placement */
export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'right';

/** Tooltip props */
export interface TooltipProps extends BaseComponentProps {
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  disabled?: boolean;
}

// ============================================================================
// CARD & CONTAINERS
// ============================================================================

/** Card variant */
export type CardVariant = 'elevated' | 'outlined' | 'filled';

/** Card props */
export interface CardProps extends ComponentWithChildren {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// ============================================================================
// BADGE & INDICATORS
// ============================================================================

/** Badge variant */
export type BadgeVariant = 'solid' | 'subtle' | 'outline';

/** Badge color scheme */
export type BadgeColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray';

/** Badge props */
export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

// ============================================================================
// MENU & DROPDOWN
// ============================================================================

/** Menu item */
export interface MenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  children?: MenuItem[];
}

// ============================================================================
// TABS
// ============================================================================

/** Tab item */
export interface TabItem {
  key: string;
  label: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

// ============================================================================
// RESPONSIVE & BREAKPOINTS
// ============================================================================

/** Breakpoint values */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Responsive value */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// ============================================================================
// VIRTUALIZATION
// ============================================================================

/** Virtual list item */
export interface VirtualListItem {
  index: number;
  height: number;
  offset: number;
}

/** Virtual scroll config */
export interface VirtualScrollConfig {
  itemHeight: number | ((index: number) => number);
  overscan?: number;
  scrollingDelay?: number;
  containerRef?: RefObject<HTMLElement>;
}
