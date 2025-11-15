/**
 * Utility type definitions and helpers
 */

// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Make all properties required recursively
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Make specific properties required
export type RequireProps<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Make specific properties optional
export type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Exclude null and undefined
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

// Extract function types
export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: Parameters<T[K]>) => ReturnType<T[K]> ? K : never;
}[keyof T];

// Extract non-function types
export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: Parameters<T[K]>) => ReturnType<T[K]> ? never : K;
}[keyof T];

// Merge two types
export type Merge<T, U> = Omit<T, keyof U> & U;

// Make properties readonly recursively
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Extract promise type
export type Awaited<T> = T extends Promise<infer U> ? U : T;

// Array element type
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Function return type async
export type AsyncReturnType<T extends (...args: Parameters<T>) => ReturnType<T>> = 
  ReturnType<T> extends Promise<infer U> ? U : ReturnType<T>;

// Value of object
export type ValueOf<T> = T[keyof T];

// Entries type
export type Entries<T> = [keyof T, ValueOf<T>][];

// Mutable type
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Pick by value type
export type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>;

// Omit by value type
export type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? never : Key }[keyof T]
>;

// Nullable type
export type Nullable<T> = T | null;

// Maybe type
export type Maybe<T> = T | null | undefined;

// Result type for operations
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Paginated result
export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

// Brand types for type safety
export type Brand<K, T> = K & { __brand: T };

