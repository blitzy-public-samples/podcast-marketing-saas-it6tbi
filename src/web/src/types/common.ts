/**
 * @fileoverview Common TypeScript type definitions used across the web application
 * 
 * Requirements addressed:
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Ensures type safety in shared data structures by defining reusable types and interfaces.
 */

import { ApiResponse as ImportedApiResponse } from './api';

/**
 * Standard error interface for consistent error handling across the application.
 * Used to maintain a uniform error structure throughout the frontend.
 */
export interface CommonError {
  /** Machine-readable error code for programmatic handling */
  code: string;
  
  /** Human-readable error message describing the error */
  message: string;
}

/**
 * Re-export the ApiResponse interface from the API types module to centralize
 * common type definitions and maintain consistency across the application.
 * 
 * @template T - The type of data contained in the response
 */
export interface ApiResponse<T> extends ImportedApiResponse<T> {
  /** Response payload of type T */
  data: T;
  
  /** HTTP status code (e.g., 200, 201, 400, 401, etc.) */
  status: number;
  
  /** Human-readable message describing the response */
  message: string;
}