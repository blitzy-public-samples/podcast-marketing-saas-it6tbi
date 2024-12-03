/**
 * @fileoverview Provides validation functions for ensuring data integrity and type safety across the web application.
 * 
 * Requirements addressed:
 * - Data Validation (8.3 API Design/8.3.2 Interface Specifications):
 *   Ensures that data structures conform to expected formats and types.
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Leverages TypeScript to enforce type safety in validation functions.
 */

import { CommonError } from '../types/common';
import { ApiResponse } from '../types/api';

/**
 * Validates that an object conforms to the ApiResponse interface.
 * 
 * @param response - The object to validate against the ApiResponse interface
 * @returns True if the response conforms to the ApiResponse interface, otherwise false
 */
export function validateApiResponse(response: any): response is ApiResponse<unknown> {
  // Check if response is an object and not null
  if (!response || typeof response !== 'object') {
    return false;
  }

  // Check if all required properties exist
  if (!('data' in response) || !('status' in response) || !('message' in response)) {
    return false;
  }

  // Validate property types
  if (
    typeof response.status !== 'number' ||
    typeof response.message !== 'string'
  ) {
    return false;
  }

  // Note: We don't validate the 'data' property type since it's generic
  // and could be of any type T. We just ensure it exists.

  return true;
}

/**
 * Validates that an object conforms to the CommonError interface.
 * 
 * @param error - The object to validate against the CommonError interface
 * @returns True if the error conforms to the CommonError interface, otherwise false
 */
export function validateCommonError(error: any): error is CommonError {
  // Check if error is an object and not null
  if (!error || typeof error !== 'object') {
    return false;
  }

  // Check if all required properties exist
  if (!('code' in error) || !('message' in error)) {
    return false;
  }

  // Validate property types
  if (
    typeof error.code !== 'string' ||
    typeof error.message !== 'string'
  ) {
    return false;
  }

  return true;
}