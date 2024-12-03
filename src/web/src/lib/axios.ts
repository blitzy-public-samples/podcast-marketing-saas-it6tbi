/**
 * Human Tasks:
 * 1. Verify the API base URL configuration in the environment variables
 * 2. Ensure CORS settings are properly configured on the backend
 * 3. Confirm error handling strategies with the backend team
 * 4. Validate authentication token storage mechanism with security team
 */

// axios v1.4.0
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../types/api';
import { APP_NAME } from './constants';

/**
 * Requirement: API Design (8.3 API Design/8.3.2 Interface Specifications)
 * Creates and configures an Axios instance with default settings and interceptors
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Name': APP_NAME,
      'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
    }
  });

  // Request interceptor for API calls
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get the auth token from localStorage
      const token = localStorage.getItem('auth_token');
      
      // Add authorization header if token exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add request ID for tracing
      config.headers['X-Request-ID'] = crypto.randomUUID();

      return config;
    },
    (error: AxiosError) => {
      // Log request errors for debugging
      console.error(`[${APP_NAME}] Request Error:`, error);
      return Promise.reject(error);
    }
  );

  /**
   * Requirement: Error Handling (8.3 API Design/8.3.4 API Security Controls)
   * Response interceptor for handling API responses and errors consistently
   */
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
      // Transform successful responses to match ApiResponse interface
      return {
        ...response,
        data: {
          data: response.data.data,
          status: response.status,
          message: response.data.message || 'Success'
        }
      };
    },
    (error: AxiosError<ApiError>) => {
      // Handle network errors
      if (!error.response) {
        return Promise.reject({
          error: {
            code: 'NETWORK_ERROR',
            message: 'Network error occurred. Please check your connection.'
          },
          statusCode: 0
        });
      }

      // Handle API errors
      const errorResponse: ApiError = {
        error: {
          code: error.response.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response.data?.error?.message || 'An unexpected error occurred.'
        },
        statusCode: error.response.status
      };

      // Handle specific HTTP status codes
      switch (error.response.status) {
        case 401:
          // Clear auth token and redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden access
          console.warn(`[${APP_NAME}] Access Forbidden:`, errorResponse);
          break;
        case 429:
          // Handle rate limiting
          console.warn(`[${APP_NAME}] Rate Limited:`, errorResponse);
          break;
        default:
          // Log other errors
          console.error(`[${APP_NAME}] API Error:`, errorResponse);
      }

      return Promise.reject(errorResponse);
    }
  );

  return instance;
};

// Create and export the configured Axios instance
const axiosInstance = createAxiosInstance();

export default axiosInstance;