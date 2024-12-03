/**
 * @fileoverview Authentication-related TypeScript type definitions
 * 
 * Requirements addressed:
 * - User Management (1.3 Scope/Core Features and Functionalities/User Management):
 *   Provides type definitions for authentication-related data structures to support 
 *   role-based access control and team collaboration.
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Ensures type safety in authentication workflows by defining reusable types and interfaces.
 */

/**
 * Represents an authenticated user with their basic information and access token
 */
export interface AuthUser {
  /** Unique identifier for the user */
  id: string;
  
  /** User's email address used for authentication */
  email: string;
  
  /** Array of role identifiers assigned to the user for access control */
  roles: string[];
  
  /** JWT token or similar authentication token */
  token: string;
}

/**
 * Represents the response structure returned after successful authentication
 */
export interface AuthResponse {
  /** Authenticated user information */
  user: AuthUser;
  
  /** Short-lived JWT token for API access */
  accessToken: string;
  
  /** Long-lived token used to obtain new access tokens */
  refreshToken: string;
}

/**
 * Defines the required credentials for user login
 */
export interface LoginCredentials {
  /** User's email address */
  email: string;
  
  /** User's password (plain text - will be hashed during transmission) */
  password: string;
}

/**
 * Defines the required credentials for user registration
 */
export interface RegisterCredentials {
  /** User's email address */
  email: string;
  
  /** User's chosen password (plain text - will be hashed during transmission) */
  password: string;
  
  /** Password confirmation to ensure correct input */
  confirmPassword: string;
}

/**
 * Generic interface for standardized API responses
 * @template T - The type of data contained in the response
 */
export interface ApiResponse<T> {
  /** Response payload of type T */
  data: T;
  
  /** HTTP status code */
  status: number;
  
  /** Human-readable message describing the response */
  message: string;
}

/**
 * Standard error structure for consistent error handling
 */
export interface CommonError {
  /** Machine-readable error code for programmatic handling */
  code: string;
  
  /** Human-readable error message */
  message: string;
}