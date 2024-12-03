/**
 * @fileoverview API-related TypeScript type definitions for standardized API interactions
 * 
 * Requirements addressed:
 * - API Design (8.3 API Design/8.3.2 Interface Specifications):
 *   Defines structured types for API responses and requests to ensure consistent
 *   data structures across the application.
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Implements strongly-typed interfaces for API interactions to catch potential
 *   type-related issues during development.
 */

import { AuthUser } from './auth';

/**
 * Standard API response interface for consistent response handling
 * @template T - The type of data contained in the response
 */
export interface ApiResponse<T> {
  /** Response payload of type T */
  data: T;
  
  /** HTTP status code (e.g., 200, 201, 400, 401, etc.) */
  status: number;
  
  /** Human-readable message describing the response */
  message: string;
}

/**
 * Interface for paginated API responses to handle large datasets
 * @template T - The type of items in the paginated response
 */
export interface PaginatedResponse<T> {
  /** Array of items of type T */
  data: T[];
  
  /** Total number of items available across all pages */
  total: number;
  
  /** Current page number (1-based indexing) */
  page: number;
  
  /** Number of items per page */
  pageSize: number;
}

/**
 * Standard error response interface for consistent error handling
 */
export interface ApiError {
  /** Structured error information */
  error: {
    /** Machine-readable error code for programmatic handling */
    code: string;
    
    /** Human-readable error message */
    message: string;
  };
  
  /** HTTP status code for the error (e.g., 400, 401, 403, 404, 500) */
  statusCode: number;
}

// Type aliases for commonly used API response types
export type AuthUserResponse = ApiResponse<AuthUser>;
export type PaginatedAuthUserResponse = PaginatedResponse<AuthUser>;

// Type guard to check if a response is an API error
export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    'statusCode' in response &&
    typeof (response as ApiError).error.code === 'string' &&
    typeof (response as ApiError).error.message === 'string' &&
    typeof (response as ApiError).statusCode === 'number'
  );
}