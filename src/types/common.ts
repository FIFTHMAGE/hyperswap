/**
 * Common utility types used throughout the application
 * @module types/common
 */

/**
 * Makes all properties of T nullable
 */
export type Nullable<T> = T | null;

/**
 * Makes all properties of T optional and nullable
 */
export type Optional<T> = {
  [P in keyof T]?: T[P] | null;
};

/**
 * Makes specified properties K of T required
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * Makes specified properties K of T optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Deep partial - makes all nested properties optional
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Deep readonly - makes all nested properties readonly
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Unwrap Promise type
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Extract function return type
 */
export type ReturnTypeOf<T extends (...args: any) => any> = ReturnType<T>;

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort parameters
 */
export interface SortParams<T = string> {
  field: T;
  direction: SortDirection;
}

/**
 * Filter operator types
 */
export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

/**
 * Generic filter
 */
export interface Filter<T = any> {
  field: string;
  operator: FilterOperator;
  value: T;
}

/**
 * Time range
 */
export interface TimeRange {
  start: Date | number;
  end: Date | number;
}

/**
 * Coordinate for maps/charts
 */
export interface Coordinate {
  x: number;
  y: number;
}

/**
 * Dimensions
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Status types
 */
export type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Async state
 */
export interface AsyncState<T = any, E = Error> {
  data: Nullable<T>;
  error: Nullable<E>;
  status: Status;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Ensures a value is a specific type or throws
 */
export type Ensure<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Extract keys of T that are of type U
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Make specific keys readonly
 */
export type ReadonlyKeys<T, K extends keyof T> = Omit<T, K> &
  Readonly<Pick<T, K>>;

/**
 * Tuple to union type
 */
export type TupleToUnion<T extends readonly any[]> = T[number];

/**
 * Union to intersection type
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

/**
 * Prettify complex types for better IDE tooltips
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

