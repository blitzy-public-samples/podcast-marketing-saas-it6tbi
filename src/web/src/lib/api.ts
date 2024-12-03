/**
 * Human Tasks:
 * 1. Verify error handling strategies align with backend team's approach
 * 2. Confirm API endpoint configurations with backend documentation
 * 3. Validate retry and timeout settings with infrastructure team
 * 4. Ensure proper error tracking and monitoring setup
 */

// axios v1.4.0 (via axiosInstance)
import axiosInstance from './axios';
import { ApiResponse, ApiError } from '../types/api';
import { login, register, logout, refreshToken } from './auth';

/**
 * Requirement: API Design (8.3 API Design/8.3.2 Interface Specifications)
 * Generic function to fetch data from the API with type safety
 * @template T - The expected type of the response data
 * @param endpoint - The API endpoint to fetch from
 * @param config - Optional Axios request configuration
 * @returns Promise resolving to the API response
 */
export const fetchData = async <T>(
  endpoint: string,
  config?: object
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<T>>(endpoint, {
      ...config,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Requirement: API Design (8.3 API Design/8.3.2 Interface Specifications)
 * Generic function to post data to the API with type safety
 * @template T - The expected type of the response data
 * @param endpoint - The API endpoint to post to
 * @param data - The data to send in the request body
 * @param config - Optional Axios request configuration
 * @returns Promise resolving to the API response
 */
export const postData = async <T>(
  endpoint: string,
  data: unknown,
  config?: object
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<T>>(endpoint, data, {
      ...config,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Requirement: Type Safety (9.1 Programming Languages/Frontend)
 * Handles API errors by mapping them to a consistent error structure
 * @param error - The error object from Axios
 * @returns A standardized API error object
 */
export const handleApiError = (error: unknown): ApiError => {
  // If the error is already in the correct format, return it
  if (
    error &&
    typeof error === 'object' &&
    'error' in error &&
    'statusCode' in error
  ) {
    return error as ApiError;
  }

  // Default error response
  const defaultError: ApiError = {
    error: {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
    },
    statusCode: 500,
  };

  // Handle Axios errors
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as any;
    if (axiosError.response) {
      return {
        error: {
          code: axiosError.response.data?.error?.code || 'API_ERROR',
          message:
            axiosError.response.data?.error?.message ||
            'An error occurred while processing your request',
        },
        statusCode: axiosError.response.status,
      };
    }

    // Handle network errors
    if (axiosError.request) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to connect to the server. Please check your connection.',
        },
        statusCode: 0,
      };
    }
  }

  return defaultError;
};

// Re-export auth functions for convenience
export { login, register, logout, refreshToken };