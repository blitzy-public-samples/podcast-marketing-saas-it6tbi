/**
 * Human Tasks:
 * 1. Verify error formatting patterns with the backend team for consistency
 * 2. Ensure deep clone performance is acceptable for large objects
 * 3. Test application name validation across all entry points
 */

// lodash v4.17.21
import { cloneDeep } from 'lodash';

// Internal imports with relative paths
import { CommonError } from '../types/common';
import { APP_NAME } from './constants';
import { validateAuthUser } from './validation';

/**
 * Formats an error object into a standardized structure.
 * 
 * Requirements addressed:
 * - Code Reusability (1.3 Scope/Core Features and Functionalities/User Management):
 *   Provides a reusable function for consistent error formatting across the application.
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Ensures type safety through TypeScript interfaces and type checking.
 * 
 * @param error - The error object to format
 * @returns A formatted error message string
 */
export function formatError(error: CommonError): string {
  const { code, message } = error;
  return `Error [${code}]: ${message}`;
}

/**
 * Checks if the provided application name matches the expected APP_NAME.
 * 
 * Requirements addressed:
 * - Code Reusability (1.3 Scope/Core Features and Functionalities/User Management):
 *   Provides a reusable function for application name validation.
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Ensures type safety through TypeScript parameter typing.
 * 
 * @param appName - The application name to validate
 * @returns True if the appName matches APP_NAME, otherwise false
 */
export function isAppNameValid(appName: string): boolean {
  return appName === APP_NAME;
}

/**
 * Creates a deep clone of the provided object.
 * 
 * Requirements addressed:
 * - Code Reusability (1.3 Scope/Core Features and Functionalities/User Management):
 *   Provides a reusable function for deep cloning objects.
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Ensures type safety through TypeScript generics.
 * 
 * @param object - The object to clone
 * @returns A deep clone of the input object
 */
export function deepClone<T>(object: T): T {
  return cloneDeep(object);
}